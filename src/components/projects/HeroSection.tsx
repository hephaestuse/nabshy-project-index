import type { ProjectsMessages } from "@/data/projects-localization";
import { HeroBackgroundVideo } from "./HeroBackgroundVideo";
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
      ? "bg-white/10 backdrop-blur-xl px-8 py-4 text-sm font-normal text-[#ababab] outline-none transition duration-300 hover:bg-black/50 hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-transparent sm:px-10"
      : "border border-white/80 bg-white px-8 py-4 text-xs font-bold uppercase tracking-[0.22em] text-black outline-none transition duration-300 hover:bg-black hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-transparent sm:px-10";

  return (
    <section className="relative isolate  h-[100dvh] overflow-hidden bg-black text-white">
      <HeroBackgroundVideo />
      <div className="absolute inset-0 bg-black/38" />
      <div className="relative z-10 flex h-full flex-col items-center justify-end px-6 text-center">
        <div className="flex flex-col my-auto">
          <span className="font-medium mb-5 text-3xl md:text-3xl lg:text-6xl uppercase ">
            project index
          </span>
          <span className="uppercase text-sm font-light">by nabshy</span>
        </div>
        <button
          type="button"
          onClick={onOpenRegistration}
          className={`mb-36 ${buttonClassName}`}
        >
          {messages.downloadFactSheet}
        </button>
      </div>
      <ScrollIndicator label={messages.scrollToProjects} />
    </section>
  );
}
