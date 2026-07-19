"use client";

import { useDeferredValue, useMemo, useState } from "react";
import iranCities from "@/data/iran_cities.json";
import type { ProjectsMessages } from "@/data/projects-localization";
import type { DownloadTarget } from "@/types/download";
import type { ProjectCardData } from "@/types/project";
import { ProjectCard } from "./ProjectCard";

type IranCity = {
  cityId: string;
  provinceName: string;
  cityName: string;
  provinceId: string;
};

type ProjectsSectionProps = {
  messages: ProjectsMessages;
  projects: ProjectCardData[];
  onRegister: (target: DownloadTarget) => void;
};

const citySuggestionLimit = 8;

function normalizePersianSearch(value: string) {
  return value
    .trim()
    .replaceAll("ي", "ی")
    .replaceAll("ك", "ک")
    .replace(/\s+/g, " ")
    .toLocaleLowerCase("fa-IR");
}

const cityOptions = (iranCities as IranCity[]).map((city, index) => {
  const normalizedName = normalizePersianSearch(city.cityName);
  const normalizedProvince = normalizePersianSearch(city.provinceName);

  return {
    id: `${city.provinceId}-${city.cityId}-${index}`,
    name: city.cityName,
    province: city.provinceName,
    normalizedSearch: `${normalizedName} ${normalizedProvince}`,
  };
});

export function ProjectsSection({
  messages,
  projects,
  onRegister,
}: ProjectsSectionProps) {
  const [cityFilter, setCityFilter] = useState("");
  const [usageFilter, setUsageFilter] = useState("");
  const [citySuggestionsOpen, setCitySuggestionsOpen] = useState(false);
  const deferredCityFilter = useDeferredValue(cityFilter);
  const normalizedCityFilter = useMemo(
    () => normalizePersianSearch(deferredCityFilter),
    [deferredCityFilter],
  );

  const projectSearchRows = useMemo(
    () =>
      projects.map((project) => ({
        project,
        normalizedSearch: normalizePersianSearch(project.citySearchText),
      })),
    [projects],
  );

  const usageOptions = useMemo(
    () => Array.from(new Set(projects.map((project) => project.usage))),
    [projects],
  );

  const visibleCityOptions = useMemo(() => {
    if (normalizedCityFilter.length === 0) {
      return [];
    }

    const matches = [];

    for (const city of cityOptions) {
      if (!city.normalizedSearch.includes(normalizedCityFilter)) {
        continue;
      }

      matches.push(city);

      if (matches.length === citySuggestionLimit) {
        break;
      }
    }

    return matches;
  }, [normalizedCityFilter]);

  const filteredProjects = useMemo(() => {
    const matches = [];

    for (const { project, normalizedSearch } of projectSearchRows) {
      const cityMatches =
        normalizedCityFilter.length === 0 ||
        normalizedSearch.includes(normalizedCityFilter);
      const usageMatches =
        usageFilter.length === 0 || project.usage === usageFilter;

      if (cityMatches && usageMatches) {
        matches.push(project);
      }
    }

    return matches;
  }, [normalizedCityFilter, projectSearchRows, usageFilter]);

  const hasFilters = cityFilter.length > 0 || usageFilter.length > 0;
  const hasCitySuggestions =
    citySuggestionsOpen &&
    normalizedCityFilter.length > 0 &&
    visibleCityOptions.length > 0;
  const headingClassName =
    messages.locale === "fa"
      ? "text-start text-3xl font-semibold sm:text-4xl"
      : "text-start text-3xl font-semibold uppercase sm:text-4xl";

  return (
    <section
      id="projects-grid"
      className="bg-[#f7f5f0] px-5 py-16 text-[#080808] sm:px-8 md:py-24"
    >
      <div className="mx-auto max-w-[60rem] lg:max-w-[78rem]">
        <div className="mb-10 flex flex-col gap-6 md:mb-14 lg:flex-row lg:items-end lg:justify-between">
          <h2 className={headingClassName}>{messages.sectionTitle}</h2>

          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(11rem,14rem)_auto] sm:items-end lg:w-[44rem]">
            <div className="relative">
              <input
                type="search"
                value={cityFilter}
                onChange={(event) => {
                  setCityFilter(event.target.value);
                  setCitySuggestionsOpen(true);
                }}
                onFocus={() => setCitySuggestionsOpen(true)}
                onBlur={() => setCitySuggestionsOpen(false)}
                placeholder={messages.cityFilterPlaceholder}
                role="combobox"
                aria-autocomplete="list"
                aria-controls="iran-city-options"
                aria-expanded={hasCitySuggestions}
                aria-label={messages.cityFilterPlaceholder}
                className="h-12 w-full border border-[#071A33]/20 bg-white px-4 text-sm text-[#080808] outline-none transition focus:border-[#071A33] focus:ring-2 focus:ring-[#071A33]/15"
              />

              {hasCitySuggestions ? (
                <ul
                  id="iran-city-options"
                  role="listbox"
                  className="absolute left-0 right-0 top-[calc(100%+0.35rem)] z-20 max-h-72 overflow-auto border border-[#071A33]/12 bg-white shadow-lg"
                >
                  {visibleCityOptions.map((city) => (
                    <li key={city.id} role="option" aria-selected={false}>
                      <button
                        type="button"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => {
                          setCityFilter(city.name);
                          setCitySuggestionsOpen(false);
                        }}
                        className="flex w-full items-center justify-between gap-4 px-4 py-3 text-start text-sm text-[#080808] transition hover:bg-[#f7f5f0] focus:bg-[#f7f5f0] focus:outline-none"
                      >
                        <span>{city.name}</span>
                        <span className="text-xs text-[#071A33]/55">
                          {city.province}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            <select
              value={usageFilter}
              onChange={(event) => setUsageFilter(event.target.value)}
              className="appearance-none h-12 w-full border border-[#071A33]/20 bg-white px-4 text-sm text-[#080808] outline-none transition focus:border-[#071A33] focus:ring-2 focus:ring-[#071A33]/15"
            >
              <option value="">{messages.allUsages}</option>
              {usageOptions.map((usage) => (
                <option key={usage} value={usage}>
                  {usage}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => {
                setCityFilter("");
                setUsageFilter("");
              }}
              disabled={!hasFilters}
              className="h-12 border border-[#071A33] px-5 text-xs font-bold text-[#071A33] transition hover:bg-[#071A33] hover:text-white disabled:cursor-not-allowed disabled:border-[#071A33]/15 disabled:text-[#071A33]/30 disabled:hover:bg-transparent"
            >
              {messages.resetFilters}
            </button>
          </div>
        </div>

        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-7 lg:grid-cols-3">
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                messages={messages}
                project={project}
                onRegister={onRegister}
                priority={index < 3}
              />
            ))}
          </div>
        ) : (
          <div className="border border-[#071A33]/12 bg-white px-5 py-12 text-center text-sm font-semibold text-[#071A33]">
            {messages.noProjectsTitle}
          </div>
        )}
      </div>
    </section>
  );
}
