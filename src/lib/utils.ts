import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { OrderStatus } from '@/types';

/**
 * Merge Tailwind classes with conflict resolution
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency (USD)
 */
export function formatPrice(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

/**
 * Calculate elapsed time in minutes from a timestamp
 */
export function getElapsedMinutes(timestamp: string): number {
  const now = new Date();
  const then = new Date(timestamp);
  return Math.floor((now.getTime() - then.getTime()) / 60000);
}

/**
 * Get the urgency color for KDS based on elapsed time
 */
export function getOrderUrgencyColor(elapsedMinutes: number): string {
  if (elapsedMinutes < 10) return 'bg-white';        // White — chill
  if (elapsedMinutes < 15) return 'bg-cholesterol-yellow'; // Yellow — warming up
  return 'bg-cholesterol-red';                        // Red — URGENT
}

/**
 * Get status step index for progress bar
 */
export function getStatusStep(status: OrderStatus): number {
  const steps: OrderStatus[] = ['received', 'preparing', 'ready', 'dispatched', 'on_the_way', 'delivered'];
  return steps.indexOf(status);
}

/**
 * Format time as HH:MM
 */
export function formatTime(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString('es-VE', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * Pago Móvil data for clipboard
 */
export const PAGO_MOVIL_DATA = {
  ci: 'V-12345678',
  phone: '0414-1234567',
  bank: '0102 (Banco de Venezuela)',
};
