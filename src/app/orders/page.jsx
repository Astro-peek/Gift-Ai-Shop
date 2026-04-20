"use client";
import{useState}from"react";
const GOLD="#C9A84C",DARK="#0A0804",SURFACE="#13110C",CARD="#1A1710",BORDER="#2E2A1E",MUTED="#6B6248";
const Logo=()=><svg width="120" height="28" viewBox="0 0 148 40" fill="none"><rect x="1" y="9" width="22" height="22" rx="5" fill="#C9A84C" fillOpacity="0.12" stroke="#C9A84C" strokeWidth="1.1"/><path d="M12 9 L12 5 Q12 3 10 3 Q8 3 8 5 Q8 7 10 9 Z" fill="#C9A84C"/><path d="M12 9 L12 5 Q12 3 14 3 Q16 3 16 5 Q16 7 14 9 Z" fill="#C9A84C"/><rect x="6" y="9" width="12" height="3" rx="1.5" fill="#C9A84C"/><rect x="11" y="12" width="2" height="19" rx="1" fill="#C9A84C" fillOpacity="0.55"/><text x="30" y="28" fontFamily="Georgia,serif" fontSize="21" fontWeight="700" fill="#C9A84C" letterSpacing="1.5">GiftAI</text></svg>;

const ORDERS=[
  {id:"ORD-2847",product:"Belgian Luxury Chocolate Box",image:"https://images.unsplash.com/photo-1549007953-2f2dc0b24019?w=200&q=80",status:"delivered",date:"Apr 10, 2025",amount:4998,addr:"42, MG Road, Indore, MP 452001",steps:["placed","confirmed","shipped","delivered"],cur:3},
  {id:"ORD-2891",product:"Sony WH-1000XM5 Headphones",image:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80",status:"shipped",date:"Apr 15, 2025",amount:6999,addr:"12, Vijay Nagar, Indore, MP 452010",steps:["placed","confirmed","shipped","delivered"],cur:2},
  {id:"ORD-2934",product:"Hermès-Style Silk Scarf",image:"https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=200&q=80",status:"confirmed",date:"Apr 17, 2025",amount:3499,addr:"8, Scheme 54, Indore, MP 452001",steps:["placed","confirmed","shipped","delivered"],cur:1},
];
const SC={delivered:"#52b788",shipped:GOLD,confirmed:"#378add",placed:MUTED};
const SE={delivered:"✦",shipped:"→",confirmed:"✓",placed:"○"};

export default function OrdersPage(){
  const[sel,setSel]=useState(ORDERS[0]);
  const[imgErr,setImgErr]=useState({});
  return(
    <div style={{fontFamily:"'Nunito',sans-serif",minHeight:"100vh",background:DARK,color:"#F0EAD6"}}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,700;1,400&family=Nunito:wght@300;600;700;800&display=swap" rel="stylesheet"/>
      <nav style={{background:SURFACE,borderBottom:`1px solid ${BORDER}`,padding:"0 3rem",display:"flex",alignItems:"center",justifyContent:"space-between",height:"68px"}}>
        <a href="/" style={{textDecoration:"none"}}><Logo/></a>
        <a href="/" style={{color:MUTED,textDecoration:"none",fontSize:"13px"}}>← Back to shop</a>
      </nav>
      <div style={{maxWidth:"1100px",margin:"0 auto",padding:"48px 2rem"}}>
        <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"48px",marginBottom:"6px",color:"#F0EAD6"}}>My Orders</h1>
        <p style={{color:MUTED,marginBottom:"40px",fontSize:"14px",fontWeight:300}}>Track and manage your gift orders</p>
        <div style={{display:"grid",gridTemplateColumns:"340px 1fr",gap:"24px"}}>
          <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
            {ORDERS.map(o=>(
              <div key={o.id} onClick={()=>setSel(o)} style={{background:sel.id===o.id?"#1e1a0e":CARD,border:`1px solid ${sel.id===o.id?GOLD+"55":BORDER}`,borderRadius:"14px",padding:"18px",cursor:"pointer",transition:"all 0.15s",overflow:"hidden",display:"flex",gap:"12px"}}>
                <div style={{width:"52px",height:"52px",borderRadius:"8px",overflow:"hidden",flexShrink:0,background:SURFACE}}>
                  {!imgErr[o.id]?<img src={o.image} onError={()=>setImgErr(p=>({...p,[o.id]:true}))} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>:<div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"20px"}}>🎁</div>}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"5px"}}>
                    <div style={{fontWeight:700,fontSize:"13px",color:sel.id===o.id?GOLD:"#F0EAD6"}}>{o.id}</div>
                    <div style={{fontSize:"10px",fontWeight:700,padding:"2px 10px",borderRadius:"20px",background:SC[o.status]+"22",color:SC[o.status],letterSpacing:"0.5px"}}>{o.status.toUpperCase()}</div>
                  </div>
                  <div style={{fontSize:"12px",color:MUTED,marginBottom:"4px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{o.product}</div>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:"12px"}}>
                    <span style={{color:MUTED}}>{o.date}</span>
                    <span style={{color:GOLD,fontWeight:700}}>₹{o.amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:"16px",padding:"28px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"32px"}}>
              <div>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"26px",color:"#F0EAD6",marginBottom:"4px"}}>{sel.id}</div>
                <div style={{color:MUTED,fontSize:"13px",fontWeight:300}}>Placed {sel.date}</div>
              </div>
              <div style={{fontSize:"12px",fontWeight:700,padding:"6px 16px",borderRadius:"20px",background:SC[sel.status]+"22",color:SC[sel.status],letterSpacing:"0.5px"}}>{SE[sel.status]} {sel.status.toUpperCase()}</div>
            </div>

            <div style={{marginBottom:"32px"}}>
              <div style={{fontSize:"10px",color:MUTED,fontWeight:700,letterSpacing:"2px",marginBottom:"20px"}}>ORDER PROGRESS</div>
              <div style={{display:"flex",alignItems:"center"}}>
                {sel.steps.map((s,i)=>(
                  <div key={s} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",position:"relative"}}>
                    {i<sel.steps.length-1&&<div style={{position:"absolute",top:"16px",left:"50%",width:"100%",height:"2px",background:i<sel.cur?GOLD:BORDER,zIndex:0}}/>}
                    <div style={{width:"32px",height:"32px",borderRadius:"50%",background:i<=sel.cur?GOLD:BORDER,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"13px",fontWeight:800,color:i<=sel.cur?DARK:MUTED,zIndex:1,position:"relative"}}>{i<=sel.cur?"✓":i+1}</div>
                    <div style={{fontSize:"11px",marginTop:"8px",fontWeight:700,color:i<=sel.cur?GOLD:MUTED,textTransform:"capitalize",letterSpacing:"0.5px"}}>{s}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px",marginBottom:"20px"}}>
              <div style={{background:SURFACE,borderRadius:"12px",padding:"18px",display:"flex",gap:"12px",alignItems:"center"}}>
                <div style={{width:"52px",height:"52px",borderRadius:"8px",overflow:"hidden",flexShrink:0}}>
                  {!imgErr["det"]?<img src={sel.image} onError={()=>setImgErr(p=>({...p,det:true}))} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>:<div style={{background:CARD,width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center"}}>🎁</div>}
                </div>
                <div>
                  <div style={{fontSize:"11px",color:MUTED,marginBottom:"4px"}}>Item</div>
                  <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"15px",color:"#F0EAD6",lineHeight:1.3}}>{sel.product}</div>
                  <div style={{color:GOLD,fontWeight:700,fontSize:"15px",marginTop:"2px"}}>₹{sel.amount.toLocaleString()}</div>
                </div>
              </div>
              <div style={{background:SURFACE,borderRadius:"12px",padding:"18px"}}>
                <div style={{fontSize:"11px",color:MUTED,fontWeight:700,letterSpacing:"1px",marginBottom:"8px"}}>DELIVERY ADDRESS</div>
                <div style={{fontSize:"13px",color:"#a89878",lineHeight:1.6}}>{sel.addr}</div>
              </div>
            </div>

            {sel.status==="delivered"&&(
              <div style={{background:"#52b78810",border:"1px solid #52b78830",borderRadius:"12px",padding:"16px",display:"flex",alignItems:"center",gap:"12px"}}>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"24px",color:"#52b788"}}>✦</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,color:"#52b788",fontSize:"14px"}}>Delivered successfully!</div>
                  <div style={{fontSize:"12px",color:MUTED,fontWeight:300}}>Hope they loved their gift. Share the joy?</div>
                </div>
                <button style={{background:"#52b788",border:"none",borderRadius:"8px",padding:"8px 16px",fontFamily:"'Nunito',sans-serif",fontWeight:800,fontSize:"12px",cursor:"pointer",color:DARK,letterSpacing:"0.5px"}}>Rate ★</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
