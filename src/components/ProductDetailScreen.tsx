import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Gift,
  Heart,
  MessageCircle,
  Share2,
  ShoppingBag,
} from 'lucide-react';
import { DesignMode, ShoeProduct } from '../types';
import { formatPKR } from '../utils/currency';
import {
  buildWhatsAppUrl,
  copyTextToClipboard,
  formatProductWhatsAppMessage,
  triggerNativeShare,
} from '../utils/whatsapp';
import { ResilientImage } from './ResilientImage';

interface ProductDetailScreenProps {
  product: ShoeProduct;
  allProducts: ShoeProduct[];
  mode: DesignMode;
  onSelectProduct: (productId: string) => void;
  onBackToDepartment: (department: ShoeProduct['department']) => void;
  onAddToBag: (payload: {
    product: ShoeProduct;
    colorwayIndex: number;
    usSize: string;
  }) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  recipientPhone: string;
  onRecipientPhoneChange: (phone: string) => void;
}

export function ProductDetailScreen({
  product,
  allProducts,
  mode,
  onSelectProduct,
  onBackToDepartment,
  onAddToBag,
  isWishlisted,
  onToggleWishlist,
  recipientPhone,
  onRecipientPhoneChange,
}: ProductDetailScreenProps) {
  const isObsidian = mode === 'obsidian';

  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const firstInStock =
    product.sizes.find((s) => s.inStock)?.us || product.sizes[0]?.us || '9';
  const [selectedSize, setSelectedSize] = useState(() => {
    if (typeof window !== 'undefined') {
      const sizeParam = new URLSearchParams(window.location.search).get('size');
      if (
        sizeParam &&
        product.sizes.some((s) => s.us === sizeParam && s.inStock)
      ) {
        return sizeParam;
      }
    }
    return firstInStock;
  });
  const [includeTelemetry, setIncludeTelemetry] = useState(true);
  const [customShareNote, setCustomShareNote] = useState('');
  const [copiedFeedback, setCopiedFeedback] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);

  // Sync defaults when switching shoes
  useEffect(() => {
    setSelectedColorIndex(0);
    setActivePhotoIndex(0);
    const sizeParam =
      typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get('size')
        : null;
    const matchedParam =
      sizeParam && product.sizes.some((s) => s.us === sizeParam && s.inStock)
        ? sizeParam
        : null;
    const nextInStock =
      matchedParam ||
      product.sizes.find((s) => s.inStock)?.us ||
      product.sizes[0]?.us ||
      '9';
    setSelectedSize(nextInStock);
    setAddedFeedback(false);
  }, [product.id]);

  const activeColorway =
    product.colorways[selectedColorIndex] || product.colorways[0];

  const galleryPhotos = [
    {
      id: `lead-${activeColorway.id}`,
      label: `${activeColorway.name.split('/')[0].trim()} Profile`,
      src: activeColorway.image,
    },
    ...product.gallery.filter((p) => p.src !== activeColorway.image),
  ].slice(0, 4);

  const safePhotoIdx =
    activePhotoIndex < galleryPhotos.length ? activePhotoIndex : 0;
  const activePhoto = galleryPhotos[safePhotoIdx] || galleryPhotos[0];
  const heroImage = activePhoto.src;

  const whatsappMessage = formatProductWhatsAppMessage(product, {
    colorwayName: activeColorway.name,
    usSize: selectedSize,
    includeTelemetry,
    customNote: customShareNote,
  });

  const whatsappUrl = buildWhatsAppUrl(whatsappMessage, recipientPhone);

  const handleAdd = () => {
    onAddToBag({
      product,
      colorwayIndex: selectedColorIndex,
      usSize: selectedSize,
    });
    setAddedFeedback(true);
    window.setTimeout(() => setAddedFeedback(false), 1800);
  };

  const handleCopy = async () => {
    const ok = await copyTextToClipboard(whatsappMessage);
    if (ok) {
      setCopiedFeedback(true);
      window.setTimeout(() => setCopiedFeedback(false), 1800);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 pb-28 md:pb-14 space-y-8">
      {/* Top Breadcrumb & Quick Model Switcher (same department) */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => onBackToDepartment(product.department)}
          className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors ${
            isObsidian
              ? 'text-zinc-400 hover:text-[#ccff00]'
              : 'text-[#5f5e5f] hover:text-[#0d0d0e]'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>
            Back to {product.department === 'men' ? "Men's" : product.department === 'women' ? "Women's" : "Kids'"}
          </span>
        </button>

        {/* Quick Model Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar max-w-full pb-1">
          {allProducts
            .filter((item) => item.department === product.department)
            .map((item) => {
              const active = item.id === product.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectProduct(item.id)}
                  className={`px-3.5 min-h-[38px] text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                    isObsidian
                      ? `rounded-full ${
                          active
                            ? 'bg-[#ccff00] text-[#09090b]'
                            : 'bg-[#18181b] text-zinc-400 border border-zinc-800 hover:text-white'
                        }`
                      : `rounded-none border border-[#0d0d0e] ${
                          active
                            ? 'bg-[#0d0d0e] text-white'
                            : 'bg-white text-[#0d0d0e] hover:bg-[#f4f4f5]'
                        }`
                  }`}
                >
                  {item.name}
                </button>
              );
            })}
        </div>
      </div>

      {/* Main 2-Column Contiguous PDP Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Sticky Gallery + Telemetry Strip */}
        <div className="lg:col-span-7 space-y-5 lg:sticky lg:top-24">
          <div
            className={`relative aspect-[4/3] overflow-hidden ${
              isObsidian
                ? 'rounded-2xl bg-[#121214] border border-zinc-800'
                : 'rounded-none bg-[#f4f4f5] border border-[#0d0d0e] apex-hard-shadow'
            }`}
          >
            <ResilientImage
              src={heroImage}
              alt={`${product.name} — ${activePhoto.label}`}
              className="w-full h-full object-cover"
              fallbackLabel={product.name}
              priority
            />

            {/* Angle Indicator + Prev/Next Controls */}
            <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 flex items-center justify-between gap-2">
              <span
                className={`px-3 py-1.5 sm:px-3.5 sm:py-2 text-[11px] sm:text-xs font-mono-tech font-bold uppercase tracking-wider truncate max-w-[62%] ${
                  isObsidian
                    ? 'rounded-full bg-[#09090b]/85 text-[#ccff00] border border-white/15 backdrop-blur-md'
                    : 'rounded-none bg-white/95 text-[#0d0d0e] border border-[#0d0d0e]'
                }`}
              >
                0{safePhotoIdx + 1} / 0{galleryPhotos.length} — {activePhoto.label}
              </span>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    setActivePhotoIndex((prev) =>
                      prev === 0 ? galleryPhotos.length - 1 : prev - 1
                    )
                  }
                  aria-label="Previous photo angle"
                  className={`w-10 h-10 flex items-center justify-center cursor-pointer transition-colors ${
                    isObsidian
                      ? 'rounded-full bg-[#09090b]/80 text-white border border-white/15 backdrop-blur-md hover:border-[#ccff00]'
                      : 'rounded-none bg-white border border-[#0d0d0e] text-[#0d0d0e] hover:bg-[#0d0d0e] hover:text-white'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setActivePhotoIndex(
                      (prev) => (prev + 1) % galleryPhotos.length
                    )
                  }
                  aria-label="Next photo angle"
                  className={`w-10 h-10 flex items-center justify-center cursor-pointer transition-colors ${
                    isObsidian
                      ? 'rounded-full bg-[#09090b]/80 text-white border border-white/15 backdrop-blur-md hover:border-[#ccff00]'
                      : 'rounded-none bg-white border border-[#0d0d0e] text-[#0d0d0e] hover:bg-[#0d0d0e] hover:text-white'
                  }`}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Wishlist toggle */}
            <button
              type="button"
              onClick={() => onToggleWishlist(product.id)}
              aria-label="Toggle Wishlist"
              className={`absolute top-4 right-4 w-11 h-11 flex items-center justify-center cursor-pointer transition-colors ${
                isObsidian
                  ? 'rounded-full bg-[#09090b]/80 border border-white/15 backdrop-blur-md text-white'
                  : 'rounded-none bg-white border border-[#0d0d0e] text-[#0d0d0e]'
              }`}
            >
              <Heart
                className={`w-5 h-5 ${
                  isWishlisted
                    ? isObsidian
                      ? 'fill-[#ccff00] text-[#ccff00]'
                      : 'fill-[#e5001a] text-[#e5001a]'
                    : ''
                }`}
              />
            </button>
          </div>

          {/* 4-Photo Thumbnail Strip */}
          <div className="grid grid-cols-4 gap-3">
            {galleryPhotos.map((photo, idx) => {
              const isSelected = idx === safePhotoIdx;
              return (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => setActivePhotoIndex(idx)}
                  className={`group text-left overflow-hidden cursor-pointer transition-all ${
                    isObsidian
                      ? `rounded-xl bg-[#18181b] border ${
                          isSelected
                            ? 'border-[#ccff00] ring-1 ring-[#ccff00]'
                            : 'border-zinc-800 opacity-75 hover:opacity-100'
                        }`
                      : `rounded-none bg-white border ${
                          isSelected
                            ? 'border-[#e5001a] ring-1 ring-[#e5001a]'
                            : 'border-[#0d0d0e] opacity-75 hover:opacity-100'
                        }`
                  }`}
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <ResilientImage
                      src={photo.src}
                      alt={photo.label}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div
                    className={`px-2.5 py-1.5 text-[11px] font-medium truncate ${
                      isSelected
                        ? isObsidian
                          ? 'text-[#ccff00]'
                          : 'text-[#e5001a] font-bold'
                        : isObsidian
                          ? 'text-zinc-400'
                          : 'text-[#5f5e5f]'
                    }`}
                  >
                    {photo.label}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Pace & Mileage Telemetry Strip */}
          <div
            className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px overflow-hidden ${
              isObsidian
                ? 'rounded-2xl bg-zinc-800 border border-zinc-800'
                : 'rounded-none bg-[#0d0d0e] border border-[#0d0d0e]'
            }`}
          >
            {[
              { label: 'Drop', value: `${product.telemetry.dropMm} mm` },
              { label: 'Weight', value: `${product.telemetry.weightOz} oz` },
              { label: 'Stack', value: `${product.telemetry.stackMm} mm` },
              { label: 'Rebound', value: product.telemetry.energyReturn },
              { label: 'Plate', value: product.telemetry.plate },
              { label: 'Midsole', value: product.telemetry.foam },
            ].map((spec) => (
              <div
                key={spec.label}
                className={`p-3.5 ${
                  isObsidian ? 'bg-[#18181b]' : 'bg-white'
                }`}
              >
                <div
                  className={`text-[10px] font-bold uppercase tracking-wider ${
                    isObsidian ? 'text-zinc-400' : 'text-[#767676]'
                  }`}
                >
                  {spec.label}
                </div>
                <div
                  className={`text-xs sm:text-sm font-bold font-mono-tech mt-1 truncate ${
                    isObsidian ? 'text-white' : 'text-[#0d0d0e]'
                  }`}
                  title={spec.value}
                >
                  {spec.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Contiguous Purchase & WhatsApp Dispatch Module */}
        <div
          className={`lg:col-span-5 p-6 sm:p-8 space-y-6 ${
            isObsidian
              ? 'rounded-2xl bg-[#18181b] border border-zinc-800'
              : 'rounded-none bg-white border border-[#0d0d0e]'
          }`}
        >
          {/* Header & Price */}
          <div className="space-y-2">
            <div
              className={`flex items-center justify-between text-xs ${
                isObsidian ? 'text-zinc-400' : 'text-[#767676]'
              }`}
            >
              <span>
                {product.categoryLabel} · {product.releaseNote}
              </span>
              <span className="font-mono-tech">{product.sku}</span>
            </div>

            <div className="flex items-start justify-between gap-4">
              <h2
                className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                  isObsidian
                    ? 'font-display-obsidian text-white'
                    : 'font-display-apex uppercase text-[#0d0d0e]'
                }`}
              >
                {product.name}
              </h2>
              <div className="text-right shrink-0">
                <div
                  className={`text-xl sm:text-2xl font-extrabold tabular-nums ${
                    isObsidian ? 'text-[#ccff00]' : 'text-[#0d0d0e]'
                  }`}
                >
                  {formatPKR(product.price)}
                </div>
                <div
                  className={`text-xs tabular-nums ${
                    isObsidian ? 'text-zinc-400' : 'text-[#5f5e5f]'
                  }`}
                >
                  <span className="line-through mr-1.5">
                    {formatPKR(product.originalPrice)}
                  </span>
                  <span>· 75% Off</span>
                </div>
              </div>
            </div>
            <div
              className={`text-xs font-medium ${
                isObsidian ? 'text-zinc-400' : 'text-[#5f5e5f]'
              }`}
            >
              Free transport on your first order · 30-day wear-test &amp; return
              guarantee.
            </div>

            <p
              className={`text-sm leading-relaxed ${
                isObsidian ? 'text-zinc-300' : 'text-[#474647]'
              }`}
            >
              {product.description}
            </p>
          </div>

          {/* Colorway Selector */}
          <div className="space-y-2.5 pt-2 border-t border-zinc-800/30 dark:border-zinc-800">
            <div className="flex items-center justify-between text-xs">
              <span
                className={`font-bold uppercase tracking-wider ${
                  isObsidian ? 'text-zinc-400' : 'text-[#5f5e5f]'
                }`}
              >
                Colorway
              </span>
              <span
                className={`font-semibold ${
                  isObsidian ? 'text-white' : 'text-[#0d0d0e]'
                }`}
              >
                {activeColorway.name}
              </span>
            </div>
            <div className="flex items-center gap-3">
              {product.colorways.map((cw, idx) => {
                const active = idx === selectedColorIndex;
                return (
                  <button
                    key={cw.id}
                    type="button"
                    onClick={() => {
                      setSelectedColorIndex(idx);
                      setActivePhotoIndex(0);
                    }}
                    aria-label={`Select colorway ${cw.name}`}
                    className={`w-9 h-9 cursor-pointer transition-transform duration-150 ${
                      isObsidian ? 'rounded-full' : 'rounded-none'
                    } ${
                      active
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
          </div>

          {/* Interactive US Size Selector Matrix */}
          <div className="space-y-3 pt-2 border-t border-zinc-800/30 dark:border-zinc-800">
            <div className="flex items-center justify-between text-xs">
              <span
                className={`font-bold uppercase tracking-wider ${
                  isObsidian ? 'text-zinc-400' : 'text-[#5f5e5f]'
                }`}
              >
                Select Size ({product.sizeScaleLabel})
              </span>
              <span
                className={`font-mono-tech ${
                  isObsidian ? 'text-[#ccff00]' : 'text-[#e5001a]'
                }`}
              >
                US {selectedSize} Selected
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {product.sizes.map((size) => {
                const isSelected = size.us === selectedSize;
                if (!size.inStock) {
                  return (
                    <button
                      key={size.us}
                      type="button"
                      disabled
                      title={`US ${size.us} Sold Out`}
                      className={`h-11 text-xs font-mono-tech sold-out-strike cursor-not-allowed ${
                        isObsidian
                          ? 'rounded-full bg-[#09090b] border border-dashed border-zinc-800 text-zinc-600'
                          : 'rounded-none bg-[#f4f4f5] border border-zinc-300 text-zinc-400'
                      }`}
                    >
                      {size.us}
                    </button>
                  );
                }
                return (
                  <button
                    key={size.us}
                    type="button"
                    onClick={() => setSelectedSize(size.us)}
                    className={`h-11 text-xs font-bold font-mono-tech cursor-pointer transition-colors duration-150 ${
                      isObsidian
                        ? `rounded-full ${
                            isSelected
                              ? 'bg-[#ccff00] text-[#09090b] border border-[#ccff00] volt-glow'
                              : 'bg-[#121214] text-zinc-100 border border-zinc-800 hover:border-zinc-500'
                          }`
                        : `rounded-none border border-[#0d0d0e] ${
                            isSelected
                              ? 'bg-[#0d0d0e] text-white'
                              : 'bg-white text-[#0d0d0e] hover:bg-[#f4f4f5]'
                          }`
                    }`}
                  >
                    {size.us}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Included Complimentary Free Product */}
          <div
            className={`p-4 flex items-start gap-3 ${
              isObsidian
                ? 'rounded-xl bg-[#09090b] border border-[#ccff00]/35'
                : 'rounded-none bg-[#f4f4f5] border border-[#0d0d0e]'
            }`}
          >
            <Gift
              className={`w-5 h-5 shrink-0 mt-0.5 ${
                isObsidian ? 'text-[#ccff00]' : 'text-[#e5001a]'
              }`}
            />
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span
                  className={`font-bold uppercase tracking-wider ${
                    isObsidian ? 'text-[#ccff00]' : 'text-[#e5001a]'
                  }`}
                >
                  Free Product Included
                </span>
                <span className="font-mono-tech font-bold">
                  PKR 0 (Worth {formatPKR(product.freeGift.valuePKR)})
                </span>
              </div>
              <div
                className={`text-sm font-bold ${
                  isObsidian ? 'text-white' : 'text-[#0d0d0e]'
                }`}
              >
                {product.freeGift.name}
              </div>
              <div
                className={`text-xs leading-relaxed ${
                  isObsidian ? 'text-zinc-400' : 'text-[#5f5e5f]'
                }`}
              >
                {product.freeGift.description} · SKU{' '}
                <span className="font-mono-tech">{product.freeGift.sku}</span>
              </div>
            </div>
          </div>

          {/* Primary Add to Bag CTA */}
          <button
            type="button"
            onClick={handleAdd}
            className={`w-full h-14 inline-flex items-center justify-center gap-2.5 text-sm font-bold uppercase tracking-wider cursor-pointer transition-transform duration-150 active:scale-[0.98] ${
              isObsidian
                ? 'rounded-full bg-[#ccff00] text-[#09090b] hover:bg-[#d8ff33] volt-glow'
                : 'rounded-none bg-[#0d0d0e] text-white hover:bg-[#e5001a] apex-hard-shadow-sm'
            }`}
          >
            {addedFeedback ? (
              <>
                <Check className="w-4 h-4" />
                <span>Added US {selectedSize} to Bag</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag — {formatPKR(product.price)}</span>
              </>
            )}
          </button>

          {/* Integrated WhatsApp Share & Update Dispatch Panel */}
          <div
            className={`p-4 space-y-3.5 ${
              isObsidian
                ? 'rounded-xl bg-[#09090b] border border-zinc-800'
                : 'rounded-none bg-[#f4f4f5] border border-[#0d0d0e]'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <MessageCircle
                  className={`w-4 h-4 ${
                    isObsidian ? 'text-[#ccff00]' : 'text-[#e5001a]'
                  }`}
                />
                <span
                  className={`text-xs font-bold uppercase tracking-wider ${
                    isObsidian ? 'text-white' : 'text-[#0d0d0e]'
                  }`}
                >
                  WhatsApp Spec & Drop Share
                </span>
              </div>
              <label className="inline-flex items-center gap-1.5 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeTelemetry}
                  onChange={(e) => setIncludeTelemetry(e.target.checked)}
                  className="accent-[#ccff00]"
                />
                <span className={isObsidian ? 'text-zinc-400' : 'text-[#5f5e5f]'}>
                  Include specs
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <input
                type="tel"
                value={recipientPhone}
                onChange={(e) => onRecipientPhoneChange(e.target.value)}
                placeholder="WhatsApp # (e.g. +923005550194)"
                aria-label="WhatsApp recipient phone number"
                className={`h-11 px-3.5 text-base sm:text-xs outline-none transition-colors ${
                  isObsidian
                    ? 'rounded-lg bg-[#18181b] border border-zinc-800 text-white placeholder:text-zinc-500 focus:border-[#ccff00]'
                    : 'rounded-none bg-white border border-[#0d0d0e] text-[#0d0d0e] placeholder:text-[#767676] focus:border-[#e5001a]'
                }`}
              />
              <input
                type="text"
                value={customShareNote}
                onChange={(e) => setCustomShareNote(e.target.value)}
                placeholder="Add note for run club / buyer..."
                aria-label="Custom WhatsApp note"
                className={`h-11 px-3.5 text-base sm:text-xs outline-none transition-colors ${
                  isObsidian
                    ? 'rounded-lg bg-[#18181b] border border-zinc-800 text-white placeholder:text-zinc-500 focus:border-[#ccff00]'
                    : 'rounded-none bg-white border border-[#0d0d0e] text-[#0d0d0e] placeholder:text-[#767676] focus:border-[#e5001a]'
                }`}
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex-1 min-w-[160px] h-10 inline-flex items-center justify-center gap-2 px-4 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
                  isObsidian
                    ? 'rounded-full bg-[#25D366] text-[#09090b] hover:bg-[#34e073]'
                    : 'rounded-none bg-[#0d0d0e] text-white hover:bg-[#e5001a]'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                <span>Send on WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={handleCopy}
                className={`h-10 px-3.5 inline-flex items-center justify-center gap-1.5 text-xs font-semibold cursor-pointer transition-colors ${
                  isObsidian
                    ? 'rounded-full border border-zinc-700 text-zinc-200 hover:border-white'
                    : 'rounded-none border border-[#0d0d0e] bg-white text-[#0d0d0e] hover:bg-[#0d0d0e] hover:text-white'
                }`}
              >
                {copiedFeedback ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => triggerNativeShare(product.name, whatsappMessage)}
                aria-label="Share via device share sheet"
                className={`h-10 w-10 inline-flex items-center justify-center cursor-pointer transition-colors ${
                  isObsidian
                    ? 'rounded-full border border-zinc-700 text-zinc-200 hover:border-white'
                    : 'rounded-none border border-[#0d0d0e] bg-white text-[#0d0d0e] hover:bg-[#0d0d0e] hover:text-white'
                }`}
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Action Dock (<= 15% mobile viewport height) */}
      <div
        className={`md:hidden fixed bottom-0 inset-x-0 z-30 px-4 py-3 flex items-center justify-between gap-4 ${
          isObsidian
            ? 'bg-[#09090b]/88 backdrop-blur-xl border-t border-white/[0.08]'
            : 'bg-white/95 backdrop-blur-md border-t border-[#0d0d0e]'
        }`}
      >
        <div>
          <div
            className={`text-[11px] font-mono-tech ${
              isObsidian ? 'text-zinc-400' : 'text-[#5f5e5f]'
            }`}
          >
            US {selectedSize} · {activeColorway.name.split('/')[0].trim()}
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-lg font-extrabold tabular-nums ${
                isObsidian ? 'font-display-obsidian text-white' : 'font-display-apex text-[#0d0d0e]'
              }`}
            >
              {formatPKR(product.price)}
            </span>
            <span className="text-xs tabular-nums line-through opacity-60">
              {formatPKR(product.originalPrice)}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className={`h-11 px-6 text-xs font-bold uppercase tracking-wider whitespace-nowrap cursor-pointer ${
            isObsidian
              ? 'rounded-full bg-[#ccff00] text-[#09090b]'
              : 'rounded-none bg-[#0d0d0e] text-white'
          }`}
        >
          {addedFeedback ? 'Added to Bag' : 'Add to Bag'}
        </button>
      </div>
    </section>
  );
}
