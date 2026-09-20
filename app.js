const GROUPS={"Tiffins":{"Tiffins":["Poori","Idli","Vada","Mysore Bonda","Gunta Punugulu","Uttappam","Upma","Pongal"]},"Appetizers":{"Veg":["Onion Pakodi","Mirchi Bajji","Cut Mirchi","Stuffed Mirchi Bajji","Paneer 65","Peri Peri Paneer","Chilli Paneer","Gobi Manchurian"],"Non-Veg · Chicken":["Chicken 65","Chilli Chicken","Chicken Majestic","Velulli Chicken Fry"],"Non-Veg · Goat":["Ghee Roast Goat"]},"Curries":{"Veg":["Paneer Butter Masala","Paneer Tikka Masala","Palak Paneer","Bagara Baingan","Gutti Vankaya","Dum Aloo","Chole Masala","Dal Makhani","Dal Tadka","Sambar","Rasam","Pachi Pulusu","Meal Maker Curry (Soya Chunks)","Dal (Choice of Any)","Fry (Choice of Any)"],"Non-Veg":["Egg Masala","Chicken Curry","Goat Curry","Andhra Chepala Pulusu"]},"Rice & Biryani":{"Veg":["Paneer Pulao","Meal Maker Pulao (Soya Chunks)","Veg Kheema Biryani (Soya Chunks)","Mixed Veg Pulao","Tomato Rice","Pudina Rice","Bagara Rice","Jeera Rice","Gutti Vankaya Biryani","Aloo Matar Paneer Pulao"],"Non-Veg":["Fried Rice (Chicken / Egg)","Vijayawada Boneless Chicken Biryani","Hyderabadi Dum Chicken Biryani","Chicken Pulao","Hyderabadi Mutton Dum Biryani","Mutton Pulao","Thalappakatti Mutton Biryani"]},"Desserts":{"Desserts":["Gulab Jamun","Kheer","Kesar","Phool Makhana Kheer"]},"Drinks":{"Drinks":["Rooh Afza","Badam Milk","Masala Tea"]},"Chaat":{"Chaat":["Pani Puri","Dahi Puri","Samosa Chaat","Muntha Masala"]}};
const MENU=Object.fromEntries(Object.entries(GROUPS).map(([k,v])=>[k,Object.values(v).flat()]));

