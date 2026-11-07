import{r as l,j as e,H as Fe,L as Z,a as Ae}from"./app-C-xNQT00.js";import{F as Ie,S as He,I as _e}from"./settings-BqGZpG5I.js";import{P as ee}from"./plus-4o_D9Qqz.js";import{C as Oe}from"./chevron-up-DzFLDQyY.js";import{X as te}from"./x-hxUUUyen.js";import{A as Re}from"./arrow-left-k_p_CZjn.js";import{M as re}from"./monitor-CEEIpbZt.js";import{c as f,C as Ve}from"./chevron-down-BCVth4Xj.js";import{S as oe}from"./smartphone-DWS01UqB.js";import{E as qe}from"./eye-off-DdTJDfvu.js";import{E as se}from"./eye-BG2qjOls.js";import{D as Ue}from"./download-cy-dneim.js";import{T as Ge}from"./trash-D4uJWC5r.js";import{R as We}from"./refresh-cw-B9QxTGtU.js";import{S as Ye}from"./save-DN-eiyQe.js";import{C as Je}from"./check-CbVVks63.js";import{L as Qe}from"./layers-BuKBbCPp.js";import{T as Ke}from"./tag-BzI8QRRD.js";import{T as Xe}from"./target-D9NFfMxN.js";const le={name:"box",size:24,node:[["path",{d:"M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z",key:"hh9hay"}],["path",{d:"m3.3 7 8.7 5 8.7-5",key:"g66t2b"}],["path",{d:"M12 22V12",key:"d0xqtd"}]]};le.node;const Ze=f(le);const ce={name:"code",size:24,node:[["path",{d:"m16 18 6-6-6-6",key:"eg8j8"}],["path",{d:"m8 6-6 6 6 6",key:"ppft3o"}]]};ce.node;const ne=f(ce);const de={name:"ellipsis-vertical",size:24,node:[["circle",{cx:"12",cy:"12",r:"1",key:"41hilf"}],["circle",{cx:"12",cy:"5",r:"1",key:"gxeob9"}],["circle",{cx:"12",cy:"19",r:"1",key:"lyex9k"}]],aliases:["more-vertical"]};de.node;const et=f(de);const pe={name:"link-2",size:24,node:[["path",{d:"M9 17H7A5 5 0 0 1 7 7h2",key:"8i5ue5"}],["path",{d:"M15 7h2a5 5 0 1 1 0 10h-2",key:"1b9ql8"}],["line",{x1:"8",x2:"16",y1:"12",y2:"12",key:"1jonct"}]]};pe.node;const tt=f(pe);const xe={name:"maximize-2",size:24,node:[["path",{d:"M15 3h6v6",key:"1q9fwt"}],["path",{d:"m21 3-7 7",key:"1l2asr"}],["path",{d:"m3 21 7-7",key:"tjx5ai"}],["path",{d:"M9 21H3v-6",key:"wtvkvv"}]]};xe.node;const rt=f(xe);const ge={name:"mouse-pointer",size:24,node:[["path",{d:"M12.586 12.586 19 19",key:"ea5xo7"}],["path",{d:"M3.688 3.037a.497.497 0 0 0-.651.651l6.5 15.999a.501.501 0 0 0 .947-.062l1.569-6.083a2 2 0 0 1 1.448-1.479l6.124-1.579a.5.5 0 0 0 .063-.947z",key:"277e5u"}]]};ge.node;const ot=f(ge);const he={name:"redo",size:24,node:[["path",{d:"M21 7v6h-6",key:"3ptur4"}],["path",{d:"M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7",key:"1kgawr"}]]};he.node;const st=f(he);const me={name:"square",size:24,node:[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}]]};me.node;const ie=f(me);const fe={name:"tablet",size:24,node:[["rect",{width:"16",height:"20",x:"4",y:"2",rx:"2",ry:"2",key:"76otgf"}],["line",{x1:"12",x2:"12.01",y1:"18",y2:"18",key:"1dp563"}]]};fe.node;const ae=f(fe);const ue={name:"undo",size:24,node:[["path",{d:"M3 7v6h6",key:"1v2h90"}],["path",{d:"M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13",key:"1r6uu6"}]]};ue.node;const nt=f(ue);function zt({page:d}){const i=l.useRef(null),r=l.useRef(`gjs-studio-sdk-${d.id}`),[be,E]=l.useState(!0),[k,B]=l.useState(!1),[ye,L]=l.useState(!1),[b,P]=l.useState(!1),[F,A]=l.useState("regular"),[v,j]=l.useState("styles"),[y,ve]=l.useState("Desktop"),[I,H]=l.useState(!1),[_,we]=l.useState(!0),[N,O]=l.useState(!1),[it,R]=l.useState(!1),[T,ke]=l.useState(!1),[V,je]=l.useState(!1),[q,Ne]=l.useState([]),[Ce,C]=l.useState(""),[U,ze]=l.useState({}),[Se,M]=l.useState("Body"),[G,W]=l.useState([]),[$e,Be]=l.useState("Normal"),[z,Te]=l.useState(""),Me=l.useRef(d.content||""),Y=t=>{if(!t)return{cid:"",id:"",name:"",tag:"",iconType:"box",model:null,children:[]};const a=(t.get("tagName")||"div").toLowerCase(),p=t.get("type")||"";let c=t.getName?.()||t.get("name")||"",s="box";/^h[1-6]$/i.test(a)||p==="heading"?(c="Heading",s="H"):a==="p"||a==="span"||p==="text"?(c="Text",s="T"):a==="img"||p==="image"?(c="Image",s="img"):a==="header"?(c="Header",s="box"):a==="section"?(c="Section",s="box"):a==="body"||t.is?.("wrapper")?(c="Body",s="box"):a==="a"||a==="button"?(c=a==="button"?"Button":"Link",s="link"):a==="div"?(c="Div",s="box"):c||(c=a.charAt(0).toUpperCase()+a.slice(1));const g=t.components?t.components():[],u=[];return g&&g.models&&g.models.forEach(o=>{o.get("type")==="textnode"||!o.get("tagName")||u.push(Y(o))}),{cid:t.cid,id:t.getId?.()||t.cid,name:c,tag:a,iconType:s,model:t,children:u}};l.useEffect(()=>{let t=!0;const a=s=>new Promise((g,u)=>{if(document.querySelector(`script[src="${s}"]`)){g();return}const o=document.createElement("script");o.src=s,o.async=!0,o.onload=()=>g(),o.onerror=n=>u(n),document.head.appendChild(o)}),p=s=>{if(!document.querySelector(`link[href="${s}"]`)){const g=document.createElement("link");g.rel="stylesheet",g.href=s,document.head.appendChild(g)}};return(async()=>{try{if(p("https://unpkg.com/grapesjs/dist/css/grapes.min.css"),window.grapesjs||await a("https://unpkg.com/grapesjs/dist/grapes.min.js"),await a("https://unpkg.com/grapesjs-blocks-basic"),!t)return;const s=r.current;if(!document.getElementById(s))return;if(i.current)try{i.current.destroy()}catch{}const u=d.content&&d.content.trim().length>0&&!d.content.includes("linear-gradient(135deg, #700030")&&!d.content.includes("Tech Dental Care Dhaka")?d.content:`
<header style="padding: 20px 24px; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: space-between;">
    <div style="font-weight: 700; font-size: 18px; color: #1e293b; letter-spacing: -0.5px;">GrapesJS</div>
</header>
<div style="max-width: 600px; margin: 40px auto; padding: 32px 24px; text-align: center; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
    <h1 style="font-size: 26px; font-weight: 800; color: #db2777; margin-bottom: 14px; line-height: 1.2;">Welcome to GrapesJS Studio SDK!</h1>
    <p style="font-size: 14px; color: #64748b; margin-bottom: 18px; line-height: 1.5;">You're currently viewing the default fallback project for web.</p>
    <p style="font-size: 13px; color: #334155; margin-bottom: 8px; line-height: 1.5;">This appears because no storage has been configured yet. To set up your own storage, follow the guide here:</p>
    <p style="font-size: 13px; color: #db2777; margin-bottom: 18px; line-height: 1.5;"><a href="https://app.grapesjs.com/docs-sdk/configuration/projects#self-hosted-storage" style="color: #db2777; text-decoration: underline;">👉 https://app.grapesjs.com/docs-sdk/configuration/projects#self-hosted-storage</a></p>
    <p style="font-size: 13px; color: #334155; margin-bottom: 8px; line-height: 1.5;">Want to customize the fallback project? You can do so by setting options.project.default. Learn more here:</p>
    <p style="font-size: 13px; color: #db2777; margin-bottom: 24px; line-height: 1.5;"><a href="https://app.grapesjs.com/docs-sdk/configuration/projects#setup" style="color: #db2777; text-decoration: underline;">👉 https://app.grapesjs.com/docs-sdk/configuration/projects#setup</a></p>
    <p style="font-size: 14px; font-weight: 600; color: #1e293b; margin-top: 16px;">Happy building! 🚀</p>
</div>
`,o=window.grapesjs.init({container:`#${s}`,height:"100%",width:"100%",fromElement:!1,storageManager:!1,panels:{defaults:[]},components:u,plugins:["gjs-blocks-basic"],pluginsOpts:{"gjs-blocks-basic":{flexGrid:!0}},canvas:{styles:["https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"]},deviceManager:{devices:[{name:"Desktop",width:""},{name:"Tablet",width:"768px",widthMedia:"992px"},{name:"Mobile",width:"375px",widthMedia:"480px"}]},blockManager:{appendTo:`#${s}-blocks`},styleManager:{appendTo:`#${s}-styles`,sectors:[{name:"Space",open:!0,buildProps:["padding","margin"]},{name:"Typography",open:!0,buildProps:["font-family","font-size","font-weight","color","line-height","letter-spacing","text-align","text-decoration"]},{name:"Background",open:!0,buildProps:["background-color","background","background-image"]},{name:"Borders",open:!1,buildProps:["border-radius","border","box-shadow"]},{name:"Effects",open:!1,buildProps:["opacity","transition","transform"]}]},traitManager:{appendTo:`#${s}-traits`}}),n=o.BlockManager;n.add("section-block",{label:"Section",category:"Basic",media:'<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 6h18M3 18h18"/><rect x="5" y="9" width="14" height="6" rx="1" fill="currentColor" fill-opacity="0.15"/></svg>',content:'<div style="padding: 50px 24px; margin: 15px 0; background-color: #ffffff; border: 2px dashed #cbd5e1; border-radius: 12px; text-align: center;"><h3 style="font-size: 20px; font-weight: 700; color: #1e293b; margin-bottom: 6px;">New Section</h3><p style="color: #64748b; font-size: 14px;">Drop components inside this container.</p></div>'}),n.add("divider-block",{label:"Divider",category:"Basic",media:'<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M12 4v4m0 8v4M9 6l3-3 3 3M9 18l3 3 3-3"/></svg>',content:'<hr style="margin: 28px 0; border: 0; border-top: 1.5px solid #e2e8f0;" />'}),n.add("heading-block",{label:"Heading",category:"Basic",media:'<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M5 4h3.5v6.5h7V4H19v16h-3.5v-6.5h-7V20H5V4z"/></svg>',content:'<h2 style="font-size: 30px; font-weight: 800; color: #0f172a; margin: 16px 0 10px;">Specialized Dental Headline</h2>'}),n.add("text-block",{label:"Text",category:"Basic",media:'<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M4 5h16v3.5h-6.2v11.5h-3.6V8.5H4V5z"/></svg>',content:'<p style="font-size: 15px; color: #475569; line-height: 1.6; margin: 8px 0;">Insert your comprehensive text description or paragraph details here.</p>'}),n.add("link-block",{label:"Link",category:"Basic",media:'<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',content:'<a href="#" style="color: #7c3aed; font-weight: 600; text-decoration: underline;">Clickable Text Link</a>'}),n.add("link-box-block",{label:"Link Box",category:"Basic",media:'<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 12a3 3 0 0 0 4 2.8M16 12a3 3 0 0 0-4-2.8"/></svg>',content:'<a href="#" style="display: block; padding: 22px; border: 1px solid #e2e8f0; border-radius: 12px; text-decoration: none; color: #700030; background: #ffffff; font-weight: 700; box-shadow: 0 4px 12px rgba(0,0,0,0.04);">Clickable Feature Box &rarr;</a>'}),n.add("image-block",{label:"Image",category:"Basic",media:'<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/><path d="M21 15l-5-5L5 21"/></svg>',content:'<img src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&auto=format&fit=crop" style="width: 100%; max-width: 600px; height: auto; border-radius: 10px; margin: 10px 0;" alt="Dental Image" />'}),n.add("image-box-block",{label:"Image Box",category:"Basic",media:'<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="2" stroke-dasharray="2 2"/><rect x="5.5" y="5.5" width="13" height="13" rx="1.5"/><circle cx="9.5" cy="9.5" r="1.2" fill="currentColor"/><path d="M18.5 14.5l-4-4-5 5"/></svg>',content:`
                        <div style="text-align: center; padding: 16px; border: 1px solid #e2e8f0; border-radius: 14px; background: #ffffff; box-shadow: 0 4px 14px rgba(0,0,0,0.03);">
                            <img src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&auto=format&fit=crop" style="width: 100%; height: 200px; object-fit: cover; border-radius: 10px; margin-bottom: 12px;" alt="Dental Care" />
                            <h4 style="font-weight: 800; color: #0f172a; margin: 6px 0; font-size: 16px;">State of the Art Equipment</h4>
                            <p style="font-size: 13px; color: #64748b; line-height: 1.5;">Safe, sterile, and computer-guided dental operations.</p>
                        </div>
                    `}),n.add("video-block",{label:"Video",category:"Basic",media:'<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2.5" y="4.5" width="19" height="15" rx="3"/><polygon points="10 8.5 16 12 10 15.5" fill="currentColor"/></svg>',content:'<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 12px; margin: 15px 0;"><iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" style="position: absolute; top:0; left: 0; width: 100%; height: 100%; border:0;" allowfullscreen></iframe></div>'}),n.add("map-block",{label:"Map",category:"Basic",media:'<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>',content:'<iframe src="https://maps.google.com/maps?q=Dhaka&t=&z=13&ie=UTF8&iwloc=&output=embed" style="width: 100%; height: 260px; border: 0; border-radius: 12px; margin: 15px 0;"></iframe>'}),n.add("icon-block",{label:"Icon",category:"Basic",media:'<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="6 3 18 3 22 9 12 22 2 9"/><line x1="2" y1="9" x2="22" y2="9"/><line x1="12" y1="22" x2="6" y2="3"/><line x1="12" y1="22" x2="18" y2="3"/></svg>',content:'<div style="display: inline-block; font-size: 32px; color: #7c3aed; padding: 8px;">💎</div>'}),n.add("form-block",{label:"Form",category:"Forms",media:'<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="7" y1="8" x2="17" y2="8"/><line x1="7" y1="12" x2="14" y2="12"/><line x1="7" y1="16" x2="11" y2="16"/></svg>',content:'<form style="padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;"></form>'}),n.add("input-block",{label:"Input",category:"Forms",media:'<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="7" width="18" height="10" rx="3"/><line x1="7" y1="10" x2="7" y2="14"/></svg>',content:'<input type="text" placeholder="Enter text..." style="width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 6px; margin: 8px 0; font-size: 14px;" />'}),n.add("textarea-block",{label:"Textarea",category:"Forms",media:'<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><line x1="6" y1="9" x2="14" y2="9"/><line x1="6" y1="12" x2="16" y2="12"/><line x1="6" y1="15" x2="10" y2="15"/></svg>',content:'<textarea rows="4" placeholder="Enter details..." style="width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 6px; margin: 8px 0; font-size: 14px;"></textarea>'}),n.add("select-block",{label:"Select",category:"Forms",media:'<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="7" width="18" height="10" rx="2"/><path d="M16 11l-2 2-2-2"/></svg>',content:'<select style="width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 6px; margin: 8px 0; font-size: 14px; background: #fff;"><option>Option 1</option><option>Option 2</option></select>'}),n.add("button-block",{label:"Button",category:"Forms",media:'<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="8" width="16" height="8" rx="2"/><line x1="8" y1="12" x2="16" y2="12"/></svg>',content:'<button type="button" style="background: #7c3aed; color: #ffffff; font-weight: 700; padding: 11px 24px; border-radius: 6px; border: none; cursor: pointer; font-size: 14px;">Button</button>'}),n.add("label-block",{label:"Label",category:"Forms",media:'<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 6h16M4 12h10"/><rect x="3" y="4" width="18" height="16" rx="2" stroke-dasharray="2 2"/></svg>',content:'<label style="font-size: 13px; font-weight: 600; color: #374151; display: block; margin-bottom: 4px;">Form Label</label>'}),n.add("checkbox-block",{label:"Checkbox",category:"Forms",media:'<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M9 12l2 2 4-4" stroke-width="2.2"/></svg>',content:'<label style="display: flex; align-items: center; gap: 8px; font-size: 14px; cursor: pointer;"><input type="checkbox" style="width: 16px; height: 16px;" /> I agree to the terms</label>'}),n.add("radio-block",{label:"Radio",category:"Forms",media:'<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4" fill="currentColor"/></svg>',content:'<label style="display: flex; align-items: center; gap: 8px; font-size: 14px; cursor: pointer;"><input type="radio" name="opt" style="width: 16px; height: 16px;" /> Select option</label>'}),n.add("navbar-block",{label:"Navbar",category:"Extra",media:'<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="6" cy="12" r="1.5" fill="currentColor"/><line x1="12" y1="12" x2="14" y2="12"/><line x1="16" y1="12" x2="18" y2="12"/></svg>',content:`
                        <nav style="display: flex; align-items: center; justify-content: space-between; padding: 16px 24px; background: #ffffff; border-bottom: 1px solid #e2e8f0;">
                            <strong style="font-size: 18px; color: #700030;">Tech Dental</strong>
                            <div style="display: flex; gap: 18px; font-size: 14px; font-weight: 600;">
                                <a href="#" style="color: #334155; text-decoration: none;">Home</a>
                                <a href="#" style="color: #334155; text-decoration: none;">Services</a>
                                <a href="#" style="color: #334155; text-decoration: none;">Doctors</a>
                                <a href="#" style="color: #334155; text-decoration: none;">Contact</a>
                            </div>
                        </nav>
                    `}),n.add("dental-hero",{label:"Hero Banner",category:"Dental Components",media:'<span style="font-size: 20px;">🦷</span>',content:`
                        <section style="padding: 60px 24px; background: linear-gradient(135deg, #700030 0%, #2A0845 100%); color: #ffffff; text-align: center; border-radius: 16px; margin: 15px 0; box-shadow: 0 10px 30px rgba(112,0,48,0.25);">
                            <span style="background: rgba(255,255,255,0.2); backdrop-filter: blur(8px); padding: 7px 16px; border-radius: 30px; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; border: 1px solid rgba(255,255,255,0.3);">Tech Dental Care</span>
                            <h1 style="font-size: 38px; margin: 18px 0 12px; font-weight: 800; line-height: 1.2;">Advanced Digital Dentistry in Dhaka</h1>
                            <p style="font-size: 16px; max-width: 620px; margin: 0 auto 24px; color: #fce7f3; line-height: 1.6;">Painless root canals, single-visit laser teeth whitening, and precision dental implants backed by certified specialists.</p>
                            <div>
                                <a href="/appointment" style="background: #ffffff; color: #700030; font-weight: 800; padding: 13px 32px; border-radius: 30px; text-decoration: none; display: inline-block; box-shadow: 0 4px 18px rgba(0,0,0,0.18); font-size: 15px;">Book Appointment Now &rarr;</a>
                            </div>
                        </section>
                    `}),n.add("dental-services-grid",{label:"Treatments Grid",category:"Dental Components",media:'<span style="font-size: 20px;">💎</span>',content:`
                        <div style="padding: 30px 10px; margin: 15px 0; font-family: sans-serif;">
                            <h2 style="text-align: center; font-size: 28px; color: #0f172a; margin-bottom: 24px; font-weight: 800;">Our Specialized Treatments</h2>
                            <div style="display: flex; gap: 18px; flex-wrap: wrap; justify-content: center;">
                                <div style="flex: 1; min-width: 240px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 22px; box-shadow: 0 4px 14px rgba(0,0,0,0.04); text-align: left;">
                                    <div style="font-size: 30px; margin-bottom: 10px;">🦷</div>
                                    <h3 style="font-size: 18px; font-weight: 800; color: #700030; margin-bottom: 6px;">Single-Sitting RCT</h3>
                                    <p style="font-size: 13px; color: #64748b; line-height: 1.5; margin-bottom: 12px;">Rotary pain-free root canal treatment with apex locator precision.</p>
                                    <span style="font-weight: 800; color: #059669; font-size: 14px;">From ৳ 4,500</span>
                                </div>
                                <div style="flex: 1; min-width: 240px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 22px; box-shadow: 0 4px 14px rgba(0,0,0,0.04); text-align: left;">
                                    <div style="font-size: 30px; margin-bottom: 10px;">💎</div>
                                    <h3 style="font-size: 18px; font-weight: 800; color: #700030; margin-bottom: 6px;">Laser Teeth Whitening</h3>
                                    <p style="font-size: 13px; color: #64748b; line-height: 1.5; margin-bottom: 12px;">Get 6-8 shades whiter smile in a single 45-minute clinic session.</p>
                                    <span style="font-weight: 800; color: #059669; font-size: 14px;">৳ 6,000</span>
                                </div>
                                <div style="flex: 1; min-width: 240px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 22px; box-shadow: 0 4px 14px rgba(0,0,0,0.04); text-align: left;">
                                    <div style="font-size: 30px; margin-bottom: 10px;">📐</div>
                                    <h3 style="font-size: 18px; font-weight: 800; color: #700030; margin-bottom: 6px;">Invisible Aligners</h3>
                                    <p style="font-size: 13px; color: #64748b; line-height: 1.5; margin-bottom: 12px;">Clear orthodontic aligners for teeth straightening without metal wires.</p>
                                    <span style="font-weight: 800; color: #059669; font-size: 14px;">From ৳ 50,000</span>
                                </div>
                            </div>
                        </div>
                    `});const S=()=>{const x=o.getWrapper();x&&Ne([Y(x)])};o.on("load",()=>{try{o.runCommand("sw-visibility")}catch{}S();try{const h=o.getWrapper(),m=h.find("h1")[0]||h.find("h2")[0];m&&(o.select(m),C(m.cid),M(m.get("tagName")?.toUpperCase()||"Heading"))}catch{}const x=document.getElementById(`${s}-blocks`);x&&x.addEventListener("click",h=>{const m=h.target.closest(".gjs-block");if(m){const $=m.getAttribute("title")||m.textContent?.trim();if($){const K=o.BlockManager.get($)||o.BlockManager.getAll().find(X=>X.get("label")===$||X.getId()===$);K&&o.addComponents(K.get("content"))}}})}),o.on("component:selected",x=>{if(x){C(x.cid);const h=x.get("tagName")||x.getName()||"Element",m=x.getClasses()||[];M(h),W(m)}else C(""),M("Body"),W([]);j("styles")});const w=()=>{const x=o.getHtml(),h=o.getCss();Me.current=(x||"")+(h?`
<style>
${h}
</style>`:""),S()};o.on("update",w),o.on("component:add",w),o.on("component:remove",w),o.on("component:update",w),o.on("style:property:update",w),i.current=o,E(!1)}catch(s){console.error("Failed to initialize GrapesJS:",s),E(!1)}})(),()=>{if(t=!1,i.current)try{i.current.destroy()}catch{}}},[]),l.useEffect(()=>{const t=document.getElementById(`${r.current}-blocks`);if(!t)return;t.querySelectorAll(".gjs-block").forEach(p=>{const c=(p.textContent||"").toLowerCase(),s=z.trim()===""||c.includes(z.toLowerCase());p.style.display=s?"flex":"none"})},[z]);const D=t=>{i.current&&(ve(t),i.current.setDevice(t),H(!1))},De=()=>{if(!i.current)return;const t=!_;we(t),t?i.current.runCommand("sw-visibility"):i.current.stopCommand("sw-visibility")},Ee=()=>{document.fullscreenElement?document.exitFullscreen().then(()=>R(!1)).catch(()=>{}):document.documentElement.requestFullscreen().then(()=>R(!0)).catch(()=>{})},Le=()=>{if(!i.current)return;i.current.Commands.isActive("preview")?(i.current.stopCommand("preview"),O(!1)):(i.current.runCommand("preview"),O(!0))},Pe=()=>{if(i.current){const t=i.current.getSelected();t&&t.remove()}},J=()=>{if(!i.current)return;B(!0);const t=i.current.getHtml(),a=i.current.getCss(),p=(t||"")+(a?`
<style>
${a}
</style>`:"");Ae.put(route("pages.update",d.id),{title:d.title,slug:d.slug,content:p},{preserveState:!0,preserveScroll:!0,onSuccess:()=>{B(!1),L(!0),setTimeout(()=>L(!1),3e3)},onError:()=>{B(!1),alert("Failed to save page changes.")}})},Q=(t,a=0)=>{const p=Ce===t.cid,c=t.children&&t.children.length>0,s=U[t.cid]!==void 0?U[t.cid]:t.name==="Header"||t.name==="Text"&&c,g=o=>{o.stopPropagation(),i.current&&t.model&&(i.current.select(t.model),C(t.cid))},u=o=>{o.stopPropagation(),ze(n=>({...n,[t.cid]:!s}))};return e.jsxs("div",{className:"flex flex-col",children:[e.jsxs("div",{onClick:g,className:`group flex items-center h-6 text-xs cursor-pointer select-none transition-colors pr-2 ${p?"bg-[#e0f2fe] text-[#0284c7] font-medium":"text-gray-800 hover:bg-gray-50"}`,style:{paddingLeft:`${Math.max(8,a*10+8)}px`},children:[e.jsx("div",{onClick:c?u:void 0,className:"w-3.5 h-3.5 flex items-center justify-center mr-0.5 text-gray-500 hover:text-gray-800 cursor-pointer",children:c?s?e.jsx("span",{className:"text-[8px] leading-none text-gray-600",children:"▸"}):e.jsx("span",{className:"text-[8px] leading-none text-gray-600",children:"▾"}):e.jsx("span",{className:"w-1.5"})}),e.jsxs("div",{className:"w-3.5 h-3.5 flex items-center justify-center mr-1 shrink-0",children:[t.iconType==="box"&&e.jsx("div",{className:`w-2.5 h-2.5 border rounded-xs ${p?"border-[#0284c7]":"border-gray-600"}`}),t.iconType==="H"&&e.jsx("span",{className:`font-serif font-bold text-xs leading-none ${p?"text-[#0284c7]":"text-gray-800"}`,children:"H"}),t.iconType==="T"&&e.jsx("span",{className:`font-sans font-bold text-xs leading-none ${p?"text-[#0284c7]":"text-gray-800"}`,children:"T"}),t.iconType==="img"&&e.jsx(_e,{size:11,className:p?"text-[#0284c7]":"text-gray-500"}),t.iconType==="link"&&e.jsx(tt,{size:11,className:p?"text-[#0284c7]":"text-gray-500"})]}),e.jsx("span",{className:"truncate flex-1 text-[11.5px]",children:t.name}),e.jsx("div",{className:"opacity-0 group-hover:opacity-100 flex items-center gap-1 text-gray-400 transition-opacity",children:e.jsx("button",{type:"button",onClick:o=>{if(o.stopPropagation(),t.model){const n=t.model.getStyle(),S=n.display==="none";t.model.setStyle({...n,display:S?"":"none"}),i.current?.trigger("change:canvasOffset")}},className:"p-0.5 hover:text-gray-700",title:"Toggle Visibility",children:e.jsx(se,{size:11})})})]}),c&&!s&&e.jsx("div",{className:"flex flex-col",children:t.children.map(o=>Q(o,a+1))})]},t.cid)};return e.jsxs("div",{className:"fixed inset-0 w-screen h-screen z-50 flex flex-col bg-white overflow-hidden select-none font-sans text-slate-800 antialiased",children:[e.jsx(Fe,{title:`Visual Builder — ${d.title}`}),e.jsxs("header",{className:"h-[42px] bg-white border-b border-gray-200 flex items-center z-30 select-none",children:[e.jsx("div",{className:"w-[240px] h-full border-r border-gray-200 px-3 flex items-center justify-between shrink-0 bg-white",children:b?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"text-xs font-bold text-gray-800",children:"Blocks"}),e.jsx("button",{type:"button",onClick:()=>P(!1),className:"text-gray-400 hover:text-gray-700 p-0.5 cursor-pointer",title:"Close Blocks",children:e.jsx(te,{size:14})})]}):e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"flex items-center gap-1.5 text-xs font-semibold text-gray-800",children:[e.jsx(Ie,{size:14,className:"text-gray-700"}),e.jsx("span",{children:"Pages"})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("button",{type:"button",onClick:()=>alert(`Active Page: ${d.title}`),className:"text-gray-500 hover:text-gray-800 p-0.5 cursor-pointer",title:"Add Page",children:e.jsx(ee,{size:13,className:"stroke-[2.5]"})}),e.jsx("button",{type:"button",onClick:()=>ke(!T),className:"text-gray-500 hover:text-gray-800 p-0.5 cursor-pointer",title:"Toggle Pages",children:e.jsx(Oe,{size:13,className:`transition-transform duration-200 ${T?"rotate-180":""}`})})]})]})}),e.jsxs("div",{className:"flex-1 h-full px-3 flex items-center justify-between bg-white",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("button",{type:"button",onClick:()=>P(!b),className:"w-7 h-7 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-md flex items-center justify-center transition shadow-xs cursor-pointer",title:b?"Close Blocks":"Add Blocks",children:b?e.jsx(te,{size:15}):e.jsx(ee,{size:16,className:"stroke-[2.5]"})}),e.jsxs(Z,{href:route("pages.edit",d.id),className:"flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 px-2 py-1 rounded hover:bg-gray-100 transition",title:"Back to Pages",children:[e.jsx(Re,{size:13}),e.jsx("span",{className:"hidden sm:inline font-medium text-[11px]",children:"Pages"})]})]}),e.jsxs("div",{className:"relative",children:[e.jsxs("button",{type:"button",onClick:()=>H(!I),className:"flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 rounded text-xs font-semibold text-gray-700 hover:border-gray-300 shadow-2xs cursor-pointer",children:[y==="Desktop"&&e.jsx(re,{size:13}),y==="Tablet"&&e.jsx(ae,{size:13}),y==="Mobile"&&e.jsx(oe,{size:13}),e.jsx("span",{children:y}),e.jsx(Ve,{size:12,className:"text-gray-400 ml-0.5"})]}),I&&e.jsxs("div",{className:"absolute top-full mt-1 left-1/2 -translate-x-1/2 w-36 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50 text-xs",children:[e.jsxs("button",{type:"button",onClick:()=>D("Desktop"),className:"w-full flex items-center gap-2 px-3 py-1.5 hover:bg-purple-50 hover:text-[#7c3aed] text-left font-medium",children:[e.jsx(re,{size:13}),e.jsx("span",{children:"Desktop (100%)"})]}),e.jsxs("button",{type:"button",onClick:()=>D("Tablet"),className:"w-full flex items-center gap-2 px-3 py-1.5 hover:bg-purple-50 hover:text-[#7c3aed] text-left font-medium",children:[e.jsx(ae,{size:13}),e.jsx("span",{children:"Tablet (768px)"})]}),e.jsxs("button",{type:"button",onClick:()=>D("Mobile"),className:"w-full flex items-center gap-2 px-3 py-1.5 hover:bg-purple-50 hover:text-[#7c3aed] text-left font-medium",children:[e.jsx(oe,{size:13}),e.jsx("span",{children:"Mobile (375px)"})]})]})]}),e.jsxs("div",{className:"flex items-center gap-1",children:[e.jsx("button",{type:"button",onClick:De,className:`p-1.5 rounded transition cursor-pointer ${_?"text-[#7c3aed] bg-purple-50":"text-gray-600 hover:bg-gray-100"}`,title:"Component Outlines",children:e.jsx(ie,{size:14,className:"stroke-[2]"})}),e.jsx("button",{type:"button",onClick:Le,className:`p-1.5 rounded transition cursor-pointer ${N?"text-amber-600 bg-amber-50":"text-gray-600 hover:bg-gray-100"}`,title:"Preview Mode",children:N?e.jsx(qe,{size:14}):e.jsx(se,{size:14})}),e.jsx("button",{type:"button",onClick:Ee,className:"p-1.5 rounded text-gray-600 hover:bg-gray-100 transition cursor-pointer",title:"Fullscreen",children:e.jsx(rt,{size:14})}),e.jsx("button",{type:"button",onClick:()=>i.current?.runCommand("export-template"),className:"p-1.5 rounded text-gray-600 hover:bg-gray-100 transition cursor-pointer",title:"View Code",children:e.jsx(ne,{size:14})}),e.jsx("button",{type:"button",onClick:()=>i.current?.runCommand("export-template"),className:"p-1.5 rounded text-gray-600 hover:bg-gray-100 transition cursor-pointer",title:"Export Template",children:e.jsx(Ue,{size:14})}),e.jsx("button",{type:"button",onClick:Pe,className:"p-1.5 rounded text-gray-600 hover:text-red-600 hover:bg-red-50 transition cursor-pointer",title:"Delete Selected",children:e.jsx(Ge,{size:14})}),e.jsx("button",{type:"button",onClick:J,disabled:k,className:"p-1.5 rounded text-[#7c3aed] hover:bg-purple-50 transition cursor-pointer",title:"Save Changes",children:k?e.jsx(We,{size:14,className:"animate-spin"}):e.jsx(Ye,{size:14})}),e.jsx("button",{type:"button",onClick:()=>i.current?.runCommand("core:undo"),className:"p-1.5 rounded text-gray-600 hover:bg-gray-100 transition cursor-pointer",title:"Undo",children:e.jsx(nt,{size:14})}),e.jsx("button",{type:"button",onClick:()=>i.current?.runCommand("core:redo"),className:"p-1.5 rounded text-gray-600 hover:bg-gray-100 transition cursor-pointer",title:"Redo",children:e.jsx(st,{size:14})}),e.jsx("button",{type:"button",onClick:()=>j(v==="properties"?"styles":"properties"),className:"p-1.5 rounded text-gray-600 hover:bg-gray-100 transition cursor-pointer",title:"Settings",children:e.jsx(He,{size:14})}),e.jsx("button",{type:"button",onClick:J,disabled:k,className:"ml-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-3 py-1 rounded text-xs font-semibold shadow-xs transition cursor-pointer flex items-center gap-1.5",children:ye?e.jsxs(e.Fragment,{children:[e.jsx(Je,{size:13,className:"text-white"}),e.jsx("span",{children:"Saved"})]}):k?e.jsx("span",{children:"Saving..."}):e.jsx("span",{children:"Update"})})]})]}),e.jsxs("div",{className:"w-[270px] h-full border-l border-gray-200 flex items-center bg-white shrink-0",children:[e.jsx("button",{type:"button",onClick:()=>j("styles"),className:`flex-1 h-full flex items-center justify-center text-xs font-semibold transition border-b-2 cursor-pointer ${v==="styles"?"text-[#7c3aed] border-[#7c3aed] font-bold":"text-gray-500 border-transparent hover:text-gray-800"}`,children:"Styles"}),e.jsx("button",{type:"button",onClick:()=>j("properties"),className:`flex-1 h-full flex items-center justify-center text-xs font-semibold transition border-b-2 cursor-pointer ${v==="properties"?"text-[#7c3aed] border-[#7c3aed] font-bold":"text-gray-500 border-transparent hover:text-gray-800"}`,children:"Properties"})]})]}),e.jsxs("div",{className:"flex-1 flex overflow-hidden relative bg-[#ececec]",children:[e.jsxs("aside",{className:`w-[240px] bg-white border-r border-gray-200 flex flex-col h-full z-20 select-none shadow-2xs transition-all duration-200 shrink-0 ${N?"-ml-[240px]":"ml-0"}`,children:[e.jsxs("div",{className:`flex flex-col h-full bg-white ${b?"flex":"hidden"}`,children:[e.jsxs("div",{className:"p-3 border-b border-gray-100",children:[e.jsxs("div",{className:"flex items-center bg-gray-100 p-0.5 rounded-full text-[11px] font-semibold mb-2",children:[e.jsx("button",{type:"button",onClick:()=>A("regular"),className:`flex-1 py-0.5 rounded-full text-center transition cursor-pointer ${F==="regular"?"bg-white text-[#7c3aed] shadow-2xs font-bold":"text-gray-500 hover:text-gray-800"}`,children:"Regular"}),e.jsx("button",{type:"button",onClick:()=>A("symbols"),className:`flex-1 py-0.5 rounded-full text-center transition cursor-pointer ${F==="symbols"?"bg-white text-[#7c3aed] shadow-2xs font-bold":"text-gray-500 hover:text-gray-800"}`,children:"Symbols"})]}),e.jsx("div",{className:"relative",children:e.jsx("input",{type:"text",placeholder:"Search...",value:z,onChange:t=>Te(t.target.value),className:"w-full text-xs px-2.5 py-1 bg-white border border-gray-200 rounded focus:ring-1 focus:ring-[#7c3aed] focus:border-[#7c3aed] focus:outline-none placeholder:text-gray-400 font-normal"})})]}),e.jsx("div",{className:"flex-1 overflow-y-auto p-2.5 bg-white custom-scrollbar",children:e.jsx("div",{id:`${r.current}-blocks`,className:"gjs-studio-blocks-grid"})})]}),e.jsxs("div",{className:`flex flex-col h-full bg-white ${b?"hidden":"flex"}`,children:[!T&&e.jsx("div",{className:"px-2 py-1.5 border-b border-gray-100",children:e.jsxs("div",{className:"relative group flex items-center justify-between px-2.5 py-1.5 bg-[#f3f4f6] rounded text-xs font-semibold text-gray-800",children:[e.jsx("span",{className:"truncate max-w-[160px]",children:d.title&&d.title!=="New Untitled Page"?d.title:"Web"}),e.jsx("button",{type:"button",onClick:()=>je(!V),className:"text-gray-400 hover:text-gray-700 p-0.5 rounded hover:bg-gray-200/60 cursor-pointer",title:"Page Options",children:e.jsx(et,{size:13})}),V&&e.jsxs("div",{className:"absolute right-0 top-full mt-1 w-36 bg-white border border-gray-200 rounded shadow-md py-1 z-30 text-xs",children:[e.jsx("a",{href:`/page/${d.slug}`,target:"_blank",rel:"noreferrer",className:"block px-3 py-1.5 hover:bg-gray-50 text-gray-700 font-medium",children:"View Live Page"}),e.jsx(Z,{href:route("pages.edit",d.id),className:"block px-3 py-1.5 hover:bg-gray-50 text-gray-700 font-medium",children:"Page Settings"})]})]})}),e.jsxs("div",{className:"flex items-center gap-1.5 px-3 py-2 border-b border-gray-100 text-xs font-bold text-gray-800 bg-white",children:[e.jsx(Qe,{size:13,className:"text-gray-600"}),e.jsx("span",{children:"Layers"})]}),e.jsx("div",{className:"flex-1 overflow-y-auto py-1 custom-scrollbar bg-white",children:q.length>0?q.map(t=>Q(t,0)):e.jsx("div",{className:"p-3 text-xs text-gray-400 text-center",children:"Loading layers..."})})]})]}),e.jsxs("main",{className:"flex-1 relative h-full overflow-hidden flex flex-col items-center justify-center p-3 bg-[#ececec]",children:[be&&e.jsxs("div",{className:"absolute inset-0 bg-white/90 z-40 flex flex-col items-center justify-center gap-2",children:[e.jsx("div",{className:"w-8 h-8 border-2 border-[#7c3aed] border-t-transparent rounded-full animate-spin"}),e.jsx("span",{className:"text-xs font-semibold text-gray-600",children:"Loading GrapesJS Studio..."})]}),e.jsx("div",{className:`relative h-full flex flex-col items-center transition-all duration-200 ${y==="Desktop"?"w-full":y==="Tablet"?"w-[768px]":"w-[375px]"}`,children:e.jsx("div",{id:r.current,className:"w-full flex-1 bg-white rounded-lg shadow-sm overflow-hidden relative border border-gray-300/70"})})]}),e.jsxs("aside",{className:`w-[270px] bg-white border-l border-gray-200 flex flex-col h-full z-20 select-none shadow-2xs transition-all duration-200 shrink-0 ${N?"-mr-[270px]":"mr-0"}`,children:[e.jsxs("div",{className:`flex-1 overflow-y-auto p-2.5 text-xs bg-white custom-scrollbar ${v==="styles"?"block":"hidden"}`,children:[e.jsxs("div",{className:"pb-2.5 border-b border-gray-200 mb-2.5 space-y-2",children:[e.jsxs("div",{className:"flex items-center justify-between text-xs",children:[e.jsxs("span",{className:"font-semibold text-gray-700 flex items-center gap-1",children:[e.jsx(ot,{size:12,className:"text-gray-500"}),e.jsx("span",{children:"Selection"})]}),e.jsxs("select",{value:$e,onChange:t=>Be(t.target.value),className:"text-[11px] text-gray-600 bg-white border border-gray-200 rounded px-1.5 py-0.5 focus:outline-none",children:[e.jsx("option",{children:"- State -"}),e.jsx("option",{children:":hover"}),e.jsx("option",{children:":active"}),e.jsx("option",{children:":focus"})]})]}),e.jsxs("div",{className:"flex items-center gap-1.5 border border-gray-200 rounded p-1 bg-white",children:[e.jsx(Ke,{size:12,className:"text-gray-400 ml-0.5"}),e.jsx("button",{type:"button",className:"text-[#7c3aed] text-xs font-bold px-1 hover:bg-purple-50 rounded",children:"+"}),G.length>0?G.map((t,a)=>e.jsx("span",{className:"bg-pink-50 text-pink-700 border border-pink-200 px-1.5 py-0.2 rounded text-[10px] font-medium",children:t},a)):e.jsx("span",{className:"text-[10px] text-pink-600 bg-pink-50 border border-pink-200 px-1.5 py-0.2 rounded",children:"+ title"})]}),e.jsxs("div",{className:"flex items-center gap-1.5 border border-purple-200/60 rounded p-1 bg-purple-50/20",children:[e.jsx("div",{className:"w-5 h-5 bg-[#7c3aed] text-white rounded flex items-center justify-center",children:e.jsx(Ze,{size:11})}),e.jsx("span",{className:"bg-[#3b82f6] text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-2xs",children:Se})]}),e.jsxs("div",{className:"flex items-center justify-between text-gray-400 px-1 pt-0.5",children:[e.jsx(Xe,{size:13,className:"hover:text-gray-700 cursor-pointer"}),e.jsx(ie,{size:13,className:"hover:text-gray-700 cursor-pointer"}),e.jsx(ne,{size:13,className:"hover:text-gray-700 cursor-pointer"})]})]}),e.jsx("div",{id:`${r.current}-styles`,className:"gjs-studio-styles"})]}),e.jsxs("div",{className:`flex-1 overflow-y-auto p-2.5 text-xs bg-white custom-scrollbar ${v==="properties"?"block":"hidden"}`,children:[e.jsx("div",{className:"pb-2 border-b border-gray-200 mb-2 font-bold text-gray-700 text-xs",children:"Component Attributes"}),e.jsx("div",{id:`${r.current}-traits`,className:"gjs-studio-traits"})]})]})]}),e.jsx("style",{dangerouslySetInnerHTML:{__html:`
                /* 1. COMPLETELY HIDE ALL DEFAULT FLOATING OVERLAYS */
                .gjs-pn-panels,
                .gjs-pn-views-container,
                .gjs-pn-commands,
                .gjs-pn-devices-c,
                .gjs-pn-options,
                .gjs-pn-views {
                    display: none !important;
                }

                #${r.current} .gjs-editor {
                    height: 100% !important;
                    width: 100% !important;
                    position: absolute !important;
                    inset: 0 !important;
                }
                #${r.current} .gjs-cv-canvas {
                    height: 100% !important;
                    width: 100% !important;
                    top: 0 !important;
                    left: 0 !important;
                    position: absolute !important;
                }
                #${r.current} .gjs-frame-wrapper {
                    height: 100% !important;
                }
                #${r.current} iframe.gjs-frame {
                    height: 100% !important;
                    width: 100% !important;
                    border: none !important;
                }

                /* 2. BLOCKS DRAWER (Screenshot 2 & 3: 2-column white square tiles) */
                #${r.current}-blocks .gjs-block-categories,
                #${r.current}-blocks .gjs-block-category,
                #${r.current}-blocks .gjs-category {
                    background: transparent !important;
                    border: none !important;
                    margin-bottom: 8px !important;
                }
                #${r.current}-blocks .gjs-blocks-c {
                    display: grid !important;
                    grid-template-columns: repeat(2, 1fr) !important;
                    gap: 6px !important;
                    padding: 4px 0 !important;
                    background: transparent !important;
                }
                #${r.current}-blocks .gjs-block {
                    width: 100% !important;
                    min-height: 64px !important;
                    background: #ffffff !important;
                    border: 1px solid #e2e8f0 !important;
                    border-radius: 6px !important;
                    padding: 8px 4px !important;
                    margin: 0 !important;
                    color: #1e293b !important;
                    font-size: 11px !important;
                    font-weight: 500 !important;
                    text-align: center !important;
                    display: flex !important;
                    flex-direction: column !important;
                    align-items: center !important;
                    justify-content: center !important;
                    cursor: pointer !important;
                    transition: all 0.15s ease !important;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.02) !important;
                }
                #${r.current}-blocks .gjs-block:hover {
                    border-color: #7c3aed !important;
                    color: #7c3aed !important;
                    box-shadow: 0 2px 8px rgba(124, 58, 237, 0.1) !important;
                }
                #${r.current}-blocks .gjs-block-label {
                    margin-top: 5px !important;
                    font-size: 11px !important;
                    line-height: 1.2 !important;
                }
                #${r.current}-blocks .gjs-block svg {
                    stroke: currentColor !important;
                }
                #${r.current}-blocks .gjs-title {
                    font-size: 11px !important;
                    font-weight: 700 !important;
                    color: #374151 !important;
                    background: #ffffff !important;
                    border: none !important;
                    border-bottom: 1px solid #f1f5f9 !important;
                    padding: 8px 2px 4px !important;
                    margin: 8px 0 2px !important;
                    cursor: pointer !important;
                    display: flex !important;
                    justify-content: space-between !important;
                    align-items: center !important;
                }

                /* 3. STYLE MANAGER: FORCE PURE WHITE THEME (Screenshot 5) */
                #${r.current}-styles {
                    background: #ffffff !important;
                }
                #${r.current}-styles .gjs-sm-sector {
                    background-color: #ffffff !important;
                    border-bottom: 1px solid #f1f5f9 !important;
                    margin-bottom: 2px !important;
                }
                #${r.current}-styles .gjs-sm-sector-title {
                    background: #ffffff !important;
                    color: #1e293b !important;
                    font-size: 11.5px !important;
                    font-weight: 600 !important;
                    padding: 8px 4px !important;
                    cursor: pointer !important;
                    display: flex !important;
                    justify-content: space-between !important;
                    align-items: center !important;
                    border-bottom: none !important;
                }
                #${r.current}-styles .gjs-sm-sector-title::after {
                    content: "•";
                    color: #f59e0b;
                    font-size: 14px;
                    margin-left: auto;
                    margin-right: 6px;
                }
                #${r.current}-styles .gjs-sm-properties {
                    background-color: #ffffff !important;
                    padding: 4px 2px 10px !important;
                }
                #${r.current}-styles .gjs-sm-property {
                    background-color: #ffffff !important;
                    margin-bottom: 8px !important;
                }
                #${r.current}-styles .gjs-sm-label {
                    font-size: 10.5px !important;
                    color: #64748b !important;
                    font-weight: 600 !important;
                    margin-bottom: 3px !important;
                }
                #${r.current}-styles .gjs-fields {
                    background-color: transparent !important;
                }
                #${r.current}-styles .gjs-field {
                    background-color: #ffffff !important;
                    border: 1px solid #d1d5db !important;
                    border-radius: 4px !important;
                    color: #1e293b !important;
                    font-size: 11px !important;
                }
                #${r.current}-styles .gjs-field input,
                #${r.current}-styles .gjs-field select,
                #${r.current}-styles input, 
                #${r.current}-styles select {
                    background: #ffffff !important;
                    border: 1px solid #d1d5db !important;
                    border-radius: 4px !important;
                    color: #1e293b !important;
                    font-size: 11px !important;
                    padding: 4px 6px !important;
                }
                #${r.current}-styles .gjs-radio-item {
                    background: #ffffff !important;
                    border: 1px solid #d1d5db !important;
                    color: #374151 !important;
                }
                #${r.current}-styles .gjs-radio-item.gjs-radio-item-active {
                    background: #7c3aed !important;
                    color: #ffffff !important;
                }
                #${r.current}-styles input:focus, 
                #${r.current}-styles select:focus {
                    border-color: #7c3aed !important;
                    outline: none !important;
                }

                /* Thin clean scrollbars */
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 4px;
                }
            `}})]})}export{zt as default};
