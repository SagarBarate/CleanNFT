# 🚀 CleanNFT Frontend Deployment Checklist

## Overview
This checklist covers deploying three frontend applications together:
1. **Frontend Web App** (Next.js) - Main entry point
2. **Users Portal** (Vite + React) - Accessible via link from main app
3. **Admin Portal** (Create React App) - Accessible via link from main app

## Deployment Strategy Options

### Option 1: Unified Deployment (Recommended)
Deploy all three apps on the same platform with path-based routing:
- Frontend Web App: `/` (root)
- Users Portal: `/users` or subdomain
- Admin Portal: `/admin` or subdomain

### Option 2: Separate Deployments with Environment Variables
Deploy each app separately and configure links via environment variables:
- Frontend Web App: `https://cleannft.com`
- Users Portal: `https://users.cleannft.com` or `https://cleannft.com/users`
- Admin Portal: `https://admin.cleannft.com` or `https://cleannft.com/admin`

---

## Pre-Deployment Checklist

### 1. Environment Configuration

#### Frontend Web App (`frontend-webapp/frontend-webapp/`)
- [ ] Create `.env.production` file
- [ ] Set `NEXT_PUBLIC_ADMIN_PORTAL_URL` to production admin portal URL
- [ ] Set `NEXT_PUBLIC_USERS_PORTAL_URL` to production PWA URL
- [ ] Set `NEXT_PUBLIC_CUSTOMER_BASE_URL` to backend API URL
- [ ] Set `NEXT_PUBLIC_ADMIN_BASE_URL` to admin API URL
- [ ] Set `NEXT_PUBLIC_APP_NAME=CleanNFT`
- [ ] Set `NEXT_PUBLIC_CHAT_MODE=webhook` (for production)

**Example `.env.production`:**
```env
NEXT_PUBLIC_APP_NAME=CleanNFT
NEXT_PUBLIC_CUSTOMER_BASE_URL=https://api.cleannft.com
NEXT_PUBLIC_ADMIN_BASE_URL=https://api.cleannft.com
NEXT_PUBLIC_ADMIN_PORTAL_URL=https://admin.cleannft.com
NEXT_PUBLIC_USERS_PORTAL_URL=https://users.cleannft.com
NEXT_PUBLIC_CHAT_MODE=webhook
```

#### Users Portal (`recycling-pwa/`)
- [ ] Create `.env.production` file
- [ ] Set `VITE_API_BASE_URL` to backend API URL
- [ ] Set `VITE_CONTRACT_ADDRESS` to deployed contract address
- [ ] Set `VITE_MUMBAI_RPC_URL` to Polygon RPC endpoint
- [ ] Set `VITE_IPFS_GATEWAY` to IPFS gateway URL
- [ ] Set `VITE_BLOCKCHAIN_NETWORK` if needed

**Example `.env.production`:**
```env
VITE_API_BASE_URL=https://api.cleannft.com
VITE_CONTRACT_ADDRESS=0x9732e6BB31742f9FA4fd650cE20aD595983B3651
VITE_MUMBAI_RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/YOUR_API_KEY
VITE_IPFS_GATEWAY=https://gateway.pinata.cloud/ipfs/
VITE_BLOCKCHAIN_NETWORK=mumbai
```

#### Admin Portal (`admin-portal/`)
- [ ] Create `.env.production` file
- [ ] Set `REACT_APP_API_BASE_URL` to backend API URL
- [ ] Set `REACT_APP_CONTRACT_ADDRESS` to deployed contract address
- [ ] Set `REACT_APP_MUMBAI_RPC_URL` to Polygon RPC endpoint
- [ ] Set `REACT_APP_IPFS_GATEWAY` to IPFS gateway URL
- [ ] Set `REACT_APP_ADMIN_PUBLIC_ADDRESS` to admin wallet address
- [ ] Set `REACT_APP_NETWORK_ID=80001` (Mumbai testnet)
- [ ] Set `REACT_APP_OPERATOR_ADDRESS` if needed

**Example `.env.production`:**
```env
REACT_APP_API_BASE_URL=https://api.cleannft.com/api
REACT_APP_CONTRACT_ADDRESS=0x9732e6BB31742f9FA4fd650cE20aD595983B3651
REACT_APP_MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
REACT_APP_IPFS_GATEWAY=https://gateway.pinata.cloud/ipfs/
REACT_APP_ADMIN_PUBLIC_ADDRESS=0xYourAdminEOA
REACT_APP_NETWORK_ID=80001
```

### 2. Build Configuration

#### Frontend Web App
- [ ] Verify `next.config.ts` is properly configured
- [ ] Check `netlify.toml` or create deployment config
- [ ] Test build locally: `npm run build`
- [ ] Verify build output in `.next/` directory

#### Users Portal
- [ ] Verify `vite.config.ts` is properly configured
- [ ] Check `base` path in `vite.config.ts` if deploying to subdirectory
- [ ] Test build locally: `npm run build`
- [ ] Verify build output in `dist/` directory
- [ ] Check service worker configuration in `public/sw.js`
- [ ] Verify PWA manifest in `public/manifest.json`

