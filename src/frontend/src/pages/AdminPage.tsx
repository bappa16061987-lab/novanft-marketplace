import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Ban,
  Check,
  DollarSign,
  ImageIcon,
  Loader2,
  Plus,
  Star,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Nft } from "../backend.d";
import { useAuth } from "../contexts/AuthContext";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAllNfts,
  useAllUserProfiles,
  useCreateNft,
  usePlatformStats,
  useToggleFeatureNft,
} from "../hooks/useQueries";

const MOCK_IMAGES = [
  "/assets/generated/nft-1.dim_400x400.png",
  "/assets/generated/nft-2.dim_400x400.png",
  "/assets/generated/nft-3.dim_400x400.png",
  "/assets/generated/nft-4.dim_400x400.png",
];

export default function AdminPage() {
  const { isAdmin, isLoading: authLoading } = useAuth();
  const { identity } = useInternetIdentity();
  const { actor } = useActor();
  const { data: nfts, isLoading: nftsLoading } = useAllNfts();
  const { data: users, isLoading: usersLoading } = useAllUserProfiles();
  const { data: stats } = usePlatformStats();
  const createNftMutation = useCreateNft();
  const toggleFeatureMutation = useToggleFeatureNft();

  const [addNftOpen, setAddNftOpen] = useState(false);
  const [nftForm, setNftForm] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    imageUrl: "",
  });
  const [adjustingUser, setAdjustingUser] = useState<string | null>(null);
  const [adjustAmount, setAdjustAmount] = useState("");

  if (!identity || authLoading) {
    return (
      <main className="page-content max-w-7xl mx-auto px-4 py-20 text-center">
        <Skeleton className="h-8 w-48 mx-auto" />
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="page-content max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">Access denied. Admin only.</p>
      </main>
    );
  }

  const handleCreateNft = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nftForm.name || !nftForm.price) {
      toast.error("Name and price are required");
      return;
    }
    const priceWei = BigInt(
      Math.floor(Number.parseFloat(nftForm.price) * 1e18),
    );
    const newNft: Nft = {
      id: BigInt(Date.now()),
      name: nftForm.name,
      description: nftForm.description,
      category: nftForm.category || "Art",
      price: priceWei,
      imageUrl:
        nftForm.imageUrl ||
        MOCK_IMAGES[Math.floor(Math.random() * MOCK_IMAGES.length)],
      isSold: false,
      isFeatured: false,
      creator: identity.getPrincipal(),
      listedAt: BigInt(Date.now()),
      owner: undefined,
    };
    try {
      await createNftMutation.mutateAsync(newNft);
      toast.success("NFT created!");
      setAddNftOpen(false);
      setNftForm({
        name: "",
        description: "",
        category: "",
        price: "",
        imageUrl: "",
      });
    } catch (err: any) {
      toast.error(err?.message || "Failed to create NFT");
    }
  };

  const handleBanUser = async (userId: string) => {
    if (!actor) return;
    try {
      const { Principal } = await import("@icp-sdk/core/principal");
      await actor.banUser(Principal.fromText(userId));
      toast.success("User banned");
    } catch (err: any) {
      toast.error(err?.message || "Failed to ban user");
    }
  };

  const handleAdjustBalance = async (userId: string) => {
    if (!actor || !adjustAmount) return;
    try {
      const { Principal } = await import("@icp-sdk/core/principal");
      const amount = BigInt(Math.floor(Number.parseFloat(adjustAmount) * 1e18));
      await actor.adjustUserBalance(Principal.fromText(userId), amount);
      toast.success("Balance adjusted");
      setAdjustingUser(null);
      setAdjustAmount("");
    } catch (err: any) {
      toast.error(err?.message || "Failed to adjust balance");
    }
  };

  const platformStats = [
    {
      label: "Total Volume",
      value: stats
        ? `${(Number(stats.totalVolume) / 1e18).toFixed(1)} ETH`
        : "\u2014",
    },
    {
      label: "Total Users",
      value: stats ? String(Number(stats.totalUsers)) : "\u2014",
    },
    {
      label: "NFTs Sold",
      value: stats ? String(Number(stats.totalNftsSold)) : "\u2014",
    },
  ];

  return (
    <main
      className="page-content max-w-7xl mx-auto px-4 sm:px-6 py-10"
      data-ocid="admin.section"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-black gradient-text mb-2">Admin Panel</h1>
        <p className="text-muted-foreground mb-8">
          Manage the NovaNFT platform
        </p>

        {/* Platform Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {platformStats.map((s) => (
            <div
              key={s.label}
              className="neon-border card-glass rounded-2xl p-5 text-center"
              data-ocid="admin.card"
            >
              <div className="text-2xl font-black text-neon-cyan">
                {s.value}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        <Tabs defaultValue="nfts" data-ocid="admin.tab">
          <TabsList className="bg-secondary rounded-full mb-6">
            <TabsTrigger
              value="nfts"
              className="rounded-full"
              data-ocid="admin.tab"
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              NFTs
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="rounded-full"
              data-ocid="admin.tab"
            >
              <Users className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
          </TabsList>

          {/* NFTs Tab */}
          <TabsContent value="nfts">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-foreground">NFT Management</h2>
              <Dialog open={addNftOpen} onOpenChange={setAddNftOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="rounded-full gradient-btn text-white border-0"
                    data-ocid="admin.open_modal_button"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add NFT
                  </Button>
                </DialogTrigger>
                <DialogContent
                  className="card-glass border-border"
                  data-ocid="admin.dialog"
                >
                  <DialogHeader>
                    <DialogTitle className="text-foreground">
                      Create New NFT
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateNft} className="space-y-4">
                    <div>
                      <Label className="text-muted-foreground text-sm">
                        Name *
                      </Label>
                      <Input
                        value={nftForm.name}
                        onChange={(e) =>
                          setNftForm((p) => ({ ...p, name: e.target.value }))
                        }
                        className="bg-secondary border-border rounded-xl mt-1"
                        placeholder="Cosmic Art #001"
                        data-ocid="admin.input"
                      />
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-sm">
                        Description
                      </Label>
                      <Input
                        value={nftForm.description}
                        onChange={(e) =>
                          setNftForm((p) => ({
                            ...p,
                            description: e.target.value,
                          }))
                        }
                        className="bg-secondary border-border rounded-xl mt-1"
                        placeholder="Digital masterpiece"
                        data-ocid="admin.input"
                      />
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-sm">
                        Category
                      </Label>
                      <Input
                        value={nftForm.category}
                        onChange={(e) =>
                          setNftForm((p) => ({
                            ...p,
                            category: e.target.value,
                          }))
                        }
                        className="bg-secondary border-border rounded-xl mt-1"
                        placeholder="Art"
                        data-ocid="admin.input"
                      />
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-sm">
                        Price (ETH) *
                      </Label>
                      <Input
                        type="number"
                        step="0.001"
                        value={nftForm.price}
                        onChange={(e) =>
                          setNftForm((p) => ({ ...p, price: e.target.value }))
                        }
                        className="bg-secondary border-border rounded-xl mt-1"
                        placeholder="0.5"
                        data-ocid="admin.input"
                      />
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-sm">
                        Image URL
                      </Label>
                      <Input
                        value={nftForm.imageUrl}
                        onChange={(e) =>
                          setNftForm((p) => ({
                            ...p,
                            imageUrl: e.target.value,
                          }))
                        }
                        className="bg-secondary border-border rounded-xl mt-1"
                        placeholder="https://..."
                        data-ocid="admin.input"
                      />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1 rounded-full"
                        onClick={() => setAddNftOpen(false)}
                        data-ocid="admin.cancel_button"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 rounded-full gradient-btn text-white border-0"
                        disabled={createNftMutation.isPending}
                        data-ocid="admin.submit_button"
                      >
                        {createNftMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "Create NFT"
                        )}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {nftsLoading ? (
              <div className="space-y-2" data-ocid="admin.loading_state">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={String(i)} className="h-14 rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="neon-border card-glass rounded-2xl overflow-hidden">
                <Table data-ocid="admin.table">
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="text-muted-foreground">
                        Name
                      </TableHead>
                      <TableHead className="text-muted-foreground">
                        Category
                      </TableHead>
                      <TableHead className="text-muted-foreground">
                        Price
                      </TableHead>
                      <TableHead className="text-muted-foreground">
                        Status
                      </TableHead>
                      <TableHead className="text-muted-foreground">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(nfts || []).slice(0, 20).map((nft, i) => (
                      <TableRow
                        key={String(nft.id)}
                        className="border-border"
                        data-ocid={`admin.row.${i + 1}`}
                      >
                        <TableCell className="text-foreground font-medium">
                          {nft.name}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {nft.category}
                        </TableCell>
                        <TableCell className="text-neon-cyan">
                          {(Number(nft.price) / 1e18).toFixed(3)} ETH
                        </TableCell>
                        <TableCell>
                          {nft.isSold ? (
                            <Badge className="bg-muted text-muted-foreground border-0">
                              Sold
                            </Badge>
                          ) : (
                            <Badge className="bg-neon-cyan/20 text-neon-cyan border-0">
                              Active
                            </Badge>
                          )}
                          {nft.isFeatured && (
                            <Badge className="ml-1 bg-neon-purple/20 text-neon-purple border-0">
                              Featured
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2 text-neon-purple hover:text-neon-purple"
                            onClick={() => toggleFeatureMutation.mutate(nft.id)}
                            data-ocid={`admin.toggle.${i + 1}`}
                          >
                            <Star className="w-3 h-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {(!nfts || nfts.length === 0) && (
                  <div
                    className="text-center py-10"
                    data-ocid="admin.empty_state"
                  >
                    <p className="text-muted-foreground text-sm">No NFTs yet</p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <h2 className="font-bold text-foreground mb-4">User Management</h2>
            {usersLoading ? (
              <div className="space-y-2" data-ocid="admin.loading_state">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={String(i)} className="h-14 rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="neon-border card-glass rounded-2xl overflow-hidden">
                <Table data-ocid="admin.table">
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="text-muted-foreground">
                        User ID
                      </TableHead>
                      <TableHead className="text-muted-foreground">
                        Balance
                      </TableHead>
                      <TableHead className="text-muted-foreground">
                        Earnings
                      </TableHead>
                      <TableHead className="text-muted-foreground">
                        Referral Code
                      </TableHead>
                      <TableHead className="text-muted-foreground">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(users || []).slice(0, 20).map((user, i) => (
                      <TableRow
                        key={user.userId}
                        className="border-border"
                        data-ocid={`admin.row.${i + 1}`}
                      >
                        <TableCell className="text-foreground font-medium">
                          {user.userId}
                        </TableCell>
                        <TableCell className="text-neon-cyan">
                          {(Number(user.balance) / 1e18).toFixed(4)} ETH
                        </TableCell>
                        <TableCell className="text-neon-purple">
                          {(Number(user.earnings) / 1e18).toFixed(4)} ETH
                        </TableCell>
                        <TableCell className="text-muted-foreground font-mono text-xs">
                          {user.referralCode}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {adjustingUser === user.userId ? (
                              <div className="flex gap-1 items-center">
                                <Input
                                  value={adjustAmount}
                                  onChange={(e) =>
                                    setAdjustAmount(e.target.value)
                                  }
                                  className="h-7 w-20 bg-secondary border-border rounded-lg text-xs"
                                  placeholder="ETH"
                                  data-ocid="admin.input"
                                />
                                <Button
                                  size="sm"
                                  className="h-7 px-2 gradient-btn text-white border-0"
                                  onClick={() =>
                                    handleAdjustBalance(user.userId)
                                  }
                                  data-ocid={`admin.save_button.${i + 1}`}
                                >
                                  <Check className="w-3 h-3" />
                                </Button>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 px-2 text-neon-cyan"
                                onClick={() => setAdjustingUser(user.userId)}
                                data-ocid={`admin.edit_button.${i + 1}`}
                              >
                                <DollarSign className="w-3 h-3" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2 text-destructive"
                              onClick={() => handleBanUser(user.userId)}
                              data-ocid={`admin.delete_button.${i + 1}`}
                            >
                              <Ban className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {(!users || users.length === 0) && (
                  <div
                    className="text-center py-10"
                    data-ocid="admin.empty_state"
                  >
                    <p className="text-muted-foreground text-sm">
                      No users yet
                    </p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </main>
  );
}
