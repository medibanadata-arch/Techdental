import{r as o,G as je,c as ve,j as e,L as x}from"./app-D0CcPmWo.js";import{S as ye,T as Ne}from"./Seo-BSXKQWzP.js";import{G as ke}from"./GlobalFooter-D0gJ4faE.js";import{g as Se,p as Ce}from"./branchStatus-CAPs6KJi.js";import{b as _e,c as ze,W as Be}from"./contact-DE9Ni57G.js";import{c as Ae,C as O}from"./chevron-down-DIasQ4EM.js";import{C as q}from"./chevron-right-DfOBdZpl.js";import{P as Ee}from"./phone-D0y8pwkj.js";import{S as $e,U as Te}from"./user-6SYgMN2I.js";import{C as I}from"./calendar-check-C8qdxRR0.js";import{M as R}from"./menu-Cckbt-O7.js";import{B as De}from"./building-complex-C-5NYLic.js";import{C as G}from"./clock-DbFSX_MR.js";import{S as Me}from"./sparkles-DdlrNwNS.js";import{C as Pe}from"./chevron-up-CQMnifLF.js";import{A as Le}from"./arrow-right-fTAVOwjk.js";import{S as H}from"./star-BgMom2qm.js";import{X as Fe}from"./x-DSPhL9hw.js";import{I as Oe}from"./info-sqVz5vl2.js";import"./mail-Bb0jNdQK.js";const W={name:"chevron-left",size:24,node:[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]]};W.node;const U=Ae(W),C="#8B1538",qe=["https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1200","https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=1200","https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=1200","https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?auto=format&fit=crop&q=80&w=1200"];function ds({branch:t,gallery:g=[],doctors:V=[],services:w=[],locations:_=[],nav_menu:X}){const[Y,J]=o.useState(t?.short_name?.toLowerCase()||"mirpur"),[f,z]=o.useState(!1),[j,Q]=o.useState(!1),B=new Set,A=(Array.isArray(g)?g:[]).filter(s=>{const a=typeof s=="string"?s:s?.src||s?.image||s?.url||"",r=String(a).trim().replace(/^https?:\/\/[^/]+/i,"").replace(/\/+$/,"").toLowerCase();return!r||B.has(r)?!1:(B.add(r),!0)}).map(s=>typeof s=="string"?s:s?.src||s?.image||s?.url||"").filter(Boolean),l=A.length>0?A:qe,[v,p]=o.useState(0),u=o.useRef(null),K=()=>{p(s=>s>0?s-1:l.length-1)},Z=()=>{p(s=>s<l.length-1?s+1:0)},ee=s=>{u.current=s.touches[0].clientX},se=s=>{if(u.current===null)return;const a=s.changedTouches[0].clientX-u.current;Math.abs(a)>40&&(a<0?p(r=>r<l.length-1?r+1:0):p(r=>r>0?r-1:l.length-1)),u.current=null},[m,y]=o.useState(!1),[n,d]=o.useState(0);o.useEffect(()=>{if(!m)return;const s=a=>{a.key==="ArrowLeft"?d(r=>r>0?r-1:l.length-1):a.key==="ArrowRight"?d(r=>r<l.length-1?r+1:0):a.key==="Escape"&&y(!1)};return window.addEventListener("keydown",s),()=>window.removeEventListener("keydown",s)},[m,l.length]),o.useRef(null);const b=(t?.short_name||t?.name||"Mirpur").replace(/branch/gi,"").trim(),i=`${b} Branch`,N=t?.phone||_e,te=ze(t?.whatsapp||Be),ae=t?.map_url||`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(t?.address||"")}`,E=t?.call_label||"Call",$=t?.directions_label||"Directions",T=t?.whatsapp_label||"WhatsApp",re=t?.book_label||"Book",le=t?.booking_url||"/appointment",c=je.useMemo(()=>Se({shortName:t?.short_name||t?.name,time:[t?.morning_hours,t?.evening_hours].filter(Boolean).join(" | ")||t?.hours_text||t?.time}),[t]),ie=t?.address_main||(t?.address?t.address.split("(")[0].trim():`${b}, Dhaka`),D=t?.address_sub||(t?.address_main,""),M=t?.landmark||(t?.address&&t.address.includes("(")?t.address.substring(t.address.indexOf("(")+1).replace(")","").trim():""),P=s=>s?s.replace(/:00\b/g,""):"",oe=P(t?.morning_hours),ne=P(t?.evening_hours||t?.hours_text||t?.time||"4 PM – 9 PM"),L=t?.working_days||"Saturday – Thursday";L.replace(/Saturday/gi,"Sat").replace(/Thursday/gi,"Thu").replace(/Wednesday/gi,"Wed").replace(/Tuesday/gi,"Tue").replace(/Monday/gi,"Mon").replace(/Sunday/gi,"Sun"),t?.off_days;const de=s=>{d(s),y(!0)},ce=f?w.slice(0,7):w.slice(0,3),xe=ve(),pe=String(xe.props?.site_url||"https://techdentalcare.com").replace(/\/+$/,""),me=`/branch/${t?.slug||t?.id}`,k=`${pe}${me}`,he=t?.seo_title||`Best Dental Clinic in ${i} — Tech Dental Care`,S=t?.meta_desc||`Visit Tech Dental ${i} in Dhaka for painless root canal therapy, dental implants, cosmetic veneers and general dental treatments.`,fe=`${t?.robots_index!==!1?"index":"noindex"}, ${t?.robots_follow!==!1?"follow":"nofollow"}`,h=o.useMemo(()=>{if(!t?.faqs)return[];if(Array.isArray(t.faqs))return t.faqs;try{const s=typeof t.faqs=="string"?JSON.parse(t.faqs):t.faqs;return Array.isArray(s)?s:[]}catch{return[]}},[t?.faqs]),ue=o.useMemo(()=>{if(t?.schema_json)try{return JSON.parse(t.schema_json)}catch{}const a={"@context":"https://schema.org","@type":t?.schema_type||"Dentist",name:`Tech Dental Care — ${i}`,description:S,url:k,telephone:N,address:{"@type":"PostalAddress",streetAddress:t?.address||"",addressLocality:"Dhaka",addressCountry:"BD"},priceRange:"৳৳"};return h.length>0?{"@context":"https://schema.org","@graph":[a,{"@type":"FAQPage",mainEntity:h.filter(r=>r&&r.q).map(r=>({"@type":"Question",name:r.q,acceptedAnswer:{"@type":"Answer",text:r.a||""}}))}]}:a},[t,k,S,i,N,h]),F=[oe,ne].filter(Boolean).join(" | ")||t?.hours_text||t?.time||"",{shifts:be}=o.useMemo(()=>Ce(F,t?.short_name||t?.name||""),[F,t]),ge=s=>s<720?"Morning":s<960?"Afternoon":"Evening",we=c.isOpenNow?`Open now · ${c.subText||"closes 9 PM"}`:c.isOpenSoon?`Opening soon · ${c.subText||"opens 3 PM"}`:c.isFriday?"Closed today · opens Saturday":`Closed · ${c.subText||"opens 3 PM"}`;return o.useEffect(()=>{if(m||l.length<2||typeof window<"u"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;const s=window.setInterval(()=>{p(a=>(a+1)%l.length)},4500);return()=>window.clearInterval(s)},[m,l.length]),e.jsxs("div",{className:"min-h-screen antialiased w-full",style:{backgroundColor:"#F8F9FA",color:"#1E293B",fontFamily:"'Inter', 'Plus Jakarta Sans', 'SolaimanLipi', 'Noto Sans Bengali', sans-serif"},children:[e.jsx(ye,{title:he,description:S,canonical:k,type:"website",robots:fe,image:t?.image,schema:ue,noSuffix:!0}),e.jsx(Ne,{locations:_.length?_:[t],selectedBranch:Y,onBranchChange:J,navMenu:X}),e.jsxs("main",{className:"w-full px-3.5 sm:px-6 md:px-8 lg:px-12 xl:px-16 mt-4 sm:mt-6 pb-6 sm:pb-8",children:[e.jsx("style",{children:`
          .bs-page {
            display: grid;
            grid-template-columns: 1fr;
            gap: 0;
            width: 100%;
            margin-bottom: 4px;
          }
          .bs-arch {
            position: relative;
            overflow: hidden;
            aspect-ratio: 1 / 1;
            background: #F8E9EE;
            border-radius: 28px;
          }
          .bs-track {
            position: absolute;
            inset: 0;
            display: flex;
            transition: transform .5s cubic-bezier(.22, 1, .36, 1);
            will-change: transform;
          }
          .bs-slide {
            flex: 0 0 100%;
            height: 100%;
            padding: 0;
            border: 0;
            background: none;
            cursor: zoom-in;
            display: block;
          }
          .bs-slide img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
          }
          .bs-nav {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: grid;
            place-items: center;
            background: rgba(255,255,255,.94);
            color: #1B1620;
            z-index: 3;
            border: 0;
            cursor: pointer;
            box-shadow: 0 4px 14px rgba(20,6,12,.16);
            transition: transform .15s, background .15s;
          }
          .bs-nav:hover {
            background: #fff;
            transform: translateY(-50%) scale(1.06);
          }
          .bs-nav.p { left: 14px; }
          .bs-nav.n { right: 14px; }
          .bs-dots {
            position: absolute;
            left: 50%;
            bottom: 16px;
            transform: translateX(-50%);
            display: flex;
            gap: 6px;
            z-index: 3;
            pointer-events: none;
          }
          .bs-dots i {
            width: 7px;
            height: 7px;
            border-radius: 9px;
            background: rgba(255,255,255,.6);
            transition: width .25s, background .25s;
          }
          .bs-dots i.on {
            width: 20px;
            background: #fff;
          }
          .bs-info {
            text-align: center;
            margin-top: 22px;
          }
          .bs-status {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: #E3F5EC;
            color: #1E8E5A;
            font-weight: 700;
            font-size: 13px;
            padding: 7px 13px;
            border-radius: 99px;
          }
          .bs-status i {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: currentColor;
            box-shadow: 0 0 0 4px rgba(30,142,90,.14);
          }
          .bs-status.closed {
            background: #FBF0D9;
            color: #8A5A00;
          }
          .bs-status.closed i {
            box-shadow: 0 0 0 4px rgba(138,90,0,.12);
          }
          .bs-h1 {
            font-family: 'Playfair Display', Georgia, serif;
            font-weight: 600;
            font-size: clamp(34px, 8.5vw, 58px);
            line-height: 1.06;
            margin: 12px 0 0;
            letter-spacing: -.01em;
            color: #1B1620;
          }
          .bs-acts {
            display: flex;
            gap: 10px;
            margin-top: 20px;
            align-items: center;
          }
          .bs-circ {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: #F3F1F5;
            display: grid;
            place-items: center;
            flex: none;
            color: #1B1620;
            transition: transform .15s, background .15s;
          }
          .bs-circ:hover {
            background: #EAE6EE;
            transform: translateY(-1px);
          }
          .bs-circ.w {
            background: #E3F5EC;
            color: #1E8E5A;
          }
          .bs-book {
            flex: 1;
            min-height: 50px;
            border-radius: 25px;
            background: #8A1538;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 9px;
            font-weight: 800;
            font-size: 15px;
            box-shadow: 0 12px 24px -12px #8A1538;
            transition: transform .15s, opacity .15s;
          }
          .bs-book:hover {
            opacity: .95;
            transform: translateY(-1px);
          }
          .bs-circ:active,
          .bs-book:active {
            transform: scale(.98);
          }
          .bs-list {
            list-style: none;
            padding: 0;
            margin: 22px 0 0;
            border-top: 1px solid #E8E6EC;
            text-align: left;
          }
          .bs-list > li {
            display: flex;
            gap: 14px;
            padding: 18px 0;
            border-bottom: 1px solid #E8E6EC;
          }
          .bs-lead {
            color: #8A1538;
            width: 22px;
            height: 22px;
            margin-top: 2px;
            flex: none;
          }
          .bs-grow {
            flex: 1;
            min-width: 0;
          }
          .bs-lbl {
            color: #6B6573;
            font-size: 13px;
            font-weight: 600;
          }
          .bs-addr {
            font-weight: 700;
            font-size: 16px;
            color: #1B1620;
            line-height: 1.4;
          }
          .bs-sub {
            color: #6B6573;
            font-size: 14px;
            margin-top: 2px;
          }
          .bs-shifts {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 12px;
          }
          .bs-shift {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            background: #FBF1F4;
            border: 1px solid #F1DFE6;
            border-radius: 12px;
            padding: 6px 11px;
          }
          .bs-shift em {
            font-style: normal;
            font-size: 9.5px;
            font-weight: 800;
            letter-spacing: .07em;
            text-transform: uppercase;
            color: #A16B7E;
          }
          .bs-shift strong {
            font-family: 'Plus Jakarta Sans', 'Inter', 'SolaimanLipi', 'Noto Sans Bengali', sans-serif;
            font-size: 14px;
            font-weight: 800;
            line-height: 1.2;
            white-space: nowrap;
            color: #1B1620;
            letter-spacing: -.01em;
          }
          @media (min-width: 900px) {
            .bs-page {
              grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
              gap: 56px;
              align-items: stretch;
              margin-top: 6px;
            }
            .bs-arch {
              position: sticky;
              top: 24px;
              aspect-ratio: auto;
            }
            .bs-info {
              text-align: left;
              margin-top: 0;
              max-width: none;
              justify-self: stretch;
            }
            .bs-acts {
              margin-top: 26px;
            }
            .bs-nav.p { left: 18px; }
            .bs-nav.n { right: 18px; }
          }
          @media (max-width: 899px) {
            .bs-nav { display: none; }
            .bs-arch { border-radius: 24px; }
          }
          @media (max-width: 480px) {
            .bs-info { margin-top: 20px; }
            .bs-acts { gap: 8px; }
            .bs-circ { width: 46px; height: 46px; }
            .bs-book { min-height: 46px; border-radius: 23px; font-size: 14px; }
            .bs-shift { padding: 5px 9px; }
            .bs-shift strong { font-size: 13px; }
          }
        `}),e.jsxs("section",{className:"bs-page","aria-label":`${i} photos and details`,children:[e.jsxs("div",{className:"bs-arch",children:[e.jsx("div",{className:"bs-track",style:{transform:`translateX(-${v*100}%)`},onTouchStart:ee,onTouchEnd:se,children:l.map((s,a)=>e.jsx("button",{type:"button",className:"bs-slide",onClick:()=>de(a),"aria-label":`Open photo ${a+1} of ${l.length}`,tabIndex:a===v?0:-1,children:e.jsx("img",{src:s,alt:g[a]?.alt||`${i} photo ${a+1}`,loading:a===0?"eager":"lazy"})},`${s}-${a}`))}),e.jsx("button",{type:"button",className:"bs-nav p",onClick:K,"aria-label":"Previous photo",children:e.jsx(U,{size:20})}),e.jsx("button",{type:"button",className:"bs-nav n",onClick:Z,"aria-label":"Next photo",children:e.jsx(q,{size:20})}),e.jsx("div",{className:"bs-dots","aria-hidden":"true",children:l.map((s,a)=>e.jsx("i",{className:a===v?"on":""},a))})]}),e.jsxs("section",{className:"bs-info","aria-label":"Branch address and opening hours",children:[e.jsxs("span",{className:`bs-status ${c.isOpenNow?"":"closed"}`,children:[e.jsx("i",{}),e.jsx("span",{children:we})]}),e.jsx("h1",{className:"bs-h1",children:t?.short_name||t?.name||`${b} Branch`}),e.jsxs("div",{className:"bs-acts",children:[e.jsx("a",{className:"bs-circ",href:`tel:${N}`,"aria-label":E,title:E,children:e.jsx(Ee,{size:20})}),e.jsx("a",{className:"bs-circ",href:ae,target:"_blank",rel:"noopener noreferrer","aria-label":$,title:$,children:e.jsx($e,{size:20})}),e.jsx("a",{className:"bs-circ w",href:te,target:"_blank",rel:"noopener noreferrer","aria-label":T,title:T,children:e.jsx("svg",{className:"w-[22px] h-[22px] fill-current",viewBox:"0 0 24 24","aria-hidden":"true",children:e.jsx("path",{d:"M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.983zm11.455-7.394c-.068-.113-.25-.181-.524-.318-.274-.137-1.62-.8-1.871-.891-.25-.092-.432-.137-.614.137-.182.274-.707.891-.866 1.073-.16.182-.319.205-.593.068-.274-.137-1.157-.426-2.203-1.359-.815-.726-1.365-1.623-1.524-1.897-.16-.274-.017-.422.12-.559.123-.122.274-.319.41-.478.137-.16.182-.274.274-.457.091-.182.046-.342-.023-.478-.068-.137-.614-1.482-.841-2.031-.222-.535-.447-.462-.614-.471l-.524-.01c-.182 0-.478.068-.729.342-.25.274-.956.935-.956 2.28 0 1.345.979 2.645 1.116 2.828.137.182 1.928 2.943 4.671 4.128 2.743 1.185 2.743.79 3.245.744.502-.046 1.62-.662 1.848-1.3.228-.639.228-1.186.16-1.301z"})})}),e.jsxs(x,{href:le,className:"bs-book",children:[e.jsx(I,{size:20}),e.jsx("span",{children:re})]})]}),e.jsxs("ul",{className:"bs-list",children:[e.jsxs("li",{children:[e.jsx(R,{size:22,className:"bs-lead"}),e.jsxs("div",{className:"bs-grow",children:[e.jsx("div",{className:"bs-lbl",children:"Location"}),e.jsx("div",{className:"bs-addr",children:ie}),D&&e.jsx("div",{className:"bs-sub",children:D})]})]}),M&&e.jsxs("li",{children:[e.jsx(De,{size:22,className:"bs-lead"}),e.jsxs("div",{className:"bs-grow",children:[e.jsx("div",{className:"bs-lbl",children:"Landmark"}),e.jsx("div",{className:"bs-addr",children:M})]})]}),e.jsxs("li",{children:[e.jsx(G,{size:22,className:"bs-lead"}),e.jsxs("div",{className:"bs-grow",children:[e.jsx("div",{className:"bs-lbl",children:"Opening hours"}),e.jsx("div",{className:"bs-sub",children:L}),e.jsx("div",{className:"bs-shifts",children:be.map((s,a)=>e.jsxs("span",{className:"bs-shift",children:[e.jsx("em",{children:ge(s.openMinutes)}),e.jsxs("strong",{children:[s.displayStart," – ",s.displayEnd]})]},`${s.openMinutes}-${a}`))})]})]})]})]})]}),e.jsxs("div",{className:"w-full flex flex-col gap-6 mt-6",children:[e.jsxs("div",{className:"bg-white rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm border border-slate-100 mb-4 relative group",children:[e.jsxs("div",{className:"flex justify-between items-center mb-4",children:[e.jsxs("div",{className:"flex items-center gap-2.5",children:[e.jsx(Te,{size:22,className:"text-[#8B1538]"}),e.jsx("h2",{className:"text-xl font-bold text-slate-800",children:"Specialist Doctors"})]}),e.jsx(x,{href:"/doctors",className:"text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline inline-flex items-center gap-1 whitespace-nowrap",children:"View All →"})]}),e.jsx("div",{className:"flex gap-3 overflow-x-auto no-scrollbar pb-2 pt-1 scroll-smooth snap-x",children:V.map(s=>e.jsxs("div",{className:"w-[205px] min-w-[205px] max-w-[205px] sm:w-[225px] sm:min-w-[225px] sm:max-w-[225px] border-[1.5px] rounded-2xl p-3 flex flex-col relative shrink-0 bg-white shadow-2xs hover:shadow-md transition-shadow snap-start",style:{borderColor:C},children:[e.jsx("div",{className:"relative w-full h-[130px] sm:h-[145px] rounded-xl overflow-hidden mb-2.5 bg-slate-100",children:e.jsx("img",{src:s.img||"https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400",alt:s.name,className:"w-full h-full object-cover object-[center_20%]"})}),e.jsx("h3",{className:"text-[14.5px] sm:text-[15.5px] font-bold text-teal-700 text-center tracking-tight leading-snug line-clamp-1",title:s.name,children:s.name}),e.jsx("p",{className:"text-[11.5px] font-bold text-[#800038] mt-1 text-center line-clamp-1",children:s.designation||"Dental Specialist"}),s.deg&&e.jsx("p",{className:"text-[10px] text-slate-500 mt-0.5 text-center line-clamp-1",title:s.deg,children:s.deg.split(",")[0].trim()}),e.jsxs("div",{className:"w-full flex items-center justify-center gap-1.5 text-[10.5px] font-semibold text-slate-600 my-2.5 bg-slate-50 py-1.5 px-2 rounded-lg border border-slate-100",children:[e.jsx(G,{size:11,className:"text-slate-400 shrink-0"}),e.jsx("span",{className:"truncate",children:s.visiting_time||"4.00 PM - 9.00 PM"})]}),e.jsxs("div",{className:"flex gap-2 mt-auto w-full pt-1",children:[e.jsx(x,{href:`/doctors/${s.id}`,className:"flex-1 py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-bold rounded-lg transition-colors flex items-center justify-center shadow-2xs text-center",children:e.jsx("span",{children:"Profile"})}),e.jsx(x,{href:"/appointment",className:"flex-1 py-1.5 px-2 text-white text-[11px] font-bold rounded-lg transition-opacity hover:opacity-95 flex items-center justify-center shadow-2xs text-center",style:{backgroundColor:C},children:e.jsx("span",{children:"Book"})})]})]},s.id))})]}),e.jsxs("div",{className:"bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 mb-4 relative transition-all duration-500",children:[e.jsxs("div",{className:"flex justify-between items-center mb-6",children:[e.jsxs("div",{className:"flex items-center gap-2.5 min-w-0",children:[e.jsx(Me,{size:22,className:"text-[#8B1538] shrink-0"}),e.jsx("h2",{className:"text-lg sm:text-xl font-bold text-slate-800 whitespace-nowrap",children:"Services & Pricing"})]}),e.jsx("div",{className:"flex items-center gap-3",children:f&&e.jsx("button",{type:"button",onClick:()=>z(!1),className:"p-1.5 text-primary-maroon hover:bg-rose-50 rounded-lg transition-colors cursor-pointer",title:"Collapse list","aria-label":"Collapse services list",children:e.jsx(Pe,{size:20,className:"stroke-[2.5]"})})})]}),e.jsxs("div",{className:"flex flex-col relative",children:[ce.map((s,a)=>e.jsxs(x,{href:`/service/${s.slug||s.id}`,className:"flex items-center justify-between p-3.5 mb-3 border border-slate-100 rounded-2xl bg-white shadow-sm hover:shadow-md hover:border-slate-200 hover:-translate-y-0.5 transition-all group cursor-pointer",children:[e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx("div",{className:"w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0",children:e.jsx("img",{src:s.image||"https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=100&h=100&fit=crop",className:"w-full h-full object-cover",alt:s.title||s.name||"Treatment"})}),e.jsx("div",{children:e.jsx("h3",{className:"text-[15px] font-semibold text-slate-800 group-hover:text-[#8B1538] transition-colors",children:(s.title||s.name||"Treatment").split(/[-–—:]/)[0].trim()})})]}),e.jsx("div",{className:"text-right pl-2 shrink-0",children:e.jsxs("span",{className:"inline-block bg-[#fdf2f5] text-[#8B1538] text-sm font-bold px-3 py-1.5 rounded-xl whitespace-nowrap",children:["৳ ",String(s.price||"1,500").replace(/^[৳\sBDTtk.]+/i,"").trim()]})})]},s.id||a)),w.length>3&&e.jsxs("div",{className:"mt-2 space-y-2",children:[!f&&e.jsxs("button",{type:"button",onClick:()=>z(!0),className:"w-full py-2.5 rounded-xl border border-slate-200 text-primary-maroon font-bold text-xs hover:bg-rose-50/50 transition-colors flex justify-center items-center gap-1.5 cursor-pointer shadow-2xs",children:[e.jsx("span",{children:"See more"}),e.jsx(O,{size:14})]}),f&&e.jsxs(x,{href:"/services",className:"group w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-[#800038]/5 via-[#800038]/10 to-[#800038]/5 hover:from-[#800038] hover:via-[#800038] hover:to-[#a01246] border border-[#800038]/20 hover:border-[#800038] text-[#800038] hover:text-white font-extrabold text-[0.84rem] shadow-xs hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]",children:[e.jsx("span",{children:"View All Services"}),e.jsx(Le,{className:"w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"})]})]})]})]}),e.jsxs("div",{className:"bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-slate-100 mb-4",children:[e.jsxs("div",{className:"flex items-center gap-3.5 sm:gap-4",children:[e.jsx("div",{className:"w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[#fff7ed] flex items-center justify-center shrink-0 border border-amber-100/80 shadow-2xs",children:e.jsx(H,{size:26,className:"text-[#f97316] fill-[#f97316]"})}),e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none",children:"4.9"}),e.jsx("div",{className:"flex text-[#f97316] gap-0.5",children:[1,2,3,4,5].map(s=>e.jsx(H,{size:15,fill:"#f97316",color:"#f97316"},s))})]}),e.jsxs("div",{className:"flex items-center gap-1.5 mt-1",children:[e.jsx("span",{className:"text-[12.5px] sm:text-[13.5px] font-semibold text-slate-600",children:"2,500+ Verified Patient Reviews"}),e.jsx("svg",{className:"w-4 h-4 text-[#1d9bf0] fill-[#1d9bf0] shrink-0",viewBox:"0 0 24 24",children:e.jsx("path",{d:"M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm3.707 7.293a1 1 0 0 0-1.414 0L10.5 13.086l-1.793-1.793a1 1 0 0 0-1.414 1.414l2.5 2.5a1 1 0 0 0 1.414 0l4.5-4.5a1 1 0 0 0 0-1.414z"})})]})]})]}),e.jsx("div",{className:"bg-[#f8fafc] rounded-2xl p-4 sm:p-5 my-4 border-l-4 border-[#d62858]",children:e.jsxs("p",{className:"italic text-slate-700 text-[13.5px] sm:text-[14.5px] leading-relaxed",children:['"',t?.reviews_text||"Extremely gentle and painless treatment! The doctors explained every procedure clearly, and the clinic environment was spotless and reassuring.",'"']})}),e.jsxs("a",{href:t?.review_url||t?.map_url||"https://maps.google.com",target:"_blank",rel:"noopener noreferrer",className:"w-full py-3.5 px-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2.5 shadow-2xs group cursor-pointer",children:[e.jsxs("svg",{className:"w-5 h-5 shrink-0",viewBox:"0 0 24 24",children:[e.jsx("path",{fill:"#4285F4",d:"M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"}),e.jsx("path",{fill:"#34A853",d:"M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"}),e.jsx("path",{fill:"#FBBC05",d:"M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"}),e.jsx("path",{fill:"#EA4335",d:"M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"})]}),e.jsx("span",{className:"text-slate-800 font-bold text-sm sm:text-[15px] group-hover:text-slate-900",children:"See All Google Reviews"})]})]}),e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsxs(x,{href:t.booking_url||"/appointment",className:"w-full py-4 rounded-2xl text-white font-bold shadow-lg shadow-[#8B1538]/20 hover:opacity-95 transition-all flex justify-center items-center gap-2 text-base sm:text-lg text-center cursor-pointer active:scale-98",style:{backgroundColor:C},children:[e.jsx(I,{size:20}),e.jsx("span",{children:t.appointment_btn_label||"Book Now"})]}),e.jsxs("div",{className:"w-full border border-slate-200 bg-white rounded-2xl overflow-hidden shadow-sm",children:[e.jsx("h2",{className:"m-0",children:e.jsxs("button",{type:"button",onClick:()=>Q(!j),className:"w-full py-4 px-5 sm:px-6 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm sm:text-base transition-all flex items-center justify-between text-left cursor-pointer active:scale-[0.99]",children:[e.jsx("span",{className:"text-left font-bold text-slate-800 text-sm sm:text-base",children:t.more_about_title||`More About ${(t.short_name||t.name||"").replace(/\s*branch\s*$/i,"").trim()}`}),e.jsx(O,{size:20,className:`text-slate-500 transition-transform duration-300 shrink-0 ${j?"rotate-180 text-rose-700":""}`})]})}),j&&e.jsxs("div",{className:"px-5 pb-6 border-t border-slate-100 animate-fade-in space-y-4",children:[t.seo_content?e.jsx("div",{className:"rich-content-view wp-editor-content prose prose-slate max-w-none text-slate-700 leading-relaxed mt-4",dangerouslySetInnerHTML:{__html:t.seo_content}}):e.jsxs("div",{className:"text-sm text-slate-600 mt-4 space-y-3 leading-relaxed",children:[e.jsxs("h3",{className:"text-base font-bold text-slate-800 mb-1",children:["Premier Digital Dentistry & Comprehensive Oral Care in ",i]}),e.jsxs("p",{children:["Welcome to ",e.jsxs("strong",{children:["Tech Dental (",i,")"]}),", your trusted destination for comprehensive, high-precision dental treatments in Dhaka. Conveniently situated with state-of-the-art dental chairs, German autoclaves, and certified specialists."]}),e.jsx("p",{children:"Our treatments include single-visit Rotary Root Canal, laser teeth whitening, aesthetic veneers, and durable dental implants adhering strictly to European sterilization protocols."})]}),h.length>0&&e.jsxs("div",{className:"pt-4 border-t border-slate-100 space-y-3",children:[e.jsxs("h4",{className:"text-sm font-bold text-slate-800",children:["Frequently Asked Questions (",b," Clinic)"]}),e.jsx("div",{className:"space-y-2",children:h.filter(s=>s&&s.q).map((s,a)=>e.jsxs("div",{className:"p-3 bg-slate-50/80 rounded-xl border border-slate-200/80",children:[e.jsxs("div",{className:"font-bold text-xs text-slate-900 mb-1",children:["Q: ",s.q]}),e.jsx("div",{className:"text-xs text-slate-600 leading-relaxed",children:s.a})]},a))})]})]})]})]})]})]}),m&&e.jsxs("div",{className:"fixed inset-0 z-50 bg-black/95 text-white flex flex-col md:flex-row overflow-hidden animate-in fade-in duration-200 select-none",children:[e.jsxs("div",{className:"hidden md:flex flex-col w-[320px] lg:w-[360px] bg-neutral-950 border-r border-neutral-800 shrink-0 h-full",children:[e.jsx("div",{className:"p-4 border-b border-neutral-800 flex items-center justify-between",children:e.jsxs("div",{children:[e.jsxs("h3",{className:"text-sm font-extrabold text-white tracking-wide",children:[i," Photos"]}),e.jsxs("p",{className:"text-[0.68rem] text-neutral-400",children:["Tech Dental Care • ",l.length," photos"]})]})}),e.jsx("div",{className:"flex-1 overflow-y-auto p-3 grid grid-cols-2 gap-2.5 custom-scrollbar",children:l.map((s,a)=>e.jsxs("button",{type:"button",onClick:()=>d(a),className:`relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer group bg-neutral-900 ${a===n?"border-sky-500 ring-2 ring-sky-500/50 scale-[0.98]":"border-transparent opacity-65 hover:opacity-100 hover:scale-[1.02]"}`,children:[e.jsx("img",{src:s,alt:`${i} thumbnail ${a+1}`,className:"w-full h-full object-cover"}),a===n&&e.jsx("div",{className:"absolute inset-0 bg-sky-500/10 pointer-events-none"})]},a))})]}),e.jsxs("div",{className:"flex-1 flex flex-col h-full bg-black relative min-w-0",children:[e.jsxs("div",{className:"p-3 md:p-4 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between z-20 shrink-0",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("div",{className:"w-8 h-8 rounded-full bg-rose-900/80 border border-rose-500/40 flex items-center justify-center text-rose-300 font-extrabold text-xs",children:"TD"}),e.jsxs("div",{children:[e.jsx("h4",{className:"text-xs md:text-sm font-extrabold text-white leading-tight",children:"Tech Dental Care"}),e.jsxs("p",{className:"text-[0.65rem] md:text-[0.7rem] text-neutral-400",children:[i," • Dhaka"]})]})]}),e.jsx("button",{type:"button",onClick:()=>y(!1),className:"w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer border border-white/10","aria-label":"Close modal",children:e.jsx(Fe,{className:"w-5 h-5"})})]}),e.jsxs("div",{className:"h-[42vh] md:h-auto md:flex-1 relative flex items-center justify-center p-2 md:p-6 bg-black shrink-0",children:[e.jsx("button",{type:"button",onClick:s=>{s.stopPropagation(),d(a=>a>0?a-1:l.length-1)},className:"absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-11 md:h-11 flex items-center justify-center rounded-full bg-black/60 hover:bg-black/85 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-xl","aria-label":"Previous photo",children:e.jsx(U,{className:"w-5 h-5 md:w-6 md:h-6 stroke-[2.5]"})}),e.jsx("img",{src:l[n]||l[0]||"",alt:`${i} photo ${n+1}`,className:"max-h-full max-w-full object-contain rounded-lg shadow-2xl transition-all duration-300"}),e.jsx("button",{type:"button",onClick:s=>{s.stopPropagation(),d(a=>a<l.length-1?a+1:0)},className:"absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-11 md:h-11 flex items-center justify-center rounded-full bg-black/60 hover:bg-black/85 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-xl","aria-label":"Next photo",children:e.jsx(q,{className:"w-5 h-5 md:w-6 md:h-6 stroke-[2.5]"})})]}),e.jsxs("div",{className:"hidden md:flex p-3 md:p-4 bg-neutral-950/80 border-t border-neutral-800 text-[0.68rem] md:text-xs text-neutral-400 items-center justify-between gap-2 shrink-0",children:[e.jsxs("div",{className:"flex items-center gap-1.5",children:[e.jsx(Oe,{className:"w-3.5 h-3.5 text-neutral-500"}),e.jsx("span",{children:"Images may be subject to copyright • Tech Dental Care"})]}),e.jsxs("div",{className:"flex items-center gap-2 font-mono text-[0.68rem] text-neutral-400",children:[e.jsx(R,{className:"w-3.5 h-3.5 text-rose-400"}),e.jsx("span",{children:t?.address||`${i}, Dhaka`})]})]}),e.jsxs("div",{className:"md:hidden flex-1 min-h-0 bg-neutral-950 border-t border-neutral-800 flex flex-col overflow-hidden",children:[e.jsxs("div",{className:"px-3 pt-2.5 pb-1.5 text-[0.68rem] text-neutral-400 font-bold flex items-center justify-between uppercase tracking-wider shrink-0 border-b border-neutral-900",children:[e.jsxs("span",{children:["ALL PHOTOS (",n+1,"/",l.length,")"]}),e.jsx("span",{className:"text-[0.62rem] text-neutral-500 font-normal",children:"TAP TO VIEW"})]}),e.jsx("div",{className:"flex-1 overflow-y-auto p-2.5 grid grid-cols-3 gap-2 custom-scrollbar",children:l.map((s,a)=>e.jsxs("button",{type:"button",onClick:()=>d(a),className:`relative aspect-square w-full rounded-xl overflow-hidden border-2 transition-all cursor-pointer bg-neutral-900 group ${a===n?"border-sky-500 ring-2 ring-sky-500/60 scale-[0.97]":"border-transparent opacity-65 hover:opacity-100 hover:scale-[1.02]"}`,children:[e.jsx("img",{src:s,alt:`Thumbnail ${a+1}`,className:"w-full h-full object-cover",loading:"lazy"}),a===n&&e.jsx("div",{className:"absolute inset-0 bg-sky-500/15 pointer-events-none"})]},a))})]})]})]}),e.jsx(ke,{hideCtaStrip:!0})]})}export{ds as default};
