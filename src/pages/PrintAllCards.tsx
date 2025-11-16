import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { GraduationCap, Printer, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getStudents } from "@/lib/storage";
import { Student } from "@/types";

export default function PrintAllCards() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    setStudents(getStudents());
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="no-print flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">طباعة جميع البطاقات</h1>
          <p className="text-muted-foreground">بطاقات جميع التلاميذ جاهزة للطباعة</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/students")} className="gap-2">
            <ArrowRight className="h-4 w-4" />
            رجوع
          </Button>
          <Button onClick={handlePrint} className="gap-2">
            <Printer className="h-4 w-4" />
            طباعة الكل
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {students.map((student) => (
          <div key={student.id} className="print-card bg-card border-2 border-primary rounded-xl shadow-lg overflow-hidden" style={{ width: "85mm", minHeight: "54mm" }}>
            <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-4 text-center">
              <GraduationCap className="h-8 w-8 mx-auto mb-2" />
              <h2 className="font-bold text-lg">ثانوية مالك بن نبي</h2>
              <p className="text-xs opacity-90">بطاقة تلميذ</p>
            </div>

            <div className="p-4 flex gap-4">
              <div className="flex-1 space-y-2">
                <div>
                  <p className="text-xs text-muted-foreground">الاسم</p>
                  <p className="font-bold">{student.name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">الصف</p>
                  <p className="font-semibold text-sm">{student.grade}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">الرقم التعريفي</p>
                  <p className="font-semibold text-sm">{student.studentId}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground">الجنس</p>
                    <p className="text-sm">{student.gender}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">الصفة</p>
                    <p className="text-sm">{student.status}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center gap-2">
                <QRCodeSVG value={student.studentId} size={120} level="H" />
                <p className="text-xs text-center text-muted-foreground">2025/2026</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
