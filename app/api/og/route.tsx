import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

/**
 * Open Graph image generation API route
 * 
 * Generates dynamic Open Graph images for social media sharing
 * with user profile information and customizable sections.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name') || 'Portfolio';
    const title = searchParams.get('title') || 'Professional Portfolio';
    const section = searchParams.get('section') || 'portfolio';

    // Define section-specific content
    const sectionTitles: Record<string, string> = {
      portfolio: 'Professional Portfolio',
      experience: 'Professional Experience',
      skills: 'Technical Skills',
      education: 'Education & Certifications',
      contact: 'Contact Information',
    };

    const sectionTitle = sectionTitles[section] || 'Portfolio';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#ffffff',
            backgroundImage: 'linear-gradient(45deg, #f8fafc 25%, transparent 25%), linear-gradient(-45deg, #f8fafc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f8fafc 75%), linear-gradient(-45deg, transparent 75%, #f8fafc 75%)',
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '40px',
            }}
          >
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '20px',
                fontSize: '32px',
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              {name.charAt(0).toUpperCase()}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h1
                style={{
                  fontSize: '48px',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  margin: '0',
                  lineHeight: '1.2',
                }}
              >
                {name}
              </h1>
              <p
                style={{
                  fontSize: '24px',
                  color: '#6b7280',
                  margin: '0',
                  marginTop: '8px',
                }}
              >
                {title}
              </p>
            </div>
          </div>

          {/* Section Title */}
          <div
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '16px 32px',
              borderRadius: '8px',
              fontSize: '28px',
              fontWeight: '600',
              textAlign: 'center',
              marginBottom: '20px',
            }}
          >
            {sectionTitle}
          </div>

          {/* Footer */}
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              display: 'flex',
              alignItems: 'center',
              fontSize: '18px',
              color: '#9ca3af',
            }}
          >
            <span>Professional Portfolio • {new Date().getFullYear()}</span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('Error generating OG image:', error);
    
    // Return a simple fallback image
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#3b82f6',
            color: 'white',
            fontSize: '48px',
            fontWeight: 'bold',
          }}
        >
          Portfolio
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  }
}