export interface Student {
  id: string;
  name: string;
  studentId: string;
  grade: string;
  gender: string;
  status: string;
  createdAt: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  timestamp: string;
  date: string;
}

export interface DatabaseExport {
  students: Student[];
  attendanceRecords: AttendanceRecord[];
  exportDate: string;
}
