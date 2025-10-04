import { useState } from "react";
import { MeterDisplay } from "@/components/MeterDisplay";
import { RideRequestForm } from "@/components/RideRequestForm";
import { WalletConnect } from "@/components/WalletConnect";
import { RideHistory } from "@/components/RideHistory";
import { TripStatus } from "@/components/TripStatus";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface Ride {
  id: string;
  date: string;
  pickup: string;
  drop: string;
  distance: number;
  fare: number;
  status: "completed" | "cancelled";
  rating?: number;
  txHash?: string;
}

interface CurrentTrip {
  pickup: string;
  drop: string;
  distance: number;
  fare: number;
  status: "requested" | "accepted" | "in-progress" | "completed";
}

const Index = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [currentTrip, setCurrentTrip] = useState<CurrentTrip | null>(null);
  const [rideHistory, setRideHistory] = useState<Ride[]>([
    {
      id: "1",
      date: new Date().toISOString(),
      pickup: "Connaught Place, New Delhi",
      drop: "India Gate, New Delhi",
      distance: 5.2,
      fare: 103,
      status: "completed",
      rating: 5,
      txHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleWalletConnected = (address: string) => {
    setWalletAddress(address);
  };

  const handleRequestRide = async (pickup: string, drop: string, distance: number) => {
    if (!walletAddress) {
      toast.error("Wallet Not Connected", {
        description: "Please connect your wallet first",
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate smart contract interaction
    try {
      const baseFare = 25;
      const perKmRate = 15;
      const totalFare = baseFare + distance * perKmRate;

      toast.loading("Processing ride request...");
      
      // Simulate blockchain transaction
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const newTrip: CurrentTrip = {
        pickup,
        drop,
        distance,
        fare: totalFare,
        status: "requested",
      };
      
      setCurrentTrip(newTrip);
      
      toast.success("Ride Requested Successfully!", {
        description: `Fare locked: ₹${totalFare}`,
      });

      // Simulate driver acceptance
      setTimeout(() => {
        setCurrentTrip((prev) => prev ? { ...prev, status: "accepted" } : null);
        toast.success("Driver Accepted!", {
          description: "Your driver is on the way",
        });
        
        // Start trip
        setTimeout(() => {
          setCurrentTrip((prev) => prev ? { ...prev, status: "in-progress" } : null);
          toast.success("Trip Started", {
            description: "Have a safe journey!",
          });
        }, 2000);
      }, 3000);
    } catch (error) {
      toast.error("Request Failed", {
        description: "Failed to process ride request",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCompleteTrip = async () => {
    if (!currentTrip) return;

    setIsProcessing(true);
    
    try {
      toast.loading("Processing payment...");
      
      // Simulate payment release
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setCurrentTrip({ ...currentTrip, status: "completed" });
      
      toast.success("Payment Released!", {
        description: "Trip completed successfully",
      });

      // Add to history after rating
      setTimeout(() => {
        const completedRide: Ride = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          pickup: currentTrip.pickup,
          drop: currentTrip.drop,
          distance: currentTrip.distance,
          fare: currentTrip.fare,
          status: "completed",
          txHash: `0x${Math.random().toString(16).slice(2)}`,
        };
        
        setRideHistory((prev) => [completedRide, ...prev]);
        
        setTimeout(() => {
          setCurrentTrip(null);
        }, 5000);
      }, 3000);
    } catch (error) {
      toast.error("Payment Failed", {
        description: "Failed to release payment",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRate = (rating: number) => {
    if (currentTrip) {
      const updatedHistory = [...rideHistory];
      if (updatedHistory.length > 0) {
        updatedHistory[0] = { ...updatedHistory[0], rating };
        setRideHistory(updatedHistory);
      }
    }
  };

  const currentFare = currentTrip?.fare || 0;
  const currentDistance = currentTrip?.distance || 0;
  const meterStatus = currentTrip 
    ? currentTrip.status === "in-progress" 
      ? "in-progress" 
      : "hired"
    : "vacant";

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Header */}
      <header className="border-b-4 border-primary bg-card shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-primary tracking-tight">
                Auto<span className="text-foreground">Ride</span>
              </h1>
              <p className="text-sm text-muted-foreground mt-1">Decentralized Rickshaw Payments</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-success rounded-full animate-glow-pulse" />
                <span>Blockchain Active</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Meter & Status */}
          <div className="space-y-6 animate-fade-in">
            <MeterDisplay
              fare={currentFare}
              distance={currentDistance}
              isActive={currentTrip?.status === "in-progress"}
              status={meterStatus}
            />
            
            {currentTrip && (
              <TripStatus
                pickup={currentTrip.pickup}
                drop={currentTrip.drop}
                distance={currentTrip.distance}
                fare={currentTrip.fare}
                status={currentTrip.status}
                onComplete={handleCompleteTrip}
                onRate={handleRate}
              />
            )}
          </div>

          {/* Right Column - Tabs */}
          <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <Tabs defaultValue="ride" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 bg-card border-2 border-border">
                <TabsTrigger value="ride" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Book Ride
                </TabsTrigger>
                <TabsTrigger value="history" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  History
                </TabsTrigger>
              </TabsList>

              <TabsContent value="ride" className="space-y-6">
                <WalletConnect onWalletConnected={handleWalletConnected} />
                
                {walletAddress && !currentTrip && (
                  <RideRequestForm
                    onRequestRide={handleRequestRide}
                    isLoading={isProcessing}
                  />
                )}
              </TabsContent>

              <TabsContent value="history">
                <RideHistory rides={rideHistory} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-border bg-card mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© 2025 AutoRide DApp. Built on Ethereum.</p>
            <div className="flex items-center gap-4">
              <span>Base Fare: ₹25</span>
              <span>•</span>
              <span>Rate: ₹15/km</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
