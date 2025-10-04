
const hre = require('hardhat');

const address = '0x4bD267CdaCfB8e58280A68a2A4cDe2F968d2BcD2'; // Replace with your MetaMask address

async function main() {

    const contract = await hre.ethers.getContractAt(

        'AutoRideFare',

        '0x0CB2585fb28a5729801F37CF20D11a88C48da07F'

    );

    

    console.log('Checking rides for:', address);

    const rideIds = await contract.getPassengerRides(address);

    console.log('Ride IDs:', rideIds.map(id => id.toString()));

    

    for (const id of rideIds) {

        const ride = await contract.getRideDetails(id);

        console.log('\nRide', id.toString() + ':');

        console.log('  From:', ride.pickupLocation);

        console.log('  To:', ride.dropLocation);

        console.log('  Distance:', ride.distance.toString(), 'km');

        console.log('  Fare:', hre.ethers.formatEther(ride.fare), 'ETH');

    }

}

main().catch(console.error);

