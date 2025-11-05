# 🚀 CleanNFT Frontend Deployment Guide

## Overview

This guide helps you deploy three frontend applications together:
1. **Frontend Web App** (Next.js) - Main entry point at the root
2. **Users Portal** (Vite + React) - Accessible via link from main app
3. **Admin Portal** (Create React App) - Accessible via link from main app

## Deployment Strategy

The Frontend Web App serves as the main entry point with navigation links to both the Users Portal and Admin Portal. All three apps can be:
- Deployed separately on different domains/subdomains
- Deployed together on the same domain with path-based routing
- Accessed independently or through the main app

## Documentation Files

### 📋 [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
**Comprehensive step-by-step checklist** covering:
- Pre-deployment configuration
- Environment variable setup for all three apps
- Build configuration
- Deployment platform options (Netlify, Vercel, AWS)
- Post-deployment testing
- Troubleshooting guide
- Security and performance checks

**Use this for:** Detailed, thorough deployment process

### ⚡ [DEPLOYMENT_QUICK_START.md](./DEPLOYMENT_QUICK_START.md)
**Quick reference guide** with:
- Deployment architecture diagram
- Quick deployment steps
- Environment variables summary table
- Common issues and solutions
- Platform comparison

**Use this for:** Quick deployment reference

### 🔧 [env.production.template](./env.production.template)
**Environment variables template** with:
- All required environment variables for each app
- Example values
- Platform-specific instructions
- Notes and best practices

**Use this for:** Setting up environment variables in your deployment platform

## Quick Start

### 1. Choose Deployment Strategy

**Option A: Separate Deployments (Recommended)**
- Frontend Web App: `https://cleannft.com`
- Users Portal: `https://users.cleannft.com`
- Admin Portal: `https://admin.cleannft.com`

**Option B: Path-based Routing**
- Frontend Web App: `https://cleannft.com`
- Users Portal: `https://cleannft.com/users`
- Admin Portal: `https://cleannft.com/admin`

### 2. Set Up Environment Variables

Use the template in `env.production.template` to set up environment variables in your deployment platform.

**Key Variables:**
- `NEXT_PUBLIC_ADMIN_PORTAL_URL` - Admin portal URL
- `NEXT_PUBLIC_USERS_PORTAL_URL` - Users portal URL
- `VITE_API_BASE_URL` - Backend API URL (Users Portal)
- `REACT_APP_API_BASE_URL` - Backend API URL (Admin)

### 3. Build and Deploy

**Frontend Web App:**
```bash
cd frontend-webapp/frontend-webapp
npm install
npm run build
# Deploy .next/ directory
```

**Users Portal:**
```bash
cd recycling-pwa
npm install
npm run build
# Deploy dist/ directory
```

**Admin Portal:**
```bash
cd admin-portal
npm install
npm run build
# Deploy build/ directory
```

### 4. Test Integration

- [ ] Frontend Web App loads correctly
- [ ] "Users Portal" link works from main app
- [ ] "Admin Portal" link works from main app
- [ ] All apps can access backend API
- [ ] Wallet connections work
- [ ] PWA installation prompt appears

## Current Navigation Structure

The Frontend Web App already has links configured in `Header.tsx`:

```typescript
const portalLinks = {
  admin: process.env.NEXT_PUBLIC_ADMIN_PORTAL_URL || "http://localhost:3000",
  users: process.env.NEXT_PUBLIC_USERS_PORTAL_URL || "http://localhost:5173",
};
```

These links are displayed in:
- Desktop navigation menu
- Mobile navigation menu

## Recommended Platforms

### For Next.js (Frontend Web App)
- **Vercel** - Best Next.js support, automatic deployments
- **Netlify** - Excellent support, easy configuration

### For Vite (Users Portal)
- **Netlify** - Excellent PWA support, automatic deployments
- **Vercel** - Good support, fast builds

### For Create React App (Admin Portal)
- **Netlify** - Straightforward deployment
- **Vercel** - Good support, automatic deployments

## Architecture Diagram

