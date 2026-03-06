import { useState, useEffect } from "react";

const SpotsRemaining = () => {
  const [spots, setSpots] = useState(100394);

  useEffect(() => {
    const interval = setInterval(() => {
      setSpots((prev) => Math.max(0, prev - Math.floor(Math.random() * 3) - 1));
    }, 4000 + Math.random() * 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <p className="text-xs text-muted-foreground mt-3 flex items-center justify-center gap-1.5">
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
      Only <span className="font-bold text-foreground tabular-nums">{spots.toLocaleString()}</span> spots remaining
    </p>
  );
};

export default SpotsRemaining;
