import { useState, useEffect } from "react";
import { Database as DatabaseIcon, Download, Upload, Trash2, FileSpreadsheet, Users, Calendar, UserX, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { getStudents, getAttendanceRecords, getTodayAttendance, exportDatabase, importDatabase, clearAllData, addStudent } from "@/lib/storage";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";

export default function Database() {
  const [stats, setStats] = useState({
    students: 0,
    records: 0,
    todayAbsent: 0,
  });

  useEffect(() => {
    updateStats();
  }, []);

  const updateStats = () => {
    const students = getStudents();
    const records = getAttendanceRecords();
    const today = getTodayAttendance();
    const absent = students.length - today.length;

    setStats({
      students: students.length,
      records: records.length,
      todayAbsent: Math.max(0, absent),
    });
  };

  const handleExportJSON = () => {
    const data = exportDatabase();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `database-${format(new Date(), "yyyy-MM-dd-HHmm")}.json`;
    a.click();
    toast.success("تم تصدير قاعدة البيانات بنجاح");
  };

  const handleExportExcel = () => {
    const students = getStudents();
    const data = students.map((s) => ({
      الاسم: s.name,
      "الرقم التعريفي": s.studentId,
      الصف: s.grade,
      الجنس: s.gender,
      الصفة: s.status,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "التلاميذ");
    XLSX.writeFile(wb, `تلاميذ-${format(new Date(), "yyyy-MM-dd")}.xlsx`);
    toast.success("تم تصدير الملف بنجاح");
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        importDatabase(data);
        updateStats();
        toast.success("تم استيراد البيانات بنجاح");
      } catch (error) {
        toast.error("خطأ في قراءة الملف");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        let imported = 0;
        jsonData.forEach((row: any) => {
          const name = row["الاسم"] || row["name"] || row["Name"];
          const studentId = row["الرقم التعريفي"] || row["studentId"] || row["StudentId"];
          const grade = row["الصف"] || row["grade"] || row["Grade"];
          const gender = row["الجنس"] || row["gender"] || row["Gender"];
          const status = row["الصفة"] || row["status"] || row["Status"];

          if (name && studentId && grade && gender && status) {
            const student = {
              id: uuidv4(),
              name,
              studentId,
              grade,
              gender,
              status,
              createdAt: new Date().toISOString(),
            };
            addStudent(student);
            imported++;
          }
        });

        updateStats();
        toast.success(`تم استيراد ${imported} تلميذ بنجاح`);
      } catch (error) {
        toast.error("خطأ في قراءة الملف");
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = "";
  };

  const handleClearAll = () => {
    clearAllData();
    updateStats();
    toast.success("تم حذف جميع البيانات");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">إدارة قاعدة البيانات</h1>
        <p className="text-muted-foreground">نسخ احتياطي واستيراد البيانات</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">إجمالي التلاميذ</p>
                <h3 className="text-3xl font-bold">{stats.students}</h3>
              </div>
              <div className="p-3 rounded-lg bg-muted text-primary">
                <Users className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">سجلات الحضور</p>
                <h3 className="text-3xl font-bold">{stats.records}</h3>
              </div>
              <div className="p-3 rounded-lg bg-muted text-success">
                <Calendar className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">غياب اليوم</p>
                <h3 className="text-3xl font-bold">{stats.todayAbsent}</h3>
              </div>
              <div className="p-3 rounded-lg bg-muted text-destructive">
                <UserX className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DatabaseIcon className="h-5 w-5" />
            النسخ الاحتياطي
          </CardTitle>
          <CardDescription>تصدير واستيراد قاعدة البيانات الكاملة</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-3">
            <Button onClick={handleExportJSON} className="flex-1 gap-2">
              <Download className="h-4 w-4" />
              تصدير JSON
            </Button>
            <Button onClick={handleExportExcel} variant="outline" className="flex-1 gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              تصدير Excel
            </Button>
          </div>
          <div>
            <input
              type="file"
              accept=".json"
              onChange={handleImportJSON}
              className="hidden"
              id="import-json"
            />
            <label htmlFor="import-json">
              <Button asChild variant="outline" className="w-full gap-2">
                <span>
                  <Upload className="h-4 w-4" />
                  استيراد JSON
                </span>
              </Button>
            </label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            استيراد من Excel
          </CardTitle>
          <CardDescription>
            قم برفع ملف Excel يحتوي على أعمدة: الاسم، الرقم التعريفي، الصف، الجنس، الصفة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleImportExcel}
            className="hidden"
            id="import-excel"
          />
          <label htmlFor="import-excel">
            <Button asChild variant="outline" className="w-full gap-2">
              <span>
                <Upload className="h-4 w-4" />
                اختيار ملف Excel
              </span>
            </Button>
          </label>
        </CardContent>
      </Card>

      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            منطقة خطرة
          </CardTitle>
          <CardDescription>حذف جميع البيانات نهائياً (لا يمكن التراجع)</CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="gap-2">
                <Trash2 className="h-4 w-4" />
                حذف جميع البيانات
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>هل أنت متأكد تماماً؟</AlertDialogTitle>
                <AlertDialogDescription>
                  سيتم حذف جميع التلاميذ وسجلات الحضور نهائياً. هذا الإجراء لا يمكن التراجع عنه.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>إلغاء</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearAll} className="bg-destructive">
                  نعم، احذف كل شيء
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
