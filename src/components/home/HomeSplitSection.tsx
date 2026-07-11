import Image from "next/image";
import Link from "next/link";

type HomeSplitSectionProps = {
  title: string;
  subtitle: string;
  href: string;
  image: string;
  priority?: boolean;
};

export function HomeSplitSection({
  title,
  subtitle,
  href,
  image,
  priority = false,
}: HomeSplitSectionProps) {
  return (
    <Link
      href={href}
      aria-label={`${title}: ${subtitle}`}
      className="group relative isolate flex h-[33.333dvh] min-h-0 overflow-hidden outline-none md:h-[100dvh] md:flex-1"
    >
      <Image
        src={image}
        alt=""
        fill
        priority={priority}
        sizes="(min-width: 768px) 33vw, 100vw"
        className="object-cover transition duration-500 ease-out group-hover:scale-[1.035] group-focus-visible:scale-[1.035]"
      />
      <span className="absolute inset-0 bg-black/50 transition duration-500 group-hover:bg-black/40 group-focus-visible:bg-black/40 md:bg-black/42 md:group-hover:bg-black/34 md:group-focus-visible:bg-black/34" />
      <span className="absolute inset-x-6 bottom-16 z-10 flex flex-col gap-1.5 text-white [text-shadow:0_1px_18px_rgb(0_0_0_/_0.65)] md:inset-x-9 md:bottom-12 md:gap-3 lg:inset-x-12 lg:bottom-16">
        <span className="h-px w-12 bg-white/70" />
        <span className="max-w-[12rem] text-[clamp(1.35rem,6.5vw,1.85rem)] font-light uppercase leading-[0.92] tracking-[0.08em] md:max-w-[16rem] md:text-[clamp(2rem,3.6vw,5rem)] md:leading-[0.9]">
          {title}
        </span>
        <span className="max-w-[20rem] text-[0.56rem] font-medium uppercase leading-4 tracking-[0.18em] text-white/78 md:text-sm md:tracking-[0.34em]">
          {subtitle}
        </span>
      </span>
    </Link>
  );
}
