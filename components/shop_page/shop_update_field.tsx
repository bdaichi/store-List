import { Dispatch, SetStateAction, useContext, useState } from "react";
import { useRouter } from "next/router";

import { Button, IconButton } from "@material-ui/core";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import { AuthContext } from "../../context/AuthContext";
import { deleteShop, updateShopData } from "../../service/shop_service";
import Request from "../../entity/Request";
import Shop from "../../entity/Shop";
import ShopImage from "../../components/shop_page/shop_data_field/shop_image";
import ShopImageUpdateField from "../../components/common/shop_image_update_field";
import UpdateGoogleMap from "../../components/shop_page/shop_update_field/update_google_map";
import UpdateShopNameFeild from "../../components/shop_page/shop_update_field/update_shop_name_feild";
import UpdateShopSummaryListFeild from "../../components/shop_page/shop_update_field/update_shop_summary_list_feild";
import { uploadShopImageAndGetUrl } from "../../service/cloud_image_service";
import { deleteRequest } from "../../service/request_service";
import { deleteFavorites } from "../../service/favorites_service";
import { updateUserData } from "../../service/user_service";

type Props = {
    request: Request[]
    shop: Shop
    shopId: string
    setIsReloadData: Dispatch<SetStateAction<boolean>>
}

export default function ShopUpdateField(props: Props) {
    const router = useRouter()
    const { currentUser } = useContext(AuthContext)

    const [croppedShopImage, setCroppedShopImage] = useState<any>()
    const [isConfirmation, setIsConfirmation] = useState(false)

    const updateShopImage = async () => {
        if (props.shop && currentUser && props.shopId && croppedShopImage) {
            const url = await uploadShopImageAndGetUrl(props.shopId, croppedShopImage)

            const updateShop = props.shop.copyWith(null, currentUser.userId, null, null, url, null, null, new Date(),)
            await updateShopData(updateShop)
            props.setIsReloadData(false)
        }
    }

    const deleteShopData = async () => {
        if (props.shop && currentUser) {
            await deleteShop(props.shop.shopId)
            await deleteRequest(props.shop.shopId)
            await deleteFavorites(currentUser.userId, props.shop.shopId)
            const updateData = currentUser.copyWith(null, null, currentUser.favoritesCount - 1)
            await updateUserData(updateData)
            setIsConfirmation(false)
            router.push('/shop_list_page')
        }

    }

    const displayConfirmation = () => {
        setIsConfirmation(true)
    }

    const hideConfirmation = () => {
        setIsConfirmation(false)
    }

    return (
        <>
            <div className='flex justify-center my-4 mt-24'>
                <ShopImage imageUrl={props.shop.shopImageUrl} size={'auto'} />
            </div>
            <div className='flex justify-center'>
                <ShopImageUpdateField setCroppedShopImage={setCroppedShopImage} onClickFunction={updateShopImage} />
            </div>
            <div className='flex justify-center my-8 '>
                <UpdateShopNameFeild request={props.request} shop={props.shop} setIsReloadData={props.setIsReloadData} />
            </div>
            <div className='flex justify-center my-8'>
                <UpdateShopSummaryListFeild shop={props.shop} setIsReloadData={props.setIsReloadData} />
            </div>
            <div className='flex justify-center my-12 ml-4 md:ml-10'>
                <UpdateGoogleMap shop={props.shop} setIsReloadData={props.setIsReloadData} />
            </div>
            <div className='flex justify-center mb-20 ml-4'>
                <IconButton onClick={displayConfirmation} >
                    <p className='text-red-400 z-0 text-base'>お店のデータを削除する</p>
                    <DeleteOutlineIcon style={{ height: 40, width: 40, color: '#00a6af', }} />
                </IconButton>
                <div className='fixed flex bottom-0 shadow-2xl bg-white z-40 mb-20' style={{ borderWidth: isConfirmation ? 2 : 0, borderColor: '#00a6af', }}>
                    {isConfirmation &&
                        <div className='flex flex-col m-10' >
                            <p className='my-4' style={{ color: '#00a6af', }}>本当に削除しますか</p>
                            <div>
                                <Button onClick={deleteShopData} style={{ color: '#00a6af', }}>
                                    はい
                                </Button>
                            </div>
                            <div>
                                <Button onClick={hideConfirmation} style={{ color: '#00a6af', }}>
                                    いいえ
                                </Button>
                            </div>
                        </div>
                    }</div>
            </div>
        </>
    )
}