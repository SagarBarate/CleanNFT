# CleanNFT Frontend Web App

A scalable, green-themed, public-facing web app for CleanNFT — the sustainability-driven blockchain recycling project.

## 🌿 Features

- **Green Theme**: Clean, eco-friendly design with #00A86B (Clean Green) and #A3FFB0 (Mint Glow) color palette
- **MetaMask-Inspired Tone**: Concise, confident, modern, and Web3-forward copy
- **NFT Gallery**: Dynamic NFT listing with filters, table view, and detail drawer
- **Chat Widget**: Floating chat button with webhook/local storage modes
- **Responsive Design**: Mobile-first, works on all breakpoints
- **Serverless**: Frontend-only, deployable to Netlify

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Edit .env.local with your API endpoints
```

### Development

```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

### Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🌍 Environment Variables

All environment variables must start with `NEXT_PUBLIC_` for client-side access:

```env
NEXT_PUBLIC_APP_NAME=CleanNFT
NEXT_PUBLIC_CUSTOMER_BASE_URL=https://your-customer-api-url.com
NEXT_PUBLIC_ADMIN_BASE_URL=https://your-admin-api-url.com
NEXT_PUBLIC_CHAT_MODE=local
```

### Chat Modes

- **`local`**: Saves messages to localStorage (for development)
- **`webhook`**: POSTs messages to `${NEXT_PUBLIC_CUSTOMER_BASE_URL}/api/webhooks/site-chat`

## 📦 Deployment to Netlify

1. **Build Command**: `npm run build`
2. **Publish Directory**: `.next`
3. **Environment Variables**: Add all `NEXT_PUBLIC_*` variables in Netlify dashboard

### Netlify Configuration

The `netlify.toml` file is already configured for Next.js deployment.

## 🗂️ Project Structure

```
src/
  app/                    # Next.js App Router pages
    page.tsx              # Landing page
    about/                # About page
    nfts/                 # NFT gallery page
    docs/                 # Documentation page
    contact/              # Contact page
    privacy/              # Privacy policy
    terms/                # Terms & conditions
    layout.tsx            # Root layout with Header, Footer, ChatWidget
  components/
    chat/                 # Chat widget components
    layout/               # Header and Footer
    nft/                  # NFT gallery components
    ui/                   # shadcn/ui components
    providers/            # React Query provider
  lib/
    api/                  # API client utilities
    utils/                # Utility functions
  content/                # Content files (JSON)
  styles/                 # Theme CSS
```

## 🎨 Design System

### Color Palette

- **Primary Green**: `#00A86B`
- **Accent Mint**: `#A3FFB0`
- **Dark Background**: `#0B0F0E`
- **Text Light**: `#F5F5F5`
- **Text Dark**: `#1A1A1A`

### Typography

- **Font**: Geist Sans (default), Geist Mono (code)
- **Style**: Minimalist, bold headings, clean sans-serif

### Components

All components use TailwindCSS with custom green theme extensions. See `src/styles/theme.css` for custom utilities.

## 📄 Pages

- **`/`**: Landing page with hero, features, reviews, and market trend sections
- **`/about`**: CleanNFT mission, sustainability focus, blockchain benefits
- **`/nfts`**: NFT gallery with filters, grid/table view, and detail drawer
- **`/docs`**: Project documentation, architecture, FAQ
- **`/contact`**: Contact form integrated with chat webhook
- **`/privacy`**: Privacy policy
- **`/terms`**: Terms & conditions

## 🔌 API Integration

### NFT API

```typescript
import { fetchNFTs, fetchNFTById } from "@/lib/api/nfts";

// Fetch NFTs with filters
const nfts = await fetchNFTs({
  status: "minted",
  collection: "Recycling Heroes",
  page: 1,
  limit: 20,
});

// Fetch single NFT
const nft = await fetchNFTById("nft-id");
```

### Chat API

```typescript
import { sendChatMessage } from "@/lib/api/chat";

// Send chat message
const response = await sendChatMessage({
  name: "John Doe",
  email: "john@example.com",
  message: "Hello, I need help with...",
});
```

## 🧪 Testing

```bash
# Run linting
npm run lint

# Type checking
npx tsc --noEmit
```

## 📚 Tech Stack

- **Next.js 15** (App Router)
- **React 19** + **TypeScript**
- **TailwindCSS 4**
- **shadcn/ui** + **lucide-react**
- **React Query** (TanStack Query)
- **React Hook Form** + **Zod**
- **Framer Motion** (animations)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

ISC License - See LICENSE file for details

---

**🌱 Built with ❤️ for a sustainable future**
