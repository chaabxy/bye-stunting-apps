// perubahan caca: Presenter kontak yang langsung berkomunikasi dengan backend
import { ContactModel, type ContactFormData } from "@/model/user/kontak-model";

export interface ContactView {
  updateFormData: (data: ContactFormData) => void;
  updateLoading: (loading: boolean) => void;
  updateErrors: (errors: string[]) => void;
}

export class KontakPresenter {
  private model: ContactModel;
  private view: ContactView;

  constructor(view: ContactView) {
    this.model = new ContactModel();
    this.view = view;
  }

  getContactInfo() {
    return this.model.getContactInfo();
  }

  handleInputChange(field: keyof ContactFormData, value: string): void {
    this.model.setFormData({ [field]: value });
    this.view.updateFormData(this.model.getFormData());
  }

  async handleSubmit(): Promise<void> {
    const validation = this.model.validateForm();

    if (!validation.isValid) {
      this.view.updateErrors(validation.errors);
      return;
    }

    try {
      this.view.updateLoading(true);
      this.view.updateErrors([]);

      const formData = this.model.getFormData();

      console.log("📤 Mengirim pesan kontak ke backend...");
      console.log("📋 Data yang dikirim:", {
        nama: formData.nama,
        email: formData.email,
        subjek: formData.subjek,
        pesan: formData.pesan.substring(0, 50) + "...",
      });

      // Langsung kirim ke backend
      const response = await fetch("https://be-byestunting-production.up.railway.app/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nama_lengkap: formData.nama,
          email: formData.email,
          subjek: formData.subjek,
          pesan: formData.pesan,
        }),
      });

      console.log("📡 Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Backend response error:", errorText);
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("📥 Response dari backend:", data);

      if (data.isError) {
        throw new Error(data.message || "Gagal mengirim pesan");
      }

      // Reset form jika berhasil
      this.model.resetForm();
      this.view.updateFormData(this.model.getFormData());

      // Success logging seperti fitur prediksi dan edukasi
      console.log("✅ PESAN BERHASIL DISIMPAN KE DATABASE!");
      console.log("📊 Detail pesan:");
      console.log("   - ID:", data.data?.id);
      console.log("   - Nama:", formData.nama);
      console.log("   - Email:", formData.email);
      console.log("   - Subjek:", formData.subjek);
      console.log("   - Tanggal:", data.data?.tanggal_kirim);
      console.log("   - Status: Belum Dibaca");
      console.log("💾 Data tersimpan di tabel: contact_messages");
      console.log("🎉", data.message);

      return { success: true, data: data.data };
    } catch (error) {
      console.error("❌ Error submitting contact form:", error);
      this.view.updateErrors([
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.",
      ]);
      return { success: false, error };
    } finally {
      this.view.updateLoading(false);
    }
  }
}
