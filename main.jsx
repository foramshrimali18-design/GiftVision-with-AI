import React, {useEffect, useMemo, useState} from "react";
import { createRoot } from "react-dom/client";
import {
  Gift, Sparkles, ShoppingBag, Heart, Search, Plus, Minus, Trash2,
  Wand2, Play, ArrowRight, Check, X, Menu, User, ChevronRight,
  Package, Truck, CreditCard, Bot, RotateCcw
} from "lucide-react";
import "./styles.css";

const products = [
  {id:1,name:"Chocolate Box",price:499,cat:"Chocolates",emoji:"🍫",rating:4.8},
  {id:2,name:"Premium Candle",price:399,cat:"Self Care",emoji:"🕯️",rating:4.7},
  {id:3,name:"Personalized Mug",price:299,cat:"Personalized",emoji:"☕",rating:4.9},
  {id:4,name:"Elegant Perfume",price:799,cat:"Beauty",emoji:"🌸",rating:4.8},
  {id:5,name:"Dry Fruit Box",price:699,cat:"Food",emoji:"🥜",rating:4.6},
  {id:6,name:"Greeting Card",price:99,cat:"Personalized",emoji:"💌",rating:4.9},
  {id:7,name:"Teddy Bear",price:499,cat:"Accessories",emoji:"🧸",rating:4.8},
  {id:8,name:"Photo Frame",price:399,cat:"Personalized",emoji:"🖼️",rating:4.7},
  {id:9,name:"Luxury Chocolate Box",price:999,cat:"Chocolates",emoji:"🍫",rating:4.9},
  {id:10,name:"Scented Bath Set",price:599,cat:"Self Care",emoji:"🛁",rating:4.6},
  {id:11,name:"Rose Bouquet",price:449,cat:"Accessories",emoji:"🌹",rating:4.8},
  {id:12,name:"Premium Watch",price:1499,cat:"Accessories",emoji:"⌚",rating:4.7},
  {id:13,name:"Mini Succulent",price:249,cat:"Accessories",emoji:"🌱",rating:4.5},
  {id:14,name:"Cookies Jar",price:349,cat:"Food",emoji:"🍪",rating:4.6},
  {id:15,name:"Coffee Kit",price:549,cat:"Food",emoji:"☕",rating:4.8},
  {id:16,name:"Lip Care Set",price:299,cat:"Beauty",emoji:"💄",rating:4.6},
  {id:17,name:"Leather Wallet",price:899,cat:"Accessories",emoji:"👛",rating:4.7},
  {id:18,name:"Fairy Lights",price:199,cat:"Accessories",emoji:"✨",rating:4.8},
  {id:19,name:"Vanilla Diffuser",price:449,cat:"Self Care",emoji:"🌿",rating:4.7},
  {id:20,name:"Name Keychain",price:199,cat:"Personalized",emoji:"🔑",rating:4.8}
];

const hampers = [
  {id:"h1",name:"Birthday Bliss",price:1299,emoji:"🎂",items:"Chocolate, Mug, Candle & Card",tag:"Birthday"},
  {id:"h2",name:"Anniversary Love",price:1899,emoji:"💖",items:"Perfume, Chocolate, Rose & Card",tag:"Anniversary"},
  {id:"h3",name:"Chocolate Lover",price:1499,emoji:"🍫",items:"Luxury Chocolates & Cookies",tag:"Chocolate"},
  {id:"h4",name:"Self-Care Hamper",price:1599,emoji:"🧖",items:"Candle, Bath Set, Lip Care",tag:"Self Care"},
  {id:"h5",name:"Corporate Premium",price:2499,emoji:"💼",items:"Coffee Kit, Wallet & Chocolates",tag:"Corporate"},
  {id:"h6",name:"Festival Celebration",price:1199,emoji:"🪔",items:"Dry Fruits, Sweets & Card",tag:"Festival"}
];

const categories = ["All","Chocolates","Self Care","Personalized","Beauty","Food","Accessories"];
const occasions = ["Birthday","Anniversary","Wedding","Festival","Corporate","Other"];
const boxStyles = ["Classic Box","Luxury Box","Basket","Premium Tray"];
const themes = ["Elegant","Romantic","Birthday","Luxury","Cute"];

function money(n){ return `₹${n.toLocaleString("en-IN")}`; }

