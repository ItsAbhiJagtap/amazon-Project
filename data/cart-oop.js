function Cart(localStorageKey){
    const cart = {
  cartItems: undefined,

  loadFromStorage() {
    this.cartItems =
      JSON.parse(localStorage.getItem(localStorageKey)) || [
        {
          productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
          quantity: 2,
          deliveryOptionId: "1",
        },
        {
          productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
          quantity: 1,
          deliveryOptionId: "2",
        },
      ];
  },

  save() {
    localStorage.setItem(localStorageKey, JSON.stringify(this.cartItems));
  },

  addToCart(productId) {
    const item = this.cartItems.find((i) => i.productId === productId);

    if (item) {
      item.quantity++;
    } else {
      this.cartItems.push({
        productId,
        quantity: 1,
        deliveryOptionId: "1",
      });
    }
    this.save();
  },

  removeFromCart(productId) {
    this.cartItems = this.cartItems.filter(
      (i) => i.productId !== productId
    );
    this.save();
  },

  updateQuantity(productId, qty) {
    const item = this.cartItems.find((i) => i.productId === productId);
    if (!item) return;

    item.quantity = Math.max(1, qty);
    this.save();
  },

  updateDeliveryOption(productId, optionId) {
    const item = this.cartItems.find((i) => i.productId === productId);
    if (!item) return;

    item.deliveryOptionId = optionId;
    this.save();
  }
};

return cart;
}

const cart =Cart('cart-oop');
const businessCart=Cart('cart-businessCart');

cart.loadFromStorage();
console.log(cart);
console.log(businessCart);
