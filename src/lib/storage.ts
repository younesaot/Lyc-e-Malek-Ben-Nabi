import { Student, AttendanceRecord, DatabaseExport } from "@/types";
import { format } from "date-fns";

const STUDENTS_KEY = "attendance_students";
const RECORDS_KEY = "attendance_records";

export const getStudents = (): Student[] => {
  const data = localStorage.getItem(STUDENTS_KEY);
  return data ? JSON.parse(data) : [];
};

export const getStudentById = (id: string): Student | undefined => {
  const students = getStudents();
  return students.find((s) => s.id === id);
};

export const getStudentByStudentId = (studentId: string): Student | undefined => {
  const students = getStudents();
  return students.find((s) => s.studentId === studentId);
};

export const addStudent = (student: Student): void => {
  const students = getStudents();
  students.push(student);
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
};

export const updateStudent = (id: string, data: Partial<Student>): void => {
  const students = getStudents();
  const index = students.findIndex((s) => s.id === id);
  if (index !== -1) {
    students[index] = { ...students[index], ...data };
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
  }
};

export const deleteStudent = (id: string): void => {
  const students = getStudents();
  const filtered = students.filter((s) => s.id !== id);
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(filtered));
};

export const getAttendanceRecords = (): AttendanceRecord[] => {
  const data = localStorage.getItem(RECORDS_KEY);
  return data ? JSON.parse(data) : [];
};

export const getTodayAttendance = (): AttendanceRecord[] => {
  const records = getAttendanceRecords();
  const today = format(new Date(), "yyyy-MM-dd");
  return records.filter((r) => r.date === today);
};

export const getAttendanceByDate = (date: string): AttendanceRecord[] => {
  const records = getAttendanceRecords();
  return records.filter((r) => r.date === date);
};

export const addAttendanceRecord = (record: AttendanceRecord): void => {
  const records = getAttendanceRecords();
  records.push(record);
  localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
};

export const deleteAttendanceRecord = (studentId: string, date: string): void => {
  const records = getAttendanceRecords();
  const filtered = records.filter((r) => !(r.studentId === studentId && r.date === date));
  localStorage.setItem(RECORDS_KEY, JSON.stringify(filtered));
};

export const exportDatabase = (): DatabaseExport => {
  return {
    students: getStudents(),
    attendanceRecords: getAttendanceRecords(),
    exportDate: new Date().toISOString(),
  };
};

export const importDatabase = (data: DatabaseExport): void => {
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(data.students));
  localStorage.setItem(RECORDS_KEY, JSON.stringify(data.attendanceRecords));
};

export const clearAllData = (): void => {
  localStorage.removeItem(STUDENTS_KEY);
  localStorage.removeItem(RECORDS_KEY);
};
