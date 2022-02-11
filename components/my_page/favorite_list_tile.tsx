import { Button } from "@material-ui/core";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { fetchShop } from "../../service/shop_service";
import Shop from "../../entity/Shop";
import ShopListTile from "../shop_list_page/shop_list_tile";

type Props = {
    shopId: string
}

export default function FavoriteListTile(props: Props) {
    const router = useRouter()

    const [shop, setShop] = useState<Shop | null>(null)

    const openShopPage = (shopId: string) => {
        console.log('shopId: ', shopId)
        router.push({
            pathname: '/shop_page',
            query: { shopId: shopId },
        });
    }

    const fetchFavoriteShop = async () => {
        const favoriteShop = await fetchShop(props.shopId)
        setShop(favoriteShop!)
    }

    useEffect(() => {
        fetchFavoriteShop();
    }, [])

    return (
        <>
            {shop &&
                <Button onClick={() => openShopPage(shop.shopId)}>
                    <ShopListTile
                        imageUrl={shop.shopImageUrl}
                        shopName={shop.shopName}
                        color='#ff4081'
                    />
                </Button>
            }
        </>
    )
}