import { useState } from 'react';
import { Check, Copy, MessageCircle, Package } from 'lucide-react';
import { DesignMode, OrderRecord } from '../types';
import { formatPKR } from '../utils/currency';
import {
  buildWhatsAppUrl,
  copyTextToClipboard,
  formatOrderWhatsAppMessage,
} from '../utils/whatsapp';
import { ResilientImage } from './ResilientImage';

interface OrdersScreenProps {
  mode: DesignMode;
  orders: OrderRecord[];
  onAdvanceStatus: (orderId: string) => void;
  onBackToCatalog: () => void;
}

const STATUS_STEPS: OrderRecord['status'][] = [
  'Confirmed',
  'Preparing Shipment',
  'In Transit',
  'Delivered',
];

export function OrdersScreen({
  mode,
  orders,
  onAdvanceStatus,
  onBackToCatalog,
}: OrdersScreenProps) {
  const isObsidian = mode === 'obsidian';
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  const handleCopyOrder = async (order: OrderRecord) => {
    const ok = await copyTextToClipboard(formatOrderWhatsAppMessage(order));
    if (ok) {
      setCopiedOrderId(order.id);
      window.setTimeout(() => setCopiedOrderId(null), 1800);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <div
            className={`text-xs font-semibold uppercase tracking-wider ${
              isObsidian ? 'text-[#ccff00]' : 'text-[#e5001a] font-display-apex'
            }`}
          >
            Fulfillment & Dispatch Tracking
          </div>
          <h2
            className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
              isObsidian
                ? 'font-display-obsidian text-white'
                : 'font-display-apex uppercase text-[#0d0d0e]'
            }`}
          >
            Orders & WhatsApp Receipts
          </h2>
        </div>

        <button
          type="button"
          onClick={onBackToCatalog}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider cursor-pointer ${
            isObsidian
              ? 'rounded-full border border-zinc-700 text-zinc-200 hover:border-white'
              : 'rounded-none border border-[#0d0d0e] bg-white text-[#0d0d0e] hover:bg-[#0d0d0e] hover:text-white'
          }`}
        >
          Browse Footwear
        </button>
      </div>

      {orders.length === 0 ? (
        <div
          className={`p-10 text-center space-y-3 ${
            isObsidian
              ? 'rounded-2xl bg-[#18181b] border border-zinc-800 text-zinc-400'
              : 'rounded-none bg-white border border-[#0d0d0e] text-[#5f5e5f]'
          }`}
        >
          <Package className="w-8 h-8 mx-auto opacity-50" />
          <div className="text-base font-bold">No orders placed yet</div>
          <p className="text-sm">
            Add any footwear drop to your bag and complete express checkout to
            track shipments and send WhatsApp receipts.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const msg = formatOrderWhatsAppMessage(order);
            const waUrl = buildWhatsAppUrl(msg, order.whatsappPhone);
            const currentStepIdx = STATUS_STEPS.indexOf(order.status);

            return (
              <article
                key={order.id}
                className={`p-4 sm:p-6 space-y-6 ${
                  isObsidian
                    ? 'rounded-2xl bg-[#18181b] border border-zinc-800'
                    : 'rounded-none bg-white border border-[#0d0d0e] apex-hard-shadow'
                }`}
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1 min-w-0">
                    <div
                      className={`text-xs font-mono-tech flex flex-wrap items-center gap-x-2 gap-y-1 ${
                        isObsidian ? 'text-zinc-400' : 'text-[#767676]'
                      }`}
                    >
                      <span>ORDER #{order.id}</span>
                      <span aria-hidden="true">·</span>
                      <span>{order.createdAt}</span>
                      <span aria-hidden="true">·</span>
                      <span>TRACKING {order.trackingCode}</span>
                    </div>
                    <div className="text-lg font-bold">
                      {order.customerName} — {order.status}
                    </div>
                    <div
                      className={`text-xs ${
                        isObsidian ? 'text-zinc-400' : 'text-[#5f5e5f]'
                      }`}
                    >
                      {order.shippingAddress} · 30-Day Return Window
                      {order.returnDeadline ? ` (Until ${order.returnDeadline})` : ''}
                    </div>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <div
                      className={`text-xl font-extrabold tabular-nums ${
                        isObsidian ? 'text-[#ccff00]' : 'text-[#0d0d0e]'
                      }`}
                    >
                      {formatPKR(order.total)}
                    </div>
                    {order.whatsappPhone && (
                      <div className="text-xs font-mono-tech opacity-75">
                        WhatsApp: {order.whatsappPhone}
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress Milestones */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {STATUS_STEPS.map((step, idx) => {
                    const completed = idx <= currentStepIdx;
                    return (
                      <div
                        key={step}
                        className={`p-3 border text-xs font-semibold ${
                          isObsidian
                            ? `rounded-xl ${
                                completed
                                  ? 'bg-[#09090b] border-[#ccff00]/60 text-[#ccff00]'
                                  : 'bg-[#09090b] border-zinc-800 text-zinc-500'
                              }`
                            : `rounded-none ${
                                completed
                                  ? 'bg-[#0d0d0e] border-[#0d0d0e] text-white'
                                  : 'bg-[#f4f4f5] border-zinc-300 text-[#767676]'
                              }`
                        }`}
                      >
                        <div className="font-mono-tech text-[10px] opacity-75">
                          0{idx + 1}
                        </div>
                        <div className="mt-0.5">{step}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Items */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3 flex items-center gap-3 ${
                        isObsidian
                          ? 'rounded-xl bg-[#09090b] border border-zinc-800'
                          : 'rounded-none bg-[#f4f4f5] border border-[#0d0d0e]'
                      }`}
                    >
                      <div className="w-16 h-16 shrink-0 overflow-hidden bg-zinc-900">
                        <ResilientImage
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-bold truncate">
                          {item.name}
                        </div>
                        <div className="text-xs opacity-75">
                          {item.colorwayName} · US {item.usSize} · Qty{' '}
                          {item.quantity}
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
                      <div className="text-sm font-bold tabular-nums shrink-0">
                        {formatPKR(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div
                  className={`pt-4 border-t flex flex-wrap items-center justify-between gap-3 ${
                    isObsidian ? 'border-zinc-800' : 'border-zinc-200'
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-2.5">
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`min-h-[42px] inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                        isObsidian
                          ? 'rounded-full bg-[#25D366] text-[#09090b] hover:bg-[#34e073]'
                          : 'rounded-none bg-[#0d0d0e] text-white hover:bg-[#e5001a]'
                      }`}
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Send Tracking via WhatsApp</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => handleCopyOrder(order)}
                      className={`min-h-[42px] inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold cursor-pointer ${
                        isObsidian
                          ? 'rounded-full border border-zinc-700 text-zinc-200 hover:border-white'
                          : 'rounded-none border border-[#0d0d0e] text-[#0d0d0e] hover:bg-[#f4f4f5]'
                      }`}
                    >
                      {copiedOrderId === order.id ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Update</span>
                        </>
                      )}
                    </button>
                  </div>

                  {order.status !== 'Delivered' && (
                    <button
                      type="button"
                      onClick={() => onAdvanceStatus(order.id)}
                      className={`min-h-[42px] px-4 py-2 text-xs font-semibold cursor-pointer ${
                        isObsidian
                          ? 'rounded-full bg-zinc-800 text-white hover:bg-zinc-700'
                          : 'rounded-none border border-[#0d0d0e] bg-white text-[#0d0d0e] hover:bg-[#0d0d0e] hover:text-white'
                      }`}
                    >
                      Advance Shipment Stage
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
