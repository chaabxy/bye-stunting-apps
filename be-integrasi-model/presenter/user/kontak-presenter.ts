import { ContactModel, type ContactFormData } from "@/model/user/kontak-model";

export interface ContactView {
  showLoading: (loading: boolean) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  updateFormData: (data: ContactFormData) => void;
}

export class ContactPresenter {
  private model: ContactModel;
  private view: ContactView | null = null;

  constructor() {
    this.model = new ContactModel();
  }

  setView(view: ContactView): void {
    this.view = view;
  }

  getContactInfo() {
    return this.model.getContactInfo();
  }

  handleInputChange(field: keyof ContactFormData, value: string): void {
    this.model.setFormData({ [field]: value });
    if (this.view) {
      this.view.updateFormData(this.model.getFormData());
    }
  }

  async handleSubmit(): Promise<void> {
    if (!this.view) return;

    const validation = this.model.validateForm();

    if (!validation.isValid) {
      this.view.showError(validation.errors.join(", "));
      return;
    }

    try {
      this.view.showLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Here you would typically send the data to your backend
      const formData = this.model.getFormData();
      console.log("Sending contact form:", formData);

      this.view.showSuccess(
        "Pesan berhasil dikirim! Tim kami akan merespons dalam 1-2 hari kerja."
      );
      this.model.resetForm();
      this.view.updateFormData(this.model.getFormData());
    } catch (error) {
      this.view.showError(
        "Terjadi kesalahan saat mengirim pesan. Silakan coba lagi."
      );
    } finally {
      this.view.showLoading(false);
    }
  }
}
