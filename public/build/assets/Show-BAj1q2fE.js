import{r as g,j as e,L as y}from"./app-C2wMoUmC.js";import{T as x}from"./TopHeader-BTNHeXGz.js";import{G as p}from"./GlobalFooter-CcY4H3j8.js";import"./menu-DZvDPtuP.js";import"./chevron-down-OGQQPPOp.js";import"./x-DVd3lmsw.js";import"./contact-DE9Ni57G.js";import"./sparkles-CJQ1MIst.js";import"./phone-BQ8videx.js";import"./arrow-right-YsLYCgOi.js";import"./clock-WQEaIlmC.js";import"./mail-0rDadpNI.js";const E=({legacy:t,locations:d=[],nav_menu:m})=>{const n=!!t.is_bn,l=n?{home:"হোম",updated:"সর্বশেষ আপডেট",faq:"সচরাচর জিজ্ঞাসা (FAQ)"}:{home:"Home",updated:"Last updated",faq:"Frequently Asked Questions"};g.useEffect(()=>{const o=Array.from(document.querySelectorAll(".legacy-body img")),a=r=>{const i=r.target;i.style.display="none";const s=i.closest("figure");s&&(s.style.display="none")};return o.forEach(r=>{r.addEventListener("error",a),r.complete&&r.naturalWidth===0&&a({target:r})}),()=>o.forEach(r=>r.removeEventListener("error",a))},[t.body_html]);const c=(()=>{if(!t.snapshot_at)return"2026";const o=new Date(t.snapshot_at);return isNaN(o.getTime())?"2026":o.toLocaleDateString(n?"bn-BD":"en-GB",{day:"2-digit",month:"short",year:"numeric"})})();return e.jsxs("div",{className:"min-h-screen bg-white text-gray-800 antialiased font-sans",children:[e.jsx(x,{locations:d,navMenu:m,showBranchPicker:!0,showLanguageSwitcher:!0}),e.jsxs("main",{className:"mx-auto w-full max-w-7xl px-4 sm:px-8 lg:px-10 py-7 lg:py-10",children:[e.jsxs("nav",{className:"mb-4 flex flex-wrap items-center gap-1.5 text-[13px] text-gray-500",children:[e.jsx(y,{href:"/",className:"hover:text-rose-900",children:l.home}),e.jsx("span",{children:"/"}),e.jsx("span",{className:"text-gray-400",children:t.h1||t.title})]}),e.jsxs("article",{className:"mx-auto w-full max-w-4xl",children:[e.jsx("h1",{className:"mb-3 text-[26px] font-extrabold leading-tight text-gray-900 sm:text-[32px] lg:text-[38px]",children:t.h1||t.title}),e.jsxs("div",{className:"mb-6 border-b border-gray-200 pb-3 text-[13px] text-gray-500",children:[l.updated,": ",c,"  ·  Tech Dental Care"]}),e.jsx("div",{className:"legacy-body",dangerouslySetInnerHTML:{__html:t.body_html}}),t.faqs?.length>0&&e.jsxs("section",{className:"mt-10",children:[e.jsx("h2",{className:"mb-4 text-[24px] font-bold text-gray-900",children:l.faq}),e.jsx("div",{className:"space-y-5",children:t.faqs.map((o,a)=>e.jsxs("div",{children:[e.jsx("h3",{className:"text-[16px] font-semibold text-gray-900",children:o.q}),e.jsx("p",{className:"mt-1.5 text-[15px] leading-relaxed text-gray-600",dangerouslySetInnerHTML:{__html:o.a}})]},a))})]})]})]}),e.jsx(p,{}),e.jsx("style",{children:`
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
            `})]})};export{E as default};
