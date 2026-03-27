import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Loader2, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loginStatus } = useInternetIdentity();
  const { refreshProfile } = useAuth();
  const [showPw, setShowPw] = useState(false);
  const isLoggingIn = loginStatus === "logging-in";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login();
      await refreshProfile();
      toast.success("Welcome back!");
      navigate({ to: "/dashboard" });
    } catch {
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <main className="page-content min-h-screen flex items-center justify-center p-4">
      <motion.div
        className="card-glass rounded-3xl p-8 w-full max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        data-ocid="login.modal"
      >
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-full gradient-btn flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold gradient-text">NovaNFT</span>
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-1">
          Welcome back
        </h1>
        <p className="text-muted-foreground mb-8">Sign in to your account</p>

        <form onSubmit={handleLogin} className="space-y-5">
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
              className="bg-secondary border-border rounded-xl"
              data-ocid="login.input"
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
                data-ocid="login.input"
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

          <Button
            type="submit"
            className="w-full rounded-full gradient-btn text-white border-0 py-3 h-auto font-semibold"
            disabled={isLoggingIn}
            data-ocid="login.submit_button"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-muted-foreground text-sm">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-neon-cyan hover:underline"
              data-ocid="login.link"
            >
              Sign up
            </Link>
          </p>
        </div>

        <div className="mt-4 p-3 rounded-xl bg-secondary border border-border">
          <p className="text-xs text-muted-foreground text-center">
            🔐 Secured by Internet Identity — your decentralized login
          </p>
        </div>
      </motion.div>
    </main>
  );
}
