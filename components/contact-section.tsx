"use client";

import { FiMail, FiLinkedin, FiPhone } from "react-icons/fi";
import { SectionHeading } from "@/components/section-heading";
import { UserProfile } from "@/lib/schemas";
import { getSocialIcon } from "@/lib/social-platforms";

interface ContactSectionProps {
    profileData: UserProfile;
}

export function ContactSection({ profileData }: ContactSectionProps) {
    const linkedinLink = profileData.socialLinks?.find(link =>
        link.platform === 'LinkedIn' && link.visible
    );
    const hasLinkedIn = !!linkedinLink;
    const contactCount = 2 + (hasLinkedIn ? 1 : 0);
    const gridClass = contactCount === 3
        ? "grid grid-cols-1 md:grid-cols-3 gap-6"
        : "grid grid-cols-1 md:grid-cols-2 gap-6 justify-center max-w-2xl mx-auto";

    return (
        <section id="contact" className="cv-section">
            <SectionHeading title="Contact" subtitle="Let's connect and discuss opportunities" />
            <div className={gridClass}>
                <div className="contact-card">
                    <div className="contact-layout">
                        <div className="contact-icon bg-blue-100">
                            <FiMail className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-800 mb-1">Email</h3>
                            <div className="cursor-default" style={{ minHeight: '40px', display: 'flex', alignItems: 'center' }}>
                                <img
                                    src={`/api/text-image?fieldType=email&size=16&color=%23059669&bg=transparent`}
                                    alt="Email address (protected from bots)"
                                    className="protected-image"
                                    draggable={false}
                                    loading="eager"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="contact-card">
                    <div className="contact-layout">
                        <div className="contact-icon bg-green-100">
                            <FiPhone className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-800 mb-1">Phone</h3>
                            <div className="cursor-default" style={{ minHeight: '40px', display: 'flex', alignItems: 'center' }}>
                                <img
                                    src={`/api/text-image?fieldType=phone&size=16&color=%2316a34a&bg=transparent`}
                                    alt="Phone number (protected from bots)"
                                    className="protected-image"
                                    draggable={false}
                                    loading="eager"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {hasLinkedIn && linkedinLink && (
                    <div className="contact-card">
                        <div className="contact-layout">
                            <div className="contact-icon bg-indigo-100">
                                <FiLinkedin className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-800 mb-1">LinkedIn</h3>
                                <a
                                    href={linkedinLink.url.startsWith('http') ? linkedinLink.url : `https://${linkedinLink.url}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-600 hover:text-indigo-700 transition-colors"
                                >
                                    {linkedinLink.url.replace(/^https?:\/\//i, '')}
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Social Links */}
            {profileData.socialLinks && profileData.socialLinks.filter(link => link.visible).length > 0 && (
                <div className="mt-8">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 text-center">Follow Me</h3>
                    <div className="flex justify-center flex-wrap gap-4">
                        {profileData.socialLinks
                            .filter(link => link.visible)
                            .sort((a, b) => (a.position || 0) - (b.position || 0))
                            .map((link, index) => (
                                <a
                                    key={index}
                                    href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:border-slate-300 hover:shadow-md transition-all duration-200 text-slate-700 hover:text-slate-900"
                                    title={`Visit ${link.platform === 'Custom' ? link.label : link.platform}`}
                                >
                                    {getSocialIcon(link.platform)}
                                    <span className="text-sm font-medium">
                                        {link.platform === 'Custom' ? link.label : link.platform}
                                    </span>
                                </a>
                            ))}
                    </div>
                </div>
            )}
        </section>
    );
}
