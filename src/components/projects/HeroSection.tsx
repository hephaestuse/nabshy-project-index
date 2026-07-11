import Image from "next/image";
import type { ProjectsMessages } from "@/data/projects-localization";
import { ScrollIndicator } from "./ScrollIndicator";

type HeroSectionProps = {
  messages: ProjectsMessages;
  onOpenRegistration: () => void;
};

export function HeroSection({
  messages,
  onOpenRegistration,
}: HeroSectionProps) {
  const buttonClassName =
    messages.locale === "fa"
      ? "border border-white/80 bg-white px-8 py-4 text-sm font-bold text-[#071A33] outline-none transition duration-300 hover:bg-[#071A33] hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-transparent sm:px-10"
      : "border border-white/80 bg-white px-8 py-4 text-xs font-bold uppercase tracking-[0.22em] text-[#071A33] outline-none transition duration-300 hover:bg-[#071A33] hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-transparent sm:px-10";

  return (
    <section className="relative isolate h-[100dvh] overflow-hidden bg-[#071A33] text-white">
      <Image
        src="/media/projects-hero.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/38" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <button
          type="button"
          onClick={onOpenRegistration}
          className={buttonClassName}
        >
          {messages.downloadFactSheet}
        </button>
      </div>
      <ScrollIndicator label={messages.scrollToProjects} />
    </section>
  );
}
