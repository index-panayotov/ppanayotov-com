/**
 * SEO Implementation Test Suite
 * 
 * This file contains tests and validation for the SEO meta generation system.
 * Run this to verify that all SEO components are working correctly.
 */

import { userProfile } from '@/data/user-profile';
import { experiences } from '@/data/cv-data';
import { seoService, validateSEOContent, generatePortfolioSEO } from './index';

/**
 * Test the SEO implementation
 */
export function testSEOImplementation() {
  console.log('🔍 Testing SEO Implementation...\n');

  // Test 1: Generate portfolio SEO
  console.log('1. Testing Portfolio SEO Generation:');
  try {
    const portfolioSEO = generatePortfolioSEO(userProfile, experiences);
    
    console.log('✅ Portfolio SEO generated successfully');
    console.log(`   Title: ${portfolioSEO.metadata.title}`);
    console.log(`   Description: ${portfolioSEO.metadata.description}`);
    console.log(`   Canonical: ${portfolioSEO.canonicalUrl}`);
    console.log(`   Structured Data Scripts: ${portfolioSEO.structuredDataScripts.length}`);
    
    // Validate metadata structure
    if (!portfolioSEO.metadata.title || !portfolioSEO.metadata.description) {
      console.log('❌ Missing required metadata fields');
    }
    
    if (!portfolioSEO.metadata.openGraph) {
      console.log('❌ Missing Open Graph data');
    }
    
    if (!portfolioSEO.metadata.twitter) {
      console.log('❌ Missing Twitter Card data');
    }
    
  } catch (error) {
    console.log('❌ Portfolio SEO generation failed:', error);
  }

  // Test 2: Generate section-specific SEO
  console.log('\n2. Testing Section-Specific SEO:');
  const sections: Array<'experience' | 'skills' | 'education' | 'contact'> = [
    'experience', 'skills', 'education', 'contact'
  ];
  
  sections.forEach(section => {
    try {
      const sectionSEO = seoService.generateSectionSEO(section, userProfile, experiences);
      console.log(`✅ ${section} SEO generated successfully`);
      console.log(`   Title: ${sectionSEO.metadata.title}`);
    } catch (error) {
      console.log(`❌ ${section} SEO generation failed:`, error);
    }
  });

  // Test 3: Validate SEO content
  console.log('\n3. Testing SEO Content Validation:');
  try {
    const validation = validateSEOContent(userProfile, experiences);
    
    if (validation.isValid) {
      console.log('✅ SEO content validation passed');
    } else {
      console.log('⚠️ SEO content validation has issues:');
      validation.errors.forEach(error => console.log(`   Error: ${error}`));
      validation.warnings.forEach(warning => console.log(`   Warning: ${warning}`));
    }
  } catch (error) {
    console.log('❌ SEO content validation failed:', error);
  }

  // Test 4: Test Open Graph image URL generation
  console.log('\n4. Testing Open Graph Image Generation:');
  try {
    const ogImageUrl = seoService.generateOpenGraphImageUrl(userProfile, 'portfolio');
    console.log('✅ Open Graph image URL generated successfully');
    console.log(`   URL: ${ogImageUrl}`);
  } catch (error) {
    console.log('❌ Open Graph image URL generation failed:', error);
  }

  // Test 5: Test sitemap entries
  console.log('\n5. Testing Sitemap Generation:');
  try {
    const sitemapEntries = seoService.generateSitemapEntries(userProfile);
    console.log('✅ Sitemap entries generated successfully');
    console.log(`   Entries count: ${sitemapEntries.length}`);
    sitemapEntries.forEach(entry => {
      console.log(`   - ${entry.url} (Priority: ${entry.priority})`);
    });
  } catch (error) {
    console.log('❌ Sitemap generation failed:', error);
  }

  console.log('\n🎉 SEO Implementation Test Complete!');
}

/**
 * Validate that all required SEO fields are present
 */
export function validateSEOFields(metadata: any): boolean {
  const requiredFields = [
    'title',
    'description',
    'openGraph',
    'twitter',
  ];

  const missingFields = requiredFields.filter(field => !metadata[field]);
  
  if (missingFields.length > 0) {
    console.log('❌ Missing SEO fields:', missingFields);
    return false;
  }

  // Validate Open Graph fields
  const requiredOGFields = ['title', 'description', 'images', 'url'];
  const missingOGFields = requiredOGFields.filter(field => !metadata.openGraph[field]);
  
  if (missingOGFields.length > 0) {
    console.log('❌ Missing Open Graph fields:', missingOGFields);
    return false;
  }

  // Validate Twitter fields
  const requiredTwitterFields = ['card', 'title', 'description'];
  const missingTwitterFields = requiredTwitterFields.filter(field => !metadata.twitter[field]);
  
  if (missingTwitterFields.length > 0) {
    console.log('❌ Missing Twitter Card fields:', missingTwitterFields);
    return false;
  }

  return true;
}

/**
 * Check SEO best practices
 */
export function checkSEOBestPractices(metadata: any): {
  readonly passed: boolean;
  readonly issues: readonly string[];
} {
  const issues: string[] = [];

  // Check title length
  if (metadata.title && metadata.title.length > 60) {
    issues.push(`Title too long (${metadata.title.length} chars, max 60)`);
  }

  // Check description length
  if (metadata.description && metadata.description.length > 160) {
    issues.push(`Description too long (${metadata.description.length} chars, max 160)`);
  }

  // Check if Open Graph image is present
  if (!metadata.openGraph?.images?.[0]?.url) {
    issues.push('Missing Open Graph image');
  }

  // Check canonical URL
  if (!metadata.alternates?.canonical) {
    issues.push('Missing canonical URL');
  }

  return {
    passed: issues.length === 0,
    issues,
  };
}

// Export test runner for development use
if (typeof window === 'undefined' && process.env.NODE_ENV === 'development') {
  // Only run in Node.js environment during development
  // testSEOImplementation();
}