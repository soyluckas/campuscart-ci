import test from 'node:test';
import assert from 'node:assert/strict';
import {quote,money} from '../lib/products.js';
test('server calculates trusted price',()=>assert.equal(quote('headphones',2).total,5998));
test('reject invalid orders',()=>{for(const [id,q] of [['lamp',1],['unknown',1],['headphones',-1],['headphones',9],['headphones',1.5]])assert.equal(quote(id,q),null)});
test('format price',()=>assert.equal(money(2999),'£29.99'));
