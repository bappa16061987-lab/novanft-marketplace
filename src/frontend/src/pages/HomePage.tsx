import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ImageIcon,
  Palette,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import type { Nft } from "../backend.d";
import NftCard from "../components/NftCard";
import { useFeaturedNfts, usePlatformStats } from "../hooks/useQueries";

const MOCK_NFTS: Nft[] = [
  {
    id: 1n,
    name: "Cosmic Crystal #001",
    description: "Ethereal crystal formation",
    category: "Abstract",
    price: 500000000000000000n,
    isSold: false,
    isFeatured: true,
    imageUrl: "/assets/generated/nft-1.dim_400x400.png",
    creator: null as any,
    listedAt: 0n,
    owner: undefined,
  },
  {
    id: 2n,
    name: "Neon Phoenix #023",
    description: "Born from digital fire",
    category: "Creature",
    price: 800000000000000000n,
    isSold: false,
    isFeatured: false,
    imageUrl: "/assets/generated/nft-2.dim_400x400.png",
    creator: null as any,
    listedAt: 0n,
    owner: undefined,
  },
  {
    id: 3n,
    name: "Fractal Mandala #007",
    description: "Infinite patterns of light",
    category: "Mandala",
    price: 350000000000000000n,
    isSold: false,
    isFeatured: true,
    imageUrl: "/assets/generated/nft-3.dim_400x400.png",
    creator: null as any,
    listedAt: 0n,
    owner: undefined,
  },
  {
    id: 4n,
    name: "Cyberpunk City #044",
    description: "Neon-lit urban dreamscape",
    category: "Cityscape",
    price: 1200000000000000000n,
    isSold: false,
    isFeatured: false,
    imageUrl: "/assets/generated/nft-4.dim_400x400.png",
    creator: null as any,
    listedAt: 0n,
    owner: undefined,
  },
  {
    id: 5n,
    name: "Liquid Chrome #012",
    description: "Flowing metallic sculpture",
    category: "Sculpture",
    price: 620000000000000000n,
    isSold: true,
    isFeatured: false,
    imageUrl: "/assets/generated/nft-5.dim_400x400.png",
    creator: null as any,
    listedAt: 0n,
    owner: undefined,
  },
  {
    id: 6n,
    name: "Nebula Eye #089",
    description: "Cosmic gaze from the void",
    category: "Cosmic",
    price: 950000000000000000n,
    isSold: false,
    isFeatured: true,
    imageUrl: "/assets/generated/nft-6.dim_400x400.png",
    creator: null as any,
    listedAt: 0n,
    owner: undefined,
  },
  {
    id: 7n,
    name: "Circuit Skull #015",
    description: "Where tech meets mortality",
    category: "Dark Art",
    price: 750000000000000000n,
    isSold: false,
    isFeatured: false,
    imageUrl: "/assets/generated/nft-7.dim_400x400.png",
    creator: null as any,
    listedAt: 0n,
    owner: undefined,
  },
  {
    id: 8n,
    name: "Holo Butterfly #033",
    description: "Light refracted beauty",
    category: "Nature",
    price: 420000000000000000n,
    isSold: false,
    isFeatured: false,
    imageUrl: "/assets/generated/nft-8.dim_400x400.png",
    creator: null as any,
    listedAt: 0n,
    owner: undefined,
  },
];

