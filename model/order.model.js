import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const orderSchema = new Schema(
  {
    shopId: {
      type: String,
      required: true,
    },

    order_number: {
      type: String,
      required: true,
    },

    created_at: {
      type: Date,
      required: true,
    },

    customer_name: {
      type: String,
    },

    phone: {
      type: String,
    },

    city: {
      type: String,
    },

    items: {
      type: String, // Stored as "item1, item2, item3"
    },

    subtotal: {
      type: String, // Shopify returns string amounts — keep as String
    },

    shipping_price: {
      type: String, // Same here
    },
  },
  {
    timestamps: true,
  }
);

const Order = models?.Order || model("Order", orderSchema);
export default Order;
