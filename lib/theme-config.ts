export type ThemeId = "co-khi" | "cnc";

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  tagline: string;
  basePath: string;
  logoAlt: string;
  brandWatermark: string;
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  "co-khi": {
    id: "co-khi",
    name: "Dầu Cơ Khí",
    tagline: "Dầu Nhớt Công Nghiệp Chất Lượng Cao",
    basePath: "/dau-co-khi",
    logoAlt: "Marshell - Dầu Cơ Khí",
    brandWatermark: "MARSHELL",
  },
  cnc: {
    id: "cnc",
    name: "Dầu Máy CNC",
    tagline: "Dầu Bôi Trơn Chuyên Dụng Cho Máy CNC",
    basePath: "/dau-cnc",
    logoAlt: "Marshell - Dầu Máy CNC",
    brandWatermark: "CNC OIL",
  },
};

/**
 * Detect theme from pathname
 */
export function getThemeFromPath(pathname: string): ThemeConfig {
  if (pathname.startsWith("/dau-cnc")) {
    return THEMES.cnc;
  }
  return THEMES["co-khi"];
}

/**
 * Build themed navigation links
 */
export function themedHref(basePath: string, path: string): string {
  if (path === "/") return basePath;
  return `${basePath}${path}`;
}
