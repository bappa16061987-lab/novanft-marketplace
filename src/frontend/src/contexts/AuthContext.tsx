import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { UserProfile, UserRole } from "../backend.d";
import { useActor } from "../hooks/useActor";

interface AuthContextType {
  profile: UserProfile | null;
  role: UserRole | null;
  isLoading: boolean;
  isAdmin: boolean;
  walletAddress: string | null;
  refreshProfile: () => Promise<void>;
  setWalletAddress: (addr: string | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { actor, isFetching } = useActor();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [walletAddress, setWalletAddressState] = useState<string | null>(
    localStorage.getItem("walletAddress"),
  );

  const refreshProfile = useCallback(async () => {
    if (!actor) return;
    try {
      const [p, r] = await Promise.all([
        actor.getCallerUserProfile(),
        actor.getCallerUserRole(),
      ]);
      setProfile(p);
      setRole(r);
    } catch {
      setProfile(null);
      setRole(null);
    } finally {
      setIsLoading(false);
    }
  }, [actor]);

  const setWalletAddress = (addr: string | null) => {
    setWalletAddressState(addr);
    if (addr) localStorage.setItem("walletAddress", addr);
    else localStorage.removeItem("walletAddress");
  };

  const logout = () => {
    setProfile(null);
    setRole(null);
    setWalletAddress(null);
  };

  useEffect(() => {
    if (!isFetching && actor) {
      refreshProfile();
    } else if (!isFetching && !actor) {
      setIsLoading(false);
    }
  }, [actor, isFetching, refreshProfile]);

  const isAdmin = role === "admin";

  return (
    <AuthContext.Provider
      value={{
        profile,
        role,
        isLoading,
        isAdmin,
        walletAddress,
        refreshProfile,
        setWalletAddress,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