#### Admin Portal
- [ ] Verify `package.json` build script
- [ ] Check `homepage` in `package.json` if deploying to subdirectory
- [ ] Test build locally: `npm run build`
- [ ] Verify build output in `build/` directory

### 3. Code Updates

#### Frontend Web App
- [ ] Verify links in `Header.tsx` point to correct URLs
- [ ] Update `Header.tsx` if needed to use relative paths or full URLs
- [ ] Test navigation links work correctly
- [ ] Verify all internal routes work

#### Users Portal
- [ ] Verify API endpoints are correctly configured
- [ ] Test wallet connection functionality
- [ ] Verify QR code scanning works
- [ ] Test PWA installation prompt

#### Admin Portal
- [ ] Verify API endpoints are correctly configured
- [ ] Test wallet connection functionality
- [ ] Verify admin authentication works
- [ ] Test NFT minting functionality

---

## Deployment Platforms

### Option A: Netlify (Recommended for Next.js)

#### Frontend Web App
- [ ] Create Netlify site
- [ ] Connect GitHub/GitLab repository
- [ ] Set build command: `npm run build`
- [ ] Set publish directory: `.next`
- [ ] Add environment variables in Netlify dashboard
- [ ] Configure redirects in `netlify.toml`:
  ```toml
  [[redirects]]
    from = "/*"
    to = "/index.html"
    status = 200
  ```
- [ ] Deploy and verify

#### Users Portal
- [ ] Create separate Netlify site OR deploy as subdirectory
- [ ] If separate site:
  - Set build command: `npm run build`
  - Set publish directory: `dist`
  - Add environment variables
  - Set custom domain: `pwa.cleannft.com`
- [ ] If subdirectory:
  - Update `vite.config.ts` with `base: '/users'`
  - Configure Netlify redirects
- [ ] Deploy and verify

#### Admin Portal
- [ ] Create separate Netlify site OR deploy as subdirectory
- [ ] If separate site:
  - Set build command: `npm run build`
  - Set publish directory: `build`
  - Add environment variables
  - Set custom domain: `admin.cleannft.com`
- [ ] If subdirectory:
  - Update `package.json` with `"homepage": "/admin"`
  - Configure Netlify redirects
- [ ] Deploy and verify

### Option B: Vercel (Recommended for Next.js)

#### Frontend Web App
- [ ] Create Vercel project
- [ ] Connect GitHub/GitLab repository
- [ ] Framework preset: Next.js (auto-detected)
- [ ] Add environment variables in Vercel dashboard
- [ ] Deploy and verify

#### Users Portal
- [ ] Create separate Vercel project
- [ ] Framework preset: Vite
- [ ] Set build command: `npm run build`
- [ ] Set output directory: `dist`
- [ ] Add environment variables
- [ ] Configure custom domain: `pwa.cleannft.com`
- [ ] Deploy and verify

#### Admin Portal
- [ ] Create separate Vercel project
- [ ] Framework preset: Create React App
- [ ] Set build command: `npm run build`
- [ ] Set output directory: `build`
- [ ] Add environment variables
- [ ] Configure custom domain: `admin.cleannft.com`
- [ ] Deploy and verify

### Option C: Unified Deployment (Single Platform)

#### Using Netlify with Path-based Routing
1. **Create Netlify site for Frontend Web App**
   - [ ] Deploy frontend web app to root path
   - [ ] Configure redirects

2. **Deploy Users Portal as subdirectory**
   - [ ] Update `vite.config.ts`:
     ```typescript
     export default defineConfig({
       base: '/users',
       // ... rest of config
     })
     ```
   - [ ] Update `public/manifest.json` start_url to `/users`
   - [ ] Build and copy `dist/` contents to `public/users/` in frontend web app
   - [ ] OR configure Netlify to build both and serve from `/users` path

3. **Deploy Admin Portal as subdirectory**
   - [ ] Update `package.json`:
     ```json
     {
       "homepage": "/admin"
     }
     ```
   - [ ] Build and copy `build/` contents to `public/admin/` in frontend web app
   - [ ] OR configure Netlify to build both and serve from `/admin` path

4. **Update Frontend Web App Links**
   - [ ] Update `Header.tsx`:
     ```typescript
     const portalLinks = {
       admin: process.env.NEXT_PUBLIC_ADMIN_PORTAL_URL || "/admin",
       recycling: process.env.NEXT_PUBLIC_USERS_PORTAL_URL || "/users",
     };
     ```

---

## Post-Deployment Checklist

### 1. Testing

#### Frontend Web App
- [ ] Test all pages load correctly
- [ ] Test navigation links work
- [ ] Test "Users Portal" link opens correctly
- [ ] Test "Admin Portal" link opens correctly
- [ ] Test NFT gallery functionality
- [ ] Test contact form
- [ ] Test responsive design on mobile/tablet/desktop
- [ ] Test dark mode (if applicable)

