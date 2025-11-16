import { useState, useEffect } from "react";
import { FileSpreadsheet, Printer, Search, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAttendanceRecords } from "@/lib/storage";
import { AttendanceRecord } from "@/types";
import { format, parseISO } from "date-fns";
import { ar } from "date-fns/locale";
import * as XLSX from "xlsx";
import { toast } from "sonner";

export default function Attendance() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    setRecords(getAttendanceRecords());
  }, []);

  const filteredRecords = records.filter((r) => {
    const matchesSearch = r.studentName.includes(search) || r.studentId.includes(search);
    const matchesDate = !selectedDate || r.date === selectedDate;
    return matchesSearch && matchesDate;
  });

  const groupedByDate = filteredRecords.reduce((acc, record) => {
    if (!acc[record.date]) {
      acc[record.date] = [];
    }
    acc[record.date].push(record);
    return acc;
  }, {} as Record<string, AttendanceRecord[]>);

  const sortedDates = Object.keys(groupedByDate).sort().reverse();

  const handleExportExcel = () => {
    const data = filteredRecords.map((r) => ({
      "اسم التلميذ": r.studentName,
      "الرقم التعريفي": r.studentId,
      التاريخ: format(parseISO(r.timestamp), "yyyy-MM-dd", { locale: ar }),
      الوقت: format(parseISO(r.timestamp), "HH:mm", { locale: ar }),
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "الحضور");
    XLSX.writeFile(wb, `الحضور-${format(new Date(), "yyyy-MM-dd")}.xlsx`);
    toast.success("تم تصدير الملف بنجاح");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">سجلات الحضور</h1>
          <p className="text-muted-foreground">عرض وتصدير سجلات الحضور</p>
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
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="ابحث بالاسم أو الرقم..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-10"
            />
          </div>
          <div className="relative">
            <CalendarIcon className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="pr-10"
            />
          </div>
        </CardContent>
      </Card>

      {sortedDates.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <p className="text-center text-muted-foreground">لا توجد سجلات حضور</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {sortedDates.map((date) => (
            <Card key={date}>
              <CardHeader>
                <CardTitle>{format(parseISO(date), "EEEE، d MMMM yyyy", { locale: ar })}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {groupedByDate[date].map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-semibold">{record.studentName}</p>
                        <p className="text-sm text-muted-foreground">#{record.studentId}</p>
                      </div>
                      <p className="text-sm font-medium">
                        {format(parseISO(record.timestamp), "HH:mm", { locale: ar })}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
