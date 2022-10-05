"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[978],{3905:(e,t,n)=>{n.d(t,{Zo:()=>m,kt:()=>u});var i=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);t&&(i=i.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,i)}return n}function r(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,i,a=function(e,t){if(null==e)return{};var n,i,a={},l=Object.keys(e);for(i=0;i<l.length;i++)n=l[i],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(i=0;i<l.length;i++)n=l[i],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var s=i.createContext({}),p=function(e){var t=i.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):r(r({},t),e)),n},m=function(e){var t=p(e.components);return i.createElement(s.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return i.createElement(i.Fragment,{},t)}},d=i.forwardRef((function(e,t){var n=e.components,a=e.mdxType,l=e.originalType,s=e.parentName,m=o(e,["components","mdxType","originalType","parentName"]),d=p(n),u=a,g=d["".concat(s,".").concat(u)]||d[u]||c[u]||l;return n?i.createElement(g,r(r({ref:t},m),{},{components:n})):i.createElement(g,r({ref:t},m))}));function u(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var l=n.length,r=new Array(l);r[0]=d;var o={};for(var s in t)hasOwnProperty.call(t,s)&&(o[s]=t[s]);o.originalType=e,o.mdxType="string"==typeof e?e:a,r[1]=o;for(var p=2;p<l;p++)r[p]=n[p];return i.createElement.apply(null,r)}return i.createElement.apply(null,n)}d.displayName="MDXCreateElement"},4150:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>r,default:()=>c,frontMatter:()=>l,metadata:()=>o,toc:()=>p});var i=n(7462),a=(n(7294),n(3905));const l={slug:"gtm-templates/config-tag"},r="Config Tag",o={unversionedId:"gtm-templates/config-tag",id:"gtm-templates/config-tag",title:"Config Tag",description:"Overview:",source:"@site/docs/gtm-templates/config-tag.md",sourceDirName:"gtm-templates",slug:"/gtm-templates/gtm-templates/config-tag",permalink:"/docs/gtm-templates/gtm-templates/config-tag",draft:!1,tags:[],version:"current",frontMatter:{slug:"gtm-templates/config-tag"},sidebar:"tutorialSidebar",previous:{title:"GTM Templates",permalink:"/docs/gtm-templates/gtm-templates/gtm-templates"},next:{title:"Hit Tag",permalink:"/docs/gtm-templates/gtm-templates/hit-tag"}},s={},p=[{value:"Overview:",id:"overview",level:2},{value:"Multi instance pixels:",id:"multi-instance-pixels",level:2},{value:"Single instance pixels:",id:"single-instance-pixels",level:2},{value:"Conversion tracking pixels:",id:"conversion-tracking-pixels",level:2},{value:"Tagging Settings:",id:"tagging-settings",level:2},{value:"Event Customization",id:"event-customization",level:2},{value:"Custom Settings",id:"custom-settings",level:2}],m={toc:p};function c(e){let{components:t,...n}=e;return(0,a.kt)("wrapper",(0,i.Z)({},m,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"config-tag"},"Config Tag"),(0,a.kt)("h2",{id:"overview"},"Overview:"),(0,a.kt)("p",null,"The configuration tag is responsible for defining rules on how the Javascript Framework Library should work. "),(0,a.kt)("h2",{id:"multi-instance-pixels"},"Multi instance pixels:"),(0,a.kt)("p",null,"You can setup platforms that support tracking an event to mulitple endpoints / pixel ids here. These are usually analytics and data collection platforms."),(0,a.kt)("admonition",{title:"Syntax constraint",type:"danger"},(0,a.kt)("p",{parentName:"admonition"},"Please use 1 pixel id for 1 line!")),(0,a.kt)("p",null,"The syntax is simply: ",(0,a.kt)("inlineCode",{parentName:"p"},"pixel id")," for all platforms in here."),(0,a.kt)("h2",{id:"single-instance-pixels"},"Single instance pixels:"),(0,a.kt)("p",null,"You can setup platforms that do not support more than one pixel / event or page here. These are usually A/B testing tools, Chat providers, UX optimization tools."),(0,a.kt)("p",null,"Please find the accepted format of entry for each supported platform here:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"Google Optimize: ",(0,a.kt)("inlineCode",{parentName:"li"},"container id")),(0,a.kt)("li",{parentName:"ul"},"Hotjar: ",(0,a.kt)("inlineCode",{parentName:"li"},"container id")),(0,a.kt)("li",{parentName:"ul"},"Hubspot: ",(0,a.kt)("inlineCode",{parentName:"li"},"container id")),(0,a.kt)("li",{parentName:"ul"},"Microsoft Clarity: ",(0,a.kt)("inlineCode",{parentName:"li"},"pixel id")),(0,a.kt)("li",{parentName:"ul"},"Salesoforce: ",(0,a.kt)("inlineCode",{parentName:"li"},"pixel id")),(0,a.kt)("li",{parentName:"ul"},"Usabilla: ",(0,a.kt)("inlineCode",{parentName:"li"},"pixel id")),(0,a.kt)("li",{parentName:"ul"},"OptinMonster: ",(0,a.kt)("inlineCode",{parentName:"li"},"user id"),",",(0,a.kt)("inlineCode",{parentName:"li"},"account id")),(0,a.kt)("li",{parentName:"ul"},"Snapengage: ",(0,a.kt)("inlineCode",{parentName:"li"},"pixel id"),", for ",(0,a.kt)("inlineCode",{parentName:"li"},"//")," + ",(0,a.kt)("inlineCode",{parentName:"li"},"pixel id")," + ",(0,a.kt)("inlineCode",{parentName:"li"},".collect.igodigital.com/collect.js")," pattern script URL Or settings provided through ",(0,a.kt)("a",{parentName:"li",href:"/docs/gtm-templates/gtm-templates/pixel-customizer",title:"Pixel Customizer - Snapengage"},"Pixel Customizer"))),(0,a.kt)("h2",{id:"conversion-tracking-pixels"},"Conversion tracking pixels:"),(0,a.kt)("p",null,'You can setup conversion tracking pixels here. "Conversion Tracking Pixel" refers to a pixel that does not ususally have predefined events or accepts event names, but can be fired upon many different events, and the separate ',(0,a.kt)("inlineCode",{parentName:"p"},"pixel id")," or  pixel attribute helps to identify, which event the pixel has been activated for."),(0,a.kt)("admonition",{title:"Syntax constraint",type:"danger"},(0,a.kt)("p",{parentName:"admonition"},"Please make sure that you provide all necessary pixel attributes!")),(0,a.kt)("p",null,"Patform specific format for Pixel data:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"Floodlight Standard Counter: ",(0,a.kt)("inlineCode",{parentName:"li"},"floodlight id"),",",(0,a.kt)("inlineCode",{parentName:"li"},"group tag stirng"),",",(0,a.kt)("inlineCode",{parentName:"li"},"activity tag string")),(0,a.kt)("li",{parentName:"ul"},"Floodlight Unique Counter: ",(0,a.kt)("inlineCode",{parentName:"li"},"floodlight id"),",",(0,a.kt)("inlineCode",{parentName:"li"},"group tag stirng"),",",(0,a.kt)("inlineCode",{parentName:"li"},"activity tag string")),(0,a.kt)("li",{parentName:"ul"},"Floodlight Per Session Counter: ",(0,a.kt)("inlineCode",{parentName:"li"},"floodlight id"),",",(0,a.kt)("inlineCode",{parentName:"li"},"group tag stirng"),",",(0,a.kt)("inlineCode",{parentName:"li"},"activity tag string")),(0,a.kt)("li",{parentName:"ul"},"Floodlight Transaction: ",(0,a.kt)("inlineCode",{parentName:"li"},"floodlight id"),",",(0,a.kt)("inlineCode",{parentName:"li"},"group tag stirng"),",",(0,a.kt)("inlineCode",{parentName:"li"},"activity tag string")),(0,a.kt)("li",{parentName:"ul"},"Google Ads Conversion: ",(0,a.kt)("inlineCode",{parentName:"li"},"conversion id"),",",(0,a.kt)("inlineCode",{parentName:"li"},"conversion label")," ","*"),(0,a.kt)("li",{parentName:"ul"},"Google Ads Remarketing: ",(0,a.kt)("inlineCode",{parentName:"li"},"conversion id"),",",(0,a.kt)("inlineCode",{parentName:"li"},"conversion label")," ","*"),(0,a.kt)("li",{parentName:"ul"},"Linkedin: ",(0,a.kt)("inlineCode",{parentName:"li"},"pixel id"))),(0,a.kt)("p",null,"*"," for Google Ads pixels, ",(0,a.kt)("inlineCode",{parentName:"p"},"conversion label")," is not neccessary as far as the native documentation of Google does not state otherwise"),(0,a.kt)("h2",{id:"tagging-settings"},"Tagging Settings:"),(0,a.kt)("h2",{id:"event-customization"},"Event Customization"),(0,a.kt)("h2",{id:"custom-settings"},"Custom Settings"))}c.isMDXComponent=!0}}]);