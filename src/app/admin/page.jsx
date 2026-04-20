"use client";
import{useState}from"react";
const GOLD="#C9A84C",DARK="#0A0804",SURFACE="#13110C",CARD="#1A1710",BORDER="#2E2A1E",MUTED="#6B6248";
const Logo=()=><svg width="120" height="28" viewBox="0 0 148 40" fill="none"><rect x="1" y="9" width="22" height="22" rx="5" fill="#C9A84C" fillOpacity="0.12" stroke="#C9A84C" strokeWidth="1.1"/><path d="M12 9 L12 5 Q12 3 10 3 Q8 3 8 5 Q8 7 10 9 Z" fill="#C9A84C"/><path d="M12 9 L12 5 Q12 3 14 3 Q16 3 16 5 Q16 7 14 9 Z" fill="#C9A84C"/><rect x="6" y="9" width="12" height="3" rx="1.5" fill="#C9A84C"/><rect x="11" y="12" width="2" height="19" rx="1" fill="#C9A84C" fillOpacity="0.55"/><text x="30" y="28" fontFamily="Georgia,serif" fontSize="21" fontWeight="700" fill="#C9A84C" letterSpacing="1.5">GiftAI</text></svg>;

const SALES=[{m:"Jan",s:45200,o:38},{m:"Feb",s:61800,o:52},{m:"Mar",s:53400,o:44},{m:"Apr",s:78900,o:67}];
const INIT_PRODUCTS=[
  {id:1,name:"Belgian Luxury Chocolate Box",image:"https://images.unsplash.com/photo-1549007953-2f2dc0b24019?w=80&q=80",price:2499,stock:48,category:"Gourmet Food",orders:623},
  {id:2,name:"Sony WH-1000XM5 Headphones",image:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&q=80",price:6999,stock:12,category:"Premium Tech",orders:891},
  {id:3,name:"Japanese Cast Iron Tea Set",image:"https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=80&q=80",price:4299,stock:25,category:"Home & Lifestyle",orders:178},
  {id:4,name:"Hermès-Style Silk Scarf",image:"https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=80&q=80",price:3499,stock:4,category:"Luxury Fashion",orders:312},
  {id:5,name:"Rare Orchid in Glazed Pot",image:"https://images.unsplash.com/photo-1487530811015-780f3d99b6c0?w=80&q=80",price:2199,stock:76,category:"Botanicals",orders:134},
];
const ORDERS=[
  {id:"ORD-2934",cust:"Aarav S.",product:"Hermès-Style Silk Scarf",amount:3499,status:"confirmed",time:"2 min ago"},
  {id:"ORD-2933",cust:"Priya M.",product:"Sony WH-1000XM5",amount:6999,status:"shipped",time:"18 min ago"},
  {id:"ORD-2932",cust:"Rohan K.",product:"Chocolate Box × 2",amount:4998,status:"delivered",time:"1 hr ago"},
  {id:"ORD-2931",cust:"Sneha L.",product:"Rare Orchid",amount:2199,status:"placed",time:"2 hr ago"},
];
const SC={delivered:"#52b788",shipped:GOLD,confirmed:"#378add",placed:MUTED};

export default function AdminPage(){
  const[prods,setProds]=useState(INIT_PRODUCTS);
  const[tab,setTab]=useState("overview");
  const[showAdd,setShowAdd]=useState(false);
  const[newP,setNewP]=useState({name:"",price:"",stock:"",category:""});
  const[imgErr,setImgErr]=useState({});
  const maxS=Math.max(...SALES.map(d=>d.s));

  return(
    <div style={{fontFamily:"'Nunito',sans-serif",minHeight:"100vh",background:DARK,color:"#F0EAD6"}}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,700;1,400&family=Nunito:wght@300;600;700;800&display=swap" rel="stylesheet"/>
      <nav style={{background:SURFACE,borderBottom:`1px solid ${BORDER}`,padding:"0 3rem",display:"flex",alignItems:"center",justifyContent:"space-between",height:"68px"}}>
        <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
          <Logo/>
          <div style={{background:`${GOLD}15`,border:`1px solid ${GOLD}30`,color:GOLD,fontSize:"10px",fontWeight:800,padding:"3px 12px",borderRadius:"40px",letterSpacing:"1.5px"}}>ADMIN</div>
        </div>
        <a href="/" style={{color:MUTED,textDecoration:"none",fontSize:"13px"}}>← View Store</a>
      </nav>

      <div style={{maxWidth:"1240px",margin:"0 auto",padding:"40px 2rem"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:"36px"}}>
          <div>
            <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"44px",color:"#F0EAD6",marginBottom:"4px"}}>Dashboard</h1>
            <p style={{color:MUTED,fontWeight:300,fontSize:"14px"}}>Welcome back, Admin</p>
          </div>
          <div style={{display:"flex",gap:"6px"}}>
            {["overview","products","orders"].map(t=>(
              <button key={t} onClick={()=>setTab(t)} style={{padding:"8px 18px",borderRadius:"8px",border:`1px solid ${tab===t?GOLD:BORDER}`,background:tab===t?`${GOLD}0F`:"transparent",color:tab===t?GOLD:MUTED,fontFamily:"'Nunito',sans-serif",fontWeight:700,fontSize:"12px",cursor:"pointer",textTransform:"capitalize",letterSpacing:"0.5px"}}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {tab==="overview"&&(
          <>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"16px",marginBottom:"24px"}}>
              {[["Total Revenue","₹2,39,300","+18% this month",GOLD],["Total Orders","201","67 this month","#52b788"],["Products",`${prods.length}`,"Active listings","#378add"],["Avg. Order","₹1,190","Per transaction","#d4537e"]].map(([l,v,s,c])=>(
                <div key={l} style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:"14px",padding:"22px"}}>
                  <div style={{fontSize:"10px",color:MUTED,fontWeight:700,letterSpacing:"1.5px",marginBottom:"10px",textTransform:"uppercase"}}>{l}</div>
                  <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"32px",fontWeight:700,color:c,marginBottom:"4px"}}>{v}</div>
                  <div style={{fontSize:"11px",color:MUTED}}>{s}</div>
                </div>
              ))}
            </div>

            <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:"16px",padding:"24px",marginBottom:"22px"}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"22px",color:"#F0EAD6",marginBottom:"24px"}}>Monthly Revenue</div>
              <div style={{display:"flex",alignItems:"flex-end",gap:"20px",height:"160px"}}>
                {SALES.map(d=>(
                  <div key={d.m} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:"8px"}}>
                    <div style={{fontSize:"12px",color:GOLD,fontWeight:700}}>₹{(d.s/1000).toFixed(0)}k</div>
                    <div style={{width:"100%",background:`${GOLD}`,borderRadius:"4px 4px 0 0",height:`${(d.s/maxS)*120}px`,minHeight:"4px",opacity:0.85}}/>
                    <div style={{fontSize:"12px",color:MUTED,fontWeight:600}}>{d.m}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:"16px",padding:"24px"}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"22px",color:"#F0EAD6",marginBottom:"20px"}}>Recent Orders</div>
              {ORDERS.map((o,i)=>(
                <div key={o.id} style={{display:"flex",alignItems:"center",gap:"16px",padding:"14px 0",borderBottom:i<ORDERS.length-1?`1px solid ${BORDER}`:"none"}}>
                  <div style={{fontWeight:700,fontSize:"13px",color:MUTED,minWidth:"80px"}}>{o.id}</div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,fontSize:"14px",color:"#F0EAD6"}}>{o.cust}</div>
                    <div style={{fontSize:"12px",color:MUTED}}>{o.product}</div>
                  </div>
                  <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"17px",fontWeight:700,color:GOLD}}>₹{o.amount.toLocaleString()}</div>
                  <div style={{fontSize:"10px",fontWeight:700,padding:"4px 12px",borderRadius:"20px",background:SC[o.status]+"22",color:SC[o.status],letterSpacing:"0.5px"}}>{o.status.toUpperCase()}</div>
                  <div style={{fontSize:"11px",color:MUTED,minWidth:"70px",textAlign:"right"}}>{o.time}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab==="products"&&(
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"20px"}}>
              <div style={{color:MUTED,fontSize:"14px",fontWeight:600}}>{prods.length} products</div>
              <button onClick={()=>setShowAdd(!showAdd)} style={{background:GOLD,border:"none",borderRadius:"8px",padding:"10px 22px",fontFamily:"'Nunito',sans-serif",fontWeight:800,fontSize:"13px",cursor:"pointer",color:DARK,letterSpacing:"0.5px"}}>+ Add Product</button>
            </div>
            {showAdd&&(
              <div style={{background:CARD,border:`1px solid ${GOLD}33`,borderRadius:"14px",padding:"24px",marginBottom:"20px"}}>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"20px",color:"#F0EAD6",marginBottom:"16px"}}>New Product</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"12px",marginBottom:"16px"}}>
                  {[["name","Name"],["price","Price (₹)"],["stock","Stock"],["category","Category"]].map(([f,l])=>(
                    <div key={f}>
                      <label style={{display:"block",fontSize:"10px",color:MUTED,fontWeight:700,letterSpacing:"1px",marginBottom:"5px",textTransform:"uppercase"}}>{l}</label>
                      <input value={newP[f]} onChange={e=>setNewP(p=>({...p,[f]:e.target.value}))} style={{width:"100%",background:SURFACE,border:`1px solid ${BORDER}`,borderRadius:"8px",padding:"10px 12px",color:"#F0EAD6",fontSize:"13px",outline:"none",boxSizing:"border-box",fontFamily:"'Nunito',sans-serif"}}/>
                    </div>
                  ))}
                </div>
                <div style={{display:"flex",gap:"10px"}}>
                  <button onClick={()=>{if(newP.name&&newP.price){setProds(p=>[...p,{...newP,id:Date.now(),price:Number(newP.price),stock:Number(newP.stock),orders:0,image:""}]);setNewP({name:"",price:"",stock:"",category:""});setShowAdd(false);}}} style={{background:GOLD,border:"none",borderRadius:"8px",padding:"10px 22px",fontFamily:"'Nunito',sans-serif",fontWeight:800,fontSize:"13px",cursor:"pointer",color:DARK}}>Add</button>
                  <button onClick={()=>setShowAdd(false)} style={{background:"transparent",border:`1px solid ${BORDER}`,borderRadius:"8px",padding:"10px 22px",fontFamily:"'Nunito',sans-serif",fontWeight:600,fontSize:"13px",cursor:"pointer",color:MUTED}}>Cancel</button>
                </div>
              </div>
            )}
            <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:"16px",overflow:"hidden"}}>
              {prods.map((p,i)=>(
                <div key={p.id} style={{display:"flex",alignItems:"center",gap:"14px",padding:"14px 20px",borderBottom:i<prods.length-1?`1px solid #1a1710`:""}} >
                  <div style={{width:"44px",height:"44px",borderRadius:"8px",overflow:"hidden",background:SURFACE,flexShrink:0}}>
                    {p.image&&!imgErr[p.id]?<img src={p.image} onError={()=>setImgErr(pr=>({...pr,[p.id]:true}))} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>:<div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",color:GOLD,fontSize:"18px"}}>◈</div>}
                  </div>
                  <div style={{flex:1,fontFamily:"'Cormorant Garamond',serif",fontSize:"17px",color:"#F0EAD6"}}>{p.name}</div>
                  <div style={{color:GOLD,fontWeight:700,fontSize:"15px",minWidth:"80px",textAlign:"right"}}>₹{p.price.toLocaleString()}</div>
                  <div style={{fontSize:"13px",color:p.stock<10?"#e24b4a":"#52b788",fontWeight:700,minWidth:"50px",textAlign:"right"}}>{p.stock} left</div>
                  <div style={{fontSize:"12px",color:MUTED,minWidth:"120px"}}>{p.category}</div>
                  <div style={{fontSize:"12px",color:MUTED,minWidth:"50px"}}>{p.orders} orders</div>
                  <button onClick={()=>setProds(p2=>p2.filter(x=>x.id!==p.id))} style={{background:"none",border:"none",color:"#e24b4a",cursor:"pointer",fontSize:"12px",fontWeight:700,fontFamily:"'Nunito',sans-serif"}}>Remove</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab==="orders"&&(
          <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:"16px",overflow:"hidden"}}>
            <div style={{padding:"20px 24px",borderBottom:`1px solid ${BORDER}`,fontFamily:"'Cormorant Garamond',serif",fontSize:"22px",color:"#F0EAD6"}}>All Orders</div>
            {[...ORDERS,...ORDERS.map(o=>({...o,id:`ORD-${Math.floor(2700+Math.random()*200)}`,time:"Yesterday"}))].map((o,i,arr)=>(
              <div key={o.id+i} style={{display:"flex",alignItems:"center",gap:"16px",padding:"16px 24px",borderBottom:i<arr.length-1?`1px solid #151210`:""}}>
                <div style={{fontWeight:700,fontSize:"13px",color:MUTED,minWidth:"90px"}}>{o.id}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:"14px",color:"#F0EAD6"}}>{o.cust}</div>
                  <div style={{fontSize:"12px",color:MUTED}}>{o.product}</div>
                </div>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"17px",fontWeight:700,color:GOLD}}>₹{o.amount.toLocaleString()}</div>
                <select defaultValue={o.status} style={{background:SURFACE,border:`1px solid ${BORDER}`,borderRadius:"6px",padding:"5px 10px",color:SC[o.status],fontSize:"11px",fontWeight:700,cursor:"pointer",outline:"none",fontFamily:"'Nunito',sans-serif"}}>
                  {["placed","confirmed","shipped","delivered"].map(s=><option key={s} value={s}>{s.toUpperCase()}</option>)}
                </select>
                <div style={{fontSize:"11px",color:MUTED,minWidth:"80px",textAlign:"right"}}>{o.time}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
