import { HomeSplitSection } from "@/components/home/HomeSplitSection";

const sections = [
  {
    title: "project index",
    subtitle: "Specialized Journal of Construction Projects",
    href: "/project-index",
    image: "/images/home/section-1.jpg",
  },
  {
    title: "branding agency",
    subtitle: "Construction Industry Branding Agency",
    href: "https://nabshy.agency/",
    image: "/images/home/section-2.jpg",
  },
  {
    title: "material index",
    subtitle: "Premium launch intelligence",
    href: "#",
    image: "/images/home/section-3.jpg",
  },
];

export default function Home() {
  return (
    <main className="h-[100dvh] overflow-hidden bg-black">
      <h1 className="sr-only">Nabshy premium real estate brochure prototype</h1>
      <div className="flex h-full flex-col md:flex-row">
        {sections.map((section, index) => (
          <HomeSplitSection
            key={section.title}
            title={section.title}
            subtitle={section.subtitle}
            href={section.href}
            image={section.image}
            priority={index === 0}
          />
        ))}
      </div>
    </main>
  );
}
