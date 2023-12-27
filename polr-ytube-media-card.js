/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */


function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$2=window,e$4=t$2.ShadowRoot&&(void 0===t$2.ShadyCSS||t$2.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s$3=Symbol(),n$5=new WeakMap;let o$3 = class o{constructor(t,e,n){if(this._$cssResult$=!0,n!==s$3)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e;}get styleSheet(){let t=this.o;const s=this.t;if(e$4&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=n$5.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&n$5.set(s,t));}return t}toString(){return this.cssText}};const r$2=t=>new o$3("string"==typeof t?t:t+"",void 0,s$3),i$2=(t,...e)=>{const n=1===t.length?t[0]:e.reduce(((e,s,n)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[n+1]),t[0]);return new o$3(n,t,s$3)},S$1=(s,n)=>{e$4?s.adoptedStyleSheets=n.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):n.forEach((e=>{const n=document.createElement("style"),o=t$2.litNonce;void 0!==o&&n.setAttribute("nonce",o),n.textContent=e.cssText,s.appendChild(n);}));},c$1=e$4?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return r$2(e)})(t):t;

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var s$2;const e$3=window,r$1=e$3.trustedTypes,h$1=r$1?r$1.emptyScript:"",o$2=e$3.reactiveElementPolyfillSupport,n$4={toAttribute(t,i){switch(i){case Boolean:t=t?h$1:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t);}return t},fromAttribute(t,i){let s=t;switch(i){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t);}catch(t){s=null;}}return s}},a$1=(t,i)=>i!==t&&(i==i||t==t),l$2={attribute:!0,type:String,converter:n$4,reflect:!1,hasChanged:a$1},d$1="finalized";let u$1 = class u extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this.u();}static addInitializer(t){var i;this.finalize(),(null!==(i=this.h)&&void 0!==i?i:this.h=[]).push(t);}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach(((i,s)=>{const e=this._$Ep(s,i);void 0!==e&&(this._$Ev.set(e,s),t.push(e));})),t}static createProperty(t,i=l$2){if(i.state&&(i.attribute=!1),this.finalize(),this.elementProperties.set(t,i),!i.noAccessor&&!this.prototype.hasOwnProperty(t)){const s="symbol"==typeof t?Symbol():"__"+t,e=this.getPropertyDescriptor(t,s,i);void 0!==e&&Object.defineProperty(this.prototype,t,e);}}static getPropertyDescriptor(t,i,s){return {get(){return this[i]},set(e){const r=this[t];this[i]=e,this.requestUpdate(t,r,s);},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||l$2}static finalize(){if(this.hasOwnProperty(d$1))return !1;this[d$1]=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),void 0!==t.h&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,i=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const s of i)this.createProperty(s,t[s]);}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(i){const s=[];if(Array.isArray(i)){const e=new Set(i.flat(1/0).reverse());for(const i of e)s.unshift(c$1(i));}else void 0!==i&&s.push(c$1(i));return s}static _$Ep(t,i){const s=i.attribute;return !1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}u(){var t;this._$E_=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(t=this.constructor.h)||void 0===t||t.forEach((t=>t(this)));}addController(t){var i,s;(null!==(i=this._$ES)&&void 0!==i?i:this._$ES=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(s=t.hostConnected)||void 0===s||s.call(t));}removeController(t){var i;null===(i=this._$ES)||void 0===i||i.splice(this._$ES.indexOf(t)>>>0,1);}_$Eg(){this.constructor.elementProperties.forEach(((t,i)=>{this.hasOwnProperty(i)&&(this._$Ei.set(i,this[i]),delete this[i]);}));}createRenderRoot(){var t;const s=null!==(t=this.shadowRoot)&&void 0!==t?t:this.attachShadow(this.constructor.shadowRootOptions);return S$1(s,this.constructor.elementStyles),s}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostConnected)||void 0===i?void 0:i.call(t)}));}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$ES)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostDisconnected)||void 0===i?void 0:i.call(t)}));}attributeChangedCallback(t,i,s){this._$AK(t,s);}_$EO(t,i,s=l$2){var e;const r=this.constructor._$Ep(t,s);if(void 0!==r&&!0===s.reflect){const h=(void 0!==(null===(e=s.converter)||void 0===e?void 0:e.toAttribute)?s.converter:n$4).toAttribute(i,s.type);this._$El=t,null==h?this.removeAttribute(r):this.setAttribute(r,h),this._$El=null;}}_$AK(t,i){var s;const e=this.constructor,r=e._$Ev.get(t);if(void 0!==r&&this._$El!==r){const t=e.getPropertyOptions(r),h="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==(null===(s=t.converter)||void 0===s?void 0:s.fromAttribute)?t.converter:n$4;this._$El=r,this[r]=h.fromAttribute(i,t.type),this._$El=null;}}requestUpdate(t,i,s){let e=!0;void 0!==t&&(((s=s||this.constructor.getPropertyOptions(t)).hasChanged||a$1)(this[t],i)?(this._$AL.has(t)||this._$AL.set(t,i),!0===s.reflect&&this._$El!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,s))):e=!1),!this.isUpdatePending&&e&&(this._$E_=this._$Ej());}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_;}catch(t){Promise.reject(t);}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach(((t,i)=>this[i]=t)),this._$Ei=void 0);let i=!1;const s=this._$AL;try{i=this.shouldUpdate(s),i?(this.willUpdate(s),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostUpdate)||void 0===i?void 0:i.call(t)})),this.update(s)):this._$Ek();}catch(t){throw i=!1,this._$Ek(),t}i&&this._$AE(s);}willUpdate(t){}_$AE(t){var i;null===(i=this._$ES)||void 0===i||i.forEach((t=>{var i;return null===(i=t.hostUpdated)||void 0===i?void 0:i.call(t)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t);}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1;}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return !0}update(t){void 0!==this._$EC&&(this._$EC.forEach(((t,i)=>this._$EO(i,this[i],t))),this._$EC=void 0),this._$Ek();}updated(t){}firstUpdated(t){}};u$1[d$1]=!0,u$1.elementProperties=new Map,u$1.elementStyles=[],u$1.shadowRootOptions={mode:"open"},null==o$2||o$2({ReactiveElement:u$1}),(null!==(s$2=e$3.reactiveElementVersions)&&void 0!==s$2?s$2:e$3.reactiveElementVersions=[]).push("1.6.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var t$1;const i$1=window,s$1=i$1.trustedTypes,e$2=s$1?s$1.createPolicy("lit-html",{createHTML:t=>t}):void 0,o$1="$lit$",n$3=`lit$${(Math.random()+"").slice(9)}$`,l$1="?"+n$3,h=`<${l$1}>`,r=document,d=()=>r.createComment(""),u=t=>null===t||"object"!=typeof t&&"function"!=typeof t,c=Array.isArray,v=t=>c(t)||"function"==typeof(null==t?void 0:t[Symbol.iterator]),a="[ \t\n\f\r]",f=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_=/-->/g,m=/>/g,p=RegExp(`>|${a}(?:([^\\s"'>=/]+)(${a}*=${a}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),g=/'/g,$=/"/g,y=/^(?:script|style|textarea|title)$/i,w=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),x=w(1),T=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),E=new WeakMap,C=r.createTreeWalker(r,129,null,!1),P=(t,i)=>{const s=t.length-1,l=[];let r,d=2===i?"<svg>":"",u=f;for(let i=0;i<s;i++){const s=t[i];let e,c,v=-1,a=0;for(;a<s.length&&(u.lastIndex=a,c=u.exec(s),null!==c);)a=u.lastIndex,u===f?"!--"===c[1]?u=_:void 0!==c[1]?u=m:void 0!==c[2]?(y.test(c[2])&&(r=RegExp("</"+c[2],"g")),u=p):void 0!==c[3]&&(u=p):u===p?">"===c[0]?(u=null!=r?r:f,v=-1):void 0===c[1]?v=-2:(v=u.lastIndex-c[2].length,e=c[1],u=void 0===c[3]?p:'"'===c[3]?$:g):u===$||u===g?u=p:u===_||u===m?u=f:(u=p,r=void 0);const w=u===p&&t[i+1].startsWith("/>")?" ":"";d+=u===f?s+h:v>=0?(l.push(e),s.slice(0,v)+o$1+s.slice(v)+n$3+w):s+n$3+(-2===v?(l.push(void 0),i):w);}const c=d+(t[s]||"<?>")+(2===i?"</svg>":"");if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return [void 0!==e$2?e$2.createHTML(c):c,l]};class V{constructor({strings:t,_$litType$:i},e){let h;this.parts=[];let r=0,u=0;const c=t.length-1,v=this.parts,[a,f]=P(t,i);if(this.el=V.createElement(a,e),C.currentNode=this.el.content,2===i){const t=this.el.content,i=t.firstChild;i.remove(),t.append(...i.childNodes);}for(;null!==(h=C.nextNode())&&v.length<c;){if(1===h.nodeType){if(h.hasAttributes()){const t=[];for(const i of h.getAttributeNames())if(i.endsWith(o$1)||i.startsWith(n$3)){const s=f[u++];if(t.push(i),void 0!==s){const t=h.getAttribute(s.toLowerCase()+o$1).split(n$3),i=/([.?@])?(.*)/.exec(s);v.push({type:1,index:r,name:i[2],strings:t,ctor:"."===i[1]?k:"?"===i[1]?I:"@"===i[1]?L:R});}else v.push({type:6,index:r});}for(const i of t)h.removeAttribute(i);}if(y.test(h.tagName)){const t=h.textContent.split(n$3),i=t.length-1;if(i>0){h.textContent=s$1?s$1.emptyScript:"";for(let s=0;s<i;s++)h.append(t[s],d()),C.nextNode(),v.push({type:2,index:++r});h.append(t[i],d());}}}else if(8===h.nodeType)if(h.data===l$1)v.push({type:2,index:r});else {let t=-1;for(;-1!==(t=h.data.indexOf(n$3,t+1));)v.push({type:7,index:r}),t+=n$3.length-1;}r++;}}static createElement(t,i){const s=r.createElement("template");return s.innerHTML=t,s}}function N(t,i,s=t,e){var o,n,l,h;if(i===T)return i;let r=void 0!==e?null===(o=s._$Co)||void 0===o?void 0:o[e]:s._$Cl;const d=u(i)?void 0:i._$litDirective$;return (null==r?void 0:r.constructor)!==d&&(null===(n=null==r?void 0:r._$AO)||void 0===n||n.call(r,!1),void 0===d?r=void 0:(r=new d(t),r._$AT(t,s,e)),void 0!==e?(null!==(l=(h=s)._$Co)&&void 0!==l?l:h._$Co=[])[e]=r:s._$Cl=r),void 0!==r&&(i=N(t,r._$AS(t,i.values),r,e)),i}class S{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i;}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var i;const{el:{content:s},parts:e}=this._$AD,o=(null!==(i=null==t?void 0:t.creationScope)&&void 0!==i?i:r).importNode(s,!0);C.currentNode=o;let n=C.nextNode(),l=0,h=0,d=e[0];for(;void 0!==d;){if(l===d.index){let i;2===d.type?i=new M(n,n.nextSibling,this,t):1===d.type?i=new d.ctor(n,d.name,d.strings,this,t):6===d.type&&(i=new z(n,this,t)),this._$AV.push(i),d=e[++h];}l!==(null==d?void 0:d.index)&&(n=C.nextNode(),l++);}return C.currentNode=r,o}v(t){let i=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++;}}class M{constructor(t,i,s,e){var o;this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cp=null===(o=null==e?void 0:e.isConnected)||void 0===o||o;}get _$AU(){var t,i;return null!==(i=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==i?i:this._$Cp}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===(null==t?void 0:t.nodeType)&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=N(this,t,i),u(t)?t===A||null==t||""===t?(this._$AH!==A&&this._$AR(),this._$AH=A):t!==this._$AH&&t!==T&&this._(t):void 0!==t._$litType$?this.g(t):void 0!==t.nodeType?this.$(t):v(t)?this.T(t):this._(t);}k(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}$(t){this._$AH!==t&&(this._$AR(),this._$AH=this.k(t));}_(t){this._$AH!==A&&u(this._$AH)?this._$AA.nextSibling.data=t:this.$(r.createTextNode(t)),this._$AH=t;}g(t){var i;const{values:s,_$litType$:e}=t,o="number"==typeof e?this._$AC(t):(void 0===e.el&&(e.el=V.createElement(e.h,this.options)),e);if((null===(i=this._$AH)||void 0===i?void 0:i._$AD)===o)this._$AH.v(s);else {const t=new S(o,this),i=t.u(this.options);t.v(s),this.$(i),this._$AH=t;}}_$AC(t){let i=E.get(t.strings);return void 0===i&&E.set(t.strings,i=new V(t)),i}T(t){c(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const o of t)e===i.length?i.push(s=new M(this.k(d()),this.k(d()),this,this.options)):s=i[e],s._$AI(o),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e);}_$AR(t=this._$AA.nextSibling,i){var s;for(null===(s=this._$AP)||void 0===s||s.call(this,!1,!0,i);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i;}}setConnected(t){var i;void 0===this._$AM&&(this._$Cp=t,null===(i=this._$AP)||void 0===i||i.call(this,t));}}class R{constructor(t,i,s,e,o){this.type=1,this._$AH=A,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=o,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=A;}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,i=this,s,e){const o=this.strings;let n=!1;if(void 0===o)t=N(this,t,i,0),n=!u(t)||t!==this._$AH&&t!==T,n&&(this._$AH=t);else {const e=t;let l,h;for(t=o[0],l=0;l<o.length-1;l++)h=N(this,e[s+l],i,l),h===T&&(h=this._$AH[l]),n||(n=!u(h)||h!==this._$AH[l]),h===A?t=A:t!==A&&(t+=(null!=h?h:"")+o[l+1]),this._$AH[l]=h;}n&&!e&&this.j(t);}j(t){t===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"");}}class k extends R{constructor(){super(...arguments),this.type=3;}j(t){this.element[this.name]=t===A?void 0:t;}}const H=s$1?s$1.emptyScript:"";class I extends R{constructor(){super(...arguments),this.type=4;}j(t){t&&t!==A?this.element.setAttribute(this.name,H):this.element.removeAttribute(this.name);}}class L extends R{constructor(t,i,s,e,o){super(t,i,s,e,o),this.type=5;}_$AI(t,i=this){var s;if((t=null!==(s=N(this,t,i,0))&&void 0!==s?s:A)===T)return;const e=this._$AH,o=t===A&&e!==A||t.capture!==e.capture||t.once!==e.once||t.passive!==e.passive,n=t!==A&&(e===A||o);o&&this.element.removeEventListener(this.name,this,e),n&&this.element.addEventListener(this.name,this,t),this._$AH=t;}handleEvent(t){var i,s;"function"==typeof this._$AH?this._$AH.call(null!==(s=null===(i=this.options)||void 0===i?void 0:i.host)&&void 0!==s?s:this.element,t):this._$AH.handleEvent(t);}}class z{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s;}get _$AU(){return this._$AM._$AU}_$AI(t){N(this,t);}}const j=i$1.litHtmlPolyfillSupport;null==j||j(V,M),(null!==(t$1=i$1.litHtmlVersions)&&void 0!==t$1?t$1:i$1.litHtmlVersions=[]).push("2.7.4");const B=(t,i,s)=>{var e,o;const n=null!==(e=null==s?void 0:s.renderBefore)&&void 0!==e?e:i;let l=n._$litPart$;if(void 0===l){const t=null!==(o=null==s?void 0:s.renderBefore)&&void 0!==o?o:null;n._$litPart$=l=new M(i.insertBefore(d(),t),t,void 0,null!=s?s:{});}return l._$AI(t),l};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var l,o;class s extends u$1{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0;}createRenderRoot(){var t,e;const i=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=i.firstChild),i}update(t){const i=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=B(i,this.renderRoot,this.renderOptions);}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!0);}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!1);}render(){return T}}s.finalized=!0,s._$litElement$=!0,null===(l=globalThis.litElementHydrateSupport)||void 0===l||l.call(globalThis,{LitElement:s});const n$2=globalThis.litElementPolyfillSupport;null==n$2||n$2({LitElement:s});(null!==(o=globalThis.litElementVersions)&&void 0!==o?o:globalThis.litElementVersions=[]).push("3.3.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e$1=e=>n=>"function"==typeof n?((e,n)=>(customElements.define(e,n),n))(e,n):((e,n)=>{const{kind:t,elements:s}=n;return {kind:t,elements:s,finisher(n){customElements.define(e,n);}}})(e,n);

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const i=(i,e)=>"method"===e.kind&&e.descriptor&&!("value"in e.descriptor)?{...e,finisher(n){n.createProperty(e.key,i);}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:e.key,initializer(){"function"==typeof e.initializer&&(this[e.key]=e.initializer.call(this));},finisher(n){n.createProperty(e.key,i);}},e=(i,e,n)=>{e.constructor.createProperty(n,i);};function n$1(n){return (t,o)=>void 0!==o?e(n,t,o):i(n,t)}

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function t(t){return n$1({...t,state:!0})}

/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var n;null!=(null===(n=window.HTMLSlotElement)||void 0===n?void 0:n.prototype.assignedElements)?(o,n)=>o.assignedElements(n):(o,n)=>o.assignedNodes(n).filter((o=>o.nodeType===Node.ELEMENT_NODE));

class PoLRYTubeSearchCard extends s {
    constructor() {
        super(...arguments);
        this._config = {};
        this._runOnce = false;
        this._response = {};
        this._action = 1 /* PoLRMediaSearchAction.SEARCH */;
        this._resultsState = 1 /* PoLRMediaSearchState.CLEAR */;
    }
    static getConfigElement() {
        // return document.createElement("polr-ytube-search-card-editor");
    }
    static getStubConfig() {
        return {};
    }
    setConfig(config) {
        if (!config.entity_id) {
            throw new Error("entity_id must be specified");
        }
        this._config = structuredClone(config);
        if (!("header" in this._config))
            this._config.header = "YouTube Search";
        if (!("showHeader" in this._config))
            this._config.showHeader = false;
        if (!("searchTitle" in this._config))
            this._config.searchTitle = "Search";
    }
    set hass(hass) {
        if (!this._runOnce) {
            this._hass = hass;
            this._runOnce = true;
        }
    }
    _renderResponse() {
        var _a;
        if (this._resultsState == 1 /* PoLRMediaSearchState.CLEAR */)
            return x ``;
        if (this._resultsState == 2 /* PoLRMediaSearchState.HAS_RESULTS */) {
            const elements = (_a = this._response["children"]) === null || _a === void 0 ? void 0 : _a.filter((result) => true //result["can_play"] && !result["can_expand"]
            ).map((str) => {
                return x `
                        <div class="result">
                            <img src="${str["thumbnail"]}" />
                            <div class="title">${str["title"]}</div>
                            <mwc-button
                                @click=${() => this._play(str["media_content_type"], str["media_content_id"])}>
                                Play
                            </mwc-button>
                            <mwc-button
                                @click=${() => this._startRadio(str["media_content_id"])}>
                                Radio
                            </mwc-button>
                        </div>
                    `;
            });
            return elements;
        }
        if (this._resultsState == 4 /* PoLRMediaSearchState.LOADING */) {
            return x `<div class="loading">Loading...</div>`;
        }
        if (this._resultsState == 8 /* PoLRMediaSearchState.NO_RESULTS */) {
            return x `<div class="empty">No results</div>`;
        }
        if (this._resultsState == 16 /* PoLRMediaSearchState.ERROR */) {
            return x `<div class="error">Unknown Error</div>`;
        }
    }
    _renderAction() {
        if (this._action == 1 /* PoLRMediaSearchAction.SEARCH */)
            return x ` <mwc-button @click=${this._search}
                ><ha-icon icon="mdi:magnify"></ha-icon
            ></mwc-button>`;
        if (this._action == 2 /* PoLRMediaSearchAction.CLEAR */)
            return x `
                <mwc-button @click=${this._clear}
                    ><ha-icon icon="mdi:close"></ha-icon
                ></mwc-button>
            `;
    }
    render() {
        this._response["children"];
        const header = this._config["showHeader"]
            ? x `
                  <div class="header">
                      <div class="icon-container">
                          <ha-icon icon="${this._config.icon}"></ha-icon>
                      </div>
                      <div class="info-container">
                          <div class="primary">${this._config.header}</div>
                      </div>
                  </div>
              `
            : x ``;
        return x `
            <ha-card>
                ${header}
                <div class="content">
                    <div class="search">
                        <div class="filter">
                            <ha-select
                                id="filter"
                                naturalmenuwidth
                                fixedmenuposition>
                                <mwc-list-item value="albums"
                                    >Albums</mwc-list-item
                                >
                                <mwc-list-item value="playlists"
                                    >Playlists</mwc-list-item
                                >
                                <mwc-list-item selected value="songs"
                                    >Songs</mwc-list-item
                                >
                            </ha-select>
                        </div>
                        <ha-textfield
                            type="text"
                            id="query"
                            label="${this._config["searchTitle"]}"
                            @keyup="${this.handleKey}"></ha-textfield>
                        ${this._renderAction()}
                    </div>
                    <div class="results">${this._renderResponse()}</div>
                </div>
            </ha-card>
        `;
    }
    async _fetchResults() {
        var _a;
        try {
            this._response = await this._hass.callWS({
                type: "media_player/browse_media",
                entity_id: this._config.entity_id,
                media_content_type: "search",
                media_content_id: "",
            });
            if (((_a = this._response["children"]) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                // TODO: Move to ytube_music_player component,
                //       instead of handling in frontend
                // Filter out community playlists of podcast
                this._response["children"].filter((el) => !el["media_content_id"].startsWith("MPSP"));
                this._resultsState = 2 /* PoLRMediaSearchState.HAS_RESULTS */;
            }
            else
                this._resultsState = 8 /* PoLRMediaSearchState.NO_RESULTS */;
        }
        catch (e) {
            this._resultsState = 16 /* PoLRMediaSearchState.ERROR */;
            console.error(e, this._resultsState);
        }
    }
    handleKey(ev) {
        const value = this.shadowRoot.querySelector("#query").value;
        if (value == "")
            this._clear();
        if (ev.keyCode == 13)
            this._search();
    }
    async _search() {
        this._response = {};
        this._resultsState = 4 /* PoLRMediaSearchState.LOADING */;
        this._action = 2 /* PoLRMediaSearchAction.CLEAR */;
        const filter = this.shadowRoot.querySelector("#filter").value;
        await this._hass.callService("ytube_music_player", "search", {
            entity_id: this._config.entity_id,
            query: this.shadowRoot.querySelector("#query").value,
            filter: filter,
            limit: 50,
        });
        this._fetchResults();
    }
    _clear() {
        this.shadowRoot.querySelector("#query").value = "";
        this._response = [];
        this._action = 1 /* PoLRMediaSearchAction.SEARCH */;
    }
    async _play(media_content_type, media_content_id) {
        this._hass.callService("media_player", "play_media", {
            entity_id: this._config.entity_id,
            media_content_id: media_content_id,
            media_content_type: media_content_type,
        });
    }
    async _startRadio(media_content_id) {
        // await this._hass.callService("ytube_music_player", "start_radio", {
        //     entity_id: this._config.entity_id,
        //     interrupt: false,
        // });
        this._hass.callService("media_player", "shuffle_set", {
            entity_id: this._config.entity_id,
            shuffle: false,
        });
        this._hass.callService("media_player", "play_media", {
            entity_id: this._config.entity_id,
            media_content_id: media_content_id,
            media_content_type: "vid_channel",
        });
    }
}
PoLRYTubeSearchCard.styles = i$2 `
        :host {
            --mdc-typography-subtitle1-font-size: 12px;
        }

        ha-card {
            overflow: hidden;
        }

        .search {
            display: grid;
            grid-template-columns: min-content 1fr min-content;
            align-items: center;
            gap: 4px;
        }

        .search > mwc-button {
        }

        .results {
            max-height: 400px;
            overflow: scroll;
        }

        .result {
            padding: 12px 0;
            display: grid;
            grid-template-columns: 40px 1fr min-content min-content;
            align-items: center;
            font-size: 12px;
            gap: 8px;
        }

        .result img {
            width: 40px;
            height: 40px;
        }

        .loading {
            height: 50px;
            text-align: center;
            display: grid;
            align-items: center;
            padding: 12px 0;
        }

        .header {
            display: grid;
            height: 40px;
            padding: 12px 12px 0 12px;
            grid-template-columns: min-content auto 40px;
            gap: 4px;
        }

        .icon-container {
            display: flex;
            height: 40px;
            width: 40px;
            border-radius: 50%;
            background: rgba(111, 111, 111, 0.2);
            place-content: center;
            align-items: center;
            margin-right: 12px;
        }

        .info-container {
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        .primary {
            font-weight: bold;
        }

        .action-container {
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
        }

        .content {
            padding: 12px 12px 12px 12px;
        }

        select {
            appearance: none;
            display: grid;
            border: none;
            padding: 10px;
            outline: none;
            border: 1px solid rgba(40, 40, 40, 0.3);
            border-radius: 0.25em;
            cursor: pointer;
        }
        .filter {
            margin: 4px;
        }
        ha-select {
            width: 100px;
        }
    `;
__decorate([
    n$1()
], PoLRYTubeSearchCard.prototype, "_config", void 0);
__decorate([
    n$1()
], PoLRYTubeSearchCard.prototype, "_hass", void 0);
__decorate([
    n$1()
], PoLRYTubeSearchCard.prototype, "_runOnce", void 0);
__decorate([
    t()
], PoLRYTubeSearchCard.prototype, "_response", void 0);
__decorate([
    t()
], PoLRYTubeSearchCard.prototype, "_action", void 0);
__decorate([
    n$1()
], PoLRYTubeSearchCard.prototype, "_resultsState", void 0);
customElements.define("polr-ytube-search-card", PoLRYTubeSearchCard);
// This puts your card into the UI card picker dialog
window.customCards = window.customCards || [];
window.customCards.push({
    type: "polr-ytube-search-card",
    name: "PoLR YouTube Search",
    description: "Requires the ytube_media_player integration",
});

let PoLRYTubeList = class PoLRYTubeList extends s {
    constructor() {
        super(...arguments);
        this._browseHistory = [];
    }
    _is_current(element) {
        if (this.entity == null)
            return false;
        if ("current_track" in this.entity["attributes"]) {
            return (parseInt(element.media_content_id) - 1 ==
                this.entity["attributes"]["current_track"]);
        }
        return false;
    }
    _renderThumbnail(element) {
        if (element.thumbnail == "")
            return x `<div class="empty thumbnail"></div>`;
        return x ` <img class="thumbnail" src="${element.thumbnail}" /> `;
    }
    _renderMoreButton(element) {
        if (!element["can_expand"])
            return x ``;
        return x `
            <mwc-button @click=${() => this._fireNavigateEvent(element)}>
                More
            </mwc-button>
        `;
    }
    _renderPlayButton(element) {
        if (!element.can_play)
            return x ``;
        return x `
            <mwc-button @click=${() => this._play(element)}>Play</mwc-button>
        `;
    }
    _renderRadioButton(element) {
        if (!(this._is_current(element) || element.media_content_id === null))
            return x ``;
        const id = element.media_content_type == "track"
            ? element.media_content_id
            : this.entity["attributes"]["videoId"];
        return x `
            <mwc-button @click=${() => this._startRadio(id)}>
                Radio
            </mwc-button>
        `;
    }
    _renderBackButton() {
        if (this._browseHistory.length <= 1)
            return x ``;
        return x `
            <div>
                <mwc-button
                    @click=${() => this._fireNavigateEvent(this._browseHistory.pop() &&
            this._browseHistory.pop())}
                    >back</mwc-button
                >
            </div>
        `;
    }
    render() {
        //console.debug(this.elements);
        var _a;
        if (this.elements == null || ((_a = this.elements) === null || _a === void 0 ? void 0 : _a.length) == 0)
            return x ``;
        const renderedElements = this.elements.map((element) => {
            return x `
                <div
                    class="element ${this._is_current(element)
                ? "current"
                : ""}">
                    ${this._renderThumbnail(element)}
                    <div class="info">${element.title}</div>
                    <div class="actions">
                        ${this._renderMoreButton(element)}
                        ${this._renderRadioButton(element)}
                        ${this._renderPlayButton(element)}
                    </div>
                </div>
            `;
        });
        return x `
            <div class="list-container">
                ${this._renderBackButton()}
                <div class="elements">${renderedElements}</div>
            </div>
        `;
    }
    async _fireNavigateEvent(element) {
        this.dispatchEvent(new CustomEvent("navigate", {
            detail: {
                action: element,
            },
        }));
        return;
    }
    async _startRadio(media_content_id) {
        this.hass.callService("media_player", "shuffle_set", {
            entity_id: this.entity["entity_id"],
            shuffle: false,
        });
        this.hass.callService("media_player", "play_media", {
            entity_id: this.entity["entity_id"],
            media_content_id: media_content_id,
            media_content_type: "vid_channel",
        });
        this.dispatchEvent(new CustomEvent("update"));
        return;
    }
    async _play(element) {
        if (["track", "playlist"].includes(element.media_content_type)) {
            this.hass.callService("media_player", "play_media", {
                entity_id: this.entity["entity_id"],
                media_content_id: element.media_content_id,
                media_content_type: element.media_content_type,
            });
        }
        else {
            this.hass.callService("ytube_music_player", "call_method", {
                entity_id: this.entity["entity_id"],
                command: "goto_track",
                parameters: element.media_content_id,
            });
        }
    }
    static get styles() {
        return [
            i$2 `
                :host {
                }

                .elements {
                    height: 400px;
                    overflow: scroll;
                }

                .element {
                    display: grid;
                    grid-template-columns: 40px 1fr min-content;
                    align-items: center;
                    gap: 12px;
                    padding: 12px;
                    border-radius: 12px;
                }

                .actions {
                    display: grid;
                    grid-template-columns: auto auto auto;
                }

                .actions > mwc-button {
                    margin-right: 8px;
                }

                .element img {
                    width: 40px;
                    height: 40px;
                    border-radius: 5px;
                }

                .empty {
                    display: block;
                    background-color: rgba(111, 111, 111, 0.2);
                    border-radius: 12px;
                    height: 40px;
                }

                .current {
                    background-color: rgba(111, 111, 111, 0.2);
                }
            `,
        ];
    }
};
__decorate([
    n$1()
], PoLRYTubeList.prototype, "entity", void 0);
__decorate([
    n$1()
], PoLRYTubeList.prototype, "hass", void 0);
__decorate([
    n$1()
], PoLRYTubeList.prototype, "elements", void 0);
__decorate([
    t()
], PoLRYTubeList.prototype, "_browseHistory", void 0);
PoLRYTubeList = __decorate([
    e$1("polr-ytube-list")
], PoLRYTubeList);

let PoLRYTubeSearch = class PoLRYTubeSearch extends s {
    constructor() {
        super(...arguments);
        this._config = {};
        this._response = {};
        this._action = 1 /* PoLRMediaSearchAction.SEARCH */;
        this._resultsState = 1 /* PoLRMediaSearchState.CLEAR */;
    }
    setConfig(config) {
        if (!config.entity_id) {
            throw new Error("entity_id must be specified");
        }
        this._config = structuredClone(config);
        if (!("header" in this._config))
            this._config.header = "YouTube Search";
        if (!("showHeader" in this._config))
            this._config.showHeader = false;
        if (!("searchTitle" in this._config))
            this._config.searchTitle = "Search";
    }
    set hass(hass) {
        this._hass = hass;
    }
    _renderResponse() {
        if (this._resultsState == 1 /* PoLRMediaSearchState.CLEAR */)
            return x ``;
        if (this._resultsState == 2 /* PoLRMediaSearchState.HAS_RESULTS */) {
            const elements = this._response["children"];
            return x `
                <polr-ytube-list
                    .hass=${this._hass}
                    .entity=${this._hass["states"][this._config.entity_id]}
                    .elements="${elements}"></polr-ytube-list>
            `;
        }
        if (this._resultsState == 4 /* PoLRMediaSearchState.LOADING */) {
            return x `<div class="loading">Loading...</div>`;
        }
        if (this._resultsState == 8 /* PoLRMediaSearchState.NO_RESULTS */) {
            return x `<div class="empty">No results</div>`;
        }
        if (this._resultsState == 16 /* PoLRMediaSearchState.ERROR */) {
            return x `<div class="error">Unknown Error</div>`;
        }
    }
    _renderAction() {
        if (this._action == 1 /* PoLRMediaSearchAction.SEARCH */)
            return x ` <mwc-button @click=${this._search}
                ><ha-icon icon="mdi:magnify"></ha-icon
            ></mwc-button>`;
        if (this._action == 2 /* PoLRMediaSearchAction.CLEAR */)
            return x `
                <mwc-button @click=${this._clear}
                    ><ha-icon icon="mdi:close"></ha-icon
                ></mwc-button>
            `;
    }
    render() {
        this._response["children"];
        return x `
            <div class="content">
                <div class="search">
                    <div class="filter">
                        <ha-select
                            id="filter"
                            naturalmenuwidth
                            fixedmenuposition>
                            <mwc-list-item value="albums">Albums</mwc-list-item>
                            <mwc-list-item value="playlists"
                                >Playlists</mwc-list-item
                            >
                            <mwc-list-item selected value="songs"
                                >Songs</mwc-list-item
                            >
                        </ha-select>
                    </div>
                    <ha-textfield
                        type="text"
                        id="query"
                        label="${this._config["searchTitle"]}"
                        @keyup="${this.handleKey}"></ha-textfield>
                    ${this._renderAction()}
                </div>
                <div class="results">${this._renderResponse()}</div>
            </div>
        `;
    }
    async _fetchResults() {
        var _a;
        try {
            this._response = await this._hass.callWS({
                type: "media_player/browse_media",
                entity_id: this._config.entity_id,
                media_content_type: "search",
                media_content_id: "",
            });
            if (((_a = this._response["children"]) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                // TODO: Move to ytube_music_player component,
                //       instead of handling in frontend
                // Filter out community playlists of podcast
                this._response["children"].filter((el) => !el["media_content_id"].startsWith("MPSP"));
                this._resultsState = 2 /* PoLRMediaSearchState.HAS_RESULTS */;
            }
            else
                this._resultsState = 8 /* PoLRMediaSearchState.NO_RESULTS */;
        }
        catch (e) {
            this._resultsState = 16 /* PoLRMediaSearchState.ERROR */;
            console.error(e, this._resultsState);
        }
    }
    handleKey(ev) {
        const value = this.shadowRoot.querySelector("#query").value;
        if (value == "")
            this._clear();
        if (ev.keyCode == 13)
            this._search();
    }
    async _search() {
        this._response = {};
        this._resultsState = 4 /* PoLRMediaSearchState.LOADING */;
        this._action = 2 /* PoLRMediaSearchAction.CLEAR */;
        const filter = this.shadowRoot.querySelector("#filter").value;
        await this._hass.callService("ytube_music_player", "search", {
            entity_id: this._config.entity_id,
            query: this.shadowRoot.querySelector("#query").value,
            filter: filter,
            limit: 50,
        });
        this._fetchResults();
    }
    _clear() {
        this.shadowRoot.querySelector("#query").value = "";
        this._response = [];
        this._action = 1 /* PoLRMediaSearchAction.SEARCH */;
    }
};
PoLRYTubeSearch.styles = i$2 `
        :host {
            --mdc-typography-subtitle1-font-size: 12px;
        }

        ha-card {
            overflow: hidden;
        }

        .search {
            display: grid;
            grid-template-columns: min-content 1fr min-content;
            align-items: center;
            gap: 4px;
        }

        .loading {
            height: 50px;
            text-align: center;
            display: grid;
            align-items: center;
            padding: 12px 0;
        }

        .content {
            padding: 12px 12px 12px 12px;
        }

        select {
            appearance: none;
            display: grid;
            border: none;
            padding: 10px;
            outline: none;
            border: 1px solid rgba(40, 40, 40, 0.3);
            border-radius: 0.25em;
            cursor: pointer;
        }
        .filter {
            margin: 4px;
        }
        ha-select {
            width: 100px;
        }
    `;
__decorate([
    n$1()
], PoLRYTubeSearch.prototype, "_config", void 0);
__decorate([
    n$1()
], PoLRYTubeSearch.prototype, "_hass", void 0);
__decorate([
    t()
], PoLRYTubeSearch.prototype, "_response", void 0);
__decorate([
    t()
], PoLRYTubeSearch.prototype, "_action", void 0);
__decorate([
    n$1()
], PoLRYTubeSearch.prototype, "_resultsState", void 0);
PoLRYTubeSearch = __decorate([
    e$1("polr-ytube-search")
], PoLRYTubeSearch);

let PoLRYTubePageTabs = class PoLRYTubePageTabs extends s {
    constructor() {
        super(...arguments);
        this._active = 1 /* PoLRYTubePage.CURRENTLY_PLAYING */;
    }
    render() {
        return x `
            <div class="tab-container">
                <div
                    class="tab ${this._active == 1 /* PoLRYTubePage.CURRENTLY_PLAYING */
            ? "active"
            : "inactive"}"
                    @click=${() => this.setActive(1 /* PoLRYTubePage.CURRENTLY_PLAYING */)}>
                    Playing
                </div>
                <div
                    class="tab ${this._active == 2 /* PoLRYTubePage.FOR_YOU */
            ? "active"
            : "inactive"}"
                    @click=${() => this.setActive(2 /* PoLRYTubePage.FOR_YOU */)}>
                    For You
                </div>
                <div
                    class="tab ${this._active == 4 /* PoLRYTubePage.SEARCH */
            ? "active"
            : "inactive"}"
                    @click=${() => this.setActive(4 /* PoLRYTubePage.SEARCH */)}>
                    Search
                </div>
            </div>
        `;
    }
    setActive(page) {
        this._active = page;
        this.dispatchEvent(new CustomEvent("tabChange", {
            detail: {
                tab: page,
            },
        }));
    }
};
PoLRYTubePageTabs.styles = i$2 `
        .tab-container {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            font-size: 13px;
            text-transform: uppercase;
            justify-items: stretch;
            font-weight: bold;
            gap: 4px;
        }
        .tab {
            text-align: center;
            cursor: pointer;
            padding: 12px;
        }

        .active {
            color: var(--mdc-theme-primary, #6200ee);
            border-bottom: 2px var(--mdc-theme-primary, #6200ee) solid;
        }

        .inactive {
            color: var(--primary-text-color);
        }
    `;
__decorate([
    n$1()
], PoLRYTubePageTabs.prototype, "_active", void 0);
PoLRYTubePageTabs = __decorate([
    e$1("polr-ytube-page-tabs")
], PoLRYTubePageTabs);

class PoLRYTubeItem {
}

let PoLRYTubeBrowser = class PoLRYTubeBrowser extends s {
    constructor() {
        super(...arguments);
        this._state = 1 /* PoLRYTubeState.INITAL */;
        this._browseHistory = [];
    }
    firstUpdated(_changedProperties) {
        const item = new PoLRYTubeItem();
        item.media_content_id = "";
        item.media_content_type = "mood_overview";
        item.title = "For you";
        this._browse(item);
        console.log("here");
    }
    render() {
        if (this._state == 1 /* PoLRYTubeState.INITAL */) {
            return x ``;
        }
        if (this._state == 8 /* PoLRYTubeState.NO_RESULTS */) {
            return x `
                ${this._renderBackButton()}
                <div class="no-results">No songs found.</div>
            `;
        }
        if (this._state == 2 /* PoLRYTubeState.LOADING */) {
            return x `
                ${this._renderBackButton()}
                <div class="loading">Loading...</div>
            `;
        }
        if (this._state == 16 /* PoLRYTubeState.ERROR */) {
            return x `
                ${this._renderBackButton()}
                <div class="error">An error occurred.</div>
            `;
        }
        return x `
            ${this._renderBackButton()}
            <polr-ytube-list
                .hass=${this.hass}
                .elements=${this.elements}
                .entity=${this.entity}
                @navigate=${this._handleBrowse}></polr-ytube-list>
        `;
    }
    _renderBackButton() {
        if (this._browseHistory.length <= 1)
            return x ``;
        const breadcrumb = this._browseHistory
            .map((item) => `${item.title}`)
            .join(" > ");
        return x `
            <div class="back-button">
                <mwc-button
                    @click=${() => this._browse(this._browseHistory.pop() &&
            this._browseHistory.pop())}
                    >back</mwc-button
                >
                <div class="breadcrumb">${breadcrumb}</div>
            </div>
        `;
    }
    async _handleBrowse(event) {
        const element = event.detail.action;
        this._browse(element);
    }
    async _browse(element) {
        this._state = 2 /* PoLRYTubeState.LOADING */;
        this._browseHistory.push(element);
        try {
            const response = await this.hass.callWS({
                type: "media_player/browse_media",
                entity_id: this.entity["entity_id"],
                media_content_type: element.media_content_type,
                media_content_id: element.media_content_id,
            });
            this.elements = response["children"];
            this._state = 4 /* PoLRYTubeState.HAS_RESULTS */;
        }
        catch (e) {
            this._state = 16 /* PoLRYTubeState.ERROR */;
            console.error(e, element.media_content_type, element.media_content_id);
        }
    }
    static get styles() {
        return [
            i$2 `
                .back-button {
                    display: grid;
                    padding: 12px 0;
                    grid-template-columns: min-content 1fr;
                    align-items: center;
                    gap: 12px;
                }

                .breadcrumb {
                    display: block;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .loading,
                .error {
                    display: grid;
                    align-items: center;
                    justify-items: center;
                    height: 100px;
                }
            `,
        ];
    }
};
__decorate([
    n$1()
], PoLRYTubeBrowser.prototype, "entity", void 0);
__decorate([
    n$1()
], PoLRYTubeBrowser.prototype, "hass", void 0);
__decorate([
    n$1()
], PoLRYTubeBrowser.prototype, "elements", void 0);
__decorate([
    n$1()
], PoLRYTubeBrowser.prototype, "_state", void 0);
__decorate([
    t()
], PoLRYTubeBrowser.prototype, "_browseHistory", void 0);
PoLRYTubeBrowser = __decorate([
    e$1("polr-ytube-browser")
], PoLRYTubeBrowser);

class PoLRYTubePlayingCard extends s {
    constructor() {
        super(...arguments);
        this._config = {};
        this._currentlyPlayingItems = [];
        this._forYouItems = [];
        this._browseHistory = [];
        this._currentlyPlayingState = 1 /* PoLRCurrentState.INITAL */;
        this._forYouState = 1 /* PoLRCurrentState.INITAL */;
        this._page = 1 /* PoLRYTubeTab.CURRENTLY_PLAYING */;
    }
    static getConfigElement() { }
    static getStubConfig() {
        return {};
    }
    setConfig(config) {
        if (!config.entity_id) {
            throw new Error("entity_id must be specified");
        }
        this._config = structuredClone(config);
        if (!("header" in this._config))
            this._config.header = "YouTube Music";
        if (!("searchTitle" in this._config))
            this._config.searchTitle = "Search";
        if (!("icon" in this._config))
            this._config.searchTitle = "mdi:speaker";
    }
    set hass(hass) {
        this._hass = hass;
        if (this._hasEntityChanged(this._entity, this._hass["states"][this._config["entity_id"]])) {
            this._entity = structuredClone(this._hass["states"][this._config["entity_id"]]);
            if (this._entity["state"] == "off") {
                this._currentlyPlayingState = 1 /* PoLRCurrentState.INITAL */;
            }
            else {
                this._getCurrentlyPlayingItems();
            }
        }
    }
    shouldUpdate(changedProperties) {
        const _hass = changedProperties.get("_hass");
        if (_hass != null) {
            return this._hasEntityChanged(this._entity, _hass["states"][this._config["entity_id"]]);
        }
        return true;
    }
    _hasEntityChanged(current, updated) {
        var _a, _b;
        // console.log({
        //     current: current?.attributes?.media_title,
        //     updated: updated?.attributes?.media_title,
        // });
        return (((_a = current === null || current === void 0 ? void 0 : current.attributes) === null || _a === void 0 ? void 0 : _a.media_title) != ((_b = updated === null || updated === void 0 ? void 0 : updated.attributes) === null || _b === void 0 ? void 0 : _b.media_title));
    }
    _renderTab() {
        if (this._page == 2 /* PoLRYTubeTab.FOR_YOU */) {
            return x `
                <polr-ytube-browser
                    .hass=${this._hass}
                    .elements=${this._forYouItems}
                    .entity=${this._entity}></polr-ytube-browser>
            `;
        }
        if (this._page == 4 /* PoLRYTubeTab.SEARCH */) {
            return x `
                <polr-ytube-search
                    ._hass=${this._hass}
                    ._config=${{
                entity_id: this._config["entity_id"],
            }}></polr-ytube-search>
            `;
        }
        if (this._page == 1 /* PoLRYTubeTab.CURRENTLY_PLAYING */) {
            if (this._currentlyPlayingState == 1 /* PoLRCurrentState.INITAL */) {
                return x ``;
            }
            if (this._currentlyPlayingState == 8 /* PoLRCurrentState.NO_RESULTS */) {
                return x ` <div class="no-results">No songs found.</div>`;
            }
            if (this._currentlyPlayingState == 16 /* PoLRCurrentState.ERROR */) {
                return x ` <div class="error">An error occurred.</div>`;
            }
            return x `
                <polr-ytube-list
                    .hass=${this._hass}
                    .elements=${this._currentlyPlayingItems}
                    .entity=${this._entity}></polr-ytube-list>
            `;
        }
    }
    _renderSourceSelctor() {
        const media_players = [];
        for (const [key, value] of Object.entries(this._hass["states"])) {
            if (key.startsWith("media_player")) {
                // Skip ytube_media_player entities
                if ("remote_player_id" in value["attributes"])
                    continue;
                media_players.push([key, value["attributes"]["friendly_name"]]);
            }
        }
        media_players.sort(function (a, b) {
            if (a[1] < b[1]) {
                return -1;
            }
            if (a[1] > b[1]) {
                return 1;
            }
            return 0;
        });
        return x `
            <div class="source">
                <ha-control-select-menu
                    id="source"
                    show-arrow
                    hide-label
                    naturalmenuwidth
                    fixedmenuposition
                    @selected=${this._selectSource}>
                    <ha-svg-icon
                        slot="icon"
                        path="M12,12A3,3 0 0,0 9,15A3,3 0 0,0 12,18A3,3 0 0,0 15,15A3,3 0 0,0 12,12M12,20A5,5 0 0,1 7,15A5,5 0 0,1 12,10A5,5 0 0,1 17,15A5,5 0 0,1 12,20M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8C10.89,8 10,7.1 10,6C10,4.89 10.89,4 12,4M17,2H7C5.89,2 5,2.89 5,4V20A2,2 0 0,0 7,22H17A2,2 0 0,0 19,20V4C19,2.89 18.1,2 17,2Z"></ha-svg-icon>
                    ${media_players.map((item) => item[0] ==
            this._entity["attributes"]["remote_player_id"]
            ? x `<ha-list-item selected value=${item[0]}>
                                  ${item[1]}
                              </ha-list-item> `
            : x `<ha-list-item value=${item[0]}
                                  >${item[1]}</ha-list-item
                              > `)}
                </ha-control-select-menu>
            </div>
        `;
    }
    render() {
        return x `
            <ha-card>
                <div class="header">
                    <div class="icon-container">
                        <ha-icon icon="${this._config.icon}"></ha-icon>
                    </div>
                    <div class="info-container">
                        <div class="primary">${this._config.header}</div>
                    </div>
                </div>
                <div class="content">
                    ${this._renderSourceSelctor()}
                    <polr-ytube-page-tabs
                        @tabChange=${(ev) => this._changeTab(ev.detail.tab)}></polr-ytube-page-tabs>
                    <div class="results">${this._renderTab()}</div>
                </div>
            </ha-card>
        `;
    }
    async _changeTab(page) {
        this._page = page;
        switch (page) {
            case 1 /* PoLRYTubeTab.CURRENTLY_PLAYING */:
                this._getCurrentlyPlayingItems();
                break;
            case 2 /* PoLRYTubeTab.FOR_YOU */:
                if (this._forYouItems.length == 0) ;
                this._page = 2 /* PoLRYTubeTab.FOR_YOU */;
                break;
            case 4 /* PoLRYTubeTab.SEARCH */:
                this._page = 4 /* PoLRYTubeTab.SEARCH */;
                break;
        }
    }
    async _getCurrentlyPlayingItems() {
        console.debug("_getCurrentlyPlaying called");
        if (["off", "unavailable"].includes(this._entity["state"])) {
            this._currentlyPlayingItems = [];
            return;
        }
        const media_type = this._entity["attributes"]["_media_type"];
        try {
            if (["vid_channel", "playlist", "track"].includes(media_type)) {
                const response = await this._hass.callWS({
                    type: "media_player/browse_media",
                    entity_id: this._config.entity_id,
                    media_content_type: "cur_playlists",
                    media_content_id: "",
                });
                this._currentlyPlayingItems = response["children"];
            }
            if (["album"].includes(media_type)) {
                const response = await this._hass.callWS({
                    type: "media_player/browse_media",
                    entity_id: this._config.entity_id,
                    media_content_type: "album_of_track",
                    media_content_id: "1",
                });
                this._currentlyPlayingItems = response["children"];
            }
            if (this._currentlyPlayingItems.length == 0)
                this._currentlyPlayingState = 8 /* PoLRCurrentState.NO_RESULTS */;
            if (this._currentlyPlayingItems.length > 0)
                this._currentlyPlayingState = 4 /* PoLRCurrentState.HAS_RESULTS */;
        }
        catch (e) {
            console.error(e);
            this._currentlyPlayingState = 16 /* PoLRCurrentState.ERROR */;
        }
    }
    async _selectSource(ev) {
        const selectedSource = this.shadowRoot.querySelector("#source")
            .value;
        const currentSource = this._entity["attributes"]["remote_player_id"];
        if (selectedSource == "")
            return;
        if (selectedSource == currentSource)
            return;
        this._hass.callService("media_player", "select_source", {
            entity_id: this._config.entity_id,
            source: this.shadowRoot.querySelector("#source").value,
        });
    }
    static get styles() {
        return [
            i$2 `
                :host {
                }

                ha-card {
                    overflow: hidden;
                }

                .header {
                    display: grid;
                    padding: 12px 12px 0 12px;
                    grid-template-columns: 40px auto;
                    gap: 12px;
                }
                .icon-container {
                    display: flex;
                    height: 40px;
                    width: 40px;
                    border-radius: 50%;
                    background: rgba(111, 111, 111, 0.2);
                    place-content: center;
                    align-items: center;
                }

                .info-container {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }

                .primary {
                    font-weight: bold;
                }

                .content {
                    padding: 24px 12px;
                    display: grid;
                    gap: 12px;
                }

                .source {
                    display: grid;
                    align-items: center;
                    border-top: 2px rgba(111, 111, 111, 0.2) solid;
                    border-bottom: 2px rgba(111, 111, 111, 0.2) solid;
                    padding: 12px 0;
                }

                polr-ytube-page-tabs {
                    padding: 12px;
                }
            `,
        ];
    }
}
__decorate([
    n$1()
], PoLRYTubePlayingCard.prototype, "_config", void 0);
__decorate([
    n$1()
], PoLRYTubePlayingCard.prototype, "_hass", void 0);
__decorate([
    n$1()
], PoLRYTubePlayingCard.prototype, "_entity", void 0);
__decorate([
    t()
], PoLRYTubePlayingCard.prototype, "_currentlyPlayingItems", void 0);
__decorate([
    n$1()
], PoLRYTubePlayingCard.prototype, "_forYouItems", void 0);
__decorate([
    t()
], PoLRYTubePlayingCard.prototype, "_browseHistory", void 0);
__decorate([
    n$1()
], PoLRYTubePlayingCard.prototype, "_currentlyPlayingState", void 0);
__decorate([
    n$1()
], PoLRYTubePlayingCard.prototype, "_forYouState", void 0);
__decorate([
    n$1()
], PoLRYTubePlayingCard.prototype, "_page", void 0);
customElements.define("polr-ytube-playing-card", PoLRYTubePlayingCard);
window.customCards = window.customCards || [];
window.customCards.push({
    type: "polr-ytube-playing-card",
    name: "PoLR YouTube Playing",
    description: "Requires the ytube_media_player integration",
});

export { PoLRYTubePlayingCard, PoLRYTubeSearchCard };
