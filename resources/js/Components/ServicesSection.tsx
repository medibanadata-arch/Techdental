import React, { useState } from "react";
import { ChevronDown, ChevronUp, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "@inertiajs/react";

interface ServicesSectionProps {
  services: any[];
  onSelectServiceForBooking: (serviceName: string) => void;
  isOpenControlled?: boolean;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services = [],
  onSelectServiceForBooking,
  isOpenControlled,
}) => {
  const [isExpanded, setIsExpanded] = useState(isOpenControlled ?? false);

  React.useEffect(() => {
    if (typeof isOpenControlled === "boolean") {
      setIsExpanded(isOpenControlled);
    }
  }, [isOpenControlled]);

  // Initial display: 3 treatments. Expanded: 4 more open (3 + 4 = 7 treatments total)
  const visibleServices = isExpanded ? services.slice(0, 7) : services.slice(0, 3);
  const canExpand = services.length > 3;

  const handleExpand = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsExpanded(true);
  };

  const handleCollapse = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsExpanded(false);
  };

  return (
    <section id="services-wrapper" className="scroll-mt-24 sm:scroll-mt-28 px-1 py-3 sm:px-4.5 md:px-8 md:py-5">
      {/* Outer Card Box with Box Shadow */}
      <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-5 border border-slate-200/90 shadow-xl shadow-slate-200/60 transition-all">
        {/* Section Title & Collapse Dropup Bar */}
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2 text-base md:text-lg font-black text-slate-900 tracking-tight whitespace-nowrap min-w-0">
            <Sparkles className="w-5 h-5 text-primary-maroon shrink-0" />
            <span>Services &amp; Pricing</span>
          </div>

          {/* Dropup Button in the marked spot */}
          {isExpanded && (
            <button
              type="button"
              onClick={handleCollapse}
              className="w-8 h-8 rounded-full flex items-center justify-center text-primary-maroon hover:bg-rose-50 transition-all cursor-pointer active:scale-90"
              title="Collapse to 3 treatments"
              aria-label="Collapse services"
            >
              <ChevronUp className="w-5 h-5 stroke-[2.5]" />
            </button>
          )}
        </div>

        {/* Treatments List (3 treatments initially, 4 more when expanded) */}
        <div className="space-y-2.5">
          {visibleServices.map((service, index) => {
            const name = (service.name || service.title || 'Dental Treatment').split(/[-–—:]/)[0].trim();
            const desc = service.desc || service.short_desc || service.category || 'Specialized Dental Care';
            const price = '৳ ' + String(service.price || '1,500').replace(/^[৳\sBDTtk.]+/i, '').trim();
            const image = service.image || service.hero_main || 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=200';
            const slug = service.slug || service.id;
            const serviceUrl = `/service/${slug}`;

            return (
              <Link
                key={service.id || index}
                href={serviceUrl}
                className="flex items-center justify-between p-2.5 bg-slate-50/70 hover:bg-white border-[1.5px] border-slate-200 rounded-xl hover:border-slate-300 hover:-translate-y-0.5 transition-all cursor-pointer shadow-2xs group"
              >
                <div className="flex items-center gap-2.5 flex-1 min-w-0 pr-2">
                  <img
                    src={image}
                    alt={name}
                    className="w-11 h-11 rounded-lg object-cover shrink-0 border border-slate-200 bg-slate-100"
                    loading="lazy"
                    onError={(e: any) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=200';
                    }}
                  />
                  <div className="min-w-0">
                    <div className="text-[0.84rem] font-bold text-slate-900 group-hover:text-primary-maroon transition-colors truncate">
                      {name}
                    </div>
                  </div>
                </div>

                <div className="text-[0.8rem] font-black text-primary-maroon bg-[#fdf2f4] px-2.5 py-1 rounded-xl whitespace-nowrap border border-[#fce7f3] shrink-0">
                  {price}
                </div>
              </Link>
            );
          })}
        </div>

        {/* "See more" button when collapsed (opens 4 more treatments) */}
        {!isExpanded && canExpand && (
          <div className="pt-3 flex items-center justify-center">
            <button
              type="button"
              onClick={handleExpand}
              className="bg-white border-[1.5px] border-slate-200 hover:border-primary-maroon/30 text-primary-maroon px-5 py-2 rounded-full text-[0.78rem] font-bold shadow-xs hover:bg-rose-50/50 flex items-center gap-2 transition-all hover:scale-105 cursor-pointer active:scale-95"
            >
              <span>See more</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* When expanded: "View All Services" out-link */}
        {isExpanded && (
          <div className="pt-3">
            <Link
              href="/services"
              className="group w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-[#800038]/5 via-[#800038]/10 to-[#800038]/5 hover:from-[#800038] hover:via-[#800038] hover:to-[#a01246] border border-[#800038]/20 hover:border-[#800038] text-[#800038] hover:text-white font-extrabold text-[0.84rem] shadow-xs hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              <span>View All Services</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};
