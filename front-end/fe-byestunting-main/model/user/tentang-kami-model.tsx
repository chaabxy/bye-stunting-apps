export interface TeamMember {
  name: string;
  role: string;
  university: string;
  image: string;
}

export interface MissionItem {
  icon: string;
  text: string;
}

export class TentangKamiModel {
  private teamMembers: TeamMember[] = [
    {
      name: "Adelia Cesar",
      role: "Machine Learning Engineer",
      university: "Universitas Tadulako",
      image: "/adel.jpg?height=200&width=200",
    },
    {
      name: "Olifiana",
      role: "Machine Learning Engineer",
      university: "Universitas Tadulako",
      image: "/olif.jpg?height=200&width=200",
    },
    {
      name: "Hairul",
      role: "Project Manager",
      university: "Universitas Tadulako",
      image: "/hairul.jpg?height=200&width=200",
    },
    {
      name: "Ihsan Nurdin",
      role: "Front-End & Back-End Developer",
      university: "Institut Teknologi Garut",
      image: "/ihsan.jpg?height=200&width=200",
    },
    {
      name: "Cha Cha Nisya Asyah",
      role: "Front-End & Back-End Developer",
      university: "Institut Teknologi Garut",
      image: "/caca.jpg?height=200&width=200",
    },
    {
      name: "Alya Siti Rahmah",
      role: "Backend Developer",
      university: "Institut Teknologi Garut",
      image: "/alya.jpg?height=200&width=200",
    },
  ];

  private missionItems: MissionItem[] = [
    {
      icon: "CheckCircle",
      text: "Menyediakan alat prediksi risiko stunting berbasis AI yang akurat dan mudah digunakan",
    },
    {
      icon: "ArchiveRestore",
      text: "Memberikan rekomendasi edukasi sesuai dengan tingkat persentase dari hasil prediksi",
    },
    {
      icon: "NotepadText",
      text: "Menyediakan konten edukasi berkualitas tentang pencegahan stunting dan gizi anak",
    },
    {
      icon: "Users",
      text: "Membantu orang tua melakukan deteksi sejak dini terhadap pertumbuhan anak mereka",
    },
    {
      icon: "Contact",
      text: "Menyediakan Kontak untuk pertanyaan dan saran yang ingin diberikan",
    },
  ];

  getTeamMembers(): TeamMember[] {
    return this.teamMembers;
  }

  getMissionItems(): MissionItem[] {
    return this.missionItems;
  }

  getCompanyInfo() {
    return {
      name: "ByeStunting",
      description:
        "ByeStunting adalah platform inovatif yang didedikasikan untuk membantu orang tua mencegah stunting pada anak sejak dini.",
      mission:
        "ByeStunting hadir dengan misi untuk menurunkan angka stunting di Indonesia melalui teknologi dan edukasi. Kami berkomitmen untuk mendukung program nasional dalam menurunkan angka stunting menjadi 18% pada akhir tahun 2025.",
      heroTitle: "Bersama Melawan Stunting",
      heroSubtitle:
        "Kami berkomitmen untuk menurunkan angka stunting di Indonesia melalui teknologi dan edukasi",
    };
  }
}
