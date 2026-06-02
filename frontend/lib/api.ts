import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// ==========================================
// 1. ENDPOINT AUTH (Sesuai auth.py)
// ==========================================
export const loginUser = async (credentials: any) => {
  // const response = await api.post("/auth/login", credentials);
  // return response.data;
  console.log("Mock Login dengan:", credentials);
};

// ==========================================
// 2. ENDPOINT MEETINGS (Sesuai meetings.py)
// ==========================================
export const getMeetings = async () => {
  console.log("Mengambil data rapat statis...");
  return [
    { id: "1", title: "Sync Up NLP Team", status: "Dijadwalkan", date: "2026-06-01" },
    { id: "2", title: "Review UI/UX MeetMate", status: "Selesai", date: "2026-05-30" }
  ];
};

export const createMeeting = async (meetingData: any) => {
  console.log("Membuat rapat baru:", meetingData);
  return { success: true };
};

// ==========================================
// 3. ENDPOINT RECORDINGS (Sesuai recordings.py)
// ==========================================
export const uploadRecording = async (meetingId: string, formData: FormData) => {
  console.log(`Mengupload rekaman untuk meeting ${meetingId}`);
};

// ==========================================
// 4. ENDPOINT CHECK-IN (Sesuai checkin.py)
// ==========================================
export const submitCheckIn = async (token: string, attendanceData: any) => {
  console.log(`Submit absensi token: ${token}`, attendanceData);
};

export default api;