import './globals.css';
import Link from 'next/link';
export const metadata={title:'CampusCart | Student shop'};
export default function Layout({children}) {return <html lang="en"><body><header><Link href="/" className="brand">campus<span>cart</span></Link><span>Deliver to campus</span><Link href="/api/products">Product API</Link></header>{children}<footer>CampusCart · Educational demo · No real payments or orders</footer></body></html>}