function App(){
  const [page,setPage] = useState("home");
  const [cart,setCart] = useState(()=>JSON.parse(localStorage.getItem("gv-cart")||"[]"));
  const [custom,setCustom] = useState(()=>JSON.parse(localStorage.getItem("gv-custom")||'{"occasion":"Birthday","box":"Classic Box","theme":"Elegant","items":[],"recipient":"","sender":"","message":"","card":""}'));
  const [toast,setToast] = useState("");
  const [cat,setCat] = useState("All");
  const [search,setSearch] = useState("");
  const [aiText,setAiText] = useState("");
  const [aiResult,setAiResult] = useState(null);
  const [preview,setPreview] = useState(false);
  const [video,setVideo] = useState(false);
  const [checkout,setCheckout] = useState(false);
  const [order,setOrder] = useState(null);
  const [mobile,setMobile] = useState(false);

  useEffect(()=>localStorage.setItem("gv-cart",JSON.stringify(cart)),[cart]);
  useEffect(()=>localStorage.setItem("gv-custom",JSON.stringify(custom)),[custom]);
  useEffect(()=>{ if(toast){const t=setTimeout(()=>setToast(""),2500);return()=>clearTimeout(t)}},[toast]);

  const filtered = products.filter(p => (cat==="All"||p.cat===cat) && p.name.toLowerCase().includes(search.toLowerCase()));
  const customTotal = custom.items.reduce((s,p)=>s+p.price,0);
  const cartTotal = cart.reduce((s,i)=>s+i.price*i.qty,0);
  const delivery = cartTotal>0 ? 79 : 0;
  const grand = cartTotal+delivery;

  function notify(msg){setToast(msg)}
  function addCart(item){
    setCart(c=>{
      const found=c.find(x=>x.id===item.id);
      return found ? c.map(x=>x.id===item.id?{...x,qty:x.qty+1}:x) : [...c,{...item,qty:1}];
    });
    notify("Added to cart ✓");
  }
  function removeCart(id){setCart(c=>c.filter(x=>x.id!==id))}
  function qty(id,d){setCart(c=>c.map(x=>x.id===id?{...x,qty:Math.max(1,x.qty+d)}:x))}
  function addHamperProduct(p){
    if(custom.items.some(x=>x.id===p.id)){notify("Already in your hamper");return}
    setCustom(x=>({...x,items:[...x.items,p]})); notify(`${p.name} added to hamper`);
  }
  function removeHamper(id){setCustom(x=>({...x,items:x.items.filter(p=>p.id!==id)}))}
  function addCustomToCart(){
    if(!custom.items.length){notify("Add at least one product");return}
    addCart({id:"custom-"+Date.now(),name:`Custom ${custom.occasion} Hamper`,price:customTotal,emoji:"🎁",custom:true});
  }
  function generateAI(){
    const lower=aiText.toLowerCase();
    let ids = lower.includes("corporate") ? [15,17,9,6] :
      lower.includes("anniversary") || lower.includes("wife") || lower.includes("romantic") ? [4,9,11,6] :
      lower.includes("self") ? [2,10,16,6] : [1,2,3,6];
    const items=ids.map(id=>products.find(p=>p.id===id));
    const total=items.reduce((s,p)=>s+p.price,0);
    setAiResult({items,total});
  }
  function acceptAI(){
    if(!aiResult)return;
    setCustom(x=>({...x,items:aiResult.items}));
    notify("AI design accepted");
    setPage("builder");
  }
  function placeOrder(e){
    e.preventDefault();
    const id="GV"+Math.floor(100000+Math.random()*900000);
    setOrder({id,total:grand,date:new Date().toLocaleDateString("en-IN")});
    setCart([]);
    setCheckout(false);
    setPage("order");
  }

  return <div className="app">
    <header className="nav">
      <div className="brand" onClick={()=>setPage("home")}>
        <span className="brandIcon"><Gift size={22}/></span>
        <div><b>GiftVision</b><small>with AI</small></div>
      </div>
      <button className="mobileBtn" onClick={()=>setMobile(!mobile)}><Menu/></button>
      <nav className={mobile?"open":""}>
        {[
          ["home","Home"],["hampers","Hampers"],["products","Products"],
          ["builder","Build Hamper"],["aipreview","AI Preview"]
        ].map(([p,l])=><button key={p} className={page===p?"active":""} onClick={()=>{setPage(p);setMobile(false)}}>{l}</button>)}
        <button className="cartBtn" onClick={()=>setPage("cart")}><ShoppingBag size={18}/> Cart <span>{cart.reduce((s,x)=>s+x.qty,0)}</span></button>
        <button className="loginBtn"><User size={17}/> Login</button>
      </nav>
    </header>

    {page==="home" && <Home go={setPage} addCart={addCart}/>}
    {page==="products" && <Products filtered={filtered} cat={cat} setCat={setCat} search={search} setSearch={setSearch} addCart={addCart} addHamperProduct={addHamperProduct}/>}
    {page==="hampers" && <Hampers addCart={addCart} go={setPage}/>}
    {page==="builder" && <Builder custom={custom} setCustom={setCustom} addHamperProduct={addHamperProduct} removeHamper={removeHamper} total={customTotal} addCustomToCart={addCustomToCart} generatePreview={()=>setPreview(true)} generateVideo={()=>setVideo(true)} aiText={aiText} setAiText={setAiText} aiResult={aiResult} generateAI={generateAI} acceptAI={acceptAI} notify={notify}/>}
    {page==="aipreview" && <AIPreview custom={custom} generatePreview={()=>setPreview(true)} generateVideo={()=>setVideo(true)}/>}
    {page==="cart" && <Cart cart={cart} qty={qty} removeCart={removeCart} total={cartTotal} delivery={delivery} grand={grand} goCheckout={()=>setCheckout(true)} go={setPage}/>}
    {page==="order" && <Order order={order} go={setPage}/>}
    {checkout && <Checkout grand={grand} onClose={()=>setCheckout(false)} placeOrder={placeOrder}/>}
    {preview && <Preview custom={custom} onClose={()=>setPreview(false)} regenerate={()=>notify("Preview regenerated ✨")}/>}
    {video && <VideoPreview custom={custom} onClose={()=>setVideo(false)}/>}
    {toast && <div className="toast"><Check size={18}/>{toast}</div>}
    <footer><div><b>GiftVision with AI</b><p>Imagine It. Design It. Gift It.</p></div><div>© 2026 GiftVision · MVP Prototype</div></footer>
  </div>
}

