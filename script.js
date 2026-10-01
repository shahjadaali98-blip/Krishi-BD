/* KrishiBD marketplace - frontend demo */
let cart = JSON.parse(localStorage.getItem('krishiCart') || '[]');
let currentRole = 'buyer';

const products = () => [...document.querySelectorAll('.crop-card')].map(card => ({
  id: card.dataset.name,
  name: card.dataset.name,
  price: Number(card.dataset.price),
  unit: card.dataset.unit,
  seller: card.dataset.seller,
  phone: card.dataset.phone
}));

function bn(n){return Number(n).toLocaleString('bn-BD');}
function saveCart(){localStorage.setItem('krishiCart',JSON.stringify(cart)); updateCartCount();}
function updateCartCount(){const el=document.getElementById('cartCount');if(el)el.textContent=bn(cart.reduce((s,i)=>s+i.qty,0));}

function toggleMenu(){const menu=document.querySelector('.menu');if(!menu)return;menu.style.display=menu.style.display==='flex'?'none':'flex';if(menu.style.display==='flex'){menu.style.flexDirection='column';menu.style.position='absolute';menu.style.top='75px';menu.style.left='0';menu.style.right='0';menu.style.background='white';menu.style.padding='20px';menu.style.borderBottom='1px solid #ddd';}}
function scrollToCrops(){document.getElementById('crops')?.scrollIntoView({behavior:'smooth'});}

function filterCrop(category){
  document.querySelectorAll('.category').forEach(b=>b.classList.toggle('active',category==='all'?b.textContent.trim()==='সব':b.textContent.includes(category)));
  document.querySelectorAll('.crop-card').forEach(card=>card.style.display=category==='all'||card.dataset.crop===category?'block':'none');
}
function searchCrop(){
  const keyword=document.getElementById('searchInput').value.trim().toLowerCase();
  if(!keyword){alert('অনুগ্রহ করে ফসল, জেলা অথবা কৃষকের নাম লিখুন।');return;}
  let found=false;
  document.querySelectorAll('.crop-card').forEach(card=>{const ok=card.innerText.toLowerCase().includes(keyword);card.style.display=ok?'block':'none';if(ok)found=true;});
  scrollToCrops(); if(!found)alert('দুঃখিত! আপনার অনুসন্ধানের সাথে মিল পাওয়া যায়নি।');
}

function openModal(content){document.getElementById('modalBody').innerHTML=content;document.getElementById('modal').classList.add('show');}
function closeModal(){document.getElementById('modal').classList.remove('show');}

document.addEventListener('click',e=>{if(e.target.id==='modal')closeModal();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});

