import Script from 'next/script';
import type { StructuredDataProps, MultipleStructuredDataProps } from '@/types';

/**
 * StructuredData component for injecting JSON-LD structured data
 *
 * Uses Next.js Script component to properly inject structured data
 * into the document head for SEO optimization.
 */
export function StructuredData({ data }: StructuredDataProps) {
  return (
    <Script
      id={`structured-data-${Math.random().toString(36).substr(2, 9)}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data, null, 2),
      }}
    />
  );
}

/**
 * MultipleStructuredData component for injecting multiple JSON-LD scripts
 */
export function MultipleStructuredData({ dataArray }: MultipleStructuredDataProps) {
  return (
    <>
      {dataArray.map((data, index) => (
        <StructuredData key={index} data={data} />
      ))}
    </>
  );
}