function Home({go,addCart}){
 return <main>
  <section className="hero">
   <div className="heroText">
    <div className="pill"><Sparkles size={15}/> AI-powered gifting</div>
    <h1>Create a Gift That<br/><span>Feels Truly Yours.</span></h1>
    <p>Choose a ready-made hamper or design your own personalized gift with AI — then see how it may look before you order.</p>
    <div className="heroBtns"><button className="primary" onClick={()=>go("hampers")}>Explore Hampers <ArrowRight size={18}/></button><button className="secondary" onClick={()=>go("builder")}>Create Your Own <Wand2 size={18}/></button></div>
    <div className="trust"><span>✦ 20+ products</span><span>✦ AI visual preview</span><span>✦ Easy ordering</span></div>
   </div>
   <div className="heroVisual">
    <div className="glow"></div><div className="giftBox"><div className="lid">🎁</div><div className="boxInside"><span>🍫</span><span>🌹</span><span>🕯️</span><span>💌</span></div><div className="ribbon"></div></div>
    <div className="floating f1">✨ Personalized</div><div className="floating f2">🤖 AI Preview</div>
   </div>
  </section>
  <section className="section"><div className="sectionHead"><div><span className="eyebrow">SHOP BY OCCASION</span><h2>Find a reason to celebrate</h2></div><button className="textBtn" onClick={()=>go("hampers")}>View all <ChevronRight size={16}/></button></div>
   <div className="categories">{["🎂 Birthday","💖 Anniversary","💍 Wedding","💼 Corporate","🪔 Festival","❤️ Valentine's"].map(x=><button key={x} onClick={()=>go("hampers")}>{x}</button>)}</div>
  </section>
  <section className="section soft"><div className="sectionHead"><div><span className="eyebrow">CURATED FOR YOU</span><h2>Featured hampers</h2></div><button className="textBtn" onClick={()=>go("hampers")}>See all <ChevronRight size={16}/></button></div>
   <div className="cards">{hampers.slice(0,3).map(h=><HamperCard h={h} addCart={addCart} go={go} key={h.id}/>)}</div>
  </section>
  <section className="aiBanner"><div><span className="eyebrow">YOUR GIFT, VISUALIZED</span><h2>Design it. Preview it. Gift it.</h2><p>Build a hamper from your favorite products and get an instant visual preview.</p><button className="primary" onClick={()=>go("builder")}>Start Designing <Wand2 size={18}/></button></div><div className="miniPreview"><span>🍫</span><span>🕯️</span><span>☕</span><span>💌</span><b>AI</b></div></section>
 </main>
}

