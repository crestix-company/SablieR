'use strict';
const photographs={
 hair:{label:'髪 / HAIR SALON',items:[['美容の道具',1477,1108],['サロンの扉',1477,1108],['セットスペース',1108,1477],['サロンの空間',1108,1477],['シャンプースペース',1108,1477],['キッズルーム',1475,1110]]},
 bake:{label:'お菓子 / BAKE',items:[['小さなオヤツ屋',1108,1477],['いろいろなお菓子',1064,1538],['ひと皿のおやつ',1170,1362],['季節のお菓子',1206,1357],['日々のご褒美に',1108,1477],['おやつの時間',1108,1477],['お気に入りのひと口',1280,1280]]},
 objects:{label:'古道具 / OLD THINGS',items:[['時を重ねた道具',1108,1477],['暮らしのなかの器',1131,1447],['地球儀',1108,1477],['味わいのある佇まい',1108,1477],['木の椅子',1108,1477],['もうひとつの椅子',1108,1477]]}
};
const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
const modal=document.querySelector('.lightbox');
const modalImage=modal.querySelector('.lightbox-image');
let selectedGroup='hair',selectedIndex=0,opener=null;
function showPhoto(){
 const group=photographs[selectedGroup];const [caption,w,h]=group.items[selectedIndex];
 modalImage.src=`assets/${selectedGroup}-${selectedIndex+1}.webp`;
 modalImage.alt=`SablieR ${caption}`;modalImage.width=w;modalImage.height=h;
 modal.querySelector('.lightbox-category').textContent=group.label;
 modal.querySelector('#lightbox-caption').textContent=caption;
 modal.querySelector('.lightbox-position').textContent=`${String(selectedIndex+1).padStart(2,'0')} / ${String(group.items.length).padStart(2,'0')}`;
}
function movePhoto(step){selectedIndex=(selectedIndex+step+photographs[selectedGroup].items.length)%photographs[selectedGroup].items.length;showPhoto()}
for(const [key,group] of Object.entries(photographs)){
 const rail=document.getElementById(`${key}-gallery`);
 group.items.forEach(([caption,w,h],index)=>{
  const figure=document.createElement('figure');figure.className='photo-card';figure.style.setProperty('--ratio',w/h);
  const button=document.createElement('button');button.type='button';button.className='photo-button';button.setAttribute('aria-label',`${caption}の写真を拡大（${index+1} / ${group.items.length}）`);
  const image=document.createElement('img');image.src=`assets/${key}-${index+1}-small.webp`;image.srcset=`assets/${key}-${index+1}-small.webp 600w, assets/${key}-${index+1}.webp ${Math.min(w,1200)}w`;image.sizes='(max-width: 700px) 400px, 520px';image.alt=`SablieR ${caption}`;image.width=w;image.height=h;image.loading='lazy';image.decoding='async';
  const zoom=document.createElement('span');zoom.className='photo-zoom';zoom.textContent='+';zoom.setAttribute('aria-hidden','true');
  button.append(image,zoom);
  const figcaption=document.createElement('figcaption');const number=document.createElement('span');number.textContent=String(index+1).padStart(2,'0');const name=document.createElement('span');name.textContent=caption;figcaption.append(number,name);
  figure.append(button,figcaption);rail.append(figure);
  button.addEventListener('click',()=>{selectedGroup=key;selectedIndex=index;opener=button;showPhoto();modal.showModal();document.body.classList.add('is-locked');modal.querySelector('.lightbox-close').focus()});
 });
 const previous=document.querySelector(`[data-gallery="${key}"][data-step="-1"]`);const next=document.querySelector(`[data-gallery="${key}"][data-step="1"]`);
 function updateControls(){previous.disabled=rail.scrollLeft<4;next.disabled=rail.scrollLeft>=rail.scrollWidth-rail.clientWidth-4}
 rail.addEventListener('scroll',updateControls,{passive:true});new ResizeObserver(updateControls).observe(rail);updateControls();
 for(const control of [previous,next]) control.addEventListener('click',()=>{
  const step=Number(control.dataset.step);const cards=[...rail.children];const left=rail.getBoundingClientRect().left;const padding=parseFloat(getComputedStyle(rail).paddingLeft);const active=cards.findIndex(card=>card.getBoundingClientRect().left-left>=padding-5);
  const current=active<0?cards.length-1:active;const target=cards[Math.max(0,Math.min(cards.length-1,current+step))];
  rail.scrollTo({left:rail.scrollLeft+target.getBoundingClientRect().left-left-padding,behavior:motion.matches?'instant':'smooth'});
 });
}
modal.querySelector('.lightbox-close').addEventListener('click',()=>modal.close());
modal.querySelector('.lightbox-prev').addEventListener('click',()=>movePhoto(-1));
modal.querySelector('.lightbox-next').addEventListener('click',()=>movePhoto(1));
modal.addEventListener('keydown',event=>{if(event.key==='ArrowRight'){event.preventDefault();movePhoto(1)}if(event.key==='ArrowLeft'){event.preventDefault();movePhoto(-1)}});
modal.addEventListener('close',()=>{document.body.classList.remove('is-locked');opener?.focus({preventScroll:true})});
let touchStart=null;modalImage.addEventListener('touchstart',event=>{touchStart=event.changedTouches[0].clientX},{passive:true});modalImage.addEventListener('touchend',event=>{if(touchStart!==null){const distance=event.changedTouches[0].clientX-touchStart;if(Math.abs(distance)>60)movePhoto(distance<0?1:-1)}touchStart=null},{passive:true});
const menuToggle=document.querySelector('.menu-toggle');const mobileMenu=document.querySelector('.mobile-nav');
function closeMenu(){menuToggle.setAttribute('aria-expanded','false');menuToggle.querySelector('.menu-label').textContent='MENU';mobileMenu.hidden=true;document.body.classList.remove('is-locked')}
menuToggle.addEventListener('click',()=>{const open=menuToggle.getAttribute('aria-expanded')==='true';if(open){closeMenu()}else{menuToggle.setAttribute('aria-expanded','true');menuToggle.querySelector('.menu-label').textContent='CLOSE';mobileMenu.hidden=false;document.body.classList.add('is-locked')}});
mobileMenu.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(!mobileMenu.hidden&&event.key==='Escape'){closeMenu();menuToggle.focus()}if(!mobileMenu.hidden&&event.key==='Tab'){const links=[menuToggle,...mobileMenu.querySelectorAll('a')];if(event.shiftKey&&document.activeElement===links[0]){event.preventDefault();links.at(-1).focus()}else if(!event.shiftKey&&document.activeElement===links.at(-1)){event.preventDefault();links[0].focus()}}});
window.matchMedia('(min-width: 701px)').addEventListener('change',event=>{if(event.matches)closeMenu()});
const sectionObserver=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){document.querySelectorAll('.desktop-nav a').forEach(link=>{if(link.hash===`#${entry.target.id}`)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current')})}},{rootMargin:'-10% 0px -65% 0px',threshold:0});
document.querySelectorAll('main section[id]').forEach(section=>sectionObserver.observe(section));