const $=s=>document.querySelector(s);
let category=Object.keys(MENU)[0];
function escapeHtml(v){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
const varieties={'Dal (Choice of Any)':'Tomato · Spinach · Dosakaya · Mango · Methi','Fry (Choice of Any)':'Aloo · Tindora · Okra · Gobi','Fried Rice (Chicken / Egg)':'Chicken or egg'};
function quantityNote(name){if(MENU.Chaat.includes(name))return '$5 / person'+(['Pani Puri','Dahi Puri'].includes(name)?' · 6 pieces per person':'');return ['Poori','Idli','Vada'].includes(name)?'By the piece · Quantity by phone':'Quantity & pricing by phone'}
function renderMenu(){const q=$('#search').value.trim().toLowerCase();let html='',count=0;for(const [cat,groups] of Object.entries(GROUPS)){if(!q&&cat!==category)continue;for(const [group,names] of Object.entries(groups)){const found=names.filter(n=>(n+' '+(varieties[n]||'')).toLowerCase().includes(q));if(!found.length)continue;html+='<h3 class="menu-group">'+(q?cat+' · ':'')+group+'</h3>';for(const name of found){count++;html+='<article class="dish"><h3>'+name+'</h3>'+(varieties[name]?'<p class="catalog-variety">'+varieties[name]+'</p>':'')+'<p class="catalog-quantity">'+quantityNote(name)+'</p></article>'}}}$('#menu').dataset.category=category;$('#menu').innerHTML=html||'<p>No matching dishes.</p>';$('#searchStatus').textContent=q?count+' matching '+(count===1?'dish':'dishes')+' across all categories':''}
function selectCategory(next,scrollTab=true){if(!Object.hasOwn(MENU,next))return;category=next;$('#search').value='';document.querySelectorAll('[data-c]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.c===category)));document.querySelectorAll('[data-c]').forEach(b=>b.classList.toggle('active',b.dataset.c===category));const index=Object.keys(MENU).indexOf(category);$('#previousCategory').disabled=index===0;$('#nextCategory').disabled=index===Object.keys(MENU).length-1;renderMenu();animateMenuCards();if(scrollTab)document.querySelector('[data-c].active')?.scrollIntoView({block:'nearest',inline:'nearest',behavior:'auto'})}
$('#tabs').innerHTML=Object.keys(MENU).map(c=>'<button class="tab" data-c="'+c+'">'+c+'</button>').join('');document.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>selectCategory(b.dataset.c));$('#previousCategory').onclick=()=>selectCategory(Object.keys(MENU)[Object.keys(MENU).indexOf(category)-1]);$('#nextCategory').onclick=()=>selectCategory(Object.keys(MENU)[Object.keys(MENU).indexOf(category)+1]);$('#search').oninput=renderMenu;selectCategory(category,false);
function submitChatMessage(text){text=text.trim();if(!text)return;addChatMessage(text,'user');addChatMessage(chatReply(text))}
document.querySelectorAll('[data-chat-prompt]').forEach(b=>b.onclick=()=>{submitChatMessage(b.dataset.chatPrompt)});
$("#feedbackForm").onsubmit=async e=>{e.preventDefault();const message=$("#reviewMessage");message.setCustomValidity(message.value.trim()?"":"Please write a few words about your experience.");if(!message.reportValidity())return;const rating=$("input[name=rating]:checked").value;const reviewText=`SHRIYAN'S KITCHEN — Customer review\nName: ${$("#reviewName").value.trim()||"Anonymous"}\nRating: ${rating}/5\n\n${message.value.trim()}`;try{await navigator.clipboard.writeText(reviewText);$("#feedbackStatus").textContent="Thank you for sharing your thoughts! 😊 Your review is copied. Paste it into a message to the kitchen to send it."}catch{$("#feedbackStatus").textContent="Copy was unavailable. You can select and copy your review text above to share it with the kitchen."}};
$("#reviewMessage").oninput=()=>{$("#reviewMessage").setCustomValidity("");$("#feedbackStatus").textContent=""};
const chatAnswers=[[/price|pricing|cost|size|quantit|guest|people/i,"Please call the kitchen to discuss quantities and pricing. Chaat is $5 per person per item; Pani Puri and Dahi Puri include 6 pieces per person."],[/spice|hot|mild/i,"Please discuss your preferred spice level with the kitchen when you call. Spice adjustments are available for selected dishes."],[/pickup|time|hour/i,"Pickup is available from 7:00 AM to midnight CST. Arrange your pickup time with the kitchen by phone."],[/where|location|address|plainfield|delivery|deliver|station/i,"Pickup and delivery are available. We are based in Plainfield, Illinois. Please confirm your pickup time or delivery address and arrangements with the kitchen."],[/\border\b|how (?:do|can) (?:i|we) (?:book|request)/i,"Browse the menu, then call us to discuss your guest count, dish quantities, preferences, and pickup or delivery."],[/menu|dish|food/i,"Browse Tiffins, Appetizers, Curries, Rice & Biryani, Desserts, Drinks, and Chaat. You can search across every category."]];
function chatReply(text){
const q=text.toLowerCase();
if(/allerg|gluten|nut.free|dairy.free|vegan/.test(q))return 'Please discuss allergies and dietary needs directly with the kitchen before ordering. I cannot confirm ingredients or cross-contact safety.';
if(/deliver/.test(q))return 'Pickup and delivery are available. Please contact the kitchen to confirm delivery to your address, timing, and any delivery charges.';
if(/phone|number|contact|call/.test(q))return 'Our business phone number has not been published here yet. I can help you browse, but I cannot contact the kitchen or place an order.';
if(/\b(hi|hello|hey)\b|your name|who are you/.test(q))return 'Hi! I’m Shrilu, your little automated menu guide. Let’s find something you’ll love! Try “biryani”, “vegetarian dishes”, or “pickup hours”.';
const match=chatAnswers.slice(0,5).find(([pattern])=>pattern.test(text));if(match)return match[1];
if(/vegetarian|\bveg\b/.test(q)&&!/non.?veg/.test(q))return 'For a vegetarian spread, explore Paneer Butter Masala, Palak Paneer, Gutti Vankaya, Mixed Veg Pulao, and Gobi Manchurian. Ask the kitchen about your preferences when arranging pickup or delivery.';
if(/dessert|sweet/.test(q))return 'A sweet finish! We have '+MENU.Desserts.join(', ')+'. Discuss quantities with the kitchen.';
if(/drink|tea|milk/.test(q))return 'Something to sip: '+MENU.Drinks.join(', ')+'.';
const words=q.replace(/[^a-z0-9 ]/g,' ').split(/\s+/).filter(w=>w.length>2&&!['show','have','what','your','with','some','like','want','menu','does','there','please','dish','dishes','the','and','for','any','are','you','can'].includes(w));
const dishes=Object.values(MENU).flat().filter(name=>words.some(w=>name.toLowerCase().includes(w)));
if(dishes.length)return 'On our menu: '+dishes.slice(0,8).join(', ')+(dishes.length>8?'. Search the menu to see more.':'. Quantities, pickup, and delivery are arranged with the kitchen.');
const cat=Object.keys(MENU).find(c=>q.includes(c.toLowerCase()));if(cat)return MENU[cat].join(', ')+'.';
return 'I can help with our menu, pricing, spice preferences, pickup, and delivery. Try “chicken dishes” or “something sweet”. I’m an automated menu guide; the kitchen confirms all orders.';
}
function addChatMessage(text,kind="bot"){const p=document.createElement("p");p.className="chat-"+kind;p.textContent=text;$("#chatLog").appendChild(p);$("#chatLog").scrollTop=$("#chatLog").scrollHeight}
$("#chatToggle").onclick=()=>{$("#chatWidget").hidden=false;$("#chatToggle").setAttribute("aria-expanded","true");$("#chatInput").focus()};$("#chatClose").onclick=()=>{$("#chatWidget").hidden=true;$("#chatToggle").setAttribute("aria-expanded","false");$("#chatToggle").focus()};$("#chatForm").onsubmit=e=>{e.preventDefault();const input=$("#chatInput"),text=input.value.trim();input.value="";submitChatMessage(text)};

// Animate visible sections once; content stays readable without animation support.
function animateMenuCards(){
  if(typeof matchMedia!=='function'||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  document.querySelectorAll('#menu .dish').forEach((card,i)=>{
    if(typeof card.animate!=='function')return;
    card.animate([{opacity:.35,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:360,delay:Math.min(i,6)*35,easing:'cubic-bezier(.2,.8,.2,1)'});
  });
}
if(typeof IntersectionObserver==='function'&&typeof matchMedia==='function'){
  const motionPreference=matchMedia('(prefers-reduced-motion: reduce)');
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(!entry.isIntersecting)return;
    observer.unobserve(entry.target);
    if(!motionPreference.matches&&typeof entry.target.animate==='function')entry.target.animate([{opacity:.45,transform:'translateY(20px)'},{opacity:1,transform:'translateY(0)'}],{duration:600,easing:'cubic-bezier(.2,.8,.2,1)'});
  }),{threshold:.12});
  document.querySelectorAll('.hero-copy,.hero-art,#our-story,.section-title,.occasion-grid article,#plan,#customerFeedback').forEach(section=>observer.observe(section));
  motionPreference.addEventListener('change',()=>{if(motionPreference.matches)document.getAnimations?.().forEach(animation=>animation.cancel())});
}


document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!$('#chatWidget').hidden)$('#chatClose').onclick()});