function roleLabel(role){return role==='seller'?'Seller':role==='admin'?'Admin':'Buyer';}
function roleBangla(role){return role==='seller'?'বিক্রেতা':role==='admin'?'অ্যাডমিন':'ক্রেতা';}
function getAccounts(){return JSON.parse(localStorage.getItem('krishiAccounts')||'[]');}
function saveAccounts(accounts){localStorage.setItem('krishiAccounts',JSON.stringify(accounts));}
function authShell(mode,role){
  const login=mode==='login';
  return `<div class="auth-modal">
    <div class="auth-brand"><div class="auth-logo">🌱</div><div><strong>KrishiBD</strong><span>${login?'আপনার অ্যাকাউন্টে প্রবেশ করুন':'নতুন অ্যাকাউন্ট তৈরি করুন'}</span></div></div>
    <div class="tabs"><button class="tab ${login?'active':''}" onclick="showAuth('login','${role}')">প্রবেশ করুন</button><button class="tab ${!login?'active':''}" onclick="showAuth('signup','${role}')">নিবন্ধন</button></div>
    <div class="auth-heading"><h2 id="authTitle">${login?roleLabel(role)+' Login':'নতুন '+roleBangla(role)+' অ্যাকাউন্ট'}</h2><p>${login?'আপনার তথ্য দিয়ে নিরাপদে প্রবেশ করুন।':'আপনার জন্য সঠিক অ্যাকাউন্টের ধরন নির্বাচন করুন।'}</p></div>
    ${roleCards(role)}
    <form class="auth-form" onsubmit="${login?'loginUser':'registerUser'}(event)">${login?loginFields(role):signupFields(role)}</form>
    ${login?'<button type="button" class="forgot-btn" onclick="forgotPassword()">পাসওয়ার্ড ভুলে গেছেন?</button>':'<p class="auth-terms">নিবন্ধন করে আপনি KrishiBD-এর শর্তাবলীতে সম্মত হচ্ছেন।</p>'}
  </div>`;
}
function roleCards(selected){return `<div class="role-grid"><button type="button" class="role-card ${selected==='seller'?'active':''}" onclick="showAuth(currentAuthMode,'seller')"><span>🧑‍🌾</span><b>Seller</b><small>পণ্য বিক্রি করুন</small></button><button type="button" class="role-card ${selected==='buyer'?'active':''}" onclick="showAuth(currentAuthMode,'buyer')"><span>🛍️</span><b>Buyer</b><small>পণ্য কিনুন</small></button><button type="button" class="role-card ${selected==='admin'?'active':''}" onclick="showAuth(currentAuthMode,'admin')"><span>🛡️</span><b>Admin</b><small>সিস্টেম পরিচালনা</small></button></div><input type="hidden" id="selectedRole" value="${selected}">`;}
function passwordField(id,label,placeholder,extra=''){return `<div class="form-group"><label>${label}</label><div class="password-wrap"><input id="${id}" type="password" placeholder="${placeholder}" ${extra} required><button type="button" class="password-toggle" onclick="togglePassword('${id}',this)" aria-label="Show password">👁️</button></div></div>`;}
function loginFields(role){return `<div class="form-group"><label>মোবাইল নম্বর / ইমেইল</label><input id="authContact" type="text" placeholder="01XXXXXXXXX অথবা email@example.com" autocomplete="username" required></div>${passwordField('authPassword','পাসওয়ার্ড','আপনার পাসওয়ার্ড','autocomplete="current-password"')}<div class="auth-row"><label class="remember"><input id="rememberMe" type="checkbox"> <span>আমাকে মনে রাখুন</span></label></div><button class="btn primary auth-submit" type="submit"><span>🔐</span> প্রবেশ করুন</button>`;}
function signupFields(role){return `<div class="form-group"><label>পূর্ণ নাম</label><input id="fullName" type="text" placeholder="আপনার পূর্ণ নাম" autocomplete="name" required></div><div class="form-group"><label>মোবাইল নম্বর</label><input id="authContact" type="tel" placeholder="01XXXXXXXXX" autocomplete="tel" pattern="01[0-9]{9}" required></div><div class="form-group"><label>ইমেইল <span class="optional">(ঐচ্ছিক)</span></label><input id="authEmail" type="email" placeholder="email@example.com" autocomplete="email"></div>${passwordField('authPassword','পাসওয়ার্ড','কমপক্ষে ৬ অক্ষর','minlength="6" autocomplete="new-password"')}${passwordField('confirmPassword','পাসওয়ার্ড আবার লিখুন','একই পাসওয়ার্ড লিখুন','minlength="6" autocomplete="new-password"')}${role==='seller'?'<div class="form-group"><label>জেলা</label><input id="sellerDistrict" type="text" placeholder="আপনার জেলা" required></div>':''}${role==='buyer'?'<div class="form-group"><label>ডেলিভারি এলাকা</label><input id="buyerArea" type="text" placeholder="আপনার এলাকা" required></div>':''}${role==='admin'?'<div class="form-group"><label>Admin Access Code</label><input id="adminCode" type="password" placeholder="Admin code" required></div>':''}<button class="btn primary auth-submit" type="submit"><span>✓</span> অ্যাকাউন্ট তৈরি করুন</button>`;}
let currentAuthMode='login';
function openLogin(defaultRole='buyer'){showAuth('login',defaultRole);}
function showAuth(mode,role){currentAuthMode=mode;currentRole=role;openModal(authShell(mode,role));}
function openRegister(defaultRole='seller'){showAuth('signup',defaultRole);}
function togglePassword(id,button){const input=document.getElementById(id);if(!input)return;input.type=input.type==='password'?'text':'password';button.textContent=input.type==='password'?'👁️':'🙈';}
function validContact(value){return /^(01[0-9]{9}|[^\s@]+@[^\s@]+\.[^\s@]+)$/.test(value);}
function loginUser(e){
  e.preventDefault();
  const role=document.getElementById('selectedRole')?.value||currentRole;
  const contact=document.getElementById('authContact').value.trim();
  const password=document.getElementById('authPassword').value;
  const accounts=getAccounts();
  const account=accounts.find(a=>a.role===role && (a.phone===contact || a.email===contact) && a.password===password);
  if(!account){showAuth('login',role);document.getElementById('authContact').value=contact;document.querySelector('.auth-form')?.insertAdjacentHTML('afterbegin','<div class="auth-error">⚠️ মোবাইল/ইমেইল, পাসওয়ার্ড অথবা অ্যাকাউন্টের ধরন সঠিক নয়।</div>');return;}
  localStorage.setItem('krishiUser',JSON.stringify({role,name:account.name,phone:account.phone,email:account.email||''}));
  closeModal();updateAuthUI();
  if(role==='admin')openAdmin(); else alert(`${roleBangla(role)} হিসেবে সফলভাবে লগইন হয়েছে।`);
}
function registerUser(e){
  e.preventDefault();
  const role=document.getElementById('selectedRole')?.value||currentRole;
  const name=document.getElementById('fullName').value.trim();
  const phone=document.getElementById('authContact').value.trim();
  const email=document.getElementById('authEmail')?.value.trim()||'';
  const password=document.getElementById('authPassword').value;
  const confirm=document.getElementById('confirmPassword').value;
  if(!validContact(phone)){showAuth('signup',role);document.getElementById('authContact').value=phone;document.querySelector('.auth-form')?.insertAdjacentHTML('afterbegin','<div class="auth-error">⚠️ সঠিক ১১ সংখ্যার বাংলাদেশি মোবাইল নম্বর দিন।</div>');return;}
  if(password!==confirm){showAuth('signup',role);document.getElementById('authContact').value=phone;document.querySelector('.auth-form')?.insertAdjacentHTML('afterbegin','<div class="auth-error">⚠️ দুইটি পাসওয়ার্ড একই হতে হবে।</div>');return;}
  if(role==='admin' && document.getElementById('adminCode').value!=='KRISHIBD-ADMIN'){showAuth('signup',role);document.getElementById('authContact').value=phone;document.querySelector('.auth-form')?.insertAdjacentHTML('afterbegin','<div class="auth-error">⚠️ Admin access code সঠিক নয়। Demo code: KRISHIBD-ADMIN</div>');return;}
  const accounts=getAccounts();
  if(accounts.some(a=>a.phone===phone || (email && a.email===email))){showAuth('signup',role);document.getElementById('authContact').value=phone;document.querySelector('.auth-form')?.insertAdjacentHTML('afterbegin','<div class="auth-error">⚠️ এই মোবাইল নম্বর বা ইমেইল দিয়ে ইতিমধ্যে অ্যাকাউন্ট আছে।</div>');return;}
  const account={id:Date.now(),role,name,phone,email,password};
  if(role==='seller')account.district=document.getElementById('sellerDistrict').value.trim();
  if(role==='buyer')account.area=document.getElementById('buyerArea').value.trim();
  accounts.push(account);saveAccounts(accounts);
  showAuth('login',role);document.getElementById('authContact').value=phone;document.querySelector('.auth-form')?.insertAdjacentHTML('afterbegin','<div class="auth-success">✓ অ্যাকাউন্ট তৈরি হয়েছে। এখন আপনার পাসওয়ার্ড দিয়ে লগইন করুন।</div>');
}
function forgotPassword(){openModal(`<div class="auth-modal"><div class="auth-brand"><div class="auth-logo">🔑</div><div><strong>পাসওয়ার্ড রিসেট</strong><span>আপনার অ্যাকাউন্ট খুঁজে নিন</span></div></div><div class="form-group"><label>মোবাইল নম্বর / ইমেইল</label><input id="resetContact" type="text" placeholder="আপনার মোবাইল বা ইমেইল" required></div><button class="btn primary auth-submit" onclick="resetPasswordRequest()">রিসেট লিংক পাঠান</button><button class="forgot-btn" onclick="showAuth('login',currentRole)">← Login-এ ফিরে যান</button></div>`);}
function resetPasswordRequest(){const contact=document.getElementById('resetContact').value.trim();if(!contact){alert('মোবাইল নম্বর বা ইমেইল দিন।');return;}const exists=getAccounts().some(a=>a.phone===contact||a.email===contact);openModal(`<div class="success-box"><div class="icon">${exists?'📩':'ℹ️'}</div><h2>${exists?'রিসেট অনুরোধ গ্রহণ করা হয়েছে':'অ্যাকাউন্ট পাওয়া যায়নি'}</h2><p>${exists?'Demo mode-এ আসল SMS/email পাঠানো হয় না। Backend যুক্ত করলে এখানে OTP/reset link যাবে।':'এই মোবাইল নম্বর বা ইমেইল দিয়ে কোনো অ্যাকাউন্ট পাওয়া যায়নি।'}</p><button class="btn primary" style="margin-top:15px" onclick="showAuth('login',currentRole)">Login-এ ফিরে যান</button></div>`);}
function updateAuthUI(){const user=JSON.parse(localStorage.getItem('krishiUser')||'null');const box=document.querySelector('.auth-buttons');if(!box)return;if(user){box.innerHTML=`<button class="user-head" onclick="openUserMenu()"><span class="avatar">${user.role==='seller'?'🧑‍🌾':user.role==='admin'?'🛡️':'🛍️'}</span><span>${user.name||roleLabel(user.role)}</span></button><button class="cart-head" onclick="openCart()" aria-label="My Cart">🛒 <span class="cart-label">My Cart</span> <span id="cartCount">${bn(cart.reduce((s,i)=>s+i.qty,0))}</span></button>`;}else{box.innerHTML='<button class="btn login" onclick="openLogin()">প্রবেশ করুন</button><button class="btn register" onclick="openRegister()">নিবন্ধন</button><button class="cart-head" onclick="openCart()" aria-label="My Cart">🛒 <span class="cart-label">My Cart</span> <span id="cartCount">0</span></button>';updateCartCount();}}
function openUserMenu(){const user=JSON.parse(localStorage.getItem('krishiUser')||'null');if(!user)return;openModal(`<div class="user-panel"><div class="user-profile"><div class="big-avatar">${user.role==='seller'?'🧑‍🌾':user.role==='admin'?'🛡️':'🛍️'}</div><div><h2>${user.name||roleLabel(user.role)}</h2><span>${roleBangla(user.role)} · ${user.phone||''}</span></div></div><button class="profile-action" onclick="closeModal();${user.role==='seller'?'openCropPost()':user.role==='admin'?'openAdmin()':'openCart()'}">${user.role==='seller'?'📦 আমার পণ্য':user.role==='admin'?'🛡️ Admin Dashboard':'🛒 আমার Cart'}</button><button class="profile-action" onclick="logoutUser()">🚪 Logout</button></div>`);}
function logoutUser(){localStorage.removeItem('krishiUser');closeModal();updateAuthUI();alert('আপনি সফলভাবে Logout করেছেন।');}