function Products({filtered,cat,setCat,search,setSearch,addCart,addHamperProduct}){
 return <main className="page"><div className="pageTitle"><span className="eyebrow">DISCOVER</span><h1>Pick something special</h1><p>Choose products to add directly to your cart or build your own hamper.</p></div>
 <div className="toolbar"><div className="search"><Search size={18}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search gifts..."/></div><div className="chips">{categories.map(c=><button className={cat===c?"selected":""} onClick={()=>setCat(c)} key={c}>{c}</button>)}</div></div>
 <div className="productGrid">{filtered.map(p=><ProductCard p={p} key={p.id} addCart={addCart} addHamperProduct={addHamperProduct}/>)}</div></main>
}

function ProductCard({p,addCart,addHamperProduct}){
 return <article className="productCard"><div className="productImg">{p.emoji}<button className="heart"><Heart size={17}/></button></div><div className="productInfo"><div className="rating">★ {p.rating}</div><h3>{p.name}</h3><small>{p.cat}</small><div className="priceRow"><b>{money(p.price)}</b></div><div className="cardBtns"><button onClick={()=>addHamperProduct(p)}><Plus size={15}/> Hamper</button><button className="primary small" onClick={()=>addCart({...p})}>Add to Cart</button></div></div></article>
}

function HamperCard({h,addCart,go}){return <article className="hamperCard"><div className="hamperImg">{h.emoji}<span>{h.tag}</span></div><div className="hamperInfo"><div className="rating">★★★★★</div><h3>{h.name}</h3><p>{h.items}</p><div className="priceRow"><b>{money(h.price)}</b><button className="primary small" onClick={()=>addCart({id:h.id,name:h.name,price:h.price,emoji:h.emoji})}>Add to Cart</button></div><button className="outline full" onClick={()=>go("builder")}>Customize this hamper</button></div></article>}

function Hampers({addCart,go}){return <main className="page"><div className="pageTitle"><span className="eyebrow">READY-MADE GIFTS</span><h1>Hampers made to delight</h1><p>Beautifully curated gifts for every occasion.</p></div><div className="cards">{hampers.map(h=><HamperCard h={h} addCart={addCart} go={go} key={h.id}/>)}</div></main>}

