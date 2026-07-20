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
      ? "break-words text-xl font-light leading-tight sm:text-4xl lg:text-5xl"
      : "break-words text-xl font-light uppercase leading-tight sm:text-4xl lg:text-5xl";

  const ctaClassName =
    messages.locale === "fa"
      ? "flex min-h-11 w-full items-center justify-center bg-white px-2 py-2 text-xs font-medium leading-tight text-black opacity-100 outline-none transition duration-300 hover:bg-black hover:text-white focus-visible:ring-2 focus-visible:ring-white sm:max-w-[17rem] sm:px-6 sm:py-4 sm:text-sm md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100"
      : "flex min-h-11 w-full items-center justify-center bg-white px-2 py-2 text-[0.625rem] font-medium uppercase leading-tight tracking-[0.08em] text-black opacity-100 outline-none transition duration-300 hover:bg-black hover:text-white focus-visible:ring-2 focus-visible:ring-white sm:max-w-[17rem] sm:px-6 sm:py-4 sm:text-xs sm:tracking-[0.22em] md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100";

  return (
    <article className="group relative aspect-3/4 overflow-hidden bg-[#969696] text-white">
      {project.image ? (
        <Image
          src={project.image}
          alt={project.title}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 50vw"
          className="object-cover transition duration-500 ease-out group-hover:scale-[1.035] group-focus-within:scale-[1.035]"
        />
      ) : null}
      <div className="absolute inset-0 bg-linear-to-t from-black/76 via-black/12 to-black/18" />
      <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/32 group-focus-within:bg-black/32" />

      <div className="absolute inset-0 p-4 sm:p-7">
        <h3 className={titleClassName}>{project.title}</h3>
        <h4 className="text-xs" >{project.developerName}</h4>
      </div>

      <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5 md:bottom-7 md:left-7 md:right-7">
        <div className="mt-2 flex items-center gap-1.5 text-[0.65rem] font-medium uppercase leading-tight tracking-[0.06em] text-white sm:mt-3 sm:gap-2 sm:text-sm sm:tracking-[0.08em] md:text-base">
          <span>{project.usage}</span>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-[0.65rem] font-medium uppercase leading-tight tracking-[0.06em] text-white sm:mt-3 sm:gap-2 sm:text-sm sm:tracking-[0.08em] md:text-base">
          <LocationIcon />
          <span>{project.address}</span>
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-7">
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
