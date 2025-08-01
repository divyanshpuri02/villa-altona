export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export const sendContactEmail = async (formData: ContactFormData): Promise<void> => {
  console.log('Contact form:', formData);
  localStorage.setItem('contact', JSON.stringify(formData));
};
