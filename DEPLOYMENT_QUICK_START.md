# 🚀 CleanNFT Deployment Quick Start Guide

## Overview
This guide provides a quick reference for deploying the three frontend applications together.

## Deployment Architecture

```
┌─────────────────────────────────────────┐
│     Frontend Web App (Main Entry)       │
│     https://cleannft.com                │
│     - Next.js 15                        │
│     - Links to PWA and Admin Portal     │
└─────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
┌───────▼────────┐    ┌─────────▼────────┐
│  Users Portal │    │  Admin Portal    │
│  /pwa          │    │  /admin          │
│  Vite + React  │    │  Create React App│
└────────────────┘    └──────────────────┘
```

## Quick Deployment Steps

### Option 1: Separate Deployments (Recommended for Flexibility)

#### Step 1: Deploy Frontend Web App
```bash
cd frontend-webapp/frontend-webapp
npm install
npm run build
```

**Netlify:**
- Create new site
- Build command: `npm run build`
- Publish directory: `.next`
- Environment variables:
  ```
  NEXT_PUBLIC_ADMIN_PORTAL_URL=https://admin.cleannft.com
  NEXT_PUBLIC_USERS_PORTAL_URL=https://users.cleannft.com
  NEXT_PUBLIC_CUSTOMER_BASE_URL=https://api.cleannft.com
  NEXT_PUBLIC_ADMIN_BASE_URL=https://api.cleannft.com
  NEXT_PUBLIC_CHAT_MODE=webhook
  ```

**Vercel:**
- Import project
- Framework: Next.js (auto-detected)
- Add same environment variables as above

#### Step 2: Deploy Users Portal
```bash
cd recycling-pwa
npm install
npm run build
```

**Netlify:**
- Create new site
- Build command: `npm run build`
- Publish directory: `dist`
- Environment variables:
  ```
  VITE_API_BASE_URL=https://api.cleannft.com
  VITE_CONTRACT_ADDRESS=0x9732e6BB31742f9FA4fd650cE20aD595983B3651
  VITE_MUMBAI_RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/YOUR_KEY
  VITE_IPFS_GATEWAY=https://gateway.pinata.cloud/ipfs/
  ```
- Custom domain: `pwa.cleannft.com`

**Vercel:**
- Import project
- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Add environment variables and custom domain

#### Step 3: Deploy Admin Portal
```bash
cd admin-portal
npm install
npm run build
```

**Netlify:**
- Create new site
- Build command: `npm run build`
- Publish directory: `build`
- Environment variables:
  ```
  REACT_APP_API_BASE_URL=https://api.cleannft.com/api
  REACT_APP_CONTRACT_ADDRESS=0x9732e6BB31742f9FA4fd650cE20aD595983B3651
  REACT_APP_MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
  REACT_APP_IPFS_GATEWAY=https://gateway.pinata.cloud/ipfs/
  REACT_APP_ADMIN_PUBLIC_ADDRESS=0xYourAdminEOA
  REACT_APP_NETWORK_ID=80001
  ```
- Custom domain: `admin.cleannft.com`

**Vercel:**
- Import project
- Framework: Create React App
- Build command: `npm run build`
- Output directory: `build`
- Add environment variables and custom domain

### Option 2: Unified Deployment (Path-based)

#### Step 1: Configure for Subdirectory Deployment

**Users Portal:**
```typescript
// vite.config.ts
export default defineConfig({
  base: '/pwa',
  // ... rest of config
})
```

**Admin Portal:**
```json
// package.json
{
  "homepage": "/admin"
}
```

#### Step 2: Build and Deploy

**Option A: Netlify with Monorepo**
1. Create `netlify.toml` in root:
```toml
[build]
  command = "cd frontend-webapp/frontend-webapp && npm run build"
  publish = "frontend-webapp/frontend-webapp/.next"

[[redirects]]
  from = "/pwa/*"
  to = "/pwa/index.html"
  status = 200

[[redirects]]
  from = "/admin/*"
  to = "/admin/index.html"
  status = 200
```

2. Build PWA and Admin Portal separately and copy to public folders

**Option B: Deploy Frontend Web App and Copy Builds**
1. Build all three apps
2. Copy `recycling-pwa/dist/*` to `frontend-webapp/frontend-webapp/public/pwa/`
3. Copy `admin-portal/build/*` to `frontend-webapp/frontend-webapp/public/admin/`
4. Deploy frontend web app

## Environment Variables Summary

