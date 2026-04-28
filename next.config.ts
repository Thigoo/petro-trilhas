/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname:
          process.env.NEXT_PUBLIC_SUPABASE_URL?.replace("https://", "") || "",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos", // ← Adicione esta linha
      },
      {
        protocol: "https",
        hostname: "*.picsum.photos", // ← Também é bom adicionar esta
      },
    ],
  },
};

export default nextConfig;
