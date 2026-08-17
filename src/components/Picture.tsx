import React from 'react';
import { withBasePath } from '../basePath';
import { IMAGE_DERIVATIVES } from '../imageDerivatives';

type PictureProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  alt: string;
  /** Widths the image is actually drawn at, for the browser to pick a rung by. */
  sizes?: string;
};

/**
 * An <img> that offers AVIF and WebP before falling back to the original file.
 *
 * scripts/optimize-images.ts has been deriving these for a while, and nothing
 * used them: 86 files were built, deployed and never requested, while the page
 * served the JPEGs beside them. Same pixels, roughly a third of the bytes.
 *
 * The rungs come from the generated manifest rather than from a naming
 * convention. Guessing filenames is how this breaks: a <source srcset> pointing
 * at a file that is not there does not fall through to the next source — the
 * browser takes the first type it supports and shows nothing. The manifest is
 * written by the run that produced the files, so it can only name what exists,
 * and an image missing from it renders as a plain <img> unchanged.
 *
 * The element identity is deliberate too. <picture> is not a box: it lays out
 * as its <img>, so every class, ref and handler stays on the <img> where the
 * existing styling already expects them.
 */
/**
 * The manifest is keyed by the path as authored — "/uploads/x.jpg" — but some
 * call sites hand over a src that useMediaUrl has already run through
 * withBasePath. Stripping the prefix back off makes both forms look up the same
 * entry, and means withBasePath is applied once rather than twice, which under
 * a non-root base would otherwise produce /repo/repo/uploads/x.jpg.
 */
function manifestKey(src: string): string {
  const base = import.meta.env.BASE_URL;
  if (base && base !== '/' && src.startsWith(base)) return `/${src.slice(base.length)}`;
  return src;
}

export function Picture({ src, alt, sizes, ...rest }: PictureProps) {
  const key = manifestKey(src);
  const widths = IMAGE_DERIVATIVES[key];
  const resolved = withBasePath(key);

  if (!widths || widths.length === 0) {
    return <img src={resolved} alt={alt} sizes={sizes} {...rest} />;
  }

  const base = key.replace(/\.(jpe?g|png)$/i, '');
  const srcSet = (extension: 'avif' | 'webp') =>
    widths.map((w) => `${withBasePath(`${base}-${w}.${extension}`)} ${w}w`).join(', ');

  // Without sizes the browser assumes the image spans the viewport and picks
  // the widest rung. Nothing here is wider than the 430px device frame.
  const resolvedSizes = sizes ?? '(min-width: 1024px) 430px, 100vw';

  return (
    /* display:contents so the <picture> generates no box of its own. Several of
       these images are `w-full h-full` inside a positioned parent; an inline
       <picture> would become the thing h-full measured against, and it has auto
       height, so the cover would have collapsed. With contents the <img> lays
       out against the same parent it always did. */
    <picture className="contents">
      <source type="image/avif" srcSet={srcSet('avif')} sizes={resolvedSizes} />
      <source type="image/webp" srcSet={srcSet('webp')} sizes={resolvedSizes} />
      <img src={resolved} alt={alt} sizes={resolvedSizes} {...rest} />
    </picture>
  );
}
