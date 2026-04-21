"use client";
import { useState } from "react";

const GOLD="#C9A84C",DARK="#0A0804",SURFACE="#13110C",CARD="#1A1710",BORDER="#2E2A1E",MUTED="#6B6248";

const Logo=({size=28})=>(
  <svg width={size*3.6} height={size} viewBox="0 0 148 40" fill="none">
    <rect x="1" y="9" width="22" height="22" rx="5" fill="#C9A84C" fillOpacity="0.12" stroke="#C9A84C" strokeWidth="1.1"/>
    <path d="M12 9 L12 5 Q12 3 10 3 Q8 3 8 5 Q8 7 10 9 Z" fill="#C9A84C"/>
    <path d="M12 9 L12 5 Q12 3 14 3 Q16 3 16 5 Q16 7 14 9 Z" fill="#C9A84C"/>
    <rect x="6" y="9" width="12" height="3" rx="1.5" fill="#C9A84C"/>
    <rect x="11" y="12" width="2" height="19" rx="1" fill="#C9A84C" fillOpacity="0.55"/>
    <line x1="6" y1="20.5" x2="18" y2="20.5" stroke="#C9A84C" strokeWidth="0.7" strokeOpacity="0.35"/>
    <text x="30" y="28" fontFamily="Georgia,serif" fontSize="21" fontWeight="700" fill="#C9A84C" letterSpacing="1.5">GiftAI</text>
  </svg>
);

