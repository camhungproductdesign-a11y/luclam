import { useEffect, useRef, useState, type HTMLAttributeReferrerPolicy, type ReactNode } from 'react';

/**
 * An <iframe> that is not in the document until the reader gets near it.
 *
 * The Ben Thanh map already carried loading="lazy" and it made no difference:
 * this guide lays all ten pages out as siblings in one scroll container, so the
 * map page is a couple of viewports away rather than far down a long document,
 * and Chrome's lazy threshold is generous enough — several thousand pixels on a
 * slow connection — to treat that as imminent. Measured on the home page, the
 * embed pulled the whole Google Maps JS API before anything had been drawn:
 * eight requests, about 300KB, from a third-party origin the browser had to
 * shake hands with first.
 *
 * An attribute cannot fix that, because the element is already in the document
 * and the browser is entitled to decide it is close enough. So the element is
 * withheld instead, and an IntersectionObserver on a placeholder of the same
 * size puts it there when the reader actually approaches. rootMargin gives it a
 * screen of warning, so by the time the page is on screen the map has usually
 * arrived.
 *
 * The placeholder holds the exact space the frame will occupy — the caller
 * sizes both — so nothing moves when the swap happens.
 */

type Props = {
  title: string;
  src: string;
  className?: string;
  /** Shown in the reader's language while the frame is still withheld. */
  placeholder?: ReactNode;
  referrerPolicy?: HTMLAttributeReferrerPolicy;
};

export function DeferredFrame({ title, src, className, placeholder, referrerPolicy }: Props) {
  const holder = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (mounted) return;
    const node = holder.current;
    if (!node) return;

    // Without the API — old browsers, and any renderer that stubs it out —
    // showing the map is the right failure: a permanently blank box would be
    // worse than an early request.
    if (typeof IntersectionObserver === 'undefined') {
      setMounted(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setMounted(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [mounted]);

  if (mounted) {
    return (
      <iframe
        title={title}
        src={src}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen={false}
        loading="lazy"
        referrerPolicy={referrerPolicy}
        className={className}
      />
    );
  }

  return (
    <div
      ref={holder}
      className={`${className ?? ''} flex items-center justify-center bg-zinc-100`}
      aria-label={title}
      role="img"
    >
      {placeholder}
    </div>
  );
}