function updateCardEstimate(input){
  const card=input.closest('.crop-card');const estimate=card?.querySelector('.order-estimate strong');
  if(!card||!estimate)return;const qty=Number(input.value);const price=Number(card.dataset.price);
  estimate.textContent=Number.isFinite(qty)&&qty>0?'৳'+bn(qty*price):'পরিমাণ দিন';
}
function addToCart(button){
  const card=button.closest('.crop-card');
  const qtyInput=card.querySelector('.order-qty');
  const qty=Number(qtyInput?.value);
  if(!Number.isFinite(qty)||qty<=0){alert('সঠিক পরিমাণ লিখুন।');qtyInput?.focus();return;}
  const p={id:card.dataset.name,name:card.dataset.name,price:Number(card.dataset.price),unit:card.dataset.unit,seller:card.dataset.seller,phone:card.dataset.phone};
  const found=cart.find(i=>i.id===p.id);
  if(found)found.qty=Number((found.qty+qty).toFixed(3));else cart.push({...p,qty});
  saveCart();button.textContent='✓ Added';setTimeout(()=>button.textContent='🛒 Add to cart',900);
}
function changeQty(id,delta){const item=cart.find(i=>i.id===id);if(!item)return;item.qty+=delta;if(item.qty<=0)cart=cart.filter(i=>i.id!==id);saveCart();renderCart();}
function removeCart(id){cart=cart.filter(i=>i.id!==id);saveCart();renderCart();}
function cartTotals(){const subtotal=cart.reduce((s,i)=>s+i.price*i.qty,0);const delivery=subtotal?60:0;return {subtotal,delivery,total:subtotal+delivery};}
function openCart(){openModal('<div id="cartModal"></div>');renderCart();}
function cartIcon(name){const icons={'ডায়মন্ড আলু':'🥔','তাজা টমেটো':'🍅','ব্রি ধান-২৮':'🌾','হিমসাগর আম':'🥭','দেশি পেঁয়াজ':'🧅','হাইব্রিড ভুট্টা':'🌽'};return icons[name]||'🌱';}
function renderCart(){const box=document.getElementById('cartModal');if(!box)return;if(!cart.length){box.innerHTML='<div class="cart-title-row"><div><h2>🛒 My Cart</h2><p>আপনার যোগ করা পণ্য এখানে দেখা যাবে</p></div></div><div class="empty-cart">🛒<h3>আপনার কার্ট খালি</h3><p>পছন্দের পণ্য Add to cart করলে এখানে তার দাম ও পরিমাণ দেখা যাবে।</p><button class="btn primary" style="margin-top:15px" onclick="closeModal();scrollToCrops()">🌾 পণ্য দেখুন</button></div>';return;}const t=cartTotals();const totalQty=cart.reduce((s,i)=>s+i.qty,0);box.innerHTML=`<div class="cart-title-row"><div><h2>🛒 My Cart</h2><p>${bn(totalQty)}টি পণ্য · আপনার Cart-এর বিস্তারিত</p></div><span class="cart-mini-total">৳${bn(t.total)}</span></div><div class="cart-list">${cart.map(i=>`<div class="cart-item"><div class="cart-product-icon">${cartIcon(i.name)}</div><div class="cart-product-info"><strong>${i.name}</strong><div class="cart-meta">Seller: ${i.seller}</div><div class="cart-price-line"><span>দাম: <b>৳${bn(i.price)}</b> / ${i.unit}</span><span>পরিমাণ: <b>${bn(i.qty)} ${i.unit}</b></span></div><div class="qty-control"><button onclick="changeQty('${i.id}',-1)">−</button><input value="${i.qty}" readonly><button onclick="changeQty('${i.id}',1)">+</button><button onclick="removeCart('${i.id}')" class="remove-cart">🗑️ Remove</button></div></div><div class="cart-line-total"><small>মোট</small><strong>৳${bn(i.price*i.qty)}</strong></div></div>`).join('')}</div><div class="cart-summary"><div class="summary-row"><span>পণ্যের মোট দাম</span><strong>৳${bn(t.subtotal)}</strong></div><div class="summary-row"><span>ডেলিভারি চার্জ</span><strong>৳${bn(t.delivery)}</strong></div><div class="summary-row total"><span>সর্বমোট</span><strong>৳${bn(t.total)}</strong></div><button class="btn primary" style="width:100%;margin-top:12px" onclick="checkout()">🛍️ Checkout</button></div>`;}
function checkout(){const user=JSON.parse(localStorage.getItem('krishiUser')||'null');if(!user||user.role!=='buyer'){showAuth('login','buyer');alert('অনলাইনে অর্ডার করতে Buyer হিসেবে লগইন করুন।');return;}const t=cartTotals();openModal(`<div class="success-box"><div class="icon">🛍️</div><h2>Order Summary</h2><p>আপনার ${bn(cart.reduce((s,i)=>s+i.qty,0))}টি item-এর মোট মূল্য ৳${bn(t.total)}।</p><div class="form-group" style="text-align:left;margin-top:18px"><label>Delivery Address</label><textarea id="deliveryAddress" placeholder="আপনার সম্পূর্ণ ডেলিভারি ঠিকানা" required></textarea></div><button class="btn primary" style="width:100%" onclick="placeOrder()">Place Order</button></div>`);}
function placeOrder(){const address=document.getElementById('deliveryAddress')?.value.trim();if(!address){alert('ডেলিভারি ঠিকানা দিন।');return;}cart=[];saveCart();openModal('<div class="success-box"><div class="icon">✅</div><h2>Order placed successfully!</h2><p>আপনার অর্ডার গ্রহণ করা হয়েছে। Seller আপনার সাথে যোগাযোগ করবে।</p><button class="btn primary" style="margin-top:15px" onclick="closeModal()">ঠিক আছে</button></div>');}

