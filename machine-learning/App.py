import streamlit as st
import pandas as pd
import numpy as np
import joblib
import tensorflow as tf
import matplotlib.pyplot as plt
from io import BytesIO

# === LOAD MODEL DAN PRA-PROSESOR ===
model = tf.keras.models.load_model("E:\DBS\Project Akhir Coding Camp\Model\model_stunting_nn.h5")
scaler = joblib.load("E:\DBS\Project Akhir Coding Camp\Model\scaler_stunting.pkl")
label_encoder = joblib.load("E:\DBS\Project Akhir Coding Camp\Model\label_encoder_stunting.pkl")

st.set_page_config(page_title="Prediksi Stunting", layout="centered")

st.title("🧒 Prediksi Status Gizi Anak (Stunting)")
st.write("Masukkan data anak untuk memprediksi status gizinya berdasarkan model machine learning.")

# === INPUT USER ===
umur = st.number_input("Umur (bulan)", min_value=0, max_value=60, step=1)
jenis_kelamin = st.selectbox("Jenis Kelamin", ["Laki-laki", "Perempuan"])
tinggi_badan = st.number_input("Tinggi Badan (cm)", min_value=30.0, max_value=150.0, step=0.1)
berat_badan = st.number_input("Berat Badan (kg)", min_value=2.0, max_value=60.0, step=0.1)

# === TOMBOL PREDIKSI ===
if st.button("🔍 Prediksi Status Gizi"):
    # Buat dataframe input
    input_data = pd.DataFrame({
        "umur": [umur],
        "jenis_kelamin": [1 if jenis_kelamin == "Laki-laki" else 0],
        "tinggi_badan": [tinggi_badan],
        "berat_badan": [berat_badan]
    })

    # Normalisasi
    input_scaled = scaler.transform(input_data)

    # Prediksi
    y_pred_probs = model.predict(input_scaled)
    y_pred_percent = y_pred_probs[0] * 100
    class_names = label_encoder.classes_
    predicted_class = class_names[np.argmax(y_pred_percent)]

    # === TAMPILKAN HASIL ===
    if predicted_class == "normal":
        st.success(f"✅ Prediksi Status Gizi: **{predicted_class.upper()}**")
        st.markdown("Anak kemungkinan besar dalam status gizi **normal**. Terus jaga pola makan dan kesehatan anak.")
    elif predicted_class == "stunted":
        st.warning(f"⚠️ Prediksi Status Gizi: **{predicted_class.upper()}**")
        st.markdown("Anak menunjukkan tanda-tanda **stunting**. Segera konsultasikan ke puskesmas atau ahli gizi.")
    else:
        st.error(f"❗ Prediksi Status Gizi: **{predicted_class.upper()}**")
        st.markdown("Anak berada dalam kondisi **severely stunted**. Sangat disarankan untuk segera mendapatkan perhatian medis.")

    # === Visualisasi Bar Horizontal ===
    st.subheader("📊 Distribusi Probabilitas Prediksi (%)")
    fig, ax = plt.subplots(figsize=(6, 3))
    ax.barh(class_names, y_pred_percent, color="skyblue")
    ax.set_xlim(0, 100)
    ax.set_xlabel("Persentase (%)")
    for i, v in enumerate(y_pred_percent):
        ax.text(v + 1, i, f"{v:.1f}%", va="center")
    st.pyplot(fig)

    # === DESKRIPSI TAMBAHAN ===
    st.markdown("### ℹ️ Penjelasan Tambahan Berdasarkan Hasil:")
    if predicted_class == "normal":
        st.info(
            "Status gizi anak terdeteksi **normal**.\n\n"
            "Ini menunjukkan bahwa tinggi dan berat badan anak sesuai dengan usia dan jenis kelamin. "
            "Teruskan pola makan yang sehat dan pemantauan tumbuh kembang secara berkala di posyandu atau puskesmas."
        )
    elif predicted_class == "stunted":
        st.warning(
            "Status gizi anak terindikasi **stunted** (*pendek*).\n\n"
            "Anak memiliki tinggi badan di bawah rata-rata untuk usianya. "
            "Ini bisa menjadi tanda gangguan pertumbuhan kronis. "
            "Disarankan untuk memeriksa asupan gizi harian dan konsultasi dengan ahli gizi atau tenaga kesehatan."
        )
    elif predicted_class == "severely stunted":
        st.error(
            "Status gizi anak terdeteksi **severely stunted** (*sangat pendek*).\n\n"
            "Ini adalah kondisi serius yang memerlukan penanganan segera. "
            "Segera bawa anak ke fasilitas kesehatan untuk pemeriksaan lebih lanjut dan perencanaan pemulihan gizi."
        )

    # === UNDUH HASIL ===
    hasil_df = pd.DataFrame({
        "Fitur": ["Umur (bulan)", "Jenis Kelamin", "Tinggi Badan (cm)", "Berat Badan (kg)", "Status Gizi"],
        "Nilai": [umur, jenis_kelamin, tinggi_badan, berat_badan, predicted_class.upper()]
    })

    output = BytesIO()
    hasil_df.to_csv(output, index=False)
    st.download_button("⬇️ Unduh Hasil Prediksi (CSV)", output.getvalue(), file_name="hasil_prediksi_stunting.csv", mime="text/csv")
