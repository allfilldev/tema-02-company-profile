import { Inter, Plus_Jakarta_Sans } from "next/font/google";

const headingFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading-source",
});

const bodyFont = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body-source",
});

export const fontClassNames: string = `${headingFont.variable} ${bodyFont.variable}`;
