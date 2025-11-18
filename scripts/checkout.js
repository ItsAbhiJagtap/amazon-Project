import {
  cart,
  removeFromCart,
  updateQuantity,
  updateDeliveryOption,
} from "../data/cart.js";

import { products } from "../data/products.js";
import formatCurrency from "./utils/money.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import { deliveryOptions } from "../data/deliveryOptions.js";

function renderOrderSummary() {
  let cartSummaryHTML = "";

  cart.forEach((cartItem) => {
    const productId = cartItem.productId;
    const matchingProduct = products.find((p) => p.id === productId);

    const deliveryOptionID = cartItem.deliveryOptionID || deliveryOptions[0].id;

    const selectedDeliveryOption = deliveryOptions.find(
      (option) => option.id === deliveryOptionID
    );

    const today = dayjs();
    const deliveryDate = today.add(selectedDeliveryOption.deliveryDays, "days");
    const dateString = deliveryDate.format("dddd, MMMM D");

    cartSummaryHTML += `
      <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">${dateString}</div>

        <div class="cart-item-details-grid">
          <img class="product-image" src="${matchingProduct.image}">

          <div class="cart-item-details">
            <div class="product-name">${matchingProduct.name}</div>
            <div class="product-price">$${formatCurrency(matchingProduct.priceCents)}</div>

            <div class="product-quantity">
              <span>
                Quantity:
                <span class="quantity-label js-quantity-label-${matchingProduct.id}">
                  ${cartItem.quantity}
                </span>
              </span>

              <span class="update-quantity-link link-primary js-update-link"
                data-product-id="${matchingProduct.id}">
                Update
              </span>

              <input class="quantity-input js-quantity-input-${matchingProduct.id}" type="number" min="1">

              <span class="save-quantity-link link-primary js-save-link"
                data-product-id="${matchingProduct.id}">
                Save
              </span>

              <span class="delete-quantity-link link-primary js-delete-link"
                data-product-id="${matchingProduct.id}">
                Delete
              </span>
            </div>
          </div>

          <div class="delivery-options">
            <div class="delivery-options-title">Choose a delivery option:</div>

            ${deliveryOptionsHTML(matchingProduct, cartItem)}
          </div>
        </div>
      </div>
    `;
  });

  document.querySelector(".js-order-summary").innerHTML = cartSummaryHTML;

  setupEventListeners();
}

/* ---------------- DELIVERY OPTIONS HTML ---------------- */
function deliveryOptionsHTML(matchingProduct, cartItem) {
  let html = "";

  deliveryOptions.forEach((deliveryOption) => {
    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
    const dateString = deliveryDate.format("dddd, MMMM D");

    const priceString =
      deliveryOption.priceCents === 0
        ? "Free Shipping"
        : `$${formatCurrency(deliveryOption.priceCents)} - Shipping`;

    const isChecked = deliveryOption.id === cartItem.deliveryOptionID;

    html += `
      <div 
        class="delivery-option js-delivery-option"
        data-product-id="${matchingProduct.id}"
        data-delivery-option-id="${deliveryOption.id}"
      >
        <input type="radio"
          class="delivery-option-input"
          name="delivery-option-${matchingProduct.id}"
          ${isChecked ? "checked" : ""}
        >
        <div>
          <div class="delivery-option-date">${dateString}</div>
          <div class="delivery-option-price">${priceString}</div>
        </div>
      </div>
    `;
  });

  return html;
}

/* ---------------- ALL EVENT LISTENERS ---------------- */
function setupEventListeners() {
  /* DELETE */
  document.querySelectorAll(".js-delete-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      removeFromCart(productId);
      renderOrderSummary();
    });
  });

  /* UPDATE CART QUANTITY */
  document.querySelectorAll(".js-update-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      document
        .querySelector(`.js-cart-item-container-${productId}`)
        .classList.add("is-editing-quantity");
    });
  });

  /* SAVE NEW QUANTITY */
  document.querySelectorAll(".js-save-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      const newQuantity = Number(
        document.querySelector(`.js-quantity-input-${productId}`).value
      );
      updateQuantity(productId, newQuantity);
      renderOrderSummary();
    });
  });

  /* DELIVERY OPTION CLICK */
  document.querySelectorAll(".js-delivery-option").forEach((element) => {
    element.addEventListener("click", () => {
      const productId = element.dataset.productId;
      const deliveryOptionID = element.dataset.deliveryOptionId;

      updateDeliveryOption(productId, deliveryOptionID);
      renderOrderSummary();
    });
  });
}

renderOrderSummary();
