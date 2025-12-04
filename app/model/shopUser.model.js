import mongoose from "mongoose";

const ShopUserSchema = new mongoose.Schema(
    {
        shopId: { type: String, required: true },
        shopName: { type: String, required: true, unique: true },
        passHash: { type: String, required: true },
    },
    { timestamps: true }
);

export default mongoose.models.ShopUser ||
    mongoose.model("ShopUser", ShopUserSchema);
