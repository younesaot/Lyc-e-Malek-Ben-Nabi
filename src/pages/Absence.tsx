import { useState, useEffect } from "react";
import { FileSpreadsheet, Printer, Search, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getStudents, getAttendanceByDate } from "@/lib/storage";
import { Student } from "@/types";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import * as XLSX from "xlsx";
import { toast } from "sonner";

export default function Absence() {
  const [absentStudents, setAbsentStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));

  useEffect(() => {
    calculateAbsent();
  }, [selectedDate]);

  const calculateAbsent = () => {
    const allStudents = getStudents();
    const attendance = getAttendanceByDate(selectedDate);
    const attendedIds = attendance.map((r) => r.studentId);
    const absent = allStudents.filter((s) => !attendedIds.includes(s.studentId));
    setAbsentStudents(absent);
  };

  const filteredAbsent = absentStudents.filter(
    (s) =>
      s.name.includes(search) ||
      s.studentId.includes(search) ||
      s.grade.includes(search)
  );

  const handleExportExcel = () => {
    const data = filteredAbsent.map((s) => ({
      "اسم التلميذ": s.name,
      "الرقم التعريفي": s.studentId,
      الصف: s.grade,
      الجنس: s.gender,
      الصفة: s.status,
      التاريخ: selectedDate,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "الغياب");
    XLSX.writeFile(wb, `الغياب-${selectedDate}.xlsx`);
    toast.success("تم تصدير الملف بنجاح");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">سجلات الغياب</h1>
          <p className="text-muted-foreground">عرض التلاميذ الغائبين في تاريخ محدد</p>
        </div>
        <div className="flex gap-2 no-print">
          <Button onClick={handleExportExcel} variant="outline" className="gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            تصدير Excel
          </Button>
          <Button onClick={handlePrint} className="gap-2">
            <Printer className="h-4 w-4" />
            طباعة
          </Button>
        </div>
      </div>

      <Card className="no-print">
        <CardHeader>
          <CardTitle>البحث والفلترة</CardTitle>
          <CardDescription>اختر التاريخ وابحث عن التلاميذ الغائبين</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <CalendarIcon className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="pr-10"
            />
          </div>
          <div className="relative">
            <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="ابحث بالاسم أو الرقم أو الصف..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>التلاميذ الغائبون ({filteredAbsent.length})</CardTitle>
          <CardDescription>
            {format(new Date(selectedDate), "EEEE، d MMMM yyyy", { locale: ar })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredAbsent.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              لا يوجد تلاميذ غائبون في هذا التاريخ
            </p>
          ) : (
            <div className="space-y-3">
              {filteredAbsent.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="space-y-1">
                    <p className="font-semibold">{student.name}</p>
                    <p className="text-sm text-muted-foreground">#{student.studentId}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right text-sm">
                      <p className="text-muted-foreground">الصف: {student.grade}</p>
                      <p className="text-muted-foreground">الجنس: {student.gender}</p>
                    </div>
                    <Badge variant={student.status === "داخلي" ? "default" : "secondary"}>
                      {student.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
