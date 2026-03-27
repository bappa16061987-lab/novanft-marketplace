import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { Eye, EyeOff, Loader2, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function SignupPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/signup" }) as { ref?: string };
  const { login } = useInternetIdentity();
  const { actor } = useActor();
  const { refreshProfile } = useAuth();

  const [showPw, setShowPw] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [referralCode, setReferralCode] = useState(search?.ref || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      toast.error("Username is required");
      return;
    }
    setIsSubmitting(true);
    try {
      await login();
      if (actor) {
        const code =
          username.toUpperCase().replace(/\s/g, "") +
          Math.random().toString(36).slice(2, 6).toUpperCase();
        await actor.registerProfile({
          referralCode: code,
          balance: 0n,
          userId: username,
          walletAddress: undefined,
          earnings: 0n,
          referredBy: referralCode || undefined,
          referralBonus: 0n,
        });
      }
      await refreshProfile();
      toast.success("Account created! Welcome to NovaNFT!");
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      toast.error(err?.message || "Signup failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="page-content min-h-screen flex items-center justify-center p-4">
      <motion.div
        className="card-glass rounded-3xl p-8 w-full max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        data-ocid="signup.modal"
      >
        <div className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-full gradient-btn flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold gradient-text">NovaNFT</span>
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-1">
          Create account
        </h1>
        <p className="text-muted-foreground mb-8">
          Join the NFT revolution today
        </p>

        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <Label
              htmlFor="username"
              className="text-sm text-muted-foreground mb-1.5"
            >
              Username
            </Label>
            <Input
              id="username"
              placeholder="cryptoartist99"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-secondary border-border rounded-xl"
              data-ocid="signup.input"
            />
          </div>
          <div>
            <Label
              htmlFor="email"
              className="text-sm text-muted-foreground mb-1.5"
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-secondary border-border rounded-xl"
              data-ocid="signup.input"
            />
          </div>
          <div>
            <Label
              htmlFor="password"
              className="text-sm text-muted-foreground mb-1.5"
            >
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPw ? "text" : "password"}
                placeholder="••••••••"
                className="bg-secondary border-border rounded-xl pr-10"
                data-ocid="signup.input"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowPw(!showPw)}
              >
                {showPw ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
          <div>
            <Label
              htmlFor="ref"
              className="text-sm text-muted-foreground mb-1.5"
            >
              Referral Code <span className="text-xs">(optional)</span>
            </Label>
            <Input
              id="ref"
              placeholder="FRIEND123"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              className="bg-secondary border-border rounded-xl"
              data-ocid="signup.input"
            />
          </div>

          <Button
            type="submit"
            className="w-full rounded-full gradient-btn text-white border-0 py-3 h-auto font-semibold"
            disabled={isSubmitting}
            data-ocid="signup.submit_button"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating
                account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-muted-foreground text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-neon-cyan hover:underline"
              data-ocid="signup.link"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
}
