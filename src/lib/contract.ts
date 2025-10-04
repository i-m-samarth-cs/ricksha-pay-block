import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../constants/contractConfig';

export async function requestRide(
  pickup: string,
  drop: string,
  distanceInKm: number
) {
  if (!window.ethereum) throw new Error("MetaMask not installed");

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

  // Calculate fare
  const fare = await contract.calculateFare(distanceInKm);
  console.log("Fare in wei:", fare.toString());

  // Convert to ETH for display (wei to ETH)
  const fareInEth = ethers.formatEther(fare);
  console.log("Fare in ETH:", fareInEth);

  // Send transaction with ETH value
  const tx = await contract.requestRide(pickup, drop, distanceInKm, {
    value: fare // Send the fare amount as payment
  });

  console.log("Transaction sent:", tx.hash);
  console.log("View on Etherscan:", `https://sepolia.etherscan.io/tx/${tx.hash}`);

  // Wait for confirmation
  const receipt = await tx.wait();
  console.log("Transaction confirmed in block:", receipt.blockNumber);

  // Get the ride ID from events
  const event = receipt.logs.find((log: any) => {
    try {
      const parsed = contract.interface.parseLog(log);
      return parsed?.name === 'RideRequested';
    } catch {
      return false;
    }
  });

  if (event) {
    const parsed = contract.interface.parseLog(event);
    const rideId = parsed?.args?.rideId;
    console.log("Ride ID:", rideId.toString());
    return { txHash: tx.hash, rideId: rideId.toString() };
  }

  return { txHash: tx.hash, rideId: null };
}

export async function getRideHistory(userAddress: string) {
  if (!window.ethereum) throw new Error("MetaMask not installed");

  const provider = new ethers.BrowserProvider(window.ethereum);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

  // Get passenger rides
  const rideIds = await contract.getPassengerRides(userAddress);
  console.log("User ride IDs:", rideIds);

  // Fetch details for each ride
  const rides = await Promise.all(
    rideIds.map(async (id: bigint) => {
      const ride = await contract.getRideDetails(id);
      return {
        rideId: id.toString(),
        pickup: ride.pickupLocation,
        drop: ride.dropLocation,
        distance: ride.distance.toString(),
        fare: ethers.formatEther(ride.fare), // Convert wei to ETH
        status: ['Requested', 'Accepted', 'InProgress', 'Completed', 'Cancelled'][ride.status],
        timestamp: new Date(Number(ride.timestamp) * 1000).toLocaleString(),
        rating: ride.rating,
        driver: ride.driver
      };
    })
  );

  return rides;
}

export async function completeRide(rideId: number) {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

  const tx = await contract.completeRide(rideId);
  console.log("Transaction:", tx.hash);
  await tx.wait();
  return tx.hash;
}

export async function rateRide(rideId: number, rating: number) {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

  const tx = await contract.rateRide(rideId, rating);
  await tx.wait();
  return tx.hash;
}