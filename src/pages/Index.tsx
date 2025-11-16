import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, UserCheck, TrendingUp, Calendar, QrCode, UsersRound, FileText, Smartphone, Clock } from "lucide-react";
import StatCard from "@/components/StatCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getStudents, getTodayAttendance, getAttendanceRecords } from "@/lib/storage";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

export default function Index() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    todayAttendance: 0,
    attendanceRate: 0,
    totalRecords: 0,
  });
  const [recentRecords, setRecentRecords] = useState<any[]>([]);

  useEffect(() => {
    const students = getStudents();
    const todayRecords = getTodayAttendance();
    const allRecords = getAttendanceRecords();

    const rate = students.length > 0 ? Math.round((todayRecords.length / students.length) * 100) : 0;

    setStats({
      totalStudents: students.length,
      todayAttendance: todayRecords.length,
      attendanceRate: rate,
      totalRecords: allRecords.length,
    });

    setRecentRecords(allRecords.slice(-10).reverse());
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">لوحة المعلومات</h1>
        <p className="text-muted-foreground">مرحباً بك في نظام تسجيل الحضور والغياب</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="إجمالي التلاميذ" value={stats.totalStudents} icon={Users} iconColor="text-primary" />
        <StatCard title="حضور اليوم" value={stats.todayAttendance} icon={UserCheck} iconColor="text-success" />
        <StatCard title="نسبة الحضور" value={`${stats.attendanceRate}%`} icon={TrendingUp} iconColor="text-primary" />
        <StatCard title="إجمالي السجلات" value={stats.totalRecords} icon={Calendar} iconColor="text-muted-foreground" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>تثبيت التطبيق</CardTitle>
            <CardDescription>قم بتثبيت التطبيق على هاتفك للوصول السريع</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/install">
              <Button className="w-full gap-2">
                <Smartphone className="h-4 w-4" />
                تعليمات التثبيت
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>آخر العمليات</CardTitle>
            <CardDescription>آخر 10 عمليات حضور مسجلة</CardDescription>
          </CardHeader>
          <CardContent>
            {recentRecords.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">لا توجد سجلات بعد</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {recentRecords.map((record) => (
                  <div key={record.id} className="flex items-center justify-between text-sm p-2 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-success" />
                      <span className="font-medium">{record.studentName}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{format(new Date(record.timestamp), "HH:mm", { locale: ar })}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>معلومات سريعة</CardTitle>
          <CardDescription>الوصول السريع للصفحات الرئيسية</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            <Link to="/scan">
              <Button variant="outline" className="w-full gap-2 h-auto py-4">
                <QrCode className="h-5 w-5" />
                <div className="text-right">
                  <p className="font-semibold">مسح QR Code</p>
                  <p className="text-xs text-muted-foreground">تسجيل حضور سريع</p>
                </div>
              </Button>
            </Link>
            <Link to="/students">
              <Button variant="outline" className="w-full gap-2 h-auto py-4">
                <UsersRound className="h-5 w-5" />
                <div className="text-right">
                  <p className="font-semibold">إدارة التلاميذ</p>
                  <p className="text-xs text-muted-foreground">عرض وتعديل البيانات</p>
                </div>
              </Button>
            </Link>
            <Link to="/attendance">
              <Button variant="outline" className="w-full gap-2 h-auto py-4">
                <FileText className="h-5 w-5" />
                <div className="text-right">
                  <p className="font-semibold">التقارير المفصلة</p>
                  <p className="text-xs text-muted-foreground">عرض وطباعة التقارير</p>
                </div>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
