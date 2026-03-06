import { useState, useEffect } from "react";
import { Users } from "lucide-react";

const LiveCounter = () => {
  const [count, setCount] = useState(2847);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => prev + Math.floor(Math.random() * 3) + 1);
    }, 3000 + Math.random() * 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
      </span>
      <Users className="h-4 w-4" />
      <span className="font-semibold tabular-nums">{count.toLocaleString()}</span>
      <span className="hidden sm:inline">creators joined</span>
    </div>
  );
};

export default LiveCounter;
