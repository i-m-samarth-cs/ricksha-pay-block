import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Navigation } from "lucide-react";

interface RideRequestFormProps {
  onRequestRide: (pickup: string, drop: string, distance: number) => void;
  isLoading: boolean;
}

export const RideRequestForm = ({ onRequestRide, isLoading }: RideRequestFormProps) => {
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [distance, setDistance] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pickup && drop && distance) {
      onRequestRide(pickup, drop, parseFloat(distance));
    }
  };

  const calculateEstimatedFare = () => {
    const dist = parseFloat(distance) || 0;
    return (25 + dist * 15).toFixed(2);
  };

  return (
    <Card className="bg-card border-2 border-border shadow-card p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="pickup" className="text-foreground flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            Pickup Location
          </Label>
          <Input
            id="pickup"
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            placeholder="Enter pickup address"
            className="bg-input border-border text-foreground"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="drop" className="text-foreground flex items-center gap-2">
            <Navigation className="w-4 h-4 text-destructive" />
            Drop Location
          </Label>
          <Input
            id="drop"
            value={drop}
            onChange={(e) => setDrop(e.target.value)}
            placeholder="Enter drop address"
            className="bg-input border-border text-foreground"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="distance" className="text-foreground">
            Distance (km)
          </Label>
          <Input
            id="distance"
            type="number"
            step="0.1"
            min="0"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            placeholder="Enter estimated distance"
            className="bg-input border-border text-foreground"
            required
          />
        </div>

        {distance && (
          <div className="bg-muted rounded-lg p-4 border border-border">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Estimated Fare:</span>
              <span className="text-2xl font-bold text-primary">₹{calculateEstimatedFare()}</span>
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              Base: ₹25 + Distance: ₹{(parseFloat(distance) * 15).toFixed(2)}
            </div>
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading || !pickup || !drop || !distance}
          className="w-full bg-gradient-meter hover:opacity-90 text-primary-foreground font-bold text-lg h-14 shadow-lg transition-all duration-300"
        >
          {isLoading ? "Processing..." : "Request Ride"}
        </Button>
      </form>
    </Card>
  );
};
