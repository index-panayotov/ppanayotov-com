# Preslav Panayotov - Portfolio

A professional portfolio website built with Next.js 15, TypeScript, and Tailwind CSS.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Deployment**: Vercel

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                  # Next.js App Router
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── globals.css       # Global styles
├── components/           # React components
│   ├── hero.tsx          # Hero section
│   ├── experience.tsx    # Experience timeline
│   ├── skills.tsx        # Skills section
│   ├── education.tsx     # Education section
│   └── footer.tsx        # Footer
├── data/                 # Static data files
│   ├── profile.ts        # Personal information
│   ├── experience.ts     # Work experience
│   └── skills.ts         # Skills data
├── lib/                  # Utility functions
└── public/               # Static assets
```

## Deployment

This project is optimized for Vercel deployment:

```bash
npm run build
```

Or connect your GitHub repository to Vercel for automatic deployments.

## License

All rights reserved.
