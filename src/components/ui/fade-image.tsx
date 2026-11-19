"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState, type ComponentProps } from "react";
import { imageFadeState, type ImageFadeState } from "@/lib/site/image-fade";

export function FadeImage(props: ComponentProps<typeof Image>) {
  const imageRef = useRef<HTMLImageElement>(null);
  const [state, setState] = useState<ImageFadeState | undefined>(undefined);

  useLayoutEffect(() => {
    setState(imageFadeState(imageRef.current?.complete ?? true));
  }, []);

  function showImage() {
    setState("visible");
  }

  return <Image {...props} ref={imageRef} data-image={state} onLoad={showImage} onError={showImage} />;
}
