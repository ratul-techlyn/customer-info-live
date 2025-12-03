import { connectToDatabase } from "./../lib/db";
import Order from "./../model/order.model";

export async function loader() {
  try {
    await connectToDatabase();

    const orders = await Order.find().sort({ created_at: -1 });

    return new Response(JSON.stringify({ success: true, orders }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}