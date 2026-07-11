import type { Metadata } from "next";
import { LocalizedProjectsPage } from "@/components/projects/LocalizedProjectsPage";

export const metadata: Metadata = {
  title: "پروژه‌ها | نبشی پرو",
  description: "صفحه پروژه‌های نمونه رابط کاربری بروشور املاک لوکس.",
};

export default function PersianProjectsPage() {
  return <LocalizedProjectsPage locale="fa" />;
}
