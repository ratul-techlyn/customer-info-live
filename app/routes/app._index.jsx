import { useEffect } from "react";
import { useFetcher, useLoaderData } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { executeGraphQL } from "../graphql/graphql";
import { getShopQuery, getAllOrdersQuery } from "../graphql/queries";
import { formatOrders, compareOrders } from "../helper/helper";
import { connectToDatabase } from "../lib/db";
import Order from "../model/order.model";
import OrderTable from "./../components/table/OrderTable";

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const shopData = await executeGraphQL(admin, getShopQuery);
  const orders = await executeGraphQL(admin, getAllOrdersQuery);
  const formattedOrders = formatOrders(orders, shopData.shop.id);

  await connectToDatabase();
  const ordersFromDB = await Order.find({ shopId: shopData.shop.id });

  const { unuploadedOrders, extendedFormattedOrders } = compareOrders(
    formattedOrders,
    ordersFromDB,
  );

  return { unuploadedOrders, extendedFormattedOrders };
};

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const form = await request.formData();
  const ordersJson = form.get("orders");
  const orders = JSON.parse(ordersJson);

  await connectToDatabase();
  const result = await Order.insertMany(orders);

  return { result };
};

export default function Index() {
  const fetcher = useFetcher();
  const { unuploadedOrders, extendedFormattedOrders } = useLoaderData();

  const shopify = useAppBridge();
  const isLoading =
    ["loading", "submitting"].includes(fetcher.state) &&
    fetcher.formMethod === "POST";

  useEffect(() => {
    if (fetcher.data?.result) {
      shopify.toast.show("Orders uploaded");
      console.log(fetcher.data?.result);
    }
  }, [fetcher.data?.result, shopify]);

  const generateProduct = () =>
  fetcher.submit(
    { orders: JSON.stringify(unuploadedOrders) },
    { method: "POST" }
  );

  return (
    <s-page heading="Customer Info">
      <s-button
        slot="primary-action"
        onClick={generateProduct}
        {...(isLoading ? { loading: true } : {})}
      >
        Sync Order
      </s-button>

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
    </s-page>
  );
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
