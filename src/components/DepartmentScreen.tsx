import { useMemo, useState } from 'react';
import { ArrowLeft, MessageCircle, Moon, Plus, Search, Sun } from 'lucide-react';
import {
  Department,
  DesignMode,
  ShoeCategory,
  ShoeProduct,
} from '../types';
import { buildWhatsAppUrl } from '../utils/whatsapp';
import { ProductCard } from './ProductCard';
import { ResilientImage } from './ResilientImage';

interface DepartmentScreenProps {
  department: Department;
  mode: DesignMode;
  onModeChange: (mode: DesignMode) => void;
  products: ShoeProduct[];
  wishlist: string[];
  onToggleWishlist: (productId: string) => void;
  onInspectProduct: (productId: string) => void;
  onSwitchDepartment: (dept: Department) => void;
  onBackHome: () => void;
  recipientPhone: string;
  onOpenAddModel?: () => void;
}

const DEPT_CONFIG: Record<
  Department,
  {
    title: string;
    kicker: string;
    description: string;
    sizeSummary: string;
    bannerImage: string;
  }
> = {
  men: {
    title: "Men's Performance Footwear",
    kicker: 'Men · Carbon Race & All-Terrain',
    description:
      'Dual-fork carbon marathon racers, tartan track spikes, and high-mileage road trainers engineered for male biomechanics.',
    sizeSummary: "US Men's 7 – 13",
    bannerImage: '/src/assets/images/shoe_obsidian_volt_1794913815323.jpg',
  },
  women: {
    title: "Women's Precision Footwear",
    kicker: 'Women · Featherlight Propulsion',
    description:
      'Tuned specifically to female stride cadence with contoured heel locks, Pebax propulsion midsoles, and breathable ripstop containment.',
    sizeSummary: "US Women's 5 – 10.5",
    bannerImage: '/src/assets/images/shoe_women_aero_rose_1794915416672.jpg',
  },
  kids: {
    title: "Kids' Track & Everyday Speed",
    kicker: 'Kids · Quick-Cinch Youth Runners',
    description:
      'Built for youth track meets, school sports, and playground agility with lockable speed laces and impact-cushioning UltraFoam.',
    sizeSummary: "US Kids' 1Y – 6.5Y",
    bannerImage: '/src/assets/images/shoe_kids_junior_volt_1794915416970.jpg',
  },
};

const CATEGORY_FILTERS: { id: ShoeCategory; label: string }[] = [
  { id: 'all', label: 'All Silhouettes' },
  { id: 'marathon', label: 'Marathon & Road' },
  { id: 'track', label: 'Track & Tempo' },
  { id: 'trail', label: 'Trail Hybrid' },
];

