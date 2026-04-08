"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";
import { FALLBACK_IMAGES } from "@/lib/image-utils";

interface ResilientImageProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string;
}

export default function ResilientImage({
  fallbackSrc,
  src,
  className,
  ...props
}: ResilientImageProps) {
  const [errored, setErrored] = useState(false);

  const activeSrc = errored ? (fallbackSrc || FALLBACK_IMAGES.primary) : src;

  return (
    <Image
      {...props}
      src={activeSrc}
      className={className}
      onError={() => {
        if (!errored) setErrored(true);
      }}
    />
  );
}