function callSeller(button){const card=button.closest('.crop-card');const phone=card.dataset.phone;window.location.href=`tel:${phone}`;}
function messageSeller(button){const card=button.closest('.crop-card');const name=card.dataset.seller;openModal(`<h2>💬 ${name}-কে Message</h2><p style="color:#718078">পণ্য: ${card.dataset.name}</p><div class="form-group"><label>আপনার মেসেজ</label><textarea id="messageText" placeholder="দাম, পরিমাণ বা ডেলিভারি সম্পর্কে লিখুন"></textarea></div><button class="btn primary" style="width:100%" onclick="sendMessage('${name}')">Message পাঠান</button>`);}
function sendMessage(name){const msg=document.getElementById('messageText')?.value.trim();if(!msg){alert('মেসেজ লিখুন।');return;}alert(`${name}-এর কাছে আপনার Message পাঠানো হয়েছে।`);closeModal();}
function contactFarmer(name){openModal(`<div style="text-align:center"><div style="font-size:45px">👨‍🌾</div><h2>${name}</h2><p style="color:#718078">কৃষকের সাথে সরাসরি যোগাযোগ করুন</p><div style="background:#eff8f2;padding:15px;border-radius:12px;margin:20px 0"><strong style="color:#176b3a;font-size:22px">📞 ০১৩০০-০০০০০০</strong></div><a href="tel:01300000000" class="btn primary" style="display:block;width:100%">📞 এখন কল করুন</a></div>`);}

