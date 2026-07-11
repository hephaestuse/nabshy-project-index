import baseProjects from "@/data/projects.json";
import type { Locale } from "@/types/locale";
import type { LocalizedProject, Project } from "@/types/project";

type ProjectText = Pick<
  Project,
  "title" | "subtitle" | "location" | "propertyType" | "startingPrice"
> & {
  imageAlt: string;
};

export type ProjectsMessages = {
  locale: Locale;
  dir: "ltr" | "rtl";
  heroTitle: string;
  downloadFactSheet: string;
  scrollToProjects: string;
  sectionTitle: string;
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
  downloadFactSheet: "Download Fact Sheet",
  scrollToProjects: "Scroll to trending projects",
  sectionTitle: "Trending Projects",
  startingFrom: "Starting From",
  registerInterest: "Register Interest",
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
  downloadFactSheet: "دریافت فکت شیت",
  scrollToProjects: "رفتن به پروژه‌های منتخب",
  sectionTitle: "پروژه‌های منتخب",
  startingFrom: "شروع قیمت از",
  registerInterest: "ثبت علاقه‌مندی",
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

const persianProjects: Record<string, ProjectText> = {
  "project-1": {
    title: "آوارا",
    subtitle: "بای پالاس",
    location: "بیزنس بی",
    propertyType: "آپارتمان‌ها",
    startingPrice: "۲.۷ میلیون درهم",
    imageAlt: "پروژه آوارا، آپارتمان‌ها در بیزنس بی",
  },
  "project-2": {
    title: "اولیا | اوول",
    subtitle: "د ولی",
    location: "د ولی",
    propertyType: "ویلاها",
    startingPrice: "۷.۲ میلیون درهم",
    imageAlt: "پروژه اولیا و اوول، ویلاها در د ولی",
  },
  "project-3": {
    title: "کریک بی",
    subtitle: "دبی کریک هاربر",
    location: "دبی کریک هاربر",
    propertyType: "آپارتمان‌ها",
    startingPrice: "۱.۸ میلیون درهم",
    imageAlt: "پروژه کریک بی، آپارتمان‌ها در دبی کریک هاربر",
  },
  "project-4": {
    title: "فیور",
    subtitle: "رشید یاتس و مارینا",
    location: "رشید یاتس و مارینا",
    propertyType: "آپارتمان‌ها",
    startingPrice: "۲.۲ میلیون درهم",
    imageAlt: "پروژه فیور، آپارتمان‌ها در رشید یاتس و مارینا",
  },
  "project-5": {
    title: "سالوا",
    subtitle: "د هایتس",
    location: "د هایتس",
    propertyType: "ویلاها",
    startingPrice: "۶.۷ میلیون درهم",
    imageAlt: "پروژه سالوا، ویلاها در د هایتس",
  },
  "project-6": {
    title: "ترا وودز",
    subtitle: "اکسپو لیوینگ",
    location: "اکسپو لیوینگ",
    propertyType: "آپارتمان‌ها",
    startingPrice: "۱.۶ میلیون درهم",
    imageAlt: "پروژه ترا وودز، آپارتمان‌ها در اکسپو لیوینگ",
  },
};

const messagesByLocale = {
  en: englishMessages,
  fa: persianMessages,
} satisfies Record<Locale, ProjectsMessages>;

export function getProjectsMessages(locale: Locale) {
  return messagesByLocale[locale];
}

export function getLocalizedProjects(locale: Locale): LocalizedProject[] {
  const projects = baseProjects as Project[];

  if (locale === "en") {
    return projects.map((project) => ({
      ...project,
      imageAlt: `${project.title} ${project.propertyType} in ${project.location}`,
    }));
  }

  return projects.map((project) => ({
    ...project,
    ...persianProjects[project.id],
  }));
}
