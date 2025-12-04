import bcrypt from "bcrypt";
import { useAppBridge } from "@shopify/app-bridge-react";
import { useEffect, useState } from "react";
import { useLoaderData, useFetcher } from "react-router";
import { authenticate } from "../shopify.server";
import { executeGraphQL } from "./../graphql/graphql";
import { getShopQuery } from "./../graphql/queries";
import ShopUser from "./../model/shopUser.model";
import { connectToDatabase } from "./../lib/db";

export const loader = async ({ request }) => {
    const { admin } = await authenticate.admin(request);
    const shopData = await executeGraphQL(admin, getShopQuery);

    await connectToDatabase();
    const shopUser = await ShopUser.findOne({ shopName: shopData.shop.name });

    if (!shopUser) {
        return { shopData };
    }

    const api = "https://customer-info-live.onrender.com/api/orders?shop=" + shopData.shop.name + "&pass=" + shopUser.passHash;

    return { shopData, api };
};

export const action = async ({ request }) => {
    const formData = await request.formData();
    const pass = formData.get("pass");
    const shopName = formData.get("shopName");
    const shopId = formData.get("shopId");

    if (!pass || !shopName || !shopId) {
        return { success: false, message: "Missing fields" };
    }

    // Hash password
    const salt = bcrypt.genSaltSync(10);
    const hashedPass = bcrypt.hashSync(pass, salt);

    await connectToDatabase();

    const shopUser = await ShopUser.findOne({ shopName });

    if (shopUser) {
        await ShopUser.findOneAndUpdate(
            { shopName },
            { passHash: hashedPass, shopId },
            { upsert: true, new: true }
        );
    }

    const newShopUser = new ShopUser({ shopName, passHash: hashedPass, shopId });
    await newShopUser.save();

    return { success: true, pass };
};

export default function Index() {
    const fetcher = useFetcher();
    const shopify = useAppBridge();
    const { shopData, api } = useLoaderData();
    const [pass, setPass] = useState("");

    useEffect(() => {
        if (fetcher.data?.success) {
            console.log("Pass saved:", fetcher.data.pass);
        }
    }, [fetcher.data]);

    // handle click
    const handleClick = () => {
        fetcher.submit({ pass, shopName: shopData.shop.name, shopId: shopData.shop.id }, { method: "post" });
    };

    // handel copy
    const handleCopy = () => {
        shopify.toast.show("API copied to clipboard");
        navigator.clipboard.writeText(api);
    };

    return (
        <s-page title="Public API">
            <s-section>
                <h2>Store: {shopData.shop.name}</h2>
                <p>Enter a secret pass key for API access.</p>

                <s-grid
                    gridTemplateColumns="1fr"
                    gap="small"
                    justifyContent="center"
                >
                    <s-grid-item>
                        {api && (
                            <s-clickable
                                border="base"
                                padding="base"
                                background="subdued"
                                borderRadius="base"
                                onClick={handleCopy}
                            >
                                {api}
                            </s-clickable>
                        )}
                    </s-grid-item>
                    <s-grid-item>
                        <s-text-field
                            label="API Pass"
                            value={pass}
                            name="pass"
                            onChange={(e) => setPass(e.target.value)}
                            placeholder="Enter secret pass for API"
                            autoComplete="off"
                        />
                    </s-grid-item>
                    <s-grid-item>
                        <s-button variant="primary" onClick={handleClick}>
                            Save Pass
                        </s-button>
                    </s-grid-item>
                </s-grid>
            </s-section>
        </s-page>
    );
}
