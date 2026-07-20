import Link from "next/link";
import type { ProjectsMessages } from "@/data/projects-localization";
import type { Locale } from "@/types/locale";

type LanguageSwitchProps = {
  locale: Locale;
  messages: ProjectsMessages;
};

export function LanguageSwitch({ locale, messages }: LanguageSwitchProps) {
  const href = locale === "en" ? "/fa/projects" : "/projects";

  return (
    <Link
      href={href}
      aria-label={messages.languageSwitchLabel}
      className="fixed left-5 top-5 z-40 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white outline-none backdrop-blur-xl transition duration-300 hover:bg-white/80 hover:text-black focus-visible:ring-2 focus-visible:ring-white sm:left-7 sm:top-7"
      dir="ltr"
      hrefLang={messages.languageSwitchTarget}
    >
      {messages.languageSwitchTarget}
    </Link>
  );
}
