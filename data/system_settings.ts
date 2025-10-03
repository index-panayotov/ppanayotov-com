// system_settings.ts
// Exports system-wide settings as a JSON object

const systemSettings = {
  blogEnable: false,
  useWysiwyg: true,
  showContacts: true,
  showPrint: false,
  gtagCode: "G-NR6KNX7RM6",
  gtagEnabled: true,

  // PWA Configuration
  pwa: {
    siteName: "Preslav Panayotov - Professional CV",
    shortName: "PPanayotov CV",
    description: "Software Delivery Manager with over 10 years of experience in IT industry, specializing in software development, project execution, and process optimization.",
    startUrl: "/",
    display: "standalone" as const,
    backgroundColor: "#ffffff",
    themeColor: "#0f172a",
    orientation: "portrait-primary" as const,
    categories: ["business", "productivity", "professional"],
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable"
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/icons/icon-144x144.png",
        sizes: "144x144",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/icons/icon-72x72.png",
        sizes: "72x72",
        type: "image/png",
        purpose: "any"
      }
    ]
  }
};

export default systemSettings;
