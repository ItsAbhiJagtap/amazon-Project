import { cart,addToCart,loadFromStorage
 } from "../../data/cart.js";
 describe('test suite: add to cart',()=>{
    it('adds and existing product to the cart',()=>{
        spyOn(localStorage,'getItem').and.callFake(()=>{
            return JSON.stringify([]);
        });
        loadFromStorage();
        addToCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
        expect((cart.length).toEqual(1));
    });
 })