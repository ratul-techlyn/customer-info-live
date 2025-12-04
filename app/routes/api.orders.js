import { connectToDatabase } from "./../lib/db";
import Order from "./../model/order.model";
import ShopUser from "./../model/shopUser.model";

export async function loader({ request }) {
  try {
    const url = new URL(request.url);
    const shop = url.searchParams.get("shop");
    const pass = url.searchParams.get("pass");


    if (!shop || !pass) {
      return new Response(
        JSON.stringify({ success: false, error: "Unauthorized: Missing shop and pass" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }


    await connectToDatabase();

    const shopUser = await ShopUser.findOne({ shopName: shop });

    if (!shopUser) {
      return new Response(
        JSON.stringify({ success: false, error: "Shop not registered" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const isValidPass = pass === shopUser.passHash;

    if (!isValidPass) {
      return new Response(
        JSON.stringify({ success: false, error: "Unauthorized: Invalid pass" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const orders = await Order.find({ shopId: shopUser.shopId }).sort({ created_at: -1 });

    return new Response(
      JSON.stringify({ success: true, shop, orders }),
      { headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
