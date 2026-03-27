import Map "mo:core/Map";
import List "mo:core/List";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Iter "mo:core/Iter";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Types

  type UserId = Text;
  type NftId = Nat;

  module Profile {
    public type T = {
      userId : UserId;
      balance : Nat;
      earnings : Nat;
      referralBonus : Nat;
      walletAddress : ?Text;
      referralCode : Text;
      referredBy : ?UserId;
    };

    public func compare(p1 : T, p2 : T) : Order.Order {
      Text.compare(p1.userId, p2.userId);
    };
  };

  type UserProfile = Profile.T;

  type Nft = {
    id : NftId;
    name : Text;
    description : Text;
    imageUrl : Text;
    price : Nat;
    creator : Principal;
    category : Text;
    listedAt : Time.Time;
    isSold : Bool;
    owner : ?Principal;
    isFeatured : Bool;
  };

  type ReferralStats = {
    referredCount : Nat;
    totalBonus : Nat;
  };

  type PlatformStats = {
    totalVolume : Nat;
    totalUsers : Nat;
    totalNftsSold : Nat;
  };

  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // State
  var nextNftId = 1;

  let userProfiles = Map.empty<Principal, Profile.T>();
  var totalEarnings = 0;
  var totalVolume = 0;
  var totalNftsSold = 0;
  var referralBonusAmount = 10; // Default referral bonus

  let nfts = Map.empty<NftId, Nft>();
  let userReferrals = Map.empty<UserId, List.List<UserId>>();

  // User Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func updateCallerProfile(updated : Profile.T) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update profiles");
    };
    userProfiles.add(caller, updated);
  };

  public shared ({ caller }) func registerProfile(profile : Profile.T) : async () {
    // Registration should be open to guests (no authorization check)
    // The caller will be assigned a role after registration
    userProfiles.add(caller, profile);

    // Handle referral linking
    switch (profile.referredBy) {
      case (?referrerId) {
        let existingReferrals = switch (userReferrals.get(referrerId)) {
          case (null) { List.empty<UserId>() };
          case (?list) { list };
        };
        let newReferrals = existingReferrals.toArray().concat([profile.userId]);
        userReferrals.add(referrerId, List.fromArray(newReferrals));
      };
      case (null) {};
    };
  };

  public query ({ caller }) func getReferralStats(userId : UserId) : async ReferralStats {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view referral stats");
    };
    let referred = switch (userReferrals.get(userId)) {
      case (null) { List.empty<UserId>() };
      case (?list) { list };
    };
    let bonus = switch (userProfiles.get(caller)) {
      case (null) { 0 };
      case (?p) { p.referralBonus };
    };
    {
      referredCount = referred.size();
      totalBonus = bonus;
    };
  };

  public query ({ caller }) func getAllUserProfiles() : async [UserProfile] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can view all user profiles");
    };
    userProfiles.values().toArray().sort();
  };

  public shared ({ caller }) func banUser(user : Principal) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can ban users");
    };
    userProfiles.remove(user);
  };

  public shared ({ caller }) func adjustUserBalance(user : Principal, amount : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (userProfiles.get(user)) {
      case (?profile) {
        let updated = {
          userId = profile.userId;
          balance = profile.balance + amount;
          earnings = profile.earnings;
          referralBonus = profile.referralBonus;
          walletAddress = profile.walletAddress;
          referralCode = profile.referralCode;
          referredBy = profile.referredBy;
        };
        userProfiles.add(user, updated);
      };
      case (null) {
        Runtime.trap("User not found");
      };
    };
  };

  // NFT Listings
  public shared ({ caller }) func createNft(input : Nft) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    let nft : Nft = {
      input with
      id = nextNftId;
      listedAt = Time.now();
      isSold = false;
      owner = null;
      isFeatured = false;
    };
    nfts.add(nextNftId, nft);
    nextNftId += 1;
  };

  public query ({ caller }) func getAllNfts() : async [Nft] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view NFTs");
    };
    nfts.values().toArray();
  };

  public query ({ caller }) func getUnsoldNfts() : async [Nft] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view NFTs");
    };
    nfts.filter(func(_, nft) { not nft.isSold }).values().toArray();
  };

  public query ({ caller }) func getNft(id : NftId) : async Nft {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view NFTs");
    };
    switch (nfts.get(id)) {
      case (?nft) { nft };
      case (null) { Runtime.trap("NFT not found") };
    };
  };

  public shared ({ caller }) func buyNft(id : NftId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can buy NFTs");
    };

    let nft = switch (nfts.get(id)) {
      case (?n) { n };
      case (null) { Runtime.trap("NFT not found") };
    };

    if (nft.isSold) {
      Runtime.trap("NFT already sold");
    };

    let buyerProfile = switch (userProfiles.get(caller)) {
      case (?p) { p };
      case (null) { Runtime.trap("Buyer profile not found") };
    };

    if (buyerProfile.balance < nft.price) {
      Runtime.trap("Insufficient balance");
    };

    // Update buyer balance
    let updatedBuyer = {
      buyerProfile with
      balance = buyerProfile.balance - nft.price;
    };
    userProfiles.add(caller, updatedBuyer);

    // Update seller earnings
    let sellerProfile = switch (userProfiles.get(nft.creator)) {
      case (?p) { p };
      case (null) { Runtime.trap("Seller profile not found") };
    };

    let updatedSeller = {
      sellerProfile with
      earnings = sellerProfile.earnings + nft.price;
    };
    userProfiles.add(nft.creator, updatedSeller);

    // Mark NFT as sold
    let updatedNft = {
      nft with
      isSold = true;
      owner = ?caller;
    };
    nfts.add(id, updatedNft);

    // Update platform stats
    totalVolume += nft.price;
    totalNftsSold += 1;
  };

  // Extras
  public query ({ caller }) func getFeaturedNfts() : async [Nft] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view NFTs");
    };
    nfts.filter(func(_, nft) { nft.isFeatured }).values().toArray();
  };

  public shared ({ caller }) func toggleFeatureNft(id : NftId) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (nfts.get(id)) {
      case (?nft) {
        let updated = {
          nft with
          isFeatured = not nft.isFeatured;
        };
        nfts.add(id, updated);
        updated.isFeatured;
      };
      case (null) {
        Runtime.trap("NFT not found");
      };
    };
  };

  // Admin functions
  public query ({ caller }) func getPlatformStats() : async PlatformStats {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view platform stats");
    };
    {
      totalVolume = totalVolume;
      totalUsers = userProfiles.size();
      totalNftsSold = totalNftsSold;
    };
  };

  public shared ({ caller }) func setReferralBonus(amount : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can set referral bonus");
    };
    referralBonusAmount := amount;
  };

  // Utility functions here
};
