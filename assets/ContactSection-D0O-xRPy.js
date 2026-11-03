import{r as v,j as s,b as Ce,t as Ae,m as z,M as Fe,I as K,B as Ne,S as Ee}from"./index-DSk1L7kG.js";import{L as Y,T as Re,C as Pe,a as Ie,s as Be}from"./sendLead-BRNk8a_3.js";const Te=24e5,Q=Math.PI*2,pe={"top-right":{flipX:0,flipY:0,side:0},"top-left":{flipX:1,flipY:0,side:0},"bottom-right":{flipX:0,flipY:1,side:0},"bottom-left":{flipX:1,flipY:1,side:0},right:{flipX:0,flipY:0,side:1},left:{flipX:1,flipY:0,side:1}},ke=`#version 300 es
const vec2 corners[3] = vec2[3](vec2(-1.0, -1.0), vec2(3.0, -1.0), vec2(-1.0, 3.0));
void main() {
  gl_Position = vec4(corners[gl_VertexID], 0.0, 1.0);
}`,qe=`#version 300 es
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
}`,d=(t,i,o)=>Math.min(o,Math.max(i,t)),De=t=>((t+Math.PI)%Q+Q)%Q-Math.PI,ge=t=>{const i=String(t||"").trim(),o=/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(i);if(o){const f=o[1].length===3?o[1].replace(/./g,c=>c+c):o[1];return[0,2,4].map(c=>parseInt(f.slice(c,c+2),16)/255)}const a=/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i.exec(i);return a?[a[1],a[2],a[3]].map(f=>d(parseFloat(f)/255,0,1)):[1,1,1]},Xe=(t,i)=>({source:t.side?[i*.5+.42,.3]:[i*.5+.1,.62],heading:t.side?3.42:-2.48}),ve=(t,i,o)=>{const a=t.createShader(i);return a?(t.shaderSource(a,o),t.compileShader(a),t.getShaderParameter(a,t.COMPILE_STATUS)?a:(console.error(t.getShaderInfoLog(a)),t.deleteShader(a),null)):null},ze=t=>{const i=ve(t,t.VERTEX_SHADER,ke),o=ve(t,t.FRAGMENT_SHADER,qe),a=i&&o?t.createProgram():null;if(!i||!o||!a)return i&&t.deleteShader(i),o&&t.deleteShader(o),null;if(t.attachShader(a,i),t.attachShader(a,o),t.linkProgram(a),t.deleteShader(i),t.deleteShader(o),!t.getProgramParameter(a,t.LINK_STATUS))return console.error(t.getProgramInfoLog(a)),t.deleteProgram(a),null;const f={},c=t.getProgramParameter(a,t.ACTIVE_UNIFORMS);for(let h=0;h<c;h++){const b=t.getActiveUniform(a,h);b&&(f[b.name]=t.getUniformLocation(a,b.name))}return{program:a,uniforms:f}},Ye=({rayColor1:t="#FFC46B",rayColor2:i="#96c8ff",blend:o=.6,origin:a="top-right",speed:f=2.5,intensity:c=2,spread:h=2,density:b=5,sharpness:_=.5,tilt:V=0,falloff:F=1.6,glow:A=1,saturation:G=1,dust:N=0,followMouse:g=!0,mouseInfluence:E=.5,intro:O=!0,lightMode:xe=!1,opacity:ye=1,maxDevicePixelRatio:we=2,className:Z="",style:be})=>{const ee=v.useRef(null),te=v.useRef(null),R=v.useRef(null),[ae,Se]=v.useState(0),se={colorA:ge(t),colorB:ge(i),blend:d(o,0,1),frame:pe[a]??pe["top-right"],speed:Math.max(0,f)*.4,intensity:Math.max(0,c)*.75,spread:d(h,.1,8)*.225,density:d(b,1,40),sharpness:d(_,0,1),tilt:d(V,-180,180)*Math.PI/180,falloff:d(F,.2,6),glow:Math.max(0,A)*1.2,saturation:Math.max(0,G),dust:d(N,0,1),followMouse:g,mouseInfluence:d(E,0,1),intro:O,light:xe,opacity:d(ye,0,1),maxRatio:d(we,.5,3)},k=v.useRef(se);return k.current=se,v.useEffect(()=>{var y;(y=R.current)==null||y.call(R)}),v.useEffect(()=>{const y=ee.current,u=te.current;if(!y||!u)return;const n=u.getContext("webgl2",{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1,powerPreference:"high-performance"}),q=n?ze(n):null;if(!n||!q)return;const P=window.matchMedia("(prefers-reduced-motion: reduce)").matches,oe=n.createVertexArray(),w={width:1,height:1},S={x:0,y:0,inside:!1},x={value:0,velocity:0},M={angle:0,strength:0};let ne=Math.random()*100,I=k.current.intro&&!P&&ae===0?0:1,L=0,D=0,U=!0,H=document.visibilityState!=="hidden",$=!1;const W=()=>{const r=k.current,e=y.getBoundingClientRect(),m=Math.max(1,e.width),p=Math.max(1,e.height),C=Math.min(window.devicePixelRatio||1,r.maxRatio,Math.sqrt(Te/(m*p))),B=Math.max(1,Math.round(m*C)),T=Math.max(1,Math.round(p*C));(u.width!==B||u.height!==T)&&(u.width=B,u.height=T),w.width=m,w.height=p},Me=r=>{let e=(S.x-w.width/2)/w.height,m=(w.height/2-S.y)/w.height;r.frame.flipX&&(e=-e),r.frame.flipY&&(m=-m);const{source:p,heading:C}=Xe(r.frame,w.width/w.height);return De(Math.atan2(m-p[1],e-p[0])-C-r.tilt)},re=r=>{if(L=0,$)return;const e=k.current,m=d((r-D)/1e3||0,0,.05);D=Math.max(D,r),ne+=m*e.speed*(P?.3:1),I<1&&(I=Math.min(1,I+m/1.6));const p=e.followMouse&&S.inside&&!P,C=p?Me(e):0,B=p?d(C,-e.spread,e.spread)*e.mouseInfluence:0,T=p?e.mouseInfluence:0,fe=1-Math.exp(-m*6);p&&(M.angle+=(d(C-x.value,-e.spread*1.5,e.spread*1.5)-M.angle)*fe),M.strength+=(T-M.strength)*fe;const he=18,Le=2*Math.sqrt(he);x.velocity+=((B-x.value)*he-x.velocity*Le)*m,x.value+=x.velocity*m,n.viewport(0,0,u.width,u.height),n.useProgram(q.program),n.bindVertexArray(oe);const l=q.uniforms;n.uniform2f(l.uResolution,u.width,u.height),n.uniform1f(l.uTime,ne),n.uniform3f(l.uColorA,e.colorA[0],e.colorA[1],e.colorA[2]),n.uniform3f(l.uColorB,e.colorB[0],e.colorB[1],e.colorB[2]),n.uniform1f(l.uBlend,e.blend),n.uniform1f(l.uIntensity,e.intensity),n.uniform1f(l.uSpread,e.spread),n.uniform1f(l.uDensity,e.density),n.uniform1f(l.uSharpness,e.sharpness),n.uniform1f(l.uFalloff,e.falloff),n.uniform1f(l.uGlow,e.glow),n.uniform1f(l.uSaturation,e.saturation),n.uniform1f(l.uDust,e.dust),n.uniform1f(l.uOpacity,e.opacity),n.uniform1f(l.uReveal,1-Math.pow(1-I,3)),n.uniform1f(l.uLight,e.light?1:0),n.uniform3f(l.uFrame,e.frame.flipX,e.frame.flipY,e.frame.side),n.uniform1f(l.uAim,e.tilt+x.value),n.uniform3f(l.uFocus,M.angle,Math.max(.06,e.spread*.25),M.strength*1.4),n.uniform1f(l.uSway,P?0:1),n.drawArrays(n.TRIANGLES,0,3);const je=Math.abs(B-x.value)>1e-4||Math.abs(x.velocity)>1e-4||Math.abs(T-M.strength)>.001;(e.speed>0&&!P||I<1||je)&&U&&H&&(L=requestAnimationFrame(re))},j=()=>{L||$||!U||!H||(D=performance.now(),L=requestAnimationFrame(re))};R.current=()=>{W(),j()};const ie=r=>{const e=y.getBoundingClientRect();S.x=r.clientX-e.left,S.y=r.clientY-e.top,S.inside=r.clientX>=e.left&&r.clientX<=e.right&&r.clientY>=e.top&&r.clientY<=e.bottom,j()},J=()=>{S.inside=!1,j()},X=r=>{r.pointerType!=="mouse"&&J()};window.addEventListener("pointermove",ie,{passive:!0}),window.addEventListener("pointerup",X,{passive:!0}),window.addEventListener("pointercancel",X,{passive:!0}),document.documentElement.addEventListener("pointerleave",J);const le=r=>{r.preventDefault(),$=!0,cancelAnimationFrame(L),L=0},ce=()=>Se(r=>r+1);u.addEventListener("webglcontextlost",le),u.addEventListener("webglcontextrestored",ce);const ue=new ResizeObserver(()=>{W(),j()});ue.observe(y);const de=new IntersectionObserver(r=>{U=r.some(e=>e.isIntersecting),j()});de.observe(y);const me=()=>{H=document.visibilityState!=="hidden",j()};return document.addEventListener("visibilitychange",me),W(),j(),()=>{cancelAnimationFrame(L),R.current=null,ue.disconnect(),de.disconnect(),window.removeEventListener("pointermove",ie),window.removeEventListener("pointerup",X),window.removeEventListener("pointercancel",X),document.documentElement.removeEventListener("pointerleave",J),document.removeEventListener("visibilitychange",me),u.removeEventListener("webglcontextlost",le),u.removeEventListener("webglcontextrestored",ce),n.isContextLost()||(n.deleteVertexArray(oe),n.deleteProgram(q.program))}},[ae]),s.jsx("div",{ref:ee,className:`side-rays${Z?` ${Z}`:""}`,style:be,children:s.jsx("canvas",{ref:te,className:"side-rays__canvas","aria-hidden":"true"})})},_e={ru:{title:"Связаться со мной",subtitle:"Отправьте сообщение, и я отвечу вам в ближайшее время.",nameLabel:"Ваше имя *",namePlaceholder:"Иван Иванов",contactLabel:"Контакт для связи (опционально)",contactPlaceholder:"Telegram, email или телефон",messageLabel:"Сообщение *",messagePlaceholder:"Опишите ваш вопрос или предложение...",sendButton:"Отправить сообщение",sendingButton:"Отправка...",successMessage:"Сообщение отправлено! Я отвечу вам в ближайшее время.",errorMessage:"Ошибка отправки. Попробуйте написать мне напрямую.",requiredFields:"Пожалуйста, заполните все обязательные поля.",rateLimited:"Слишком много запросов. Попробуйте через 10 минут."},en:{title:"Get in Touch",subtitle:"Send a message and I'll get back to you as soon as possible.",nameLabel:"Your Name *",namePlaceholder:"John Doe",contactLabel:"Contact Info (optional)",contactPlaceholder:"Telegram, email or phone number",messageLabel:"Message *",messagePlaceholder:"Describe your question or proposal...",sendButton:"Send Message",sendingButton:"Sending...",successMessage:"Message sent! I'll get back to you soon.",errorMessage:"Failed to send. Please write to me directly.",requiredFields:"Please fill in all required fields.",rateLimited:"Too many requests. Please try again in 10 minutes."}};function Ue(){const{language:t,theme:i}=Ce(),o=_e[t],[a,f]=v.useState({name:"",contact:"",message:"",website:""}),[c,h]=v.useState("idle"),[b,_]=Ae(),[V,F]=v.useState(null),A=N=>{const{name:g,value:E}=N.target;f(O=>({...O,[g]:E}))},G=async N=>{if(N.preventDefault(),h("sending"),F(null),a.website){h("success"),f({name:"",contact:"",message:"",website:""});return}if(!a.name.trim()||!a.message.trim()){h("error"),F(o.requiredFields);return}try{const g=await Be({name:a.name,contact:a.contact,message:a.message,source:"portfolio",website:a.website,turnstileToken:await _()});if(g!=="ok")throw new Error(g==="rate-limited"?o.rateLimited:o.errorMessage);h("success"),f({name:"",contact:"",message:"",website:""})}catch(g){const E=g instanceof Error?g.message:o.errorMessage;console.error("Contact form error:",g),h("error"),F(E)}};return s.jsx("section",{className:"py-16 ",children:s.jsx("div",{className:"container w-full max-w-[1200px] mx-auto px-6",children:s.jsxs(z.div,{initial:{opacity:0,y:20},whileInView:{opacity:1,y:0},viewport:{once:!0},className:"space-y-8",children:[s.jsxs("div",{className:"text-center space-y-3",children:[s.jsxs("div",{className:"inline-flex items-center gap-3 justify-center",children:[s.jsx(Fe,{className:"w-6 h-6 text-primary"}),s.jsx("h2",{className:"text-3xl font-bold",children:o.title})]}),s.jsx("p",{className:"text-muted-foreground text-sm max-w-md mx-auto",children:o.subtitle})]}),s.jsxs(z.div,{initial:{opacity:0,scale:.98},whileInView:{opacity:1,scale:1},viewport:{once:!0},className:"glass-card gradient-border p-6 md:p-8 max-w-2xl mx-auto w-full",children:[s.jsx("div",{className:"pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]","aria-hidden":"true",children:s.jsx(Ye,{rayColor1:"#FFC46B",rayColor2:"#96c8ff",origin:"top-right",speed:2.5,intensity:2,spread:2,density:5,followMouse:!0,lightMode:i==="light"})}),s.jsxs("form",{onSubmit:G,className:"relative z-10 space-y-6",children:[s.jsxs("div",{className:"absolute -top-[9999px] -left-[9999px]","aria-hidden":"true",children:[s.jsx(Y,{htmlFor:"website",children:"Website"}),s.jsx(K,{id:"website",type:"text",name:"website",value:a.website,onChange:A,tabIndex:-1,autoComplete:"off"})]}),s.jsxs("div",{className:"space-y-2",children:[s.jsx(Y,{htmlFor:"contact-name",className:"text-sm font-medium",children:o.nameLabel}),s.jsx(K,{id:"contact-name",type:"text",name:"name",value:a.name,onChange:A,placeholder:o.namePlaceholder,required:!0,disabled:c==="sending",className:"glass-input ym-disable-keys ym-hide-content"})]}),s.jsxs("div",{className:"space-y-2",children:[s.jsx(Y,{htmlFor:"contact-info",className:"text-sm font-medium",children:o.contactLabel}),s.jsx(K,{id:"contact-info",type:"text",name:"contact",value:a.contact,onChange:A,placeholder:o.contactPlaceholder,disabled:c==="sending",className:"glass-input ym-disable-keys ym-hide-content"})]}),s.jsxs("div",{className:"space-y-2",children:[s.jsx(Y,{htmlFor:"contact-message",className:"text-sm font-medium",children:o.messageLabel}),s.jsx(Re,{id:"contact-message",name:"message",value:a.message,onChange:A,placeholder:o.messagePlaceholder,required:!0,rows:5,disabled:c==="sending",className:"glass-input resize-none ym-disable-keys ym-hide-content"})]}),s.jsx("div",{ref:b,className:"flex justify-center empty:hidden"}),s.jsxs("div",{className:"space-y-4",children:[c==="success"&&s.jsxs(z.div,{initial:{opacity:0,y:-8},animate:{opacity:1,y:0},className:"flex items-center gap-2 text-sm text-green-500 bg-green-500/10 p-3 rounded-lg border border-green-500/20",children:[s.jsx(Pe,{className:"w-5 h-5 flex-shrink-0"}),s.jsx("span",{children:o.successMessage})]}),c==="error"&&s.jsxs(z.div,{initial:{opacity:0,y:-8},animate:{opacity:1,y:0},className:"flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20",children:[s.jsx(Ie,{className:"w-5 h-5 flex-shrink-0"}),s.jsx("span",{children:V})]}),s.jsxs(Ne,{type:"submit",disabled:c==="sending",className:"w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200",children:[s.jsx(Ee,{className:"w-4 h-4"}),s.jsx("span",{children:c==="sending"?o.sendingButton:o.sendButton})]})]})]})]})]})})})}export{Ue as ContactSection};
