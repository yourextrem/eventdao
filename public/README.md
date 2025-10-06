# EventDAO Public Assets

Folder ini berisi semua aset statis untuk aplikasi EventDAO.

## Struktur Folder

```
public/
├── images/          # Gambar untuk event, logo, dll
├── icons/           # Ikon aplikasi, social media, dll
├── videos/          # Video promosi, tutorial, dll
├── documents/       # PDF, dokumen, whitepaper, dll
├── favicons/        # Favicon dan icon untuk browser
└── README.md        # File ini
```

## Cara Menggunakan

### 1. Gambar (images/)
- **Event Images**: Gambar untuk event cards, hero sections
- **Logos**: Logo EventDAO, partner logos
- **Backgrounds**: Background images untuk halaman
- **Screenshots**: Screenshot aplikasi, demos

**Contoh penggunaan:**
```jsx
<Image src="/images/event-banner.jpg" alt="Event Banner" width={800} height={400} />
```

### 2. Ikon (icons/)
- **App Icons**: Ikon untuk navigation, buttons
- **Social Icons**: Facebook, Twitter, Discord, dll
- **Feature Icons**: Ikon untuk fitur-fitur aplikasi

**Contoh penggunaan:**
```jsx
<Image src="/icons/wallet.svg" alt="Wallet" width={24} height={24} />
```

### 3. Video (videos/)
- **Promo Videos**: Video promosi EventDAO
- **Tutorials**: Video tutorial penggunaan
- **Demos**: Demo aplikasi

**Contoh penggunaan:**
```jsx
<video src="/videos/demo.mp4" controls />
```

### 4. Dokumen (documents/)
- **Whitepaper**: Dokumen teknis EventDAO
- **Terms**: Terms of Service, Privacy Policy
- **Guides**: User guides, developer docs

**Contoh penggunaan:**
```jsx
<a href="/documents/whitepaper.pdf" target="_blank">Download Whitepaper</a>
```

### 5. Favicons (favicons/)
- **favicon.ico**: Icon untuk browser tab
- **apple-touch-icon.png**: Icon untuk iOS
- **manifest.json**: Web app manifest

## Best Practices

1. **Optimasi File**:
   - Compress images sebelum upload
   - Gunakan format yang tepat (WebP untuk images, SVG untuk icons)
   - Keep file sizes reasonable

2. **Naming Convention**:
   - Gunakan kebab-case: `event-banner.jpg`
   - Descriptive names: `coldplay-concert-2024.jpg`
   - Version numbers jika perlu: `logo-v2.svg`

3. **Organization**:
   - Group related files dalam subfolder
   - Gunakan consistent naming
   - Keep README updated

## File Types yang Didukung

- **Images**: JPG, PNG, GIF, WebP, SVG
- **Videos**: MP4, WebM, MOV
- **Documents**: PDF, DOC, TXT
- **Icons**: SVG, PNG, ICO

## Upload Guidelines

1. **Images**: Max 5MB per file
2. **Videos**: Max 50MB per file
3. **Documents**: Max 10MB per file
4. **Total**: Keep public folder under 100MB

## Development

Untuk development, file di folder `public/` bisa diakses langsung via URL:
- `http://localhost:3000/images/logo.png`
- `http://localhost:3000/videos/demo.mp4`

## Production

Di production (Vercel), file akan di-serve secara statis:
- `https://your-domain.vercel.app/images/logo.png`
- `https://your-domain.vercel.app/videos/demo.mp4`