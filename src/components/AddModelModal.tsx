import { useEffect, useState } from 'react';
import { Gift, Plus, X } from 'lucide-react';
import { OUTSOLE_CARBON_IMAGE } from '../data/footwear';
import { Department, DesignMode, ShoeCategory, ShoeProduct } from '../types';
import { formatPKR } from '../utils/currency';
import { ResilientImage } from './ResilientImage';

interface AddModelModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: DesignMode;
  defaultDepartment?: Department;
  onAddModel: (newProduct: ShoeProduct) => void;
}

const STUDIO_PHOTO_PRESETS = [
  {
    id: 'obsidian-volt',
    label: 'Obsidian / Electric Volt',
    hexPrimary: '#18181b',
    hexAccent: '#ccff00',
    src: '/src/assets/images/shoe_obsidian_volt_1794913815323.jpg',
  },
  {
    id: 'pure-crimson',
    label: 'Pure Chalk / Race Red',
    hexPrimary: '#f4f4f5',
    hexAccent: '#e5001a',
    src: '/src/assets/images/shoe_apex_crimson_1794913817022.jpg',
  },
  {
    id: 'stealth-graphite',
    label: 'Graphite / Bone Slate',
    hexPrimary: '#52525b',
    hexAccent: '#e4e4e7',
    src: '/src/assets/images/shoe_stealth_graphite_1794913817112.jpg',
  },
  {
    id: 'women-crimson',
    label: 'Pearl White / Race Crimson',
    hexPrimary: '#f4f4f5',
    hexAccent: '#e5001a',
    src: '/src/assets/images/shoe_women_aero_rose_1794915416672.jpg',
  },
  {
    id: 'women-slate-volt',
    label: 'Charcoal / Electric Volt',
    hexPrimary: '#27272a',
    hexAccent: '#ccff00',
    src: '/src/assets/images/shoe_women_slate_volt_1794915417075.jpg',
  },
  {
    id: 'kids-volt',
    label: 'Youth Obsidian / Volt',
    hexPrimary: '#18181b',
    hexAccent: '#ccff00',
    src: '/src/assets/images/shoe_kids_junior_volt_1794915416970.jpg',
  },
];

const EXTRA_ANGLES = [
  {
    id: 'angle-heel',
    label: '3/4 Heel Bevel',
    src: '/src/assets/images/shoe_heel_detail_volt_1794914891722.jpg',
  },
  {
    id: 'angle-knit',
    label: 'Knit Detail',
    src: '/src/assets/images/shoe_macro_weave_knit_1794914892801.jpg',
  },
  {
    id: 'angle-top',
    label: 'Top-Down Cage',
    src: '/src/assets/images/shoe_topdown_crimson_1794914892062.jpg',
  },
  {
    id: 'angle-outsole',
    label: 'Carbon Outsole',
    src: OUTSOLE_CARBON_IMAGE,
  },
];

const DEPT_SIZES: Record<Department, { scale: string; sizes: string[] }> = {
  men: {
    scale: "US Men's",
    sizes: ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '12', '13'],
  },
  women: {
    scale: "US Women's",
    sizes: ['5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10'],
  },
  kids: {
    scale: "US Kids'",
    sizes: ['1Y', '1.5Y', '2Y', '2.5Y', '3Y', '3.5Y', '4Y', '4.5Y', '5Y', '6Y'],
  },
};

