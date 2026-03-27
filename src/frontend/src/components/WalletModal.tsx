import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, CheckCircle, Wallet, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function WalletModal({ open, onClose }: Props) {
  const { walletAddress, setWalletAddress } = useAuth();
  const [inputAddr, setInputAddr] = useState("");
  const [step, setStep] = useState<"connect" | "confirm" | "done">("connect");

  const handleConnect = () => {
    if (!inputAddr.startsWith("0x") || inputAddr.length < 42) {
      toast.error("Please enter a valid ETH address (0x...)");
      return;
    }
    setStep("confirm");
  };

  const handleConfirm = () => {
    setWalletAddress(inputAddr);
    setStep("done");
    toast.success("Wallet connected!");
    setTimeout(() => {
      onClose();
      setStep("connect");
      setInputAddr("");
    }, 1500);
  };

  const handleDisconnect = () => {
    setWalletAddress(null);
    toast.success("Wallet disconnected");
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Close modal"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-default"
            onClick={onClose}
            onKeyDown={(e) => e.key === "Escape" && onClose()}
          />
          <motion.div
            className="relative card-glass rounded-2xl p-6 w-full max-w-md"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            data-ocid="wallet.modal"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              data-ocid="wallet.close_button"
            >
              <X className="w-5 h-5" />
            </button>

            {/* MetaMask header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">MetaMask</h3>
                <p className="text-xs text-muted-foreground">
                  Connect your wallet
                </p>
              </div>
            </div>

            {walletAddress ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 p-3 rounded-xl bg-neon-cyan/10 border border-neon-cyan/20">
                  <CheckCircle className="w-4 h-4 text-neon-cyan" />
                  <span className="text-sm text-neon-cyan font-mono">
                    {walletAddress.slice(0, 10)}...{walletAddress.slice(-8)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Wallet connected successfully
                </p>
                <Button
                  variant="outline"
                  className="w-full rounded-full border-destructive/40 text-destructive hover:bg-destructive/10"
                  onClick={handleDisconnect}
                  data-ocid="wallet.delete_button"
                >
                  Disconnect Wallet
                </Button>
              </div>
            ) : step === "connect" ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Enter your Ethereum wallet address to connect
                </p>
                <Input
                  placeholder="0x1234...abcd"
                  value={inputAddr}
                  onChange={(e) => setInputAddr(e.target.value)}
                  className="bg-secondary border-border rounded-xl font-mono text-sm"
                  data-ocid="wallet.input"
                />
                <div className="flex items-center gap-2 p-3 rounded-xl bg-secondary border border-border">
                  <AlertCircle className="w-4 h-4 text-yellow-400 shrink-0" />
                  <p className="text-xs text-muted-foreground">
                    This is a simulation. No real transactions will occur.
                  </p>
                </div>
                <Button
                  className="w-full rounded-full gradient-btn text-white border-0"
                  onClick={handleConnect}
                  data-ocid="wallet.confirm_button"
                >
                  Connect
                </Button>
              </div>
            ) : step === "confirm" ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Confirm connection to:
                </p>
                <div className="p-3 rounded-xl bg-secondary border border-border">
                  <p className="font-mono text-sm text-foreground break-all">
                    {inputAddr}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 rounded-full"
                    onClick={() => setStep("connect")}
                    data-ocid="wallet.cancel_button"
                  >
                    Back
                  </Button>
                  <Button
                    className="flex-1 rounded-full gradient-btn text-white border-0"
                    onClick={handleConfirm}
                    data-ocid="wallet.confirm_button"
                  >
                    Confirm
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 py-4">
                <CheckCircle className="w-12 h-12 text-neon-cyan" />
                <p className="text-foreground font-semibold">Connected!</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
