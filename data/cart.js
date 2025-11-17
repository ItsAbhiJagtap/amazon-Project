// cart.js
export const cart = [{
  productId:'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
  quantity:2,
  },{
    productId:'15b6fc6f-327a-4ec4-896f-486349e85a3d',
    quantity:1
  }];

export function addToCart(productId, quantity = 1) {
  let matchingItem;

  cart.forEach((cartItem) => {
    if (cartItem.productId === productId) {
      matchingItem = cartItem;
    }
  });

  if (matchingItem) {
    matchingItem.quantity += quantity;
  } else {
    cart.push({
      productId: productId,
      quantity: quantity,
    });
  }
}

export function updateCarQuantity(productId) {
  let cartQuantity = 0;

  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });

  document.querySelector(".js-cart-quantity").innerHTML = cartQuantity;

  // return the added message element for the specific product
  return document.querySelector(`.js-added-to-cart-${productId}`);
}
