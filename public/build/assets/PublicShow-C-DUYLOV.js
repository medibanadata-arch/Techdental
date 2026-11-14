import{r as i,G as Ne,c as ke,j as e,L as n}from"./app-otzOJTLB.js";import{S as Se,T as Ce}from"./Seo-DPT9xAOD.js";import{G as Be}from"./GlobalFooter-DFR4Oo_B.js";import{g as _e,p as ze}from"./branchStatus-CAPs6KJi.js";import{b as Ae,c as $e,W as Te}from"./contact-DE9Ni57G.js";import{c as De,C as Ee}from"./chevron-down-CZz_TBhp.js";import{C as G}from"./chevron-right-B7zNY7fB.js";import{P as Me}from"./phone-YMUK9AKU.js";import{S as Le,U as Pe}from"./user-DEKvJhF4.js";import{C as H}from"./calendar-check-oV7VdtsY.js";import{M as U}from"./menu-h5YgBhw4.js";import{B as Fe}from"./building-complex-CM4pvysk.js";import{C as V}from"./clock-M_FyZE4W.js";import{S as X}from"./star-CJmHn0s_.js";import{X as qe}from"./x-BsOo0aXS.js";import{I as Oe}from"./info-HldP3D_K.js";import"./sparkles-C6BenSug.js";import"./arrow-right-6KIcXlHx.js";import"./mail-DXk1Df4m.js";const J={name:"chevron-left",size:24,node:[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]]};J.node;const Y=De(J),$="#8B1538",Ie=["https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1200","https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=1200","https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=1200","https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?auto=format&fit=crop&q=80&w=1200"];function ds({branch:t,gallery:j=[],doctors:Q=[],services:d=[],locations:T=[],nav_menu:K}){const[Z,ee]=i.useState(t?.short_name?.toLowerCase()||"mirpur"),se=({className:s=""})=>e.jsx("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:1.7,strokeLinecap:"round",strokeLinejoin:"round",className:s,"aria-hidden":"true",children:e.jsx("path",{d:"M12 5.5c-1.5-1.5-3-2.5-4.5-2.5-2.5 0-4 2-4 4.5 0 3 1.5 5 2.5 7.5.6 1.5 1 3 1.5 4.5.3 1 .8 1.5 1.5 1.5 1 0 1.5-1 2-3 .3-1.3.8-2.5 1.5-2.5s1.2 1.2 1.5 2.5c.5 2 1 3 2 3 .7 0 1.2-.5 1.5-1.5.5-1.5.9-3 1.5-4.5 1-2.5 2.5-4.5 2.5-7.5 0-2.5-1.5-4.5-4-4.5-1.5 0-3 1-4.5 2.5Z"})}),p=s=>String(s&&(s.title||s.name)||"Dental Treatment").split(/[-–—:]/)[0].trim(),v=s=>s&&s.image||"https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=600&q=80",y=s=>{const a=String(s&&s.price||"").trim();return a?a.startsWith("৳")?a:`৳ ${a.replace(/^[৳\sBDTtk.]+/i,"").trim()}`:"৳ 1,500"},N=s=>`/service/${s&&(s.slug||s.id)||""}`,[k,te]=i.useState(!1),D=new Set,E=(Array.isArray(j)?j:[]).filter(s=>{const a=typeof s=="string"?s:s?.src||s?.image||s?.url||"",r=String(a).trim().replace(/^https?:\/\/[^/]+/i,"").replace(/\/+$/,"").toLowerCase();return!r||D.has(r)?!1:(D.add(r),!0)}).map(s=>typeof s=="string"?s:s?.src||s?.image||s?.url||"").filter(Boolean),l=E.length>0?E:Ie,[S,f]=i.useState(0),g=i.useRef(null),ae=()=>{f(s=>s>0?s-1:l.length-1)},re=()=>{f(s=>s<l.length-1?s+1:0)},le=s=>{g.current=s.touches[0].clientX},ie=s=>{if(g.current===null)return;const a=s.changedTouches[0].clientX-g.current;Math.abs(a)>40&&(a<0?f(r=>r<l.length-1?r+1:0):f(r=>r>0?r-1:l.length-1)),g.current=null},[u,C]=i.useState(!1),[c,x]=i.useState(0);i.useEffect(()=>{if(!u)return;const s=a=>{a.key==="ArrowLeft"?x(r=>r>0?r-1:l.length-1):a.key==="ArrowRight"?x(r=>r<l.length-1?r+1:0):a.key==="Escape"&&C(!1)};return window.addEventListener("keydown",s),()=>window.removeEventListener("keydown",s)},[u,l.length]),i.useRef(null);const w=(t?.short_name||t?.name||"Mirpur").replace(/branch/gi,"").trim(),o=`${w} Branch`,B=t?.phone||Ae,oe=$e(t?.whatsapp||Te),ne=t?.map_url||`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(t?.address||"")}`,M=t?.call_label||"Call",L=t?.directions_label||"Directions",P=t?.whatsapp_label||"WhatsApp",F=t?.book_label||"Book",de=t?.booking_url||"/appointment",m=Ne.useMemo(()=>_e({shortName:t?.short_name||t?.name,time:[t?.morning_hours,t?.evening_hours].filter(Boolean).join(" | ")||t?.hours_text||t?.time}),[t]),ce=t?.address_main||(t?.address?t.address.split("(")[0].trim():`${w}, Dhaka`),q=t?.address_sub||(t?.address_main,""),O=t?.landmark||(t?.address&&t.address.includes("(")?t.address.substring(t.address.indexOf("(")+1).replace(")","").trim():""),I=s=>s?s.replace(/:00\b/g,""):"",xe=I(t?.morning_hours),me=I(t?.evening_hours||t?.hours_text||t?.time||"4 PM – 9 PM"),R=t?.working_days||"Saturday – Thursday";R.replace(/Saturday/gi,"Sat").replace(/Thursday/gi,"Thu").replace(/Wednesday/gi,"Wed").replace(/Tuesday/gi,"Tue").replace(/Monday/gi,"Mon").replace(/Sunday/gi,"Sun"),t?.off_days;const pe=s=>{x(s),C(!0)},_=i.useMemo(()=>Array.isArray(d)?d.slice(0,4):[],[d]),h=i.useMemo(()=>Array.isArray(d)?d[4]||d[0]:null,[d]),he=ke(),fe=String(he.props?.site_url||"https://techdentalcare.com").replace(/\/+$/,""),ue=`/branch/${t?.slug||t?.id}`,z=`${fe}${ue}`,be=t?.seo_title||`Best Dental Clinic in ${o} — Tech Dental Care`,A=t?.meta_desc||`Visit Tech Dental ${o} in Dhaka for painless root canal therapy, dental implants, cosmetic veneers and general dental treatments.`,ge=`${t?.robots_index!==!1?"index":"noindex"}, ${t?.robots_follow!==!1?"follow":"nofollow"}`,b=i.useMemo(()=>{if(!t?.faqs)return[];if(Array.isArray(t.faqs))return t.faqs;try{const s=typeof t.faqs=="string"?JSON.parse(t.faqs):t.faqs;return Array.isArray(s)?s:[]}catch{return[]}},[t?.faqs]),we=i.useMemo(()=>{if(t?.schema_json)try{return JSON.parse(t.schema_json)}catch{}const a={"@context":"https://schema.org","@type":t?.schema_type||"Dentist",name:`Tech Dental Care — ${o}`,description:A,url:z,telephone:B,address:{"@type":"PostalAddress",streetAddress:t?.address||"",addressLocality:"Dhaka",addressCountry:"BD"},priceRange:"৳৳"};return b.length>0?{"@context":"https://schema.org","@graph":[a,{"@type":"FAQPage",mainEntity:b.filter(r=>r&&r.q).map(r=>({"@type":"Question",name:r.q,acceptedAnswer:{"@type":"Answer",text:r.a||""}}))}]}:a},[t,z,A,o,B,b]),W=[xe,me].filter(Boolean).join(" | ")||t?.hours_text||t?.time||"",{shifts:je}=i.useMemo(()=>ze(W,t?.short_name||t?.name||""),[W,t]),ve=s=>s<720?"Morning":s<960?"Afternoon":"Evening",ye=m.isOpenNow?`Open now · ${m.subText||"closes 9 PM"}`:m.isOpenSoon?`Opening soon · ${m.subText||"opens 3 PM"}`:m.isFriday?"Closed today · opens Saturday":`Closed · ${m.subText||"opens 3 PM"}`;return i.useEffect(()=>{if(u||l.length<2||typeof window<"u"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;const s=window.setInterval(()=>{f(a=>(a+1)%l.length)},4500);return()=>window.clearInterval(s)},[u,l.length]),e.jsxs("div",{className:"min-h-screen antialiased w-full",style:{backgroundColor:"#F8F9FA",color:"#1E293B",fontFamily:"'Inter', 'Plus Jakarta Sans', 'SolaimanLipi', 'Noto Sans Bengali', sans-serif"},children:[e.jsx(Se,{title:be,description:A,canonical:z,type:"website",robots:ge,image:t?.image,schema:we,noSuffix:!0}),e.jsx(Ce,{locations:T.length?T:[t],selectedBranch:Z,onBranchChange:ee,navMenu:K}),e.jsxs("main",{className:"w-full px-3.5 sm:px-6 md:px-8 lg:px-12 xl:px-16 mt-4 sm:mt-6 pb-6 sm:pb-8",children:[e.jsx("style",{children:`
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
            justify-content: space-between;
            align-items: center;
            gap: 10px;
            margin: 20px auto 0;
            width: 100%;
            max-width: 340px;
          }
          .bs-circ {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: #fff;
            display: grid;
            place-items: center;
            flex: none;
            color: #1B1620;
            border: 1px solid rgba(27, 22, 32, .06);
            box-shadow: 0 2px 8px rgba(27, 22, 32, .08);
            transition: transform .15s, box-shadow .15s, background .15s;
          }
          .bs-circ:hover {
            background: #FCFAFB;
            box-shadow: 0 4px 12px rgba(27, 22, 32, .14);
            transform: translateY(-1px);
          }
          .bs-circ.w {
            color: #12703C;
          }
          .bs-circ.w:hover {
            background: #F4FBF6;
          }
          .bs-book {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: #fff;
            color: #8A1538;
            display: grid;
            place-items: center;
            flex: none;
            border: 1px solid rgba(138, 21, 56, .10);
            box-shadow: 0 2px 8px rgba(27, 22, 32, .08);
            transition: transform .15s, box-shadow .15s, background .15s;
          }
          .bs-book:hover {
            background: #FDF7F9;
            box-shadow: 0 4px 12px rgba(27, 22, 32, .14);
            transform: translateY(-1px);
          }
          .bs-circ:active,
          .bs-book:active {
            transform: scale(.94);
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
              margin-left: 0;
              margin-right: 0;
              max-width: 360px;
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
            .bs-acts { gap: 8px; max-width: 320px; }
            .bs-circ, .bs-book { width: 46px; height: 46px; }
            .bs-shift { padding: 5px 9px; }
            .bs-shift strong { font-size: 13px; }
          }
        `}),e.jsxs("section",{className:"bs-page","aria-label":`${o} photos and details`,children:[e.jsxs("div",{className:"bs-arch",children:[e.jsx("div",{className:"bs-track",style:{transform:`translateX(-${S*100}%)`},onTouchStart:le,onTouchEnd:ie,children:l.map((s,a)=>e.jsx("button",{type:"button",className:"bs-slide",onClick:()=>pe(a),"aria-label":`Open photo ${a+1} of ${l.length}`,tabIndex:a===S?0:-1,children:e.jsx("img",{src:s,alt:j[a]?.alt||`${o} photo ${a+1}`,loading:a===0?"eager":"lazy"})},`${s}-${a}`))}),e.jsx("button",{type:"button",className:"bs-nav p",onClick:ae,"aria-label":"Previous photo",children:e.jsx(Y,{size:20})}),e.jsx("button",{type:"button",className:"bs-nav n",onClick:re,"aria-label":"Next photo",children:e.jsx(G,{size:20})}),e.jsx("div",{className:"bs-dots","aria-hidden":"true",children:l.map((s,a)=>e.jsx("i",{className:a===S?"on":""},a))})]}),e.jsxs("section",{className:"bs-info","aria-label":"Branch address and opening hours",children:[e.jsxs("span",{className:`bs-status ${m.isOpenNow?"":"closed"}`,children:[e.jsx("i",{}),e.jsx("span",{children:ye})]}),e.jsx("h1",{className:"bs-h1",children:t?.short_name||t?.name||`${w} Branch`}),e.jsxs("div",{className:"bs-acts",children:[e.jsx("a",{className:"bs-circ",href:`tel:${B}`,"aria-label":M,title:M,children:e.jsx(Me,{size:21,strokeWidth:2})}),e.jsx("a",{className:"bs-circ",href:ne,target:"_blank",rel:"noopener noreferrer","aria-label":L,title:L,children:e.jsx(Le,{size:21,strokeWidth:2})}),e.jsx("a",{className:"bs-circ w",href:oe,target:"_blank",rel:"noopener noreferrer","aria-label":P,title:P,children:e.jsx("svg",{className:"w-[24px] h-[24px] fill-current",viewBox:"0 0 24 24","aria-hidden":"true",children:e.jsx("path",{d:"M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.983zm11.455-7.394c-.068-.113-.25-.181-.524-.318-.274-.137-1.62-.8-1.871-.891-.25-.092-.432-.137-.614.137-.182.274-.707.891-.866 1.073-.16.182-.319.205-.593.068-.274-.137-1.157-.426-2.203-1.359-.815-.726-1.365-1.623-1.524-1.897-.16-.274-.017-.422.12-.559.123-.122.274-.319.41-.478.137-.16.182-.274.274-.457.091-.182.046-.342-.023-.478-.068-.137-.614-1.482-.841-2.031-.222-.535-.447-.462-.614-.471l-.524-.01c-.182 0-.478.068-.729.342-.25.274-.956.935-.956 2.28 0 1.345.979 2.645 1.116 2.828.137.182 1.928 2.943 4.671 4.128 2.743 1.185 2.743.79 3.245.744.502-.046 1.62-.662 1.848-1.3.228-.639.228-1.186.16-1.301z"})})}),e.jsx(n,{href:de,className:"bs-book","aria-label":F,title:F,children:e.jsx(H,{size:21,strokeWidth:2})})]}),e.jsxs("ul",{className:"bs-list",children:[e.jsxs("li",{children:[e.jsx(U,{size:22,className:"bs-lead"}),e.jsxs("div",{className:"bs-grow",children:[e.jsx("div",{className:"bs-lbl",children:"Location"}),e.jsx("div",{className:"bs-addr",children:ce}),q&&e.jsx("div",{className:"bs-sub",children:q})]})]}),O&&e.jsxs("li",{children:[e.jsx(Fe,{size:22,className:"bs-lead"}),e.jsxs("div",{className:"bs-grow",children:[e.jsx("div",{className:"bs-lbl",children:"Landmark"}),e.jsx("div",{className:"bs-addr",children:O})]})]}),e.jsxs("li",{children:[e.jsx(V,{size:22,className:"bs-lead"}),e.jsxs("div",{className:"bs-grow",children:[e.jsx("div",{className:"bs-lbl",children:"Opening hours"}),e.jsx("div",{className:"bs-sub",children:R}),e.jsx("div",{className:"bs-shifts",children:je.map((s,a)=>e.jsxs("span",{className:"bs-shift",children:[e.jsx("em",{children:ve(s.openMinutes)}),e.jsxs("strong",{children:[s.displayStart," – ",s.displayEnd]})]},`${s.openMinutes}-${a}`))})]})]})]})]})]}),e.jsxs("div",{className:"w-full flex flex-col gap-6 mt-6",children:[e.jsxs("div",{className:"bg-white rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm border border-slate-100 mb-4 relative group",children:[e.jsxs("div",{className:"flex justify-between items-center mb-4",children:[e.jsxs("div",{className:"flex items-center gap-2.5",children:[e.jsx(Pe,{size:22,className:"text-[#8B1538]"}),e.jsx("h2",{className:"text-xl font-bold text-slate-800",children:"Specialist Doctors"})]}),e.jsx(n,{href:"/doctors",className:"text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline inline-flex items-center gap-1 whitespace-nowrap",children:"View All →"})]}),e.jsx("div",{className:"flex gap-3 overflow-x-auto no-scrollbar pb-2 pt-1 scroll-smooth snap-x",children:Q.map(s=>e.jsxs("div",{className:"w-[205px] min-w-[205px] max-w-[205px] sm:w-[225px] sm:min-w-[225px] sm:max-w-[225px] border-[1.5px] rounded-2xl p-3 flex flex-col relative shrink-0 bg-white shadow-2xs hover:shadow-md transition-shadow snap-start",style:{borderColor:$},children:[e.jsx("div",{className:"relative w-full h-[130px] sm:h-[145px] rounded-xl overflow-hidden mb-2.5 bg-slate-100",children:e.jsx("img",{src:s.img||"https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400",alt:s.name,className:"w-full h-full object-cover object-[center_20%]"})}),e.jsx("h3",{className:"text-[14.5px] sm:text-[15.5px] font-bold text-teal-700 text-center tracking-tight leading-snug line-clamp-1",title:s.name,children:s.name}),e.jsx("p",{className:"text-[11.5px] font-bold text-[#800038] mt-1 text-center line-clamp-1",children:s.designation||"Dental Specialist"}),s.deg&&e.jsx("p",{className:"text-[10px] text-slate-500 mt-0.5 text-center line-clamp-1",title:s.deg,children:s.deg.split(",")[0].trim()}),e.jsxs("div",{className:"w-full flex items-center justify-center gap-1.5 text-[10.5px] font-semibold text-slate-600 my-2.5 bg-slate-50 py-1.5 px-2 rounded-lg border border-slate-100",children:[e.jsx(V,{size:11,className:"text-slate-400 shrink-0"}),e.jsx("span",{className:"truncate",children:s.visiting_time||"4.00 PM - 9.00 PM"})]}),e.jsxs("div",{className:"flex gap-2 mt-auto w-full pt-1",children:[e.jsx(n,{href:`/doctors/${s.id}`,className:"flex-1 py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-bold rounded-lg transition-colors flex items-center justify-center shadow-2xs text-center",children:e.jsx("span",{children:"Profile"})}),e.jsx(n,{href:"/appointment",className:"flex-1 py-1.5 px-2 text-white text-[11px] font-bold rounded-lg transition-opacity hover:opacity-95 flex items-center justify-center shadow-2xs text-center",style:{backgroundColor:$},children:e.jsx("span",{children:"Book"})})]})]},s.id))})]}),_.length>0&&e.jsxs("div",{className:"bg-white rounded-3xl p-5 sm:p-6 md:p-8 shadow-sm border border-slate-100 mb-4 relative",children:[e.jsxs("div",{className:"flex items-center gap-2.5 mb-5",children:[e.jsx(se,{className:"w-[22px] h-[22px] text-[#8B1538] shrink-0"}),e.jsx("h2",{className:"text-lg sm:text-xl font-bold text-slate-800",children:"Services & Pricing"})]}),e.jsxs("div",{className:"hidden md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] gap-5 items-stretch",children:[e.jsx("div",{className:"grid grid-rows-4 gap-2.5 min-h-0",children:_.map((s,a)=>e.jsxs(n,{href:N(s),className:"flex items-center gap-3.5 px-3 rounded-2xl border border-slate-200 bg-white text-left transition-all hover:border-[#8B1538]/40 hover:bg-[#fdf7f9] hover:shadow-sm group",children:[e.jsx("div",{className:"w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0",children:e.jsx("img",{src:v(s),className:"w-full h-full object-cover transition-transform duration-300 group-hover:scale-105",alt:p(s),loading:"lazy"})}),e.jsx("span",{className:"flex-1 min-w-0 text-[15px] font-bold text-slate-800 group-hover:text-[#8B1538] transition-colors truncate",children:p(s)}),e.jsx("span",{className:"shrink-0 bg-[#fdf2f5] text-[#8B1538] text-[13px] font-bold px-3 py-1.5 rounded-xl whitespace-nowrap",children:y(s)})]},s.id||a))}),h&&e.jsxs(n,{href:N(h),className:"flex flex-col rounded-2xl border border-slate-200 overflow-hidden bg-white group",children:[e.jsx("div",{className:"flex-1 min-h-[280px] w-full bg-slate-100 overflow-hidden",children:e.jsx("img",{src:v(h),alt:p(h),className:"w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"})}),e.jsxs("div",{className:"flex items-center justify-between gap-3 px-5 py-4",children:[e.jsxs("div",{className:"min-w-0",children:[e.jsx("div",{className:"text-lg font-bold text-slate-900 group-hover:text-[#8B1538] transition-colors truncate",children:p(h)}),e.jsx("div",{className:"text-[11px] font-semibold text-slate-500 mt-0.5",children:"View treatment details →"})]}),e.jsx("span",{className:"shrink-0 bg-[#fdf2f5] text-[#8B1538] text-sm font-bold px-3.5 py-1.5 rounded-xl whitespace-nowrap",children:y(h)})]})]})]}),e.jsx("div",{className:"grid grid-cols-2 gap-3 md:hidden",children:_.map((s,a)=>e.jsxs(n,{href:N(s),className:"min-w-0 group rounded-2xl border border-slate-200 bg-white overflow-hidden",children:[e.jsx("div",{className:"aspect-[4/3] rounded-t-2xl overflow-hidden bg-slate-100",children:e.jsx("img",{src:v(s),alt:p(s),className:"w-full h-full object-cover transition-transform duration-300 group-active:scale-105",loading:"lazy"})}),e.jsxs("div",{className:"p-2.5",children:[e.jsx("div",{className:"text-[12px] leading-[1.25] font-bold text-slate-800 line-clamp-2",children:p(s)}),e.jsx("div",{className:"mt-1 text-[11px] font-bold text-[#8B1538] truncate",children:y(s)})]})]},s.id||a))}),e.jsx(n,{href:"/services",className:"mt-4 w-full py-2.5 rounded-xl border border-slate-200 text-primary-maroon font-bold text-xs hover:bg-rose-50/50 transition-colors flex justify-center items-center cursor-pointer shadow-2xs",children:e.jsx("span",{children:"See more"})})]}),e.jsxs("div",{className:"bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-slate-100 mb-4",children:[e.jsxs("div",{className:"flex items-center gap-3.5 sm:gap-4",children:[e.jsx("div",{className:"w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[#fff7ed] flex items-center justify-center shrink-0 border border-amber-100/80 shadow-2xs",children:e.jsx(X,{size:26,className:"text-[#f97316] fill-[#f97316]"})}),e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none",children:"4.9"}),e.jsx("div",{className:"flex text-[#f97316] gap-0.5",children:[1,2,3,4,5].map(s=>e.jsx(X,{size:15,fill:"#f97316",color:"#f97316"},s))})]}),e.jsxs("div",{className:"flex items-center gap-1.5 mt-1",children:[e.jsx("span",{className:"text-[12.5px] sm:text-[13.5px] font-semibold text-slate-600",children:"2,500+ Verified Patient Reviews"}),e.jsx("svg",{className:"w-4 h-4 text-[#1d9bf0] fill-[#1d9bf0] shrink-0",viewBox:"0 0 24 24",children:e.jsx("path",{d:"M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm3.707 7.293a1 1 0 0 0-1.414 0L10.5 13.086l-1.793-1.793a1 1 0 0 0-1.414 1.414l2.5 2.5a1 1 0 0 0 1.414 0l4.5-4.5a1 1 0 0 0 0-1.414z"})})]})]})]}),e.jsx("div",{className:"bg-[#f8fafc] rounded-2xl p-4 sm:p-5 my-4 border-l-4 border-[#d62858]",children:e.jsxs("p",{className:"italic text-slate-700 text-[13.5px] sm:text-[14.5px] leading-relaxed",children:['"',t?.reviews_text||"Extremely gentle and painless treatment! The doctors explained every procedure clearly, and the clinic environment was spotless and reassuring.",'"']})}),e.jsxs("a",{href:t?.review_url||t?.map_url||"https://maps.google.com",target:"_blank",rel:"noopener noreferrer",className:"w-full py-3.5 px-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2.5 shadow-2xs group cursor-pointer",children:[e.jsxs("svg",{className:"w-5 h-5 shrink-0",viewBox:"0 0 24 24",children:[e.jsx("path",{fill:"#4285F4",d:"M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"}),e.jsx("path",{fill:"#34A853",d:"M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"}),e.jsx("path",{fill:"#FBBC05",d:"M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"}),e.jsx("path",{fill:"#EA4335",d:"M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"})]}),e.jsx("span",{className:"text-slate-800 font-bold text-sm sm:text-[15px] group-hover:text-slate-900",children:"See All Google Reviews"})]})]}),e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsxs(n,{href:t.booking_url||"/appointment",className:"w-full py-4 rounded-2xl text-white font-bold shadow-lg shadow-[#8B1538]/20 hover:opacity-95 transition-all flex justify-center items-center gap-2 text-base sm:text-lg text-center cursor-pointer active:scale-98",style:{backgroundColor:$},children:[e.jsx(H,{size:20}),e.jsx("span",{children:t.appointment_btn_label||"Book Now"})]}),e.jsxs("div",{className:"w-full border border-slate-200 bg-white rounded-2xl overflow-hidden shadow-sm",children:[e.jsx("h2",{className:"m-0",children:e.jsxs("button",{type:"button",onClick:()=>te(!k),className:"w-full py-4 px-5 sm:px-6 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm sm:text-base transition-all flex items-center justify-between text-left cursor-pointer active:scale-[0.99]",children:[e.jsx("span",{className:"text-left font-bold text-slate-800 text-sm sm:text-base",children:t.more_about_title||`More About ${(t.short_name||t.name||"").replace(/\s*branch\s*$/i,"").trim()}`}),e.jsx(Ee,{size:20,className:`text-slate-500 transition-transform duration-300 shrink-0 ${k?"rotate-180 text-rose-700":""}`})]})}),k&&e.jsxs("div",{className:"px-5 pb-6 border-t border-slate-100 animate-fade-in space-y-4",children:[t.seo_content?e.jsx("div",{className:"rich-content-view wp-editor-content prose prose-slate max-w-none text-slate-700 leading-relaxed mt-4",dangerouslySetInnerHTML:{__html:t.seo_content}}):e.jsxs("div",{className:"text-sm text-slate-600 mt-4 space-y-3 leading-relaxed",children:[e.jsxs("h3",{className:"text-base font-bold text-slate-800 mb-1",children:["Premier Digital Dentistry & Comprehensive Oral Care in ",o]}),e.jsxs("p",{children:["Welcome to ",e.jsxs("strong",{children:["Tech Dental (",o,")"]}),", your trusted destination for comprehensive, high-precision dental treatments in Dhaka. Conveniently situated with state-of-the-art dental chairs, German autoclaves, and certified specialists."]}),e.jsx("p",{children:"Our treatments include single-visit Rotary Root Canal, laser teeth whitening, aesthetic veneers, and durable dental implants adhering strictly to European sterilization protocols."})]}),b.length>0&&e.jsxs("div",{className:"pt-4 border-t border-slate-100 space-y-3",children:[e.jsxs("h4",{className:"text-sm font-bold text-slate-800",children:["Frequently Asked Questions (",w," Clinic)"]}),e.jsx("div",{className:"space-y-2",children:b.filter(s=>s&&s.q).map((s,a)=>e.jsxs("div",{className:"p-3 bg-slate-50/80 rounded-xl border border-slate-200/80",children:[e.jsxs("div",{className:"font-bold text-xs text-slate-900 mb-1",children:["Q: ",s.q]}),e.jsx("div",{className:"text-xs text-slate-600 leading-relaxed",children:s.a})]},a))})]})]})]})]})]})]}),u&&e.jsxs("div",{className:"fixed inset-0 z-50 bg-black/95 text-white flex flex-col md:flex-row overflow-hidden animate-in fade-in duration-200 select-none",children:[e.jsxs("div",{className:"hidden md:flex flex-col w-[320px] lg:w-[360px] bg-neutral-950 border-r border-neutral-800 shrink-0 h-full",children:[e.jsx("div",{className:"p-4 border-b border-neutral-800 flex items-center justify-between",children:e.jsxs("div",{children:[e.jsxs("h3",{className:"text-sm font-extrabold text-white tracking-wide",children:[o," Photos"]}),e.jsxs("p",{className:"text-[0.68rem] text-neutral-400",children:["Tech Dental Care • ",l.length," photos"]})]})}),e.jsx("div",{className:"flex-1 overflow-y-auto p-3 grid grid-cols-2 gap-2.5 custom-scrollbar",children:l.map((s,a)=>e.jsxs("button",{type:"button",onClick:()=>x(a),className:`relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer group bg-neutral-900 ${a===c?"border-sky-500 ring-2 ring-sky-500/50 scale-[0.98]":"border-transparent opacity-65 hover:opacity-100 hover:scale-[1.02]"}`,children:[e.jsx("img",{src:s,alt:`${o} thumbnail ${a+1}`,className:"w-full h-full object-cover"}),a===c&&e.jsx("div",{className:"absolute inset-0 bg-sky-500/10 pointer-events-none"})]},a))})]}),e.jsxs("div",{className:"flex-1 flex flex-col h-full bg-black relative min-w-0",children:[e.jsxs("div",{className:"p-3 md:p-4 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between z-20 shrink-0",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("div",{className:"w-8 h-8 rounded-full bg-rose-900/80 border border-rose-500/40 flex items-center justify-center text-rose-300 font-extrabold text-xs",children:"TD"}),e.jsxs("div",{children:[e.jsx("h4",{className:"text-xs md:text-sm font-extrabold text-white leading-tight",children:"Tech Dental Care"}),e.jsxs("p",{className:"text-[0.65rem] md:text-[0.7rem] text-neutral-400",children:[o," • Dhaka"]})]})]}),e.jsx("button",{type:"button",onClick:()=>C(!1),className:"w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer border border-white/10","aria-label":"Close modal",children:e.jsx(qe,{className:"w-5 h-5"})})]}),e.jsxs("div",{className:"h-[42vh] md:h-auto md:flex-1 relative flex items-center justify-center p-2 md:p-6 bg-black shrink-0",children:[e.jsx("button",{type:"button",onClick:s=>{s.stopPropagation(),x(a=>a>0?a-1:l.length-1)},className:"absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-11 md:h-11 flex items-center justify-center rounded-full bg-black/60 hover:bg-black/85 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-xl","aria-label":"Previous photo",children:e.jsx(Y,{className:"w-5 h-5 md:w-6 md:h-6 stroke-[2.5]"})}),e.jsx("img",{src:l[c]||l[0]||"",alt:`${o} photo ${c+1}`,className:"max-h-full max-w-full object-contain rounded-lg shadow-2xl transition-all duration-300"}),e.jsx("button",{type:"button",onClick:s=>{s.stopPropagation(),x(a=>a<l.length-1?a+1:0)},className:"absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-11 md:h-11 flex items-center justify-center rounded-full bg-black/60 hover:bg-black/85 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-xl","aria-label":"Next photo",children:e.jsx(G,{className:"w-5 h-5 md:w-6 md:h-6 stroke-[2.5]"})})]}),e.jsxs("div",{className:"hidden md:flex p-3 md:p-4 bg-neutral-950/80 border-t border-neutral-800 text-[0.68rem] md:text-xs text-neutral-400 items-center justify-between gap-2 shrink-0",children:[e.jsxs("div",{className:"flex items-center gap-1.5",children:[e.jsx(Oe,{className:"w-3.5 h-3.5 text-neutral-500"}),e.jsx("span",{children:"Images may be subject to copyright • Tech Dental Care"})]}),e.jsxs("div",{className:"flex items-center gap-2 font-mono text-[0.68rem] text-neutral-400",children:[e.jsx(U,{className:"w-3.5 h-3.5 text-rose-400"}),e.jsx("span",{children:t?.address||`${o}, Dhaka`})]})]}),e.jsxs("div",{className:"md:hidden flex-1 min-h-0 bg-neutral-950 border-t border-neutral-800 flex flex-col overflow-hidden",children:[e.jsxs("div",{className:"px-3 pt-2.5 pb-1.5 text-[0.68rem] text-neutral-400 font-bold flex items-center justify-between uppercase tracking-wider shrink-0 border-b border-neutral-900",children:[e.jsxs("span",{children:["ALL PHOTOS (",c+1,"/",l.length,")"]}),e.jsx("span",{className:"text-[0.62rem] text-neutral-500 font-normal",children:"TAP TO VIEW"})]}),e.jsx("div",{className:"flex-1 overflow-y-auto p-2.5 grid grid-cols-3 gap-2 custom-scrollbar",children:l.map((s,a)=>e.jsxs("button",{type:"button",onClick:()=>x(a),className:`relative aspect-square w-full rounded-xl overflow-hidden border-2 transition-all cursor-pointer bg-neutral-900 group ${a===c?"border-sky-500 ring-2 ring-sky-500/60 scale-[0.97]":"border-transparent opacity-65 hover:opacity-100 hover:scale-[1.02]"}`,children:[e.jsx("img",{src:s,alt:`Thumbnail ${a+1}`,className:"w-full h-full object-cover",loading:"lazy"}),a===c&&e.jsx("div",{className:"absolute inset-0 bg-sky-500/15 pointer-events-none"})]},a))})]})]})]}),e.jsx(Be,{hideCtaStrip:!0})]})}export{ds as default};
