export const products = [
 {id:'headphones',name:'Wireless Headphones',price:2999,category:'Tech',symbol:'🎧',stock:8},
 {id:'keyboard',name:'Compact Keyboard',price:2499,category:'Tech',symbol:'⌨️',stock:5},
 {id:'backpack',name:'Campus Backpack',price:1999,category:'Campus',symbol:'🎒',stock:6},
 {id:'notebook',name:'Study Notebook',price:499,category:'Campus',symbol:'📓',stock:12},
 {id:'bottle',name:'Water Bottle',price:899,category:'Home',symbol:'🧴',stock:4},
 {id:'lamp',name:'Desk Lamp',price:1599,category:'Home',symbol:'💡',stock:0}
];
export const money = p => `£${(p/100).toFixed(2)}`;
export function quote(id, quantity) {
 const product = products.find(p=>p.id===id);
 if (!product || !Number.isInteger(quantity) || quantity<1 || quantity>product.stock) return null;
 return {name:product.name,quantity,total:product.price*quantity};
}
