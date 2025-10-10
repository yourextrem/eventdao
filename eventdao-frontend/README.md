# EventDAO - Solana Web3 Events Platform

Platform event terdesentralisasi yang dibangun di atas Solana blockchain menggunakan Rust, Anchor, Next.js, dan TypeScript.

## 🚀 Fitur

- **Event Management**: Buat, kelola, dan ikuti event secara terdesentralisasi
- **Ticket System**: Sistem tiket NFT yang aman dan dapat diverifikasi
- **Wallet Integration**: Dukungan untuk berbagai wallet Solana (Phantom, Solflare)
- **Real-time Updates**: Update status event dan tiket secara real-time
- **Responsive Design**: UI yang responsif dan modern

## 🛠️ Teknologi

### Backend (Solana Program)
- **Rust**: Bahasa pemrograman untuk smart contract
- **Anchor**: Framework untuk pengembangan Solana programs
- **Solana CLI**: Tools untuk deployment dan testing

### Frontend
- **Next.js 15**: React framework dengan App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Solana Web3.js**: Library untuk interaksi dengan Solana blockchain
- **Wallet Adapter**: Integrasi wallet Solana

## 📁 Struktur Proyek

```
eventdao/
├── eventdao-anchor/          # Solana program (Rust + Anchor)
│   └── eventdao/
│       ├── programs/
│       │   └── eventdao/
│       │       └── src/
│       │           └── lib.rs
│       ├── tests/
│       └── Anchor.toml
├── eventdao-frontend/        # Next.js frontend
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── contexts/
│   │   └── idl/
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Rust 1.70+
- Solana CLI 1.17+
- Anchor CLI 0.31+

### Installation

1. **Clone repository**
```bash
git clone <repository-url>
cd eventdao
```

2. **Setup Solana Program**
```bash
cd eventdao-anchor/eventdao
anchor build
```

3. **Setup Frontend**
```bash
cd eventdao-frontend
npm install
npm run dev
```

### Development

1. **Start Solana Test Validator**
```bash
solana-test-validator
```

2. **Deploy Program**
```bash
cd eventdao-anchor/eventdao
anchor deploy
```

3. **Start Frontend**
```bash
cd eventdao-frontend
npm run dev
```

## 📖 Program Structure

### Smart Contract (Rust)

Program EventDAO memiliki struktur berikut:

- **EventDAO**: Account utama yang menyimpan metadata global
- **Event**: Account untuk setiap event yang dibuat
- **Ticket**: Account untuk setiap tiket yang dibeli

### Instructions

1. `initialize()`: Inisialisasi EventDAO
2. `create_event()`: Membuat event baru
3. `buy_ticket()`: Membeli tiket untuk event
4. `use_ticket()`: Menggunakan tiket (check-in)

## 🔧 Configuration

### Environment Variables

Buat file `.env.local` di folder frontend:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Solana Configuration
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_RPC_ENDPOINT=https://api.devnet.solana.com
NEXT_PUBLIC_PROGRAM_ID=GNe8wwPpE95PUCpSJsYf32Z3HLtL5CwaxoVRmd7DFsCH
```

### Anchor Configuration

File `Anchor.toml` di folder eventdao-anchor:

```toml
[features]
seeds = false
skip-lint = false

[programs.devnet]
eventdao = "GNe8wwPpE95PUCpSJsYf32Z3HLtL5CwaxoVRmd7DFsCH"

[registry]
url = "https://api.apr.dev"

[provider]
cluster = "Devnet"
wallet = "~/.config/solana/id.json"

[scripts]
test = "yarn run ts-mocha -p ./tsconfig.json -t 1000000 tests/**/*.ts"
```

## 🧪 Testing

### Test Solana Program
```bash
cd eventdao-anchor/eventdao
anchor test
```

### Test Frontend
```bash
cd eventdao-frontend
npm test
```

## 📝 API Reference

### Frontend Hooks

#### `useEventDAO()`

Hook utama untuk interaksi dengan Solana program.

```typescript
const {
  loading,
  error,
  initializeEventDAO,
  createEvent,
  buyTicket,
  submitTicket,
  fetchAllEvents,
} = useEventDAO();
```

### Components

#### `EventCard`

Komponen untuk menampilkan informasi event.

```typescript
<EventCard
  event={event}
  onBuyTicket={handleBuyTicket}
  onUseTicket={handleUseTicket}
  hasTicket={hasTicket}
  isTicketUsed={isTicketUsed}
/>
```

## 🚀 Deployment

### Deploy Solana Program

```bash
cd eventdao-anchor/eventdao
anchor deploy --provider.cluster mainnet-beta
```

### Deploy Frontend

```bash
cd eventdao-frontend
npm run build
# Deploy ke Vercel, Netlify, atau platform lainnya
```

## 🤝 Contributing

1. Fork repository
2. Buat feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push ke branch (`git push origin feature/amazing-feature`)
5. Buat Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Support

- GitHub Issues: [Create an issue](https://github.com/your-repo/eventdao/issues)
- Discord: [Join our community](https://discord.gg/your-discord)
- Twitter: [@EventDAO](https://twitter.com/eventdao)

## 🔮 Roadmap

- [ ] Integrasi Supabase untuk data off-chain
- [ ] Sistem voting untuk event
- [ ] Marketplace untuk tiket
- [ ] Mobile app (React Native)
- [ ] Multi-chain support
- [ ] DAO governance token

---

**EventDAO** - Membangun masa depan event yang terdesentralisasi! 🎉
