import { Smartphone, Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Install() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center">
        <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4">
          <Smartphone className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-2">تثبيت التطبيق</h1>
        <p className="text-muted-foreground">قم بتثبيت التطبيق على هاتفك للوصول السريع</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>كيفية التثبيت</CardTitle>
          <CardDescription>اتبع الخطوات البسيطة التالية</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-1">افتح الموقع في المتصفح</h3>
                <p className="text-sm text-muted-foreground">
                  تأكد من أنك تستخدم المتصفح على هاتفك (Safari لأجهزة iPhone، Chrome أو Firefox لأجهزة Android)
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-1">افتح قائمة المتصفح</h3>
                <p className="text-sm text-muted-foreground">
                  <strong>iPhone (Safari):</strong> اضغط على زر المشاركة (المربع مع السهم للأعلى)<br />
                  <strong>Android (Chrome/Firefox):</strong> اضغط على قائمة النقاط الثلاث في الأعلى
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-1">اختر "إضافة إلى الشاشة الرئيسية"</h3>
                <p className="text-sm text-muted-foreground">
                  ابحث عن خيار "Add to Home Screen" أو "إضافة إلى الشاشة الرئيسية" واضغط عليه
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold mb-1">أكمل التثبيت</h3>
                <p className="text-sm text-muted-foreground">
                  اضغط على "إضافة" أو "Install" لإكمال التثبيت. ستجد أيقونة التطبيق على شاشتك الرئيسية
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>مميزات التطبيق</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">يعمل بدون إنترنت</p>
                <p className="text-sm text-muted-foreground">جميع البيانات محفوظة محلياً</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">سريع وسهل الاستخدام</p>
                <p className="text-sm text-muted-foreground">واجهة بسيطة ومباشرة</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">يفتح مثل التطبيقات العادية</p>
                <p className="text-sm text-muted-foreground">بدون حاجة للمتصفح</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">لا يحتاج مساحة كبيرة</p>
                <p className="text-sm text-muted-foreground">خفيف على الجهاز</p>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
