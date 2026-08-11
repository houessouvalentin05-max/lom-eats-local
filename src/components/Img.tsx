import { useEffect, useRef, useState } from "react";

/**
 * Low-bandwidth friendly image: reserves the layout box, shows a chalk-toned
 * shimmer while the bytes arrive, then fades the photo in.
 */
export function Img({
  src,
  alt,
  className = "",
  width,
  height,
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLImageElement | null>(null);

  // Images cached or fetched before hydration never fire onLoad — check directly.
  useEffect(() => {
    if (ref.current?.complete) setLoaded(true);
  }, [src]);

  return (
    <>
      {!loaded && <span className="chalk-shimmer absolute inset-0" aria-hidden />}
      <img
        ref={ref}
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        className={`${className} transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </>
  );
}