function Builder({custom,setCustom,addHamperProduct,removeHamper,total,addCustomToCart,generatePreview,generateVideo,aiText,setAiText,aiResult,generateAI,acceptAI,notify}){
 return <main className="page builderPage"><div className="pageTitle"><span className="eyebrow">THE MAIN EXPERIENCE</span><h1>Build Your Own Hamper 🎁</h1><p>Pick your products, personalize your gift and preview the final look.</p></div>
 <div className="builderLayout">
  <section>
   <div className="stepCard"><div className="stepNo">1</div><div><h3>Choose an occasion</h3><div className="optionGrid">{occasions.map(o=><button className={custom.occasion===o?"option selected": "option"} onClick={()=>setCustom({...custom,occasion:o})} key={o}>{o}</button>)}</div></div></div>
   <div className="stepCard"><div className="stepNo">2</div><div><h3>Choose your box style</h3><div className="optionGrid">{boxStyles.map(o=><button className={custom.box===o?"option selected": "option"} onClick={()=>setCustom({...custom,box:o})} key={o}>{o}</button>)}</div></div></div>
   <div className="stepCard"><div className="stepNo">3</div><div><h3>Add products</h3><div className="miniProducts">{products.slice(0,10).map(p=><button onClick={()=>addHamperProduct(p)} key={p.id}><span>{p.emoji}</span><b>{p.name}</b><small>{money(p.price)}</small></button>)}</div></div></div>
   <div className="stepCard"><div className="stepNo">4</div><div><h3>Personalize your gift</h3><div className="formGrid"><label>Recipient Name<input value={custom.recipient} onChange={e=>setCustom({...custom,recipient:e.target.value})} placeholder="e.g. Riya"/></label><label>Sender Name<input value={custom.sender} onChange={e=>setCustom({...custom,sender:e.target.value})} placeholder="e.g. Foram"/></label><label className="wide">Personal Message<textarea value={custom.message} onChange={e=>setCustom({...custom,message:e.target.value})} placeholder="Write something memorable..."/></label><label className="wide">Greeting Card Message<textarea value={custom.card} onChange={e=>setCustom({...custom,card:e.target.value})} placeholder="Happy Birthday! ❤️"/></label></div><div className="themeRow"><b>Theme</b>{themes.map(t=><button className={custom.theme===t?"selected":""} onClick={()=>setCustom({...custom,theme:t})} key={t}>{t}</button>)}</div></div></div>
   <div className="aiBox"><div className="aiIcon"><Bot/></div><div className="aiContent"><span className="eyebrow">GIFT ASSISTANT</span><h3>Let AI design a hamper for you</h3><p>Describe the person, occasion and budget. We'll suggest a mock hamper.</p><div className="aiInput"><input value={aiText} onChange={e=>setAiText(e.target.value)} placeholder="e.g. Birthday hamper for my sister under ₹1500"/><button className="primary" onClick={generateAI}><Sparkles size={16}/> Generate</button></div>{aiResult&&<div className="aiResult"><b>AI Suggestion</b><div>{aiResult.items.map(p=><span key={p.id}>{p.emoji} {p.name}</span>)}</div><strong>{money(aiResult.total)}</strong><div><button className="primary small" onClick={acceptAI}>Accept Suggestion</button><button className="outline small" onClick={generateAI}><RotateCcw size={14}/> Regenerate</button></div></div>}</div></div>
  </section>
  <aside className="hamperSummary"><div className="summaryTop"><div><span className="eyebrow">YOUR DESIGN</span><h2>My {custom.occasion} Hamper</h2></div><span className="count">{custom.items.length} items</span></div><div className="hamperCanvas"><div className="canvasGlow"></div><div className="previewBox"><div className="canvasLid">{custom.box==="Basket"?"🧺":"🎁"}</div><div className="canvasItems">{custom.items.slice(0,6).map(p=><span key={p.id}>{p.emoji}</span>)}</div><div className="canvasRibbon"></div></div>{custom.recipient&&<div className="nameTag">For {custom.recipient}</div>}</div><div className="selectedList">{custom.items.length?custom.items.map(p=><div className="selectedItem" key={p.id}><span>{p.emoji}</span><div><b>{p.name}</b><small>{money(p.price)}</small></div><button onClick={()=>removeHamper(p.id)}><Trash2 size={15}/></button></div>):<div className="empty">Add products to start designing ✨</div>}</div><div className="summaryTotal"><span>Hamper total</span><b>{money(total)}</b></div><div className="previewBtns"><button className="secondary" onClick={generatePreview}><Sparkles size={16}/> AI Image Preview</button><button className="primary" onClick={generateVideo}><Play size={16}/> Gift Video</button></div><button className="primary full" onClick={addCustomToCart}><ShoppingBag size={17}/> Add Custom Hamper to Cart</button></aside>
 </div></main>
}

function AIPreview({custom,generatePreview,generateVideo}){return <main className="page previewPage"><div className="pageTitle"><span className="eyebrow">AI STUDIO</span><h1>Your Gift, Visualized</h1><p>Generate a visual concept before you place your order.</p></div><div className="studio"><div className="studioVisual"><div className="studioGlow"></div><div className="bigBox"><div>🎁</div><section>{custom.items.length?custom.items.map(p=><span key={p.id}>{p.emoji}</span>):<span>✨</span>}</section></div>{custom.recipient&&<div className="studioTag">For {custom.recipient}</div>}</div><div className="studioInfo"><span className="eyebrow">CURRENT DESIGN</span><h2>{custom.occasion} · {custom.theme}</h2><p>{custom.message||"Your personalized message will appear here."}</p><div className="studioStats"><div><b>{custom.items.length}</b><small>Products</small></div><div><b>{custom.box}</b><small>Packaging</small></div></div><button className="primary full" onClick={generatePreview}><Sparkles/> Generate AI Preview</button><button className="outline full" onClick={generateVideo}><Play/> Generate Gift Video</button></div></div></main>}

