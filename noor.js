(function(){
function ready(f){if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',f)}else{f()}}

/* 1) Reseñas y FAQ a lo ancho */
ready(function(){
  var destino=document.querySelector('#related-products');
  var producto=document.querySelector('.producto.m-section-half');
  var tipos=['.noor-reviews','.noor-faq'];
  if(!document.querySelector('.noor-reviews, .noor-faq'))return;
  var cont=document.querySelector('.noor-reviews-full');
  if(!cont){
    cont=document.createElement('div');cont.className='noor-reviews-full';
    if(destino){destino.parentNode.insertBefore(cont,destino)}
    else if(producto){producto.parentNode.insertBefore(cont,producto.nextSibling)}
    else return;
  }
  for(var t=0;t<tipos.length;t++){
    var c=document.querySelectorAll(tipos[t]);if(!c.length)continue;
    var e=cont.querySelector(tipos[t]);
    if(!e){e=c[0];cont.appendChild(e)}
    for(var i=0;i<c.length;i++){if(c[i]!==e&&c[i].parentNode)c[i].parentNode.removeChild(c[i])}
  }
});

/* 2) Avisos de ventas reales (la fecha se muestra solo si la venta es de los últimos 3 días) */
var ventas=[
  ['Agustina N.','CABA','Clip 5 en 1','2026-09-25'],
  ['BRUNO R.','SALTA','Clip 5 en 1','2026-09-23'],
  ['RAMIRO D.','MISIONES','Clip 2 en 1 - Acetato','2026-09-22'],
  ['NICOLAS A.','LA PLATA','Spray Limpia Cristales','2026-09-21'],
  ['JERO F.','FORMOSA','Clip 5 en 1','2026-09-25']
];
if(location.pathname.indexOf('checkout')<0)ready(function(){
  var b=document.createElement('div');b.className='noor-toast';
  b.innerHTML='<div class="noor-toast-icon"></div><div><p class="noor-toast-title"></p><p class="noor-toast-text"></p><p class="noor-toast-tag"></p></div><button class="noor-toast-close">×</button>';
  document.body.appendChild(b);
  var i=0,off=false,q=function(s){return b.querySelector(s)};
  function hace(f){var d=Math.floor((Date.now()-new Date(f+'T12:00:00'))/864e5);return d<=0?'Hoy':d===1?'Ayer':d<=3?'Hace '+d+' días':''}
  function tapa(){var h=document.querySelector('.noor-hero,.js-home-main-slider-container');if(!h)return false;var r=h.getBoundingClientRect();return r.bottom>90&&r.top<window.innerHeight}
  function ver(){if(off)return;if(tapa()){setTimeout(ver,1500);return}var v=ventas[i];
    q('.noor-toast-icon').textContent=v[0].charAt(0).toUpperCase();
    q('.noor-toast-title').textContent=v[0]+' de '+v[1];
    q('.noor-toast-text').textContent='Compró '+v[2];
    var h=hace(v[3]);q('.noor-toast-tag').textContent=(h?h+' · ':'')+'✔ Compra verificada';
    b.classList.add('visible');setTimeout(esc,6000)}
  function esc(){b.classList.remove('visible');i=(i+1)%ventas.length;if(!off)setTimeout(ver,12000)}
  q('.noor-toast-close').onclick=function(){off=true;b.classList.remove('visible')};
  setTimeout(ver,5000);
});

/* 3) Barra de anuncios */
ready(function(){
  if(document.querySelector('.noor-topbar'))return;
  var m=['🚚 ENVÍO GRATIS A TODO EL PAÍS','💳 3 CUOTAS SIN INTERÉS','🔥 HASTA 50% OFF','💸 10% OFF EXTRA CON TRANSFERENCIA'];
  var h='<span>'+m.join('</span><span>')+'</span>';h=h+h+h;
  var b=document.createElement('div');b.className='noor-topbar';
  b.innerHTML='<div class="noor-topbar-track">'+h+h+'</div>';
  var hd=document.querySelector('[data-store="head"]');
  if(hd)hd.insertBefore(b,hd.firstChild);else document.body.insertBefore(b,document.body.firstChild);
  setTimeout(function(){window.dispatchEvent(new Event('resize'))},300);
});

/* 4) Carrusel 3D */
var R='https://d1a9qnv764bsoo.cloudfront.net/stores/007/899/679/rte/';
var fotos=[
  ['hf_20260925_170420_02e40c43-ef30-4fed-b7ed-ba38790f422e.png','Al volante de noche','CLIP AMARILLO'],
  ['ChatGPT Image 25 sept 2026, 04_15_00 p.m..png','Con el sol fuerte','CLIP AZUL ESPEJADO'],
  ['hf_20260925_190928_46c4e36e-7057-4db0-a07f-700d1a313e06.png','Home office','CONTROL BLUE'],
  ['ChatGPT Image 25 sept 2026, 04_19_50 p.m..png','En la ciudad','CLIP NEGRO DEGRADÉ'],
  ['ChatGPT Image 25 sept 2026, 04_21_21 p.m..png','De paseo','CLIP MARRÓN'],
  ['ChatGPT Image 25 sept 2026, 04_23_45 p.m..png','Sol intenso','CLIP NEGRO']
];
ready(function(){
  var dest=document.querySelector('[data-store="home-products-featured"]');
  if(!dest||document.querySelector('.noor-cf-wrap'))return;
  var w=document.createElement('div');w.className='noor-cf-wrap';
  var c='',d='';
  for(var i=0;i<fotos.length;i++){
    c+='<div class="noor-cf-card" data-i="'+i+'" style="background-image:url(\''+encodeURI(R+fotos[i][0])+'\')"><div class="noor-cf-caption">'+fotos[i][1]+'<span>'+fotos[i][2]+'</span></div></div>';
    d+='<button data-i="'+i+'"></button>';
  }
  w.innerHTML='<p class="noor-cf-tag">UN LOOK PARA CADA MOMENTO</p><p class="noor-cf-title">Así se usa el Clip 5 en 1</p><p class="noor-cf-sub">Un armazón, cinco clips y la pantalla cubierta.</p><div class="noor-cf">'+c+'</div><div class="noor-cf-dots">'+d+'</div>';
  dest.parentNode.insertBefore(w,dest);
  var it=w.querySelectorAll('.noor-cf-card'),pt=w.querySelectorAll('.noor-cf-dots button'),n=it.length,a=Math.floor(n/2),tm;
  function pin(){var p=innerWidth<768?110:190;
    for(var i=0;i<n;i++){var k=i-a;if(k>n/2)k-=n;if(k<-n/2)k+=n;var s=Math.abs(k);
      it[i].style.transform='translateX('+k*p+'px) rotateY('+(k?(k<0?35:-35):0)+'deg) scale('+(1-s*.12)+')';
      it[i].style.zIndex=10-s;it[i].style.opacity=s>2?0:1;it[i].style.filter=k?'brightness(.75)':'none';
      pt[i].className=i===a?'activo':''}}
  function ir(i){a=(i+n)%n;pin();re()}
  function re(){clearInterval(tm);tm=setInterval(function(){ir(a+1)},3500)}
  for(var j=0;j<n;j++){it[j].onclick=pt[j].onclick=function(){ir(+this.getAttribute('data-i'))}}
  var z=w.querySelector('.noor-cf'),x=null;
  z.addEventListener('touchstart',function(e){x=e.touches[0].clientX},{passive:true});
  z.addEventListener('touchend',function(e){if(x===null)return;var dx=e.changedTouches[0].clientX-x;if(Math.abs(dx)>40)ir(a+(dx<0?1:-1));x=null});
  z.onmouseenter=function(){clearInterval(tm)};z.onmouseleave=re;
  addEventListener('resize',pin);pin();re();
});

/* 5) Cuidamos tu visión */
ready(function(){setTimeout(function(){
  var pr=document.querySelector('[data-store="home-products-featured"]');
  if(!pr||document.querySelector('.noor-benef'))return;
  function ic(p){return '<svg viewBox="0 0 24 24">'+p+'</svg>'}
  function it(p,t,s){return '<div class="noor-benef-item">'+ic(p)+'<div><strong>'+t+'</strong><small>'+s+'</small></div></div>'}
  function tr(p,t,s){return '<div class="noor-trust-item">'+ic(p)+'<p class="noor-trust-title">'+t+'</p><p class="noor-trust-sub">'+s+'</p></div>'}
  var b=document.createElement('div');b.className='noor-benef';
  b.innerHTML='<div class="noor-benef-glow"></div><p class="noor-benef-tag">LO QUE NOS DIFERENCIA</p><p class="noor-benef-title">Cuidamos <span>tu visión</span></p><p class="noor-benef-sub">DE PRINCIPIO A FIN</p><div class="noor-benef-grid">'+
    it('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>','Polarizados UV400','Bloquean el 100% de los rayos UVA y UVB')+
    it('<path d="M6 3v8a6 6 0 0 0 12 0V3h-4v8a2 2 0 0 1-4 0V3z"/><path d="M6 7h4M14 7h4"/>','Clips magnéticos','Cambiás de look en un segundo')+
    it('<rect x="2" y="4" width="20" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>','Control Blue','Filtro de luz azul para pantallas')+
    '</div><div class="noor-trust">'+
    tr('<path class="oro" d="M1 8h4M1.5 11h3.5M2.5 14h2.5"/><path d="M7 6h9v10H7zM16 9h3l3 3v4h-6"/><circle cx="10" cy="17" r="2"/><circle cx="19" cy="17" r="2"/>','ENVÍO <span>GRATIS</span>','A TODO EL PAÍS')+
    tr('<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/><path class="oro" d="M6 15h2M10 15h2"/>','<span>3</span> CUOTAS','SIN INTERÉS')+
    tr('<path d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5z"/><path class="oro" d="M8.5 12l2.5 2.5 4.5-5"/>','COMPRA <span>SEGURA</span>','PAGO PROTEGIDO')+'</div>';
  var ca=document.querySelector('.noor-cf-wrap, .noor-acc-wrap, .noor-ugc')||pr;
  ca.parentNode.insertBefore(b,ca);
  var f=b.querySelectorAll('svg, svg *');
  for(var i=0;i<f.length;i++){var o=f[i].getAttribute('class')==='oro',t=!!f[i].closest('.noor-trust'),s=f[i].style;
    s.setProperty('fill','none','important');s.setProperty('stroke',t&&!o?'#15151a':'#e0990f','important');
    s.setProperty('stroke-width','1.8','important');s.setProperty('stroke-linecap','round','important');s.setProperty('stroke-linejoin','round','important')}
},50)});

/* 6) Inicio: ocultar sin stock y mostrar máximo 9 productos */
ready(function(){
  var h=document.querySelector('[data-store="home-products-featured"]');
  if(!h)return;
  var MAX=9;
  var it=h.querySelectorAll('.js-item-product'),n=0;
  for(var i=0;i<it.length;i++){
    var s=it[i].querySelector('[data-store^="stock-product-"]');
    var sin=s&&/-0$/.test(s.getAttribute('data-store'));
    if(sin||n>=MAX){it[i].style.display='none'}else{n++}
  }
});

/* 8) Cuadro de medidas del armazón */
ready(function(){
  var cajas=document.querySelectorAll('.noor-medidas');
  for(var k=0;k<cajas.length;k++){
    var c=cajas[k];
    if(c.getAttribute('data-ok'))continue;
    // Admite varios armazones separados por ";" -> F|C|P|T|Nombre;F|C|P|T|Nombre
    var sets=[],cr=c.textContent.split(';');
    for(var z=0;z<cr.length;z++){var mm=cr[z].split('|');if(mm.length>=4)sets.push(mm)}
    if(!sets.length)continue;
    var m=sets[0];
    var F=m[0].trim(),C=m[1].trim(),P=m[2].trim(),T=m[3].trim();
    function col(ic,v,t,d){return '<div class="noor-anat-col"><svg viewBox="0 0 60 40">'+ic+'</svg><strong>'+v+' mm</strong><span>'+t+'</span><small>'+d+'</small></div>'}
    var icL='<path class="osc" d="M8 6C20 5 40 5 52 7C51 18 49 26 46 30C44 33 40 34 30 34C18 34 14 33 12 30C9 25 8 17 8 6Z"/><path class="oro" d="M13 20H47M13 20L17 17M13 20L17 23M47 20L43 17M47 20L43 23"/>';
    var icP='<path class="osc" d="M2 7H22C22 18 20 27 16 33M58 7H38C38 18 40 27 44 33M22 11Q30 4 38 11"/><path class="oro" d="M23 24H37M23 24L26 21.5M23 24L26 26.5M37 24L34 21.5M37 24L34 26.5"/>';
    var icT='<path class="osc" d="M4 12L38 13C45 13 50 16 54 22L57 27"/><path class="oro" d="M4 34H56M4 34L8 31M4 34L8 37M56 34L52 31M56 34L52 37"/>';
    c.innerHTML=
      '<p class="noor-med-tag">ANATOMÍA DE LAS MEDIDAS · UNISEX</p>'+
      '<p class="noor-anat-sub">Así vienen grabadas en la parte interna de la patilla</p>'+
      '<svg class="noor-anat-top" viewBox="0 0 320 70">'+
        '<path class="pat" d="M6 24L228 26C254 27 274 32 292 46L312 62"/>'+
        '<rect class="eti" x="112" y="14" width="96" height="22" rx="5"/>'+
        '<text x="160" y="29">'+C+' □ '+P+' - '+T+'</text>'+
        '<path class="oro" d="M160 36V64M155 58L160 65L165 58"/>'+
      '</svg>'+
      '<p class="noor-anat-code"><b>'+C+'</b> <i>□</i> '+P+' <i>-</i> '+T+'</p>'+
      '<div class="noor-anat-grid">'+
        col(icL,C,'Ancho del lente','Ancho horizontal de cada cristal.')+
        col(icP,P,'Ancho del puente','Distancia entre ambos cristales.')+
        col(icT,T,'Largo de la patilla','Desde la bisagra hasta la punta.')+
      '</div>'+
      '<p class="noor-anat-frente">Ancho total del frente: <b>'+F+' mm</b></p>'+
      '<p class="noor-med-nota">Anteojos <b>unisex</b>. Son medidas estándar, pensadas para adaptarse cómodamente a la mayoría de los rostros. Si ya tenés un anteojo que te queda bien, podés comparar sus medidas con estas. Todas las medidas están en milímetros.</p>';
    if(sets.length>1){
      var qs=function(x){var e=c.querySelector(x);if(e)e.parentNode.removeChild(e)};
      qs('.noor-anat-code');qs('.noor-anat-grid');qs('.noor-anat-frente');
      var td='padding:10px 6px;border-top:1px solid #ececec;text-align:center;font-size:14px;color:#15151a;';
      var th='padding:8px 6px;text-align:center;font-size:11px;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:#e0990f;';
      var filas=[['Ancho del lente',1],['Ancho del puente',2],['Largo de la patilla',3],['Ancho total del frente',0]];
      var h='<div style="overflow-x:auto;margin:14px 0 0;"><table style="width:100%;border-collapse:collapse;background:#fff;border-radius:12px;overflow:hidden;"><tr><th style="'+th+'"></th>';
      for(var y=0;y<sets.length;y++)h+='<th style="'+th+'">'+((sets[y][4]||('Modelo '+(y+1))).trim())+'</th>';
      h+='</tr>';
      for(var r=0;r<filas.length;r++){
        h+='<tr><td style="'+td+'text-align:left;font-size:12px;font-weight:700;color:#555;">'+filas[r][0]+'</td>';
        for(var y2=0;y2<sets.length;y2++)h+='<td style="'+td+'font-weight:800;">'+sets[y2][filas[r][1]].trim()+' mm</td>';
        h+='</tr>';
      }
      h+='</table></div>';
      var nota=c.querySelector('.noor-med-nota'),w=document.createElement('div');w.innerHTML=h;
      if(nota)c.insertBefore(w.firstChild,nota);else c.appendChild(w.firstChild);
    }
    c.setAttribute('data-ok','1');
    var el=c.querySelectorAll('svg *');
    for(var i=0;i<el.length;i++){
      var s=el[i].style,cl=el[i].getAttribute('class'),tg=el[i].tagName.toLowerCase();
      function st(p,v){s.setProperty(p,v,'important')}
      st('stroke-linecap','round');st('stroke-linejoin','round');
      if(tg==='text'){
        st('fill','#15151a');st('stroke','none');st('font-size','11px');st('font-weight','700');
        el[i].setAttribute('text-anchor','middle');
      }else if(cl==='eti'){
        st('fill','#fff');st('stroke','#15151a');st('stroke-width','1.2');
      }else if(cl==='pat'){
        st('fill','none');st('stroke','#15151a');st('stroke-width','7');
      }else if(cl==='osc'){
        st('fill','none');st('stroke','#15151a');st('stroke-width','3');
      }else if(cl==='oro'){
        st('fill','none');st('stroke','#e0990f');st('stroke-width','1.6');
      }
    }
  }
});

/* 9) Banner principal con frase animada (v3) */
ready(function(){
  if(document.querySelector('.noor-hero'))return;
  var IMG=encodeURI('https://d1a9qnv764bsoo.cloudfront.net/stores/007/899/679/rte/ChatGPT Image 25 sept 2026, 07_41_50 p.m..png');
  var FRASES=['el home office.','tus horas de estudio.','la ruta.','tus días de sol.','la pantalla y el sol.','cada momento del día.'];
  var LINK='/lentes-clip-on/';
  if(!document.body.classList.contains('template-home'))return;
  function subir(x){var el=x,top=null;
    while(el&&el!==document.body){
      var cn=(typeof el.className==='string'?el.className:'')+' '+((el.getAttribute&&el.getAttribute('data-store'))||'');
      if(/slider/i.test(cn))top=el;
      el=el.parentNode;
    }
    return top;}
  var sl=null;
  var hs=document.querySelector('.js-home-main-slider-container');
  if(hs)sl=subir(hs)||hs;
  var im=sl?null:document.querySelector('img.slide-img,img[src*="slide-"],img[data-srcset*="slide-"]');
  if(im)sl=subir(im)||im.closest('section');
  if(!sl){var b=document.querySelector('[data-store*="slider"],.js-home-slider,.home-slider,.section-slider');if(b)sl=subir(b)||b;}
  if(!sl){var sw=document.querySelector('.swiper-container,.swiper');if(sw)sl=subir(sw)||sw.closest('section')||sw;}
  if(!sl)return;
  var h=document.createElement('div');h.className='noor-hero';
  h.innerHTML='<div class="noor-hero-bg" style="background-image:url(\''+IMG+'\')"></div><div class="noor-hero-shade"></div>'+
    '<div class="noor-hero-txt">'+
      '<p class="noor-hero-t1">ENFOCATE</p>'+
      '<p class="noor-hero-t2">EN LO IMPORTANTE.</p>'+
      '<p class="noor-hero-t3">Nosotros cuidamos <span>tu visión.</span></p>'+
      '<p class="noor-hero-t4">Anteojos diseñados para <span class="noor-hero-w">'+FRASES[0]+'</span></p>'+
      '<div class="noor-hero-cta"><span class="noor-hero-promo">HASTA <b>50%</b> OFF</span><a class="noor-hero-btn" href="'+LINK+'">Ver clipones →</a></div>'+
    '</div>';
  sl.parentNode.insertBefore(h,sl);
  sl.style.setProperty('display','none','important');
  var w=h.querySelector('.noor-hero-w'),i=0;
  setInterval(function(){
    w.classList.add('sale');
    setTimeout(function(){
      i=(i+1)%FRASES.length;
      w.textContent=FRASES[i];
      w.classList.remove('sale');
      w.classList.add('entra');
      void w.offsetWidth;
      w.classList.remove('entra');
    },350);
  },2600);
});
/* 10) Tarjeta de oferta animada sobre el botón de compra
   Se activa con <div class="noor-oferta" style="display:none">Título|Subtítulo|Regalo</div> en la descripción */
ready(function(){
  var cfg=document.querySelector('.noor-oferta');
  if(!cfg||document.querySelector('.noor-deal'))return;
  var btn=document.querySelector('.js-addtocart:not(.js-addtocart-placeholder)')||document.querySelector('#product_form [type="submit"]');
  if(!btn)return;
  var p=cfg.textContent.split('|');
  var tit=(p[0]||'').trim(),sub=(p[1]||'').trim(),reg=(p[2]||'').trim();
  // En promos 2x1 el descuento por transferencia no se suma: no lo mostramos
  var sinTransf=/2x1/i.test(cfg.textContent)||/sin.?transf/i.test(p[3]||'');
  // En productos 2x1 también ocultamos la leyenda del tema "X% de descuento pagando con Transferencia"
  function ocultarTransf(){
    var re=/descuento\s+pagando\s+con\s+transferencia/i,els=document.querySelectorAll('body *');
    for(var i=0;i<els.length;i++){
      var e=els[i];
      if(e.closest&&e.closest('.noor-deal'))continue;
      if(!re.test(e.textContent||''))continue;
      var hijo=false;for(var j=0;j<e.children.length;j++){if(re.test(e.children[j].textContent||'')){hijo=true;break}}
      if(!hijo)e.style.setProperty('display','none','important');
    }
  }
  if(sinTransf){ocultarTransf();setTimeout(ocultarTransf,1200);setTimeout(ocultarTransf,3000)}
  cfg.parentNode.removeChild(cfg);

  var css=
  '@property --noor-giro{syntax:"<angle>";inherits:false;initial-value:0deg}'+
  '.noor-deal{position:relative;margin:0 0 14px;border:2px solid transparent;border-radius:14px;background:linear-gradient(#fffaf0,#fffaf0) padding-box,conic-gradient(from var(--noor-giro),#e0990f 0deg,#e0990f 260deg,#f3c561 300deg,#fff6dc 320deg,#f3c561 340deg,#e0990f 360deg) border-box;overflow:hidden;opacity:0;font-family:inherit;animation:noorGiro 6s linear infinite}'+
  '@keyframes noorGiro{to{--noor-giro:360deg}}'+
  '.noor-deal.noor-in{animation:noorDealIn .7s cubic-bezier(.2,.9,.3,1.2) forwards,noorGiro 6s linear infinite}'+
      '.noor-deal-main{display:flex;align-items:center;gap:12px;padding:16px}'+
  '.noor-deal-dot{flex:0 0 22px;height:22px;border-radius:50%;border:2px solid #e0990f;display:flex;align-items:center;justify-content:center;animation:noorDot 2.4s 1.5s infinite}'+
  '.noor-deal-dot:before{content:"";width:12px;height:12px;border-radius:50%;background:#e0990f}'+
  '.noor-deal-info{flex:1;min-width:0}'+
  '.noor-deal-tit{margin:0;font-weight:800;font-size:16px;color:#111;line-height:1.25}'+
  '.noor-deal-sub{margin:4px 0 0;font-size:13px;color:#555}'+
  '.noor-deal-prices{text-align:right;display:flex;flex-direction:column;align-items:flex-end;gap:2px}'+
  '.noor-deal-off{background:#111;color:#e0990f;font-size:11px;font-weight:800;padding:3px 8px;border-radius:20px;letter-spacing:.5px}'+
  '.noor-deal-price{font-size:21px;font-weight:800;color:#111}'+
  '.noor-deal-old{font-size:13px;color:#999}'+
  '.noor-deal-extra{background:#f6ead2;border-top:1px solid #ecd9b0;padding:10px 16px}'+
  '.noor-deal-line{margin:3px 0;font-size:13px;color:#333;display:flex;align-items:center;gap:8px}'+
  '.noor-deal-line b{color:#111}'+
  '.noor-deal-ic{flex:0 0 18px;height:18px;border-radius:5px;background:#e0990f;color:#fff;font-size:12px;display:flex;align-items:center;justify-content:center}'+
  '.noor-deal-free{margin-left:auto;background:#e0990f;color:#fff;font-size:10px;font-weight:800;padding:3px 9px;border-radius:20px}'+
  '.noor-nudge{animation:noorNudge .9s ease}'+
  '@keyframes noorDealIn{0%{opacity:0;transform:translateY(18px) scale(.97)}60%{opacity:1;transform:translateY(-4px) scale(1.01)}100%{opacity:1;transform:none}}'+
  '@keyframes noorSheen{to{left:130%}}'+
  '@keyframes noorDot{0%,100%{box-shadow:0 0 0 0 rgba(224,153,15,.45)}50%{box-shadow:0 0 0 7px rgba(224,153,15,0)}}'+
  '@keyframes noorNudge{0%,100%{transform:none}20%{transform:translateY(-3px) scale(1.02)}40%{transform:none}60%{transform:translateY(-2px)}}'+
  '@media (max-width:480px){.noor-deal-tit{font-size:15px}.noor-deal-price{font-size:19px}}'+
  '@media (prefers-reduced-motion:reduce){.noor-deal,.noor-deal.noor-in{animation:none;opacity:1}.noor-deal-dot,.noor-nudge{animation:none}}';
  var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);

  var d=document.createElement('div');d.className='noor-deal';
  d.innerHTML=
    '<div class="noor-deal-main"><span class="noor-deal-dot"></span>'+
    '<div class="noor-deal-info"><p class="noor-deal-tit"></p><p class="noor-deal-sub"></p></div>'+
    '<div class="noor-deal-prices"><span class="noor-deal-off"></span><strong class="noor-deal-price"></strong><s class="noor-deal-old"></s></div></div>'+
    '<div class="noor-deal-extra">'+
    '<p class="noor-deal-line noor-deal-reg"><span class="noor-deal-ic">✓</span><span class="noor-deal-regtx"></span><span class="noor-deal-free">GRATIS</span></p>'+
    '<p class="noor-deal-line noor-deal-pay"><span class="noor-deal-ic">$</span><span class="noor-deal-paytx"></span></p>'+
    '<p class="noor-deal-line"><span class="noor-deal-ic">➜</span><span class="noor-deal-ship"></span></p></div>';
  var q=function(s){return d.querySelector(s)};
  q('.noor-deal-tit').textContent=tit;
  q('.noor-deal-sub').textContent=sub;
  if(reg)q('.noor-deal-regtx').textContent=reg;else q('.noor-deal-reg').style.display='none';

  var pe=document.querySelector('#price_display, .js-price-display');
  var ce=document.querySelector('#compare_price_display, .js-compare-price-display');
  function num(el){if(!el)return 0;var t=(el.textContent||'').replace(/[^\d,]/g,'').replace(',','.');return parseFloat(t)||0}
  function fmt(n){return '$'+Math.round(n).toLocaleString('es-AR')}
  function upd(){
    var pr=num(pe),old=num(ce);
    if(!pr){d.style.display='none';return}
    d.style.display='';
    q('.noor-deal-price').textContent=fmt(pr);
    if(old>pr){q('.noor-deal-old').textContent=fmt(old);q('.noor-deal-off').textContent=Math.round((1-pr/old)*100)+'% OFF';q('.noor-deal-old').style.display='';q('.noor-deal-off').style.display=''}
    else{q('.noor-deal-old').style.display='none';q('.noor-deal-off').style.display='none'}
    q('.noor-deal-paytx').innerHTML='3 cuotas sin interés de <b>'+fmt(pr/3)+'</b>'+(sinTransf?'':' · <b>'+fmt(pr*0.9)+'</b> por transferencia');
  }
  function habil(n){var x=new Date(),c=0;while(c<n){x.setDate(x.getDate()+1);var w=x.getDay();if(w>0&&w<6)c++}return x}
  var o={weekday:'short',day:'numeric',month:'short'};
  q('.noor-deal-ship').innerHTML='Envío gratis · llega aprox. entre el <b>'+habil(4).toLocaleDateString('es-AR',o)+'</b> y el <b>'+habil(7).toLocaleDateString('es-AR',o)+'</b>';
  upd();
  if(pe&&window.MutationObserver)new MutationObserver(upd).observe(pe,{childList:true,subtree:true,characterData:true});

  var t=btn.closest('.form-row')||btn;
  t.parentNode.insertBefore(d,t);
  /* En compu, la columna de compra fija (sticky) del tema se montaba sobre las reseñas y preguntas: la dejamos quieta */
  for(var an=d.parentNode;an&&an!==document.body;an=an.parentNode){if(getComputedStyle(an).position==='sticky'){an.style.setProperty('position','relative','important');an.style.setProperty('top','auto','important')}}

  if(window.IntersectionObserver){
    var io=new IntersectionObserver(function(e){if(e[0].isIntersecting){d.classList.add('noor-in');io.disconnect()}},{threshold:.3});
    io.observe(d);
  }else d.classList.add('noor-in');

  var usado=false;btn.addEventListener('click',function(){usado=true});
  setInterval(function(){if(usado||document.hidden)return;btn.classList.add('noor-nudge');setTimeout(function(){btn.classList.remove('noor-nudge')},900)},7000);
});
/* 11) Antes y después deslizable (con pestañas si hay más de uno)
   Cada comparación se activa con una línea en la descripción:
   <div class="noor-ad" style="display:none">antes.jpg|despues.jpg|Etiqueta antes|Etiqueta después|Título|Pestaña</div>
   Las imágenes se suben a la raíz del repositorio de GitHub (rama main), no hace falta crear release para sumarlas */
ready(function(){
  var cfgs=document.querySelectorAll('.noor-ad');
  if(!cfgs.length||document.querySelector('.noor-ad-box'))return;
  var sc=document.querySelector('script[src*="/NOOR@"]');
  var base=sc?sc.src.replace(/NOOR@[^\/]+\/.*$/,'NOOR@main/'):'';
  function url(f){f=(f||'').trim();return /^https?:/.test(f)?f:base+f}
  var items=[],vistos={};
  for(var k=0;k<cfgs.length;k++){
    var p=cfgs[k].textContent.split('|');
    // El tema a veces repite la descripción (versión celu y compu): salteamos las comparaciones repetidas
    var clave=(p[0]||'').trim()+'|'+(p[1]||'').trim();
    if(vistos[clave])continue;vistos[clave]=1;
    if(p.length>=2)items.push({a:url(p[0]),b:url(p[1]),la:(p[2]||'Antes').trim(),lb:(p[3]||'Después').trim(),t:(p[4]||'Antes y después').trim(),tab:(p[5]||p[3]||'Opción '+(k+1)).trim()});
  }
  if(!items.length)return;
  var css=
  '.noor-ad-box{max-width:900px;margin:40px auto;padding:0 16px;text-align:center}'+
  '.noor-ad-tag{margin:0;color:#e0990f;font-size:12px;font-weight:700;letter-spacing:2px}'+
  '.noor-ad-title{margin:6px 0 4px;font-size:26px;font-weight:800;color:#111;line-height:1.2}'+
  '.noor-ad-sub{margin:0 0 16px;font-size:14px;color:#666}'+
  '.noor-ad-tabs{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin:0 0 14px}'+
  '.noor-ad-tabs button{font:inherit;font-size:13px;font-weight:700;padding:9px 14px;border-radius:30px;border:1.5px solid #e0990f;background:#fff;color:#111;cursor:pointer}'+
  '.noor-ad-tabs button[aria-selected="true"]{background:#111;color:#e0990f;border-color:#111}'+
  '.noor-ad-tabs button:focus-visible{outline:3px solid #e0990f;outline-offset:2px}'+
  '.noor-ad-view{position:relative;aspect-ratio:4/3;border-radius:16px;overflow:hidden;border:2px solid #e0990f;background:#ddd;user-select:none}'+
  '.noor-ad-view img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;pointer-events:none}'+
  '.noor-ad-lab{position:absolute;top:12px;font-size:12px;font-weight:700;padding:6px 11px;border-radius:20px;pointer-events:none}'+
  '.noor-ad-lab.l{left:12px;background:rgba(255,255,255,.9);color:#111}'+
  '.noor-ad-lab.r{right:12px;background:#e0990f;color:#111}'+
  '.noor-ad-line{position:absolute;top:0;bottom:0;width:3px;margin-left:-1.5px;background:#fff;box-shadow:0 0 8px rgba(0,0,0,.35);pointer-events:none}'+
  '.noor-ad-knob{position:absolute;top:50%;left:50%;width:46px;height:46px;margin:-23px 0 0 -23px;border-radius:50%;background:#111;border:3px solid #e0990f;color:#e0990f;font-size:18px;font-weight:800;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(0,0,0,.35)}'+
  '.noor-ad-view input{position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:ew-resize;-webkit-appearance:none;appearance:none}'+
  '.noor-ad-view:focus-within .noor-ad-knob{outline:3px solid #fff;outline-offset:2px}'+
  '.noor-ad-note{margin:10px 0 0;font-size:12px;color:#888}'+
  '@media (max-width:480px){.noor-ad-title{font-size:21px}.noor-ad-tabs button{font-size:12px;padding:8px 11px}.noor-ad-knob{width:40px;height:40px;margin:-20px 0 0 -20px;font-size:16px}.noor-ad-lab{font-size:11px;top:9px}}';
  var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);

  var box=document.createElement('section');box.className='noor-ad-box';
  box.innerHTML=
    '<p class="noor-ad-tag">MIRÁ LA DIFERENCIA</p><p class="noor-ad-title"></p><p class="noor-ad-sub">Deslizá para comparar</p>'+
    '<div class="noor-ad-tabs" role="tablist"></div>'+
    '<div class="noor-ad-view"><img class="noor-ad-after" loading="lazy" width="1200" height="900" alt=""><img class="noor-ad-before" loading="lazy" width="1200" height="900" alt="">'+
    '<span class="noor-ad-lab l"></span><span class="noor-ad-lab r"></span>'+
    '<div class="noor-ad-line"><span class="noor-ad-knob">‹›</span></div>'+
    '<input type="range" min="0" max="100" value="50" step="1" aria-label="Deslizá para comparar antes y después"></div>'+
    '<p class="noor-ad-note">Imágenes ilustrativas.</p>';
  var q=function(s){return box.querySelector(s)};
  var bef=q('.noor-ad-before'),aft=q('.noor-ad-after'),line=q('.noor-ad-line'),rng=q('input'),tabs=q('.noor-ad-tabs');
  function set(v){bef.style.clipPath='inset(0 '+(100-v)+'% 0 0)';bef.style.webkitClipPath=bef.style.clipPath;line.style.left=v+'%'}
  function show(i){
    var it=items[i];
    bef.src=it.a;bef.alt=it.la;aft.src=it.b;aft.alt=it.lb;
    q('.noor-ad-lab.l').textContent=it.la;q('.noor-ad-lab.r').textContent=it.lb;
    q('.noor-ad-title').textContent=it.t;
    var bs=tabs.querySelectorAll('button');for(var j=0;j<bs.length;j++)bs[j].setAttribute('aria-selected',j===i?'true':'false');
    rng.value=50;set(50);
  }
  if(items.length>1){
    items.forEach(function(it,i){var b=document.createElement('button');b.type='button';b.setAttribute('role','tab');b.textContent=it.tab;b.onclick=function(){show(i)};tabs.appendChild(b)});
  }else tabs.style.display='none';
  show(0);
  var tocado=false;
  rng.addEventListener('input',function(){tocado=true;set(rng.value)});

  var full=document.querySelector('.noor-reviews-full');
  if(full)full.insertBefore(box,full.firstChild);else cfgs[0].parentNode.insertBefore(box,cfgs[0]);
  for(var r=0;r<cfgs.length;r++)if(cfgs[r].parentNode)cfgs[r].parentNode.removeChild(cfgs[r]);

  // Pequeña demostración del movimiento la primera vez que se ve (salvo "reducir movimiento")
  var quieto=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!quieto&&window.IntersectionObserver){
    var io=new IntersectionObserver(function(e){
      if(!e[0].isIntersecting)return;io.disconnect();
      var pts=[50,22,78,50],t0=null,dur=1800;
      function paso(t){if(tocado)return;if(!t0)t0=t;var f=Math.min((t-t0)/dur,1),seg=f*3,i=Math.min(Math.floor(seg),2),x=seg-i,ease=x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2;
        var v=pts[i]+(pts[i+1]-pts[i])*ease;set(v);rng.value=v;if(f<1)requestAnimationFrame(paso)}
      setTimeout(function(){requestAnimationFrame(paso)},400);
    },{threshold:.5});
    io.observe(box);
  }
});

