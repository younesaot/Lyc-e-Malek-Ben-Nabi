import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserPlus, Printer, Search, CheckCircle, XCircle, Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { getStudents, deleteStudent, addAttendanceRecord, getAttendanceByDate } from "@/lib/storage";
import { Student } from "@/types";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setStudents(getStudents());
  }, []);

  const filteredStudents = students.filter(
    (s) =>
      s.name.includes(search) ||
      s.studentId.includes(search) ||
      s.grade.includes(search)
  );

  const handleDelete = (id: string) => {
    deleteStudent(id);
    setStudents(getStudents());
    toast.success("تم حذف التلميذ بنجاح");
  };

  const handleMarkAttendance = (student: Student) => {
    const today = format(new Date(), "yyyy-MM-dd");
    const todayRecords = getAttendanceByDate(today);
    const alreadyAttended = todayRecords.some((r) => r.studentId === student.studentId);

    if (alreadyAttended) {
      toast.error("تم تسجيل الحضور مسبقاً اليوم");
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
    toast.success(`تم تسجيل حضور ${student.name}`);
  };

  const handleMarkAbsence = (student: Student) => {
    toast.info(`تم تسجيل غياب ${student.name}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">إدارة التلاميذ</h1>
          <p className="text-muted-foreground">عرض وإدارة قائمة التلاميذ</p>
        </div>
        <div className="flex gap-2">
          <Link to="/students/add">
            <Button className="gap-2">
              <UserPlus className="h-4 w-4" />
              إضافة تلميذ
            </Button>
          </Link>
          <Link to="/students/print-all">
            <Button variant="outline" className="gap-2">
              <Printer className="h-4 w-4" />
              طباعة البطاقات
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>البحث عن تلميذ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="ابحث بالاسم، الرقم أو الصف..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-10"
            />
          </div>
        </CardContent>
      </Card>

      {filteredStudents.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <p className="text-center text-muted-foreground">
              {search ? "لا توجد نتائج للبحث" : "لا توجد تلاميذ بعد"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredStudents.map((student) => (
            <Card key={student.id}>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-bold text-lg">{student.name}</h3>
                    <p className="text-sm text-muted-foreground">#{student.studentId}</p>
                  </div>

                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="text-muted-foreground">الصف:</span> {student.grade}
                    </p>
                    <p>
                      <span className="text-muted-foreground">الجنس:</span> {student.gender}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">الصفة:</span>
                      <Badge variant={student.status === "داخلي" ? "default" : "secondary"}>
                        {student.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 gap-1 text-success hover:text-success"
                      onClick={() => handleMarkAttendance(student)}
                    >
                      <CheckCircle className="h-3 w-3" />
                      حضور
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 gap-1 text-destructive hover:text-destructive"
                      onClick={() => handleMarkAbsence(student)}
                    >
                      <XCircle className="h-3 w-3" />
                      غياب
                    </Button>
                  </div>

                  <div className="flex gap-2">
                    <Link to={`/students/card/${student.id}`} className="flex-1">
                      <Button size="sm" variant="outline" className="w-full gap-1">
                        <Eye className="h-3 w-3" />
                        البطاقة
                      </Button>
                    </Link>
                    <Link to={`/students/edit/${student.id}`} className="flex-1">
                      <Button size="sm" variant="outline" className="w-full gap-1">
                        <Pencil className="h-3 w-3" />
                        تعديل
                      </Button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="outline" className="gap-1 text-destructive">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
                          <AlertDialogDescription>
                            سيتم حذف التلميذ نهائياً. لا يمكن التراجع عن هذا الإجراء.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>إلغاء</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(student.id)}>
                            حذف
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
