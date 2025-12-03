import React from "react";

export default function OrderTable({ extendedFormattedOrders }) {
  return (
    <s-section padding="0">
      <s-table>
        <s-table-header-row>
          <s-table-header>Order number</s-table-header>
          <s-table-header>Customer name</s-table-header>
          <s-table-header>Phone</s-table-header>
          <s-table-header>Created at</s-table-header>
          <s-table-header>Status</s-table-header>
        </s-table-header-row>

        <s-table-body>
          {extendedFormattedOrders.map((order) => (
            <s-table-row key={order.order_number}>
              <s-table-cell>{order.order_number}</s-table-cell>
              <s-table-cell>{order.customer_name}</s-table-cell>
              <s-table-cell>{order.phone}</s-table-cell>
              <s-table-cell>{order.created_at}</s-table-cell>
              <s-table-cell>
                {order.uploaded ? (
                  <s-badge tone="success">uploaded</s-badge>
                ) : (
                  <s-badge tone="danger">not uploaded</s-badge>
                )}
              </s-table-cell>
            </s-table-row>
          ))}
        </s-table-body>
      </s-table>
    </s-section>
  );
}
