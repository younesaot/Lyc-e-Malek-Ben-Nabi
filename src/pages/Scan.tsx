import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, CameraOff, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { getStudentByStudentId, addAttendanceRecord, getAttendanceByDate } from "@/lib/storage";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

export default function Scan() {
  const [scanning, setScanning] = useState(false);
  const [lastScan, setLastScan] = useState<{
    success: boolean;
    message: string;
    studentName?: string;
  } | null>(null);

  const handleScan = (result: any) => {
    if (!result || !result[0]?.rawValue) return;

    const studentId = result[0].rawValue;
    const student = getStudentByStudentId(studentId);

    if (!student) {
      setLastScan({
        success: false,
        message: "لم يتم العثور على التلميذ",
      });
      toast.error("خطأ", {
        description: "لم يتم العثور على التلميذ في النظام",
      });
      setScanning(false);
      return;
    }

    const today = format(new Date(), "yyyy-MM-dd");
    const todayRecords = getAttendanceByDate(today);
    const alreadyAttended = todayRecords.some((r) => r.studentId === studentId);

    if (alreadyAttended) {
      setLastScan({
        success: false,
        message: "تم تسجيل الحضور مسبقاً اليوم",
        studentName: student.name,
      });
      toast.error("تنبيه", {
        description: `${student.name} - تم تسجيل الحضور مسبقاً`,
      });
      setScanning(false);
      return;
    }

    const record = {
      id: uuidv4(),
      studentId: student.studentId,
      studentName: student.name,
      timestamp: new Date().toISOString(),
      date: today,
    };

    addAttendanceRecord(record);

    setLastScan({
      success: true,
      message: "تم تسجيل الحضور بنجاح",
      studentName: student.name,
    });

    toast.success("نجح", {
      description: `تم تسجيل حضور ${student.name}`,
    });

    setScanning(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">مسح QR Code</h1>
        <p className="text-muted-foreground">استخدم الكاميرا لمسح كود QR الخاص بالتلميذ</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>الماسح الضوئي</CardTitle>
          <CardDescription>ضع كود QR أمام الكاميرا لتسجيل الحضور</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <Button
              onClick={() => setScanning(!scanning)}
              variant={scanning ? "destructive" : "default"}
              className="gap-2"
            >
              {scanning ? (
                <>
                  <CameraOff className="h-4 w-4" />
                  إيقاف الماسح
                </>
              ) : (
                <>
                  <Camera className="h-4 w-4" />
                  تشغيل الماسح
                </>
              )}
            </Button>
          </div>

          {scanning && (
            <div className="rounded-lg overflow-hidden border">
              <Scanner
                onScan={handleScan}
                onError={(error) => {
                  console.error(error);
                  toast.error("خطأ في الكاميرا", {
                    description: "تأكد من السماح بالوصول للكاميرا",
                  });
                }}
                components={{
                  finder: true,
                }}
                styles={{
                  container: { width: "100%" },
                }}
              />
            </div>
          )}

          {lastScan && (
            <div
              className={`p-4 rounded-lg border-2 flex items-start gap-3 ${
                lastScan.success
                  ? "bg-success/10 border-success text-success-foreground"
                  : "bg-destructive/10 border-destructive text-destructive-foreground"
              }`}
            >
              {lastScan.success ? (
                <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-semibold">{lastScan.message}</p>
                {lastScan.studentName && <p className="text-sm mt-1">{lastScan.studentName}</p>}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            تعليمات الاستخدام
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">1.</span>
              <span>اضغط على زر "تشغيل الماسح" للبدء</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">2.</span>
              <span>اسمح للمتصفح بالوصول إلى الكاميرا</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">3.</span>
              <span>ضع كود QR في مركز الإطار</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">4.</span>
              <span>سيتم تسجيل الحضور تلقائياً</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">⚠️</span>
              <span>لا يمكن تسجيل الحضور أكثر من مرة في نفس اليوم</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
