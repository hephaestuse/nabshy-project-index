import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import projects from "../src/data/projects.json" with { type: "json" };

type LocalizedValue = {
  fa: string;
  en: string;
};

type SeedProject = {
  titleFa: string;
  titleEn: string;
  cityFa: string;
  cityEn: string;
  developerNameFa: string;
  developerNameEn: string;
  usage: LocalizedValue;
  address: LocalizedValue;
};

type AssetMapping = {
  imagePath?: string;
  brochureFile: string;
};

const adapter = new PrismaPg(process.env.DATABASE_URL ?? "");
const prisma = new PrismaClient({ adapter });

const slugByTitleEn = {
  Marjan: "marjan",
  "Golshan 4": "golshan-4",
  M25: "m25",
  M29: "m29",
  "Huner 1": "huner-1",
  "Bozorgmehr 13": "bozorgmehr-13",
  Vibe: "vibe",
  Hami: "hami",
  Liam: "liam",
  "Mina 3": "mina-3",
} satisfies Record<string, string>;

const assetMappings: Record<string, AssetMapping> = {
  marjan: {
    imagePath: "/images/projects/Project_V Marjan.png",
    brochureFile: "project-5-brochure.pdf",
  },
  "golshan-4": {
    imagePath: "/images/projects/Project_V Golshan4.png",
    brochureFile: "project-4-brochure.pdf",
  },
  m25: {
    imagePath: "/images/projects/Project_Mehr M25.png",
    brochureFile: "project-2-brochure.pdf",
  },
  m29: {
    imagePath: "/images/projects/Project_Mehr M29.png",
    brochureFile: "project-3-brochure.pdf",
  },
  "huner-1": {
    imagePath: "/images/projects/Project_Huner.png",
    brochureFile: "project-1-brochure.pdf",
  },
  "mina-3": {
    imagePath: "/images/projects/Project_Zoya Mina3.png",
    brochureFile: "project-6-brochure.pdf",
  },
  "bozorgmehr-13": {
    brochureFile: "project-7-brochure.pdf",
  },
};

function requiredString(value: unknown, fieldName: string) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Invalid project seed data: ${fieldName} is required.`);
  }

  return value.trim();
}

function getStableProjectSlug(project: SeedProject) {
  const slug = slugByTitleEn[project.titleEn as keyof typeof slugByTitleEn];

  if (!slug) {
    throw new Error(
      `Invalid project seed data: no stable slug for title "${project.titleEn}".`,
    );
  }

  return slug;
}

function validateProjects(seedProjects: SeedProject[]) {
  const slugs = new Set<string>();

  seedProjects.forEach((project, index) => {
    requiredString(project.titleFa, `projects[${index}].titleFa`);
    requiredString(project.titleEn, `projects[${index}].titleEn`);
    requiredString(project.cityFa, `projects[${index}].cityFa`);
    requiredString(project.cityEn, `projects[${index}].cityEn`);
    requiredString(
      project.developerNameFa,
      `projects[${index}].developerNameFa`,
    );
    requiredString(
      project.developerNameEn,
      `projects[${index}].developerNameEn`,
    );
    requiredString(project.usage?.fa, `projects[${index}].usage.fa`);
    requiredString(project.usage?.en, `projects[${index}].usage.en`);
    requiredString(project.address?.fa, `projects[${index}].address.fa`);
    requiredString(project.address?.en, `projects[${index}].address.en`);

    const slug = getStableProjectSlug(project);

    if (slugs.has(slug)) {
      throw new Error(`Invalid project seed data: duplicate slug "${slug}".`);
    }

    slugs.add(slug);
  });

  return slugs;
}

async function main() {
  const seedProjects = projects as SeedProject[];
  const activeSlugs = validateProjects(seedProjects);

  for (const [index, project] of seedProjects.entries()) {
    const slug = getStableProjectSlug(project);
    const assets = assetMappings[slug as keyof typeof assetMappings];
    const data = {
      titleFa: requiredString(project.titleFa, `${slug}.titleFa`),
      titleEn: requiredString(project.titleEn, `${slug}.titleEn`),
      cityFa: requiredString(project.cityFa, `${slug}.cityFa`),
      cityEn: requiredString(project.cityEn, `${slug}.cityEn`),
      developerNameFa: requiredString(
        project.developerNameFa,
        `${slug}.developerNameFa`,
      ),
      developerNameEn: requiredString(
        project.developerNameEn,
        `${slug}.developerNameEn`,
      ),
      usageFa: requiredString(project.usage.fa, `${slug}.usage.fa`),
      usageEn: requiredString(project.usage.en, `${slug}.usage.en`),
      addressFa: requiredString(project.address.fa, `${slug}.address.fa`),
      addressEn: requiredString(project.address.en, `${slug}.address.en`),
      imagePath: assets?.imagePath ?? null,
      brochureFile: assets?.brochureFile ?? null,
      isActive: true,
      visibleInIndex: true,
      sortOrder: index,
    };

    await prisma.project.upsert({
      where: {
        slug,
      },
      update: data,
      create: {
        slug,
        ...data,
      },
    });
  }

  await prisma.project.updateMany({
    where: {
      slug: {
        notIn: Array.from(activeSlugs),
      },
    },
    data: {
      isActive: false,
    },
  });

  await prisma.generalJournal.upsert({
    where: {
      id: "platform-journal-seed",
    },
    update: {
      titleFa: "ژورنال پلتفرم",
      titleEn: "Platform Journal",
      fileName: "platform-journal.pdf",
      originalFileName: "platform jornal.pdf",
      isActive: true,
    },
    create: {
      id: "platform-journal-seed",
      titleFa: "ژورنال پلتفرم",
      titleEn: "Platform Journal",
      fileName: "platform-journal.pdf",
      originalFileName: "platform jornal.pdf",
      isActive: true,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
