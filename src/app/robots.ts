import { MetadataRoute } from "next";
import { BASE_URL } from "../constants";

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
