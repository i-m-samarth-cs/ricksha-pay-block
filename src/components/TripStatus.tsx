import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Navigation, Star } from "lucide-react";
import { useState } from "react";

interface TripStatusProps {
  pickup: string;
  drop: string;
  distance: number;
  fare: number;
  status: "requested" | "accepted" | "in-progress" | "completed";
  onComplete?: () => void;
  onRate?: (rating: number) => void;
}

export const TripStatus = ({ pickup, drop, distance, fare, status, onComplete, onRate }: TripStatusProps) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  const statusConfig = {
    requested: { label: "Ride Requested", progress: 25, color: "bg-primary" },
    accepted: { label: "Driver Accepted", progress: 50, color: "bg-primary" },
    "in-progress": { label: "Trip In Progress", progress: 75, color: "bg-primary" },
    completed: { label: "Trip Completed", progress: 100, color: "bg-success" },
  };

  const handleRatingClick = (value: number) => {
    setRating(value);
    onRate?.(value);
  };

  return (
    <Card className="bg-card border-2 border-border shadow-card p-6 animate-slide-up">
      <div className="space-y-6">
        {/* Status Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Current Trip
          </h3>
          <Badge className="bg-primary text-primary-foreground">
            {statusConfig[status].label}
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={statusConfig[status].progress} className="h-3" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Requested</span>
            <span>Accepted</span>
            <span>In Progress</span>
            <span>Completed</span>
          </div>
        </div>

        {/* Trip Details */}
        <div className="space-y-3 bg-muted rounded-lg p-4 border border-border">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-success mt-1 flex-shrink-0" />
            <div>
              <div className="text-xs text-muted-foreground">Pickup</div>
              <div className="text-sm font-medium text-foreground">{pickup}</div>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <Navigation className="w-4 h-4 text-destructive mt-1 flex-shrink-0" />
            <div>
              <div className="text-xs text-muted-foreground">Drop</div>
              <div className="text-sm font-medium text-foreground">{drop}</div>
            </div>
          </div>

          <div className="flex justify-between pt-2 border-t border-border">
            <div>
              <div className="text-xs text-muted-foreground">Distance</div>
              <div className="text-sm font-semibold text-foreground">{distance} km</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Total Fare</div>
              <div className="text-lg font-bold text-primary">₹{fare}</div>
            </div>
          </div>
        </div>

        {/* Rating Section (shown after completion) */}
        {status === "completed" && (
          <div className="space-y-3 bg-gradient-meter rounded-lg p-4">
            <div className="text-sm font-medium text-primary-foreground text-center">
              Rate Your Experience
            </div>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() => handleRatingClick(value)}
                  onMouseEnter={() => setHoveredRating(value)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      value <= (hoveredRating || rating)
                        ? "fill-primary-foreground text-primary-foreground"
                        : "text-primary-foreground/30"
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <div className="text-center text-sm text-primary-foreground">
                Thank you for your feedback!
              </div>
            )}
          </div>
        )}

        {/* Action Button */}
        {status === "in-progress" && (
          <Button
            onClick={onComplete}
            className="w-full bg-success hover:bg-success/90 text-success-foreground font-bold h-12"
          >
            Complete Trip & Release Payment
          </Button>
        )}
      </div>
    </Card>
  );
};
