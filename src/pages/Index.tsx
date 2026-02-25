import { useState } from "react";
import { Gift, Zap, Trophy, Users, ChevronDown, Sparkles, Star, ArrowRight, Laptop, Smartphone, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const prizes = [
  { icon: Laptop, label: "MacBook Pro M4", value: "$3,499" },
  { icon: Smartphone, label: "iPhone 17 Pro Max", value: "$1,599" },
  { icon: DollarSign, label: "Cash Prizes", value: "$10,000" },
  { icon: Gift, label: "Creator Kit", value: "$2,000" },
];

const features = [
  { icon: Zap, title: "Instant Entry", description: "Just enter your name — no signup, no payment, no strings attached." },
  { icon: Trophy, title: "Massive Prizes", description: "Over $17,000 in prizes including the latest Apple gear and cash rewards." },
  { icon: Users, title: "For Everyone", description: "Open worldwide. Creators, developers, designers — everyone's welcome." },
  { icon: Sparkles, title: "Fair & Transparent", description: "AI-powered random selection. Winners announced live on April 1st." },
];

const testimonials = [
  { name: "Sarah K.", role: "Content Creator", text: "I won the last giveaway and it completely changed my setup. Can't wait for this one!", avatar: "SK" },
  { name: "Marcus J.", role: "Indie Developer", text: "The team behind this is legit. Already shared with everyone I know.", avatar: "MJ" },
  { name: "Priya R.", role: "Designer", text: "Finally a giveaway that doesn't ask for my soul. Just a name? I'm in!", avatar: "PR" },
];

const faqs = [
  { q: "Is this really free?", a: "Absolutely! No payment, no credit card, no hidden fees. Just enter your name." },
  { q: "When are winners announced?", a: "Winners will be revealed on April 1st, 2026 at midnight in your local timezone." },
  { q: "How are winners selected?", a: "We use a cryptographically secure random selection algorithm to ensure complete fairness." },
  { q: "Can I enter multiple times?", a: "One entry per person please. Multiple entries will be deduplicated." },
  { q: "Is this available worldwide?", a: "Yes! The giveaway is open to participants from any country." },
];

const Index = () => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error("Please enter your name");
      return;
    }
    if (trimmed.length > 100) {
      toast.error("Name must be under 100 characters");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("participants").insert({ name: trimmed });
      if (error) throw error;
      navigate(`/dashboard?name=${encodeURIComponent(trimmed)}`);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 glass-card border-b border-border/50 rounded-none">
        <div className="container mx-auto flex items-center justify-between h-16 px-6">
          <div className="flex items-center gap-2">
            <Gift className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">MegaGive</span>
          </div>
          <a href="#join" className="gradient-bg text-primary-foreground px-5 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity">
            Join Now
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative section-padding pt-32 lg:pt-40 text-center">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />
        </div>
        <div className="relative container mx-auto max-w-4xl">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-8 text-sm font-medium text-muted-foreground">
            <Star className="h-4 w-4 text-primary" />
            <span>Over 12,000 creators already joined</span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.95] mb-6">
            <span className="gradient-text">2026 Mega</span>
            <br />
            Creator Giveaway
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Win a MacBook Pro, iPhone 17 Pro Max, $10,000 in cash, and more.
            <span className="text-foreground font-medium"> No purchase necessary. Winners announced April 1st.</span>
          </p>

          {/* Entry Form */}
          <div id="join" className="glass-card-elevated p-8 max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                maxLength={100}
                className="w-full px-5 py-3.5 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-center text-lg"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full gradient-hero-bg text-primary-foreground py-3.5 rounded-xl font-bold text-lg hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 glow-effect"
              >
                {loading ? "Joining..." : (
                  <>Join Giveaway <ArrowRight className="h-5 w-5" /></>
                )}
              </button>
            </form>
            <p className="text-xs text-muted-foreground mt-3">Free entry • No spam • Winners announced April 1st</p>
          </div>
        </div>
      </section>

      {/* Prizes */}
      <section className="section-padding">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">What You Could Win</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {prizes.map((prize) => (
              <div key={prize.label} className="glass-card-elevated p-6 text-center group hover:scale-105 transition-transform duration-300">
                <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-4 group-hover:glow-effect transition-shadow">
                  <prize.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="font-bold text-sm md:text-base mb-1">{prize.label}</h3>
                <p className="gradient-text font-black text-xl">{prize.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-padding bg-secondary/50">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Why Join?</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-lg mx-auto">The easiest giveaway you'll ever enter. Here's what makes it special.</p>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((f) => (
              <div key={f.title} className="glass-card-elevated p-6 flex gap-4 items-start hover:scale-[1.02] transition-transform duration-300">
                <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center shrink-0">
                  <f.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">{f.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">What People Are Saying</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="glass-card-elevated p-6">
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-sm font-bold text-primary-foreground">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-secondary/50">
        <div className="container mx-auto max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <button
                key={i}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full text-left glass-card-elevated p-5 transition-all"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{faq.q}</h3>
                  <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </div>
                {openFaq === i && (
                  <p className="text-sm text-muted-foreground mt-3 leading-relaxed animate-fade-in">{faq.a}</p>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="section-padding text-center">
        <div className="container mx-auto max-w-lg">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Don't Miss Out</h2>
          <p className="text-muted-foreground mb-8">Join thousands of creators. Enter your name above and you're in.</p>
          <a href="#join" className="inline-flex items-center gap-2 gradient-hero-bg text-primary-foreground px-8 py-4 rounded-full font-bold text-lg hover:opacity-90 transition-opacity glow-effect">
            Join Now <ArrowRight className="h-5 w-5" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Gift className="h-4 w-4 text-primary" />
            <span className="font-semibold">MegaGive 2026</span>
          </div>
          <p>© 2026 MegaGive. All rights reserved. Winners announced April 1st.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
