describe("Bunny media delivery routing", () => {
  beforeEach(() => {
    jest.resetModules();
    process.env.REACT_APP_MEDIA_CDN_URL = "https://xalucatours-media.b-cdn.net";
  });

  test("routes backend proxy paths to Bunny", () => {
    const { mediaDeliveryUrl } = require("./imageUrl");
    expect(mediaDeliveryUrl("/api/files/xaluca/library/photo.jpg")).toBe(
      "https://xalucatours-media.b-cdn.net/xaluca/library/photo.jpg"
    );
  });

  test("routes Supabase public object URLs to the same canonical path", () => {
    const { mediaDeliveryUrl } = require("./imageUrl");
    expect(
      mediaDeliveryUrl(
        "https://example.supabase.co/storage/v1/object/public/xaluca/xaluca/library/photo.webp"
      )
    ).toBe("https://xalucatours-media.b-cdn.net/xaluca/library/photo.webp");
  });

  test("uses Bunny Optimizer parameters for responsive variants", () => {
    const { optimizedSrc } = require("./imageUrl");
    const result = optimizedSrc(
      "https://example.supabase.co/storage/v1/object/public/xaluca/xaluca/library/photo.webp",
      480
    );
    expect(result).toContain("https://xalucatours-media.b-cdn.net/xaluca/library/photo.webp?");
    expect(result).toContain("width=480");
    expect(result).toContain("quality=80");
  });
});