```
┌─────────────────────────────────────────┐
│     Frontend Web App (Main Entry)       │
│     https://cleannft.com                │
│     - Landing Page                      │
│     - NFT Gallery                       │
│     - About, Docs, Contact              │
│     - Links to PWA and Admin Portal     │
└─────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
┌───────▼────────┐    ┌─────────▼────────┐
│  Users Portal │    │  Admin Portal    │
│  /pwa or       │    │  /admin or       │
│  pwa.cleannft  │    │  admin.cleannft  │
│                │    │                  │
│  - QR Scanning │    │  - User Mgmt     │
│  - Dashboard   │    │  - NFT Mgmt      │
│  - Badge System│    │  - Bin Mgmt      │
│  - NFT Claims  │    │  - Analytics     │
└────────────────┘    └──────────────────┘
        │                       │
        └───────────┬───────────┘
                    │
        ┌───────────▼───────────┐
        │   Backend API         │
        │   https://api.cleannft│
        └───────────────────────┘
```

## Environment Variables by App

### Frontend Web App
- `NEXT_PUBLIC_*` - All client-side variables must have this prefix
- Links to PWA and Admin Portal
- API endpoints for NFT gallery

### Users Portal
- `VITE_*` - All variables must have this prefix
- Backend API connection
- Blockchain contract configuration
- IPFS gateway configuration

### Admin Portal
- `REACT_APP_*` - All variables must have this prefix
- Backend API connection
- Blockchain contract configuration
- Admin wallet address

## Testing Checklist

Before going live, ensure:

### Frontend Web App
- [ ] All pages load correctly
- [ ] Navigation links work
- [ ] Recycling PWA link opens correctly
- [ ] Admin Portal link opens correctly
- [ ] NFT gallery displays correctly
- [ ] Contact form works
- [ ] Responsive design works

### Users Portal
- [ ] Loads from main app link
- [ ] Loads independently
- [ ] QR code scanning works
- [ ] Wallet connection works
- [ ] NFT claiming works
- [ ] PWA installation prompt appears
- [ ] Service worker registers

### Admin Portal
- [ ] Loads from main app link
- [ ] Loads independently
- [ ] Admin authentication works
- [ ] Wallet connection works
- [ ] NFT minting works
- [ ] User management works
- [ ] Dashboard displays correctly

## Common Deployment Issues

### Links Not Working
- Verify environment variables are set correctly
- Check URLs are accessible
- Ensure HTTPS is enabled
- Check CORS configuration

### Build Failures
- Check Node.js version (18+)
- Verify all dependencies installed
- Check for TypeScript errors
- Verify environment variables

### PWA Not Installing
- Verify HTTPS enabled
- Check manifest.json is valid
- Verify service worker registered
- Run Lighthouse audit

## Next Steps

1. **Review Documentation**
   - Read `DEPLOYMENT_CHECKLIST.md` for detailed steps
   - Check `DEPLOYMENT_QUICK_START.md` for quick reference
   - Use `env.production.template` for environment setup

2. **Choose Platform**
   - Decide on Netlify, Vercel, or AWS
   - Set up accounts if needed

3. **Configure Environment**
   - Set up environment variables
   - Configure build settings
   - Set up custom domains

4. **Deploy**
   - Deploy each app
   - Test integration
   - Set up monitoring

5. **Monitor**
   - Set up error tracking
   - Configure analytics
   - Set up uptime monitoring

## Support

For detailed instructions, refer to:
- **Detailed Checklist**: `DEPLOYMENT_CHECKLIST.md`
- **Quick Start**: `DEPLOYMENT_QUICK_START.md`
- **Environment Variables**: `env.production.template`

## Files Created

1. ✅ `DEPLOYMENT_CHECKLIST.md` - Comprehensive deployment checklist
2. ✅ `DEPLOYMENT_QUICK_START.md` - Quick reference guide
3. ✅ `env.production.template` - Environment variables template
4. ✅ `DEPLOYMENT_README.md` - This file (overview)

---

**Ready to deploy?** Start with `DEPLOYMENT_QUICK_START.md` for a quick overview, then follow `DEPLOYMENT_CHECKLIST.md` for detailed steps.


