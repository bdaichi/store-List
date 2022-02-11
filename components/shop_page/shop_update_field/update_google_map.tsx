import { Button, CircularProgress, Dialog } from "@material-ui/core";
import { Dispatch, SetStateAction, useState } from "react";

import GoogleMapFeild from "../shop_data_field/google_map_field";
import Shop from "../../../entity/Shop";
import { updateShopData } from "../../../service/shop_service";

type Props = {
    shop: Shop
    setIsReloadData: Dispatch<SetStateAction<boolean>>
}

export default function UpdateGoogleMap(props: Props) {
    const [shopLocation, setShopLocation] = useState<number[] | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const shopLocationHandler = (location: google.maps.LatLng) => {
        setShopLocation([location.lat(), location.lng()])
    }

    const updateShopLocation = async () => {
        setIsLoading(true)
        if (shopLocation) {
            const updateShop = props.shop.copyWith(null, null, null, null, null, shopLocation, null, new Date())
            await updateShopData(updateShop)
            props.setIsReloadData(false)
            setIsLoading(false)
        }
    }

    return (
        <>
            <div className='flex flex-col'>
                <div>
                    <GoogleMapFeild setShopLocation={shopLocationHandler} shopLocation={props.shop.shopLocation} isDisplaySearchDestination={true} isDisplayRouteGuidance={false} prefecture="" />
                </div>
                <div className='flex justify-center my-8 h-12'>
                    <Button
                        variant='contained'
                        style={{ backgroundColor: '#00a6af', color: 'white', width: 200, }}
                        onClick={updateShopLocation}
                    >
                        <p className='text-lg' style={{ fontFamily: '筑紫A丸ゴシック' }}>場所を変更</p>
                    </Button>
                </div>
                <Dialog open={isLoading}>
                    <CircularProgress className='m-10' style={{ color: '#00a6af', }} />
                </Dialog>
            </div>
        </>
    )
}