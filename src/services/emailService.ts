import { sendContactForm } from './bookingService';

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export const sendContactEmail = async (formData: ContactFormData): Promise<void> => {
  try {
    await sendContactForm(formData);
  } catch (error) {
    console.error('Error sending contact email:', error);
    throw new Error('Failed to send contact form');
  }
};