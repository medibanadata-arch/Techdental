import{r as o,G as ce,j as e,H as xe,L as d}from"./app-CMWtDe8o.js";import{T as he}from"./TopHeader-UYFUH-p1.js";import{G as me}from"./GlobalFooter-Cn6Aw4_H.js";import{g as pe}from"./branchStatus-A3yupCxi.js";import{E as fe}from"./eye-7oToANRU.js";import{c as S,C as I}from"./chevron-down-BBxWPJ64.js";import{C as W}from"./chevron-right-DYJyzLHP.js";import{C as D}from"./clock-DKMuq0Ql.js";import{P as ue}from"./phone-BkgvDC23.js";import{C as G}from"./calendar-check-CbmqnmrW.js";import{S as be}from"./sparkles-CS8CCCa3.js";import{C as ge}from"./chevron-up-CEmbI3VE.js";import{A as je}from"./arrow-right-DGSpFY81.js";import{S as V}from"./star-6KlPKOOB.js";import{X as we}from"./x-OT_CsvzO.js";import{I as ve}from"./info-B4zmVu12.js";import{M as ye}from"./menu-D893e3_i.js";import"./mail-B-9sUEL2.js";const Q={name:"chevron-left",size:24,node:[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]]};Q.node;const U=S(Q);const J={name:"send",size:24,node:[["path",{d:"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",key:"1ffxy3"}],["path",{d:"m21.854 2.147-10.94 10.939",key:"12cjpa"}]]};J.node;const Ne=S(J);const K={name:"user",size:24,node:[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]]};K.node;const ke=S(K),M="#8B1538",ze=["https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1200","https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=1200","https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=1200","https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?auto=format&fit=crop&q=80&w=1200"];function Ue({branch:t,gallery:$=[],doctors:X=[],services:w=[],locations:L=[],nav_menu:Y}){const[Z,ee]=o.useState(t?.short_name?.toLowerCase()||"mirpur"),[u,A]=o.useState(!1),[v,te]=o.useState(!1),E=(Array.isArray($)?$:[]).map(s=>typeof s=="string"?s:s?.src||s?.image||s?.url||"").filter(Boolean),n=E.length>0?E:ze,[y,N]=o.useState(!1),[c,x]=o.useState(0);o.useEffect(()=>{if(!y)return;const s=r=>{r.key==="ArrowLeft"?x(i=>i>0?i-1:n.length-1):r.key==="ArrowRight"?x(i=>i<n.length-1?i+1:0):r.key==="Escape"&&N(!1)};return window.addEventListener("keydown",s),()=>window.removeEventListener("keydown",s)},[y,n.length]);const b=o.useRef(null),h=(t?.short_name||t?.name||"Mirpur").replace(/branch/gi,"").trim(),l=`${h} Branch`,m=t?.phone||"09638000505";let p=(t?.whatsapp||m).replace(/[^0-9]/g,"");p.startsWith("01")&&(p="88"+p);const O=t?.map_url||`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(t?.address||"")}`,k=t?.call_label||"Call",z=t?.directions_label||"Directions",C=t?.whatsapp_label||"WhatsApp",_=t?.book_label||"Book",T=t?.booking_url||"/appointment",a=ce.useMemo(()=>pe({shortName:t?.short_name||t?.name,time:t?.hours_text||t?.time}),[t]),se=t?.address_main||(t?.address?t.address.split("(")[0].trim():`${h}, Dhaka`),F=t?.address_sub||(t?.address_main,""),P=t?.landmark||(t?.address&&t.address.includes("(")?t.address.substring(t.address.indexOf("(")+1).replace(")","").trim():""),B=t?.morning_hours,re=t?.evening_hours||t?.hours_text||t?.time||"4 PM – 9 PM",q=t?.working_days||"Saturday – Thursday",ae=q.replace(/Saturday/gi,"Sat").replace(/Thursday/gi,"Thu").replace(/Wednesday/gi,"Wed").replace(/Tuesday/gi,"Tue").replace(/Monday/gi,"Mon").replace(/Sunday/gi,"Sun"),le=t?.off_days||"Friday closed",R=s=>{if(b.current){const r=b.current.clientWidth*.55;b.current.scrollBy({left:r*s,behavior:"smooth"})}},ne=s=>{x(s),N(!0)},ie=u?w.slice(0,7):w.slice(0,3),g=t?.canonical_url||`https://techdentalbd.com/branch/${t?.slug||t?.id}`,H=t?.seo_title||`Best Dental Clinic in ${l} — Tech Dental Care`,j=t?.meta_desc||`Visit Tech Dental ${l} in Dhaka for painless root canal therapy, dental implants, cosmetic veneers and general dental treatments.`,oe=`${t?.robots_index!==!1?"index":"noindex"}, ${t?.robots_follow!==!1?"follow":"nofollow"}`,f=o.useMemo(()=>{if(!t?.faqs)return[];if(Array.isArray(t.faqs))return t.faqs;try{const s=typeof t.faqs=="string"?JSON.parse(t.faqs):t.faqs;return Array.isArray(s)?s:[]}catch{return[]}},[t?.faqs]),de=o.useMemo(()=>{if(t?.schema_json)try{return JSON.parse(t.schema_json)}catch{}const r={"@context":"https://schema.org","@type":t?.schema_type||"Dentist",name:`Tech Dental Care — ${l}`,description:j,url:g,telephone:m,address:{"@type":"PostalAddress",streetAddress:t?.address||"",addressLocality:"Dhaka",addressCountry:"BD"},priceRange:"৳৳"};return f.length>0?{"@context":"https://schema.org","@graph":[r,{"@type":"FAQPage",mainEntity:f.filter(i=>i&&i.q).map(i=>({"@type":"Question",name:i.q,acceptedAnswer:{"@type":"Answer",text:i.a||""}}))}]}:r},[t,g,j,l,m,f]);return e.jsxs("div",{className:"min-h-screen antialiased w-full",style:{backgroundColor:"#F8F9FA",color:"#1E293B",fontFamily:"'Inter', sans-serif"},children:[e.jsxs(xe,{children:[e.jsx("title",{children:H}),e.jsx("meta",{name:"description",content:j}),e.jsx("link",{rel:"canonical",href:g}),e.jsx("meta",{name:"robots",content:oe}),e.jsx("meta",{property:"og:title",content:H}),e.jsx("meta",{property:"og:description",content:j}),e.jsx("meta",{property:"og:url",content:g}),e.jsx("meta",{property:"og:type",content:"business.business"}),e.jsx("script",{type:"application/ld+json",children:JSON.stringify(de)})]}),e.jsx(he,{locations:L.length?L:[t],selectedBranch:Z,onBranchChange:ee,navMenu:Y}),e.jsxs("main",{className:"w-full px-3.5 sm:px-6 md:px-8 lg:px-12 xl:px-16 mt-4 sm:mt-6 pb-6 sm:pb-8",children:[e.jsxs("div",{className:"relative w-full mb-4 sm:mb-6 group/gallery",children:[e.jsx("div",{ref:b,className:"flex gap-3 sm:gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-2 sm:pb-3 scroll-smooth rounded-2xl sm:rounded-[2rem]",children:n.map((s,r)=>e.jsxs("div",{onClick:()=>ne(r),className:"relative flex-none w-[88vw] sm:w-[84vw] md:w-[60%] lg:w-[46%] h-[260px] sm:h-[320px] md:h-[450px] snap-center sm:snap-start rounded-2xl sm:rounded-[2rem] overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-shadow group/item",children:[e.jsx("img",{src:s,alt:`${l} gallery ${r+1}`,className:"w-full h-full object-cover transition-transform duration-700 group-hover/item:scale-105"}),e.jsxs("div",{className:"absolute bottom-4 right-4 bg-black/70 backdrop-blur-md text-white text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md",children:[e.jsx(fe,{size:14,className:"text-slate-200"}),e.jsx("span",{children:1800+r*340})]})]},r))}),e.jsx("button",{type:"button",onClick:()=>R(-1),className:"absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 backdrop-blur text-white opacity-0 group-hover/gallery:opacity-100 transition-all duration-200 hover:bg-black/90 hover:scale-110 z-10 hidden md:flex items-center justify-center cursor-pointer shadow-lg","aria-label":"Previous image",children:e.jsx(U,{size:22})}),e.jsx("button",{type:"button",onClick:()=>R(1),className:"absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 backdrop-blur text-white opacity-80 group-hover/gallery:opacity-100 transition-all duration-200 hover:bg-black/90 hover:scale-110 z-10 hidden md:flex items-center justify-center cursor-pointer shadow-lg","aria-label":"Next image",children:e.jsx(W,{size:22})})]}),e.jsxs("div",{className:"w-full flex flex-col lg:hidden justify-between items-center mb-6 gap-3 relative z-20",children:[e.jsxs("nav",{className:"w-full grid grid-cols-4 gap-2 text-center py-2 select-none","aria-label":`Quick actions for ${h} branch`,children:[e.jsxs("a",{href:`tel:${m}`,className:"flex flex-col items-center group cursor-pointer transition-transform duration-180 active:scale-95 no-underline","aria-label":`${k} ${h}`,children:[e.jsx("div",{className:"w-14 h-14 rounded-full bg-white border border-slate-200/90 flex items-center justify-center text-blue-600 shadow-2xs group-hover:bg-slate-50 transition-all",children:e.jsx("svg",{className:"w-6 h-6 stroke-[1.8]",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:e.jsx("path",{d:"M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"})})}),e.jsx("span",{className:"text-[13px] font-bold text-slate-800 tracking-tight mt-1.5 transition-colors",children:k})]}),e.jsxs("a",{href:O,target:"_blank",rel:"noreferrer",className:"flex flex-col items-center group cursor-pointer transition-transform duration-180 active:scale-95 no-underline",role:"button",tabIndex:0,"aria-label":`${z} ${h}`,children:[e.jsx("div",{className:"w-14 h-14 rounded-full bg-white border border-slate-200/90 flex items-center justify-center text-blue-600 shadow-2xs group-hover:bg-slate-50 transition-all",children:e.jsxs("svg",{className:"w-6 h-6 stroke-[1.8]",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[e.jsx("path",{d:"M22 2 11 13"}),e.jsx("path",{d:"M22 2 15 22l-4-9-9-4z"})]})}),e.jsx("span",{className:"text-[13px] font-bold text-slate-800 tracking-tight mt-1.5 transition-colors",children:z})]}),e.jsxs("a",{href:`https://wa.me/${p}`,target:"_blank",rel:"noreferrer",className:"flex flex-col items-center group cursor-pointer transition-transform duration-180 active:scale-95 no-underline","aria-label":`${C} Tech Dental`,children:[e.jsx("div",{className:"w-14 h-14 rounded-full bg-white border border-slate-200/90 flex items-center justify-center shadow-2xs group-hover:bg-emerald-50/50 group-hover:border-emerald-300 group-hover:shadow-xs transition-all",children:e.jsx("svg",{className:"w-6 h-6 transition-transform duration-200 group-hover:scale-110",viewBox:"0 0 448 512",fill:"#25D366",style:{color:"#25D366",fill:"#25D366"},"aria-hidden":"true",children:e.jsx("path",{fill:"#25D366",d:"M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"})})}),e.jsx("span",{className:"text-[13px] font-bold text-slate-800 tracking-tight mt-1.5 transition-colors",children:C})]}),e.jsxs(d,{href:T,className:"flex flex-col items-center group cursor-pointer transition-transform duration-180 active:scale-95 no-underline","aria-label":`${_} Appointment`,children:[e.jsx("div",{className:"w-14 h-14 rounded-full bg-white border border-slate-200/90 flex items-center justify-center text-[#8B1038] shadow-2xs group-hover:bg-slate-50 transition-all",children:e.jsxs("svg",{className:"w-6 h-6 stroke-[1.8]",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[e.jsx("rect",{x:"3",y:"4",width:"18",height:"18",rx:"3"}),e.jsx("path",{d:"M16 2v4M8 2v4M3 10h18"}),e.jsx("path",{d:"m9 16 2 2 4-4"})]})}),e.jsx("span",{className:"text-[13px] font-bold text-slate-800 tracking-tight mt-1.5 transition-colors",children:_})]})]}),e.jsx("div",{className:`w-full flex items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-3.5 rounded-2xl border transition-colors ${a.isOpenNow?"bg-gradient-to-r from-emerald-50/90 to-teal-50/60 border-emerald-200/70":a.isOpenSoon?"bg-gradient-to-r from-amber-50/90 to-orange-50/60 border-amber-200/70":"bg-slate-50 border-slate-200/80"}`,children:e.jsxs("div",{className:"flex items-center gap-3 min-w-0",children:[e.jsxs("div",{className:`w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white shadow-xs border flex items-center justify-center relative shrink-0 ${a.isOpenNow?"text-emerald-600 border-emerald-150":a.isOpenSoon?"text-amber-600 border-amber-150":"text-slate-400 border-slate-200"}`,children:[e.jsx(D,{size:19,className:"stroke-[2]"}),a.isOpenNow&&e.jsx("span",{className:"absolute inset-0 rounded-full border border-emerald-400 animate-ping opacity-25"})]}),e.jsxs("div",{className:"min-w-0",children:[e.jsxs("div",{className:"flex items-center gap-1.5 mb-0.5",children:[e.jsx("span",{className:`w-2.5 h-2.5 rounded-full shrink-0 ${a.isOpenNow?"bg-emerald-500 animate-pulse":a.isOpenSoon?"bg-amber-500":"bg-slate-400"}`}),e.jsx("span",{className:`text-[13.5px] sm:text-[14.5px] font-extrabold tracking-tight truncate ${a.isOpenNow?"text-emerald-800":a.isOpenSoon?"text-amber-900":"text-slate-800"}`,children:a.statusText})]}),e.jsx("p",{className:`text-[11.5px] sm:text-[12.5px] font-medium truncate ${a.isOpenNow?"text-emerald-700/90":a.isOpenSoon?"text-amber-800/90":"text-slate-500"}`,children:a.subText})]})]})})]}),e.jsxs("div",{className:"hidden lg:flex w-full bg-white p-3.5 rounded-3xl shadow-sm border border-slate-100 mb-8 relative z-20 gap-3.5 items-stretch",children:[e.jsxs("a",{href:`tel:${m}`,className:"flex-1 flex justify-center items-center gap-2.5 rounded-full border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer group py-3.5",children:[e.jsx(ue,{size:18,className:"text-blue-600 group-hover:scale-110 transition-transform"}),e.jsx("span",{className:"text-[15px] font-bold text-slate-800",children:k})]}),e.jsxs("a",{href:O,target:"_blank",rel:"noreferrer",className:"flex-1 flex justify-center items-center gap-2.5 rounded-full border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer group py-3.5",children:[e.jsx(Ne,{size:18,className:"text-blue-600 group-hover:scale-110 transition-transform"}),e.jsx("span",{className:"text-[15px] font-bold text-slate-800",children:z})]}),e.jsxs("a",{href:`https://wa.me/${p}`,target:"_blank",rel:"noreferrer",className:"flex-1 flex justify-center items-center gap-2.5 rounded-full bg-[#188B50] hover:bg-[#137442] text-white transition-all shadow-sm cursor-pointer group py-3.5 border border-[#188B50]",children:[e.jsx("svg",{className:"w-5 h-5 text-white",fill:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{d:"M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.983zm11.455-7.394c-.068-.113-.25-.181-.524-.318-.274-.137-1.62-.8-1.871-.891-.25-.092-.432-.137-.614.137-.182.274-.707.891-.866 1.073-.16.182-.319.205-.593.068-.274-.137-1.157-.426-2.203-1.359-.815-.726-1.365-1.623-1.524-1.897-.16-.274-.017-.422.12-.559.123-.122.274-.319.41-.478.137-.16.182-.274.274-.457.091-.182.046-.342-.023-.478-.068-.137-.614-1.482-.841-2.031-.222-.535-.447-.462-.614-.471l-.524-.01c-.182 0-.478.068-.729.342-.25.274-.956.935-.956 2.28 0 1.345.979 2.645 1.116 2.828.137.182 1.928 2.943 4.671 4.128 2.743 1.185 2.743.79 3.245.744.502-.046 1.62-.662 1.848-1.3.228-.639.228-1.186.16-1.301z"})}),e.jsx("span",{className:"font-extrabold text-sm",children:C})]}),e.jsxs(d,{href:T,className:"flex-1 flex justify-center items-center gap-2.5 rounded-full bg-[#C31E4D] hover:bg-[#A31840] text-white transition-all shadow-sm cursor-pointer group py-3.5 border border-[#C31E4D]",children:[e.jsx(G,{size:18,className:"group-hover:scale-110 transition-transform"}),e.jsx("span",{className:"text-[15px] font-bold",children:_})]}),e.jsxs("div",{className:`flex-1 flex items-center justify-center gap-3 rounded-full border py-2.5 ${a.isOpenNow?"bg-[#ECFDF3] border-emerald-100/60":a.isOpenSoon?"bg-[#FFFBEB] border-amber-100":"bg-slate-50 border-slate-200"}`,children:[e.jsx("div",{className:`w-[38px] h-[38px] rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm border ${a.isOpenNow?"text-[#059669] border-emerald-50":a.isOpenSoon?"text-amber-600 border-amber-100":"text-slate-400 border-slate-100"}`,children:e.jsx(D,{size:17})}),e.jsxs("div",{className:"flex flex-col justify-center",children:[e.jsxs("div",{className:"flex items-center gap-1.5 mb-0.5",children:[e.jsx("span",{className:`w-1.5 h-1.5 rounded-full ${a.isOpenNow?"bg-[#059669]":a.isOpenSoon?"bg-amber-500":"bg-slate-400"}`}),e.jsx("span",{className:`text-[14px] font-bold tracking-tight leading-none mt-0.5 ${a.isOpenNow?"text-[#059669]":a.isOpenSoon?"text-amber-800":"text-slate-700"}`,children:a.statusText})]}),e.jsx("p",{className:`text-[12px] font-medium leading-none ${a.isOpenNow?"text-[#059669]/80":a.isOpenSoon?"text-amber-700/80":"text-slate-500"}`,children:a.subText})]})]})]}),e.jsxs("div",{className:"w-full flex flex-col gap-6",children:[e.jsx("style",{children:`
            .td-branch-card {
              width: 100%;
              background: #fff;
              border-radius: 28px;
              border: 1px solid #ECE6E9;
              box-shadow: 0 24px 60px -30px rgba(120,20,50,.25);
              overflow: hidden;
              font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
            }
            .td-branch-head {
              background: #7E1736;
              color: #fff;
              padding: 40px 48px;
              display: flex;
              align-items: center;
              gap: 20px;
            }
            .td-branch-head-icon {
              width: 64px;
              height: 64px;
              border-radius: 18px;
              background: rgba(255,255,255,.14);
              display: flex;
              align-items: center;
              justify-content: center;
              flex: none;
            }
            .td-branch-eyebrow {
              font-size: 13px;
              font-weight: 600;
              letter-spacing: .14em;
              text-transform: uppercase;
              color: #F6D3DD;
            }
            .td-branch-h1 {
              margin: 4px 0 0;
              font-size: 40px;
              line-height: 1.1;
              font-weight: 800;
              letter-spacing: -.02em;
              color: #ffffff;
            }
            .td-branch-body {
              padding: 40px 48px 48px;
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(min(320px, 100%), 1fr));
              gap: 32px;
            }
            .td-branch-col {
              display: flex;
              flex-direction: column;
              gap: 20px;
            }
            .td-branch-label {
              font-size: 13px;
              font-weight: 700;
              letter-spacing: .12em;
              text-transform: uppercase;
              color: #5E5663;
            }
            .td-branch-addr {
              display: flex;
              gap: 16px;
              align-items: flex-start;
            }
            .td-branch-pin {
              flex: none;
              width: 44px;
              height: 44px;
              border-radius: 14px;
              background: #FBE9EF;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .td-branch-addr-main {
              display: block;
              font-size: 20px;
              font-weight: 700;
              line-height: 1.4;
              color: #1B1520;
            }
            .td-branch-addr-sub {
              display: block;
              font-size: 17px;
              line-height: 1.5;
              color: #4A4350;
              margin-top: 4px;
            }
            .td-branch-landmark {
              display: flex;
              align-items: center;
              gap: 12px;
              padding: 16px 18px;
              border-radius: 16px;
              background: #F8F5F6;
              border: 1px dashed #D9CDD3;
              font-size: 15px;
              line-height: 1.45;
              color: #3A3340;
            }
            .td-branch-landmark svg {
              flex: none;
            }
            .td-branch-shifts {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
              gap: 14px;
            }
            .td-branch-shift {
              padding: 20px;
              border-radius: 18px;
            }
            .td-branch-shift.morning {
              background: #FBE9EF;
            }
            .td-branch-shift.morning .shift-n {
              color: #7E1736;
            }
            .td-branch-shift.morning .shift-t {
              color: #1B1520;
            }
            .td-branch-shift.evening {
              background: #7E1736;
              color: #fff;
            }
            .td-branch-shift.evening .shift-n {
              color: #F6D3DD;
            }
            .td-branch-shift.evening .shift-t {
              color: #fff;
            }
            .td-branch-shift .shift-n {
              font-size: 14px;
              font-weight: 700;
            }
            .td-branch-shift .shift-t {
              font-size: 20px;
              font-weight: 800;
              letter-spacing: -.01em;
              margin-top: 8px;
              line-height: 1.25;
              white-space: nowrap;
            }
            .td-branch-days {
              display: flex;
              align-items: center;
              gap: 16px;
              flex-wrap: wrap;
            }
            .td-branch-range {
              display: inline-flex;
              align-items: center;
              gap: 8px;
              padding: 8px 14px;
              border-radius: 999px;
              background: #F2EEF0;
              font-size: 14px;
              font-weight: 700;
              color: #3A3340;
            }
            .td-branch-off {
              font-size: 14px;
              font-weight: 500;
              color: #6B6370;
            }
            @media(max-width: 600px) {
              .td-branch-card {
                border-radius: 24px;
              }
              .td-branch-head {
                padding: 16px 18px;
                gap: 12px;
              }
              .td-branch-head-icon {
                width: 40px;
                height: 40px;
                border-radius: 12px;
              }
              .td-branch-head-icon svg {
                width: 22px;
                height: 22px;
              }
              .td-branch-eyebrow, .td-branch-label, .td-branch-lm-label {
                display: none;
              }
              .td-branch-h1 {
                margin: 0;
                font-size: 22px;
              }
              .td-branch-body {
                padding: 16px 18px 18px;
                gap: 14px;
              }
              .td-branch-col {
                gap: 14px;
              }
              .td-branch-addr {
                gap: 10px;
              }
              .td-branch-pin {
                width: auto;
                height: auto;
                background: none;
                border-radius: 0;
                margin-top: 2px;
              }
              .td-branch-pin svg {
                width: 20px;
                height: 20px;
              }
              .td-branch-addr-main, .td-branch-addr-sub {
                display: inline;
                font-size: 14px;
                line-height: 1.5;
                margin: 0;
              }
              .td-branch-addr-main {
                color: #1B1520;
              }
              .td-branch-addr-sub {
                color: #4A4350;
                font-weight: 400;
              }
              .td-branch-addr-sub::before {
                content: ", ";
              }
              .td-branch-landmark {
                padding: 0;
                background: none;
                border: 0;
                border-radius: 0;
                gap: 8px;
                font-size: 13px;
                font-weight: 600;
                color: #7E1736;
              }
              .td-branch-landmark svg {
                width: 16px;
                height: 16px;
              }
              .td-branch-shifts {
                gap: 10px;
              }
              .td-branch-shift {
                padding: 12px 14px;
                border-radius: 16px;
              }
              .td-branch-shift .shift-n {
                font-size: 12px;
              }
              .td-branch-shift .shift-t {
                font-size: 16px;
                margin-top: 4px;
                line-height: 1.3;
              }
              .td-branch-days {
                justify-content: flex-start;
                gap: 12px;
              }
              .td-branch-range {
                padding: 7px 12px;
                font-size: 13px;
                gap: 7px;
              }
              .td-branch-range svg {
                width: 15px;
                height: 15px;
              }
              .td-branch-range .full-range {
                display: none;
              }
              .td-branch-range .short-range {
                display: inline;
              }
              .td-branch-off {
                font-size: 13px;
              }
            }
            @media(min-width: 601px) {
              .td-branch-range .short-range {
                display: none;
              }
            }
          `}),e.jsxs("section",{className:"td-branch-card",children:[e.jsxs("div",{className:"td-branch-head",children:[e.jsx("div",{className:"td-branch-head-icon",children:e.jsxs("svg",{"aria-hidden":"true",width:"30",height:"30",viewBox:"0 0 24 24",fill:"none",stroke:"#fff",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M4 21V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16"}),e.jsx("path",{d:"M14 10h5a1 1 0 0 1 1 1v10"}),e.jsx("path",{d:"M2 21h20"}),e.jsx("path",{d:"M8 8h2M8 12h2M8 16h2M17 14h1M17 17h1"})]})}),e.jsxs("div",{children:[e.jsx("div",{className:"td-branch-eyebrow",children:"Our Branch"}),e.jsx("h1",{className:"td-branch-h1",children:l})]})]}),e.jsxs("div",{className:"td-branch-body",children:[e.jsxs("div",{className:"td-branch-col",children:[e.jsx("div",{className:"td-branch-label",children:"Location"}),e.jsxs("div",{className:"td-branch-addr",children:[e.jsx("div",{className:"td-branch-pin",children:e.jsxs("svg",{"aria-hidden":"true",width:"22",height:"22",viewBox:"0 0 24 24",fill:"none",stroke:"#B4234A",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"}),e.jsx("circle",{cx:"12",cy:"10",r:"3"})]})}),e.jsxs("div",{children:[e.jsx("strong",{className:"td-branch-addr-main",children:se}),F?e.jsx("span",{className:"td-branch-addr-sub",children:F}):null]})]}),P?e.jsxs("div",{className:"td-branch-landmark",children:[e.jsxs("svg",{"aria-hidden":"true",width:"22",height:"22",viewBox:"0 0 24 24",fill:"none",stroke:"#7E1736",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("rect",{x:"4",y:"3",width:"16",height:"13",rx:"3"}),e.jsx("path",{d:"M4 11h16M8 16l-2 5M16 16l2 5"})]}),e.jsxs("div",{children:[e.jsx("strong",{className:"td-branch-lm-label",children:"Landmark: "}),P]})]}):null]}),e.jsxs("div",{className:"td-branch-col",children:[e.jsx("div",{className:"td-branch-label",children:"Opening Hours"}),e.jsxs("div",{className:"td-branch-shifts",children:[B&&e.jsxs("div",{className:"td-branch-shift morning",children:[e.jsx("div",{className:"shift-n",children:"Morning"}),e.jsx("div",{className:"shift-t",children:B})]}),e.jsxs("div",{className:"td-branch-shift evening",children:[e.jsx("div",{className:"shift-n",children:B?"Evening":"Operating Hours"}),e.jsx("div",{className:"shift-t",children:re})]})]}),e.jsxs("div",{className:"td-branch-days",children:[e.jsxs("div",{className:"td-branch-range",children:[e.jsxs("svg",{"aria-hidden":"true",width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"#7E1736",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("rect",{x:"3",y:"4",width:"18",height:"18",rx:"3"}),e.jsx("path",{d:"M16 2v4M8 2v4M3 10h18"})]}),e.jsx("span",{className:"full-range",children:q}),e.jsx("span",{className:"short-range",children:ae})]}),e.jsx("div",{className:"td-branch-off",children:le})]})]})]})]}),e.jsxs("div",{className:"bg-white rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm border border-slate-100 mb-4 relative group",children:[e.jsxs("div",{className:"flex justify-between items-center mb-4",children:[e.jsxs("div",{className:"flex items-center gap-2.5",children:[e.jsx(ke,{size:22,className:"text-[#8B1538]"}),e.jsx("h2",{className:"text-xl font-bold text-slate-800",children:"Specialist Doctors"})]}),e.jsx(d,{href:"/doctors",className:"text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline inline-flex items-center gap-1 whitespace-nowrap",children:"View All →"})]}),e.jsx("div",{className:"flex gap-3 overflow-x-auto no-scrollbar pb-2 pt-1 scroll-smooth snap-x",children:X.map(s=>e.jsxs("div",{className:"w-[205px] min-w-[205px] max-w-[205px] sm:w-[225px] sm:min-w-[225px] sm:max-w-[225px] border-[1.5px] rounded-2xl p-3 flex flex-col relative shrink-0 bg-white shadow-2xs hover:shadow-md transition-shadow snap-start",style:{borderColor:M},children:[e.jsx("div",{className:"relative w-full h-[130px] sm:h-[145px] rounded-xl overflow-hidden mb-2.5 bg-slate-100",children:e.jsx("img",{src:s.img||"https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400",alt:s.name,className:"w-full h-full object-cover"})}),e.jsx("h3",{className:"text-[14.5px] sm:text-[15.5px] font-bold text-teal-700 text-center tracking-tight leading-snug line-clamp-1",title:s.name,children:s.name}),e.jsx("p",{className:"text-[11.5px] font-bold text-[#800038] mt-1 text-center line-clamp-1",children:s.designation||"Dental Specialist"}),s.deg&&e.jsx("p",{className:"text-[10px] text-slate-500 mt-0.5 text-center line-clamp-1",title:s.deg,children:s.deg.split(",")[0].trim()}),e.jsxs("div",{className:"w-full flex items-center justify-center gap-1.5 text-[10.5px] font-semibold text-slate-600 my-2.5 bg-slate-50 py-1.5 px-2 rounded-lg border border-slate-100",children:[e.jsx(D,{size:11,className:"text-slate-400 shrink-0"}),e.jsx("span",{className:"truncate",children:s.visiting_time||"4.00 PM - 9.00 PM"})]}),e.jsxs("div",{className:"flex gap-2 mt-auto w-full pt-1",children:[e.jsx(d,{href:`/doctors/${s.id}`,className:"flex-1 py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-bold rounded-lg transition-colors flex items-center justify-center shadow-2xs text-center",children:e.jsx("span",{children:"Profile"})}),e.jsx(d,{href:"/appointment",className:"flex-1 py-1.5 px-2 text-white text-[11px] font-bold rounded-lg transition-opacity hover:opacity-95 flex items-center justify-center shadow-2xs text-center",style:{backgroundColor:M},children:e.jsx("span",{children:"Book"})})]})]},s.id))})]}),e.jsxs("div",{className:"bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 mb-4 relative transition-all duration-500",children:[e.jsxs("div",{className:"flex justify-between items-center mb-6",children:[e.jsxs("div",{className:"flex items-center gap-2.5 min-w-0",children:[e.jsx(be,{size:22,className:"text-[#8B1538] shrink-0"}),e.jsx("h2",{className:"text-lg sm:text-xl font-bold text-slate-800 whitespace-nowrap",children:"Services & Pricing"})]}),e.jsx("div",{className:"flex items-center gap-3",children:u&&e.jsx("button",{type:"button",onClick:()=>A(!1),className:"p-1.5 text-primary-maroon hover:bg-rose-50 rounded-lg transition-colors cursor-pointer",title:"Collapse list","aria-label":"Collapse services list",children:e.jsx(ge,{size:20,className:"stroke-[2.5]"})})})]}),e.jsxs("div",{className:"flex flex-col relative",children:[ie.map((s,r)=>e.jsxs(d,{href:`/services/${s.slug||s.id}`,className:"flex items-center justify-between p-3.5 mb-3 border border-slate-100 rounded-2xl bg-white shadow-sm hover:shadow-md hover:border-slate-200 hover:-translate-y-0.5 transition-all group cursor-pointer",children:[e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx("div",{className:"w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0",children:e.jsx("img",{src:s.image||"https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=100&h=100&fit=crop",className:"w-full h-full object-cover",alt:s.title||s.name||"Treatment"})}),e.jsx("div",{children:e.jsx("h3",{className:"text-[15px] font-semibold text-slate-800 group-hover:text-[#8B1538] transition-colors",children:(s.title||s.name||"Treatment").split(/[-–—:]/)[0].trim()})})]}),e.jsx("div",{className:"text-right pl-2 shrink-0",children:e.jsxs("span",{className:"inline-block bg-[#fdf2f5] text-[#8B1538] text-sm font-bold px-3 py-1.5 rounded-xl whitespace-nowrap",children:["৳ ",String(s.price||"1,500").replace(/^[৳\sBDTtk.]+/i,"").trim()]})})]},s.id||r)),w.length>3&&e.jsxs("div",{className:"mt-2 space-y-2",children:[!u&&e.jsxs("button",{type:"button",onClick:()=>A(!0),className:"w-full py-2.5 rounded-xl border border-slate-200 text-primary-maroon font-bold text-xs hover:bg-rose-50/50 transition-colors flex justify-center items-center gap-1.5 cursor-pointer shadow-2xs",children:[e.jsx("span",{children:"See more"}),e.jsx(I,{size:14})]}),u&&e.jsxs(d,{href:"/services",className:"group w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-[#800038]/5 via-[#800038]/10 to-[#800038]/5 hover:from-[#800038] hover:via-[#800038] hover:to-[#a01246] border border-[#800038]/20 hover:border-[#800038] text-[#800038] hover:text-white font-extrabold text-[0.84rem] shadow-xs hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]",children:[e.jsx("span",{children:"View All Services"}),e.jsx(je,{className:"w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"})]})]})]})]}),e.jsxs("div",{className:"bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-slate-100 mb-4",children:[e.jsxs("div",{className:"flex items-center gap-3.5 sm:gap-4",children:[e.jsx("div",{className:"w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[#fff7ed] flex items-center justify-center shrink-0 border border-amber-100/80 shadow-2xs",children:e.jsx(V,{size:26,className:"text-[#f97316] fill-[#f97316]"})}),e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none",children:"4.9"}),e.jsx("div",{className:"flex text-[#f97316] gap-0.5",children:[1,2,3,4,5].map(s=>e.jsx(V,{size:15,fill:"#f97316",color:"#f97316"},s))})]}),e.jsxs("div",{className:"flex items-center gap-1.5 mt-1",children:[e.jsx("span",{className:"text-[12.5px] sm:text-[13.5px] font-semibold text-slate-600",children:"2,500+ Verified Patient Reviews"}),e.jsx("svg",{className:"w-4 h-4 text-[#1d9bf0] fill-[#1d9bf0] shrink-0",viewBox:"0 0 24 24",children:e.jsx("path",{d:"M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm3.707 7.293a1 1 0 0 0-1.414 0L10.5 13.086l-1.793-1.793a1 1 0 0 0-1.414 1.414l2.5 2.5a1 1 0 0 0 1.414 0l4.5-4.5a1 1 0 0 0 0-1.414z"})})]})]})]}),e.jsx("div",{className:"bg-[#f8fafc] rounded-2xl p-4 sm:p-5 my-4 border-l-4 border-[#d62858]",children:e.jsxs("p",{className:"italic text-slate-700 text-[13.5px] sm:text-[14.5px] leading-relaxed",children:['"',t?.reviews_text||"Extremely gentle and painless treatment! The doctors explained every procedure clearly, and the clinic environment was spotless and reassuring.",'"']})}),e.jsxs("a",{href:t?.review_url||t?.map_url||"https://maps.google.com",target:"_blank",rel:"noopener noreferrer",className:"w-full py-3.5 px-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2.5 shadow-2xs group cursor-pointer",children:[e.jsxs("svg",{className:"w-5 h-5 shrink-0",viewBox:"0 0 24 24",children:[e.jsx("path",{fill:"#4285F4",d:"M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"}),e.jsx("path",{fill:"#34A853",d:"M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"}),e.jsx("path",{fill:"#FBBC05",d:"M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"}),e.jsx("path",{fill:"#EA4335",d:"M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"})]}),e.jsx("span",{className:"text-slate-800 font-bold text-sm sm:text-[15px] group-hover:text-slate-900",children:"See All Google Reviews"})]})]}),e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsxs(d,{href:t.booking_url||"/appointment",className:"w-full py-4 rounded-2xl text-white font-bold shadow-lg shadow-[#8B1538]/20 hover:opacity-95 transition-all flex justify-center items-center gap-2 text-base sm:text-lg text-center cursor-pointer active:scale-98",style:{backgroundColor:M},children:[e.jsx(G,{size:20}),e.jsx("span",{children:t.appointment_btn_label||"Book Now"})]}),e.jsxs("div",{className:"w-full border border-slate-200 bg-white rounded-2xl overflow-hidden shadow-sm",children:[e.jsxs("button",{type:"button",onClick:()=>te(!v),className:"w-full py-4 px-5 sm:px-6 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm sm:text-base transition-all flex items-center justify-between text-left cursor-pointer active:scale-[0.99]",children:[e.jsx("span",{className:"text-left font-bold text-slate-800 text-sm sm:text-base",children:t.more_about_title||`More About ${(t.short_name||t.name||"").replace(/\s*branch\s*$/i,"").trim()}`}),e.jsx(I,{size:20,className:`text-slate-500 transition-transform duration-300 shrink-0 ${v?"rotate-180 text-rose-700":""}`})]}),v&&e.jsxs("div",{className:"px-5 pb-6 border-t border-slate-100 animate-fade-in space-y-4",children:[t.seo_content?e.jsx("div",{className:"rich-content-view wp-editor-content prose prose-slate max-w-none text-slate-700 leading-relaxed mt-4",dangerouslySetInnerHTML:{__html:t.seo_content}}):e.jsxs("div",{className:"text-sm text-slate-600 mt-4 space-y-3 leading-relaxed",children:[e.jsxs("h3",{className:"text-base font-bold text-slate-800 mb-1",children:["Premier Digital Dentistry & Comprehensive Oral Care in ",l]}),e.jsxs("p",{children:["Welcome to ",e.jsxs("strong",{children:["Tech Dental (",l,")"]}),", your trusted destination for comprehensive, high-precision dental treatments in Dhaka. Conveniently situated with state-of-the-art dental chairs, German autoclaves, and certified specialists."]}),e.jsx("p",{children:"Our treatments include single-visit Rotary Root Canal, laser teeth whitening, aesthetic veneers, and durable dental implants adhering strictly to European sterilization protocols."})]}),f.length>0&&e.jsxs("div",{className:"pt-4 border-t border-slate-100 space-y-3",children:[e.jsxs("h4",{className:"text-sm font-bold text-slate-800",children:["Frequently Asked Questions (",h," Clinic)"]}),e.jsx("div",{className:"space-y-2",children:f.filter(s=>s&&s.q).map((s,r)=>e.jsxs("div",{className:"p-3 bg-slate-50/80 rounded-xl border border-slate-200/80",children:[e.jsxs("div",{className:"font-bold text-xs text-slate-900 mb-1",children:["Q: ",s.q]}),e.jsx("div",{className:"text-xs text-slate-600 leading-relaxed",children:s.a})]},r))})]})]})]})]})]})]}),y&&e.jsxs("div",{className:"fixed inset-0 z-50 bg-black/95 text-white flex flex-col md:flex-row overflow-hidden animate-in fade-in duration-200 select-none",children:[e.jsxs("div",{className:"hidden md:flex flex-col w-[320px] lg:w-[360px] bg-neutral-950 border-r border-neutral-800 shrink-0 h-full",children:[e.jsx("div",{className:"p-4 border-b border-neutral-800 flex items-center justify-between",children:e.jsxs("div",{children:[e.jsxs("h3",{className:"text-sm font-extrabold text-white tracking-wide",children:[l," Photos"]}),e.jsxs("p",{className:"text-[0.68rem] text-neutral-400",children:["Tech Dental Care • ",n.length," photos"]})]})}),e.jsx("div",{className:"flex-1 overflow-y-auto p-3 grid grid-cols-2 gap-2.5 custom-scrollbar",children:n.map((s,r)=>e.jsxs("button",{type:"button",onClick:()=>x(r),className:`relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer group bg-neutral-900 ${r===c?"border-sky-500 ring-2 ring-sky-500/50 scale-[0.98]":"border-transparent opacity-65 hover:opacity-100 hover:scale-[1.02]"}`,children:[e.jsx("img",{src:s,alt:`${l} thumbnail ${r+1}`,className:"w-full h-full object-cover"}),r===c&&e.jsx("div",{className:"absolute inset-0 bg-sky-500/10 pointer-events-none"})]},r))})]}),e.jsxs("div",{className:"flex-1 flex flex-col h-full bg-black relative min-w-0",children:[e.jsxs("div",{className:"p-3 md:p-4 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between z-20 shrink-0",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("div",{className:"w-8 h-8 rounded-full bg-rose-900/80 border border-rose-500/40 flex items-center justify-center text-rose-300 font-extrabold text-xs",children:"TD"}),e.jsxs("div",{children:[e.jsx("h4",{className:"text-xs md:text-sm font-extrabold text-white leading-tight",children:"Tech Dental Care"}),e.jsxs("p",{className:"text-[0.65rem] md:text-[0.7rem] text-neutral-400",children:[l," • Dhaka"]})]})]}),e.jsx("button",{type:"button",onClick:()=>N(!1),className:"w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer border border-white/10","aria-label":"Close modal",children:e.jsx(we,{className:"w-5 h-5"})})]}),e.jsxs("div",{className:"h-[42vh] md:h-auto md:flex-1 relative flex items-center justify-center p-2 md:p-6 bg-black shrink-0",children:[e.jsx("button",{type:"button",onClick:s=>{s.stopPropagation(),x(r=>r>0?r-1:n.length-1)},className:"absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-11 md:h-11 flex items-center justify-center rounded-full bg-black/60 hover:bg-black/85 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-xl","aria-label":"Previous photo",children:e.jsx(U,{className:"w-5 h-5 md:w-6 md:h-6 stroke-[2.5]"})}),e.jsx("img",{src:n[c]||n[0]||"",alt:`${l} photo ${c+1}`,className:"max-h-full max-w-full object-contain rounded-lg shadow-2xl transition-all duration-300"}),e.jsx("button",{type:"button",onClick:s=>{s.stopPropagation(),x(r=>r<n.length-1?r+1:0)},className:"absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-11 md:h-11 flex items-center justify-center rounded-full bg-black/60 hover:bg-black/85 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-xl","aria-label":"Next photo",children:e.jsx(W,{className:"w-5 h-5 md:w-6 md:h-6 stroke-[2.5]"})})]}),e.jsxs("div",{className:"hidden md:flex p-3 md:p-4 bg-neutral-950/80 border-t border-neutral-800 text-[0.68rem] md:text-xs text-neutral-400 items-center justify-between gap-2 shrink-0",children:[e.jsxs("div",{className:"flex items-center gap-1.5",children:[e.jsx(ve,{className:"w-3.5 h-3.5 text-neutral-500"}),e.jsx("span",{children:"Images may be subject to copyright • Tech Dental Care"})]}),e.jsxs("div",{className:"flex items-center gap-2 font-mono text-[0.68rem] text-neutral-400",children:[e.jsx(ye,{className:"w-3.5 h-3.5 text-rose-400"}),e.jsx("span",{children:t?.address||`${l}, Dhaka`})]})]}),e.jsxs("div",{className:"md:hidden flex-1 min-h-0 bg-neutral-950 border-t border-neutral-800 flex flex-col overflow-hidden",children:[e.jsxs("div",{className:"px-3 pt-2.5 pb-1.5 text-[0.68rem] text-neutral-400 font-bold flex items-center justify-between uppercase tracking-wider shrink-0 border-b border-neutral-900",children:[e.jsxs("span",{children:["ALL PHOTOS (",c+1,"/",n.length,")"]}),e.jsx("span",{className:"text-[0.62rem] text-neutral-500 font-normal",children:"TAP TO VIEW"})]}),e.jsx("div",{className:"flex-1 overflow-y-auto p-2.5 grid grid-cols-3 gap-2 custom-scrollbar",children:n.map((s,r)=>e.jsxs("button",{type:"button",onClick:()=>x(r),className:`relative aspect-square w-full rounded-xl overflow-hidden border-2 transition-all cursor-pointer bg-neutral-900 group ${r===c?"border-sky-500 ring-2 ring-sky-500/60 scale-[0.97]":"border-transparent opacity-65 hover:opacity-100 hover:scale-[1.02]"}`,children:[e.jsx("img",{src:s,alt:`Thumbnail ${r+1}`,className:"w-full h-full object-cover",loading:"lazy"}),r===c&&e.jsx("div",{className:"absolute inset-0 bg-sky-500/15 pointer-events-none"})]},r))})]})]})]}),e.jsx(me,{hideCtaStrip:!0})]})}export{Ue as default};
