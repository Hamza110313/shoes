import { useEffect, useMemo, useState } from 'react';
import { MessageCircle, Plus, Search } from 'lucide-react';
import {
  FOOTWEAR_CATALOG,
  INITIAL_ORDERS,
  INITIAL_UPDATES,
} from './data/footwear';
import {
  ActiveScreen,
  CartItem,
  Department,
  DesignMode,
  DropUpdate,
  OrderRecord,
  RegisteredUser,
  ShoeCategory,
  ShoeProduct,
  WhatsAppPreferences,
} from './types';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProductCard } from './components/ProductCard';
import { DepartmentScreen } from './components/DepartmentScreen';
import { ProductDetailScreen } from './components/ProductDetailScreen';
import { WhatsAppUpdatesScreen } from './components/WhatsAppUpdatesScreen';
import { OrdersScreen } from './components/OrdersScreen';
import { RegisterScreen } from './components/RegisterScreen';
import { BagDrawer } from './components/BagDrawer';
import { AddModelModal } from './components/AddModelModal';
import { ResilientImage } from './components/ResilientImage';
import { formatPKR } from './utils/currency';
import {
  getRetainedItem,
  getReturnByDateLabel,
  setRetainedItem,
} from './utils/storage';
import { buildWhatsAppUrl } from './utils/whatsapp';

const STORAGE_KEYS = {
  mode: 'kinetic_design_mode_v1',
  cart: 'kinetic_cart_v3',
  wishlist: 'kinetic_wishlist_v1',
  updates: 'prox1_updates_v5',
  orders: 'prox1_orders_v6',
  waPrefs: 'kinetic_wa_prefs_v1',
  firstOrderDone: 'kinetic_first_order_done_v1',
  registeredUser: 'prox1_registered_user_v1',
  savedAccounts: 'prox1_saved_accounts_v1',
  customModels: 'prox1_custom_models_v1',
};

const CATEGORY_FILTERS: { id: ShoeCategory; label: string }[] = [
  { id: 'all', label: 'All Footwear' },
  { id: 'marathon', label: 'Marathon Race' },
  { id: 'track', label: 'Track & Tempo' },
  { id: 'trail', label: 'Trail Hybrid' },
];