function Cart({cart,qty,removeCart,total,delivery,grand,goCheckout,go}){return <main className="page"><div className="pageTitle"><span className="eyebrow">YOUR BAG</span><h1>Shopping Cart</h1><p>Review your gifts before checkout.</p></div>{!cart.length?<div className="emptyPage"><ShoppingBag size={48}/><h2>Your cart is empty</h2><p>Add a product or create a custom hamper.</p><button className="primary" onClick={()=>go("builder")}>Build a Hamper</button></div>:<div className="cartLayout"><div>{cart.map(i=><div className="cartItem" key={i.id}><div className="cartEmoji">{i.emoji}</div><div className="cartName"><b>{i.name}</b><small>{i.custom?"Custom hamper":"Gift product"}</small></div><div className="qty"><button onClick={()=>qty(i.id,-1)}><Minus size={14}/></button><b>{i.qty}</b><button onClick={()=>qty(i.id,1)}><Plus size={14}/></button></div><strong>{money(i.price*i.qty)}</strong><button className="trash" onClick={()=>removeCart(i.id)}><Trash2/></button></div>)}</div><aside className="orderSummary"><h2>Order summary</h2><div><span>Subtotal</span><b>{money(total)}</b></div><div><span>Delivery</span><b>{money(delivery)}</b></div><div className="totalLine"><span>Total</span><b>{money(grand)}</b></div><button className="primary full" onClick={goCheckout}>Checkout <ArrowRight/></button></aside></div>}</main>}

function Checkout({grand,onClose,placeOrder}){return <div className="modalBackdrop"><div className="checkoutModal"><button className="close" onClick={onClose}><X/></button><span className="eyebrow">SECURE CHECKOUT</span><h2>Delivery details</h2><form onSubmit={placeOrder}><div className="formGrid"><label>Full Name<input required placeholder="Your name"/></label><label>Email<input required type="email" placeholder="you@example.com"/></label><label>Mobile Number<input required placeholder="+91"/></label><label>Pincode<input required placeholder="380001"/></label><label className="wide">Address<textarea required placeholder="House, street, area"/></label><label>City<input required placeholder="Ahmedabad"/></label><label>State<input required placeholder="Gujarat"/></label></div><div className="payment"><b>Payment</b><label><input type="radio" name="pay" defaultChecked/> UPI</label><label><input type="radio" name="pay"/> Card</label><label><input type="radio" name="pay"/> Cash on Delivery</label></div><button className="primary full" type="submit">Place Order · {money(grand)}</button></form></div></div>}

function Order({order,go}){return <main className="page orderPage"><div className="successIcon"><Check size={42}/></div><span className="eyebrow">ORDER CONFIRMED</span><h1>Your Gift is on the Way! 🎁</h1><p>Thanks for choosing GiftVision. Your demo order has been placed.</p><div className="orderCard"><div><small>Order ID</small><b>{order?.id||"GV000000"}</b></div><div><small>Amount</small><b>{money(order?.total||0)}</b></div><div><small>Order Date</small><b>{order?.date}</b></div></div><div className="timeline">{["Order Placed","Preparing","Packed","Shipped","Delivered"].map((x,i)=><div className={i===0?"done":""} key={x}><span>{i===0?<Check size={14}/>:i+1}</span><b>{x}</b>{i<4&&<i/>}</div>)}</div><button className="primary" onClick={()=>go("home")}>Continue Shopping <ArrowRight/></button></main>}

function Preview({custom,onClose,regenerate}){return <div className="modalBackdrop"><div className="previewModal"><button className="close" onClick={onClose}><X/></button><div className="eyebrow">AI VISUAL PREVIEW</div><h2>This is how your hamper may look ✨</h2><div className="aiPreviewStage"><div className="aiBoxGift"><div>🎁</div><section>{custom.items.slice(0,6).map(p=><span key={p.id}>{p.emoji}</span>)}</section></div>{custom.recipient&&<div className="previewName">For {custom.recipient}</div>}<div className="scan">AI generating concept...</div></div><p className="muted">Mock AI preview for the MVP. A real image-generation API can replace this service later.</p><div className="modalActions"><button className="outline" onClick={regenerate}><RotateCcw/> Regenerate</button><button className="primary" onClick={onClose}>Looks good <Check/></button></div></div></div>}

function VideoPreview({custom,onClose}){return <div className="modalBackdrop"><div className="videoModal"><button className="close" onClick={onClose}><X/></button><div className="eyebrow">AI GIFT VIDEO</div><h2>Your gift is ready to surprise someone special ❤️</h2><div className="videoStage"><div className="videoGift"><div className="videoLid">🎀</div><div className="videoItems">{custom.items.slice(0,5).map(p=><span key={p.id}>{p.emoji}</span>)}</div><div className="videoCard">{custom.card||"A special gift, made just for you 💖"}</div></div><div className="playPulse"><Play fill="currentColor"/></div></div><p className="muted">Animated mock video preview. Connect a real AI video service in <code>aiVideoService.js</code> later.</p><button className="primary full" onClick={onClose}>Done</button></div></div>}

createRoot(document.getElementById("root")).render(<App/>);