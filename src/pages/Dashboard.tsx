import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Gift, Clock, Trophy, Share2, PartyPopper, CheckCircle, Copy, Users } from "lucide-react";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface Referral {
  name: string;
  created_at: string;
}

const getAprilFirst = (): Date => {
  const now = new Date();
  let year = now.getFullYear();
  const april1 = new Date(year, 3, 1, 0, 0, 0, 0);
  if (now >= april1) {
    const april2 = new Date(year, 3, 2, 0, 0, 0, 0);
    if (now < april2) return april1;
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
  const code = searchParams.get("code") || "";
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft());
  const [revealed, setRevealed] = useState(isAprilFool());
  const [confettiFired, setConfettiFired] = useState(false);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [referralCount, setReferralCount] = useState(0);

  const referralLink = `https://megagiveaway.lovable.app?ref=${code}`;

  // Fetch referral data
  useEffect(() => {
    if (!code) return;
    const fetchReferrals = async () => {
      const { data, error } = await supabase
        .from("participants")
        .select("name, created_at")
        .eq("referred_by", code)
        .order("created_at", { ascending: false });
      if (!error && data) {
        setReferrals(data);
        setReferralCount(data.length);
      }
    };
    fetchReferrals();
    // Poll every 15s for new referrals
    const interval = setInterval(fetchReferrals, 15000);
    return () => clearInterval(interval);
  }, [code]);

  const fireConfetti = useCallback(() => {
    if (confettiFired) return;
    setConfettiFired(true);
    const duration = 6000;
    const end = Date.now() + duration;
    const frame = () => {
      confetti({ particleCount: 5, angle: 60, spread: 70, origin: { x: 0 }, colors: ["#7c3aed", "#3b82f6", "#06b6d4", "#f59e0b", "#ef4444"] });
      confetti({ particleCount: 5, angle: 120, spread: 70, origin: { x: 1 }, colors: ["#7c3aed", "#3b82f6", "#06b6d4", "#f59e0b", "#ef4444"] });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
    setTimeout(() => {
      confetti({ particleCount: 150, spread: 180, origin: { y: 0.6 }, colors: ["#7c3aed", "#3b82f6", "#06b6d4", "#f59e0b", "#ef4444"] });
    }, 500);
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
    if (revealed) {
      document.documentElement.classList.add("dark");
      fireConfetti();
    }
  }, [revealed, fireConfetti]);

  const handleSharePrank = () => {
    navigator.clipboard.writeText(window.location.origin);
    toast.success("Prank link copied! Send it to your next victim 😈");
  };

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success("Referral link copied!");
  };

  const getWinMultiplier = () => {
    if (referralCount >= 10) return "5x";
    if (referralCount >= 5) return "3x";
    if (referralCount >= 2) return "2x";
    return "1x";
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  // FULL SCREEN APRIL FOOL REVEAL
  if (revealed) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center p-6 z-[9999] overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[120px] animate-float" style={{ animationDelay: "2s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-destructive/10 rounded-full blur-[150px] animate-pulse-glow" />
        </div>
        <div className="text-center max-w-2xl relative animate-scale-in">
          <div className="text-[120px] md:text-[180px] leading-none mb-4 animate-bounce">😄</div>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black gradient-text mb-4 tracking-tight">APRIL FOOL!</h1>
          <div className="space-y-3 mb-10">
            <p className="text-xl md:text-2xl text-muted-foreground">Hey <span className="text-foreground font-bold">{name}</span>,</p>
            <p className="text-2xl md:text-3xl font-bold text-foreground">There is no giveaway. <span className="gradient-text">Got you!</span> 🎉</p>
            <p className="text-muted-foreground text-lg">No MacBook. No iPhone. No cash. Just pure comedy. 😂</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={handleSharePrank} className="inline-flex items-center justify-center gap-2 gradient-hero-bg text-primary-foreground px-8 py-4 rounded-2xl font-bold text-lg hover:opacity-90 transition-opacity glow-effect">
              <Share2 className="h-5 w-5" /> You got pranked by me
            </button>
            <button onClick={() => { document.documentElement.classList.remove("dark"); navigate("/"); }} className="inline-flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-8 py-4 rounded-2xl font-bold text-lg hover:bg-secondary/80 transition-colors">
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
        <div className="glass-card-elevated p-8 md:p-10 text-center">
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
              <div className="h-full gradient-hero-bg rounded-full transition-all duration-1000" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="glass-card-elevated p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center shrink-0">
            <Trophy className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold">Winner Announcement</h3>
            <p className="text-sm text-muted-foreground">Pending — Results on April 1st, 2026</p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">Pending</span>
        </div>

        {/* Referral Section */}
        {code && (
          <div className="glass-card-elevated p-6 md:p-8 space-y-5">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 mb-3">
                <Share2 className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-lg">Invite Friends, Boost Your Chances</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Share your unique referral link. Each friend who joins increases your winning probability!
              </p>
            </div>

            <div className="flex gap-2">
              <div className="flex-1 bg-secondary rounded-xl px-4 py-3 text-sm text-muted-foreground font-mono truncate border border-border">
                {referralLink}
              </div>
              <button
                onClick={handleCopyReferral}
                className="gradient-bg text-primary-foreground px-4 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center gap-2 shrink-0"
              >
                <Copy className="h-4 w-4" /> Copy
              </button>
            </div>

            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="text-center">
                <div className="font-bold text-foreground text-2xl tabular-nums">{referralCount}</div>
                <div>Friends joined</div>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
                <div className="font-bold text-foreground text-2xl">{getWinMultiplier()}</div>
                <div>Win multiplier</div>
              </div>
            </div>

            {/* Referral list */}
            {referrals.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                  <Users className="h-4 w-4" /> Your Referrals
                </h4>
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {referrals.map((r, i) => (
                    <div key={i} className="flex items-center justify-between bg-secondary/50 rounded-xl px-4 py-3 border border-border/50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-xs font-bold text-primary-foreground">
                          {r.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-sm">{r.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{timeAgo(r.created_at)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleCopyReferral}
              className="w-full gradient-hero-bg text-primary-foreground py-3 rounded-xl font-bold hover:opacity-90 transition-opacity glow-effect flex items-center justify-center gap-2"
            >
              <Share2 className="h-5 w-5" /> Share with Friends
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