const PRODUCTS=[
  {id:1,name:"Hermès-Style Silk Scarf",price:3499,tags:["women","luxury","anniversary","fashion","romantic"],image:"https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=500&q=85",reason:"A timeless declaration of elegance — she'll drape herself in your affection every single day."},
  {id:2,name:"Japanese Cast Iron Tea Set",price:4299,tags:["parents","home","birthday","relaxation","warmth"],image:"https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&q=85",reason:"Morning rituals become sacred moments. This is the gift that transforms ordinary into extraordinary."},
  {id:3,name:"Sony WH-1000XM5 Headphones",price:6999,tags:["teen","music","birthday","tech","men"],image:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=85",reason:"Best-in-class sound. Zero noise. Pure luxury for ears — they'll think of you every single listen."},
  {id:4,name:"Leather Bound Journal Set",price:1899,tags:["student","writing","any","creative","affordable"],image:"https://images.unsplash.com/photo-1518893494013-481c1d8ed3fd?w=500&q=85",reason:"For the thinker and dreamer. An enduring gift that grows more personal with every entry."},
  {id:5,name:"Luxury Aroma Diffuser Kit",price:2999,tags:["women","relaxation","birthday","wellness","mom"],image:"https://images.unsplash.com/photo-1608181831688-8a6f95a87a6a?w=500&q=85",reason:"Transforms any space into a sanctuary. Deeply thoughtful, deeply sensory, deeply remembered."},
  {id:6,name:"Rare Orchid in Glazed Pot",price:2199,tags:["anyone","home","housewarming","nature","affordable"],image:"https://images.unsplash.com/photo-1487530811015-780f3d99b6c0?w=500&q=85",reason:"A living, breathing expression of care. Blooms for months — outlasting any bouquet."},
  {id:7,name:"Belgian Luxury Chocolate Box",price:2499,tags:["anyone","sweet","valentine","celebration","affordable","friend"],image:"https://images.unsplash.com/photo-1549007953-2f2dc0b24019?w=500&q=85",reason:"32 hand-crafted pralines. Universally adored. Impossible to receive without smiling."},
  {id:8,name:"Swiss Automatic Watch",price:12999,tags:["men","luxury","anniversary","fashion","heirloom"],image:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=85",reason:"An heirloom that speaks without words. Every glance at their wrist — they'll think of you."},
  {id:9,name:"Polaroid Photo Album Kit",price:1299,tags:["family","memories","anniversary","sentimental","affordable","friend"],image:"https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&q=85",reason:"Memories captured forever. Small price, priceless impact. The most personal gift on this list."},
  {id:10,name:"Ayurvedic Wellness Hamper",price:3799,tags:["anyone","health","birthday","wellness","parents"],image:"https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=500&q=85",reason:"10 curated wellness treasures — screams 'I truly care about you' without saying a word."},
  {id:11,name:"Marble & Alabaster Chess Set",price:5499,tags:["men","family","any","luxury","dad"],image:"https://images.unsplash.com/photo-1528819622765-d6bcf132f793?w=500&q=85",reason:"A showpiece they'll display with pride forever. Not just a gift — a conversation starter."},
  {id:12,name:"Professional Art Studio Set",price:4199,tags:["kids","creative","birthday","art","teen"],image:"https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&q=85",reason:"120 professional tools to unleash their inner artist. A gift that sparks a lifetime passion."},
];

const STEPS=[
  {q:"What's the occasion?",icon:"✦",opts:["Birthday","Anniversary","Diwali / Festival","Wedding","Housewarming","Valentine's Day","Just Because","Graduation"]},
  {q:"Who is this gift for?",icon:"◈",opts:["Mom","Dad","Partner / Spouse","Best Friend","Kid (5–12)","Teen","Colleague","Grandparent","Sibling"]},
  {q:"What's your budget?",icon:"◇",opts:["Under ₹1,500","₹1,500 – ₹3,000","₹3,000 – ₹6,000","₹6,000 – ₹13,000","₹13,000+"]},
];

const OCC_T={"Birthday":["birthday","celebration","fun","sweet","any"],"Anniversary":["anniversary","luxury","sentimental","romantic","heirloom"],"Diwali / Festival":["celebration","sweet","home","luxury","anyone","wellness"],"Wedding":["luxury","sentimental","home","family","heirloom"],"Housewarming":["home","nature","housewarming","wellness","anyone"],"Valentine's Day":["valentine","luxury","sweet","women","sentimental","romantic"],"Just Because":["any","anyone","fun","sweet","nature","affordable","friend"],"Graduation":["tech","music","writing","student","any","creative"]};
const REC_T={"Mom":["women","relaxation","home","parents","mom","warmth"],"Dad":["tech","wellness","any","parents","men","dad"],"Partner / Spouse":["luxury","sentimental","anniversary","valentine","women","romantic","heirloom"],"Best Friend":["fun","sweet","any","creative","sentimental","affordable","friend"],"Kid (5–12)":["kids","fun","creative","art"],"Teen":["tech","music","creative","fun","teen"],"Colleague":["any","wellness","writing","affordable"],"Grandparent":["home","sentimental","relaxation","health","warmth","parents"],"Sibling":["any","tech","fun","music","creative"]};
const BUD_MAX={"Under ₹1,500":1500,"₹1,500 – ₹3,000":3000,"₹3,000 – ₹6,000":6000,"₹6,000 – ₹13,000":13000,"₹13,000+":99999};
const BUD_MIN={"Under ₹1,500":0,"₹1,500 – ₹3,000":1500,"₹3,000 – ₹6,000":3000,"₹6,000 – ₹13,000":6000,"₹13,000+":13000};

function score(p,occ,rec,bud){
  const mx=BUD_MAX[bud]||99999,mn=BUD_MIN[bud]||0;
  if(p.price>mx||p.price<mn*0.4) return 0;
  const ot=OCC_T[occ]||[],rt=REC_T[rec]||[];
  let s=0;
  p.tags.forEach(t=>{if(ot.includes(t))s+=2;if(rt.includes(t))s+=3;});
  return s;
}

const GIFT_NOTES={
  "Mom":"\"Every day you gave me your best — this is just a tiny piece of mine back to you. Love you endlessly, Mom. ❤️\"",
  "Dad":"\"For the man who taught me everything worth knowing. Still your biggest fan. Always. 🥂\"",
  "Partner / Spouse":"\"You make ordinary moments feel extraordinary. This is just proof that I notice. Forever yours. 💍\"",
  "Best Friend":"\"To the one who always shows up — here's me showing up for you. Because you deserve everything good. 🫶\"",
  "Kid (5–12)":"\"For the coolest, most creative, most wonderful kid in the universe. Keep being amazing! ⭐\"",
  "Teen":"\"You're basically already a legend. This is just official confirmation. 🎧\"",
  "Colleague":"\"Working alongside someone this talented deserves celebration. Here's to you! 🥂\"",
  "Grandparent":"\"Your warmth, your stories, your love — irreplaceable. This is just a small thank you for a lifetime of that. ❤️\"",
  "Sibling":"\"Officially the world's best sibling gift. For the world's best sibling. Debate closed. 😎\"",
};

export default function RecommendPage(){
  const [step,setStep]=useState(0);
  const [ans,setAns]=useState({});
  const [results,setResults]=useState(null);
  const [loading,setLoading]=useState(false);
  const [toast,setToast]=useState("");
  const [imgErr,setImgErr]=useState({});

  const showToast=(m)=>{setToast(m);setTimeout(()=>setToast(""),2500);};

  const pick=async(opt)=>{
    const key=["occasion","recipient","budget"][step];
    const na={...ans,[key]:opt};
    setAns(na);
    if(step<2){setStep(step+1);return;}
    setLoading(true);
    // Score locally
    const scored=PRODUCTS.map(p=>({...p,sc:score(p,na.occasion,na.recipient,na.budget)})).filter(p=>p.sc>0).sort((a,b)=>b.sc-a.sc);
    let res=scored.slice(0,3);
    if(res.length<3){
      const fallback=PRODUCTS.filter(p=>!res.find(r=>r.id===p.id)&&p.price<=BUD_MAX[na.budget]);
      res=[...res,...fallback.slice(0,3-res.length)];
    }
    res=res.slice(0,3);
    // Call LLM API for personalized reasons
    try {
      const resp=await fetch("/api/recommend",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({occasion:na.occasion,recipient:na.recipient,budget:na.budget,products:res})});
      const data=await resp.json();
      if(data.reasons&&data.reasons.length===res.length){
        res=res.map((p,i)=>({...p,reason:data.reasons[i]||p.reason}));
      }
    } catch(_){}
    setResults(res);
    setLoading(false);
  };

  const reset=()=>{setStep(0);setAns({});setResults(null);};

  return(
    <div style={{fontFamily:"'Nunito',sans-serif",minHeight:"100vh",background:DARK,color:"#F0EAD6"}}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Nunito:wght@300;400;600;700;800;900&display=swap" rel="stylesheet"/>
      <nav style={{background:SURFACE,borderBottom:`1px solid ${BORDER}`,padding:"0 3rem",display:"flex",alignItems:"center",justifyContent:"space-between",height:"68px"}}>
        <a href="/" style={{textDecoration:"none"}}><Logo/></a>
        <a href="/" style={{color:MUTED,textDecoration:"none",fontSize:"13px",display:"flex",alignItems:"center",gap:"6px"}}>
          <span>←</span> Back to shop
        </a>
      </nav>

      <div style={{maxWidth:"760px",margin:"0 auto",padding:"60px 2rem"}}>
        {!results&&!loading&&(
          <>
            <div style={{display:"flex",gap:"8px",justifyContent:"center",marginBottom:"56px"}}>
              {STEPS.map((_,i)=>(
                <div key={i} style={{height:"2px",width:"80px",background:i<=step?GOLD:BORDER,borderRadius:"2px",transition:"background 0.4s"}}/>
              ))}
            </div>
            <div style={{textAlign:"center",marginBottom:"44px"}}>
              <div style={{fontSize:"40px",color:GOLD,fontFamily:"'Cormorant Garamond',serif",marginBottom:"12px"}}>{STEPS[step].icon}</div>
              <div style={{fontSize:"11px",color:MUTED,letterSpacing:"2.5px",fontWeight:700,marginBottom:"10px"}}>STEP {step+1} OF 3</div>
              <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(32px,5vw,52px)",color:"#F0EAD6",letterSpacing:"-0.5px"}}>{STEPS[step].q}</h1>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(168px,1fr))",gap:"12px"}}>
              {STEPS[step].opts.map(opt=>(
                <button key={opt} onClick={()=>pick(opt)} style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:"12px",padding:"18px 16px",color:"#F0EAD6",fontFamily:"'Nunito',sans-serif",fontWeight:700,fontSize:"14px",cursor:"pointer",transition:"all 0.15s",textAlign:"center",letterSpacing:"0.2px"}}
                  onMouseEnter={e=>{e.target.style.borderColor=GOLD;e.target.style.color=GOLD;e.target.style.background=`${GOLD}0F`;}}
                  onMouseLeave={e=>{e.target.style.borderColor=BORDER;e.target.style.color="#F0EAD6";e.target.style.background=CARD;}}>
                  {opt}
                </button>
              ))}
            </div>
            {step>0&&<div style={{textAlign:"center",marginTop:"28px"}}><button onClick={()=>setStep(s=>s-1)} style={{background:"none",border:"none",color:MUTED,cursor:"pointer",fontSize:"13px",fontFamily:"'Nunito',sans-serif"}}>← Go back</button></div>}
          </>
        )}

        {loading&&(
          <div style={{textAlign:"center",padding:"100px 0"}}>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"64px",color:GOLD,marginBottom:"28px",display:"inline-block",animation:"pulse 1.6s ease-in-out infinite"}}>◈</div>
            <style>{`@keyframes pulse{0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.5;transform:scale(0.92);}}`}</style>
            <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"32px",color:"#F0EAD6",marginBottom:"12px"}}>Curating your selection...</h2>
            <p style={{color:MUTED,fontSize:"15px",fontWeight:300}}>Our AI is handpicking gifts worthy of the moment</p>
          </div>
        )}

        {results&&(
          <>
            <div style={{textAlign:"center",marginBottom:"52px"}}>
              <div style={{fontSize:"48px",color:GOLD,fontFamily:"'Cormorant Garamond',serif",marginBottom:"12px"}}>✦</div>
              <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(36px,5vw,54px)",color:"#F0EAD6",marginBottom:"10px",letterSpacing:"-0.5px"}}>Your curated picks</h1>
              <p style={{color:MUTED,fontSize:"15px",fontWeight:300}}>
                For <span style={{color:"#F0EAD6",fontWeight:600}}>{ans.recipient}</span> · <span style={{color:"#F0EAD6",fontWeight:600}}>{ans.occasion}</span> · <span style={{color:GOLD,fontWeight:700}}>{ans.budget}</span>
              </p>
            </div>

            <div style={{display:"flex",flexDirection:"column",gap:"24px",marginBottom:"44px"}}>
              {results.map((p,i)=>(
                <div key={p.id} style={{background:CARD,border:`1px solid ${i===0?GOLD+"55":BORDER}`,borderRadius:"16px",overflow:"hidden",position:"relative"}}>
                  {i===0&&<div style={{position:"absolute",top:"16px",left:"16px",background:`${GOLD}18`,border:`1px solid ${GOLD}44`,color:GOLD,fontSize:"9px",fontWeight:800,padding:"4px 14px",borderRadius:"40px",letterSpacing:"1.5px",zIndex:1}}>✦ BEST MATCH</div>}
                  <div style={{display:"flex",gap:"0"}}>
                    <div style={{width:"200px",minWidth:"200px",height:"220px",position:"relative",overflow:"hidden",background:SURFACE}}>
                      {!imgErr[p.id]?(
                        <img src={p.image} alt={p.name} onError={()=>setImgErr(prev=>({...prev,[p.id]:true}))}
                          style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                      ):(
                        <div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"56px"}}>🎁</div>
                      )}
                      <div style={{position:"absolute",inset:0,background:"linear-gradient(to right,transparent 60%,rgba(26,23,16,0.8))"}}/>
                    </div>
                    <div style={{flex:1,padding:"24px 24px 20px"}}>
                      <div style={{fontSize:"9px",color:GOLD,fontWeight:800,letterSpacing:"1.8px",marginBottom:"8px",textTransform:"uppercase"}}>#{i+1} Pick</div>
                      <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"22px",color:"#F0EAD6",marginBottom:"10px",lineHeight:1.2}}>{p.name}</h3>
                      <p style={{color:MUTED,fontSize:"13px",lineHeight:1.6,marginBottom:"16px"}}>{p.reason}</p>
                      <div style={{background:"#0f0d08",borderLeft:`3px solid ${GOLD}`,borderRadius:"0 8px 8px 0",padding:"12px 16px",marginBottom:"18px"}}>
                        <div style={{fontSize:"9px",color:GOLD,fontWeight:800,letterSpacing:"1.5px",marginBottom:"5px"}}>✉ SUGGESTED GIFT NOTE</div>
                        <div style={{fontSize:"12px",color:"#a89878",fontStyle:"italic",lineHeight:1.6}}>{GIFT_NOTES[ans.recipient]||"\"Wishing you the most wonderful moments with this gift. ✨\""}</div>
                      </div>
                      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                        <span style={{fontSize:"26px",fontWeight:700,color:GOLD,fontFamily:"'Cormorant Garamond',serif"}}>₹{p.price.toLocaleString()}</span>
                        <button onClick={()=>showToast(`${p.name} added to cart!`)}
                          style={{background:GOLD,border:"none",borderRadius:"8px",padding:"11px 22px",fontFamily:"'Nunito',sans-serif",fontWeight:800,fontSize:"13px",cursor:"pointer",color:DARK,letterSpacing:"0.5px"}}>
                          Add to Cart →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{background:SURFACE,border:`1px solid ${BORDER}`,borderRadius:"14px",padding:"20px 24px",marginBottom:"36px",display:"flex",alignItems:"center",gap:"16px"}}>
              <div style={{fontSize:"28px",color:GOLD,fontFamily:"'Cormorant Garamond',serif"}}>◈</div>
              <div>
                <div style={{fontWeight:700,color:"#F0EAD6",fontSize:"15px",marginBottom:"3px"}}>GiftAI's Emotion Tip</div>
                <div style={{fontSize:"13px",color:MUTED,lineHeight:1.5}}>Pair your gift with a handwritten card using the suggested note above. Gifts with personal notes are 3× more memorable, according to research. ✦</div>
              </div>
            </div>

            <div style={{textAlign:"center"}}>
              <button onClick={reset} style={{background:"transparent",border:`1px solid ${BORDER}`,color:MUTED,borderRadius:"8px",padding:"12px 32px",fontFamily:"'Nunito',sans-serif",fontWeight:600,fontSize:"14px",cursor:"pointer",letterSpacing:"0.5px"}}>
                ← Start Over
              </button>
            </div>
          </>
        )}
      </div>

      {toast&&<div style={{position:"fixed",bottom:"28px",left:"50%",transform:"translateX(-50%)",background:SURFACE,border:`1px solid ${GOLD}44`,color:"#E8C97A",padding:"12px 28px",borderRadius:"40px",fontWeight:600,fontSize:"13px",zIndex:9999,whiteSpace:"nowrap"}}>✦ {toast}</div>}
    </div>
  );
}