/* 12) Aviso de cookies (una sola vez por navegador) */
if(location.pathname.indexOf('checkout')<0)ready(function(){
  var K='noor-cookies-ok';
  try{if(localStorage.getItem(K))return}catch(e){}
  var st=document.createElement('style');
  st.textContent='.noor-cookies{position:fixed;left:12px;right:12px;bottom:12px;z-index:99999;max-width:560px;margin:0 auto;background:#111;color:#fff;border:1px solid #e0990f;border-radius:14px;padding:14px 16px;display:flex;gap:12px;align-items:center;font-size:13px;line-height:1.45;box-shadow:0 8px 30px rgba(0,0,0,.35);transform:translateY(140%);transition:transform .45s ease}'+
  '.noor-cookies.visible{transform:none}'+
  '.noor-cookies p{margin:0;flex:1}'+
  '.noor-cookies a{color:#e0990f;text-decoration:underline}'+
  '.noor-cookies button{background:#e0990f;color:#111;border:0;border-radius:999px;padding:9px 18px;font-weight:700;font-size:13px;cursor:pointer;white-space:nowrap;font-family:inherit}'+
  'body.noor-cookies-on .noor-toast{display:none!important}';
  document.head.appendChild(st);
  var c=document.createElement('div');c.className='noor-cookies';c.setAttribute('role','region');c.setAttribute('aria-label','Aviso de cookies');
  c.innerHTML='<p>Usamos cookies para que la tienda funcione, medir visitas y mostrarte anuncios. <a href="/politica-de-privacidad/">Ver política de privacidad</a></p><button type="button">Entendido</button>';
  document.body.appendChild(c);document.body.classList.add('noor-cookies-on');
  setTimeout(function(){c.classList.add('visible')},1500);
  c.querySelector('button').onclick=function(){
    try{localStorage.setItem(K,'1')}catch(e){}
    c.classList.remove('visible');document.body.classList.remove('noor-cookies-on');
    setTimeout(function(){c.remove()},500);
  };
});

