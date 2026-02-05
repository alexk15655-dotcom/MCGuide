import { notFound } from 'next/navigation';
import GuideClient from './GuideClient';
import brands from '@/config/brands.json';
import content from '@/content/steps.json';
import { Brands, Content } from '@/lib/types';

const brandsData = brands as Brands;
const contentData = content as Content;

interface PageProps {
  params: Promise<{ brand: string }>;
  searchParams: Promise<{ lang?: string }>;
}

export async function generateStaticParams() {
  return Object.keys(brandsData).map((brand) => ({ brand }));
}

export async function generateMetadata({ params }: PageProps) {
  const { brand: brandSlug } = await params;
  const brand = brandsData[brandSlug];
  
  if (!brand) {
    return { title: 'Not Found' };
  }

  return {
    title: `${brand.name} - Guide`,
    description: `Agent guide for ${brand.name}`,
  };
}

export default async function BrandGuidePage({ params, searchParams }: PageProps) {
  const { brand: brandSlug } = await params;
  const { lang: langParam } = await searchParams;
  
  const brand = brandsData[brandSlug];

  if (!brand) {
    notFound();
  }

  const lang = langParam && contentData.languages.includes(langParam) 
    ? langParam 
    : contentData.defaultLanguage;

  return (
    <GuideClient
      brand={brand}
      brandSlug={brandSlug}
      steps={contentData.steps}
      languages={contentData.languages}
      languageNames={contentData.languageNames}
      defaultLanguage={contentData.defaultLanguage}
      initialLang={lang}
    />
  );
}
