"use client";

import Image from "next/image";
import type { ProjectsMessages } from "@/data/projects-localization";
import type { DownloadTarget } from "@/types/download";
import type { ProjectCardData } from "@/types/project";
import { LocationIcon } from "./LocationIcon";

type ProjectCardProps = {
  messages: ProjectsMessages;
  project: ProjectCardData;
  onRegister: (target: DownloadTarget) => void;
  priority?: boolean;
};

export function ProjectCard({
  messages,
  project,
  onRegister,
  priority = false,
}: ProjectCardProps) {
  const titleClassName =
    messages.locale === "fa"
      ? "text-5xl font-light leading-none"
      : "text-5xl font-light uppercase leading-none ";

  const ctaClassName =
    messages.locale === "fa"
      ? "w-full max-w-[17rem] bg-white px-6 py-4 text-sm font-medium text-black opacity-100 outline-none transition duration-300 hover:bg-black hover:text-white focus-visible:ring-2 focus-visible:ring-white md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100"
      : "w-full max-w-[17rem] bg-white px-6 py-4 text-xs font-medium uppercase tracking-[0.22em] text-black opacity-100 outline-none transition duration-300 hover:bg-black hover:text-white focus-visible:ring-2 focus-visible:ring-white md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100";

  return (
    <article className="group relative aspect-3/4 overflow-hidden bg-[#969696] text-white">
      {project.image ? (
        <Image
          src={project.image}
          alt={project.title}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 92vw"
          className="object-cover transition duration-500 ease-out group-hover:scale-[1.035] group-focus-within:scale-[1.035]"
        />
      ) : null}
      <div className="absolute inset-0 bg-linear-to-t from-black/76 via-black/12 to-black/18" />
      <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/32 group-focus-within:bg-black/32" />

      <div className="absolute inset-0 p-7">
        <h3 className={titleClassName}>{project.title}</h3>
      </div>

      <div className="absolute left-5 right-5 bottom-5 md:left-7 md:right-7 md:bottom-7">
        <div className="mt-3 flex items-center gap-2 text-sm font-medium uppercase tracking-[0.08em] text-white md:text-base">
          <span>{project.usage}</span>
        </div>
        <div className="mt-3 flex items-center gap-2 text-sm font-medium uppercase tracking-[0.08em] text-white md:text-base">
          <LocationIcon />
          <span>{project.address}</span>
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center px-7">
        <button
          type="button"
          onClick={() =>
            onRegister({
              type: "project",
              slug: project.slug,
              title: project.title,
            })
          }
          className={ctaClassName}
        >
          {messages.registerInterest}
        </button>
      </div>
    </article>
  );
}