export function AddModelModal({
  isOpen,
  onClose,
  mode,
  defaultDepartment = 'men',
  onAddModel,
}: AddModelModalProps) {
  const isObsidian = mode === 'obsidian';

  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [department, setDepartment] = useState<Department>(defaultDepartment);
  const [category, setCategory] =
    useState<Exclude<ShoeCategory, 'all'>>('marathon');
  const [originalPriceInput, setOriginalPriceInput] = useState('68000');
  const [subtitle, setSubtitle] = useState('');
  const [photoPresetIndex, setPhotoPresetIndex] = useState(0);
  const [freeGiftName, setFreeGiftName] = useState(
    'Carbon Compression Race Socks'
  );
  const [freeGiftValueInput, setFreeGiftValueInput] = useState('4200');
  const [weightOzInput, setWeightOzInput] = useState('6.2');
  const [dropMmInput, setDropMmInput] = useState('8');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setDepartment(defaultDepartment);
    setErrorMsg('');
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, defaultDepartment, onClose]);

  if (!isOpen) return null;

  const parsedOriginal = Math.max(4000, Number(originalPriceInput) || 68000);
  const discountedPrice = Math.round(parsedOriginal * 0.25);
  const parsedGiftValue = Math.max(500, Number(freeGiftValueInput) || 4200);
  const leadPreset =
    STUDIO_PHOTO_PRESETS[photoPresetIndex] || STUDIO_PHOTO_PRESETS[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter a shoe model name.');
      return;
    }

    const cleanSku =
      sku.trim().toUpperCase() ||
      `PX1-${department.slice(0, 1).toUpperCase()}${Math.floor(
        100 + Math.random() * 899
      )}`;

    const deptMeta = DEPT_SIZES[department];
    const categoryLabel =
      category === 'marathon'
        ? department === 'kids'
          ? 'Youth Road'
          : 'Marathon Race'
        : category === 'track'
          ? department === 'kids'
            ? 'Youth Track'
            : 'Track & Tempo'
          : department === 'kids'
            ? 'Youth Trail'
            : 'Trail Hybrid';

    const secondaryPreset =
      STUDIO_PHOTO_PRESETS[(photoPresetIndex + 1) % STUDIO_PHOTO_PRESETS.length];

    const gallery = [
      {
        id: `custom-lead-${Date.now()}`,
        label: 'Side Profile',
        src: leadPreset.src,
      },
      ...EXTRA_ANGLES.filter((a) => a.src !== leadPreset.src),
    ].slice(0, 4);

    const newProduct: ShoeProduct = {
      id: `custom-${name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`,
      sku: cleanSku,
      name: name.trim(),
      subtitle:
        subtitle.trim() ||
        'Custom PRO-X1 carbon-propulsion edition with 75% off drop pricing',
      department,
      sizeScaleLabel: deptMeta.scale,
      category,
      categoryLabel,
      originalPrice: parsedOriginal,
      price: discountedPrice,
      statusNote: '75% Off · Custom Model',
      releaseNote: 'Newly Added · Express Dispatch',
      description:
        subtitle.trim() ||
        'Engineered for responsive turnover, nitrogen-infused cushioning, and complimentary first-order transport.',
      outsoleImage: OUTSOLE_CARBON_IMAGE,
      gallery,
      colorways: [
        {
          id: `${leadPreset.id}-primary`,
          name: leadPreset.label,
          hexPrimary: leadPreset.hexPrimary,
          hexAccent: leadPreset.hexAccent,
          image: leadPreset.src,
        },
        {
          id: `${secondaryPreset.id}-alt`,
          name: secondaryPreset.label,
          hexPrimary: secondaryPreset.hexPrimary,
          hexAccent: secondaryPreset.hexAccent,
          image: secondaryPreset.src,
        },
      ],
      sizes: deptMeta.sizes.map((us) => ({ us, inStock: true })),
      telemetry: {
        dropMm: Math.max(2, Number(dropMmInput) || 8),
        weightOz: Math.max(3, Number(weightOzInput) || 6.2),
        stackMm: department === 'kids' ? 27.5 : 37.5,
        plate:
          department === 'kids'
            ? 'Flexible Youth Torsion'
            : 'Dual-Fork T800 Carbon',
        foam: 'Dual-Density Pro-X1',
        energyReturn: department === 'kids' ? '79.5%' : '87.0%',
      },
      freeGift: {
        name: freeGiftName.trim() || 'Carbon Compression Race Socks',
        sku: `GFT-${Math.floor(100 + Math.random() * 899)}`,
        valuePKR: parsedGiftValue,
        description:
          'Complimentary performance gear included free (PKR 0) with every pair.',
      },
    };

    onAddModel(newProduct);
    setName('');
    setSku('');
    setSubtitle('');
    onClose();
  };

  const inputClass = `w-full h-11 px-3.5 text-base sm:text-sm outline-none transition-colors ${
    isObsidian
      ? 'rounded-lg bg-[#09090b] border border-zinc-800 text-white placeholder:text-zinc-500 focus:border-[#ccff00]'
      : 'rounded-none bg-[#f4f4f5] border border-[#0d0d0e] text-[#0d0d0e] placeholder:text-[#767676] focus:border-[#e5001a]'
  }`;

  const labelClass = `block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${
    isObsidian ? 'text-zinc-400' : 'text-[#5f5e5f]'
  }`;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Add New Shoe Model"
    >
      <div
        className={`w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden ${
          isObsidian
            ? 'rounded-2xl bg-[#18181b] border border-zinc-800 text-white'
            : 'rounded-none bg-white border border-[#0d0d0e] text-[#0d0d0e] apex-hard-shadow'
        }`}
      >
        {/* Modal Header */}
        <div
          className={`px-4 sm:px-6 py-4 flex items-center justify-between border-b ${
            isObsidian ? 'border-zinc-800' : 'border-[#0d0d0e]'
          }`}
        >
          <div>
            <div
              className={`text-[11px] font-bold uppercase tracking-wider ${
                isObsidian ? 'text-[#ccff00]' : 'text-[#e5001a]'
              }`}
            >
              PRO-X1 SHOE Catalog Builder
            </div>
            <h2
              className={`text-lg font-extrabold tracking-tight ${
                isObsidian ? 'font-display-obsidian' : 'font-display-apex uppercase'
              }`}
            >
              Add New Footwear Model
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close add model modal"
            className={`w-10 h-10 flex items-center justify-center cursor-pointer transition-colors ${
              isObsidian
                ? 'rounded-full border border-zinc-800 text-zinc-400 hover:text-white'
                : 'rounded-none border border-[#0d0d0e] text-[#0d0d0e] hover:bg-[#0d0d0e] hover:text-white'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="overflow-y-auto p-4 sm:p-6 space-y-5"
        >
          {errorMsg && (
            <div
              role="alert"
              className={`p-3 text-xs font-semibold border ${
                isObsidian
                  ? 'rounded-xl bg-[#ff3b30]/15 border-[#ff3b30] text-[#ff6961]'
                  : 'rounded-none bg-[#e5001a]/10 border-[#e5001a] text-[#e5001a]'
              }`}
            >
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="model-name" className={labelClass}>
                Model Name *
              </label>
              <input
                id="model-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. PRO-X1 Turbo Carbon"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="model-sku" className={labelClass}>
                SKU Code (optional)
              </label>
              <input
                id="model-sku"
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="e.g. PX1-TRB-99"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="model-dept" className={labelClass}>
                Department Section *
              </label>
              <select
                id="model-dept"
                value={department}
                onChange={(e) => setDepartment(e.target.value as Department)}
                className={inputClass}
              >
                <option value="men">Men&apos;s Collection</option>
                <option value="women">Women&apos;s Collection</option>
                <option value="kids">Kids&apos; Collection</option>
              </select>
            </div>

            <div>
              <label htmlFor="model-cat" className={labelClass}>
                Category *
              </label>
              <select
                id="model-cat"
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as Exclude<ShoeCategory, 'all'>)
                }
                className={inputClass}
              >
                <option value="marathon">Marathon &amp; Road</option>
                <option value="track">Track &amp; Tempo</option>
                <option value="trail">Trail Hybrid</option>
              </select>
            </div>

            <div>
              <label htmlFor="model-price" className={labelClass}>
                Retail Price (PKR) — 75% Off Applied
              </label>
              <input
                id="model-price"
                type="number"
                min={4000}
                step={500}
                value={originalPriceInput}
                onChange={(e) => setOriginalPriceInput(e.target.value)}
                className={inputClass}
              />
              <div
                className={`text-xs font-mono-tech mt-1 ${
                  isObsidian ? 'text-[#ccff00]' : 'text-[#e5001a] font-semibold'
                }`}
              >
                Drop Price: {formatPKR(discountedPrice)} (75% Off)
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label htmlFor="model-weight" className={labelClass}>
                  Weight (oz)
                </label>
                <input
                  id="model-weight"
                  type="number"
                  step="0.1"
                  min={3}
                  value={weightOzInput}
                  onChange={(e) => setWeightOzInput(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="model-drop" className={labelClass}>
                  Drop (mm)
                </label>
                <input
                  id="model-drop"
                  type="number"
                  min={2}
                  max={14}
                  value={dropMmInput}
                  onChange={(e) => setDropMmInput(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="model-subtitle" className={labelClass}>
              Short Description / Subtitle
            </label>
            <input
              id="model-subtitle"
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g. Dual-fork carbon propulsion daily marathon trainer"
              className={inputClass}
            />
          </div>

          {/* Lead Photo Selector (automatically includes 4 studio photos) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className={labelClass}>
                Select Studio Colorway &amp; Lead Photo (4 Angles Included)
              </span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {STUDIO_PHOTO_PRESETS.map((preset, idx) => {
                const selected = idx === photoPresetIndex;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setPhotoPresetIndex(idx)}
                    title={preset.label}
                    className={`overflow-hidden cursor-pointer transition-all ${
                      isObsidian ? 'rounded-lg' : 'rounded-none'
                    } ${
                      selected
                        ? isObsidian
                          ? 'ring-2 ring-[#ccff00]'
                          : 'ring-2 ring-[#e5001a]'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="aspect-[4/3]">
                      <ResilientImage
                        src={preset.src}
                        alt={preset.label}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Included Free Product Block */}
          <div
            className={`p-4 space-y-3 ${
              isObsidian
                ? 'rounded-xl bg-[#09090b] border border-zinc-800'
                : 'rounded-none bg-[#f4f4f5] border border-[#0d0d0e]'
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
              <Gift
                className={`w-4 h-4 ${
                  isObsidian ? 'text-[#ccff00]' : 'text-[#e5001a]'
                }`}
              />
              <span>Included Free Product (PKR 0)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label htmlFor="model-gift-name" className={labelClass}>
                  Free Product Name
                </label>
                <input
                  id="model-gift-name"
                  type="text"
                  value={freeGiftName}
                  onChange={(e) => setFreeGiftName(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="model-gift-val" className={labelClass}>
                  Gift Worth (PKR)
                </label>
                <input
                  id="model-gift-val"
                  type="number"
                  min={500}
                  step={100}
                  value={freeGiftValueInput}
                  onChange={(e) => setFreeGiftValueInput(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2.5 sm:gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className={`h-11 w-full sm:w-auto px-5 text-xs font-bold uppercase tracking-wider cursor-pointer ${
                isObsidian
                  ? 'rounded-full border border-zinc-700 text-zinc-200 hover:border-white'
                  : 'rounded-none border border-[#0d0d0e] text-[#0d0d0e] hover:bg-[#f4f4f5]'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`h-11 w-full sm:w-auto px-6 inline-flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider cursor-pointer transition-transform duration-150 active:scale-[0.98] ${
                isObsidian
                  ? 'rounded-full bg-[#ccff00] text-[#09090b] hover:bg-[#d8ff33] volt-glow'
                  : 'rounded-none bg-[#0d0d0e] text-white hover:bg-[#e5001a] apex-hard-shadow-sm'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Add Shoe Model</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
