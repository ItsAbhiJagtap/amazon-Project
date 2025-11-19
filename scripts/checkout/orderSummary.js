import {
  cart,
  removeFromCart,
  updateQuantity,
  updateDeliveryOption
} from "../../data/cart.js";

import { products } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import { deliveryOptions } from "../../data/deliveryOptions.js";
import { renderPaymentSummary } from "./paymentSummary.js";

/* =====================================================================
   RENDER ORDER SUMMARY
===================================================================== */
export function renderOrderSummary() {
  let html = "";

  cart.forEach((cartItem) => {
    const product = products.find(p => p.id === cartItem.productId);
    const deliveryOptionId = cartItem.deliveryOptionId || deliveryOptions[0].id;

    const selectedDeliveryOption = deliveryOptions.find(
      opt => opt.id === deliveryOptionId
    );

    const date = dayjs().add(selectedDeliveryOption.deliveryDays, "days");
    const dateString = date.format("dddd, MMMM D");

    html += `
      <div class="cart-item-container js-cart-item-container-${product.id}">
        <div class="delivery-date">${dateString}</div>

        <div class="cart-item-details-grid">
          <img class="product-image" src="${product.image}">

          <div class="cart-item-details">
            <div class="product-name">${product.name}</div>

            <div class="product-price">
              $${formatCurrency(product.priceCents)}
            </div>

            <div class="product-quantity">
              <span>Quantity:
                <span class="quantity-label js-quantity-label-${product.id}">
                  ${cartItem.quantity}
                </span>
              </span>

              <span 
                class="update-quantity-link link-primary js-update-link"
                data-product-id="${product.id}"
              >
                Update
              </span>

              <input 
                class="quantity-input js-quantity-input-${product.id}"
                type="number"
                min="1"
                value="${cartItem.quantity}"
              >

              <span 
                class="save-quantity-link link-primary js-save-link"
                data-product-id="${product.id}"
              >
                Save
              </span>

              <span 
                class="delete-quantity-link link-primary js-delete-link"
                data-product-id="${product.id}"
              >
                Delete
              </span>
            </div>
          </div>

          <div class="delivery-options">
            <div class="delivery-options-title">Choose a delivery option:</div>

            ${deliveryOptionsHTML(product, cartItem)}
          </div>
        </div>
      </div>
    `;
  });

  document.querySelector(".js-order-summary").innerHTML = html;

  setupEventListeners();
}

/* =====================================================================
   DELIVERY OPTIONS HTML
===================================================================== */
function deliveryOptionsHTML(product, cartItem) {
  return deliveryOptions
    .map((option) => {
      const date = dayjs().add(option.deliveryDays, "days");
      const dateString = date.format("dddd, MMMM D");

      return `
        <div 
          class="delivery-option js-delivery-option"
          data-product-id="${product.id}"
          data-delivery-option-id="${option.id}"
        >
          <input 
            type="radio"
            class="delivery-option-input"
            name="delivery-option-${product.id}"
            ${option.id === cartItem.deliveryOptionId ? "checked" : ""}
          >
          <div>
            <div class="delivery-option-date">${dateString}</div>
            <div class="delivery-option-price">
              ${
                option.priceCents === 0
                  ? "Free Shipping"
                  : "$" + formatCurrency(option.priceCents) + " - Shipping"
              }
            </div>
          </div>
        </div>
      `;
    })
    .join("");
}

/* =====================================================================
   EVENT LISTENERS
===================================================================== */
function setupEventListeners() {
  // DELETE ITEM
  document.querySelectorAll(".js-delete-link").forEach((btn) => {
    btn.addEventListener("click", () => {
      removeFromCart(btn.dataset.productId);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });

  // EDIT MODE
  document.querySelectorAll(".js-update-link").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelector(`.js-cart-item-container-${btn.dataset.productId}`)
        .classList.add("is-editing-quantity");
    });
  });

  // SAVE QUANTITY
  document.querySelectorAll(".js-save-link").forEach((btn) => {
    btn.addEventListener("click", () => {
      const productId = btn.dataset.productId;
      const newQty = Number(
        document.querySelector(`.js-quantity-input-${productId}`).value
      );

      updateQuantity(productId, newQty);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });

  // DELIVERY OPTION CHANGE (FIXED)
  document.querySelectorAll(".delivery-option-input").forEach((radio) => {
    radio.addEventListener("change", () => {
      const parent = radio.closest(".js-delivery-option");
      const productId = parent.dataset.productId;
      const optionId = parent.dataset.deliveryOptionId;

      updateDeliveryOption(productId, optionId);

      renderOrderSummary();
      renderPaymentSummary();
    });
  });
}
