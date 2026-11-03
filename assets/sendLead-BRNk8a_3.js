import{c,r as s,j as o,s as d,P as m,O as x,N as y}from"./index-DSk1L7kG.js";/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v=c("CircleAlert",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C=c("CircleCheck",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]),b=s.forwardRef(({className:a,...r},e)=>o.jsx("textarea",{className:d("flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",a),ref:e,...r}));b.displayName="Textarea";var g="Label",u=s.forwardRef((a,r)=>o.jsx(m.label,{...a,ref:r,onMouseDown:e=>{var t;e.target.closest("button, input, select, textarea")||((t=a.onMouseDown)==null||t.call(a,e),!e.defaultPrevented&&e.detail>1&&e.preventDefault())}}));u.displayName=g;var f=u;const p=x("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"),k=s.forwardRef(({className:a,...r},e)=>o.jsx(f,{ref:e,className:d(p(),a),...r}));k.displayName=f.displayName;async function L(a){var t,n,l;const{error:r,data:e}=await y.functions.invoke("portfolio-contact",{body:a});if(!r)return"ok";const i=((t=r.message)==null?void 0:t.includes("429"))||((n=r.context)==null?void 0:n.status)===429||((l=e==null?void 0:e.error)==null?void 0:l.toLowerCase().includes("too many"));return console.error("Lead send failed:",r),i?"rate-limited":"error"}export{C,k as L,b as T,v as a,L as s};
