import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Check, Copy, Gift, ImageIcon, TrendingUp, Wallet } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Nft, ReferralStats } from "../backend.d";
import NftCard from "../components/NftCard";
import WalletModal from "../components/WalletModal";
import { useAuth } from "../contexts/AuthContext";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const BASE_URL = "https://novanft.xyz";

export default function DashboardPage() {
  const { profile, walletAddress, isLoading: authLoading } = useAuth();
  const { identity } = useInternetIdentity();
  const { actor, isFetching } = useActor();
  const [copied, setCopied] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);

  const { data: ownedNfts, isLoading: nftsLoading } = useQuery<Nft[]>({
    queryKey: ["owned", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return [];
      const all = await actor.getAllNfts();
      const principal = identity?.getPrincipal();
      return all.filter((n) => n.owner?.toString() === principal?.toString());
    },
    enabled: !!actor && !isFetching && !!identity,
  });

  const { data: referralStats } = useQuery<ReferralStats>({
    queryKey: ["referral", profile?.userId],
    queryFn: async () => {
      if (!actor || !profile) return { totalBonus: 0n, referredCount: 0n };
      return actor.getReferralStats(profile.userId);
    },
    enabled: !!actor && !isFetching && !!profile,
  });

  const balanceEth = profile
    ? (Number(profile.balance) / 1e18).toFixed(4)
    : "0.0000";
  const earningsEth = profile
    ? (Number(profile.earnings) / 1e18).toFixed(4)
    : "0.0000";
  const bonusEth = profile
    ? (Number(profile.referralBonus) / 1e18).toFixed(4)
    : "0.0000";
  const referralLink = profile
    ? `${BASE_URL}/signup?ref=${profile.referralCode}`
    : "";

  const handleCopy = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("Referral link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (!identity) {
    return (
      <main className="page-content max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
        <p className="text-muted-foreground">
          Please log in to view your dashboard
        </p>
      </main>
    );
  }

  const statCards = [
    {
      label: "Balance",
      value: `${balanceEth} ETH`,
      icon: Wallet,
      color: "text-neon-cyan",
      bg: "bg-neon-cyan/10",
    },
    {
      label: "Total Earnings",
      value: `${earningsEth} ETH`,
      icon: TrendingUp,
      color: "text-neon-purple",
      bg: "bg-neon-purple/10",
    },
    {
      label: "Referral Bonus",
      value: `${bonusEth} ETH`,
      icon: Gift,
      color: "text-neon-pink",
      bg: "bg-neon-pink/10",
    },
    {
      label: "Owned NFTs",
      value: String(ownedNfts?.length ?? 0),
      icon: ImageIcon,
      color: "text-neon-cyan",
      bg: "bg-neon-cyan/10",
    },
  ];

  return (
    <main
      className="page-content max-w-7xl mx-auto px-4 sm:px-6 py-10"
      data-ocid="dashboard.section"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black gradient-text">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {profile?.userId || "Explorer"}
            </p>
          </div>
          <Button
            className={`rounded-full border text-sm ${
              walletAddress
                ? "border-neon-cyan/40 text-neon-cyan hover:bg-neon-cyan/10 bg-transparent"
                : "gradient-btn text-white border-0"
            }`}
            onClick={() => setWalletOpen(true)}
            data-ocid="dashboard.primary_button"
          >
            <Wallet className="w-4 h-4 mr-2" />
            {walletAddress
              ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
              : "Connect Wallet"}
          </Button>
        </div>

        {/* Stats */}
        {authLoading ? (
          <div
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
            data-ocid="dashboard.loading_state"
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={String(i)} className="h-28 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map((s) => (
              <motion.div
                key={s.label}
                className="neon-border card-glass rounded-2xl p-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                data-ocid="dashboard.card"
              >
                <div
                  className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-3`}
                >
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <div className={`text-xl font-black ${s.color}`}>{s.value}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Referral Section */}
        <motion.div
          className="neon-border card-glass rounded-2xl p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          data-ocid="referral.section"
        >
          <h2 className="text-lg font-bold text-foreground mb-1 flex items-center gap-2">
            <Gift className="w-5 h-5 text-neon-pink" />
            Referral Program
          </h2>
          <p className="text-muted-foreground text-sm mb-4">
            Invite friends and earn bonuses for every referral. You&apos;ve
            referred{" "}
            <span className="text-neon-cyan font-bold">
              {String(referralStats?.referredCount ?? 0)}
            </span>{" "}
            users.
          </p>
          <div className="flex gap-2">
            <div className="flex-1 bg-secondary border border-border rounded-xl px-4 py-2.5 font-mono text-xs text-muted-foreground truncate">
              {referralLink || "Login to get your referral link"}
            </div>
            <Button
              className="rounded-xl gradient-btn text-white border-0 shrink-0"
              onClick={handleCopy}
              disabled={!referralLink}
              data-ocid="referral.copy_button"
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
          {referralStats && Number(referralStats.totalBonus) > 0 && (
            <p className="text-xs text-neon-pink mt-3">
              Total bonus earned:{" "}
              {(Number(referralStats.totalBonus) / 1e18).toFixed(4)} ETH
            </p>
          )}
        </motion.div>

        {/* Owned NFTs */}
        <div data-ocid="owned.section">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-neon-cyan" />
            My NFTs
          </h2>
          {nftsLoading ? (
            <div
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              data-ocid="owned.loading_state"
            >
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton
                  key={String(i)}
                  className="aspect-square rounded-2xl"
                />
              ))}
            </div>
          ) : !ownedNfts || ownedNfts.length === 0 ? (
            <div
              className="text-center py-16 neon-border card-glass rounded-2xl"
              data-ocid="owned.empty_state"
            >
              <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                You don&apos;t own any NFTs yet
              </p>
              <a
                href="/marketplace"
                className="text-neon-cyan text-sm mt-2 block hover:underline"
              >
                Browse Marketplace
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {ownedNfts.map((nft, i) => (
                <NftCard
                  key={String(nft.id)}
                  nft={nft}
                  index={i}
                  showBuy={false}
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>

      <WalletModal open={walletOpen} onClose={() => setWalletOpen(false)} />
    </main>
  );
}
