export type Project = {
  id: string;
  title: string;
  subtitle: string;
  location: string;
  propertyType: string;
  startingPrice: string;
  image: string;
  brochure: string;
};

export type LocalizedProject = Project & {
  imageAlt: string;
};