export default function App() {
  const [mode, setMode] = useState<DesignMode>(() => {
    const saved = getRetainedItem<string>(STORAGE_KEYS.mode, 'obsidian');
    return saved === 'apex' ? 'apex' : 'obsidian';
  });

  const [activeScreen, setActiveScreen] = useState<ActiveScreen>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      if (
        tab === 'men' ||
        tab === 'women' ||
        tab === 'kids' ||
        tab === 'updates' ||
        tab === 'orders' ||
        tab === 'product' ||
        tab === 'register'
      ) {
        return tab;
      }
      if (params.get('shoe')) {
        return 'product';
      }
    }
    return 'home';
  });

  const [selectedProductId, setSelectedProductId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const shoeId = params.get('shoe');
      if (shoeId && FOOTWEAR_CATALOG.some((p) => p.id === shoeId)) {
        return shoeId;
      }
    }
    return FOOTWEAR_CATALOG[0].id;
  });

  const [departmentFilter, setDepartmentFilter] = useState<'all' | Department>(
    'all'
  );
  const [categoryFilter, setCategoryFilter] = useState<ShoeCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [isAddModelOpen, setIsAddModelOpen] = useState(false);

  const [cart, setCart] = useState<CartItem[]>(() =>
    getRetainedItem<CartItem[]>(STORAGE_KEYS.cart, [])
  );

  const [wishlist, setWishlist] = useState<string[]>(() =>
    getRetainedItem<string[]>(STORAGE_KEYS.wishlist, ['aero-x1-carbon'])
  );

  const [updates, setUpdates] = useState<DropUpdate[]>(() =>
    getRetainedItem<DropUpdate[]>(STORAGE_KEYS.updates, INITIAL_UPDATES)
  );

  const [orders, setOrders] = useState<OrderRecord[]>(() =>
    getRetainedItem<OrderRecord[]>(STORAGE_KEYS.orders, INITIAL_ORDERS)
  );

  const [hasCompletedFirstOrder, setHasCompletedFirstOrder] = useState<boolean>(
    () => getRetainedItem<boolean>(STORAGE_KEYS.firstOrderDone, false)
  );

  const [waPrefs, setWaPrefs] = useState<WhatsAppPreferences>(() =>
    getRetainedItem<WhatsAppPreferences>(STORAGE_KEYS.waPrefs, {
      recipientPhone: '',
      notifyDrops: true,
      notifyRestocks: true,
      notifyOrders: true,
      notifyTelemetry: false,
    })
  );

  const [registeredUser, setRegisteredUser] = useState<RegisteredUser | null>(
    () => getRetainedItem<RegisteredUser | null>(STORAGE_KEYS.registeredUser, null)
  );

  const [savedAccounts, setSavedAccounts] = useState<RegisteredUser[]>(() =>
    getRetainedItem<RegisteredUser[]>(STORAGE_KEYS.savedAccounts, [])
  );

  const [customModels, setCustomModels] = useState<ShoeProduct[]>(() =>
    getRetainedItem<ShoeProduct[]>(STORAGE_KEYS.customModels, [])
  );

  // Sync Tailwind dark class on <html> for Obsidian vs Apex mode
  useEffect(() => {
    const root = document.documentElement;
    if (mode === 'obsidian') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    setRetainedItem(STORAGE_KEYS.mode, mode);
  }, [mode]);

  useEffect(() => {
    setRetainedItem(STORAGE_KEYS.cart, cart);
  }, [cart]);

  useEffect(() => {
    setRetainedItem(STORAGE_KEYS.wishlist, wishlist);
  }, [wishlist]);

  useEffect(() => {
    setRetainedItem(STORAGE_KEYS.updates, updates);
  }, [updates]);

  useEffect(() => {
    setRetainedItem(STORAGE_KEYS.orders, orders);
  }, [orders]);

  useEffect(() => {
    setRetainedItem(STORAGE_KEYS.waPrefs, waPrefs);
  }, [waPrefs]);

  useEffect(() => {
    setRetainedItem(STORAGE_KEYS.registeredUser, registeredUser);
  }, [registeredUser]);

  useEffect(() => {
    setRetainedItem(STORAGE_KEYS.savedAccounts, savedAccounts);
  }, [savedAccounts]);

  useEffect(() => {
    setRetainedItem(STORAGE_KEYS.customModels, customModels);
  }, [customModels]);

  const isObsidian = mode === 'obsidian';

  const allProducts = useMemo(
    () => [...customModels, ...FOOTWEAR_CATALOG],
    [customModels]
  );

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      const matchesDept =
        departmentFilter === 'all' || product.department === departmentFilter;
      const matchesCategory =
        categoryFilter === 'all' || product.category === categoryFilter;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.subtitle.toLowerCase().includes(q) ||
        product.sku.toLowerCase().includes(q);
      return matchesDept && matchesCategory && matchesSearch;
    });
  }, [allProducts, departmentFilter, categoryFilter, searchQuery]);

  const homeDepartmentSections = useMemo(() => {
    const sections: {
      id: Department;
      kicker: string;
      title: string;
      sizeScale: string;
    }[] = [
      {
        id: 'men',
        kicker: "Men's Section · Carbon Race & Track",
        title: "Men's Footwear Collection",
        sizeScale: "US Men's 7 – 13",
      },
      {
        id: 'women',
        kicker: "Women's Section · Featherlight Propulsion",
        title: "Women's Footwear Collection",
        sizeScale: "US Women's 5 – 10.5",
      },
      {
        id: 'kids',
        kicker: "Kids' Section · Youth Speed & Track",
        title: "Kids' Footwear Collection",
        sizeScale: "US Kids' 1Y – 6.5Y",
      },
    ];

    return sections
      .filter(
        (sec) => departmentFilter === 'all' || departmentFilter === sec.id
      )
      .map((sec) => ({
        ...sec,
        items: filteredProducts.filter((p) => p.department === sec.id),
      }))
      .filter((sec) => sec.items.length > 0);
  }, [departmentFilter, filteredProducts]);

  const activeProduct =
    allProducts.find((p) => p.id === selectedProductId) ||
    allProducts[0];

  const totalBagCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleInspectProduct = (productId: string) => {
    setSelectedProductId(productId);
    setActiveScreen('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleAddToBag = ({
    product,
    colorwayIndex,
    usSize,
  }: {
    product: ShoeProduct;
    colorwayIndex: number;
    usSize: string;
  }) => {
    const colorway = product.colorways[colorwayIndex] || product.colorways[0];
    const itemId = `${product.id}-${colorway.id}-${usSize}`;

    setCart((prev) => {
      const existing = prev.find((c) => c.id === itemId);
      if (existing) {
        return prev.map((c) =>
          c.id === itemId ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [
        ...prev,
        {
          id: itemId,
          productId: product.id,
          sku: product.sku,
          name: product.name,
          colorwayName: colorway.name,
          colorwayHex: colorway.hexAccent,
          usSize,
          originalPrice: product.originalPrice,
          price: product.price,
          quantity: 1,
          image: colorway.image,
          freeGiftName: product.freeGift.name,
          freeGiftValue: product.freeGift.valuePKR,
        },
      ];
    });
  };

  const handleUpdateQty = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === itemId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handlePlaceOrder = ({
    customerName,
    whatsappPhone,
    shippingAddress,
  }: {
    customerName: string;
    whatsappPhone: string;
    shippingAddress: string;
  }): OrderRecord => {
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const isFirstOrder = !hasCompletedFirstOrder;
    const shipping =
      subtotal === 0 || isFirstOrder || subtotal >= 65000 ? 0 : 1500;
    const orderNum = Math.floor(1000 + Math.random() * 9000);
    const newOrder: OrderRecord = {
      id: `PX1-${orderNum}`,
      createdAt: 'Just now',
      returnDeadline: getReturnByDateLabel(),
      customerName,
      whatsappPhone,
      shippingAddress,
      status: 'Confirmed',
      trackingCode: `PX1-${Math.floor(100000 + Math.random() * 900000)}-KHI`,
      items: [...cart],
      total: subtotal + shipping,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setHasCompletedFirstOrder(true);
    setRetainedItem(STORAGE_KEYS.firstOrderDone, true);
    setUpdates((prev) => [
      {
        id: `upd-order-${Date.now()}`,
        category: 'order',
        categoryLabel: 'Order Milestone',
        title: `Order #${newOrder.id} Confirmed for ${customerName}`,
        summary: `${newOrder.items
          .map((i) => `${i.quantity}x ${i.name} (US ${i.usSize})`)
          .join(', ')}. ${
          isFirstOrder ? 'First-order free transport applied. ' : ''
        }Tracking ${newOrder.trackingCode} ready for WhatsApp dispatch.`,
        timestamp: 'Just now',
        author: 'Order Dispatch',
        productId: newOrder.items[0]?.productId,
        productName: newOrder.items[0]?.name,
        highlightMetric: `${formatPKR(newOrder.total)} · ${newOrder.trackingCode}`,
      },
      ...prev,
    ]);
    setCart([]);
    return newOrder;
  };

  const handleAdvanceOrderStatus = (orderId: string) => {
    const flow: OrderRecord['status'][] = [
      'Confirmed',
      'Preparing Shipment',
      'In Transit',
      'Delivered',
    ];
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;
        const idx = flow.indexOf(ord.status);
        const nextStatus = flow[Math.min(idx + 1, flow.length - 1)];
        return { ...ord, status: nextStatus };
      })
    );
  };

  const handlePublishUpdate = (newUpdate: DropUpdate) => {
    setUpdates((prev) => [newUpdate, ...prev]);
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-200 ${
        isObsidian
          ? 'bg-[#09090b] text-[#f4f4f5]'
          : 'bg-[#f9f9fa] text-[#1a1c1d]'
      }`}
    >
      <Navbar
        mode={mode}
        activeScreen={activeScreen}
        onNavigate={(screen) => {
          setActiveScreen(screen);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        bagCount={totalBagCount}
        onOpenBag={() => setIsBagOpen(true)}
        isRegistered={Boolean(registeredUser)}
      />

      <main className="flex-1">
        {activeScreen === 'home' && (
          <>
            <HeroSection
              mode={mode}
              onModeChange={setMode}
              featuredProduct={FOOTWEAR_CATALOG[0]}
              onInspectFeatured={() =>
                handleInspectProduct(FOOTWEAR_CATALOG[0].id)
              }
              recipientPhone={waPrefs.recipientPhone}
            />

            {/* Shop by Department: Men, Women & Kids Pages */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-10 space-y-6">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="space-y-1">
                  <div
                    className={`text-xs font-bold uppercase tracking-wider ${
                      isObsidian ? 'text-[#ccff00]' : 'text-[#e5001a]'
                    }`}
                  >
                    Dedicated Collections
                  </div>
                  <h2
                    className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                      isObsidian
                        ? 'font-display-obsidian text-white'
                        : 'font-display-apex uppercase text-[#0d0d0e]'
                    }`}
                  >
                    Shop Men, Women & Kids
                  </h2>
                </div>
                <span
                  className={`text-xs font-mono-tech ${
                    isObsidian ? 'text-zinc-400' : 'text-[#5f5e5f]'
                  }`}
                >
                  75% Off All Goods · Free 1st-Order Transport · 30-Day Returns
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(
                  [
                    {
                      id: 'men' as Department,
                      title: 'Men',
                      subtitle: `US Men's 7 – 13 · ${
                        allProducts.filter((p) => p.department === 'men').length
                      } Silhouettes`,
                      image:
                        '/src/assets/images/shoe_obsidian_volt_1794913815323.jpg',
                    },
                    {
                      id: 'women' as Department,
                      title: 'Women',
                      subtitle: `US Women's 5 – 10.5 · ${
                        allProducts.filter((p) => p.department === 'women')
                          .length
                      } Silhouettes`,
                      image:
                        '/src/assets/images/shoe_women_aero_rose_1794915416672.jpg',
                    },
                    {
                      id: 'kids' as Department,
                      title: 'Kids',
                      subtitle: `US Kids' 1Y – 6.5Y · ${
                        allProducts.filter((p) => p.department === 'kids').length
                      } Silhouettes`,
                      image:
                        '/src/assets/images/shoe_kids_junior_volt_1794915416970.jpg',
                    },
                  ]
                ).map((dept) => (
                  <button
                    key={dept.id}
                    type="button"
                    onClick={() => {
                      setActiveScreen(dept.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`group text-left overflow-hidden cursor-pointer transition-all duration-150 ${
                      isObsidian
                        ? 'rounded-2xl bg-[#18181b] border border-zinc-800 hover:border-[#ccff00]'
                        : 'rounded-none bg-white border border-[#0d0d0e] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#0d0d0e]'
                    }`}
                  >
                    <div className="aspect-[16/10] overflow-hidden bg-[#121214]">
                      <ResilientImage
                        src={dept.image}
                        alt={`${dept.title}'s Footwear Collection`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                      />
                    </div>
                    <div className="p-4 sm:p-5 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div
                          className={`text-xl font-extrabold ${
                            isObsidian
                              ? 'font-display-obsidian text-white'
                              : 'font-display-apex uppercase text-[#0d0d0e]'
                          }`}
                        >
                          {dept.title}
                        </div>
                        <div
                          className={`text-xs mt-0.5 ${
                            isObsidian ? 'text-zinc-400' : 'text-[#5f5e5f]'
                          }`}
                        >
                          {dept.subtitle}
                        </div>
                      </div>
                      <span
                        className={`px-3.5 py-2 text-xs font-bold uppercase tracking-wider shrink-0 ${
                          isObsidian
                            ? 'rounded-full bg-[#ccff00] text-[#09090b]'
                            : 'rounded-none bg-[#0d0d0e] text-white group-hover:bg-[#e5001a]'
                        }`}
                      >
                        Open Page
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* Footwear Catalog Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 space-y-8">
              {/* Filter & Search Toolbar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h2
                    className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                      isObsidian
                        ? 'font-display-obsidian text-white'
                        : 'font-display-apex uppercase text-[#0d0d0e]'
                    }`}
                  >
                    All Performance Silhouettes
                  </h2>
                  <p
                    className={`text-sm ${
                      isObsidian ? 'text-zinc-400' : 'text-[#5f5e5f]'
                    }`}
                  >
                    75% off all goods in PKR with free transport on your first
                    order.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 w-full md:w-auto">
                  {/* Department Section Filter: All / Men / Women / Kids */}
                  <div
                    className={`inline-flex items-center gap-1 p-1 overflow-x-auto no-scrollbar max-w-full w-full sm:w-auto ${
                      isObsidian
                        ? 'rounded-full bg-[#18181b] border border-zinc-800'
                        : 'rounded-none bg-[#f4f4f5] border border-[#0d0d0e]'
                    }`}
                  >
                    {(
                      [
                        { id: 'all', label: 'All Sections' },
                        { id: 'men', label: 'Men' },
                        { id: 'women', label: 'Women' },
                        { id: 'kids', label: 'Kids' },
                      ] as { id: 'all' | Department; label: string }[]
                    ).map((dept) => {
                      const active = departmentFilter === dept.id;
                      return (
                        <button
                          key={dept.id}
                          type="button"
                          onClick={() => setDepartmentFilter(dept.id)}
                          className={`min-h-[36px] px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
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
                          {dept.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Category Tabs */}
                  <div
                    className={`inline-flex items-center gap-1 p-1 overflow-x-auto no-scrollbar max-w-full w-full sm:w-auto ${
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
                          className={`min-h-[36px] px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
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

                  {/* Search Input */}
                  <div className="relative w-full sm:w-56">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none" />
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search model or SKU..."
                      aria-label="Search footwear catalog"
                      className={`h-11 sm:h-10 pl-9 pr-3.5 text-base sm:text-xs w-full outline-none transition-colors ${
                        isObsidian
                          ? 'rounded-full bg-[#18181b] border border-zinc-800 text-white placeholder:text-zinc-500 focus:border-[#ccff00]'
                          : 'rounded-none bg-white border border-[#0d0d0e] text-[#0d0d0e] placeholder:text-[#767676] focus:border-[#e5001a]'
                      }`}
                    />
                  </div>

                  {/* Add Model Modal Trigger */}
                  <button
                    type="button"
                    onClick={() => setIsAddModelOpen(true)}
                    className={`h-11 sm:h-10 w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 text-xs font-bold uppercase tracking-wider whitespace-nowrap cursor-pointer transition-colors ${
                      isObsidian
                        ? 'rounded-full bg-[#ccff00] text-[#09090b] hover:bg-[#d8ff33]'
                        : 'rounded-none bg-[#0d0d0e] text-white hover:bg-[#e5001a]'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Model</span>
                  </button>
                </div>
              </div>

              {/* Dedicated Sections for All Men, Women, and Kids */}
              {homeDepartmentSections.length === 0 ? (
                <div
                  className={`p-10 text-center space-y-2 ${
                    isObsidian
                      ? 'rounded-2xl bg-[#18181b] border border-zinc-800 text-zinc-400'
                      : 'rounded-none bg-white border border-[#0d0d0e] text-[#5f5e5f]'
                  }`}
                >
                  <div className="text-base font-bold">
                    No matching silhouettes
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setDepartmentFilter('all');
                      setCategoryFilter('all');
                      setSearchQuery('');
                    }}
                    className="text-xs underline cursor-pointer"
                  >
                    Reset catalog filters
                  </button>
                </div>
              ) : (
                <div className="space-y-12">
                  {homeDepartmentSections.map((section) => (
                    <div
                      key={section.id}
                      id={`section-${section.id}`}
                      className="space-y-5 pt-6 border-t border-zinc-800/20 dark:border-zinc-800"
                    >
                      <div className="flex flex-wrap items-end justify-between gap-4">
                        <div className="space-y-1">
                          <div
                            className={`text-xs font-bold uppercase tracking-wider ${
                              isObsidian ? 'text-[#ccff00]' : 'text-[#e5001a]'
                            }`}
                          >
                            {section.kicker}
                          </div>
                          <h3
                            className={`text-xl sm:text-2xl font-extrabold tracking-tight ${
                              isObsidian
                                ? 'font-display-obsidian text-white'
                                : 'font-display-apex uppercase text-[#0d0d0e]'
                            }`}
                          >
                            {section.title}
                          </h3>
                        </div>

                        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                          <span
                            className={`text-xs font-mono-tech ${
                              isObsidian ? 'text-zinc-400' : 'text-[#5f5e5f]'
                            }`}
                          >
                            {section.items.length} Models · {section.sizeScale}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveScreen(section.id);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className={`min-h-[40px] px-4 py-2 text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors ${
                              isObsidian
                                ? 'rounded-full border border-zinc-700 text-zinc-200 hover:border-[#ccff00] hover:text-[#ccff00]'
                                : 'rounded-none border border-[#0d0d0e] bg-white text-[#0d0d0e] hover:bg-[#0d0d0e] hover:text-white'
                            }`}
                          >
                            View {section.id} Page
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {section.items.map((product) => (
                          <ProductCard
                            key={product.id}
                            product={product}
                            mode={mode}
                            isWishlisted={wishlist.includes(product.id)}
                            onToggleWishlist={handleToggleWishlist}
                            onInspect={handleInspectProduct}
                            recipientPhone={waPrefs.recipientPhone}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Seamless WhatsApp Updates Callout Strip */}
              <div
                className={`p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 ${
                  isObsidian
                    ? 'rounded-2xl bg-[#18181b] border border-zinc-800'
                    : 'rounded-none bg-white border border-[#0d0d0e] apex-hard-shadow'
                }`}
              >
                <div className="space-y-1.5">
                  <div
                    className={`text-xs font-bold uppercase tracking-wider ${
                      isObsidian ? 'text-[#ccff00]' : 'text-[#e5001a]'
                    }`}
                  >
                    WhatsApp Broadcast Hub
                  </div>
                  <h3
                    className={`text-xl font-bold ${
                      isObsidian
                        ? 'font-display-obsidian text-white'
                        : 'font-display-apex uppercase text-[#0d0d0e]'
                    }`}
                  >
                    Share Restocks, Lab Telemetry & Order Tracking Instantly
                  </h3>
                  <p
                    className={`text-sm ${
                      isObsidian ? 'text-zinc-400' : 'text-[#5f5e5f]'
                    }`}
                  >
                    {updates.length} live drop updates ready to dispatch to your
                    running club or buyers.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveScreen('updates');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`min-h-[44px] px-5 py-3 text-xs font-bold uppercase tracking-wider text-center cursor-pointer transition-colors ${
                      isObsidian
                        ? 'rounded-full bg-[#ccff00] text-[#09090b] hover:bg-[#d8ff33]'
                        : 'rounded-none bg-[#0d0d0e] text-white hover:bg-[#e5001a]'
                    }`}
                  >
                    Open Updates Hub
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveScreen('register');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`min-h-[44px] px-5 py-3 text-xs font-bold uppercase tracking-wider text-center cursor-pointer transition-colors ${
                      isObsidian
                        ? 'rounded-full border border-[#ccff00]/60 text-[#ccff00] hover:bg-[#ccff00] hover:text-[#09090b]'
                        : 'rounded-none border border-[#0d0d0e] bg-[#f4f4f5] text-[#0d0d0e] hover:bg-[#0d0d0e] hover:text-white'
                    }`}
                  >
                    {registeredUser ? 'Member Pass' : 'Sign Up'}
                  </button>

                  <a
                    href={buildWhatsAppUrl(
                      `*PRO-X1 SHOE DROP FEED*\n${updates[0]?.title}\n${updates[0]?.summary}`,
                      waPrefs.recipientPhone
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
                      isObsidian
                        ? 'rounded-full border border-zinc-700 text-white hover:border-[#25D366] hover:text-[#25D366]'
                        : 'rounded-none border border-[#0d0d0e] text-[#0d0d0e] hover:bg-[#0d0d0e] hover:text-white'
                    }`}
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Quick WhatsApp</span>
                  </a>
                </div>
              </div>
            </section>
          </>
        )}

        {(activeScreen === 'men' ||
          activeScreen === 'women' ||
          activeScreen === 'kids') && (
          <DepartmentScreen
            department={activeScreen}
            mode={mode}
            onModeChange={setMode}
            products={allProducts}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onInspectProduct={handleInspectProduct}
            onSwitchDepartment={(dept) => {
              setActiveScreen(dept);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onBackHome={() => {
              setActiveScreen('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            recipientPhone={waPrefs.recipientPhone}
            onOpenAddModel={() => setIsAddModelOpen(true)}
          />
        )}

        {activeScreen === 'product' && (
          <ProductDetailScreen
            product={activeProduct}
            allProducts={allProducts}
            mode={mode}
            onSelectProduct={(id) => setSelectedProductId(id)}
            onBackToDepartment={(dept) => {
              setActiveScreen(dept);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onAddToBag={handleAddToBag}
            isWishlisted={wishlist.includes(activeProduct.id)}
            onToggleWishlist={handleToggleWishlist}
            recipientPhone={waPrefs.recipientPhone}
            onRecipientPhoneChange={(phone) =>
              setWaPrefs((prev) => ({ ...prev, recipientPhone: phone }))
            }
          />
        )}

        {activeScreen === 'updates' && (
          <WhatsAppUpdatesScreen
            mode={mode}
            updates={updates}
            products={allProducts}
            preferences={waPrefs}
            onUpdatePreferences={setWaPrefs}
            onPublishUpdate={handlePublishUpdate}
            onInspectProduct={handleInspectProduct}
          />
        )}

        {activeScreen === 'orders' && (
          <OrdersScreen
            mode={mode}
            orders={orders}
            onAdvanceStatus={handleAdvanceOrderStatus}
            onBackToCatalog={() => setActiveScreen('home')}
          />
        )}

        {activeScreen === 'register' && (
          <RegisterScreen
            mode={mode}
            registeredUser={registeredUser}
            savedAccounts={savedAccounts}
            onSaveRegistration={(user) => {
              setRegisteredUser(user);
              setSavedAccounts((prev) => {
                const others = prev.filter(
                  (acc) =>
                    acc.email.toLowerCase() !== user.email.toLowerCase() &&
                    acc.memberId !== user.memberId
                );
                return [user, ...others];
              });
              if (user.notifyWhatsappDrops && user.whatsappPhone) {
                setWaPrefs((prev) => ({
                  ...prev,
                  recipientPhone: user.whatsappPhone,
                }));
              }
            }}
            onSignInUser={(user) => {
              setRegisteredUser(user);
              if (user.notifyWhatsappDrops && user.whatsappPhone) {
                setWaPrefs((prev) => ({
                  ...prev,
                  recipientPhone: user.whatsappPhone,
                }));
              }
            }}
            onClearRegistration={() => setRegisteredUser(null)}
            onBrowseDepartment={(dept) => {
              setActiveScreen(dept);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onBackHome={() => {
              setActiveScreen('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* Clean Minimal Footer */}
      <footer
        className={`border-t py-8 ${
          isObsidian
            ? 'bg-[#09090b] border-zinc-800 text-zinc-400'
            : 'bg-white border-[#0d0d0e] text-[#5f5e5f]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1">
            <span
              className={`font-bold ${
                isObsidian
                  ? 'font-display-obsidian text-white'
                  : 'font-display-apex uppercase text-[#0d0d0e]'
              }`}
            >
              PRO-X1 SHOE
            </span>
            <span aria-hidden="true">·</span>
            <span>30-Day Returns &amp; 30-Day Saved History</span>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-5 gap-y-3">
            {(['men', 'women', 'kids'] as Department[]).map((dept) => (
              <button
                key={dept}
                type="button"
                onClick={() => {
                  setActiveScreen(dept);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="uppercase underline underline-offset-4 cursor-pointer hover:opacity-80"
              >
                {dept}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setMode(isObsidian ? 'apex' : 'obsidian')}
              className="underline underline-offset-4 cursor-pointer hover:opacity-80"
            >
              Switch to {isObsidian ? 'Pro-X1 Apex (Light)' : 'Pro-X1 Obsidian (Dark)'}
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveScreen('updates');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="underline underline-offset-4 cursor-pointer hover:opacity-80"
            >
              WhatsApp Updates
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveScreen('register');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="underline underline-offset-4 cursor-pointer hover:opacity-80"
            >
              {registeredUser ? 'Account' : 'Sign Up'}
            </button>
          </div>
        </div>
      </footer>

      <BagDrawer
        isOpen={isBagOpen}
        onClose={() => setIsBagOpen(false)}
        mode={mode}
        items={cart}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        defaultWhatsAppPhone={waPrefs.recipientPhone}
        onPlaceOrder={handlePlaceOrder}
        onViewOrders={() => setActiveScreen('orders')}
        isFirstTimeOrder={!hasCompletedFirstOrder}
        registeredUser={registeredUser}
        onOpenRegister={() => {
          setActiveScreen('register');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <AddModelModal
        isOpen={isAddModelOpen}
        onClose={() => setIsAddModelOpen(false)}
        mode={mode}
        defaultDepartment={
          activeScreen === 'men' ||
          activeScreen === 'women' ||
          activeScreen === 'kids'
            ? activeScreen
            : departmentFilter === 'all'
              ? 'men'
              : departmentFilter
        }
        onAddModel={(newProduct) => {
          setCustomModels((prev) => [newProduct, ...prev]);
          setSelectedProductId(newProduct.id);
          setUpdates((prev) => [
            {
              id: `upd-model-${Date.now()}`,
              category: 'drop',
              categoryLabel: 'New Model',
              title: `${newProduct.name} Added to ${newProduct.department.toUpperCase()} Section`,
              summary: `${newProduct.subtitle}. Includes free ${newProduct.freeGift.name} at PKR 0.`,
              timestamp: 'Just now',
              author: 'Catalog Dispatch',
              productId: newProduct.id,
              productName: newProduct.name,
              highlightMetric: `${formatPKR(newProduct.price)} (75% Off)`,
            },
            ...prev,
          ]);
        }}
      />
    </div>
  );
}
