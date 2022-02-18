import { useContext, useEffect, useState } from "react";
import { useRouter } from 'next/router';

import { IconButton, TextField } from "@material-ui/core";
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import CancelIcon from '@mui/icons-material/Cancel';

import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';

import { AuthContext } from "../context/AuthContext";
import { createShop, defaultShopName, searchShop, } from '../service/shop_service';
import firebase from "firebase";
import GoogleMapFeild from "../components/shop_page/shop_data_field/google_map_field";
import Header from "../components/common/header";
import NavBar from "../components/common/nav_bar";
import prefectureData from "../utility/prefecture_data.json"
import SelectPrefectureFeild from "../components/shop_page/select_prefecture_field";
import Shop from "../entity/Shop"
import ShopImage from "../components/shop_page/shop_data_field/shop_image";
import ShopImageUpdateField from "../components/common/shop_image_update_field";
import { uploadShopImageAndGetUrl } from "../service/cloud_image_service";

export default function ShopAddPage() {
    const router = useRouter()

    const { currentUser } = useContext(AuthContext)

    const shop = Shop.createShop('', '', '')
    const [shops, setShops] = useState<Shop[] | null>(null)
    const [croppedShopImage, setCroppedShopImage] = useState<Blob>()
    const [prefecture, setPrefecture] = useState<string>('')
    const [shopName, setShopName] = useState(defaultShopName)
    const [shopSummary, setShopSummary] = useState('')
    const [shopImageUrl, setShopImageUrl] = useState('')
    const [shopLocation, setShopLocation] = useState<number[] | null>(null)
    const [isOpenShopAddPage, setIsOpenShopAddPage] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [isReload, setIsReload] = useState<boolean>(true)
    const [isLoading, setIsLoading] = useState(false)

    const searchShopData = async () => {
        if (shopLocation) {
            const geoLogation: firebase.firestore.GeoPoint = new firebase.firestore.GeoPoint(shopLocation[0], shopLocation[1])
            setShops(await searchShop(geoLogation))
            setIsReload(false)
        }
    }

    const AlertMessage = async () => {
        if (shops && shopLocation && (shops[0] != null)) {
            await setAlertMessage('すでに登録されています')
            setIsLoading(false)
        } else {
            setAlertMessage('')
            setIsLoading(false)
        }
    }

    const closeAlertMessage = () => {
        setAlertMessage('')
    }

    const shopNameHandler = (e: any) => {
        setShopName(e.target.value)
    }

    const shopSummaryHandler = (e: any) => {
        setShopSummary(e.target.value)
    }

    const shopPrefectureHandler = (e: any, value: string | null) => {
        if (value) {
            setPrefecture(value)
            console.log('setPrefecture', value)
        }
    }

    const shopLocationHandler = (location: google.maps.LatLng) => {
        setShopLocation([location.lat(), location.lng()])
        setIsReload(true)
        setIsLoading(true)
    }

    const addShop = async () => {
        if (currentUser) {
            if (shopName && shopSummary && prefecture) {
                const newShop = shop.copyWith(null, currentUser.userId, shopName, shopSummary, shopImageUrl, shopLocation, prefecture, new Date())
                await createShop(newShop);
                router.push('/shop_list_page')
            } else {
                setAlertMessage('店名、概要、都道府県は必須事項になります')
            }
        }
    }

    const setShopImage = async () => {
        if (croppedShopImage && currentUser) {
            try {
                setShopImageUrl(await uploadShopImageAndGetUrl(shop.shopId, croppedShopImage))
            } catch (e) {
                console.log('shop_add_page addShop Error: ', e)
            }
        }
    }

    useEffect(() => {
        if (!shops) {
            searchShopData()
        }
        if (isReload) {
            searchShopData()
        }
        if (shops && !isReload) {
            AlertMessage()
        }
        console.log(shops)
        setIsOpenShopAddPage(true)
    }, [shopLocation, isReload, shops]);

    return (
        <>
            <Header title='登録ページ' />
            <div className='sticky top-0 z-10'>
                <NavBar />
            </div>
            <div className='flex justify-center'>
                <div className='my-12'>
                    <div className='flex justify-center mt-28'>
                        <ShopImage
                            imageUrl={shopImageUrl}
                            size={300}
                        />
                    </div>
                    <div className='flex justify-center my-8'>
                        <ShopImageUpdateField setCroppedShopImage={setCroppedShopImage} onClickFunction={setShopImage} />
                    </div>
                    <div className='flex justify-center my-12'>
                        <TextField
                            style={{ height: 'auto', width: 'auto', }}
                            multiline={true}
                            rows={2}
                            variant="outlined"
                            label="店名"
                            onChange={shopNameHandler}
                        />
                    </div>
                    <div className='flex justify-center my-8'>
                        <TextField
                            style={{ height: 'auto', width: 'auto', }}
                            multiline={true}
                            rows={3}
                            variant="outlined"
                            label="概要"
                            onChange={shopSummaryHandler}
                        />
                    </div>
                    <div className='flex justify-center my-12 mx-32'>
                        <SelectPrefectureFeild
                            id='prefecture'
                            name='都道府県'
                            value={prefecture}
                            options={prefectureData.prefecturesAndId}
                            onChange={(e, value) => shopPrefectureHandler(e, value)}
                        />
                    </div>
                    <div className='ml-4'>
                        <GoogleMapFeild setShopLocation={shopLocationHandler} shopLocation={null} isDisplaySearchDestination={isOpenShopAddPage} isDisplayRouteGuidance={false} prefecture={prefecture} />
                    </div>
                    <div>{isLoading &&
                        <Dialog open={isLoading}>
                            <CircularProgress className='m-10' style={{ color: '#00a6af', }} />
                        </Dialog>
                    }</div>
                    <div className='flex flex-col justify-center my-12 ml-4'>
                        <div>{alertMessage &&
                            <div className='flex flex-row justify-center ml-4 items-center'>
                                <p className='text-xl text-red-500'>{alertMessage}</p>
                                <IconButton onClick={closeAlertMessage} style={{ color: 'red', }}>
                                    <CancelIcon style={{ height: 30, width: 30, }} />
                                </IconButton>
                            </div>
                        }</div>
                        <IconButton onClick={addShop} >
                            <div className='text-2xl mx-3' style={{ color: '#00a6af', fontFamily: '筑紫A丸ゴシック' }}>店を登録</div>
                            <AddBusinessIcon style={{ height: 40, width: 40, color: '#00a6af', }} />
                        </IconButton>
                    </div>
                </div>
            </div>
        </>
    )
}