import { Link, useLocation } from "react-router-dom";
import { GraduationCap, Home, QrCode, Users, Calendar, UserX, Database, Smartphone, Info, Menu } from "lucide-react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { useState } from "react";

const navItems = [
  { to: "/", label: "الرئيسية", icon: Home },
  { to: "/scan", label: "مسح QR", icon: QrCode },
  { to: "/students", label: "التلاميذ", icon: Users },
  { to: "/attendance", label: "الحضور", icon: Calendar },
  { to: "/absence", label: "الغياب", icon: UserX },
  { to: "/database", label: "قاعدة البيانات", icon: Database },
  { to: "/install", label: "تثبيت التطبيق", icon: Smartphone },
  { to: "/about", label: "عن التطبيق", icon: Info },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-card border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="hidden sm:inline">نظام الحضور والغياب</span>
            <span className="sm:hidden">نظام الحضور</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.to} to={item.to}>
                <Button
                  variant={location.pathname === item.to ? "default" : "ghost"}
                  size="sm"
                  className="gap-2"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>

          {/* Mobile Navigation */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle className="text-right">القائمة</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-2 mt-6">
                {navItems.map((item) => (
                  <Link key={item.to} to={item.to} onClick={() => setOpen(false)}>
                    <Button
                      variant={location.pathname === item.to ? "default" : "ghost"}
                      className="w-full justify-start gap-2"
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6">{children}</main>

      <footer className="bg-card border-t py-4 text-center text-sm text-muted-foreground">
        <p>© 2025 ثانوية مالك بن نبي - جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
}