#### Users Portal
- [ ] Test app loads from main app link
- [ ] Test app loads independently (if separate domain)
- [ ] Test QR code scanning
- [ ] Test wallet connection
- [ ] Test NFT claiming functionality
- [ ] Test PWA installation prompt
- [ ] Test offline functionality
- [ ] Test service worker registration
- [ ] Verify API calls work correctly

#### Admin Portal
- [ ] Test app loads from main app link
- [ ] Test app loads independently (if separate domain)
- [ ] Test admin authentication
- [ ] Test wallet connection
- [ ] Test NFT minting
- [ ] Test user management
- [ ] Test bin management
- [ ] Test dashboard statistics
- [ ] Verify API calls work correctly

### 2. Cross-App Integration

- [ ] Test links from Frontend Web App to Users Portal
- [ ] Test links from Frontend Web App to Admin Portal
- [ ] Verify all apps can access backend API
- [ ] Test authentication flow (if shared)
- [ ] Test data consistency across apps

### 3. Security & Performance

- [ ] Verify HTTPS is enabled on all deployments
- [ ] Test CORS configuration
- [ ] Verify environment variables are not exposed in client-side code
- [ ] Test API rate limiting
- [ ] Run Lighthouse audit on all three apps
- [ ] Check PWA score (should be >90)
- [ ] Verify service worker caching strategy
- [ ] Test load times and optimize if needed

### 4. Monitoring & Analytics

- [ ] Set up error tracking (Sentry, LogRocket, etc.)
- [ ] Set up analytics (Google Analytics, Plausible, etc.)
- [ ] Configure uptime monitoring
- [ ] Set up performance monitoring
- [ ] Configure alerts for build failures
- [ ] Set up logging for API errors

### 5. Documentation

- [ ] Document deployment URLs
- [ ] Document environment variables
- [ ] Document build process
- [ ] Document rollback procedure
- [ ] Create runbook for common issues
- [ ] Update README with deployment information

---

## Environment Variables Reference

### Frontend Web App
```env
NEXT_PUBLIC_APP_NAME=CleanNFT
NEXT_PUBLIC_CUSTOMER_BASE_URL=https://api.cleannft.com
NEXT_PUBLIC_ADMIN_BASE_URL=https://api.cleannft.com
NEXT_PUBLIC_ADMIN_PORTAL_URL=https://admin.cleannft.com
NEXT_PUBLIC_USERS_PORTAL_URL=https://users.cleannft.com
NEXT_PUBLIC_CHAT_MODE=webhook
```

### Users Portal
```env
VITE_API_BASE_URL=https://api.cleannft.com
VITE_CONTRACT_ADDRESS=0x9732e6BB31742f9FA4fd650cE20aD595983B3651
VITE_MUMBAI_RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/YOUR_API_KEY
VITE_IPFS_GATEWAY=https://gateway.pinata.cloud/ipfs/
VITE_BLOCKCHAIN_NETWORK=mumbai
```

### Admin Portal
```env
REACT_APP_API_BASE_URL=https://api.cleannft.com/api
REACT_APP_CONTRACT_ADDRESS=0x9732e6BB31742f9FA4fd650cE20aD595983B3651
REACT_APP_MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
REACT_APP_IPFS_GATEWAY=https://gateway.pinata.cloud/ipfs/
REACT_APP_ADMIN_PUBLIC_ADDRESS=0xYourAdminEOA
REACT_APP_NETWORK_ID=80001
REACT_APP_OPERATOR_ADDRESS=0xYourOperatorEOA
```

---

## Troubleshooting

### Common Issues

1. **Links not working between apps**
   - Check environment variables are set correctly
   - Verify URLs are accessible
   - Check CORS configuration
   - Verify HTTPS is enabled

2. **Build failures**
   - Check Node.js version (should be 18+)
   - Verify all dependencies are installed
   - Check for TypeScript errors
   - Verify environment variables are set

3. **PWA not installing**
   - Verify HTTPS is enabled
   - Check manifest.json is valid
   - Verify service worker is registered
   - Check Lighthouse PWA score

4. **API calls failing**
   - Verify API URLs are correct
   - Check CORS configuration
   - Verify API is deployed and accessible
   - Check network requests in browser DevTools

5. **Styling issues**
   - Check if base path is configured correctly
   - Verify asset paths are correct
   - Check for CSS conflicts
   - Verify Tailwind/MUI configuration

---

## Quick Start Commands

### Build all apps locally
```bash
# Frontend Web App
cd frontend-webapp/frontend-webapp
npm install
npm run build

# Users Portal
cd recycling-pwa
npm install
npm run build

# Admin Portal
cd admin-portal
npm install
npm run build
```

### Test builds locally
```bash
# Frontend Web App
cd frontend-webapp/frontend-webapp
npm run build
npm start

# Users Portal
cd recycling-pwa
npm run build
npm run preview

# Admin Portal
cd admin-portal
npm run build
npx serve -s build
```

---

## Next Steps

1. Choose deployment platform (Netlify/Vercel/Other)
2. Set up environment variables
3. Configure build settings
4. Deploy each app
5. Test integration
6. Set up monitoring
7. Document process

---

**Last Updated**: 2025-01-27
**Status**: Ready for deployment





