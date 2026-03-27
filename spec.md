# NovaNFT Marketplace

## Current State
New project with empty backend and no frontend.

## Requested Changes (Diff)

### Add
- Homepage: hero section with animated background, platform stats (volume, users, NFTs), CTA buttons
- Auth system: login/signup with username/password, stored in backend
- Wallet connection: MetaMask UI simulation (connect wallet button, wallet address display)
- NFT marketplace: grid of NFT listings with image, name, price, creator, buy button
- User dashboard: balance, earnings, referral bonus, owned NFTs, transaction history
- Referral system: unique invite link per user, rewards tracking, referral leaderboard
- Admin panel: manage users (view, ban, adjust balance), manage NFTs (add, edit, remove, feature)
- Dark neon/crypto theme with smooth animations
- Mobile responsive design

### Modify
- N/A (new project)

### Remove
- N/A

## Implementation Plan
1. Backend: User management with roles (user/admin), NFT listings CRUD, wallet simulation, referral system, balance/earnings tracking
2. Frontend: Multi-page app with React Router - Home, Marketplace, Dashboard, Admin, Auth pages
3. Components: NFT card grid, stats counter, wallet modal, referral widget, admin tables
4. Authorization component for role-based access (user vs admin)
5. Neon dark theme with OKLCH colors, gradient effects, glassmorphism cards
