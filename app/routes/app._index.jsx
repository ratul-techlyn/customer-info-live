import { boundary } from "@shopify/shopify-app-react-router/server";
import { useEffect } from "react";
import { useLoaderData } from "react-router";
import { executeGraphQL } from "../../graphql/graphql";
import { getAllOrdersQuery, getShopQuery } from "./../../graphql/queries";
import { formatOrders } from "./../../helper/helper";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const shopData = await executeGraphQL(admin, getShopQuery);
  const orders = await executeGraphQL(admin, getAllOrdersQuery);
  const formattedOrders = formatOrders(orders, shopData.shop.id);

  // await connectToDatabase();
  // await Order.insertMany(formattedOrders);

  return { formattedOrders };
};

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  return null;
};

export default function Index() {
  const { formattedOrders } = useLoaderData();

  useEffect(() => {
    console.log(formattedOrders);
  }, [formattedOrders]);

  return (
    <h1>Orders</h1>
  );
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
