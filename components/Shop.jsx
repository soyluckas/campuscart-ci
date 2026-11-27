'use client';
import {useState} from 'react';
import Link from 'next/link';
import {money} from '../lib/products';
export default function Shop({products}){
 const [search,setSearch]=useState('');
 const [category,setCategory]=useState('All');
 const [basket,setBasket]=useState({});
 const [message,setMessage]=useState('');
 const [busy,setBusy]=useState(false);
 const visible=products.filter(p=>p.name.toLowerCase().includes(search.toLowerCase())&&(category==='All'||p.category===category));
 const total=products.reduce((sum,p)=>sum+p.price*(basket[p.id]||0),0);
 async function checkout(){setBusy(true);setMessage('Checking your basket...');try{const results=await Promise.all(Object.entries(basket).filter(([,q])=>q>0).map(async ([id,quantity])=>{const r=await fetch('/api/order',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,quantity})});if(!r.ok)throw new Error('Invalid basket');return r.json()}));setMessage('Demo quote: '+money(results.reduce((s,r)=>s+r.total,0)));}catch{setMessage('Could not validate basket. Try again.')}finally{setBusy(false)}}
 return <><section className="toolbar"><input aria-label="Search products" placeholder="Search CampusCart" value={search} onChange={e=>setSearch(e.target.value)}/><select aria-label="Category" value={category} onChange={e=>setCategory(e.target.value)}>{['All','Tech','Campus','Home'].map(c=><option key={c}>{c}</option>)}</select></section><div className="shop"><section className="grid">{visible.map(p=><article key={p.id}><div className="product-art" aria-hidden="true">{p.symbol}</div><small>{p.category}</small><h2><Link href={'/products/'+p.id}>{p.name}</Link></h2><strong>{money(p.price)}</strong><p>{p.stock?'In stock':'Sold out'}</p><button disabled={(basket[p.id]||0)>=p.stock||busy} onClick={()=>setBasket(b=>({...b,[p.id]:Math.min(p.stock,(b[p.id]||0)+1)}))}>Add to basket</button></article>)}{!visible.length&&<p>No matching products.</p>}</section><aside><h2>Your basket</h2>{products.filter(p=>basket[p.id]).map(p=><p key={p.id}>{p.name} × {basket[p.id]} <button disabled={busy} onClick={()=>setBasket(b=>({...b,[p.id]:Math.max(0,b[p.id]-1)}))}>−</button></p>)}<h3>{money(total)}</h3><button disabled={!total||busy} onClick={checkout}>Check order</button><p role="status">{message}</p></aside></div></>}
