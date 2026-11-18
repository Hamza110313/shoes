import { DropUpdate, OrderRecord, RegisteredUser, ShoeProduct } from '../types';
import { formatPKR } from './currency';

export function sanitizePhoneForWaMe(rawPhone?: string): string {
  if (!rawPhone) return '';
  return rawPhone.replace(/[^\d]/g, '');
}

export function buildWhatsAppUrl(message: string, rawPhone?: string): string {
  const digits = sanitizePhoneForWaMe(rawPhone);
  const encoded = encodeURIComponent(message);
  if (digits.length >= 7) {
    return `https://wa.me/${digits}?text=${encoded}`;
  }
  return `https://wa.me/?text=${encoded}`;
}

export function getAppDeepLink(params?: Record<string, string>): string {
  if (typeof window === 'undefined') return '';
  const url = new URL(window.location.href);
  url.search = '';
  if (params) {
    Object.entries(params).forEach(([key, val]) => {
      if (val) url.searchParams.set(key, val);
    });
  }
  return url.toString();
}

export function formatProductWhatsAppMessage(
  product: ShoeProduct,
  options: {
    colorwayName: string;
    usSize: string;
    includeTelemetry?: boolean;
    customNote?: string;
  }
): string {
  const link = getAppDeepLink({
    shoe: product.id,
    size: options.usSize,
  });

  const lines = [
    `*PRO-X1 SHOE 75% OFF DROP — ${product.name}*`,
    `SKU: \`${product.sku}\` | *${formatPKR(product.price)}* (was ~${formatPKR(product.originalPrice)}~ — 75% OFF)`,
    `Colorway: ${options.colorwayName}`,
    `Selected Size: US ${options.usSize} · Free 1st-Order Transport · 30-Day Return Guarantee`,
    `Free Product Included: ${product.freeGift.name} (PKR 0 — Worth ${formatPKR(product.freeGift.valuePKR)})`,
  ];

  if (options.includeTelemetry !== false) {
    lines.push(
      `Specs: ${product.telemetry.dropMm}mm drop · ${product.telemetry.weightOz} oz · ${product.telemetry.stackMm}mm stack · ${product.telemetry.plate}`
    );
  }

  if (options.customNote?.trim()) {
    lines.push('', options.customNote.trim());
  }

  if (link) {
    lines.push('', `Inspect & reserve: ${link}`);
  }

  return lines.join('\n');
}

export function formatUpdateWhatsAppMessage(
  update: DropUpdate,
  product?: ShoeProduct,
  customNote?: string
): string {
  const link = getAppDeepLink(
    product ? { shoe: product.id, tab: 'updates' } : { tab: 'updates' }
  );

  const lines = [
    `*PRO-X1 SHOE ${update.categoryLabel.toUpperCase()}*`,
    `*${update.title}*`,
    update.summary,
  ];

  if (update.highlightMetric) {
    lines.push(`Status: ${update.highlightMetric}`);
  }

  if (product) {
    lines.push(
      `Model: ${product.name} (\`${product.sku}\`) — ${product.telemetry.weightOz} oz · ${product.telemetry.dropMm}mm drop`
    );
  }

  if (customNote?.trim()) {
    lines.push('', `Note: ${customNote.trim()}`);
  }

  if (link) {
    lines.push('', `Live feed: ${link}`);
  }

  return lines.join('\n');
}

export function formatOrderWhatsAppMessage(order: OrderRecord): string {
  const itemLines = order.items.map(
    (item) =>
      `• ${item.quantity}x ${item.name} (${item.colorwayName}, US ${item.usSize}) — ${formatPKR(
        item.price * item.quantity
      )}${item.freeGiftName ? `\n  + Free Included: ${item.quantity}x ${item.freeGiftName} (PKR 0)` : ''}`
  );

  const link = getAppDeepLink({ tab: 'orders', order: order.id });

  const lines = [
    `*PRO-X1 SHOE ORDER UPDATE — #${order.id}*`,
    `Status: *${order.status}*`,
    `Tracking: \`${order.trackingCode}\``,
    '',
    ...itemLines,
    '',
    `Total Paid: *${formatPKR(order.total)}*`,
    `Recipient: ${order.customerName}`,
    `Return Window: 30 Days (${order.returnDeadline || '30-Day Guarantee'})`,
  ];

  if (link) {
    lines.push(`View receipt: ${link}`);
  }

  return lines.join('\n');
}

export function formatRegistrationWhatsAppMessage(user: RegisteredUser): string {
  const link = getAppDeepLink({ tab: user.preferredDepartment });
  const lines = [
    `*PRO-X1 SHOE MEMBER REGISTRATION CONFIRMED*`,
    `Member ID: \`${user.memberId}\``,
    `Name: *${user.fullName}*`,
    `Collection: ${user.preferredDepartment.toUpperCase()} (US ${user.preferredUsSize})`,
    `City: ${user.city}`,
    `Unlocked: 75% Off All Shoes · +1 Free Product Per Pair · Free 1st-Order Transport · 30-Day Returns`,
  ];

  if (link) {
    lines.push('', `Open Collection: ${link}`);
  }

  return lines.join('\n');
}

export async function copyTextToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

export async function triggerNativeShare(title: string, text: string): Promise<boolean> {
  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      await navigator.share({ title, text });
      return true;
    } catch {
      return false;
    }
  }
  return false;
}
