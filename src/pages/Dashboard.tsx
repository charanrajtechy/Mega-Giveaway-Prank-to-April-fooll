import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Gift, Clock, Trophy, Share2, PartyPopper, CheckCircle } from "lucide-react";
import confetti from "canvas-confetti";
import { toast } from "sonner";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const getAprilFirst = (): Date => {
  const now = new Date();
  let year = now.getFullYear();
  const april1 = new Date(year, 3, 1, 0, 0, 0, 0); // April 1st midnight local
  if (now >= april1) {
    // If we're past April 1st, check if same day
    const april2 = new Date(year, 3, 2, 0, 0, 0, 0);
    if (now < april2) return april1; // Still April 1st
    year++;
  }
  return new Date(year, 3, 1, 0, 0, 0, 0);
};

const isAprilFool = (): boolean => {
  const now = new Date();
  return now >= getAprilFirst() && now.getMonth() === 3 && now.getDate() === 1;
};

const getTimeLeft = (): TimeLeft => {
  const target = getAprilFirst();
  const now = new Date();
  const diff = Math.max(0, target.getTime() - now.getTime());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
};

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const name = searchParams.get("name") || "Participant";
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft());
  const [revealed, setRevealed] = useState(isAprilFool());
  const [confettiFired, setConfettiFired] = useState(false);

  const fireConfetti = useCallback(() => {
    if (confettiFired) return;
    setConfettiFired(true);
    const duration = 4000;
    const end = Date.now() + duration;
    const frame = () => {
      confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors: ["#7c3aed", "#3b82f6", "#06b6d4", "#f59e0b"] });
      confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors: ["#7c3aed", "#3b82f6", "#06b6d4", "#f59e0b"] });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, [confettiFired]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (isAprilFool()) {
        setRevealed(true);
        clearInterval(timer);
      } else {
        setTimeLeft(getTimeLeft());
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (revealed) fireConfetti();
  }, [revealed, fireConfetti]);

  const handleShare = () => {
    const url = window.location.origin;
    navigator.clipboard.writeText(url);
    toast.success("Link copied! Share the prank with friends 😄");
  };

  if (revealed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center max-w-lg animate-scale-in">
          <div className="text-8xl md:text-9xl mb-6">😄</div>
          <h1 className="text-5xl md:text-7xl font-black gradient-text mb-6">APRIL FOOL!</h1>
          <p className="text-xl text-muted-foreground mb-2">Hey <span className="text-foreground font-semibold">{name}</span>,</p>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            There is no giveaway. <span className="font-semibold text-foreground">Got you!</span> 🎉
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleShare}
              className="inline-flex items-center justify-center gap-2 gradient-hero-bg text-primary-foreground px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity glow-effect"
            >
              <Share2 className="h-5 w-5" /> Share This Prank
            </button>
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-xl font-bold hover:bg-secondary/80 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const progress = Math.max(0, 100 - (timeLeft.days / 30) * 100);

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="glass-card border-b border-border/50 rounded-none">
        <div className="container mx-auto flex items-center justify-between h-16 px-6">
          <div className="flex items-center gap-2">
            <Gift className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">MegaGive</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle className="h-4 w-4 text-accent" />
            <span>Registered</span>
          </div>
        </div>
      </nav>

      <div className="container mx-auto max-w-3xl px-6 py-12 md:py-20 space-y-8">
        {/* Welcome */}
        <div className="text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-6 text-sm font-medium text-muted-foreground">
            <PartyPopper className="h-4 w-4 text-primary" />
            <span>You're in!</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-3">
            Congratulations, <span className="gradient-text">{name}</span>!
          </h1>
          <p className="text-muted-foreground text-lg">You are officially participating in the 2026 Mega Giveaway.</p>
        </div>

        {/* Countdown */}
        <div className="glass-card-elevated p-8 md:p-10 text-center" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center justify-center gap-2 mb-6">
            <Clock className="h-5 w-5 text-primary" />
            <h2 className="font-bold text-lg">Winner Announcement In</h2>
          </div>
          <div className="grid grid-cols-4 gap-3 md:gap-6 mb-8">
            {[
              { value: timeLeft.days, label: "Days" },
              { value: timeLeft.hours, label: "Hours" },
              { value: timeLeft.minutes, label: "Minutes" },
              { value: timeLeft.seconds, label: "Seconds" },
            ].map((item) => (
              <div key={item.label} className="glass-card p-4 md:p-6">
                <div className="countdown-digit">{String(item.value).padStart(2, "0")}</div>
                <div className="countdown-label">{item.label}</div>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full gradient-hero-bg rounded-full transition-all duration-1000"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="glass-card-elevated p-6 flex items-center gap-4" style={{ animationDelay: "0.2s" }}>
          <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center shrink-0">
            <Trophy className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold">Winner Announcement</h3>
            <p className="text-sm text-muted-foreground">Pending — Results on April 1st, 2026</p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">Pending</span>
        </div>

        {/* Share */}
        <div className="text-center pt-4">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Share2 className="h-4 w-4" /> Share with friends to increase your chances
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
