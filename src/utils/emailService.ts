import { Order } from '../types';
import emailjs from '@emailjs/browser';

/**
 * Sends an email notification using the EmailJS SDK.
 * If credentials are not present, it logs a detailed preview
 * and resolves with a simulated state.
 */
export async function sendStatusUpdateEmail(order: Order): Promise<{ success: boolean; simulated: boolean; info: string }> {
  const serviceId = (import.meta as any).env.VITE_EMAILJS_SERVICE_ID;
  const templateId = (import.meta as any).env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = (import.meta as any).env.VITE_EMAILJS_PUBLIC_KEY;

  const emailTarget = order.customerEmail || 'pelanggan@example.com';

  console.log(`[EmailJS SDK Trigger] Memulai proses notifikasi untuk Order ${order.id}. Email Target: ${emailTarget}`);

  // Base parameters passed to the template
  const templateParams = {
    order_id: order.id,
    customer_name: order.customerName,
    customer_email: emailTarget,
    category: order.category,
    brand_type: order.brandType,
    complaint: order.complaint,
    status: order.status,
    technician_notes: order.technicianNotes || 'Tidak ada catatan tambahan.',
    repair_cost: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(order.repairCost),
    shop_contact: '+62 812-3456-7890'
  };

  const hasCredentials = !!(serviceId && templateId && publicKey);

  if (!hasCredentials) {
    const errorMsg = 'EmailJS Credentials (VITE_EMAILJS_SERVICE_ID, template, / public) tidak terdeteksi di env. Berjalan dalam mode simulasi.';
    console.warn(errorMsg);
    
    // Simulate latency for premium feel
    await new Promise((resolve) => setTimeout(resolve, 820));

    return {
      success: true,
      simulated: true,
      info: `Simulasi Email Terkirim ke: ${emailTarget} untuk status "${order.status}"!`
    };
  }

  try {
    const result = await emailjs.send(serviceId, templateId, templateParams, publicKey);
    
    if (result.status === 200 || result.text === 'OK') {
      return {
        success: true,
        simulated: false,
        info: `Email nyata sukses terkirim lewat EmailJS ke ${emailTarget}!`
      };
    } else {
      throw new Error(`EmailJS SDK returned status ${result.status}: ${result.text}`);
    }
  } catch (err: any) {
    console.error('EmailJS SDK Error:', err);
    return {
      success: false,
      simulated: false,
      info: err?.message || 'Gagal mengirim email lewat EmailJS SDK'
    };
  }
}
