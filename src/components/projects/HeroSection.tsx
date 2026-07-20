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
      ? "min-h-12 w-full max-w-xs bg-white/10 px-5 py-3 text-sm font-normal text-[#ababab] outline-none backdrop-blur-xl transition duration-300 hover:bg-black/50 hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-transparent sm:w-auto sm:max-w-none sm:px-10 sm:py-4"
      : "min-h-12 w-full max-w-xs border border-white/80 bg-white px-5 py-3 text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-black outline-none transition duration-300 hover:bg-black hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-transparent sm:w-auto sm:max-w-none sm:px-10 sm:py-4 sm:text-xs sm:tracking-[0.22em]";

  return (
    <section className="relative isolate  h-[100dvh] overflow-hidden bg-black text-white">
      <HeroBackgroundVideo />
      <div className="absolute inset-0 bg-black/38" />
      <div className="relative z-10 flex h-full flex-col items-center justify-end px-6 text-center">
        <div className="my-auto flex flex-col">
          <span className="mb-5 text-4xl font-medium uppercase sm:text-5xl lg:text-6xl">
            project index
          </span>
          <span className="text-xs font-light uppercase sm:text-sm">by nabshy</span>
        </div>
        <button
          type="button"
          onClick={onOpenRegistration}
          className={`mb-24 sm:mb-36 ${buttonClassName}`}
        >
          {messages.downloadFactSheet}
        </button>
      </div>
      <ScrollIndicator label={messages.scrollToProjects} />
    </section>
  );
}
