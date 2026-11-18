import { useState } from 'react';
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Gift,
  Heart,
  MessageCircle,
} from 'lucide-react';
import { DesignMode, ShoeProduct } from '../types';
import { formatPKR } from '../utils/currency';
import { buildWhatsAppUrl, formatProductWhatsAppMessage } from '../utils/whatsapp';
import { ResilientImage } from './ResilientImage';

interface ProductCardProps {
  product: ShoeProduct;
  mode: DesignMode;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onInspect: (productId: string) => void;
  recipientPhone: string;
}

export function ProductCard({
  product,
  mode,
  isWishlisted,
  onToggleWishlist,
  onInspect,
  recipientPhone,
}: ProductCardProps) {
  const isObsidian = mode === 'obsidian';
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const activeColorway =
    product.colorways[selectedColorIndex] || product.colorways[0];

  // Combine selected colorway lead photo with the remaining unique angle photos (min 3-4 photos)
  const cardPhotos = [
    {
      id: `lead-${activeColorway.id}`,
      label: activeColorway.name.split('/')[0].trim(),
      src: activeColorway.image,
    },
    ...product.gallery.filter((p) => p.src !== activeColorway.image),
  ].slice(0, 4);

  const safePhotoIdx =
    activePhotoIndex < cardPhotos.length ? activePhotoIndex : 0;
  const currentPhoto = cardPhotos[safePhotoIdx] || cardPhotos[0];

  const firstAvailableSize =
    product.sizes.find((s) => s.inStock)?.us || product.sizes[0]?.us || '9';

  const whatsappUrl = buildWhatsAppUrl(
    formatProductWhatsAppMessage(product, {
      colorwayName: activeColorway.name,
      usSize: firstAvailableSize,
      includeTelemetry: true,
    }),
    recipientPhone
  );

  const handlePrevPhoto = () => {
    setActivePhotoIndex((prev) =>
      prev === 0 ? cardPhotos.length - 1 : prev - 1
    );
  };

  const handleNextPhoto = () => {
    setActivePhotoIndex((prev) => (prev + 1) % cardPhotos.length);
  };

  return (
    <article
      className={`group flex flex-col justify-between transition-all duration-150 ${
        isObsidian
          ? 'rounded-2xl bg-[#18181b] border border-zinc-800 hover:border-zinc-600'
          : 'rounded-none bg-white border border-[#0d0d0e] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#0d0d0e]'
      }`}
    >
      {/* Visual Viewport + Multi-Photo Controls */}
      <div>
        <div
          className={`relative aspect-[4/3] overflow-hidden ${
            isObsidian
              ? 'rounded-t-2xl bg-[#121214]'
              : 'rounded-none bg-[#f4f4f5] border-b border-[#0d0d0e]'
          }`}
        >
          <button
            type="button"
            onClick={() => onInspect(product.id)}
            className="w-full h-full block cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#ccff00]"
            aria-label={`Inspect ${product.name}`}
          >
            <ResilientImage
              src={currentPhoto.src}
              alt={`${product.name} — ${currentPhoto.label}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              fallbackLabel={product.name}
            />
          </button>

          {/* Top-right wishlist button */}
          <button
            type="button"
            onClick={() => onToggleWishlist(product.id)}
            aria-label={
              isWishlisted
                ? `Remove ${product.name} from wishlist`
                : `Save ${product.name} to wishlist`
            }
            className={`absolute top-3 right-3 w-10 h-10 flex items-center justify-center cursor-pointer transition-colors duration-150 ${
              isObsidian
                ? 'rounded-full bg-[#09090b]/75 backdrop-blur-md border border-white/15 text-white hover:border-[#ccff00]'
                : 'rounded-none bg-white/90 border border-[#0d0d0e] text-[#0d0d0e] hover:bg-[#0d0d0e] hover:text-white'
            }`}
          >
            <Heart
              className={`w-4 h-4 ${
                isWishlisted
                  ? isObsidian
                    ? 'fill-[#ccff00] text-[#ccff00]'
                    : 'fill-[#e5001a] text-[#e5001a]'
                  : ''
              }`}
            />
          </button>

          {/* Photo Angle Stepper Controls */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
            <span
              className={`px-2.5 py-1 text-[11px] font-mono-tech font-semibold pointer-events-auto truncate max-w-[60%] ${
                isObsidian
                  ? 'rounded-full bg-[#09090b]/80 text-zinc-200 border border-white/15 backdrop-blur-md'
                  : 'rounded-none bg-white/95 text-[#0d0d0e] border border-[#0d0d0e]'
              }`}
            >
              0{safePhotoIdx + 1}/0{cardPhotos.length} · {currentPhoto.label}
            </span>

            <div className="flex items-center gap-1.5 pointer-events-auto shrink-0">
              <button
                type="button"
                onClick={handlePrevPhoto}
                aria-label="Previous photo"
                className={`w-9 h-9 flex items-center justify-center cursor-pointer transition-colors ${
                  isObsidian
                    ? 'rounded-full bg-[#09090b]/85 text-white border border-white/15 hover:border-[#ccff00]'
                    : 'rounded-none bg-white/95 text-[#0d0d0e] border border-[#0d0d0e] hover:bg-[#0d0d0e] hover:text-white'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextPhoto}
                aria-label="Next photo"
                className={`w-9 h-9 flex items-center justify-center cursor-pointer transition-colors ${
                  isObsidian
                    ? 'rounded-full bg-[#09090b]/85 text-white border border-white/15 hover:border-[#ccff00]'
                    : 'rounded-none bg-white/95 text-[#0d0d0e] border border-[#0d0d0e] hover:bg-[#0d0d0e] hover:text-white'
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Clickable 4-Thumbnail Strip for Instant Photo Switching */}
        <div
          className={`grid grid-cols-4 gap-1.5 px-3 pt-3 ${
            isObsidian ? 'bg-[#18181b]' : 'bg-white'
          }`}
        >
          {cardPhotos.map((photo, idx) => {
            const isSelected = idx === safePhotoIdx;
            return (
              <button
                key={photo.id}
                type="button"
                onClick={() => setActivePhotoIndex(idx)}
                aria-label={`View ${photo.label} photo`}
                className={`aspect-[4/3] overflow-hidden cursor-pointer transition-all ${
                  isObsidian ? 'rounded-lg' : 'rounded-none'
                } ${
                  isSelected
                    ? isObsidian
                      ? 'ring-2 ring-[#ccff00]'
                      : 'ring-2 ring-[#e5001a]'
                    : 'opacity-65 hover:opacity-100'
                }`}
              >
                <ResilientImage
                  src={photo.src}
                  alt={photo.label}
                  className="w-full h-full object-cover"
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div className="space-y-2">
          {/* Unboxed clean metadata line */}
          <div
            className={`flex items-center justify-between gap-2 text-xs ${
              isObsidian ? 'text-zinc-400' : 'text-[#767676]'
            }`}
          >
            <div className="flex items-center gap-1.5 truncate">
              <span>{product.categoryLabel}</span>
              <span aria-hidden="true">·</span>
              <span
                className={
                  product.statusNote.includes('75% Off') ||
                  product.statusNote === 'Low Stock'
                    ? isObsidian
                      ? 'text-[#ccff00] font-semibold'
                      : 'text-[#e5001a] font-semibold'
                    : ''
                }
              >
                {product.statusNote}
              </span>
            </div>
            <span className="font-mono-tech shrink-0">{product.sku}</span>
          </div>

          <div className="flex items-baseline justify-between gap-3">
            <h3
              className={`min-w-0 text-lg font-bold tracking-tight truncate ${
                isObsidian
                  ? 'font-display-obsidian text-white'
                  : 'font-display-apex uppercase text-[#0d0d0e]'
              }`}
            >
              <button
                type="button"
                onClick={() => onInspect(product.id)}
                className="text-left hover:underline cursor-pointer truncate max-w-full block"
              >
                {product.name}
              </button>
            </h3>
            <div className="text-right shrink-0">
              <div
                className={`text-base font-bold tabular-nums ${
                  isObsidian ? 'text-white' : 'text-[#0d0d0e]'
                }`}
              >
                {formatPKR(product.price)}
              </div>
              <div
                className={`text-[11px] tabular-nums line-through ${
                  isObsidian ? 'text-zinc-500' : 'text-[#767676]'
                }`}
              >
                {formatPKR(product.originalPrice)}
              </div>
            </div>
          </div>

          <p
            className={`text-sm line-clamp-2 ${
              isObsidian ? 'text-zinc-400' : 'text-[#5f5e5f]'
            }`}
          >
            {product.subtitle}
          </p>

          <div
            className={`flex items-center gap-2 pt-1 text-xs font-medium ${
              isObsidian ? 'text-[#ccff00]' : 'text-[#e5001a]'
            }`}
          >
            <Gift className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">
              Free: {product.freeGift.name} (PKR 0 · Worth{' '}
              {formatPKR(product.freeGift.valuePKR)})
            </span>
          </div>
        </div>

        {/* Swatches + Specs + Action Row */}
        <div className="space-y-4 pt-2 border-t border-zinc-800/40 dark:border-zinc-800">
          <div className="flex items-center justify-between gap-3">
            {/* Colorway Swatches */}
            <div
              className="flex items-center gap-2"
              role="group"
              aria-label="Colorways"
            >
              {product.colorways.map((cw, idx) => {
                const isSelected = idx === selectedColorIndex;
                return (
                  <button
                    key={cw.id}
                    type="button"
                    onClick={() => {
                      setSelectedColorIndex(idx);
                      setActivePhotoIndex(0);
                    }}
                    title={cw.name}
                    aria-label={`Select colorway ${cw.name}`}
                    className={`w-7 h-7 flex items-center justify-center cursor-pointer transition-transform duration-150 ${
                      isObsidian ? 'rounded-full' : 'rounded-none'
                    } ${
                      isSelected
                        ? isObsidian
                          ? 'ring-2 ring-[#ccff00] ring-offset-2 ring-offset-[#18181b]'
                          : 'ring-2 ring-[#0d0d0e] ring-offset-2 ring-offset-white'
                        : 'opacity-75 hover:opacity-100'
                    }`}
                    style={{
                      background: `linear-gradient(135deg, ${cw.hexPrimary} 55%, ${cw.hexAccent} 55%)`,
                    }}
                  />
                );
              })}
            </div>

            {/* Quiet Telemetry summary */}
            <span
              className={`text-xs font-mono-tech ${
                isObsidian ? 'text-zinc-400' : 'text-[#5f5e5f]'
              }`}
            >
              {product.telemetry.weightOz} oz · {product.telemetry.dropMm}mm
            </span>
          </div>

          <div className="grid grid-cols-5 gap-2">
            <button
              type="button"
              onClick={() => onInspect(product.id)}
              className={`col-span-3 min-h-[42px] inline-flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-bold uppercase tracking-wider whitespace-nowrap cursor-pointer transition-colors duration-150 active:scale-[0.98] ${
                isObsidian
                  ? 'rounded-full bg-[#ccff00] text-[#09090b] hover:bg-[#d8ff33]'
                  : 'rounded-none bg-[#0d0d0e] text-white hover:bg-[#e5001a]'
              }`}
            >
              <span>Select Size</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Share drop specs on WhatsApp"
              className={`col-span-2 min-h-[42px] inline-flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-semibold whitespace-nowrap transition-colors duration-150 ${
                isObsidian
                  ? 'rounded-full border border-zinc-700 text-zinc-200 hover:border-[#ccff00] hover:text-[#ccff00]'
                  : 'rounded-none border border-[#0d0d0e] text-[#0d0d0e] hover:bg-[#0d0d0e] hover:text-white'
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Share</span>
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
