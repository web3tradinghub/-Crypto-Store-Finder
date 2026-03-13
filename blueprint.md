# Project Overview
This is a "WalletConnect Grid Finder" application built with Next.js (App Router), focusing on finding crypto-accepting merchants globally. It features a cyberpunk-inspired aesthetic with dark/light modes, AI-powered search, and a "Grid" theme.

## Features & Styles
- **Cyberpunk UI**: High-contrast colors (#00FF94 neon green), mono-spaced fonts, and terminal-like aesthetics.
- **AI-Powered Search**: Uses an AI endpoint to parse natural language queries into location and category.
- **Dark/Light Mode**: User-switchable themes with consistent branding.
- **Merchant Details**: Detailed view for merchants including categories, coordinates, and reviews.
- **Wallet Integration**: Mock wallet connection (MetaMask, WalletConnect, etc.).
- **PWA Support**: Installable as a progressive web app.
- **Navigation**: Fixed navbar at `top-0` with logo and utility links.
- **Scrolling Ticker**: A neon green ticker bar below the navbar showing official partnerships and announcements.

## Current Tasks
1. **Status Bar Removal**: Removed the top status bar from `src/components/Hero.tsx` that contained "WALLETCONNECT GRID_FINDER", "MAINNET LIVE", "847 NODES", and "v2.4.1".
2. **Navbar Simplification**: The navbar in `src/app/page.tsx` has been simplified to only include the brand logo/text on the left and utility buttons (Theme, List Store, Connect Wallet) on the right.
3. **Fixed Navigation**: Confirmed the navbar is positioned at `fixed top-0`.
4. **Branding consistency**: Ensured "WALLETCONNECT GRID_FINDER" is only present in the primary navbar with the official logo.
5. **Forced Dynamic Rendering**: Added `export const dynamic = 'force-dynamic';` to `src/app/page.tsx`, `src/app/api/search/route.ts`, and `src/app/api/venues/route.js` to ensure real-time data fetching and avoid static caching issues.
6. **Improved Merchant Deduplication**: Enhanced the `deduplicateMerchants` function in `src/app/api/search/route.ts` to improve duplicate detection by normalizing names (removing special characters and truncating) and checking coordinates rounded to 3 decimal places. It now prioritizes maintaining merchants with images when duplicates are found.
7. **Navbar Logo Size Increase**: Increased the navbar logo size in `src/app/page.tsx` to 120x120px for better visibility and branding impact.
8. **Scrolling Ticker Bar**: Added a fixed scrolling ticker bar below the navbar in `src/app/page.tsx` with a `@keyframes ticker` animation in `src/app/globals.css`.
9. **VIP Store Update**: Added "94° | SPECIALTY COFFEE BRAND" in Lisboa, Portugal to the top of the `VIP_PARTNERS` array in `src/data/vip-partners.ts`.
