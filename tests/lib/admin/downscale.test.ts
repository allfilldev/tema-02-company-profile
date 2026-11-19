import { afterEach, describe, expect, it, vi } from "vitest";
import { computeDownscaleSize, downscaleImage, MAX_UPLOAD_WIDTH } from "@/lib/admin/downscale";

describe("computeDownscaleSize", () => {
  it("scales a 4032x3024 phone photo down to 1920 wide while keeping the ratio", () => {
    expect(computeDownscaleSize(4032, 3024, 1920)).toEqual({ width: 1920, height: 1440 });
  });

  it("never enlarges an image that is already smaller than the limit", () => {
    expect(computeDownscaleSize(800, 600, 1920)).toEqual({ width: 800, height: 600 });
  });

  it("rounds the scaled height to a whole pixel", () => {
    expect(computeDownscaleSize(1001, 667, 500)).toEqual({ width: 500, height: 333 });
  });
});

describe("MAX_UPLOAD_WIDTH", () => {
  it("allows 1920 px for photos and 600 px for logos", () => {
    expect(MAX_UPLOAD_WIDTH).toEqual({ photo: 1920, logo: 600 });
  });
});

describe("downscaleImage", () => {
  const drawImage = vi.fn();
  const close = vi.fn();
  const canvas = {
    width: 0,
    height: 0,
    getContext: () => ({ drawImage }),
    toBlob: vi.fn(),
  };

  function stubBrowser(supportedTypes: string[]) {
    const createImageBitmap = vi.fn(async () => ({ width: 4032, height: 3024, close }));
    vi.stubGlobal("createImageBitmap", createImageBitmap);
    vi.stubGlobal("document", { createElement: () => canvas });
    canvas.toBlob.mockImplementation((callback: (blob: Blob | null) => void, type: string) => {
      callback(supportedTypes.includes(type) ? new Blob(["x"], { type }) : null);
    });
    return createImageBitmap;
  }

  afterEach(() => {
    vi.unstubAllGlobals();
    drawImage.mockClear();
    close.mockClear();
    canvas.toBlob.mockReset();
  });

  it("decodes with the EXIF orientation applied and draws onto a canvas at the reduced size", async () => {
    const createImageBitmap = stubBrowser(["image/webp"]);
    const file = new File(["raw"], "foto.jpg", { type: "image/jpeg" });

    const blob = await downscaleImage(file, "photo");

    expect(createImageBitmap).toHaveBeenCalledWith(file, { imageOrientation: "from-image" });
    expect([canvas.width, canvas.height]).toEqual([1920, 1440]);
    expect(drawImage).toHaveBeenCalledWith(expect.anything(), 0, 0, 1920, 1440);
    expect(close).toHaveBeenCalled();
    expect(blob.type).toBe("image/webp");
  });

  it("falls back to JPEG for a photo when the browser cannot encode WebP", async () => {
    stubBrowser(["image/jpeg"]);

    const blob = await downscaleImage(new File(["raw"], "foto.jpg"), "photo");

    expect(blob.type).toBe("image/jpeg");
  });

  it("falls back to PNG for a logo so transparency survives", async () => {
    stubBrowser(["image/png"]);

    const blob = await downscaleImage(new File(["raw"], "logo.png"), "logo");

    expect(blob.type).toBe("image/png");
    expect(canvas.width).toBe(600);
  });
});
