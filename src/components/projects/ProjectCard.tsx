"use client";

import Image from "next/image";
import type { Project } from "@/types/project";
import { LocationIcon } from "./LocationIcon";

type ProjectCardProps = {
  project: Project;
  onRegister: () => void;
  priority?: boolean;
};

export function ProjectCard({
  project,
  onRegister,
  priority = false,
}: ProjectCardProps) {
  return (
    <article className="group relative aspect-[3/4] overflow-hidden bg-[#071A33] text-white">
      <Image
        src={project.image}
        alt={`${project.title} ${project.propertyType} in ${project.location}`}
        fill
        priority={priority}
        sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 92vw"
        className="object-cover transition duration-500 ease-out group-hover:scale-[1.035] group-focus-within:scale-[1.035]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/76 via-black/12 to-black/18" />
      <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/32 group-focus-within:bg-black/32" />

      <div className="absolute left-5 right-5 top-5 md:left-7 md:right-7 md:top-7">
        <h3 className="font-serif text-[clamp(2rem,4.6vw,3.9rem)] font-light uppercase leading-none tracking-[0.03em]">
          {project.title}
        </h3>
        <p className="mt-2 text-[0.65rem] font-semibold uppercase tracking-[0.38em] text-white/82">
          {project.subtitle}
        </p>
      </div>

      <div className="absolute left-5 right-5 bottom-5 md:left-7 md:right-7 md:bottom-7">
        <p className="text-sm text-white/86 md:text-base">
          {project.propertyType} Starting From {project.startingPrice}
        </p>
        <div className="mt-3 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.08em] text-white md:text-base">
          <LocationIcon />
          <span>{project.location}</span>
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center px-7">
        <button
          type="button"
          onClick={onRegister}
          className="w-full max-w-[17rem] bg-white px-6 py-4 text-xs font-bold uppercase tracking-[0.22em] text-[#071A33] opacity-100 outline-none transition duration-300 hover:bg-[#071A33] hover:text-white focus-visible:ring-2 focus-visible:ring-white md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100"
        >
          Register Interest
        </button>
      </div>
    </article>
  );
}
