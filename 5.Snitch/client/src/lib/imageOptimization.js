/**
 * Image Optimization Utilities
 * Handles transformations for ImageKit, Unsplash, and provides fallback handling.
 */

export const DEFAULT_PRODUCT_IMAGE =
  "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80";

/**
 * Optimizes an image URL based on provider (ImageKit, Unsplash).
 * @param {string} url - Original image URL
 * @param {Object} options - Transformation options
 * @param {number} [options.width] - Target width in pixels
 * @param {number} [options.height] - Target height in pixels
 * @param {number} [options.quality=80] - Image quality (1-100)
 * @param {string} [options.format='auto'] - Desired format ('auto', 'webp', 'avif')
 * @returns {string} - Transformed image URL
 */
export function getOptimizedImageUrl(url, options = {}) {
  if (!url || typeof url !== "string") {
    return DEFAULT_PRODUCT_IMAGE;
  }

  const { width, height, quality = 80, format = "auto" } = options;

  try {
    // 1. ImageKit transformation support
    if (url.includes("ik.imagekit.io")) {
      const trParts = [];
      if (width) trParts.push(`w-${Math.round(width)}`);
      if (height) trParts.push(`h-${Math.round(height)}`);
      if (quality) trParts.push(`q-${quality}`);
      if (format === "auto") trParts.push("f-auto");
      else if (format) trParts.push(`f-${format}`);

      const trString = `tr=${trParts.join(",")}`;
      const separator = url.includes("?") ? "&" : "?";
      return `${url}${separator}${trString}`;
    }

    // 2. Unsplash transformation support
    if (url.includes("images.unsplash.com")) {
      const parsed = new URL(url);
      if (width) parsed.searchParams.set("w", String(Math.round(width)));
      if (height) parsed.searchParams.set("h", String(Math.round(height)));
      if (quality) parsed.searchParams.set("q", String(quality));
      parsed.searchParams.set("auto", "format");
      parsed.searchParams.set("fit", "crop");
      return parsed.toString();
    }
  } catch {
    // In case of invalid URL string, return original or fallback
    return url || DEFAULT_PRODUCT_IMAGE;
  }

  return url;
}

/**
 * Generates an optimized thumbnail for product cards in grids (w=450, q=80)
 */
export function getProductCardThumbnail(url) {
  return getOptimizedImageUrl(url, { width: 450, quality: 80 });
}

/**
 * Generates an optimized large image for product detail pages (w=900, q=85)
 */
export function getProductDetailImage(url) {
  return getOptimizedImageUrl(url, { width: 900, quality: 85 });
}

/**
 * Generates an optimized small thumbnail for product gallery selectors (w=160, q=75)
 */
export function getProductGalleryThumbnail(url) {
  return getOptimizedImageUrl(url, { width: 160, quality: 75 });
}

/**
 * Generates responsive srcSet string for product images
 */
export function getProductSrcSet(url, widths = [350, 500, 750]) {
  if (!url || typeof url !== "string") return "";
  return widths
    .map((w) => `${getOptimizedImageUrl(url, { width: w, quality: 80 })} ${w}w`)
    .join(", ");
}
