import{r as i,G as fe,j as e,H as ge,L as d}from"./app-C6_nI8BY.js";import{T as be}from"./TopHeader-DpL7qnc6.js";import{G as ue}from"./GlobalFooter-CRWihK--.js";import{g as je}from"./branchStatus-A3yupCxi.js";import{E as we}from"./eye-BRD8mCO5.js";import{S as A}from"./star-C2lkOoKJ.js";import{c as ve,C as P}from"./chevron-down-5Ukw_Sre.js";import{C as O}from"./chevron-right-BZiyQvGA.js";import{P as ye}from"./phone-C9HcK-wp.js";import{S as Ne,U as ke}from"./user-iBDzKL8d.js";import{C as q}from"./calendar-check-D0m3krCH.js";import{M as I}from"./menu-C590vtpK.js";import{C as R}from"./clock-BbK82zZU.js";import{S as Ce}from"./sparkles-Cs985IDZ.js";import{C as ze}from"./chevron-up-DKpltO_y.js";import{A as Se}from"./arrow-right-N8-uDGxw.js";import{X as Ae}from"./x-DDYL_aSb.js";import{I as De}from"./info-CacvaQ6Q.js";import"./mail-Cx-9hsq4.js";const G={name:"chevron-left",size:24,node:[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]]};G.node;const H=ve(G),D="#8B1538",_e=["https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1200","https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=1200","https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=1200","https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?auto=format&fit=crop&q=80&w=1200"];function Ze({branch:s,gallery:f=[],doctors:U=[],services:N=[],locations:_=[],nav_menu:W}){const[V,Q]=i.useState(s?.short_name?.toLowerCase()||"mirpur"),[g,B]=i.useState(!1),[k,J]=i.useState(!1),E=(Array.isArray(f)?f:[]).map(t=>typeof t=="string"?t:t?.src||t?.image||t?.url||"").filter(Boolean),o=E.length>0?E:_e,[p,x]=i.useState(0),b=i.useRef(null),T=["Promotion banner","Treatment room","Reception area","Consultation room","Dental equipment","Sterilization room"],X=()=>{x(t=>t>0?t-1:o.length-1)},Y=()=>{x(t=>t<o.length-1?t+1:0)},K=t=>{b.current=t.touches[0].clientX},Z=t=>{if(b.current===null)return;const r=t.changedTouches[0].clientX-b.current;Math.abs(r)>40&&(r<0?x(a=>a<o.length-1?a+1:0):x(a=>a>0?a-1:o.length-1)),b.current=null},[C,z]=i.useState(!1),[l,c]=i.useState(0);i.useEffect(()=>{if(!C)return;const t=r=>{r.key==="ArrowLeft"?c(a=>a>0?a-1:o.length-1):r.key==="ArrowRight"?c(a=>a<o.length-1?a+1:0):r.key==="Escape"&&z(!1)};return window.addEventListener("keydown",t),()=>window.removeEventListener("keydown",t)},[C,o.length]),i.useRef(null);const u=(s?.short_name||s?.name||"Mirpur").replace(/branch/gi,"").trim(),n=`${u} Branch`,j=s?.phone||"09638000505";let w=(s?.whatsapp||j).replace(/[^0-9]/g,"");w.startsWith("01")&&(w="88"+w);const ee=s?.map_url||`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s?.address||"")}`,te=s?.call_label||"Call",se=s?.directions_label||"Directions",re=s?.whatsapp_label||"WhatsApp",ae=s?.book_label||"Book",oe=s?.booking_url||"/appointment",h=fe.useMemo(()=>je({shortName:s?.short_name||s?.name,time:s?.hours_text||s?.time}),[s]),ne=s?.address_main||(s?.address?s.address.split("(")[0].trim():`${u}, Dhaka`),ie=s?.address_sub||(s?.address_main,""),F=s?.landmark||(s?.address&&s.address.includes("(")?s.address.substring(s.address.indexOf("(")+1).replace(")","").trim():""),M=t=>t?t.replace(/:00\b/g,""):"",S=M(s?.morning_hours),le=M(s?.evening_hours||s?.hours_text||s?.time||"4 PM – 9 PM"),$=s?.working_days||"Saturday – Thursday";$.replace(/Saturday/gi,"Sat").replace(/Thursday/gi,"Thu").replace(/Wednesday/gi,"Wed").replace(/Tuesday/gi,"Tue").replace(/Monday/gi,"Mon").replace(/Sunday/gi,"Sun");const ce=s?.off_days||"Friday closed",de=t=>{c(t),z(!0)},pe=g?N.slice(0,7):N.slice(0,3),v=s?.canonical_url||`https://techdentalbd.com/branch/${s?.slug||s?.id}`,L=s?.seo_title||`Best Dental Clinic in ${n} — Tech Dental Care`,y=s?.meta_desc||`Visit Tech Dental ${n} in Dhaka for painless root canal therapy, dental implants, cosmetic veneers and general dental treatments.`,xe=`${s?.robots_index!==!1?"index":"noindex"}, ${s?.robots_follow!==!1?"follow":"nofollow"}`,m=i.useMemo(()=>{if(!s?.faqs)return[];if(Array.isArray(s.faqs))return s.faqs;try{const t=typeof s.faqs=="string"?JSON.parse(s.faqs):s.faqs;return Array.isArray(t)?t:[]}catch{return[]}},[s?.faqs]),he=i.useMemo(()=>{if(s?.schema_json)try{return JSON.parse(s.schema_json)}catch{}const r={"@context":"https://schema.org","@type":s?.schema_type||"Dentist",name:`Tech Dental Care — ${n}`,description:y,url:v,telephone:j,address:{"@type":"PostalAddress",streetAddress:s?.address||"",addressLocality:"Dhaka",addressCountry:"BD"},priceRange:"৳৳"};return m.length>0?{"@context":"https://schema.org","@graph":[r,{"@type":"FAQPage",mainEntity:m.filter(a=>a&&a.q).map(a=>({"@type":"Question",name:a.q,acceptedAnswer:{"@type":"Answer",text:a.a||""}}))}]}:r},[s,v,y,n,j,m]);return e.jsxs("div",{className:"min-h-screen antialiased w-full",style:{backgroundColor:"#F8F9FA",color:"#1E293B",fontFamily:"'Inter', 'Plus Jakarta Sans', 'SolaimanLipi', 'Noto Sans Bengali', sans-serif"},children:[e.jsxs(ge,{children:[e.jsx("title",{children:L}),e.jsx("meta",{name:"description",content:y}),e.jsx("link",{rel:"canonical",href:v}),e.jsx("meta",{name:"robots",content:xe}),e.jsx("meta",{property:"og:title",content:L}),e.jsx("meta",{property:"og:description",content:y}),e.jsx("meta",{property:"og:url",content:v}),e.jsx("meta",{property:"og:type",content:"business.business"}),e.jsx("script",{type:"application/ld+json",children:JSON.stringify(he)})]}),e.jsx(be,{locations:_.length?_:[s],selectedBranch:V,onBranchChange:Q,navMenu:W}),e.jsxs("main",{className:"w-full px-3.5 sm:px-6 md:px-8 lg:px-12 xl:px-16 mt-4 sm:mt-6 pb-6 sm:pb-8",children:[e.jsx("style",{children:`
          .hero-mirpur {
            display: flex;
            gap: 16px;
            width: 100%;
          }
          .hero-stage {
            flex: 3 1 0;
            min-width: 0;
            height: 560px;
            position: relative;
            border-radius: 32px;
            overflow: hidden;
            background: #EBC3D0;
            cursor: pointer;
          }
          .hero-stage-bg {
            position: absolute;
            inset: 0;
            background-size: cover;
            background-position: center;
            transition: background-image 0.25s ease;
          }
          .hero-chips-top {
            position: absolute;
            left: 24px;
            right: 24px;
            top: 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
            z-index: 2;
            pointer-events: auto;
          }
          .hero-chip {
            height: 36px;
            padding: 0 14px;
            border-radius: 999px;
            font-size: 13px;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .hero-chip-open {
            background: #fff;
            color: #146C43;
            box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          }
          .hero-chip-open i {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #1E9E62;
            box-shadow: 0 0 0 4px rgba(30,158,98,.2);
          }
          .hero-chip-open span {
            color: #6B6065;
            font-weight: 600;
          }
          .hero-chip-dark {
            background: rgba(33,26,29,.55);
            backdrop-filter: blur(8px);
            color: #fff;
          }
          .hero-stage-body {
            position: absolute;
            left: 36px;
            right: 36px;
            bottom: 84px;
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            gap: 24px;
            flex-wrap: wrap;
            color: #fff;
            z-index: 2;
            pointer-events: none;
          }
          .hero-stage-info {
            min-width: 0;
            flex: 1 1 360px;
            pointer-events: none;
          }
          .hero-rating {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            height: 34px;
            padding: 0 14px;
            border-radius: 999px;
            background: rgba(16,12,14,.68);
            backdrop-filter: blur(8px);
            border: 1px solid rgba(255,255,255,.3);
            font-size: 13px;
            font-weight: 600;
            color: #fff;
            box-shadow: 0 4px 14px rgba(0,0,0,0.25);
          }
          .hero-stage h1 {
            margin: 12px 0 0;
            font-size: 46px;
            line-height: 1.05;
            font-weight: 800;
            letter-spacing: -.025em;
            color: #fff;
            text-shadow: 0 2px 14px rgba(0,0,0,0.85), 0 1px 3px rgba(0,0,0,0.95);
          }
          .hero-stage-ctrl {
            display: flex;
            align-items: center;
            gap: 12px;
            pointer-events: auto;
          }
          .hero-counter {
            font-size: 14px;
            font-weight: 700;
            margin-right: 6px;
            color: #fff;
          }
          .hero-counter span {
            opacity: .6;
          }
          .hero-round {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: rgba(255,255,255,.2);
            border: 1px solid rgba(255,255,255,.35);
            display: grid;
            place-items: center;
            color: #fff;
            cursor: pointer;
            transition: background .15s, transform .15s;
          }
          .hero-round:hover {
            background: rgba(255,255,255,.34);
            transform: scale(1.05);
          }
          .hero-dots {
            display: none;
          }
          .hero-thumbs {
            flex: 1 1 0;
            min-width: 0;
            max-width: 340px;
            display: flex;
            flex-direction: column;
            gap: 16px;
          }
          .hero-thumb {
            flex: 1;
            min-height: 0;
            position: relative;
            border-radius: 28px;
            overflow: hidden;
            padding: 0;
            text-align: left;
            border: 0;
            cursor: pointer;
            background-size: cover;
            background-position: center;
            transition: transform .15s, filter .15s;
          }
          .hero-thumb:hover {
            transform: translateY(-2px);
            filter: brightness(.98);
          }
          .hero-thumb-label {
            position: absolute;
            left: 14px;
            bottom: 14px;
            height: 32px;
            padding: 0 12px;
            border-radius: 999px;
            background: rgba(255,255,255,.92);
            backdrop-filter: blur(4px);
            font-size: 12.5px;
            font-weight: 700;
            color: #211A1D;
            display: flex;
            align-items: center;
            box-shadow: 0 2px 6px rgba(0,0,0,0.08);
          }

          /* Actions */
          .hero-actions {
            position: relative;
            margin: -38px 40px 0;
            background: #fff;
            border-radius: 28px;
            padding: 12px;
            box-shadow: 0 18px 40px -18px rgba(70,20,40,.28), 0 0 0 1px #EFE6E9;
            display: grid;
            grid-template-columns: 1fr 1fr 1fr 1.6fr;
            gap: 10px;
            z-index: 10;
          }
          .hero-act {
            height: 56px;
            border-radius: 18px;
            background: #F8F2F4;
            font-size: 15px;
            font-weight: 700;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            color: #211A1D;
            transition: transform .15s, filter .15s;
            text-decoration: none;
          }
          .hero-act:hover {
            transform: translateY(-1px);
            filter: brightness(.97);
          }
          .hero-act svg {
            color: #861A3D;
          }
          .hero-act-wa {
            background: #E6F5EC;
            color: #0F6A41;
          }
          .hero-act-wa svg {
            color: currentColor;
          }
          .hero-act-book {
            background: #861A3D !important;
            color: #fff !important;
            font-weight: 800;
            box-shadow: 0 10px 22px -10px #861A3D;
          }
          .hero-act-book svg {
            color: #fff !important;
            stroke: #fff !important;
          }
          .hero-act-book span {
            color: #fff !important;
          }

          /* Branch Info Section */
          .branch-info-sec {
            margin-top: 28px;
            margin-bottom: 24px;
          }
          .branch-info-card {
            background: #fff;
            border-radius: 32px;
            border: 1px solid #EFE6E9;
            padding: 28px 36px 32px;
            display: flex;
            flex-direction: column;
            gap: 20px;
            box-shadow: 0 4px 24px -10px rgba(70,20,40,.06);
          }
          .branch-eyebrow {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: .16em;
            color: #861A3D;
            text-transform: uppercase;
          }
          .branch-info-card h2 {
            margin: 0;
            font-size: 40px;
            line-height: 1.1;
            font-weight: 800;
            letter-spacing: -.025em;
            color: #211A1D;
          }
          .branch-cols {
            display: flex;
            gap: 64px;
          }
          .branch-col {
            flex: 1 1 0;
            min-width: 0;
            display: flex;
            flex-direction: column;
            gap: 20px;
          }
          .branch-divider {
            width: 1px;
            flex: none;
            background: #F0E6E9;
          }
          .branch-label {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: .14em;
            color: #6B6065;
            text-transform: uppercase;
          }
          .branch-label svg {
            color: #861A3D;
          }
          .branch-addr {
            font-size: 22px;
            line-height: 1.4;
            font-weight: 700;
            color: #211A1D;
          }
          .branch-addr-sub {
            margin-top: 6px;
            font-size: 16px;
            color: #6B6065;
            font-weight: 500;
          }
          .branch-landmark {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 14px;
            color: #6B6065;
            font-weight: 500;
          }
          .branch-landmark svg {
            width: 18px;
            height: 18px;
            color: #861A3D;
            flex-shrink: 0;
          }
          .branch-shifts {
            display: flex;
            flex-direction: column;
            gap: 14px;
          }
          .branch-shift {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            padding: 20px 24px;
            border-radius: 20px;
            background: #F8F2F4;
          }
          .branch-shift small {
            font-size: 15px;
            font-weight: 600;
            color: #6B6065;
          }
          .branch-shift b {
            font-size: 22px;
            font-weight: 800;
            letter-spacing: -.02em;
            color: #211A1D;
          }
          .branch-shift-eve {
            background: #861A3D;
            color: #fff;
          }
          .branch-shift-eve small {
            color: #fff;
            opacity: .85;
          }
          .branch-shift-eve b {
            color: #fff;
          }
          .branch-note {
            font-size: 14px;
            color: #6B6065;
            font-weight: 500;
          }
          .branch-note b {
            color: #211A1D;
          }

          /* Mobile responsive rules matching branch-mirpur (1).html */
          @media (max-width: 760px) {
            .hero-mirpur {
              display: block;
            }
            .hero-thumbs {
              display: none;
            }
            .hero-stage {
              height: 340px;
              border-radius: 24px;
            }
            .hero-chips-top {
              left: 14px;
              right: 14px;
              top: 14px;
            }
            .hero-chip {
              height: 32px;
              padding: 0 10px;
              font-size: 11.5px;
            }
            .hero-chip-views {
              display: none;
            }
            .hero-stage-body {
              left: 16px;
              right: 16px;
              bottom: 14px;
              display: block;
            }
            .hero-rating {
              height: 28px;
              padding: 0 10px;
              font-size: 11.5px;
            }
            .hero-stage h1 {
              font-size: 26px;
              margin: 6px 0 0;
              line-height: 1.15;
            }
            .hero-stage-ctrl {
              margin-top: 8px;
              justify-content: space-between;
            }
            .hero-counter {
              display: none;
            }
            .hero-round {
              width: 38px;
              height: 38px;
            }
            .hero-dots {
              display: flex;
              gap: 6px;
              align-items: center;
              order: -1;
            }
            .hero-dot {
              height: 28px;
              width: 14px;
              padding: 0;
              background: transparent;
              border: 0;
              cursor: pointer;
              display: grid;
              place-items: center;
            }
            .hero-dot::after {
              content: "";
              display: block;
              height: 6px;
              width: 6px;
              border-radius: 999px;
              background: rgba(255,255,255,.5);
              transition: width .2s;
            }
            .hero-dot.on {
              width: 30px;
            }
            .hero-dot.on::after {
              width: 22px;
              background: #fff;
            }
            .hero-actions {
              margin: 14px 0 0;
              padding: 0;
              background: none;
              box-shadow: none;
              border-radius: 0;
              grid-template-columns: repeat(3, 1fr);
              gap: 10px;
            }
            .hero-act {
              height: 54px;
              border-radius: 18px;
              background: #fff;
              border: 1px solid #EFE6E9;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .hero-act:not(.hero-act-book) span {
              display: none;
            }
            .hero-act svg {
              width: 22px;
              height: 22px;
            }
            .hero-act-wa {
              background: #E6F5EC;
              border-color: #CFEBDB;
            }
            .hero-act-book {
              grid-column: 1 / -1;
              height: 58px;
              flex-direction: row;
              gap: 10px;
              font-size: 16px;
              border: 0;
              border-radius: 20px;
              background: #861A3D !important;
              color: #ffffff !important;
              box-shadow: 0 10px 22px -10px #861A3D;
            }
            .hero-act-book span {
              color: #ffffff !important;
              font-weight: 800;
            }
            .hero-act-book svg {
              color: #ffffff !important;
              stroke: #ffffff !important;
            }
            .branch-info-sec {
              margin-top: 22px;
              margin-bottom: 24px;
            }
            .branch-info-card {
              border-radius: 28px;
              padding: 20px 18px 24px;
              gap: 18px;
            }
            .branch-info-card h2 {
              font-size: 30px;
              margin-top: 0;
            }
            .branch-cols {
              flex-direction: column;
              gap: 32px;
            }
            .branch-divider {
              width: auto;
              height: 1px;
            }
            .branch-col {
              gap: 16px;
            }
            .branch-label {
              font-size: 11.5px;
              gap: 8px;
            }
            .branch-addr {
              font-size: 18px;
            }
            .branch-addr-sub {
              font-size: 14.5px;
              margin-top: 4px;
            }
            .branch-landmark {
              font-size: 13.5px;
              gap: 8px;
            }
            .branch-shifts {
              gap: 12px;
            }
            .branch-shift {
              padding: 18px 20px;
              border-radius: 18px;
              gap: 12px;
            }
            .branch-shift small {
              font-size: 14px;
            }
            .branch-shift b {
              font-size: 18px;
            }
            .branch-note {
              font-size: 13.5px;
            }
          }
        `}),e.jsxs("section",{className:"hero-mirpur","aria-label":"Branch photos",children:[e.jsxs("div",{className:"hero-stage group/stage",onTouchStart:K,onTouchEnd:Z,onClick:()=>de(p),title:"Click to view full photo",children:[e.jsx("div",{className:"hero-stage-bg",style:{backgroundImage:`url('${o[p]}')`,backgroundColor:"#EBC3D0"}}),e.jsxs("div",{className:"hero-chips-top",onClick:t=>t.stopPropagation(),children:[e.jsxs("div",{className:"hero-chip hero-chip-open",children:[e.jsx("i",{}),e.jsx("span",{children:h.isOpenNow?`Open now · ${h.subText||"closes 9 PM"}`:h.isOpenSoon?`Opening soon · ${h.subText||"opens 10 AM"}`:`Closed · ${h.subText||"opens 10 AM"}`})]}),e.jsxs("div",{className:"hero-chip hero-chip-dark hero-chip-views",children:[e.jsx(we,{size:16,className:"text-white"}),e.jsx("span",{children:(1800+p*340).toLocaleString()})]})]}),e.jsxs("div",{className:"hero-stage-body",children:[e.jsxs("div",{className:"hero-stage-info",children:[e.jsxs("div",{className:"hero-rating",children:[e.jsx(A,{size:14,className:"fill-[#FFB547] stroke-none text-[#FFB547]"}),e.jsx("b",{children:"4.9"}),e.jsxs("span",{children:["· ",s?.reviews_text||"2,500+ verified reviews"]})]}),e.jsx("h1",{children:n})]}),e.jsxs("div",{className:"hero-stage-ctrl",onClick:t=>t.stopPropagation(),children:[e.jsxs("div",{className:"hero-counter",children:[e.jsx("b",{children:p+1})," ",e.jsxs("span",{children:["/ ",o.length]})]}),e.jsx("div",{className:"hero-dots",children:o.map((t,r)=>e.jsx("button",{type:"button",className:`hero-dot ${r===p?"on":""}`,onClick:a=>{a.stopPropagation(),x(r)},"aria-label":`Slide ${r+1}`},r))}),e.jsxs("div",{className:"flex gap-2.5",children:[e.jsx("button",{type:"button",className:"hero-round",onClick:t=>{t.stopPropagation(),X()},"aria-label":"Previous photo",children:e.jsx(H,{size:20})}),e.jsx("button",{type:"button",className:"hero-round",onClick:t=>{t.stopPropagation(),Y()},"aria-label":"Next photo",children:e.jsx(O,{size:20})})]})]})]})]}),e.jsx("div",{className:"hero-thumbs",children:[1,2].map(t=>{const r=(p+t)%o.length,a=o[r],me=f[r]?.alt||f[r]?.label||T[r%T.length];return e.jsx("button",{type:"button",className:"hero-thumb",onClick:()=>x(r),style:{backgroundImage:`url('${a}')`,backgroundColor:"#FAF7F5"},"aria-label":`Show photo: ${me}`},t)})})]}),e.jsxs("nav",{className:"hero-actions","aria-label":"Quick actions",children:[e.jsxs("a",{href:`tel:${j}`,className:"hero-act",children:[e.jsx(ye,{size:18}),e.jsx("span",{children:te})]}),e.jsxs("a",{href:ee,target:"_blank",rel:"noreferrer",className:"hero-act",children:[e.jsx(Ne,{size:18}),e.jsx("span",{children:se})]}),e.jsxs("a",{href:`https://wa.me/${w}`,target:"_blank",rel:"noreferrer",className:"hero-act hero-act-wa",children:[e.jsx("svg",{className:"w-5 h-5 fill-current",viewBox:"0 0 24 24",children:e.jsx("path",{d:"M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.983zm11.455-7.394c-.068-.113-.25-.181-.524-.318-.274-.137-1.62-.8-1.871-.891-.25-.092-.432-.137-.614.137-.182.274-.707.891-.866 1.073-.16.182-.319.205-.593.068-.274-.137-1.157-.426-2.203-1.359-.815-.726-1.365-1.623-1.524-1.897-.16-.274-.017-.422.12-.559.123-.122.274-.319.41-.478.137-.16.182-.274.274-.457.091-.182.046-.342-.023-.478-.068-.137-.614-1.482-.841-2.031-.222-.535-.447-.462-.614-.471l-.524-.01c-.182 0-.478.068-.729.342-.25.274-.956.935-.956 2.28 0 1.345.979 2.645 1.116 2.828.137.182 1.928 2.943 4.671 4.128 2.743 1.185 2.743.79 3.245.744.502-.046 1.62-.662 1.848-1.3.228-.639.228-1.186.16-1.301z"})}),e.jsx("span",{children:re})]}),e.jsxs(d,{href:oe,className:"hero-act hero-act-book !bg-[#861A3D] !text-white hover:opacity-95",children:[e.jsx(q,{size:18,className:"text-white shrink-0"}),e.jsxs("span",{className:"text-white font-extrabold",children:[ae," appointment"]})]})]}),e.jsx("section",{className:"branch-info-sec",children:e.jsxs("div",{className:"branch-info-card",children:[e.jsx("div",{children:e.jsx("h2",{children:n})}),e.jsxs("div",{className:"branch-cols",children:[e.jsxs("div",{className:"branch-col",children:[e.jsxs("div",{className:"branch-label",children:[e.jsx(I,{size:18}),e.jsx("span",{children:"LOCATION"})]}),e.jsxs("div",{children:[e.jsx("div",{className:"branch-addr",children:ne}),e.jsx("div",{className:"branch-addr-sub",children:ie||`${u}, Dhaka`})]}),F&&e.jsxs("div",{className:"branch-landmark",children:[e.jsxs("svg",{className:"w-4.5 h-4.5 text-[#861A3D] shrink-0",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("rect",{x:"5",y:"3",width:"14",height:"14",rx:"3"}),e.jsx("path",{d:"M5 11h14M9 21l2-4M15 21l-2-4"})]}),e.jsxs("span",{children:["Landmark: ",F]})]})]}),e.jsx("div",{className:"branch-divider",role:"presentation"}),e.jsxs("div",{className:"branch-col",children:[e.jsxs("div",{className:"branch-label",children:[e.jsx(R,{size:18}),e.jsx("span",{children:"OPENING HOURS"})]}),e.jsxs("div",{className:"branch-shifts",children:[S&&e.jsxs("div",{className:"branch-shift",children:[e.jsx("small",{children:"Morning"}),e.jsx("b",{children:S})]}),e.jsxs("div",{className:"branch-shift branch-shift-eve",children:[e.jsx("small",{children:S?"Evening":"Operating Hours"}),e.jsx("b",{children:le})]})]}),e.jsxs("div",{className:"branch-note",children:[$," · ",e.jsx("b",{children:ce})]})]})]})]})}),e.jsxs("div",{className:"w-full flex flex-col gap-6 mt-6",children:[e.jsxs("div",{className:"bg-white rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm border border-slate-100 mb-4 relative group",children:[e.jsxs("div",{className:"flex justify-between items-center mb-4",children:[e.jsxs("div",{className:"flex items-center gap-2.5",children:[e.jsx(ke,{size:22,className:"text-[#8B1538]"}),e.jsx("h2",{className:"text-xl font-bold text-slate-800",children:"Specialist Doctors"})]}),e.jsx(d,{href:"/doctors",className:"text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline inline-flex items-center gap-1 whitespace-nowrap",children:"View All →"})]}),e.jsx("div",{className:"flex gap-3 overflow-x-auto no-scrollbar pb-2 pt-1 scroll-smooth snap-x",children:U.map(t=>e.jsxs("div",{className:"w-[205px] min-w-[205px] max-w-[205px] sm:w-[225px] sm:min-w-[225px] sm:max-w-[225px] border-[1.5px] rounded-2xl p-3 flex flex-col relative shrink-0 bg-white shadow-2xs hover:shadow-md transition-shadow snap-start",style:{borderColor:D},children:[e.jsx("div",{className:"relative w-full h-[130px] sm:h-[145px] rounded-xl overflow-hidden mb-2.5 bg-slate-100",children:e.jsx("img",{src:t.img||"https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400",alt:t.name,className:"w-full h-full object-cover object-[center_20%]"})}),e.jsx("h3",{className:"text-[14.5px] sm:text-[15.5px] font-bold text-teal-700 text-center tracking-tight leading-snug line-clamp-1",title:t.name,children:t.name}),e.jsx("p",{className:"text-[11.5px] font-bold text-[#800038] mt-1 text-center line-clamp-1",children:t.designation||"Dental Specialist"}),t.deg&&e.jsx("p",{className:"text-[10px] text-slate-500 mt-0.5 text-center line-clamp-1",title:t.deg,children:t.deg.split(",")[0].trim()}),e.jsxs("div",{className:"w-full flex items-center justify-center gap-1.5 text-[10.5px] font-semibold text-slate-600 my-2.5 bg-slate-50 py-1.5 px-2 rounded-lg border border-slate-100",children:[e.jsx(R,{size:11,className:"text-slate-400 shrink-0"}),e.jsx("span",{className:"truncate",children:t.visiting_time||"4.00 PM - 9.00 PM"})]}),e.jsxs("div",{className:"flex gap-2 mt-auto w-full pt-1",children:[e.jsx(d,{href:`/doctors/${t.id}`,className:"flex-1 py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-bold rounded-lg transition-colors flex items-center justify-center shadow-2xs text-center",children:e.jsx("span",{children:"Profile"})}),e.jsx(d,{href:"/appointment",className:"flex-1 py-1.5 px-2 text-white text-[11px] font-bold rounded-lg transition-opacity hover:opacity-95 flex items-center justify-center shadow-2xs text-center",style:{backgroundColor:D},children:e.jsx("span",{children:"Book"})})]})]},t.id))})]}),e.jsxs("div",{className:"bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 mb-4 relative transition-all duration-500",children:[e.jsxs("div",{className:"flex justify-between items-center mb-6",children:[e.jsxs("div",{className:"flex items-center gap-2.5 min-w-0",children:[e.jsx(Ce,{size:22,className:"text-[#8B1538] shrink-0"}),e.jsx("h2",{className:"text-lg sm:text-xl font-bold text-slate-800 whitespace-nowrap",children:"Services & Pricing"})]}),e.jsx("div",{className:"flex items-center gap-3",children:g&&e.jsx("button",{type:"button",onClick:()=>B(!1),className:"p-1.5 text-primary-maroon hover:bg-rose-50 rounded-lg transition-colors cursor-pointer",title:"Collapse list","aria-label":"Collapse services list",children:e.jsx(ze,{size:20,className:"stroke-[2.5]"})})})]}),e.jsxs("div",{className:"flex flex-col relative",children:[pe.map((t,r)=>e.jsxs(d,{href:`/services/${t.slug||t.id}`,className:"flex items-center justify-between p-3.5 mb-3 border border-slate-100 rounded-2xl bg-white shadow-sm hover:shadow-md hover:border-slate-200 hover:-translate-y-0.5 transition-all group cursor-pointer",children:[e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx("div",{className:"w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0",children:e.jsx("img",{src:t.image||"https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=100&h=100&fit=crop",className:"w-full h-full object-cover",alt:t.title||t.name||"Treatment"})}),e.jsx("div",{children:e.jsx("h3",{className:"text-[15px] font-semibold text-slate-800 group-hover:text-[#8B1538] transition-colors",children:(t.title||t.name||"Treatment").split(/[-–—:]/)[0].trim()})})]}),e.jsx("div",{className:"text-right pl-2 shrink-0",children:e.jsxs("span",{className:"inline-block bg-[#fdf2f5] text-[#8B1538] text-sm font-bold px-3 py-1.5 rounded-xl whitespace-nowrap",children:["৳ ",String(t.price||"1,500").replace(/^[৳\sBDTtk.]+/i,"").trim()]})})]},t.id||r)),N.length>3&&e.jsxs("div",{className:"mt-2 space-y-2",children:[!g&&e.jsxs("button",{type:"button",onClick:()=>B(!0),className:"w-full py-2.5 rounded-xl border border-slate-200 text-primary-maroon font-bold text-xs hover:bg-rose-50/50 transition-colors flex justify-center items-center gap-1.5 cursor-pointer shadow-2xs",children:[e.jsx("span",{children:"See more"}),e.jsx(P,{size:14})]}),g&&e.jsxs(d,{href:"/services",className:"group w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-[#800038]/5 via-[#800038]/10 to-[#800038]/5 hover:from-[#800038] hover:via-[#800038] hover:to-[#a01246] border border-[#800038]/20 hover:border-[#800038] text-[#800038] hover:text-white font-extrabold text-[0.84rem] shadow-xs hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]",children:[e.jsx("span",{children:"View All Services"}),e.jsx(Se,{className:"w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"})]})]})]})]}),e.jsxs("div",{className:"bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-slate-100 mb-4",children:[e.jsxs("div",{className:"flex items-center gap-3.5 sm:gap-4",children:[e.jsx("div",{className:"w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[#fff7ed] flex items-center justify-center shrink-0 border border-amber-100/80 shadow-2xs",children:e.jsx(A,{size:26,className:"text-[#f97316] fill-[#f97316]"})}),e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none",children:"4.9"}),e.jsx("div",{className:"flex text-[#f97316] gap-0.5",children:[1,2,3,4,5].map(t=>e.jsx(A,{size:15,fill:"#f97316",color:"#f97316"},t))})]}),e.jsxs("div",{className:"flex items-center gap-1.5 mt-1",children:[e.jsx("span",{className:"text-[12.5px] sm:text-[13.5px] font-semibold text-slate-600",children:"2,500+ Verified Patient Reviews"}),e.jsx("svg",{className:"w-4 h-4 text-[#1d9bf0] fill-[#1d9bf0] shrink-0",viewBox:"0 0 24 24",children:e.jsx("path",{d:"M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm3.707 7.293a1 1 0 0 0-1.414 0L10.5 13.086l-1.793-1.793a1 1 0 0 0-1.414 1.414l2.5 2.5a1 1 0 0 0 1.414 0l4.5-4.5a1 1 0 0 0 0-1.414z"})})]})]})]}),e.jsx("div",{className:"bg-[#f8fafc] rounded-2xl p-4 sm:p-5 my-4 border-l-4 border-[#d62858]",children:e.jsxs("p",{className:"italic text-slate-700 text-[13.5px] sm:text-[14.5px] leading-relaxed",children:['"',s?.reviews_text||"Extremely gentle and painless treatment! The doctors explained every procedure clearly, and the clinic environment was spotless and reassuring.",'"']})}),e.jsxs("a",{href:s?.review_url||s?.map_url||"https://maps.google.com",target:"_blank",rel:"noopener noreferrer",className:"w-full py-3.5 px-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2.5 shadow-2xs group cursor-pointer",children:[e.jsxs("svg",{className:"w-5 h-5 shrink-0",viewBox:"0 0 24 24",children:[e.jsx("path",{fill:"#4285F4",d:"M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"}),e.jsx("path",{fill:"#34A853",d:"M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"}),e.jsx("path",{fill:"#FBBC05",d:"M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"}),e.jsx("path",{fill:"#EA4335",d:"M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"})]}),e.jsx("span",{className:"text-slate-800 font-bold text-sm sm:text-[15px] group-hover:text-slate-900",children:"See All Google Reviews"})]})]}),e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsxs(d,{href:s.booking_url||"/appointment",className:"w-full py-4 rounded-2xl text-white font-bold shadow-lg shadow-[#8B1538]/20 hover:opacity-95 transition-all flex justify-center items-center gap-2 text-base sm:text-lg text-center cursor-pointer active:scale-98",style:{backgroundColor:D},children:[e.jsx(q,{size:20}),e.jsx("span",{children:s.appointment_btn_label||"Book Now"})]}),e.jsxs("div",{className:"w-full border border-slate-200 bg-white rounded-2xl overflow-hidden shadow-sm",children:[e.jsxs("button",{type:"button",onClick:()=>J(!k),className:"w-full py-4 px-5 sm:px-6 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm sm:text-base transition-all flex items-center justify-between text-left cursor-pointer active:scale-[0.99]",children:[e.jsx("span",{className:"text-left font-bold text-slate-800 text-sm sm:text-base",children:s.more_about_title||`More About ${(s.short_name||s.name||"").replace(/\s*branch\s*$/i,"").trim()}`}),e.jsx(P,{size:20,className:`text-slate-500 transition-transform duration-300 shrink-0 ${k?"rotate-180 text-rose-700":""}`})]}),k&&e.jsxs("div",{className:"px-5 pb-6 border-t border-slate-100 animate-fade-in space-y-4",children:[s.seo_content?e.jsx("div",{className:"rich-content-view wp-editor-content prose prose-slate max-w-none text-slate-700 leading-relaxed mt-4",dangerouslySetInnerHTML:{__html:s.seo_content}}):e.jsxs("div",{className:"text-sm text-slate-600 mt-4 space-y-3 leading-relaxed",children:[e.jsxs("h3",{className:"text-base font-bold text-slate-800 mb-1",children:["Premier Digital Dentistry & Comprehensive Oral Care in ",n]}),e.jsxs("p",{children:["Welcome to ",e.jsxs("strong",{children:["Tech Dental (",n,")"]}),", your trusted destination for comprehensive, high-precision dental treatments in Dhaka. Conveniently situated with state-of-the-art dental chairs, German autoclaves, and certified specialists."]}),e.jsx("p",{children:"Our treatments include single-visit Rotary Root Canal, laser teeth whitening, aesthetic veneers, and durable dental implants adhering strictly to European sterilization protocols."})]}),m.length>0&&e.jsxs("div",{className:"pt-4 border-t border-slate-100 space-y-3",children:[e.jsxs("h4",{className:"text-sm font-bold text-slate-800",children:["Frequently Asked Questions (",u," Clinic)"]}),e.jsx("div",{className:"space-y-2",children:m.filter(t=>t&&t.q).map((t,r)=>e.jsxs("div",{className:"p-3 bg-slate-50/80 rounded-xl border border-slate-200/80",children:[e.jsxs("div",{className:"font-bold text-xs text-slate-900 mb-1",children:["Q: ",t.q]}),e.jsx("div",{className:"text-xs text-slate-600 leading-relaxed",children:t.a})]},r))})]})]})]})]})]})]}),C&&e.jsxs("div",{className:"fixed inset-0 z-50 bg-black/95 text-white flex flex-col md:flex-row overflow-hidden animate-in fade-in duration-200 select-none",children:[e.jsxs("div",{className:"hidden md:flex flex-col w-[320px] lg:w-[360px] bg-neutral-950 border-r border-neutral-800 shrink-0 h-full",children:[e.jsx("div",{className:"p-4 border-b border-neutral-800 flex items-center justify-between",children:e.jsxs("div",{children:[e.jsxs("h3",{className:"text-sm font-extrabold text-white tracking-wide",children:[n," Photos"]}),e.jsxs("p",{className:"text-[0.68rem] text-neutral-400",children:["Tech Dental Care • ",o.length," photos"]})]})}),e.jsx("div",{className:"flex-1 overflow-y-auto p-3 grid grid-cols-2 gap-2.5 custom-scrollbar",children:o.map((t,r)=>e.jsxs("button",{type:"button",onClick:()=>c(r),className:`relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer group bg-neutral-900 ${r===l?"border-sky-500 ring-2 ring-sky-500/50 scale-[0.98]":"border-transparent opacity-65 hover:opacity-100 hover:scale-[1.02]"}`,children:[e.jsx("img",{src:t,alt:`${n} thumbnail ${r+1}`,className:"w-full h-full object-cover"}),r===l&&e.jsx("div",{className:"absolute inset-0 bg-sky-500/10 pointer-events-none"})]},r))})]}),e.jsxs("div",{className:"flex-1 flex flex-col h-full bg-black relative min-w-0",children:[e.jsxs("div",{className:"p-3 md:p-4 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between z-20 shrink-0",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("div",{className:"w-8 h-8 rounded-full bg-rose-900/80 border border-rose-500/40 flex items-center justify-center text-rose-300 font-extrabold text-xs",children:"TD"}),e.jsxs("div",{children:[e.jsx("h4",{className:"text-xs md:text-sm font-extrabold text-white leading-tight",children:"Tech Dental Care"}),e.jsxs("p",{className:"text-[0.65rem] md:text-[0.7rem] text-neutral-400",children:[n," • Dhaka"]})]})]}),e.jsx("button",{type:"button",onClick:()=>z(!1),className:"w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer border border-white/10","aria-label":"Close modal",children:e.jsx(Ae,{className:"w-5 h-5"})})]}),e.jsxs("div",{className:"h-[42vh] md:h-auto md:flex-1 relative flex items-center justify-center p-2 md:p-6 bg-black shrink-0",children:[e.jsx("button",{type:"button",onClick:t=>{t.stopPropagation(),c(r=>r>0?r-1:o.length-1)},className:"absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-11 md:h-11 flex items-center justify-center rounded-full bg-black/60 hover:bg-black/85 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-xl","aria-label":"Previous photo",children:e.jsx(H,{className:"w-5 h-5 md:w-6 md:h-6 stroke-[2.5]"})}),e.jsx("img",{src:o[l]||o[0]||"",alt:`${n} photo ${l+1}`,className:"max-h-full max-w-full object-contain rounded-lg shadow-2xl transition-all duration-300"}),e.jsx("button",{type:"button",onClick:t=>{t.stopPropagation(),c(r=>r<o.length-1?r+1:0)},className:"absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-11 md:h-11 flex items-center justify-center rounded-full bg-black/60 hover:bg-black/85 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-xl","aria-label":"Next photo",children:e.jsx(O,{className:"w-5 h-5 md:w-6 md:h-6 stroke-[2.5]"})})]}),e.jsxs("div",{className:"hidden md:flex p-3 md:p-4 bg-neutral-950/80 border-t border-neutral-800 text-[0.68rem] md:text-xs text-neutral-400 items-center justify-between gap-2 shrink-0",children:[e.jsxs("div",{className:"flex items-center gap-1.5",children:[e.jsx(De,{className:"w-3.5 h-3.5 text-neutral-500"}),e.jsx("span",{children:"Images may be subject to copyright • Tech Dental Care"})]}),e.jsxs("div",{className:"flex items-center gap-2 font-mono text-[0.68rem] text-neutral-400",children:[e.jsx(I,{className:"w-3.5 h-3.5 text-rose-400"}),e.jsx("span",{children:s?.address||`${n}, Dhaka`})]})]}),e.jsxs("div",{className:"md:hidden flex-1 min-h-0 bg-neutral-950 border-t border-neutral-800 flex flex-col overflow-hidden",children:[e.jsxs("div",{className:"px-3 pt-2.5 pb-1.5 text-[0.68rem] text-neutral-400 font-bold flex items-center justify-between uppercase tracking-wider shrink-0 border-b border-neutral-900",children:[e.jsxs("span",{children:["ALL PHOTOS (",l+1,"/",o.length,")"]}),e.jsx("span",{className:"text-[0.62rem] text-neutral-500 font-normal",children:"TAP TO VIEW"})]}),e.jsx("div",{className:"flex-1 overflow-y-auto p-2.5 grid grid-cols-3 gap-2 custom-scrollbar",children:o.map((t,r)=>e.jsxs("button",{type:"button",onClick:()=>c(r),className:`relative aspect-square w-full rounded-xl overflow-hidden border-2 transition-all cursor-pointer bg-neutral-900 group ${r===l?"border-sky-500 ring-2 ring-sky-500/60 scale-[0.97]":"border-transparent opacity-65 hover:opacity-100 hover:scale-[1.02]"}`,children:[e.jsx("img",{src:t,alt:`Thumbnail ${r+1}`,className:"w-full h-full object-cover",loading:"lazy"}),r===l&&e.jsx("div",{className:"absolute inset-0 bg-sky-500/15 pointer-events-none"})]},r))})]})]})]}),e.jsx(ue,{hideCtaStrip:!0})]})}export{Ze as default};
