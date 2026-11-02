import{c as be,r as h,j as s,e as Me,P as Ee,g as Pe,u as ke,h as Ie,m as G,i as Be,I as ee,B as Te,k as qe,s as De}from"./index-DBt_IHmf.js";/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xe=be("CircleAlert",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ze=be("CircleCheck",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]),Se=h.forwardRef(({className:e,...r},a)=>s.jsx("textarea",{className:Me("flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",e),ref:a,...r}));Se.displayName="Textarea";var Ve="Label",je=h.forwardRef((e,r)=>s.jsx(Ee.label,{...e,ref:r,onMouseDown:a=>{var u;a.target.closest("button, input, select, textarea")||((u=e.onMouseDown)==null||u.call(e,a),!a.defaultPrevented&&a.detail>1&&a.preventDefault())}}));je.displayName=Ve;var Le=je;const Ye=Pe("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"),X=h.forwardRef(({className:e,...r},a)=>s.jsx(Le,{ref:a,className:Me(Ye(),e),...r}));X.displayName=Le.displayName;const _e=24e5,te=Math.PI*2,ve={"top-right":{flipX:0,flipY:0,side:0},"top-left":{flipX:1,flipY:0,side:0},"bottom-right":{flipX:0,flipY:1,side:0},"bottom-left":{flipX:1,flipY:1,side:0},right:{flipX:0,flipY:0,side:1},left:{flipX:1,flipY:0,side:1}},Ge=`#version 300 es
const vec2 corners[3] = vec2[3](vec2(-1.0, -1.0), vec2(3.0, -1.0), vec2(-1.0, 3.0));
void main() {
  gl_Position = vec4(corners[gl_VertexID], 0.0, 1.0);
}`,Oe=`#version 300 es
precision highp float;
uniform vec2 uResolution;
uniform float uTime;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uBlend;
uniform float uIntensity;
uniform float uSpread;
uniform float uDensity;
uniform float uSharpness;
uniform float uFalloff;
uniform float uGlow;
uniform float uSaturation;
uniform float uDust;
uniform float uOpacity;
uniform float uReveal;
uniform float uLight;
uniform vec3 uFrame;
uniform float uAim;
uniform vec3 uFocus;
uniform float uSway;
out vec4 fragColor;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = p - i;
  vec2 w = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, w.x), mix(c, d, w.x), w.y);
}

float shafts(float u, float t, float seed, float aa) {
  float sway = (0.4 * sin(t * 0.31 + seed) + 0.24 * sin(t * 0.17 + seed * 2.3)) * uSway;
  float n = 0.7 * noise(vec2(u + sway + seed, t * 0.3)) + 0.3 * noise(vec2(u * 2.4 + sway * 1.5 + seed * 1.7, t * 0.45 + 3.0));
  float width = mix(0.5, 0.1, uSharpness);
  float s = mix(smoothstep(0.5 - width, 0.5 + width, n), 0.5, aa);
  return mix(0.05, 1.0, s);
}

float motes(vec2 p, float cell, float t, float seed) {
  p += vec2(t * 0.021, -t * 0.013) + seed * 7.31;
  vec2 grid = p / cell;
  vec2 id = floor(grid);
  vec2 f = grid - id;
  float h = hash(id + seed);
  if (h > 0.5) return 0.0;
  vec2 center = 0.25 + 0.5 * vec2(hash(id + 1.7 + seed), hash(id + 3.1 + seed));
  center += 0.1 * vec2(sin(t * 0.7 + h * 31.0), cos(t * 0.6 + h * 23.0));
  float size = mix(0.035, 0.09, hash(id + 5.3 + seed));
  float edge = length(fwidth(grid)) * 0.7;
  float twinkle = 0.55 + 0.45 * sin(t * 1.9 + h * 41.0);
  return (1.0 - smoothstep(size - edge, size + edge, length(f - center))) * twinkle;
}

void main() {
  float aspect = uResolution.x / uResolution.y;
  vec2 q = (gl_FragCoord.xy - 0.5 * uResolution) / uResolution.y;
  if (uFrame.x > 0.5) q.x = -q.x;
  if (uFrame.y > 0.5) q.y = -q.y;
  vec2 source = uFrame.z > 0.5 ? vec2(aspect * 0.5 + 0.42, 0.3) : vec2(aspect * 0.5 + 0.1, 0.62);
  float heading = (uFrame.z > 0.5 ? 3.42 : -2.48) + uAim + 0.035 * sin(uTime * 0.21) * uSway;
  vec2 v = q - source;
  float r = length(v);
  float angle = mod(atan(v.y, v.x) - heading + 3.14159265, 6.28318531) - 3.14159265;
  float t = uTime;
  float u = angle * uDensity;
  float aa = smoothstep(0.12, 0.45, fwidth(u));
  float offset = uSpread * 0.22;
  float fanA = exp(-pow((angle + offset) / uSpread, 2.0) * 1.4);
  float fanB = exp(-pow((angle - offset) / (uSpread * 1.15), 2.0) * 1.4);
  float focus = 1.0 + uFocus.z * exp(-pow((angle - uFocus.x) / uFocus.y, 2.0));
  float lightA = fanA * shafts(u, t, 0.0, aa) * focus;
  float lightB = fanB * shafts(u * 0.83, t * 0.6, 17.0, aa) * focus;
  float reach = 1.0 / (1.0 + pow(r / 0.4, uFalloff));
  vec3 glowColor = mix(uColorA, uColorB, uBlend);
  vec3 light = (uColorA * lightA * (1.0 - uBlend) + uColorB * lightB * uBlend) * 2.0 * reach;
  light += glowColor * uGlow * exp(-pow(r / 0.4, 2.0));
  if (uDust > 0.0) {
    float sparkle = motes(q, 0.06, t, 0.0) + 0.7 * motes(q, 0.038, t * 0.8, 9.0);
    light += mix(glowColor, vec3(1.0), 0.6) * sparkle * (lightA + lightB) * reach * uDust * 2.5;
  }
  light *= uIntensity * (1.0 - smoothstep(uReveal * 2.6 - 0.45, uReveal * 2.6, r)) * smoothstep(0.0, 0.35, uReveal);
  float gray = dot(light, vec3(0.2126, 0.7152, 0.0722));
  light = max(mix(vec3(gray), light, uSaturation), 0.0);
  float peak = max(light.r, max(light.g, light.b));
  float grain = (fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715)))) - 0.5) / 255.0;
  if (uLight > 0.5) {
    vec3 ink = pow(light / max(peak, 1e-4), vec3(2.0)) * 0.75;
    float alpha = clamp(pow(1.0 - exp(-peak * 2.6), 2.5) * 0.9 * uOpacity + grain, 0.0, 1.0);
    fragColor = vec4(pow(ink, vec3(1.0 / 2.2)) * alpha, alpha);
    return;
  }
  float mapped = 1.0 - exp(-peak);
  vec3 tone = light * (mapped / max(peak, 1e-4));
  tone = mix(tone, vec3(mapped), smoothstep(0.7, 1.0, mapped) * 0.55);
  vec3 shown = clamp(tone * uOpacity, 0.0, 1.0);
  float alpha = max(shown.r, max(shown.g, shown.b));
  vec3 color = clamp(shown * alpha + grain, 0.0, 1.0);
  fragColor = vec4(min(color, vec3(alpha)), alpha);
}`,m=(e,r,a)=>Math.min(a,Math.max(r,e)),Ue=e=>((e+Math.PI)%te+te)%te-Math.PI,ye=e=>{const r=String(e||"").trim(),a=/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(r);if(a){const u=a[1].length===3?a[1].replace(/./g,c=>c+c):a[1];return[0,2,4].map(c=>parseInt(u.slice(c,c+2),16)/255)}const o=/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i.exec(r);return o?[o[1],o[2],o[3]].map(u=>m(parseFloat(u)/255,0,1)):[1,1,1]},$e=(e,r)=>({source:e.side?[r*.5+.42,.3]:[r*.5+.1,.62],heading:e.side?3.42:-2.48}),we=(e,r,a)=>{const o=e.createShader(r);return o?(e.shaderSource(o,a),e.compileShader(o),e.getShaderParameter(o,e.COMPILE_STATUS)?o:(console.error(e.getShaderInfoLog(o)),e.deleteShader(o),null)):null},He=e=>{const r=we(e,e.VERTEX_SHADER,Ge),a=we(e,e.FRAGMENT_SHADER,Oe),o=r&&a?e.createProgram():null;if(!r||!a||!o)return r&&e.deleteShader(r),a&&e.deleteShader(a),null;if(e.attachShader(o,r),e.attachShader(o,a),e.linkProgram(o),e.deleteShader(r),e.deleteShader(a),!e.getProgramParameter(o,e.LINK_STATUS))return console.error(e.getProgramInfoLog(o)),e.deleteProgram(o),null;const u={},c=e.getProgramParameter(o,e.ACTIVE_UNIFORMS);for(let p=0;p<c;p++){const b=e.getActiveUniform(o,p);b&&(u[b.name]=e.getUniformLocation(o,b.name))}return{program:o,uniforms:u}},We=({rayColor1:e="#FFC46B",rayColor2:r="#96c8ff",blend:a=.6,origin:o="top-right",speed:u=2.5,intensity:c=2,spread:p=2,density:b=5,sharpness:O=.5,tilt:U=0,falloff:E=1.6,glow:A=1,saturation:$=1,dust:P=0,followMouse:R=!0,mouseInfluence:F=.5,intro:x=!0,lightMode:M=!1,opacity:k=1,maxDevicePixelRatio:H=2,className:ae="",style:Ne})=>{const se=h.useRef(null),oe=h.useRef(null),I=h.useRef(null),[ne,Ce]=h.useState(0),re={colorA:ye(e),colorB:ye(r),blend:m(a,0,1),frame:ve[o]??ve["top-right"],speed:Math.max(0,u)*.4,intensity:Math.max(0,c)*.75,spread:m(p,.1,8)*.225,density:m(b,1,40),sharpness:m(O,0,1),tilt:m(U,-180,180)*Math.PI/180,falloff:m(E,.2,6),glow:Math.max(0,A)*1.2,saturation:Math.max(0,$),dust:m(P,0,1),followMouse:R,mouseInfluence:m(F,0,1),intro:x,light:M,opacity:m(k,0,1),maxRatio:m(H,.5,3)},z=h.useRef(re);return z.current=re,h.useEffect(()=>{var y;(y=I.current)==null||y.call(I)}),h.useEffect(()=>{const y=se.current,d=oe.current;if(!y||!d)return;const n=d.getContext("webgl2",{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1,powerPreference:"high-performance"}),V=n?He(n):null;if(!n||!V)return;const B=window.matchMedia("(prefers-reduced-motion: reduce)").matches,ie=n.createVertexArray(),w={width:1,height:1},S={x:0,y:0,inside:!1},v={value:0,velocity:0},j={angle:0,strength:0};let le=Math.random()*100,T=z.current.intro&&!B&&ne===0?0:1,L=0,Y=0,W=!0,J=document.visibilityState!=="hidden",K=!1;const Q=()=>{const i=z.current,t=y.getBoundingClientRect(),f=Math.max(1,t.width),g=Math.max(1,t.height),C=Math.min(window.devicePixelRatio||1,i.maxRatio,Math.sqrt(_e/(f*g))),q=Math.max(1,Math.round(f*C)),D=Math.max(1,Math.round(g*C));(d.width!==q||d.height!==D)&&(d.width=q,d.height=D),w.width=f,w.height=g},Ae=i=>{let t=(S.x-w.width/2)/w.height,f=(w.height/2-S.y)/w.height;i.frame.flipX&&(t=-t),i.frame.flipY&&(f=-f);const{source:g,heading:C}=$e(i.frame,w.width/w.height);return Ue(Math.atan2(f-g[1],t-g[0])-C-i.tilt)},ce=i=>{if(L=0,K)return;const t=z.current,f=m((i-Y)/1e3||0,0,.05);Y=Math.max(Y,i),le+=f*t.speed*(B?.3:1),T<1&&(T=Math.min(1,T+f/1.6));const g=t.followMouse&&S.inside&&!B,C=g?Ae(t):0,q=g?m(C,-t.spread,t.spread)*t.mouseInfluence:0,D=g?t.mouseInfluence:0,ge=1-Math.exp(-f*6);g&&(j.angle+=(m(C-v.value,-t.spread*1.5,t.spread*1.5)-j.angle)*ge),j.strength+=(D-j.strength)*ge;const xe=18,Re=2*Math.sqrt(xe);v.velocity+=((q-v.value)*xe-v.velocity*Re)*f,v.value+=v.velocity*f,n.viewport(0,0,d.width,d.height),n.useProgram(V.program),n.bindVertexArray(ie);const l=V.uniforms;n.uniform2f(l.uResolution,d.width,d.height),n.uniform1f(l.uTime,le),n.uniform3f(l.uColorA,t.colorA[0],t.colorA[1],t.colorA[2]),n.uniform3f(l.uColorB,t.colorB[0],t.colorB[1],t.colorB[2]),n.uniform1f(l.uBlend,t.blend),n.uniform1f(l.uIntensity,t.intensity),n.uniform1f(l.uSpread,t.spread),n.uniform1f(l.uDensity,t.density),n.uniform1f(l.uSharpness,t.sharpness),n.uniform1f(l.uFalloff,t.falloff),n.uniform1f(l.uGlow,t.glow),n.uniform1f(l.uSaturation,t.saturation),n.uniform1f(l.uDust,t.dust),n.uniform1f(l.uOpacity,t.opacity),n.uniform1f(l.uReveal,1-Math.pow(1-T,3)),n.uniform1f(l.uLight,t.light?1:0),n.uniform3f(l.uFrame,t.frame.flipX,t.frame.flipY,t.frame.side),n.uniform1f(l.uAim,t.tilt+v.value),n.uniform3f(l.uFocus,j.angle,Math.max(.06,t.spread*.25),j.strength*1.4),n.uniform1f(l.uSway,B?0:1),n.drawArrays(n.TRIANGLES,0,3);const Fe=Math.abs(q-v.value)>1e-4||Math.abs(v.velocity)>1e-4||Math.abs(D-j.strength)>.001;(t.speed>0&&!B||T<1||Fe)&&W&&J&&(L=requestAnimationFrame(ce))},N=()=>{L||K||!W||!J||(Y=performance.now(),L=requestAnimationFrame(ce))};I.current=()=>{Q(),N()};const ue=i=>{const t=y.getBoundingClientRect();S.x=i.clientX-t.left,S.y=i.clientY-t.top,S.inside=i.clientX>=t.left&&i.clientX<=t.right&&i.clientY>=t.top&&i.clientY<=t.bottom,N()},Z=()=>{S.inside=!1,N()},_=i=>{i.pointerType!=="mouse"&&Z()};window.addEventListener("pointermove",ue,{passive:!0}),window.addEventListener("pointerup",_,{passive:!0}),window.addEventListener("pointercancel",_,{passive:!0}),document.documentElement.addEventListener("pointerleave",Z);const de=i=>{i.preventDefault(),K=!0,cancelAnimationFrame(L),L=0},me=()=>Ce(i=>i+1);d.addEventListener("webglcontextlost",de),d.addEventListener("webglcontextrestored",me);const fe=new ResizeObserver(()=>{Q(),N()});fe.observe(y);const he=new IntersectionObserver(i=>{W=i.some(t=>t.isIntersecting),N()});he.observe(y);const pe=()=>{J=document.visibilityState!=="hidden",N()};return document.addEventListener("visibilitychange",pe),Q(),N(),()=>{cancelAnimationFrame(L),I.current=null,fe.disconnect(),he.disconnect(),window.removeEventListener("pointermove",ue),window.removeEventListener("pointerup",_),window.removeEventListener("pointercancel",_),document.documentElement.removeEventListener("pointerleave",Z),document.removeEventListener("visibilitychange",pe),d.removeEventListener("webglcontextlost",de),d.removeEventListener("webglcontextrestored",me),n.isContextLost()||(n.deleteVertexArray(ie),n.deleteProgram(V.program))}},[ne]),s.jsx("div",{ref:se,className:`side-rays${ae?` ${ae}`:""}`,style:Ne,children:s.jsx("canvas",{ref:oe,className:"side-rays__canvas","aria-hidden":"true"})})},Je={ru:{title:"Связаться со мной",subtitle:"Отправьте сообщение, и я отвечу вам в ближайшее время.",nameLabel:"Ваше имя *",namePlaceholder:"Иван Иванов",contactLabel:"Контакт для связи (опционально)",contactPlaceholder:"Telegram, email или телефон",messageLabel:"Сообщение *",messagePlaceholder:"Опишите ваш вопрос или предложение...",sendButton:"Отправить сообщение",sendingButton:"Отправка...",successMessage:"Сообщение отправлено! Я отвечу вам в ближайшее время.",errorMessage:"Ошибка отправки. Попробуйте написать мне напрямую.",requiredFields:"Пожалуйста, заполните все обязательные поля.",rateLimited:"Слишком много запросов. Попробуйте через 10 минут."},en:{title:"Get in Touch",subtitle:"Send a message and I'll get back to you as soon as possible.",nameLabel:"Your Name *",namePlaceholder:"John Doe",contactLabel:"Contact Info (optional)",contactPlaceholder:"Telegram, email or phone number",messageLabel:"Message *",messagePlaceholder:"Describe your question or proposal...",sendButton:"Send Message",sendingButton:"Sending...",successMessage:"Message sent! I'll get back to you soon.",errorMessage:"Failed to send. Please write to me directly.",requiredFields:"Please fill in all required fields.",rateLimited:"Too many requests. Please try again in 10 minutes."}};function Ze(){const{language:e,theme:r}=ke(),a=Je[e],[o,u]=h.useState({name:"",contact:"",message:"",website:""}),[c,p]=h.useState("idle"),[b,O]=Ie(),[U,E]=h.useState(null),A=P=>{const{name:R,value:F}=P.target;u(x=>({...x,[R]:F}))},$=async P=>{var R,F;if(P.preventDefault(),p("sending"),E(null),o.website){p("success"),u({name:"",contact:"",message:"",website:""});return}if(!o.name.trim()||!o.message.trim()){p("error"),E(a.requiredFields);return}try{const x=await O(),{error:M,data:k}=await De.functions.invoke("portfolio-contact",{body:{name:o.name,contact:o.contact,message:o.message,website:o.website,turnstileToken:x}});if(M){const H=((R=M.message)==null?void 0:R.includes("429"))||M.status===429||((F=k==null?void 0:k.error)==null?void 0:F.toLowerCase().includes("too many"));throw new Error(H?a.rateLimited:a.errorMessage)}p("success"),u({name:"",contact:"",message:"",website:""})}catch(x){const M=x instanceof Error?x.message:a.errorMessage;console.error("Contact form error:",x),p("error"),E(M)}};return s.jsx("section",{className:"py-16 ",children:s.jsx("div",{className:"container w-full max-w-[1200px] mx-auto px-6",children:s.jsxs(G.div,{initial:{opacity:0,y:20},whileInView:{opacity:1,y:0},viewport:{once:!0},className:"space-y-8",children:[s.jsxs("div",{className:"text-center space-y-3",children:[s.jsxs("div",{className:"inline-flex items-center gap-3 justify-center",children:[s.jsx(Be,{className:"w-6 h-6 text-primary"}),s.jsx("h2",{className:"text-3xl font-bold",children:a.title})]}),s.jsx("p",{className:"text-muted-foreground text-sm max-w-md mx-auto",children:a.subtitle})]}),s.jsxs(G.div,{initial:{opacity:0,scale:.98},whileInView:{opacity:1,scale:1},viewport:{once:!0},className:"glass-card gradient-border p-6 md:p-8 max-w-2xl mx-auto w-full",children:[s.jsx("div",{className:"pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]","aria-hidden":"true",children:s.jsx(We,{rayColor1:"#FFC46B",rayColor2:"#96c8ff",origin:"top-right",speed:2.5,intensity:2,spread:2,density:5,followMouse:!0,lightMode:r==="light"})}),s.jsxs("form",{onSubmit:$,className:"relative z-10 space-y-6",children:[s.jsxs("div",{className:"absolute -top-[9999px] -left-[9999px]","aria-hidden":"true",children:[s.jsx(X,{htmlFor:"website",children:"Website"}),s.jsx(ee,{id:"website",type:"text",name:"website",value:o.website,onChange:A,tabIndex:-1,autoComplete:"off"})]}),s.jsxs("div",{className:"space-y-2",children:[s.jsx(X,{htmlFor:"contact-name",className:"text-sm font-medium",children:a.nameLabel}),s.jsx(ee,{id:"contact-name",type:"text",name:"name",value:o.name,onChange:A,placeholder:a.namePlaceholder,required:!0,disabled:c==="sending",className:"glass-input ym-disable-keys ym-hide-content"})]}),s.jsxs("div",{className:"space-y-2",children:[s.jsx(X,{htmlFor:"contact-info",className:"text-sm font-medium",children:a.contactLabel}),s.jsx(ee,{id:"contact-info",type:"text",name:"contact",value:o.contact,onChange:A,placeholder:a.contactPlaceholder,disabled:c==="sending",className:"glass-input ym-disable-keys ym-hide-content"})]}),s.jsxs("div",{className:"space-y-2",children:[s.jsx(X,{htmlFor:"contact-message",className:"text-sm font-medium",children:a.messageLabel}),s.jsx(Se,{id:"contact-message",name:"message",value:o.message,onChange:A,placeholder:a.messagePlaceholder,required:!0,rows:5,disabled:c==="sending",className:"glass-input resize-none ym-disable-keys ym-hide-content"})]}),s.jsx("div",{ref:b,className:"flex justify-center empty:hidden"}),s.jsxs("div",{className:"space-y-4",children:[c==="success"&&s.jsxs(G.div,{initial:{opacity:0,y:-8},animate:{opacity:1,y:0},className:"flex items-center gap-2 text-sm text-green-500 bg-green-500/10 p-3 rounded-lg border border-green-500/20",children:[s.jsx(ze,{className:"w-5 h-5 flex-shrink-0"}),s.jsx("span",{children:a.successMessage})]}),c==="error"&&s.jsxs(G.div,{initial:{opacity:0,y:-8},animate:{opacity:1,y:0},className:"flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20",children:[s.jsx(Xe,{className:"w-5 h-5 flex-shrink-0"}),s.jsx("span",{children:U})]}),s.jsxs(Te,{type:"submit",disabled:c==="sending",className:"w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200",children:[s.jsx(qe,{className:"w-4 h-4"}),s.jsx("span",{children:c==="sending"?a.sendingButton:a.sendButton})]})]})]})]})]})})})}export{Ze as ContactSection};
