import { Link } from "@tanstack/react-router";
import { Zap } from "lucide-react";
import { SiDiscord, SiGithub, SiX } from "react-icons/si";

export default function Footer() {
  const year = new Date().getFullYear();
  const caffeineLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  return (
    <footer className="border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full gradient-btn flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">NovaNFT</span>
            </div>
            <p className="text-muted-foreground text-sm max-w-sm">
              The premier decentralized marketplace for rare digital art. Buy,
              sell, and discover exclusive NFTs from top creators around the
              world.
            </p>
            <div className="flex gap-4 mt-4">
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-neon-cyan transition-colors"
                aria-label="Twitter"
              >
                <SiX className="w-5 h-5" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-neon-cyan transition-colors"
                aria-label="Github"
              >
                <SiGithub className="w-5 h-5" />
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-neon-cyan transition-colors"
                aria-label="Discord"
              >
                <SiDiscord className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3">Explore</h4>
            <div className="flex flex-col gap-2">
              <Link
                to="/"
                className="text-sm text-muted-foreground hover:text-neon-cyan transition-colors"
              >
                Home
              </Link>
              <Link
                to="/marketplace"
                className="text-sm text-muted-foreground hover:text-neon-cyan transition-colors"
              >
                Marketplace
              </Link>
              <Link
                to="/dashboard"
                className="text-sm text-muted-foreground hover:text-neon-cyan transition-colors"
              >
                Dashboard
              </Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3">Account</h4>
            <div className="flex flex-col gap-2">
              <Link
                to="/login"
                className="text-sm text-muted-foreground hover:text-neon-cyan transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-sm text-muted-foreground hover:text-neon-cyan transition-colors"
              >
                Sign Up
              </Link>
              <a
                href="mailto:support@novanft.xyz"
                className="text-sm text-muted-foreground hover:text-neon-cyan transition-colors"
              >
                Support
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground">
            &copy; {year}. Built with &#10084;&#65039; using{" "}
            <a
              href={caffeineLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neon-cyan hover:underline"
            >
              caffeine.ai
            </a>
          </p>
          <p className="text-xs text-muted-foreground">
            NFTs are digital collectibles. Trade responsibly.
          </p>
        </div>
      </div>
    </footer>
  );
}
