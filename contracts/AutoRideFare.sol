// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title AutoRideFare
 * @dev Decentralized auto-rickshaw fare payment system with escrow
 */
contract AutoRideFare {
    // State variables
    address public owner;
    uint256 public baseFare = 25; // Base fare in tokens
    uint256 public perKmRate = 15; // Per kilometer rate
    uint256 public waitingChargePerMinute = 2; // After 5 minutes
    uint256 public rideCounter = 0;

    // Structs
    struct Ride {
        uint256 rideId;
        address passenger;
        address driver;
        string pickupLocation;
        string dropLocation;
        uint256 distance; // in meters
        uint256 fare;
        uint256 timestamp;
        RideStatus status;
        uint8 rating;
        bool exists;
    }

    enum RideStatus {
        Requested,
        Accepted,
        InProgress,
        Completed,
        Cancelled
    }

    // Mappings
    mapping(uint256 => Ride) public rides;
    mapping(address => uint256[]) public passengerRides;
    mapping(address => uint256[]) public driverRides;
    mapping(uint256 => uint256) public escrowBalance;

    // Events
    event RideRequested(uint256 indexed rideId, address indexed passenger, uint256 fare);
    event RideAccepted(uint256 indexed rideId, address indexed driver);
    event RideStarted(uint256 indexed rideId);
    event RideCompleted(uint256 indexed rideId, uint256 fare);
    event PaymentReleased(uint256 indexed rideId, address indexed driver, uint256 amount);
    event RideRated(uint256 indexed rideId, uint8 rating);
    event FareRatesUpdated(uint256 baseFare, uint256 perKmRate);

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier rideExists(uint256 _rideId) {
        require(rides[_rideId].exists, "Ride does not exist");
        _;
    }

    modifier onlyPassenger(uint256 _rideId) {
        require(rides[_rideId].passenger == msg.sender, "Only passenger can call this");
        _;
    }

    modifier onlyDriver(uint256 _rideId) {
        require(rides[_rideId].driver == msg.sender, "Only driver can call this");
        _;
    }

    // Constructor
    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Calculate fare based on distance
     * @param _distanceInKm Distance in kilometers
     * @return Total fare
     */
    function calculateFare(uint256 _distanceInKm) public view returns (uint256) {
        return baseFare + (_distanceInKm * perKmRate);
    }

    /**
     * @dev Request a new ride
     * @param _pickup Pickup location
     * @param _drop Drop location
     * @param _distanceInKm Estimated distance in km
     */
    function requestRide(
        string memory _pickup,
        string memory _drop,
        uint256 _distanceInKm
    ) external payable returns (uint256) {
        uint256 fare = calculateFare(_distanceInKm);
        require(msg.value >= fare, "Insufficient payment for fare");

        rideCounter++;
        uint256 rideId = rideCounter;

        rides[rideId] = Ride({
            rideId: rideId,
            passenger: msg.sender,
            driver: address(0),
            pickupLocation: _pickup,
            dropLocation: _drop,
            distance: _distanceInKm,
            fare: fare,
            timestamp: block.timestamp,
            status: RideStatus.Requested,
            rating: 0,
            exists: true
        });

        escrowBalance[rideId] = fare;
        passengerRides[msg.sender].push(rideId);

        // Refund excess payment
        if (msg.value > fare) {
            payable(msg.sender).transfer(msg.value - fare);
        }

        emit RideRequested(rideId, msg.sender, fare);
        return rideId;
    }

    /**
     * @dev Driver accepts a ride
     * @param _rideId Ride ID to accept
     */
    function acceptRide(uint256 _rideId) external rideExists(_rideId) {
        Ride storage ride = rides[_rideId];
        require(ride.status == RideStatus.Requested, "Ride not available");
        require(ride.driver == address(0), "Ride already accepted");

        ride.driver = msg.sender;
        ride.status = RideStatus.Accepted;
        driverRides[msg.sender].push(_rideId);

        emit RideAccepted(_rideId, msg.sender);
    }

    /**
     * @dev Start the ride
     * @param _rideId Ride ID to start
     */
    function startRide(uint256 _rideId) external rideExists(_rideId) onlyDriver(_rideId) {
        Ride storage ride = rides[_rideId];
        require(ride.status == RideStatus.Accepted, "Cannot start ride");

        ride.status = RideStatus.InProgress;
        emit RideStarted(_rideId);
    }

    /**
     * @dev Complete the ride and release payment
     * @param _rideId Ride ID to complete
     */
    function completeRide(uint256 _rideId) external rideExists(_rideId) onlyDriver(_rideId) {
        Ride storage ride = rides[_rideId];
        require(ride.status == RideStatus.InProgress, "Ride not in progress");

        ride.status = RideStatus.Completed;
        emit RideCompleted(_rideId, ride.fare);

        // Release payment to driver
        processPayment(_rideId);
    }

    /**
     * @dev Process payment from escrow to driver
     * @param _rideId Ride ID
     */
    function processPayment(uint256 _rideId) internal rideExists(_rideId) {
        Ride storage ride = rides[_rideId];
        require(ride.status == RideStatus.Completed, "Ride not completed");
        
        uint256 amount = escrowBalance[_rideId];
        require(amount > 0, "No escrow balance");

        escrowBalance[_rideId] = 0;
        payable(ride.driver).transfer(amount);

        emit PaymentReleased(_rideId, ride.driver, amount);
    }

    /**
     * @dev Passenger rates the ride
     * @param _rideId Ride ID
     * @param _rating Rating (1-5)
     */
    function rateRide(uint256 _rideId, uint8 _rating) 
        external 
        rideExists(_rideId) 
        onlyPassenger(_rideId) 
    {
        require(_rating >= 1 && _rating <= 5, "Rating must be between 1 and 5");
        Ride storage ride = rides[_rideId];
        require(ride.status == RideStatus.Completed, "Ride not completed");

        ride.rating = _rating;
        emit RideRated(_rideId, _rating);
    }

    /**
     * @dev Update fare rates (owner only)
     * @param _baseFare New base fare
     * @param _perKmRate New per km rate
     */
    function updateFareRates(uint256 _baseFare, uint256 _perKmRate) external onlyOwner {
        baseFare = _baseFare;
        perKmRate = _perKmRate;
        emit FareRatesUpdated(_baseFare, _perKmRate);
    }

    /**
     * @dev Get ride details
     * @param _rideId Ride ID
     */
    function getRideDetails(uint256 _rideId) 
        external 
        view 
        rideExists(_rideId) 
        returns (Ride memory) 
    {
        return rides[_rideId];
    }

    /**
     * @dev Get passenger's ride history
     * @param _passenger Passenger address
     */
    function getPassengerRides(address _passenger) external view returns (uint256[] memory) {
        return passengerRides[_passenger];
    }

    /**
     * @dev Get driver's ride history
     * @param _driver Driver address
     */
    function getDriverRides(address _driver) external view returns (uint256[] memory) {
        return driverRides[_driver];
    }

    // Fallback function
    receive() external payable {
        revert("Direct payments not accepted");
    }
}
