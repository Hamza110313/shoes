import { ShoppingBag } from 'lucide-react';
import { ActiveScreen, DesignMode } from '../types';

interface NavbarProps {
  mode: DesignMode;
  activeScreen: ActiveScreen;
  onNavigate: (screen: ActiveScreen) => void;
  bagCount: number;
  onOpenBag: () => void;
  isRegistered?: boolean;
}

export function Navbar({
  mode,
  activeScreen,
  onNavigate,
  bagCount,
  onOpenBag,
  isRegistered = false,
}: NavbarProps) {
  const isObsidian = mode === 'obsidian';

  const navItems: { id: ActiveScreen; label: string }[] = [
    { id: 'men', label: 'Men' },
    { id: 'women', label: 'Women' },
    { id: 'kids', label: 'Kids' },
    { id: 'updates', label: 'Updates' },
    { id: 'orders', label: 'Orders' },
    { id: 'register', label: isRegistered ? 'Account' : 'Sign Up' },
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-200 ${
        isObsidian
          ? 'bg-[#09090b]/92 backdrop-blur-xl border-b border-white/[0.08] text-white'
          : 'bg-white/95 backdrop-blur-md border-b border-[#0d0d0e] text-[#0d0d0e]'
      }`}
    >
      {/* Primary Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-14 sm:h-16 flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Single-element Brand Wordmark */}
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className={`text-lg sm:text-xl tracking-tight whitespace-nowrap shrink-0 cursor-pointer min-h-[44px] inline-flex items-center focus-visible:outline-2 focus-visible:outline-offset-4 ${
            isObsidian
              ? 'font-display-obsidian font-extrabold text-white focus-visible:outline-[#ccff00]'
              : 'font-display-apex font-extrabold uppercase text-[#0d0d0e] focus-visible:outline-[#e5001a]'
          }`}
        >
          PRO-X1 SHOE
        </button>

        {/* Zone 2 (Tablet / Desktop): Single-line navigation links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-6 lg:gap-7"
        >
          {navItems.map((item) => {
            const isActive = activeScreen === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`relative py-2 text-sm font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 ${
                  isObsidian
                    ? `focus-visible:outline-[#ccff00] ${
                        isActive
                          ? 'text-[#ccff00]'
                          : 'text-zinc-400 hover:text-white'
                      }`
                    : `font-display-apex uppercase tracking-wider focus-visible:outline-[#e5001a] ${
                        isActive
                          ? 'text-[#e5001a]'
                          : 'text-[#5f5e5f] hover:text-[#0d0d0e]'
                      }`
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className={`absolute left-0 right-0 bottom-0 h-0.5 ${
                      isObsidian ? 'bg-[#ccff00]' : 'bg-[#e5001a]'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onOpenBag}
            className={`inline-flex items-center gap-2 px-4 min-h-[40px] sm:min-h-[42px] text-xs font-bold uppercase tracking-wider whitespace-nowrap shrink-0 cursor-pointer transition-transform duration-150 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 ${
              isObsidian
                ? 'rounded-full bg-[#ccff00] text-[#09090b] hover:bg-[#d8ff33] focus-visible:outline-[#ccff00]'
                : 'rounded-none bg-[#0d0d0e] text-white hover:bg-[#e5001a] apex-hard-shadow-sm focus-visible:outline-[#e5001a]'
            }`}
          >
            <ShoppingBag className="w-4 h-4 shrink-0" />
            <span className="tabular-nums">Bag ({bagCount})</span>
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Rail (< md): zero crowding, 44px touch targets */}
      <nav
        aria-label="Mobile Navigation"
        className={`md:hidden border-t px-3 flex items-center justify-between gap-1 overflow-x-auto no-scrollbar ${
          isObsidian ? 'border-white/[0.06]' : 'border-zinc-200'
        }`}
      >
        {navItems.map((item) => {
          const isActive = activeScreen === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`relative min-h-[42px] px-2.5 text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                isObsidian
                  ? isActive
                    ? 'text-[#ccff00]'
                    : 'text-zinc-400 hover:text-white'
                  : `font-display-apex uppercase tracking-wide ${
                      isActive
                        ? 'text-[#e5001a]'
                        : 'text-[#5f5e5f] hover:text-[#0d0d0e]'
                    }`
              }`}
            >
              {item.label}
              {isActive && (
                <span
                  aria-hidden="true"
                  className={`absolute left-2 right-2 bottom-0 h-0.5 ${
                    isObsidian ? 'bg-[#ccff00]' : 'bg-[#e5001a]'
                  }`}
                />
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