### Frontend Web App
| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_ADMIN_PORTAL_URL` | Admin portal URL | `https://admin.cleannft.com` |
| `NEXT_PUBLIC_USERS_PORTAL_URL` | Users Portal URL | `https://users.cleannft.com` |
| `NEXT_PUBLIC_CUSTOMER_BASE_URL` | Backend API URL | `https://api.cleannft.com` |
| `NEXT_PUBLIC_ADMIN_BASE_URL` | Admin API URL | `https://api.cleannft.com` |
| `NEXT_PUBLIC_CHAT_MODE` | Chat mode | `webhook` |

### Users Portal
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `https://api.cleannft.com` |
| `VITE_CONTRACT_ADDRESS` | NFT contract address | `0x9732e6BB...` |
| `VITE_MUMBAI_RPC_URL` | Polygon RPC endpoint | `https://polygon-mumbai...` |
| `VITE_IPFS_GATEWAY` | IPFS gateway URL | `https://gateway.pinata.cloud/ipfs/` |

### Admin Portal
| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_API_BASE_URL` | Backend API URL | `https://api.cleannft.com/api` |
| `REACT_APP_CONTRACT_ADDRESS` | NFT contract address | `0x9732e6BB...` |
| `REACT_APP_MUMBAI_RPC_URL` | Polygon RPC endpoint | `https://rpc-mumbai...` |
| `REACT_APP_IPFS_GATEWAY` | IPFS gateway URL | `https://gateway.pinata.cloud/ipfs/` |
| `REACT_APP_ADMIN_PUBLIC_ADDRESS` | Admin wallet address | `0xYourAdminEOA` |
| `REACT_APP_NETWORK_ID` | Network ID | `80001` |

## Testing Checklist

### Pre-Deployment Testing
- [ ] All apps build successfully
- [ ] Environment variables are set correctly
- [ ] Links in Header component work
- [ ] API endpoints are accessible

### Post-Deployment Testing
- [ ] Frontend Web App loads correctly
- [ ] Users Portal link works from main app
- [ ] Admin Portal link works from main app
- [ ] Users Portal loads independently
- [ ] Admin Portal loads independently
- [ ] API calls work from all apps
- [ ] Wallet connections work
- [ ] PWA installation prompt appears
- [ ] Service worker registers correctly
- [ ] Responsive design works on all devices

## Common Issues & Solutions

### Issue: Links between apps don't work
**Solution:**
- Verify environment variables are set in deployment platform
- Check URLs are accessible (not blocked by CORS)
- Ensure HTTPS is enabled on all deployments

### Issue: PWA not installing
**Solution:**
- Verify HTTPS is enabled
- Check `manifest.json` is valid
- Verify service worker is registered
- Run Lighthouse audit

### Issue: Build fails
**Solution:**
- Check Node.js version (should be 18+)
- Verify all dependencies are in `package.json`
- Check for TypeScript errors
- Verify environment variables are set

### Issue: API calls fail
**Solution:**
- Verify API URLs are correct
- Check CORS configuration on backend
- Verify API is deployed and accessible
- Check browser console for errors

## Deployment Platforms Comparison

| Feature | Netlify | Vercel | AWS S3 + CloudFront |
|---------|---------|--------|---------------------|
| Next.js Support | ✅ Excellent | ✅ Excellent | ⚠️ Manual setup |
| PWA Support | ✅ Excellent | ✅ Excellent | ✅ Good |
| Build Time | Fast | Very Fast | N/A |
| Free Tier | Generous | Generous | Limited |
| Custom Domains | ✅ Free | ✅ Free | ⚠️ Paid |
| Environment Variables | ✅ Easy | ✅ Easy | ⚠️ Manual |
| Path-based Routing | ✅ Easy | ✅ Easy | ⚠️ Complex |

## Recommended Setup

**For Production:**
1. **Frontend Web App**: Deploy to Vercel (best Next.js support)
2. **Users Portal**: Deploy to Netlify (excellent PWA support)
3. **Admin Portal**: Deploy to Netlify (straightforward deployment)

**For Development:**
- Use separate local ports:
  - Frontend Web App: `http://localhost:3000`
  - Users Portal: `http://localhost:5173`
  - Admin Portal: `http://localhost:3001`

## Next Steps

1. Choose deployment platform(s)
2. Set up environment variables
3. Deploy each app
4. Test integration
5. Set up monitoring
6. Document URLs and access

---

**Need Help?** Refer to `DEPLOYMENT_CHECKLIST.md` for detailed step-by-step instructions.





