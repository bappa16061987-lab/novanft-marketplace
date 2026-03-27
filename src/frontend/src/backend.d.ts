import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type UserId = string;
export type Time = bigint;
export interface Nft {
    id: NftId;
    creator: Principal;
    listedAt: Time;
    owner?: Principal;
    name: string;
    description: string;
    isSold: boolean;
    imageUrl: string;
    isFeatured: boolean;
    category: string;
    price: bigint;
}
export interface T {
    referralCode: string;
    balance: bigint;
    userId: UserId;
    walletAddress?: string;
    earnings: bigint;
    referredBy?: UserId;
    referralBonus: bigint;
}
export interface ReferralStats {
    totalBonus: bigint;
    referredCount: bigint;
}
export type NftId = bigint;
export interface PlatformStats {
    totalVolume: bigint;
    totalNftsSold: bigint;
    totalUsers: bigint;
}
export interface UserProfile {
    referralCode: string;
    balance: bigint;
    userId: UserId;
    walletAddress?: string;
    earnings: bigint;
    referredBy?: UserId;
    referralBonus: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    adjustUserBalance(user: Principal, amount: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    banUser(user: Principal): Promise<void>;
    buyNft(id: NftId): Promise<void>;
    createNft(input: Nft): Promise<void>;
    getAllNfts(): Promise<Array<Nft>>;
    getAllUserProfiles(): Promise<Array<UserProfile>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFeaturedNfts(): Promise<Array<Nft>>;
    getNft(id: NftId): Promise<Nft>;
    getPlatformStats(): Promise<PlatformStats>;
    getReferralStats(userId: UserId): Promise<ReferralStats>;
    getUnsoldNfts(): Promise<Array<Nft>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    registerProfile(profile: T): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setReferralBonus(amount: bigint): Promise<void>;
    toggleFeatureNft(id: NftId): Promise<boolean>;
    updateCallerProfile(updated: T): Promise<void>;
}
