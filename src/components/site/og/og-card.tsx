import {
  fitOgTitle,
  OG_FOOTER_MAX_LENGTH,
  OG_IMAGE_SIZE,
  OG_SUBTITLE_MAX_LENGTH,
  truncateOgText,
} from "@/lib/seo/og";
import { ogTheme } from "@/styles/tokens";

type OgCardProps = {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  footer?: string;
};

const FRAME_PADDING = 72;
const ACCENT_BAR_WIDTH = 120;
const ACCENT_BAR_HEIGHT = 12;
const SECONDARY_TEXT_OPACITY = 0.75;

export function OgCard({ title, eyebrow, subtitle, footer }: OgCardProps) {
  const fitted = fitOgTitle(title);

  return (
    <div
      style={{
        width: OG_IMAGE_SIZE.width,
        height: OG_IMAGE_SIZE.height,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: FRAME_PADDING,
        backgroundColor: ogTheme.background,
        color: ogTheme.foreground,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            width: ACCENT_BAR_WIDTH,
            height: ACCENT_BAR_HEIGHT,
            backgroundColor: ogTheme.primary,
          }}
        />
        {eyebrow ? (
          <div style={{ display: "flex", marginTop: 32, fontSize: 36, color: ogTheme.primary }}>{eyebrow}</div>
        ) : null}
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            fontSize: fitted.fontSize,
            lineHeight: 1.15,
            color: ogTheme.foreground,
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          {fitted.text}
        </div>
        {subtitle ? (
          <div
            style={{
              display: "flex",
              marginTop: 24,
              fontSize: 36,
              lineHeight: 1.3,
              color: ogTheme.foreground,
              opacity: SECONDARY_TEXT_OPACITY,
              wordBreak: "break-word",
              overflow: "hidden",
            }}
          >
            {truncateOgText(subtitle, OG_SUBTITLE_MAX_LENGTH)}
          </div>
        ) : null}
      </div>
      <div style={{ display: "flex", fontSize: 36, color: ogTheme.primary }}>{footer ? truncateOgText(footer, OG_FOOTER_MAX_LENGTH) : ""}</div>
    </div>
  );
}