function openCropPost(){const user=JSON.parse(localStorage.getItem('krishiUser')||'null');if(!user||user.role!=='seller'){showAuth('login','seller');alert('ফসল পোস্ট করতে Seller হিসেবে লগইন করুন।');return;}openModal(`<h2>নতুন ফসলের পোস্ট</h2><p style="color:#718078;margin:5px 0 20px">আপনার ফসলের তথ্য ক্রেতাদের কাছে পৌঁছে দিন</p><form onsubmit="postCrop(event)"><div class="form-group"><label>ফসলের নাম</label><input required placeholder="যেমন: আলু"></div><div class="form-group"><label>পরিমাণ</label><input required placeholder="যেমন: ৫০০ কেজি"></div><div class="form-group"><label>প্রতি কেজি দাম</label><input type="number" required placeholder="যেমন: ৩২"></div><div class="form-group"><label>জেলা</label><input required placeholder="আপনার জেলা"></div><div class="form-group"><label>বিস্তারিত</label><textarea placeholder="ফসলের জাত, মান, সংগ্রহের তারিখ ইত্যাদি"></textarea></div><button class="btn primary" style="width:100%">পোস্ট করুন</button></form>`);}
function postCrop(e){e.preventDefault();alert('আপনার ফসলের পোস্ট সফলভাবে প্রকাশ করা হয়েছে।');closeModal();}

