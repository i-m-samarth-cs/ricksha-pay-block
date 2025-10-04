import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapPin, Navigation, Clock, Star } from "lucide-react";

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

interface RideHistoryProps {
  rides: Ride[];
}

export const RideHistory = ({ rides }: RideHistoryProps) => {
  if (rides.length === 0) {
    return (
      <Card className="bg-card border-2 border-border p-6">
        <div className="text-center text-muted-foreground">
          <p>No ride history yet</p>
          <p className="text-sm mt-1">Your completed rides will appear here</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-2 border-border p-6">
      <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-primary" />
        Recent Rides
      </h3>
      
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-4">
          {rides.map((ride) => (
            <Card key={ride.id} className="bg-muted border border-border p-4 hover:border-primary transition-colors">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-success mt-1 flex-shrink-0" />
                      <div className="text-sm text-foreground">{ride.pickup}</div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Navigation className="w-4 h-4 text-destructive mt-1 flex-shrink-0" />
                      <div className="text-sm text-foreground">{ride.drop}</div>
                    </div>
                  </div>
                  
                  <Badge
                    variant={ride.status === "completed" ? "default" : "destructive"}
                    className="ml-2"
                  >
                    {ride.status}
                  </Badge>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{ride.distance} km</span>
                    <span>•</span>
                    <span>{new Date(ride.date).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {ride.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-primary text-primary" />
                        <span className="text-sm font-semibold text-foreground">{ride.rating}</span>
                      </div>
                    )}
                    <div className="text-lg font-bold text-primary">₹{ride.fare}</div>
                  </div>
                </div>

                {ride.txHash && (
                  <div className="pt-2 border-t border-border">
                    <a
                      href={`https://etherscan.io/tx/${ride.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline font-mono"
                    >
                      {ride.txHash.slice(0, 10)}...{ride.txHash.slice(-8)}
                    </a>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};
