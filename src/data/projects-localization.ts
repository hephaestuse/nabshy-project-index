import type { Locale } from "@/types/locale";
import type { JobTitleOption } from "@/types/registration";

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
  submittingRegistration: string;
  preparingDownload: string;
  downloadError: string;
  successMessage: string;
  languageSwitchLabel: string;
  languageSwitchTarget: string;
  validation: {
    fullNameRequired: string;
    fullNameTooLong: string;
    phoneRequired: string;
    phoneInvalid: string;
    jobTitleRequired: string;
    jobTitleInvalid: string;
    projectRequired: string;
    projectNotFound: string;
    brochureNotAvailable: string;
    sessionRetry: string;
    internalError: string;
  };
  jobTitles: JobTitleOption[];
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
  submittingRegistration: "Preparing Download",
  preparingDownload: "Preparing download...",
  downloadError: "Download could not be started. Please try again.",
  successMessage: "Your download is starting.",
  languageSwitchLabel: "Switch language to Persian",
  languageSwitchTarget: "fa",
  validation: {
    fullNameRequired: "Full name is required.",
    fullNameTooLong: "Full name must be 120 characters or fewer.",
    phoneRequired: "Phone number is required.",
    phoneInvalid: "Enter a valid phone number.",
    jobTitleRequired: "Job title is required.",
    jobTitleInvalid: "Select a valid job title.",
    projectRequired: "Select a project to download.",
    projectNotFound: "This project is no longer available.",
    brochureNotAvailable: "This brochure is not available yet.",
    sessionRetry: "Please register again to continue.",
    internalError: "Something went wrong. Please try again.",
  },
  jobTitles: [
    { value: "architect", label: "Architect" },
    { value: "developer", label: "Developer" },
    { value: "contractor", label: "Contractor" },
    { value: "consultant", label: "Consultant" },
    { value: "interior-designer", label: "Interior Designer" },
    { value: "real-estate-agent", label: "Real Estate Agent" },
    { value: "other", label: "Other" },
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
  submittingRegistration: "در حال آماده‌سازی دانلود",
  preparingDownload: "در حال آماده‌سازی دانلود...",
  downloadError: "دانلود شروع نشد. دوباره تلاش کنید.",
  successMessage: "دانلود شما در حال شروع شدن است.",
  languageSwitchLabel: "تغییر زبان به انگلیسی",
  languageSwitchTarget: "en",
  validation: {
    fullNameRequired: "وارد کردن نام و نام خانوادگی الزامی است.",
    fullNameTooLong: "نام و نام خانوادگی باید حداکثر ۱۲۰ کاراکتر باشد.",
    phoneRequired: "وارد کردن شماره تماس الزامی است.",
    phoneInvalid: "شماره تماس معتبر وارد کنید.",
    jobTitleRequired: "انتخاب عنوان شغلی الزامی است.",
    jobTitleInvalid: "عنوان شغلی معتبر انتخاب کنید.",
    projectRequired: "یک پروژه برای دانلود انتخاب کنید.",
    projectNotFound: "این پروژه دیگر در دسترس نیست.",
    brochureNotAvailable: "بروشور این پروژه هنوز آماده نیست.",
    sessionRetry: "برای ادامه دوباره ثبت‌نام کنید.",
    internalError: "مشکلی پیش آمد. دوباره تلاش کنید.",
  },
  jobTitles: [
    { value: "architect", label: "معمار" },
    { value: "developer", label: "توسعه‌دهنده" },
    { value: "contractor", label: "پیمانکار" },
    { value: "consultant", label: "مشاور" },
    { value: "interior-designer", label: "طراح داخلی" },
    { value: "real-estate-agent", label: "مشاور املاک" },
    { value: "other", label: "سایر" },
  ],
};

const messagesByLocale = {
  en: englishMessages,
  fa: persianMessages,
} satisfies Record<Locale, ProjectsMessages>;

export function getProjectsMessages(locale: Locale) {
  return messagesByLocale[locale];
}
