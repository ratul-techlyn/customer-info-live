import _ from "underscore";

export function formatOrders(response, shopId) {
  return response.orders.edges.map(({ node }) => {
    const customerName = `${node.customer?.firstName || ""} ${node.customer?.lastName || ""}`.trim();

    // Collect line item names
    const lineItemNames = node.lineItems?.edges?.map(item => item.node?.name) || [];

    return {
      shopId: shopId,
      order_number: node.name,
      created_at: node.createdAt || null,
      customer_name: customerName,
      phone: node.customer?.defaultAddress?.phone || null,
      city: node.customer?.defaultAddress?.city || null,
      items: lineItemNames.join(", "),
      subtotal: node.subtotalPriceSet?.shopMoney?.amount || null,
      shipping_price: node.currentShippingPriceSet?.shopMoney?.amount || null,
    };
  });
}


import _ from "underscore";

export function formatOrder(order, shopId) {
  if (!order) return null;

  // const customerName = _.compact([
  //   _.get(node, ""),
  //   _.get(node, "customer.last_name")
  // ]).join(" ");

  const lineItemNames = _.map(order.line_items, (item) => item.name) || [];

  return {
    shopId: shopId,
    order_number: order.name,
    created_at: order.created_at,
    customer_name: order.customer.first_name + " " + order.customer.last_name,
    phone: order.customer.default_address.phone,
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
  });

  // Filter only orders NOT uploaded yet
  const unuploadedOrders = _.filter(extendedFormattedOrders, (order) => !order.uploaded);

  return {
    unuploadedOrders,
    extendedFormattedOrders,
  };
}

