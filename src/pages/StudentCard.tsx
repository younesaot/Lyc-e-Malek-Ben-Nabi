import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { GraduationCap, Download, Printer, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getStudentById } from "@/lib/storage";
import { Student } from "@/types";
import { toast } from "sonner";

export default function StudentCard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);

  useEffect(() => {
    if (id) {
      const found = getStudentById(id);
      if (found) {
        setStudent(found);
      } else {
        toast.error("لم يتم العثور على التلميذ");
        navigate("/students");
      }
    }
  }, [id, navigate]);

  const handleDownloadQR = () => {
    const svg = document.getElementById("qr-code");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");

      const downloadLink = document.createElement("a");
      downloadLink.download = `QR-${student?.studentId}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();

      toast.success("تم تحميل كود QR بنجاح");
    };

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  const handlePrint = () => {
    window.print();
  };

  if (!student) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="no-print flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">بطاقة التلميذ</h1>
          <p className="text-muted-foreground">بطاقة تعريف التلميذ مع كود QR</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/students")} className="gap-2">
            <ArrowRight className="h-4 w-4" />
            رجوع
          </Button>
          <Button variant="outline" onClick={handleDownloadQR} className="gap-2">
            <Download className="h-4 w-4" />
            تحميل QR
          </Button>
          <Button onClick={handlePrint} className="gap-2">
            <Printer className="h-4 w-4" />
            طباعة
          </Button>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="print-card bg-card border-2 border-primary rounded-xl shadow-lg overflow-hidden" style={{ width: "85mm", minHeight: "54mm" }}>
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
              <QRCodeSVG id="qr-code" value={student.studentId} size={120} level="H" />
              <p className="text-xs text-center text-muted-foreground">2025/2026</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
