import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, ShoppingCart } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import type { Nft } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useBuyNft } from "../hooks/useQueries";

const MOCK_IMAGES = [
  "/assets/generated/nft-1.dim_400x400.png",
  "/assets/generated/nft-2.dim_400x400.png",
  "/assets/generated/nft-3.dim_400x400.png",
  "/assets/generated/nft-4.dim_400x400.png",
  "/assets/generated/nft-5.dim_400x400.png",
  "/assets/generated/nft-6.dim_400x400.png",
  "/assets/generated/nft-7.dim_400x400.png",
  "/assets/generated/nft-8.dim_400x400.png",
];

interface Props {
  nft: Nft;
  index: number;
  showBuy?: boolean;
}

export default function NftCard({ nft, index, showBuy = true }: Props) {
  const { identity } = useInternetIdentity();
  const buyMutation = useBuyNft();
  const priceEth = (Number(nft.price) / 1e18).toFixed(3);
  const imgSrc =
    nft.imageUrl || MOCK_IMAGES[Number(nft.id) % MOCK_IMAGES.length];

  const handleBuy = async () => {
    if (!identity) {
      toast.error("Please login to buy NFTs");
      return;
    }
    try {
      await buyMutation.mutateAsync(nft.id);
      toast.success(`Purchased "${nft.name}"!`);
    } catch (e: any) {
      toast.error(e?.message || "Purchase failed");
    }
  };

  return (
    <motion.div
      className="neon-border card-glass rounded-2xl overflow-hidden group cursor-pointer"
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      data-ocid={`nft.item.${index + 1}`}
    >
      <div className="relative overflow-hidden aspect-square">
        <img
          src={imgSrc}
          alt={nft.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              MOCK_IMAGES[index % MOCK_IMAGES.length];
          }}
        />
        {nft.isFeatured && (
          <Badge className="absolute top-2 right-2 bg-neon-purple/80 text-white border-0 text-xs">
            Featured
          </Badge>
        )}
        {nft.isSold && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-bold text-lg">SOLD</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-semibold text-foreground text-sm truncate">
            {nft.name}
          </h3>
          <span className="text-xs text-muted-foreground ml-2">
            #{String(nft.id)}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mb-1 truncate">
          {nft.category}
        </p>
        <p className="text-xs text-muted-foreground mb-3 line-clamp-1">
          {nft.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-neon-cyan font-bold text-sm">
            {priceEth} ETH
          </span>
          {showBuy && !nft.isSold && (
            <Button
              size="sm"
              className="rounded-full gradient-btn text-white border-0 text-xs h-7 px-3"
              onClick={handleBuy}
              disabled={buyMutation.isPending}
              data-ocid={`nft.primary_button.${index + 1}`}
            >
              {buyMutation.isPending ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <>
                  <ShoppingCart className="w-3 h-3 mr-1" />
                  Buy Now
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
