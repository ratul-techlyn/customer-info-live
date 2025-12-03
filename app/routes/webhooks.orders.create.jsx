import { authenticate } from "../shopify.server";
import { executeGraphQL } from "../graphql/graphql";
import { getShopQuery } from "../graphql/queries";
import { formatOrder } from "../helper/helper";
import { connectToDatabase } from "../lib/db";
import Order from "../model/order.model";



export const action = async ({ request }) => {
  const { payload, admin } = await authenticate.webhook(request);

  const shopData = await executeGraphQL(admin, getShopQuery);
  const formatedOrder = formatOrder(payload, shopData?.shop?.id);

  console.log("Formated order:", formatedOrder);

  // OPTIONAL: save order to DB
  await connectToDatabase();
  await Order.create(formatedOrder);

  return new Response("OK");
};
