import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Calendar, 
  ArrowRight, 
  Sparkles
} from 'lucide-react';

interface LinkItem {
  label: string;
  url: string;
}

interface BranchItem {
  name: string;
  address?: string;
  url: string;
}

interface GlobalFooterProps {
  hideCtaStrip?: boolean;
  className?: string;
  customSettings?: any; // For live preview in backend
}

export const GlobalFooter: React.FC<GlobalFooterProps> = ({ hideCtaStrip = false, className = '', customSettings }) => {
  const pageProps = usePage()?.props as any;
  const siteSettings = pageProps?.site_settings || {};
  const footerSettings = customSettings || siteSettings?.footer_settings || {};

  // Check if footer is enabled (default true)
  if (footerSettings.enabled === false) {
    return null;
  }

  const brandName = footerSettings.brand_name || siteSettings?.company_name || 'Tech Dental';
  const brandBadge = footerSettings.brand_badge || 'ORAL HEALTHCARE';
  const brandLogoText = footerSettings.brand_logo_text || 'TD';
  const brandLogoImage = footerSettings.brand_logo_image || '';
  
  const aboutText = footerSettings.about_text || 'Tech Dental is a leading multi-branch dental care provider in Dhaka, dedicated to painless digital procedures, expert orthodontic solutions, and modern implant dentistry.';
  const hotline = footerSettings.hotline || siteSettings?.contact_phone || '01400786162';
  const whatsapp = footerSettings.whatsapp || '+8801400786162';
  const whatsappLabel = footerSettings.whatsapp_label || 'WhatsApp Direct Help';
  const email = footerSettings.email || siteSettings?.contact_email || 'info@techdentalcare.com';
  const address = footerSettings.address || siteSettings?.address || 'Mirpur, Uttara, Badda & Jatrabari, Dhaka, Bangladesh';
  const hours = footerSettings.hours || 'Saturday – Thursday: 10:00 AM – 9:00 PM (Friday Closed)';
  const copyright = footerSettings.copyright || `© ${new Date().getFullYear()} ${brandName} Care Center. All rights reserved.`;

  // Quick Links
  const quickLinksTitle = footerSettings.quick_links_title || 'QUICK LINKS';
  const defaultQuickLinks: LinkItem[] = [
    { label: 'Home', url: '/' },
    { label: 'Services & Pricing', url: '/services' },
    { label: 'Specialist Doctors', url: '/doctors' },
    { label: 'Treatment Price List', url: '/price-list' },
    { label: 'How to Pay', url: '/how-to-pay' },
    { label: 'Medicines & Care', url: '/medicines' },
    { label: 'About Tech Dental', url: '/about' },
    { label: 'Book Appointment', url: '/appointment' },
  ];
  const quickLinks: LinkItem[] = Array.isArray(footerSettings.quick_links) && footerSettings.quick_links.length > 0
    ? footerSettings.quick_links
    : defaultQuickLinks;

  // Branches
  const branchesTitle = footerSettings.branches_title || 'OUR BRANCHES';
  const defaultBranches: BranchItem[] = [
    { name: 'Mirpur Branch', address: 'Shewrapara, Rokeya Sarani (Pillar 318)', url: '/branch/mirpur' },
    { name: 'Uttara Branch', address: 'Sector 7, Jasimuddin Avenue, Dhaka', url: '/branch/uttara' },
    { name: 'Badda Branch', address: 'Middle Badda, Pragati Sarani, Dhaka', url: '/branch/badda' },
    { name: 'Jatrabari Branch', address: 'Shahid Faruk Road, Jatrabari, Dhaka', url: '/branch/jatrabari' },
  ];
  const branches: BranchItem[] = Array.isArray(footerSettings.branches) && footerSettings.branches.length > 0
    ? footerSettings.branches
    : defaultBranches;

  // Emergency & Support
  const supportTitle = footerSettings.support_title || 'EMERGENCY & SUPPORT';
  const supportSubtext = footerSettings.support_subtext || 'Need urgent assistance or want to schedule a dental checkup? Reach out directly:';

  // Bottom Links
  const defaultBottomLinks: LinkItem[] = [
    { label: 'Facebook', url: footerSettings.facebook_url || 'https://facebook.com/techdentalbd' },
    { label: 'Patient Rights', url: '/patient-rights' },
    { label: 'Complaint Box', url: '/complaint-box' },
    { label: 'How to Pay', url: '/how-to-pay' },
    { label: 'Privacy Policy', url: '/privacy-policy' },
    { label: 'Terms of Service', url: '/terms-of-service' },
  ];
  const bottomLinks: LinkItem[] = Array.isArray(footerSettings.bottom_links) && footerSettings.bottom_links.length > 0
    ? footerSettings.bottom_links
    : defaultBottomLinks;

  // Optional Top CTA Ribbon
  const showCtaStrip = !hideCtaStrip && footerSettings.show_cta_strip !== false;
  const ctaBadge = footerSettings.cta_badge || 'Painless Clinical Dentistry in Dhaka';
  const ctaTitle = footerSettings.cta_title || 'Ready to Restore Your Healthy Smile?';
  const ctaSubtext = footerSettings.cta_subtext || 'Consult with our specialist oral surgeons across Mirpur, Uttara, Badda, and Jatrabari branches.';
  const ctaButtonText = footerSettings.cta_button_text || 'Make Appointment';
  const ctaButtonUrl = footerSettings.cta_button_url || '/appointment';

  const cleanWaNumber = (whatsapp || hotline).replace(/[^0-9]/g, '');

  const renderLink = (item: LinkItem, innerContent: React.ReactNode, extraClass: string = '') => {
    const isExternal = item.url.startsWith('http') || item.url.startsWith('//');
    if (isExternal) {
      return (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className={extraClass}
        >
          {innerContent}
        </a>
      );
    }
    return (
      <Link href={item.url} className={extraClass}>
        {innerContent}
      </Link>
    );
  };

  return (
    <footer className={`w-full ${className ? className : 'mt-0'} bg-[#0d131f] text-slate-300 relative overflow-hidden select-none font-sans`}>
      {/* 1. Optional Top CTA Ribbon */}
      {showCtaStrip && (
        <div className="w-full bg-gradient-to-r from-[#800038] via-[#a51547] to-[#800038] text-white px-6 py-8 sm:py-10 border-b border-rose-900/40">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left space-y-1.5">
              <span className="text-[11px] font-extrabold tracking-widest uppercase text-rose-200 inline-flex items-center gap-1.5">
                <Sparkles size={13} />
                {ctaBadge}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                {ctaTitle}
              </h3>
              <p className="text-xs sm:text-sm text-rose-100/90 max-w-xl">
                {ctaSubtext}
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap justify-center">
              <a
                href={`tel:${hotline.replace(/[^0-9]/g, '')}`}
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm backdrop-blur transition-all flex items-center gap-2 border border-white/20 shadow-sm active:scale-95"
              >
                <Phone size={15} />
                <span>{hotline}</span>
              </a>
              <Link
                href={ctaButtonUrl}
                className="px-6 py-3 rounded-xl bg-white hover:bg-rose-50 text-[#800038] font-black text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 hover:shadow-lg active:scale-95"
              >
                <Calendar size={15} />
                <span>{ctaButtonText}</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 2. Main Footer Columns */}
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
        {/* Col 1: Brand & About */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            {brandLogoImage ? (
              <img src={brandLogoImage} alt={brandName} className="h-9 w-auto object-contain rounded-lg" />
            ) : (
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#800038] to-[#b81d52] flex items-center justify-center text-white font-black text-sm shadow-md shrink-0">
                {brandLogoText}
              </div>
            )}
            <div>
              <span className="text-lg font-black text-white tracking-tight leading-none block">
                {brandName}
              </span>
              {brandBadge && (
                <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase block mt-0.5">
                  {brandBadge}
                </span>
              )}
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            {aboutText}
          </p>

          <div className="pt-2 space-y-2 text-xs text-slate-400">
            {hours && (
              <div className="flex items-start gap-2.5">
                <Clock size={15} className="text-rose-400 shrink-0 mt-0.5" />
                <span>{hours}</span>
              </div>
            )}
            {address && (
              <div className="flex items-start gap-2.5">
                <MapPin size={15} className="text-rose-400 shrink-0 mt-0.5" />
                <span>{address}</span>
              </div>
            )}
          </div>
        </div>

        {/* Col 2: Quick Links (Fully Dynamic) */}
        <div className="space-y-3">
          <h4 className="text-sm font-extrabold text-white tracking-wider uppercase flex items-center gap-2">
            <span className="w-1.5 h-3.5 bg-rose-600 rounded-full" />
            {quickLinksTitle}
          </h4>
          <ul className="space-y-2 text-xs text-slate-400">
            {quickLinks.map((link, idx) => (
              <li key={idx}>
                {renderLink(
                  link,
                  <>
                    <span className="text-rose-500 font-bold">›</span>
                    <span>{link.label}</span>
                  </>,
                  "hover:text-white transition-colors flex items-center gap-1.5"
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: Branches (Fully Dynamic) */}
        <div className="space-y-3">
          <h4 className="text-sm font-extrabold text-white tracking-wider uppercase flex items-center gap-2">
            <span className="w-1.5 h-3.5 bg-rose-600 rounded-full" />
            {branchesTitle}
          </h4>
          <ul className="space-y-2 text-xs text-slate-400">
            {branches.map((b, idx) => {
              const isExternal = b.url.startsWith('http') || b.url.startsWith('//');
              const inner = (
                <>
                  <p className="font-bold text-slate-200">{b.name}</p>
                  {b.address && <p className="text-[11px] text-slate-500">{b.address}</p>}
                </>
              );
              return (
                <li key={idx}>
                  {isExternal ? (
                    <a href={b.url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors block">
                      {inner}
                    </a>
                  ) : (
                    <Link href={b.url} className="hover:text-white transition-colors block">
                      {inner}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Col 4: Patient Contact & Support */}
        <div className="space-y-3">
          <h4 className="text-sm font-extrabold text-white tracking-wider uppercase flex items-center gap-2">
            <span className="w-1.5 h-3.5 bg-rose-600 rounded-full" />
            {supportTitle}
          </h4>
          {supportSubtext && (
            <p className="text-xs text-slate-400">
              {supportSubtext}
            </p>
          )}
          <div className="space-y-2 pt-1 text-xs">
            {hotline && (
              <a
                href={`tel:${hotline.replace(/[^0-9]/g, '')}`}
                className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-200 transition-colors"
              >
                <Phone size={14} className="text-rose-400 shrink-0" />
                <span className="font-bold">{hotline}</span>
              </a>
            )}
            {whatsapp && (
              <a
                href={`https://wa.me/${cleanWaNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-2 rounded-lg bg-emerald-950/40 hover:bg-emerald-950/60 border border-emerald-800/40 text-emerald-300 transition-colors"
              >
                <svg className="w-4 h-4 text-[#25D366] shrink-0" viewBox="0 0 448 512" fill="currentColor" aria-hidden="true">
                  <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                </svg>
                <span>{whatsappLabel}</span>
              </a>
            )}
            {email && (
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-200 transition-colors"
              >
                <Mail size={14} className="text-rose-400 shrink-0" />
                <span className="truncate">{email}</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* 3. Bottom Legal & Copyright Bar */}
      <div className="border-t border-slate-800/80 bg-[#090d15] px-6 py-5 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-center sm:text-left">
            {copyright}
          </p>

          <div className="flex items-center gap-4 text-slate-400 flex-wrap justify-center">
            {bottomLinks.map((link, idx) => (
              <React.Fragment key={idx}>
                {renderLink(link, link.label, "hover:text-white transition-colors")}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
