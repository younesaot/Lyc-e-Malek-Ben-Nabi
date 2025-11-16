import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addStudent, getStudentById, updateStudent } from "@/lib/storage";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

export default function StudentForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: "",
    studentId: "",
    grade: "",
    gender: "",
    status: "",
  });

  useEffect(() => {
    if (isEdit && id) {
      const student = getStudentById(id);
      if (student) {
        setFormData({
          name: student.name,
          studentId: student.studentId,
          grade: student.grade,
          gender: student.gender,
          status: student.status,
        });
      }
    }
  }, [isEdit, id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.studentId || !formData.grade || !formData.gender || !formData.status) {
      toast.error("يرجى ملء جميع الحقول");
      return;
    }

    if (isEdit && id) {
      updateStudent(id, formData);
      toast.success("تم تحديث بيانات التلميذ بنجاح");
    } else {
      const newStudent = {
        id: uuidv4(),
        ...formData,
        createdAt: new Date().toISOString(),
      };
      addStudent(newStudent);
      toast.success("تم إضافة التلميذ بنجاح");
    }

    navigate("/students");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">{isEdit ? "تعديل بيانات تلميذ" : "إضافة تلميذ جديد"}</h1>
        <p className="text-muted-foreground">املأ النموذج لإضافة أو تعديل بيانات التلميذ</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>البيانات الشخصية</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">اسم التلميذ</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="أدخل الاسم الكامل"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="studentId">الرقم التعريفي</Label>
              <Input
                id="studentId"
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                placeholder="أدخل الرقم التعريفي"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="grade">الصف / القسم</Label>
              <Input
                id="grade"
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                placeholder="مثال: السنة الأولى ثانوي - علوم"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">الجنس</Label>
              <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الجنس" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ذكر">ذكر</SelectItem>
                  <SelectItem value="أنثى">أنثى</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">الصفة</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الصفة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="داخلي">داخلي</SelectItem>
                  <SelectItem value="نصف داخلي">نصف داخلي</SelectItem>
                  <SelectItem value="خارجي">خارجي</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                {isEdit ? "حفظ التعديلات" : "إضافة التلميذ"}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate("/students")} className="flex-1">
                إلغاء
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
