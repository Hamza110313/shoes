import { useEffect, useState } from 'react';
import { ArrowRight, MessageCircle, Moon, Sun } from 'lucide-react';
import { HERO_CAMPAIGN_IMAGE } from '../data/footwear';
import { DesignMode, ShoeProduct } from '../types';
import { formatPKR } from '../utils/currency';
import { buildWhatsAppUrl, formatProductWhatsAppMessage } from '../utils/whatsapp';
import { ResilientImage } from './ResilientImage';

interface HeroSectionProps {
  mode: DesignMode;
  onModeChange: (mode: DesignMode) => void;
  featuredProduct: ShoeProduct;
  onInspectFeatured: () => void;
  recipientPhone: string;
}

export function HeroSection({
  mode,
  onModeChange,
  featuredProduct,
  onInspectFeatured,
  recipientPhone,
}: HeroSectionProps) {
  const isObsidian = mode === 'obsidian';

  // Live countdown timer in seconds for Batch 04 drop window
  const [secondsLeft, setSecondsLeft] = useState(4 * 3600 + 18 * 60 + 32);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 4 * 3600 + 18 * 60 + 32));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const hours = String(Math.floor(secondsLeft / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((secondsLeft % 3600) / 60)).padStart(2, '0');
  const seconds = String(secondsLeft % 60).padStart(2, '0');

  const whatsappHeroMessage = formatProductWhatsAppMessage(featuredProduct, {
    colorwayName: featuredProduct.colorways[0].name,
    usSize: '9.5',
    includeTelemetry: true,
    customNote: `Batch 04 Drop Window closing in ${hours}h ${minutes}m.`,
  });

  const whatsappUrl = buildWhatsAppUrl(whatsappHeroMessage, recipientPhone);

  return (
    <section
      className={`relative overflow-hidden transition-colors duration-200 ${
        isObsidian
          ? 'bg-[#09090b] border-b border-zinc-800'
          : 'bg-white border-b border-[#0d0d0e]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-12">
        {/* Screen Aesthetic Mode Switcher Bar (placed cleanly in hero/workspace bar) */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center justify-between gap-3 sm:gap-4 mb-5 sm:mb-6">
          <div
            className={`text-xs font-medium flex flex-wrap items-center gap-x-2 gap-y-1 ${
              isObsidian ? 'text-zinc-400' : 'text-[#5f5e5f]'
            }`}
          >
            <span className="font-mono-tech">DROP 04</span>
            <span aria-hidden="true">·</span>
            <span>75% Off All Footwear</span>
            <span aria-hidden="true">·</span>
            <span>+1 Free Product With Every Shoe</span>
            <span aria-hidden="true">·</span>
            <span>Free Transport on First Order</span>
            <span aria-hidden="true">·</span>
            <span>30-Day Return Guarantee</span>
          </div>

          <div
            role="group"
            aria-label="Design System Screen Mode"
            className={`grid grid-cols-2 sm:inline-flex items-center p-1 w-full sm:w-auto ${
              isObsidian
                ? 'rounded-full bg-[#18181b] border border-zinc-800'
                : 'rounded-none bg-[#f4f4f5] border border-[#0d0d0e]'
            }`}
          >
            <button
              type="button"
              onClick={() => onModeChange('obsidian')}
              className={`inline-flex items-center justify-center gap-1.5 px-3 sm:px-3.5 py-2 sm:py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-colors duration-150 ${
                isObsidian
                  ? 'rounded-full bg-[#ccff00] text-[#09090b]'
                  : 'rounded-none text-[#5f5e5f] hover:text-[#0d0d0e]'
              }`}
            >
              <Moon className="w-3.5 h-3.5 shrink-0" />
              <span>Pro-X1 Obsidian</span>
            </button>
            <button
              type="button"
              onClick={() => onModeChange('apex')}
              className={`inline-flex items-center justify-center gap-1.5 px-3 sm:px-3.5 py-2 sm:py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-colors duration-150 ${
                !isObsidian
                  ? 'rounded-none bg-[#0d0d0e] text-white'
                  : 'rounded-full text-zinc-400 hover:text-white'
              }`}
            >
              <Sun className="w-3.5 h-3.5 shrink-0" />
              <span>Pro-X1 Apex</span>
            </button>
          </div>
        </div>

        {/* 2-Column Balanced Split Hero */}
        <div
          className={`grid grid-cols-1 lg:grid-cols-12 items-stretch overflow-hidden ${
            isObsidian
              ? 'rounded-2xl bg-[#18181b] border border-zinc-800'
              : 'rounded-none bg-[#f4f4f5] border border-[#0d0d0e] apex-hard-shadow'
          }`}
        >
          {/* Left Content Column */}
          <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between gap-8">
            <div className="space-y-4">
              <div
                className={`text-xs font-semibold tracking-wider uppercase flex items-center gap-2 ${
                  isObsidian ? 'text-[#ccff00]' : 'text-[#e5001a] font-display-apex'
                }`}
              >
                <span>Featured Release</span>
                <span aria-hidden="true">/</span>
                <span className="font-mono-tech">{featuredProduct.sku}</span>
              </div>

              <h1
                className={`text-3xl sm:text-4xl lg:text-[42px] leading-[1.08] tracking-tight text-balance ${
                  isObsidian
                    ? 'font-display-obsidian font-extrabold text-white'
                    : 'font-display-apex font-extrabold uppercase text-[#0d0d0e]'
                }`}
              >
                {featuredProduct.name}
              </h1>

              <p
                className={`text-sm sm:text-base leading-relaxed max-w-md ${
                  isObsidian ? 'text-zinc-300' : 'text-[#3b3b3d]'
                }`}
              >
                {featuredProduct.description}
              </p>
            </div>

            {/* Drop Countdown + Telemetry Strip */}
            <div className="space-y-5">
              <div
                className={`grid grid-cols-3 gap-3 p-4 ${
                  isObsidian
                    ? 'rounded-xl bg-[#09090b] border border-zinc-800'
                    : 'rounded-none bg-white border border-[#0d0d0e]'
                }`}
              >
                <div>
                  <div
                    className={`text-[11px] uppercase tracking-wider ${
                      isObsidian ? 'text-zinc-400' : 'text-[#767676]'
                    }`}
                  >
                    Weight
                  </div>
                  <div
                    className={`text-base font-bold font-mono-tech mt-0.5 ${
                      isObsidian ? 'text-white' : 'text-[#0d0d0e]'
                    }`}
                  >
                    {featuredProduct.telemetry.weightOz} oz
                  </div>
                </div>
                <div>
                  <div
                    className={`text-[11px] uppercase tracking-wider ${
                      isObsidian ? 'text-zinc-400' : 'text-[#767676]'
                    }`}
                  >
                    Energy Return
                  </div>
                  <div
                    className={`text-base font-bold font-mono-tech mt-0.5 ${
                      isObsidian ? 'text-[#ccff00]' : 'text-[#e5001a]'
                    }`}
                  >
                    {featuredProduct.telemetry.energyReturn}
                  </div>
                </div>
                <div>
                  <div
                    className={`text-[11px] uppercase tracking-wider ${
                      isObsidian ? 'text-zinc-400' : 'text-[#767676]'
                    }`}
                  >
                    Window Ends
                  </div>
                  <div
                    className={`text-base font-bold font-mono-tech mt-0.5 ${
                      isObsidian ? 'text-white' : 'text-[#0d0d0e]'
                    }`}
                  >
                    {hours}:{minutes}:{seconds}
                  </div>
                </div>
              </div>

              {/* Action Row */}
              <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
                <button
                  type="button"
                  onClick={onInspectFeatured}
                  className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 min-h-[46px] text-xs font-bold uppercase tracking-wider whitespace-nowrap shrink-0 cursor-pointer transition-transform duration-150 active:scale-[0.97] ${
                    isObsidian
                      ? 'rounded-full bg-[#ccff00] text-[#09090b] hover:bg-[#d8ff33] volt-glow'
                      : 'rounded-none bg-[#0d0d0e] text-white hover:bg-[#e5001a] apex-hard-shadow-sm'
                  }`}
                >
                  <span>Inspect & Select Size</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center justify-center gap-2 px-5 py-3.5 min-h-[46px] text-xs font-bold uppercase tracking-wider whitespace-nowrap shrink-0 transition-colors duration-150 ${
                    isObsidian
                      ? 'rounded-full border border-zinc-700 bg-transparent text-white hover:bg-zinc-800'
                      : 'rounded-none border border-[#0d0d0e] bg-white text-[#0d0d0e] hover:bg-[#0d0d0e] hover:text-white'
                  }`}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Share via WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Media Column */}
          <div className="lg:col-span-7 relative min-h-[260px] sm:min-h-[380px] lg:min-h-[460px] bg-[#121214]">
            <ResilientImage
              src={HERO_CAMPAIGN_IMAGE}
              alt={`${featuredProduct.name} on starting blocks`}
              className="w-full h-full lg:h-full object-cover"
              fallbackLabel={featuredProduct.name}
              priority
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none"
            />
            <div className="absolute bottom-4 sm:bottom-5 left-4 sm:left-5 right-4 sm:right-5 flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-4 text-white">
              <div>
                <div className="text-[11px] sm:text-xs font-mono-tech text-zinc-300">
                  {featuredProduct.releaseNote} · Free 1st-Order Transport
                </div>
                <div className="flex items-baseline gap-2.5">
                  <span className="text-lg font-bold tabular-nums">
                    {formatPKR(featuredProduct.price)}
                  </span>
                  <span className="text-xs tabular-nums line-through text-zinc-400">
                    {formatPKR(featuredProduct.originalPrice)}
                  </span>
                </div>
              </div>
              <div className="text-[11px] sm:text-xs font-mono-tech text-zinc-200 sm:text-right">
                {featuredProduct.telemetry.dropMm}mm Drop · {featuredProduct.telemetry.stackMm}mm Stack
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