/* 13) Detalles animados: línea de progreso, resplandor dorado, estrellas, preguntas y medidas
   Todo se apaga si el celular tiene activado "reducir movimiento" */
ready(function(){
  var quieto=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ORO='#e0990f';
  var st=document.createElement('style');
  st.textContent=
    '.noor-progreso{position:fixed;top:0;left:0;right:0;height:3px;z-index:100000;pointer-events:none;padding-top:env(safe-area-inset-top,0px);box-sizing:content-box}'+
    '.noor-progreso i{display:block;height:3px;background:linear-gradient(90deg,#b87a06,'+ORO+',#f3c561);transform-origin:0 50%;transform:scaleX(0);box-shadow:0 0 8px rgba(224,153,15,.55)}'+
    '.noor-luz-on{isolation:isolate}'+
    '.noor-luz{position:absolute;inset:0;overflow:hidden;z-index:-1;pointer-events:none;border-radius:inherit}'+
    '.noor-luz i{position:absolute;left:50%;top:50%;width:620px;height:620px;margin:-310px 0 0 -310px;border-radius:50%;background:radial-gradient(circle,rgba(224,153,15,.34) 0%,rgba(224,153,15,.11) 38%,rgba(224,153,15,0) 68%);animation:noorRespira 7s ease-in-out infinite}'+
    '@keyframes noorRespira{0%,100%{opacity:.75;scale:1}50%{opacity:1;scale:1.08}}'+
    '.noor-est{display:inline-block;color:#d9d9d9;transition:color .35s ease,transform .35s cubic-bezier(.3,1.6,.5,1)}'+
    '.noor-est.on{color:'+ORO+';transform:scale(1.18)}.noor-est.on.ok{transform:none}'+
    '.noor-faq-body{overflow:hidden}'+
    '@media (prefers-reduced-motion:reduce){.noor-luz i{animation:none}.noor-est{transition:none}}';
  document.head.appendChild(st);

  /* Línea dorada de progreso (no en el checkout) */
  if(location.pathname.indexOf('checkout')<0&&!document.querySelector('.noor-progreso')){
    var bar=document.createElement('div');bar.className='noor-progreso';bar.innerHTML='<i></i>';
    document.body.appendChild(bar);
    var barI=bar.firstChild,pend=false;
    function prog(){pend=false;var h=document.documentElement.scrollHeight-window.innerHeight;barI.style.transform='scaleX('+(h>0?Math.min(window.scrollY/h,1):0)+')'}
    window.addEventListener('scroll',function(){if(!pend){pend=true;requestAnimationFrame(prog)}},{passive:true});
    window.addEventListener('resize',prog);prog();
  }

  /* Resplandor dorado en las secciones oscuras, que sigue suave al mouse en compu */
  function oscuro(el){
    while(el&&el!==document.documentElement){
      var c=getComputedStyle(el).backgroundColor,m=c&&c.match(/[\d.]+/g);
      if(m&&(m.length<4||+m[3]>0.5)){return (0.299*m[0]+0.587*m[1]+0.114*m[2])<70}
      el=el.parentElement;
    }
    return false;
  }
  var mouse=!quieto&&window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  function seguir(caja,halo){
    if(!mouse)return;
    var tx=0,ty=0,x=0,y=0,anim=null;
    function paso(){x+=(tx-x)*.06;y+=(ty-y)*.06;halo.style.translate=x+'px '+y+'px';
      anim=(Math.abs(tx-x)>.5||Math.abs(ty-y)>.5)?requestAnimationFrame(paso):null}
    caja.addEventListener('pointermove',function(e){var r=caja.getBoundingClientRect();
      tx=(e.clientX-r.left-r.width/2)*.45;ty=(e.clientY-r.top-r.height/2)*.45;if(!anim)anim=requestAnimationFrame(paso)});
    caja.addEventListener('pointerleave',function(){tx=0;ty=0;if(!anim)anim=requestAnimationFrame(paso)});
  }
  setTimeout(function(){
    var secs=document.querySelectorAll('.noor-benef, .noor-hero, .noor-reviews-full');
    for(var i=0;i<secs.length;i++){
      var s=secs[i];if(s.getAttribute('data-luz'))continue;s.setAttribute('data-luz','1');
      var propio=s.querySelector('.noor-benef-glow');
      if(propio){seguir(s,propio);continue}         // ya tiene su brillo: solo lo hacemos seguir al mouse
      if(!oscuro(s))continue;                        // solo en fondos oscuros
      if(getComputedStyle(s).position==='static')s.style.position='relative';
      s.classList.add('noor-luz-on');
      var l=document.createElement('div');l.className='noor-luz';l.innerHTML='<i></i>';
      s.insertBefore(l,s.firstChild);seguir(s,l.firstChild);
    }
  },400);

  /* Al aparecer en pantalla */
  function alVer(el,fn){
    if(quieto||!window.IntersectionObserver){fn();return}
    var io=new IntersectionObserver(function(e){if(e[0].isIntersecting){io.disconnect();fn()}},{threshold:.35});
    io.observe(el);
  }

  /* Estrellas que se llenan doradas una por una */
  setTimeout(function(){
    var zonas=document.querySelectorAll('.noor-reviews');
    for(var z=0;z<zonas.length;z++){
      var w=document.createTreeWalker(zonas[z],NodeFilter.SHOW_TEXT,null,false),nodos=[],n;
      while((n=w.nextNode()))if(n.nodeValue.indexOf('★')>-1&&!(n.parentNode.classList&&n.parentNode.classList.contains('noor-est')))nodos.push(n);
      nodos.forEach(function(t){
        var f=document.createDocumentFragment(),grupo=[];
        t.nodeValue.split('').forEach(function(ch){
          if(ch==='★'){var sp=document.createElement('span');sp.className='noor-est';sp.textContent='★';f.appendChild(sp);grupo.push(sp)}
          else f.appendChild(document.createTextNode(ch));
        });
        var padre=t.parentNode;padre.replaceChild(f,t);
        alVer(padre,function(){grupo.forEach(function(sp,i){
          setTimeout(function(){sp.classList.add('on');setTimeout(function(){sp.classList.add('ok')},300)},quieto?0:i*110);
        })});
      });
    }
  },300);

  /* Preguntas frecuentes: abren y cierran deslizando */
  var dets=document.querySelectorAll('.noor-faq details');
  for(var d=0;d<dets.length;d++)(function(det){
    var sum=det.querySelector('summary');if(!sum||det.querySelector('.noor-faq-body'))return;
    var body=document.createElement('div');body.className='noor-faq-body';
    while(sum.nextSibling)body.appendChild(sum.nextSibling);
    det.appendChild(body);
    if(quieto||!body.animate)return;
    var anim=null;
    sum.addEventListener('click',function(e){
      e.preventDefault();if(anim)anim.cancel();
      if(!det.open){
        det.open=true;var h=body.scrollHeight;
        anim=body.animate([{height:'0px',opacity:0},{height:h+'px',opacity:1}],{duration:320,easing:'cubic-bezier(.2,.7,.2,1)'});
        anim.onfinish=function(){anim=null};
      }else{
        anim=body.animate([{height:body.scrollHeight+'px',opacity:1},{height:'0px',opacity:0}],{duration:260,easing:'cubic-bezier(.4,0,.2,1)'});
        anim.onfinish=function(){det.open=false;anim=null};
      }
    });
  })(dets[d]);

  /* Medidas: los números cuentan hasta su valor al aparecer */
  var cajas=document.querySelectorAll('.noor-medidas');
  for(var c=0;c<cajas.length;c++)(function(caja){
    var nums=[],todos=caja.querySelectorAll('strong,b,td');
    for(var i=0;i<todos.length;i++){var el=todos[i],m=/^\s*(\d{2,3})\s*mm\s*$/.exec(el.textContent);
      if(m&&!el.children.length)nums.push([el,+m[1]])}
    if(!nums.length||quieto)return;
    nums.forEach(function(x){x[0].textContent='0 mm'});
    alVer(caja,function(){
      var t0=null;
      function paso(t){if(!t0)t0=t;var f=Math.min((t-t0)/900,1),e=1-Math.pow(1-f,3);
        nums.forEach(function(x){x[0].textContent=Math.round(x[1]*e)+' mm'});
        if(f<1)requestAnimationFrame(paso)}
      requestAnimationFrame(paso);
    });
  })(cajas[c]);
});

})();
