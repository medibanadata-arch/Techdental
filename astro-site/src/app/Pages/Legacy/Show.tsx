import React, { useEffect } from "react";
import { Link } from "@inertiajs/react";
import { TopHeader } from "@/components/TopHeader";
import { GlobalFooter } from "@/Components/GlobalFooter";

interface LegacyFaq {
    q: string;
    a: string;
}

interface LegacyProps {
    legacy: {
        path: string;
        title: string;
        h1: string;
        body_html: string;
        faqs: LegacyFaq[];
        snapshot_at?: string | null;
        is_bn: boolean;
    };
    locations?: any[];
    nav_menu?: any;
}

const LegacyShow: React.FC<LegacyProps> = ({ legacy, locations = [], nav_menu }) => {
    const isBn = !!legacy.is_bn;
    const L = isBn
        ? {
              home: "হোম",
              updated: "সর্বশেষ আপডেট",
              faq: "সচরাচর জিজ্ঞাসা (FAQ)",
          }
        : {
              home: "Home",
              updated: "Last updated",
              faq: "Frequently Asked Questions",
          };

    // Hide archived images whose file no longer exists on the old host.
    useEffect(() => {
        const imgs = Array.from(document.querySelectorAll<HTMLImageElement>(".legacy-body img"));
        const onError = (e: Event) => {
            const el = e.target as HTMLImageElement;
            el.style.display = "none";
            const caption = el.closest("figure");
            if (caption) (caption as HTMLElement).style.display = "none";
        };
        imgs.forEach((img) => {
            img.addEventListener("error", onError);
            if (img.complete && img.naturalWidth === 0) onError({ target: img } as any);
        });
        return () => imgs.forEach((img) => img.removeEventListener("error", onError));
    }, [legacy.body_html]);

    const updated = (() => {
        if (!legacy.snapshot_at) return "2026";
        const d = new Date(legacy.snapshot_at);
        if (isNaN(d.getTime())) return "2026";
        return d.toLocaleDateString(isBn ? "bn-BD" : "en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    })();

    return (
        <div className="min-h-screen bg-white text-gray-800 antialiased font-sans">
            <TopHeader
                locations={locations}
                navMenu={nav_menu}
                showBranchPicker
                showLanguageSwitcher
            />

            <main className="mx-auto w-full max-w-7xl px-4 sm:px-8 lg:px-10 py-7 lg:py-10">
                <nav className="mb-4 flex flex-wrap items-center gap-1.5 text-[13px] text-gray-500">
                    <Link href="/" className="hover:text-rose-900">
                        {L.home}
                    </Link>
                    <span>/</span>
                    <span className="text-gray-400">{legacy.h1 || legacy.title}</span>
                </nav>

                <article className="mx-auto w-full max-w-4xl">
                    <h1 className="mb-3 text-[26px] font-extrabold leading-tight text-gray-900 sm:text-[32px] lg:text-[38px]">
                            {legacy.h1 || legacy.title}
                        </h1>
                        <div className="mb-6 border-b border-gray-200 pb-3 text-[13px] text-gray-500">
                            {L.updated}: {updated} &nbsp;·&nbsp; Tech Dental Care
                        </div>

                        <div
                            className="legacy-body"
                            dangerouslySetInnerHTML={{ __html: legacy.body_html }}
                        />

                        {legacy.faqs?.length > 0 && (
                            <section className="mt-10">
                                <h2 className="mb-4 text-[24px] font-bold text-gray-900">{L.faq}</h2>
                                <div className="space-y-5">
                                    {legacy.faqs.map((faq, i) => (
                                        <div key={i}>
                                            <h3 className="text-[16px] font-semibold text-gray-900">
                                                {faq.q}
                                            </h3>
                                            <p
                                                className="mt-1.5 text-[15px] leading-relaxed text-gray-600"
                                                dangerouslySetInnerHTML={{ __html: faq.a }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                    </article>
            </main>

            <GlobalFooter />

            <style>{`
                .legacy-body { font-size: 16.5px; line-height: 1.85; overflow-wrap: anywhere; color: #374151; }
                .legacy-body > *:first-child { margin-top: 0; }
                .legacy-body h2 { margin: 2rem 0 0.7rem; font-size: 26px; line-height: 1.35; font-weight: 700; color: #111827; }
                .legacy-body h3 { margin: 1.6rem 0 0.55rem; font-size: 21px; line-height: 1.4; font-weight: 700; color: #111827; }
                .legacy-body h4 { margin: 1.3rem 0 0.5rem; font-size: 18px; font-weight: 700; color: #111827; }
                .legacy-body p { margin: 0 0 1rem; }
                .legacy-body ul, .legacy-body ol { margin: 0 0 1.1rem; padding-left: 1.5rem; }
                .legacy-body ul { list-style: disc; }
                .legacy-body ol { list-style: decimal; }
                .legacy-body li { margin-bottom: 0.4rem; }
                .legacy-body a { color: #881337; text-decoration: underline; text-underline-offset: 2px; }
                .legacy-body strong, .legacy-body b { color: #111827; font-weight: 700; }
                .legacy-body img { max-width: 100%; height: auto; border-radius: 12px; margin: 1rem 0; }
                .legacy-body figure { margin: 1.2rem 0; }
                .legacy-body figcaption { margin-top: 0.4rem; text-align: center; font-size: 13px; color: #6b7280; }
                .legacy-body table { width: 100%; margin: 1.2rem 0 1.5rem; border-collapse: collapse; font-size: 15px; display: block; overflow-x: auto; }
                .legacy-body th, .legacy-body td { border: 1px solid #e5e7eb; padding: 9px 12px; text-align: left; vertical-align: top; }
                .legacy-body th { background: #fdf2f4; font-weight: 700; color: #111827; }
                .legacy-body blockquote { margin: 1.2rem 0; border-left: 4px solid #881337; border-radius: 6px; background: #fdf2f4; padding: 0.9rem 1.1rem; }
                .legacy-body .elementor-widget-container { all: revert; }
                .legacy-body .elementor-accordion-item, .legacy-body .elementor-toggle-item { border-bottom: 1px solid #e5e7eb; padding: 0.5rem 0; }
                .legacy-body .elementor-tab-title, .legacy-body .elementor-toggle-title { font-weight: 700; }
                .legacy-body .elementor-tab-content, .legacy-body .elementor-toggle-content { padding-top: 0.5rem; }
                .legacy-body .elementor-button, .legacy-body .elementor-button-link {
                    display: inline-flex; align-items: center; gap: 0.5rem; margin: 0.4rem 0;
                    border-radius: 999px; background: #881337; color: #fff !important;
                    padding: 0.6rem 1.1rem; font-size: 14px; font-weight: 700; text-decoration: none;
                }
            `}</style>
        </div>
    );
};

export default LegacyShow;
