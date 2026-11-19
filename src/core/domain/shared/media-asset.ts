export type MediaAsset = {
  id: string;
  url: string;
  alt: string;
  width: number;
  height: number;
};

export type MediaSizes = Record<string, { width: number; height: number }>;
