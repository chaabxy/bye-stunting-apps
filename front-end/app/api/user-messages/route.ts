import { NextResponse } from "next/server";

// Data pesan user (simulasi)
const userMessages = [
  {
    id: 1,
    name: "Sari Dewi",
    email: "sari.dewi@email.com",
    subject: "Konsultasi Gizi Anak",
    message:
      "Anak saya berusia 2 tahun dengan tinggi 80cm dan berat 10kg. Apakah ini normal? Mohon saran untuk menu makanan yang tepat.",
    date: "2025-01-20T10:30:00Z",
    status: "unread",
    priority: "high",
  },
  {
    id: 2,
    name: "Budi Santoso",
    email: "budi.santoso@email.com",
    subject: "Pertanyaan MPASI",
    message:
      "Bayi saya 6 bulan, baru mulai MPASI. Bolehkah langsung diberi nasi tim atau harus bubur dulu?",
    date: "2025-01-19T14:15:00Z",
    status: "read",
    priority: "medium",
  },
  {
    id: 3,
    name: "Maya Putri",
    email: "maya.putri@email.com",
    subject: "Keluhan Pertumbuhan Anak",
    message:
      "Anak saya 3 tahun tingginya masih 85cm. Dokter bilang ada indikasi stunting. Apa yang harus saya lakukan?",
    date: "2025-01-19T09:45:00Z",
    status: "replied",
    priority: "high",
  },
  {
    id: 4,
    name: "Ahmad Rizki",
    email: "ahmad.rizki@email.com",
    subject: "Saran Nutrisi Ibu Hamil",
    message:
      "Istri saya hamil 6 bulan. Apa saja nutrisi yang penting untuk mencegah stunting pada bayi?",
    date: "2025-01-18T16:20:00Z",
    status: "read",
    priority: "medium",
  },
  {
    id: 5,
    name: "Rina Sari",
    email: "rina.sari@email.com",
    subject: "Aplikasi Tidak Bisa Diakses",
    message:
      "Saya tidak bisa mengakses fitur cek stunting. Selalu muncul error. Mohon bantuannya.",
    date: "2025-01-18T11:10:00Z",
    status: "unread",
    priority: "low",
  },
  {
    id: 6,
    name: "Dedi Kurniawan",
    email: "dedi.kurniawan@email.com",
    subject: "Feedback Aplikasi",
    message:
      "Aplikasi sangat membantu! Tapi bisa ditambahkan fitur reminder untuk kontrol rutin ke posyandu?",
    date: "2025-01-17T13:30:00Z",
    status: "read",
    priority: "low",
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const limit = searchParams.get("limit");

    let filteredMessages = [...userMessages];

    // Filter berdasarkan status
    if (status && status !== "all") {
      filteredMessages = filteredMessages.filter(
        (msg) => msg.status === status
      );
    }

    // Filter berdasarkan prioritas
    if (priority && priority !== "all") {
      filteredMessages = filteredMessages.filter(
        (msg) => msg.priority === priority
      );
    }

    // Limit hasil jika diminta
    if (limit) {
      filteredMessages = filteredMessages.slice(0, Number.parseInt(limit));
    }

    // Urutkan berdasarkan tanggal terbaru
    filteredMessages.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return NextResponse.json(filteredMessages);
  } catch (error) {
    console.error("Error fetching user messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch user messages" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const newMessage = {
      id: userMessages.length + 1,
      name: body.name,
      email: body.email,
      subject: body.subject,
      message: body.message,
      date: new Date().toISOString(),
      status: "unread",
      priority: body.priority || "medium",
    };

    userMessages.unshift(newMessage);

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error("Error creating user message:", error);
    return NextResponse.json(
      { error: "Failed to create user message" },
      { status: 500 }
    );
  }
}
