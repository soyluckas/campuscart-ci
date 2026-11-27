import {products,money} from '../../../lib/products';
import {notFound} from 'next/navigation';
import Link from 'next/link';
export function generateStaticParams(){return products.map(p=>({id:p.id}))}
export default async function Product({params}){const {id}=await params;const p=products.find(p=>p.id===id);if(!p)notFound();return <main><article><div className="product-art">{p.symbol}</div><h1>{p.name}</h1><p>{money(p.price)}</p><p>{p.stock?'In stock':'Sold out'}</p><Link href="/">Back to shop</Link></article></main>}
