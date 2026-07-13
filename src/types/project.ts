export enum ProjectUsage {
  Residential = "مسکونی",
  Villa = "ویلایی",
  CommercialOffice = "تجاری اداری",
}

export type Project = {
  id: string;
  title: string;
  subtitle: string;
  location: string;
  city: string;
  usage: ProjectUsage;
  propertyType: string;
  startingPrice: string;
  image: string;
  brochure: string;
};

export type LocalizedProject = Project & {
  imageAlt: string;
};