function openAdmin(){openModal(`<h2>🛡️ Admin Dashboard</h2><p style="color:#718078">Demo admin control panel</p><div class="admin-box"><strong>👨‍🌾 Sellers</strong><br>Registered sellers: 1,250+</div><div class="admin-box"><strong>🛍️ Buyers</strong><br>Marketplace buyers can place online orders.</div><div class="admin-box"><strong>📦 Products</strong><br>Current visible products: ${products().length}</div><button class="btn primary" style="width:100%" onclick="closeModal()">Dashboard বন্ধ করুন</button>`);}
function openHelp(){openModal('<h2>কীভাবে ব্যবহার করবেন?</h2><ol style="padding-left:20px;margin-top:12px"><li>Seller, Buyer অথবা Admin account তৈরি করুন।</li><li>Buyer পণ্য দেখে Add to cart, Call বা Message করতে পারবেন।</li><li>Cart-এ quantity, price, delivery ও total দেখা যাবে।</li><li>Seller login করে নতুন ফসল পোস্ট করতে পারবেন।</li></ol>');}
function openSafety(){openModal('<h2>🛡️ নিরাপদ লেনদেন</h2><p style="margin-top:12px">ফসল না দেখে অগ্রিম পুরো টাকা পাঠাবেন না। দাম, পরিমাণ, পরিবহন খরচ ও ডেলিভারি শর্ত আগে নিশ্চিত করুন।');}

document.addEventListener('DOMContentLoaded',()=>{updateCartCount();updateAuthUI();document.querySelectorAll('.order-qty').forEach(updateCardEstimate);const input=document.getElementById('searchInput');if(input)input.addEventListener('keydown',e=>{if(e.key==='Enter')searchCrop();});});