export function DepartmentScreen({
  department,
  mode,
  onModeChange,
  products,
  wishlist,
  onToggleWishlist,
  onInspectProduct,
  onSwitchDepartment,
  onBackHome,
  recipientPhone,
  onOpenAddModel,
}: DepartmentScreenProps) {
  const isObsidian = mode === 'obsidian';
  const [categoryFilter, setCategoryFilter] = useState<ShoeCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const config = DEPT_CONFIG[department];

  const deptProducts = useMemo(() => {
    return products.filter((p) => {
      if (p.department !== department) return false;
      const matchesCat =
        categoryFilter === 'all' || p.category === categoryFilter;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [products, department, categoryFilter, searchQuery]);

  const deptShareText = `*PRO-X1 SHOE ${department.toUpperCase()} COLLECTION — 75% OFF*\n${config.title}\nSizes: ${config.sizeSummary}\nFree courier transport on your first order.`;
  const deptWaUrl = buildWhatsAppUrl(deptShareText, recipientPhone);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-8">
      {/* Top Breadcrumb + Department & Theme Quick Switch */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackHome}
            className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider cursor-pointer ${
              isObsidian
                ? 'text-zinc-400 hover:text-[#ccff00]'
                : 'text-[#5f5e5f] hover:text-[#0d0d0e]'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>
          <span aria-hidden="true" className="opacity-40">
            /
          </span>
          <span className="text-xs font-bold uppercase tracking-wider">
            {department}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Quick Department Page Switcher */}
          <div
            className={`inline-flex items-center p-1 ${
              isObsidian
                ? 'rounded-full bg-[#18181b] border border-zinc-800'
                : 'rounded-none bg-[#f4f4f5] border border-[#0d0d0e]'
            }`}
          >
            {(['men', 'women', 'kids'] as Department[]).map((dept) => {
              const active = dept === department;
              return (
                <button
                  key={dept}
                  type="button"
                  onClick={() => {
                    setCategoryFilter('all');
                    setSearchQuery('');
                    onSwitchDepartment(dept);
                  }}
                  className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors ${
                    isObsidian
                      ? `rounded-full ${
                          active
                            ? 'bg-[#ccff00] text-[#09090b]'
                            : 'text-zinc-400 hover:text-white'
                        }`
                      : `rounded-none ${
                          active
                            ? 'bg-[#0d0d0e] text-white'
                            : 'text-[#5f5e5f] hover:text-[#0d0d0e]'
                        }`
                  }`}
                >
                  {dept}
                </button>
              );
            })}
          </div>

          {/* Aesthetic Mode Toggle */}
          <div
            className={`inline-flex items-center p-1 ${
              isObsidian
                ? 'rounded-full bg-[#18181b] border border-zinc-800'
                : 'rounded-none bg-[#f4f4f5] border border-[#0d0d0e]'
            }`}
          >
            <button
              type="button"
              onClick={() => onModeChange('obsidian')}
              aria-label="Pro-X1 Obsidian dark mode"
              className={`p-1.5 cursor-pointer ${
                isObsidian
                  ? 'rounded-full bg-[#ccff00] text-[#09090b]'
                  : 'text-[#5f5e5f]'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onModeChange('apex')}
              aria-label="Pro-X1 Apex light mode"
              className={`p-1.5 cursor-pointer ${
                !isObsidian
                  ? 'rounded-none bg-[#0d0d0e] text-white'
                  : 'text-zinc-400'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Department Editorial Header Card */}
      <div
        className={`grid grid-cols-1 lg:grid-cols-12 items-stretch overflow-hidden ${
          isObsidian
            ? 'rounded-2xl bg-[#18181b] border border-zinc-800'
            : 'rounded-none bg-[#f4f4f5] border border-[#0d0d0e] apex-hard-shadow'
        }`}
      >
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between gap-6">
          <div className="space-y-3">
            <div
              className={`text-xs font-bold uppercase tracking-wider ${
                isObsidian ? 'text-[#ccff00]' : 'text-[#e5001a] font-display-apex'
              }`}
            >
              {config.kicker}
            </div>
            <h1
              className={`text-3xl sm:text-4xl font-extrabold tracking-tight text-balance ${
                isObsidian
                  ? 'font-display-obsidian text-white'
                  : 'font-display-apex uppercase text-[#0d0d0e]'
              }`}
            >
              {config.title}
            </h1>
            <p
              className={`text-sm sm:text-base leading-relaxed max-w-xl ${
                isObsidian ? 'text-zinc-300' : 'text-[#3b3b3d]'
              }`}
            >
              {config.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-zinc-800/20 dark:border-zinc-800">
            <div className="text-xs font-mono-tech flex flex-wrap items-center gap-x-2 gap-y-1">
              <span>{config.sizeSummary}</span>
              <span aria-hidden="true">·</span>
              <span>75% Off All Models</span>
              <span aria-hidden="true">·</span>
              <span>Free 1st-Order Transport</span>
              <span aria-hidden="true">·</span>
              <span>30-Day Returns</span>
            </div>

            <a
              href={deptWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
                isObsidian
                  ? 'rounded-full bg-[#25D366] text-[#09090b] hover:bg-[#34e073]'
                  : 'rounded-none bg-[#0d0d0e] text-white hover:bg-[#e5001a]'
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Share {department} Drop</span>
            </a>
          </div>
        </div>

        <div className="lg:col-span-5 relative min-h-[220px] bg-[#121214]">
          <ResilientImage
            src={config.bannerImage}
            alt={config.title}
            className="w-full h-full object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none"
          />
        </div>
      </div>

      {/* Department Filter & Search Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        <div
          className={`inline-flex items-center gap-1 p-1 overflow-x-auto no-scrollbar max-w-full ${
            isObsidian
              ? 'rounded-full bg-[#18181b] border border-zinc-800'
              : 'rounded-none bg-[#f4f4f5] border border-[#0d0d0e]'
          }`}
        >
          {CATEGORY_FILTERS.map((cat) => {
            const active = categoryFilter === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-3.5 py-2 sm:py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                  isObsidian
                    ? `rounded-full ${
                        active
                          ? 'bg-[#ccff00] text-[#09090b]'
                          : 'text-zinc-400 hover:text-white'
                      }`
                    : `rounded-none ${
                        active
                          ? 'bg-[#0d0d0e] text-white'
                          : 'text-[#5f5e5f] hover:text-[#0d0d0e]'
                      }`
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3 w-full md:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${department}'s shoes...`}
              aria-label={`Search ${department}'s footwear`}
              className={`h-11 sm:h-10 pl-9 pr-3.5 text-base sm:text-xs w-full sm:w-60 outline-none transition-colors ${
                isObsidian
                  ? 'rounded-full bg-[#18181b] border border-zinc-800 text-white placeholder:text-zinc-500 focus:border-[#ccff00]'
                  : 'rounded-none bg-white border border-[#0d0d0e] text-[#0d0d0e] placeholder:text-[#767676] focus:border-[#e5001a]'
              }`}
            />
          </div>

          {onOpenAddModel && (
            <button
              type="button"
              onClick={onOpenAddModel}
              className={`h-11 sm:h-10 w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 text-xs font-bold uppercase tracking-wider whitespace-nowrap cursor-pointer transition-colors ${
                isObsidian
                  ? 'rounded-full bg-[#ccff00] text-[#09090b] hover:bg-[#d8ff33]'
                  : 'rounded-none bg-[#0d0d0e] text-white hover:bg-[#e5001a]'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Model</span>
            </button>
          )}
        </div>
      </div>

      {/* Product Grid */}
      {deptProducts.length === 0 ? (
        <div
          className={`p-10 text-center space-y-2 ${
            isObsidian
              ? 'rounded-2xl bg-[#18181b] border border-zinc-800 text-zinc-400'
              : 'rounded-none bg-white border border-[#0d0d0e] text-[#5f5e5f]'
          }`}
        >
          <div className="text-base font-bold">
            No matching {department}'s models
          </div>
          <button
            type="button"
            onClick={() => {
              setCategoryFilter('all');
              setSearchQuery('');
            }}
            className="text-xs underline cursor-pointer"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deptProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              mode={mode}
              isWishlisted={wishlist.includes(product.id)}
              onToggleWishlist={onToggleWishlist}
              onInspect={onInspectProduct}
              recipientPhone={recipientPhone}
            />
          ))}
        </div>
      )}
    </section>
  );
}
