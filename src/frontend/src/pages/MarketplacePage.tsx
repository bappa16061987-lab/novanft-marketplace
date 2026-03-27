import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Filter, Search } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import type { Nft } from "../backend.d";
import NftCard from "../components/NftCard";
import { useAllNfts } from "../hooks/useQueries";

const MOCK_NFTS: Nft[] = [
  {
    id: 1n,
    name: "Cosmic Crystal #001",
    description: "Ethereal crystal formation in the void",
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
    description: "Born from digital fire and electricity",
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
    description: "Infinite patterns of sacred geometry",
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
    description: "Neon-lit urban dreamscape of the future",
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
    description: "Flowing metallic sculpture in zero gravity",
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
    description: "Cosmic gaze from the infinite void",
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
    description: "Where technology meets mortality",
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
    description: "Light refracted through prismatic wings",
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

const CATEGORIES = [
  "All",
  "Abstract",
  "Creature",
  "Cosmic",
  "Cityscape",
  "Dark Art",
  "Nature",
  "Sculpture",
  "Mandala",
];

export default function MarketplacePage() {
  const { data: nfts, isLoading } = useAllNfts();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState<"price_asc" | "price_desc" | "newest">(
    "newest",
  );

  const displayNfts = nfts && nfts.length > 0 ? nfts : MOCK_NFTS;

  const filtered = useMemo(() => {
    let result = displayNfts.filter((n) => {
      const matchSearch =
        n.name.toLowerCase().includes(search.toLowerCase()) ||
        n.description.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "All" || n.category === category;
      return matchSearch && matchCat;
    });
    if (sort === "price_asc")
      result = [...result].sort((a, b) => Number(a.price - b.price));
    if (sort === "price_desc")
      result = [...result].sort((a, b) => Number(b.price - a.price));
    return result;
  }, [displayNfts, search, category, sort]);

  return (
    <main className="page-content max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-black gradient-text mb-2">Marketplace</h1>
        <p className="text-muted-foreground mb-8">
          Explore and collect extraordinary digital art
        </p>

        {/* Search + Sort */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search NFTs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 rounded-full bg-secondary border-border"
              data-ocid="marketplace.search_input"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={sort}
              onChange={(e) =>
                setSort(e.target.value as "price_asc" | "price_desc" | "newest")
              }
              className="bg-secondary border border-border rounded-full px-4 py-2 text-sm text-foreground focus:outline-none focus:border-neon-cyan/50"
              data-ocid="marketplace.select"
            >
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
                category === cat
                  ? "gradient-btn text-white border-transparent"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-neon-cyan/40"
              }`}
              data-ocid="marketplace.tab"
            >
              {cat}
            </button>
          ))}
        </div>

        {/* NFT Grid */}
        {isLoading ? (
          <div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            data-ocid="marketplace.loading_state"
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={String(i)} className="aspect-square rounded-2xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="text-center py-20"
            data-ocid="marketplace.empty_state"
          >
            <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              No NFTs found matching your search
            </p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.05 } },
            }}
          >
            {filtered.map((nft, i) => (
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
      </motion.div>
    </main>
  );
}
