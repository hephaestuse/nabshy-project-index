import type { Locale } from "@/types/locale";

export type ProjectsMessages = {
  locale: Locale;
  dir: "ltr" | "rtl";
  heroTitle: string;
  downloadFactSheet: string;
  scrollToProjects: string;
  sectionTitle: string;
  cityFilterPlaceholder: string;
  allUsages: string;
  resetFilters: string;
  noProjectsTitle: string;
  startingFrom: string;
  registerInterest: string;
  modalTitle: string;
  modalDescription: string;
  fullName: string;
  phoneNumber: string;
  jobTitle: string;
  selectOne: string;
  closeModal: string;
  continueToDownload: string;
  successMessage: string;
  languageSwitchLabel: string;
  languageSwitchTarget: string;
  validation: {
    fullNameRequired: string;
    phoneRequired: string;
    jobTitleRequired: string;
  };
  jobTitles: string[];
};

const englishMessages: ProjectsMessages = {
  locale: "en",
  dir: "ltr",
  heroTitle: "NABSHY PRO",
  downloadFactSheet: "Download",
  scrollToProjects: "Scroll to trending projects",
  sectionTitle: " Projects",
  cityFilterPlaceholder: "Search cities",
  allUsages: "type",
  resetFilters: "Reset filters",
  noProjectsTitle: "No projects match these filters.",
  startingFrom: "Starting From",
  registerInterest: "download",
  modalTitle: "Register Interest",
  modalDescription:
    "Enter your details to continue. This prototype keeps registration and downloads mocked.",
  fullName: "Full Name",
  phoneNumber: "Phone Number",
  jobTitle: "Job Title",
  selectOne: "Select one",
  closeModal: "Close registration modal",
  continueToDownload: "Continue to Download",
  successMessage:
    "Registration completed. Download will be enabled in the next phase.",
  languageSwitchLabel: "Switch language to Persian",
  languageSwitchTarget: "fa",
  validation: {
    fullNameRequired: "Full name is required.",
    phoneRequired: "Phone number is required.",
    jobTitleRequired: "Job title is required.",
  },
  jobTitles: [
    "Architect",
    "Developer",
    "Contractor",
    "Consultant",
    "Interior Designer",
    "Real Estate Agent",
    "Other",
  ],
};

const persianMessages: ProjectsMessages = {
  locale: "fa",
  dir: "rtl",
  heroTitle: "نبشی پرو",
  downloadFactSheet: "دانلود",
  scrollToProjects: "رفتن به پروژه‌های منتخب",
  sectionTitle: "پروژه‌ها",
  cityFilterPlaceholder: "جستجوی شهرهای",
  allUsages: "کاربری",
  resetFilters: "حذف فیلترها",
  noProjectsTitle: "پروژه‌ای با این فیلترها پیدا نشد.",
  startingFrom: "شروع قیمت از",
  registerInterest: "دریافت",
  modalTitle: "ثبت علاقه‌مندی",
  modalDescription:
    "برای ادامه، اطلاعات خود را وارد کنید. ثبت‌نام و دانلود در این نمونه فقط نمایشی هستند.",
  fullName: "نام و نام خانوادگی",
  phoneNumber: "شماره تماس",
  jobTitle: "عنوان شغلی",
  selectOne: "انتخاب کنید",
  closeModal: "بستن پنجره ثبت علاقه‌مندی",
  continueToDownload: "ادامه برای دانلود",
  successMessage:
    "ثبت‌نام انجام شد. دانلود در مرحله بعدی فعال خواهد شد.",
  languageSwitchLabel: "تغییر زبان به انگلیسی",
  languageSwitchTarget: "en",
  validation: {
    fullNameRequired: "وارد کردن نام و نام خانوادگی الزامی است.",
    phoneRequired: "وارد کردن شماره تماس الزامی است.",
    jobTitleRequired: "انتخاب عنوان شغلی الزامی است.",
  },
  jobTitles: [
    "معمار",
    "توسعه‌دهنده",
    "پیمانکار",
    "مشاور",
    "طراح داخلی",
    "مشاور املاک",
    "سایر",
  ],
};

const messagesByLocale = {
  en: englishMessages,
  fa: persianMessages,
} satisfies Record<Locale, ProjectsMessages>;

export function getProjectsMessages(locale: Locale) {
  return messagesByLocale[locale];
}
