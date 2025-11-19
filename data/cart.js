export let cart;
loadFromStorage();
export function loadFromStorage(){
cart = JSON.parse(localStorage.getItem("cart")) || [
  {
    productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
    quantity: 2,
    deliveryOptionId: "1"
  },
  {
    productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
    quantity: 1,
    deliveryOptionId: "2"
  }
];
}
function save() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function addToCart(productId) {
  const item = cart.find((i) => i.productId === productId);

  if (item) {
    item.quantity++;
  } else {
    cart.push({
      productId,
      quantity: 1,
      deliveryOptionId: "1"
    });
  }

  save();
}

export function removeFromCart(productId) {
  cart = cart.filter((i) => i.productId !== productId);
  save();
}

export function updateQuantity(productId, qty) {
  const item = cart.find((i) => i.productId === productId);
  if (!item) return;

  item.quantity = Math.max(1, qty);
  save();
}

export function updateDeliveryOption(productId, optionId) {
  const item = cart.find((i) => i.productId === productId);
  if (!item) return;

  item.deliveryOptionId = optionId;
  save();
}
