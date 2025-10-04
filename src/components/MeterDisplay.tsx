import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

interface MeterDisplayProps {
  fare: number;
  distance: number;
  isActive: boolean;
  status: "vacant" | "hired" | "in-progress" | "completed";
}

export const MeterDisplay = ({ fare, distance, isActive, status }: MeterDisplayProps) => {
  const [displayFare, setDisplayFare] = useState(0);

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setDisplayFare((prev) => {
          if (prev < fare) {
            return Math.min(prev + 1, fare);
          }
          return prev;
        });
      }, 50);
      return () => clearInterval(interval);
    } else {
      setDisplayFare(fare);
    }
  }, [fare, isActive]);

  const needleRotation = Math.min((displayFare / 500) * 180 - 90, 90);

  const statusConfig = {
    vacant: { text: "VACANT", color: "text-success" },
    hired: { text: "HIRED", color: "text-primary" },
    "in-progress": { text: "IN PROGRESS", color: "text-primary animate-meter-tick" },
    completed: { text: "COMPLETED", color: "text-success" },
  };

  return (
    <Card className="relative overflow-hidden bg-card border-2 border-primary shadow-meter p-8">
      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-gradient-glow opacity-30 pointer-events-none" />
      
      {/* Status Indicator */}
      <div className="absolute top-4 right-4 z-20">
        <div className={`px-4 py-2 rounded-lg bg-secondary border border-border ${statusConfig[status].color} font-bold text-sm tracking-wider shadow-lg`}>
          {statusConfig[status].text}
        </div>
      </div>

      {/* Meter Frame */}
      <div className="relative z-10 space-y-6">
        {/* Analog Meter */}
        <div className="relative w-full h-48 bg-meter-bg rounded-xl border-4 border-primary flex items-end justify-center overflow-hidden">
          {/* Meter Scale */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 200 100">
              {/* Scale Lines */}
              {[...Array(11)].map((_, i) => {
                const angle = -90 + (i * 18);
                const isMain = i % 2 === 0;
                return (
                  <line
                    key={i}
                    x1="100"
                    y1="20"
                    x2="100"
                    y2={isMain ? "30" : "25"}
                    stroke="hsl(var(--primary))"
                    strokeWidth={isMain ? "2" : "1"}
                    transform={`rotate(${angle} 100 100)`}
                    opacity="0.6"
                  />
                );
              })}
              
              {/* Needle */}
              <g transform={`rotate(${needleRotation} 100 100)`}>
                <line
                  x1="100"
                  y1="100"
                  x2="100"
                  y2="35"
                  stroke="hsl(var(--meter-needle))"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <circle cx="100" cy="100" r="6" fill="hsl(var(--meter-needle))" />
              </g>
            </svg>
          </div>

          {/* Glow Effect */}
          {isActive && (
            <div className="absolute inset-0 bg-primary opacity-10 animate-glow-pulse" />
          )}
        </div>

        {/* Digital Display */}
        <div className="bg-gradient-meter rounded-lg p-6 shadow-lg">
          <div className="text-center space-y-2">
            <div className="text-sm font-medium text-primary-foreground opacity-80 tracking-widest">
              TOTAL FARE
            </div>
            <div className="text-6xl font-bold text-primary-foreground tracking-tight font-mono">
              ₹{displayFare.toFixed(2)}
            </div>
            <div className="flex justify-center gap-6 text-sm text-primary-foreground opacity-90">
              <div className="flex flex-col">
                <span className="opacity-70">Distance</span>
                <span className="font-semibold">{distance.toFixed(1)} km</span>
              </div>
              <div className="w-px bg-primary-foreground opacity-30" />
              <div className="flex flex-col">
                <span className="opacity-70">Rate</span>
                <span className="font-semibold">₹15/km</span>
              </div>
            </div>
          </div>
        </div>

        {/* Rickshaw Icon Decoration */}
        <div className="absolute -right-4 -bottom-4 opacity-10 pointer-events-none">
          <svg width="120" height="120" viewBox="0 0 24 24" fill="hsl(var(--primary))">
            <path d="M12 2c-4 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h2.23l2-2H14l2 2h2v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-4-4-8-4zM7.5 17c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm3.5-7H6V6h5v4zm5.5 7c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-7h-5V6h5v4z"/>
          </svg>
        </div>
      </div>
    </Card>
  );
};
