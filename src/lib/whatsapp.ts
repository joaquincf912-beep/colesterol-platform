import type { CartItem } from '@/types';

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '583026456024';

/**
 * Generate a pre-rendered WhatsApp message based on cart contents.
 * Opens WhatsApp with the order details ready to send.
 */
export function sendOrderToWhatsApp(
  items: CartItem[],
  customerName: string,
  customerPhone: string,
  customerAddress: string,
  paymentMethod: string,
  total: number
) {
  const itemsList = items
    .map((item) => {
      let line = `• ${item.quantity}x ${item.product.name}`;

      // Add customizations
      const customizations = Object.entries(item.customizations)
        .map(([group, value]) => `${group}: ${Array.isArray(value) ? value.join(', ') : value}`)
        .join(' | ');

      if (customizations) line += ` (${customizations})`;

      // Add removed ingredients
      if (item.removed_ingredients.length > 0) {
        line += ` Sin: ${item.removed_ingredients.join(', ')}`;
      }

      // Add notes
      if (item.notes) line += ` Nota: ${item.notes}`;

      return line;
    })
    .join('\n');

  const message = `*NUEVO PEDIDO — COLESTEROL*

*Cliente:* ${customerName}
*Teléfono:* ${customerPhone}
*Dirección:* ${customerAddress}

*Pedido:*
${itemsList}

*Total:* $${total.toFixed(2)}
*Pago:* ${paymentMethod}

¡Gracias por elegir TraccionWeb!`;

  const encodedMessage = encodeURIComponent(message);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

  window.open(url, '_blank');
}

/**
 * Generate a simplified WhatsApp message for quick contact
 */
export function contactWhatsApp(phone: string, message?: string) {
  const text = message || '¡Hola! Estoy interesado en el menú de TraccionWeb';
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}
