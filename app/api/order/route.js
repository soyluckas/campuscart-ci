import {quote} from '../../../lib/products';
export async function POST(request){let body;try{body=await request.json()}catch{return Response.json({error:'Invalid JSON'},{status:400})}const result=quote(body?.id,body?.quantity);return result?Response.json(result):Response.json({error:'Invalid product or quantity'},{status:400})}
