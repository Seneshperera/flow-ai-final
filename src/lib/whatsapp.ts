import axios from "axios";

interface WhatsAppMessage {
  to: string;
  type: "text" | "template" | "document";
  text?: string;
  templateName?: string;
  templateLanguage?: string;
  documentUrl?: string;
  documentFilename?: string;
  components?: any[];
}

export class WhatsAppService {
  private token: string;
  private phoneNumberId: string;
  private baseUrl: string;

  constructor() {
    this.token = process.env.WHATSAPP_ACCESS_TOKEN || "";
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || "";
    this.baseUrl = `https://graph.facebook.com/v17.0/${this.phoneNumberId}/messages`;
  }

  async sendMessage({ to, type, text, templateName, templateLanguage, documentUrl, documentFilename, components }: WhatsAppMessage) {
    if (!this.token || !this.phoneNumberId) {
      console.warn("WhatsApp API credentials missing. Simulating send:", { to, type });
      return { success: true, simulated: true };
    }

    const payload: any = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: to,
      type: type,
    };

    if (type === "text") {
      payload.text = { preview_url: true, body: text };
    } else if (type === "template") {
      payload.template = {
        name: templateName,
        language: { code: templateLanguage || "en_US" },
        components: components || [],
      };
    } else if (type === "document") {
      payload.document = {
        link: documentUrl,
        filename: documentFilename,
      };
    }

    try {
      const response = await axios.post(this.baseUrl, payload, {
        headers: {
          "Authorization": `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error("WhatsApp API Error:", error.response?.data || error.message);
      return { success: false, error: error.response?.data || error.message };
    }
  }

  // Enterprise helpers
  async sendLowStockAlert(adminPhone: string, productName: string, remainingStock: number) {
    return this.sendMessage({
      to: adminPhone,
      type: "template",
      templateName: "low_stock_alert",
      components: [
        {
          type: "body",
          parameters: [
            { type: "text", text: productName },
            { type: "text", text: remainingStock.toString() }
          ]
        }
      ]
    });
  }

  async sendInvoice(customerPhone: string, invoiceUrl: string, invoiceId: string) {
    return this.sendMessage({
      to: customerPhone,
      type: "document",
      documentUrl: invoiceUrl,
      documentFilename: `Invoice_${invoiceId}.pdf`
    });
  }
}

export const whatsapp = new WhatsAppService();
