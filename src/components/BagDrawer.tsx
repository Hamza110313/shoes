import { useEffect, useState } from 'react';
import {
  CheckCircle2,
  MessageCircle,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from 'lucide-react';
import { CartItem, DesignMode, OrderRecord, RegisteredUser } from '../types';
import { formatPKR } from '../utils/currency';
import { buildWhatsAppUrl, formatOrderWhatsAppMessage } from '../utils/whatsapp';
import { ResilientImage } from './ResilientImage';

interface BagDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  mode: DesignMode;
  items: CartItem[];
  onUpdateQty: (itemId: string, delta: number) => void;
  onRemoveItem: (itemId: string) => void;
  defaultWhatsAppPhone: string;
  onPlaceOrder: (payload: {
    customerName: string;
    whatsappPhone: string;
    shippingAddress: string;
  }) => OrderRecord;
  onViewOrders: () => void;
  isFirstTimeOrder: boolean;
  registeredUser?: RegisteredUser | null;
  onOpenRegister?: () => void;
}

export function BagDrawer({
  isOpen,
  onClose,
  mode,
  items,
  onUpdateQty,
  onRemoveItem,
  defaultWhatsAppPhone,
  onPlaceOrder,
  onViewOrders,
  isFirstTimeOrder,
  registeredUser,
  onOpenRegister,
}: BagDrawerProps) {
  const isObsidian = mode === 'obsidian';

  const [customerName, setCustomerName] = useState(
    registeredUser?.fullName || ''
  );
  const [whatsappPhone, setWhatsappPhone] = useState(
    registeredUser?.whatsappPhone || defaultWhatsAppPhone
  );
  const [shippingAddress, setShippingAddress] = useState(
    registeredUser
      ? `${registeredUser.shippingAddress}, ${registeredUser.city}`
      : ''
  );
  const [placedOrder, setPlacedOrder] = useState<OrderRecord | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    if (registeredUser) {
      setCustomerName((prev) => prev || registeredUser.fullName);
      setWhatsappPhone((prev) => prev || registeredUser.whatsappPhone);
      setShippingAddress(
        (prev) => prev || `${registeredUser.shippingAddress}, ${registeredUser.city}`
      );
    } else if (defaultWhatsAppPhone) {
      setWhatsappPhone((prev) => prev || defaultWhatsAppPhone);
    }
  }, [isOpen, registeredUser, defaultWhatsAppPhone]);

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPlacedOrder(null);
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalSavings = items.reduce(
    (sum, item) =>
      sum + Math.max(0, (item.originalPrice || item.price) - item.price) * item.quantity,
    0
  );
  const totalFreeGiftValue = items.reduce(
    (sum, item) => sum + (item.freeGiftValue || 0) * item.quantity,
    0
  );
  const freeShippingThreshold = 65000;
  const shippingFee =
    subtotal === 0 || isFirstTimeOrder || subtotal >= freeShippingThreshold
      ? 0
      : 1500;
  const total = subtotal + shippingFee;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    const order = onPlaceOrder({
      customerName: customerName.trim() || 'Runner Guest',
      whatsappPhone: whatsappPhone.trim() || defaultWhatsAppPhone,
      shippingAddress:
        shippingAddress.trim() || 'Express Courier Pickup — Portland Hub',
    });
    setPlacedOrder(order);
  };

  const handleClose = () => {
    setPlacedOrder(null);
    onClose();
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag and Checkout"
    >
      <div
        className={`w-full max-w-md h-full flex flex-col justify-between overflow-hidden ${
          isObsidian
            ? 'bg-[#09090b] border-l border-zinc-800 text-white'
            : 'bg-white border-l border-[#0d0d0e] text-[#0d0d0e]'
        }`}
      >
        {/* Header */}
        <div
          className={`px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between border-b ${
            isObsidian ? 'border-zinc-800' : 'border-[#0d0d0e]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5" />
            <h2
              className={`text-lg font-extrabold tracking-tight ${
                isObsidian
                  ? 'font-display-obsidian'
                  : 'font-display-apex uppercase'
              }`}
            >
              {placedOrder ? 'Order Confirmed' : `Your Bag (${items.reduce((s, i) => s + i.quantity, 0)})`}
            </h2>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close bag drawer"
            className={`w-10 h-10 flex items-center justify-center cursor-pointer transition-colors ${
              isObsidian
                ? 'rounded-full border border-zinc-800 text-zinc-400 hover:text-white'
                : 'rounded-none border border-[#0d0d0e] text-[#0d0d0e] hover:bg-[#0d0d0e] hover:text-white'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {placedOrder ? (
            <div className="space-y-6">
              <div
                className={`p-5 space-y-3 ${
                  isObsidian
                    ? 'rounded-2xl bg-[#18181b] border border-[#ccff00]/40'
                    : 'rounded-none bg-[#f4f4f5] border border-[#0d0d0e]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <CheckCircle2
                    className={`w-6 h-6 shrink-0 ${
                      isObsidian ? 'text-[#ccff00]' : 'text-[#e5001a]'
                    }`}
                  />
                  <div>
                    <div className="text-xs font-mono-tech uppercase opacity-75">
                      Order #{placedOrder.id}
                    </div>
                    <div className="text-base font-bold">
                      Confirmed — Preparing Shipment
                    </div>
                  </div>
                </div>
                <p
                  className={`text-xs leading-relaxed ${
                    isObsidian ? 'text-zinc-300' : 'text-[#474647]'
                  }`}
                >
                  Tracking code{' '}
                  <span className="font-mono-tech font-bold">
                    {placedOrder.trackingCode}
                  </span>{' '}
                  is active. Eligible for 30-day returns until{' '}
                  <span className="font-semibold">
                    {placedOrder.returnDeadline || '30 days from delivery'}
                  </span>
                  . Send your receipt directly to WhatsApp.
                </p>
              </div>

              <div className="space-y-2.5">
                <a
                  href={buildWhatsAppUrl(
                    formatOrderWhatsAppMessage(placedOrder),
                    placedOrder.whatsappPhone
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full h-12 inline-flex items-center justify-center gap-2 px-5 text-xs font-bold uppercase tracking-wider transition-colors ${
                    isObsidian
                      ? 'rounded-full bg-[#25D366] text-[#09090b] hover:bg-[#34e073]'
                      : 'rounded-none bg-[#0d0d0e] text-white hover:bg-[#e5001a]'
                  }`}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Order Receipt via WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    onViewOrders();
                  }}
                  className={`w-full h-12 text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors ${
                    isObsidian
                      ? 'rounded-full border border-zinc-700 text-white hover:bg-zinc-900'
                      : 'rounded-none border border-[#0d0d0e] bg-white text-[#0d0d0e] hover:bg-[#f4f4f5]'
                  }`}
                >
                  View Order & Tracking History
                </button>
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <ShoppingBag className="w-10 h-10 mx-auto opacity-35" />
              <div className="text-base font-bold">Your bag is empty</div>
              <p
                className={`text-sm ${
                  isObsidian ? 'text-zinc-400' : 'text-[#5f5e5f]'
                }`}
              >
                Select a performance silhouette and US size from the catalog to
                begin checkout.
              </p>
            </div>
          ) : (
            <>
              {/* Transport & 75% Off Banner */}
              <div
                className={`p-3.5 text-xs space-y-1 ${
                  isObsidian
                    ? 'rounded-xl bg-[#18181b] border border-zinc-800 text-zinc-300'
                    : 'rounded-none bg-[#f4f4f5] border border-[#0d0d0e] text-[#0d0d0e]'
                }`}
              >
                {isFirstTimeOrder ? (
                  <div>
                    <strong className="font-semibold">
                      First-Time Buyer Transport: FREE
                    </strong>{' '}
                    — Complimentary courier shipping applied to your first order.
                  </div>
                ) : subtotal >= freeShippingThreshold ? (
                  <div>
                    Unlocked{' '}
                    <strong className="font-semibold">
                      Free Express Courier
                    </strong>{' '}
                    delivery.
                  </div>
                ) : (
                  <div>
                    Standard transport ({formatPKR(1500)}). Add{' '}
                    <strong className="font-mono-tech">
                      {formatPKR(freeShippingThreshold - subtotal)}
                    </strong>{' '}
                    more for free courier.
                  </div>
                )}
                {totalSavings > 0 && (
                  <div
                    className={`font-mono-tech ${
                      isObsidian ? 'text-[#ccff00]' : 'text-[#e5001a]'
                    }`}
                  >
                    75% Off Savings: {formatPKR(totalSavings)}
                    {totalFreeGiftValue > 0
                      ? ` + ${formatPKR(totalFreeGiftValue)} Free Gear`
                      : ''}{' '}
                    · 30-Day Returns
                  </div>
                )}
              </div>

              {/* Itemized Cart List */}
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3.5 flex gap-3.5 ${
                      isObsidian
                        ? 'rounded-xl bg-[#18181b] border border-zinc-800'
                        : 'rounded-none bg-white border border-[#0d0d0e]'
                    }`}
                  >
                    <div
                      className={`w-20 h-20 shrink-0 overflow-hidden ${
                        isObsidian
                          ? 'rounded-lg bg-[#121214]'
                          : 'rounded-none bg-[#f4f4f5] border border-zinc-200'
                      }`}
                    >
                      <ResilientImage
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="text-sm font-bold truncate">
                            {item.name}
                          </div>
                          <div
                            className={`text-xs truncate ${
                              isObsidian ? 'text-zinc-400' : 'text-[#5f5e5f]'
                            }`}
                          >
                            {item.colorwayName} · US {item.usSize}
                          </div>
                          {item.freeGiftName && (
                            <div
                              className={`text-[11px] font-medium truncate mt-0.5 ${
                                isObsidian ? 'text-[#ccff00]' : 'text-[#e5001a]'
                              }`}
                            >
                              + Free: {item.freeGiftName} (PKR 0)
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.id)}
                          aria-label={`Remove ${item.name}`}
                          className="w-9 h-9 flex items-center justify-center shrink-0 text-zinc-400 hover:text-[#ff3b30] cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-2">
                        <div
                          className={`inline-flex items-center border ${
                            isObsidian
                              ? 'rounded-full border-zinc-700 bg-[#09090b]'
                              : 'rounded-none border-[#0d0d0e] bg-[#f4f4f5]'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => onUpdateQty(item.id, -1)}
                            aria-label="Decrease quantity"
                            className="w-9 h-9 flex items-center justify-center cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2.5 text-xs font-mono-tech font-bold">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQty(item.id, 1)}
                            aria-label="Increase quantity"
                            className="w-9 h-9 flex items-center justify-center cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-sm font-bold tabular-nums">
                          {formatPKR(item.price * item.quantity)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Express Checkout Form */}
              <form
                id="checkout-form"
                onSubmit={handleCheckout}
                className="space-y-3 pt-4 border-t border-zinc-800/30 dark:border-zinc-800"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="text-xs font-bold uppercase tracking-wider">
                    Express Delivery & WhatsApp Alerts
                  </div>
                  {registeredUser ? (
                    <span
                      className={`text-[11px] font-mono-tech ${
                        isObsidian ? 'text-[#ccff00]' : 'text-[#e5001a]'
                      }`}
                    >
                      {registeredUser.memberId}
                    </span>
                  ) : (
                    onOpenRegister && (
                      <button
                        type="button"
                        onClick={() => {
                          handleClose();
                          onOpenRegister();
                        }}
                        className="text-xs underline cursor-pointer opacity-80 hover:opacity-100"
                      >
                        Sign Up
                      </button>
                    )
                  )}
                </div>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Full Name"
                  aria-label="Full Name"
                  className={`w-full h-11 px-3.5 text-base sm:text-sm outline-none ${
                    isObsidian
                      ? 'rounded-lg bg-[#18181b] border border-zinc-800 text-white placeholder:text-zinc-500 focus:border-[#ccff00]'
                      : 'rounded-none bg-[#f4f4f5] border border-[#0d0d0e] text-[#0d0d0e] placeholder:text-[#767676]'
                  }`}
                />
                <input
                  type="tel"
                  value={whatsappPhone}
                  onChange={(e) => setWhatsappPhone(e.target.value)}
                  placeholder="WhatsApp Number for Tracking (e.g. +14155550194)"
                  aria-label="WhatsApp Number"
                  className={`w-full h-11 px-3.5 text-base sm:text-sm outline-none ${
                    isObsidian
                      ? 'rounded-lg bg-[#18181b] border border-zinc-800 text-white placeholder:text-zinc-500 focus:border-[#ccff00]'
                      : 'rounded-none bg-[#f4f4f5] border border-[#0d0d0e] text-[#0d0d0e] placeholder:text-[#767676]'
                  }`}
                />
                <input
                  type="text"
                  required
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Street Address, City & Postal Code"
                  aria-label="Shipping Address"
                  className={`w-full h-11 px-3.5 text-base sm:text-sm outline-none ${
                    isObsidian
                      ? 'rounded-lg bg-[#18181b] border border-zinc-800 text-white placeholder:text-zinc-500 focus:border-[#ccff00]'
                      : 'rounded-none bg-[#f4f4f5] border border-[#0d0d0e] text-[#0d0d0e] placeholder:text-[#767676]'
                  }`}
                />
              </form>
            </>
          )}
        </div>

        {/* Footer Totals & Submit */}
        {!placedOrder && items.length > 0 && (
          <div
            className={`p-4 sm:p-6 border-t space-y-4 ${
              isObsidian
                ? 'bg-[#09090b] border-zinc-800'
                : 'bg-[#f9f9fa] border-[#0d0d0e]'
            }`}
          >
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between opacity-75">
                <span>Subtotal (75% Off)</span>
                <span className="tabular-nums font-mono-tech">{formatPKR(subtotal)}</span>
              </div>
              <div className="flex justify-between opacity-75">
                <span>
                  {isFirstTimeOrder ? 'Transport (First Order)' : 'Transport / Courier'}
                </span>
                <span
                  className={`tabular-nums font-mono-tech ${
                    shippingFee === 0
                      ? isObsidian
                        ? 'text-[#ccff00] font-bold'
                        : 'text-[#e5001a] font-bold'
                      : ''
                  }`}
                >
                  {shippingFee === 0 ? 'FREE (PKR 0)' : formatPKR(shippingFee)}
                </span>
              </div>
              <div className="flex justify-between text-base font-extrabold pt-2 border-t border-zinc-800/20 dark:border-zinc-800">
                <span>Total</span>
                <span className="tabular-nums font-mono-tech">{formatPKR(total)}</span>
              </div>
            </div>

            <button
              type="submit"
              form="checkout-form"
              className={`w-full h-14 text-xs font-bold uppercase tracking-wider cursor-pointer transition-transform duration-150 active:scale-[0.98] ${
                isObsidian
                  ? 'rounded-full bg-[#ccff00] text-[#09090b] hover:bg-[#d8ff33] volt-glow'
                  : 'rounded-none bg-[#0d0d0e] text-white hover:bg-[#e5001a] apex-hard-shadow-sm'
              }`}
            >
              Complete Order — {formatPKR(total)}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
