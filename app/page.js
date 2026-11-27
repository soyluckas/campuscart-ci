import Shop from '../components/Shop';
import {products} from '../lib/products';
export default function Home(){return <main><section className="hero"><small>THE STUDENT STORE</small><h1>Everything for your campus life.</h1><p>Discover everyday essentials at student-friendly prices.</p></section><Shop products={products}/></main>}