export default function HomePage() {
  const { data: featuredNfts, isLoading: nftsLoading } = useFeaturedNfts();
  const { data: stats } = usePlatformStats();

  const displayNfts =
    featuredNfts && featuredNfts.length > 0
      ? featuredNfts.slice(0, 8)
      : MOCK_NFTS;

  const statItems = [
    {
      label: "Total Volume",
      value: stats
        ? `${(Number(stats.totalVolume) / 1e18).toFixed(1)}K ETH`
        : "45.2K ETH",
      icon: TrendingUp,
      color: "text-neon-cyan",
      id: "volume",
    },
    {
      label: "Total Users",
      value: stats ? `${Number(stats.totalUsers).toLocaleString()}` : "12,400",
      icon: Users,
      color: "text-neon-purple",
      id: "users",
    },
    {
      label: "NFTs Sold",
      value: stats
        ? `${Number(stats.totalNftsSold).toLocaleString()}`
        : "89,300",
      icon: ImageIcon,
      color: "text-neon-pink",
      id: "sold",
    },
    {
      label: "Artists",
      value: "3,200+",
      icon: Palette,
      color: "text-neon-cyan",
      id: "artists",
    },
  ];

  return (
    <main className="page-content">
      {/* Hero Section */}
      <section
        className="relative min-h-[90vh] flex items-center"
        data-ocid="home.section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-neon-cyan/30 bg-neon-cyan/10 text-neon-cyan text-xs font-medium mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" />
                The Future of Digital Ownership
              </div>
              <h1 className="text-5xl lg:text-7xl font-black leading-[1.05] mb-6">
                <span className="gradient-text">DISCOVER,</span> <br />
                <span className="gradient-text">COLLECT &amp;</span>
                <br />
                <span className="text-foreground">TRADE</span>
                <br />
                <span className="gradient-text">EXTRAORDINARY</span>
                <br />
                <span className="text-foreground text-4xl lg:text-5xl">
                  NFTs
                </span>
              </h1>
              <p className="text-muted-foreground text-lg mb-8 max-w-md">
                The premier decentralized marketplace for rare digital art. Buy,
                sell, and discover exclusive NFTs from top creators around the
                world.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/marketplace" data-ocid="home.primary_button">
                  <Button className="rounded-full gradient-btn text-white border-0 px-8 py-3 h-auto text-base font-semibold">
                    Explore Now <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/signup" data-ocid="home.secondary_button">
                  <Button
                    variant="outline"
                    className="rounded-full border-neon-cyan/40 text-neon-cyan hover:bg-neon-cyan/10 px-8 py-3 h-auto text-base"
                  >
                    Create NFT
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Right: Hero Image */}
            <motion.div
              className="relative flex items-center justify-center"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative w-full max-w-lg float-animation">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-neon-purple/30 to-neon-pink/30 blur-3xl" />
                <img
                  src="/assets/generated/nft-hero-art.dim_600x500.png"
                  alt="NFT Hero Art"
                  className="relative rounded-3xl w-full pulse-glow"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section
        className="max-w-7xl mx-auto px-4 sm:px-6 py-8"
        data-ocid="stats.section"
      >
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {statItems.map((stat) => (
            <div
              key={stat.id}
              className="neon-border card-glass rounded-2xl p-6 text-center"
              data-ocid="stats.card"
            >
              <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
              <div className={`text-2xl font-black mb-1 ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Trending NFTs */}
      <section
        className="max-w-7xl mx-auto px-4 sm:px-6 py-16"
        data-ocid="trending.section"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h2 className="text-3xl font-bold text-foreground">
              Trending NFTs
            </h2>
            <p className="text-muted-foreground mt-1">
              Discover the most sought-after digital collectibles
            </p>
          </div>
          <Link to="/marketplace" data-ocid="trending.link">
            <Button
              variant="outline"
              className="rounded-full border-neon-cyan/40 text-neon-cyan hover:bg-neon-cyan/10"
            >
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </motion.div>

        {nftsLoading ? (
          <div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            data-ocid="trending.loading_state"
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={String(i)} className="aspect-square rounded-2xl" />
            ))}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.07 } },
            }}
          >
            {displayNfts.map((nft, i) => (
              <motion.div
                key={String(nft.id)}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <NftCard nft={nft} index={i} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* CTA Banner */}
      <section
        className="max-w-7xl mx-auto px-4 sm:px-6 py-16"
        data-ocid="cta.section"
      >
        <motion.div
          className="relative rounded-3xl overflow-hidden p-12 text-center"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.15 0.04 270) 0%, oklch(0.12 0.04 300) 50%, oklch(0.15 0.04 330) 100%)",
          }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, oklch(0.58 0.22 292 / 0.3) 0%, transparent 70%)",
            }}
          />
          <div className="relative">
            <h2 className="text-4xl font-black gradient-text mb-4">
              Start Your NFT Journey Today
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-lg mx-auto">
              Join thousands of creators and collectors on the world&apos;s most
              vibrant NFT marketplace.
            </p>
            <Link to="/signup" data-ocid="cta.primary_button">
              <Button className="rounded-full gradient-btn text-white border-0 px-10 py-4 h-auto text-lg font-bold">
                Get Started Free
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
