"use client";

import { type ImageProps, Image as UnpicImage } from "@unpic/react";

interface OptimizedImageProps extends Omit<ImageProps, "layout"> {
  layout?: "constrained" | "fullWidth" | "fixed";
  priority?: boolean;
}

/**
 * OptimizedImage Component
 *
 * A wrapper around @unpic/react Image for consistent image optimization across the app.
 *
 * Features:
 * - Automatic responsive images
 * - Lazy loading by default
 * - Priority loading for above-the-fold images
 * - CDN optimization support
 *
 * @example
 * // Full width responsive image
 * <OptimizedImage
 *   src="/hero/stadeum.png"
 *   alt="Stadeum"
 *   layout="fullWidth"
 *   priority
 * />
 *
 * @example
 * // Fixed size image with aspect ratio
 * <OptimizedImage
 *   src="/team/profile.png"
 *   alt="Team Member"
 *   width={128}
 *   height={128}
 *   layout="constrained"
 * />
 */
export function OptimizedImage({
  layout = "constrained",
  priority = false,
  loading,
  aspectRatio,
  style,
  ...props
}: OptimizedImageProps) {
  const imageProps: any = {
    ...props,
    layout,
    loading: priority ? "eager" : (loading ?? "lazy"),
    ...(priority && { fetchpriority: "high" }),
  };

  const mergedStyle = {
    ...style,
    ...(aspectRatio ? { aspectRatio } : null),
  };

  return <UnpicImage {...imageProps} style={mergedStyle} />;
}

export default OptimizedImage;

/**
 * HeroImage - Optimized for large hero/banner images
 * Always uses fullWidth layout and eager loading
 */
export function HeroImage({
  className = "",
  ...props
}: Omit<OptimizedImageProps, "layout" | "priority">) {
  return (
    <OptimizedImage
      {...props}
      layout="fullWidth"
      priority
      className={`w-full h-full object-cover ${className}`}
    />
  );
}

/**
 * AvatarImage - Optimized for profile images/avatars
 * Fixed size with rounded styling
 */
export function AvatarImage({
  size = 128,
  className = "",
  ...props
}: Omit<OptimizedImageProps, "width" | "height" | "layout"> & {
  size?: number;
}) {
  return (
    <OptimizedImage
      {...props}
      width={size}
      height={size}
      layout="constrained"
      className={`rounded-full object-cover ${className}`}
    />
  );
}

/**
 * ThumbnailImage - Optimized for card thumbnails
 * Constrained layout with aspect ratio support
 */
export function ThumbnailImage({
  aspectRatio = 16 / 9,
  className = "",
  ...props
}: OptimizedImageProps) {
  return (
    <OptimizedImage
      {...props}
      layout="fullWidth"
      aspectRatio={aspectRatio}
      className={`object-cover ${className}`}
    />
  );
}
