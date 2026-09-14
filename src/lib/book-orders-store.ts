// Shared BookOrder type + in-memory store for the books payment flow.
// PayPal checkout creates pending orders; the capture route updates status; the admin panel reads them.

export type BookOrder = {
  reference: string;
  status: string;
  bookId?: string;
  bookTitle?: string;
  childName?: string;
  features?: string[];
  amountInCents?: number;
  customerEmail?: string;
  paypalOrderId?: string;
  paypalTransactionId?: string;
  paymentMethod?: string;
  updatedAt: string;
};

declare global {
  // eslint-disable-next-line no-var
  var __bookOrders: Map<string, BookOrder> | undefined;
}

export function orderStore(): Map<string, BookOrder> {
  if (!globalThis.__bookOrders) globalThis.__bookOrders = new Map();
  return globalThis.__bookOrders;
}
