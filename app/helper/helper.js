import _ from "underscore";

export function formatOrders(orders, shopId) {
  return orders.map(order => {
    const customer = order.customer || {};
    const customerName = `${customer.firstName || ""} ${customer.lastName || ""}`.trim();

    // Collect line item names
    const lineItemNames = (order.lineItems?.edges || []).map(item => item.node?.name).filter(Boolean);

    return {
      shopId: shopId,
      order_number: order.name,
      created_at: order.createdAt || null,
      customer_name: customerName,
      phone: formatBDPhone(customer.defaultAddress?.phone) || null,
      city: customer.defaultAddress?.city || null,
      items: lineItemNames.join(", "),
      subtotal: order.subtotalPriceSet?.shopMoney?.amount || null,
      shipping_price: order.currentShippingPriceSet?.shopMoney?.amount || null,
    };
  });
}

export function formatOrder(order, shopId) {
  if (!order) return null;

  const lineItemNames = _.map(order.line_items, (item) => item.name) || [];

  return {
    shopId: shopId,
    order_number: order.name,
    created_at: order.created_at,
    customer_name: order.customer.first_name + " " + order.customer.last_name,
    phone: formatBDPhone(order.customer.default_address.phone),
    city: order.customer.default_address.city,
    items: lineItemNames.join(", "),
    subtotal: order.subtotal_price_set.shop_money.amount,
    shipping_price: order.total_shipping_price_set.shop_money.amount,
  };
}


export function compareOrders(formattedOrders, uploadedOrders) {
  // Convert uploadedOrders to a fast lookup map using order_number or id
  const uploadedMap = _.indexBy(uploadedOrders, "order_number");

  // Add uploaded status to each formattedOrder
  const extendedFormattedOrders = _.map(formattedOrders, (order) => {
    const uploaded = !!uploadedMap[order.order_number];
    return { ...order, uploaded };
  }).reverse();

  // Filter only orders NOT uploaded yet
  const unuploadedOrders = _.filter(extendedFormattedOrders, (order) => !order.uploaded);

  return {
    unuploadedOrders,
    extendedFormattedOrders,
  };
}


export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
}


export function formatBDPhone(phone) {
  if (!phone) return "";

  // remove all non-digit characters
  let cleaned = phone.replace(/\D/g, "");

  // remove leading country code (880 or 88)
  if (cleaned.startsWith("880")) cleaned = cleaned.slice(3);
  else if (cleaned.startsWith("88")) cleaned = cleaned.slice(2);

  // ensure it starts with 0
  if (!cleaned.startsWith("0")) cleaned = "0" + cleaned;

  return cleaned;
}


