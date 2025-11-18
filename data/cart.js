// ---------------------- LOAD CART ----------------------
export let cart = JSON.parse(localStorage.getItem('cart'));

if (!cart) {
  cart = [
    {
      productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
      quantity: 2,
      deliveryOptionID:'1'
    },
    {
      productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
      quantity: 1,
      deliveryOptionID:'2'
    }
  ];
}

// ---------------------- SAVE FUNCTION ----------------------
function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}


// ---------------------- ADD TO CART ----------------------
export function addToCart(productId) {
  let matchingItem = cart.find(item => item.productId === productId);

  if (matchingItem) {
    matchingItem.quantity++;
  } else {
    cart.push({
      productId: productId,
      quantity: 1,
      deliveryOptionID:'1'
    });
  }

  saveToStorage();
}


// ---------------------- REMOVE FROM CART ----------------------
export function removeFromCart(productId) {
  cart = cart.filter(item => item.productId !== productId);
  saveToStorage();
}


// ---------------------- UPDATE QUANTITY (IMPORTANT!) ----------------------
export function updateQuantity(productId, newQuantity) {
  newQuantity = Number(newQuantity);

  if (!newQuantity || newQuantity < 1) return; // Prevent invalid values

  cart.forEach(item => {
    if (item.productId === productId) {
      item.quantity = newQuantity;
    }
  });

  saveToStorage();
}


// ---------------------- CALCULATE CART COUNT ----------------------
export function calculateCartQuantity() {
  let cartQuantity = 0;

  cart.forEach(item => {
    cartQuantity += item.quantity;
  });

  return cartQuantity;
}
export function updateDeliveryOption(productId,deliveryOptionID){
   let matchingItem = cart.find(item => item.productId === productId);
   if (!matchingItem) return;
   matchingItem.deliveryOptionID =deliveryOptionID;
   saveToStorage();
}