export interface Brand {
  name: string;
  logo: string;
  primary: string;
  secondary: string;
  background: string;
}

export interface Brands {
  [key: string]: Brand;
}

export interface ErrorCard {
  title: string;
  description: string;
  solution: string;
}

export interface Step {
  id: string;
  order: number;
  title: { [lang: string]: string };
  content: { [lang: string]: string };
  notes?: { [lang: string]: string };
  warning?: { [lang: string]: string };
  image?: string;
  listItems?: { [lang: string]: string[] };
  numberedSteps?: { [lang: string]: string[] };
  columns?: { [lang: string]: { decrease: string; increase: string } };
  errorCards?: { [lang: string]: ErrorCard[] };
}

export interface Content {
  languages: string[];
  defaultLanguage: string;
  languageNames: { [key: string]: string };
  steps: Step[];
}
