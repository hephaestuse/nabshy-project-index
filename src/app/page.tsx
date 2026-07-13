import { HomeSplitSection } from "@/components/home/HomeSplitSection";

const sections = [
  {
    title: "project index",
    subtitle: "Dubai investment index",
    href: "/projects",
    image: "/images/home/section-1.jpg",
  },
  {
    title: "branding agency",
    subtitle: "Broker-led opportunities",
    href: "#advisory",
    image: "/images/home/section-2.jpg",
  },
  {
    title: "material index",
    subtitle: "Premium launch intelligence",
    href: "#briefs",
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
