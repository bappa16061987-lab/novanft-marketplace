import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useLocation } from "@tanstack/react-router";
import { LogOut, Menu, Settings, User, X, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import WalletModal from "./WalletModal";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);
  const location = useLocation();
  const { isAdmin, walletAddress, logout } = useAuth();
  const { clear, identity } = useInternetIdentity();

  const isLoggedIn = !!identity;

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Marketplace", to: "/marketplace" },
    ...(isLoggedIn ? [{ label: "Dashboard", to: "/dashboard" }] : []),
    ...(isAdmin ? [{ label: "Admin", to: "/admin" }] : []),
  ];

  const handleLogout = () => {
    clear();
    logout();
  };

  return (
    <>
      <header className="header-glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" data-ocid="nav.link">
            <div className="w-8 h-8 rounded-full gradient-btn flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">NovaNFT</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                data-ocid="nav.link"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  location.pathname === link.to
                    ? "text-neon-cyan bg-neon-cyan/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-3">
            {walletAddress ? (
              <button
                type="button"
                onClick={() => setWalletOpen(true)}
                className="text-xs text-neon-cyan border border-neon-cyan/30 px-3 py-1.5 rounded-full hover:bg-neon-cyan/10 transition-all"
                data-ocid="nav.toggle"
              >
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-neon-cyan/40 text-neon-cyan hover:bg-neon-cyan/10 text-xs"
                onClick={() => setWalletOpen(true)}
                data-ocid="nav.primary_button"
              >
                Connect Wallet
              </Button>
            )}

            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="w-9 h-9 rounded-full gradient-btn flex items-center justify-center"
                    data-ocid="nav.toggle"
                  >
                    <User className="w-4 h-4 text-white" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="card-glass border-border"
                  align="end"
                >
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" data-ocid="nav.link">
                      <Settings className="w-4 h-4 mr-2" /> Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    data-ocid="nav.button"
                  >
                    <LogOut className="w-4 h-4 mr-2" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" data-ocid="nav.link">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full text-muted-foreground hover:text-foreground"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/signup" data-ocid="nav.link">
                  <Button
                    size="sm"
                    className="rounded-full gradient-btn text-white border-0"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden text-muted-foreground hover:text-foreground"
            onClick={() => setMenuOpen(!menuOpen)}
            data-ocid="nav.toggle"
          >
            {menuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden card-glass border-t border-border"
            >
              <div className="px-4 py-4 flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    data-ocid="nav.link"
                    className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="flex gap-2 pt-2">
                  {isLoggedIn ? (
                    <Button
                      variant="outline"
                      className="flex-1 rounded-full"
                      onClick={handleLogout}
                      data-ocid="nav.button"
                    >
                      Logout
                    </Button>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="flex-1"
                        onClick={() => setMenuOpen(false)}
                        data-ocid="nav.link"
                      >
                        <Button
                          variant="outline"
                          className="w-full rounded-full"
                        >
                          Login
                        </Button>
                      </Link>
                      <Link
                        to="/signup"
                        className="flex-1"
                        onClick={() => setMenuOpen(false)}
                        data-ocid="nav.link"
                      >
                        <Button className="w-full rounded-full gradient-btn text-white border-0">
                          Sign Up
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <WalletModal open={walletOpen} onClose={() => setWalletOpen(false)} />
    </>
  );
}
