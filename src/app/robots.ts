import { MetadataRoute } from "next";

const BASE_URL = "https://petro-trilhas.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/perfil", "/auth/", "/trilhas-admin", "/eventos-admin"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
