import { Button, IconButton } from "@material-ui/core";
import CancelIcon from '@mui/icons-material/Cancel';

import { useContext, useEffect, useState } from "react"
import { useRouter } from "next/router";

import { AuthContext } from "../context/AuthContext";
import Favorite from "../entity/Favorites";
import { fetchExistsRequests } from "../service/request_service";
import { fetchFavorite } from "../service/favorites_service";
import { fetchShop } from "../service/shop_service";
import Header from "../components/common/header";
import Request from "../entity/Request";
import NavBar from "../components/common/nav_bar";
import Shop from "../entity/Shop"
import ShopDataField from "../components/shop_page/shop_data_field";
import ShopUpdateField from "../components/shop_page/shop_update_field";

export default function ShopPage() {
    const router = useRouter()

    const { currentUser } = useContext(AuthContext)

    const [shop, setShop] = useState<Shop>()
    const [favorite, setFavorite] = useState<Favorite | null>(null)
    const [requests, setRequests] = useState<Request[] | null>(null)
    const [alertMessage, setAlertMessage] = useState<string>('')
    const [isDisplayEditFeild, setIsDisyplayEditFeild] = useState(false)
    const [isReloadData, setIsReloadData] = useState(false)

    const [isOpenShopPage, setIsOpenShopPage] = useState(false)

    const query = router.query;
    const shopPageId = query.shopId as string;

    const fetchShopData = async () => {
        setShop(await fetchShop(shopPageId))
        setIsReloadData(true)
    }

    const fetchFavoriteData = async () => {
        if (currentUser && shop) {
            setFavorite(await fetchFavorite(currentUser.userId, shop.shopId))
        }
    }

    const fetchRequestsData = async () => {
        if (currentUser && shop) {
            setRequests(await fetchExistsRequests(shop.shopId))
        }
    }

    const openEditFeild = () => {
        if (currentUser && shop && (currentUser.userId == shop.createUserId)) {
            setIsDisyplayEditFeild(true)
        } else {
            setAlertMessage('??????????????????????????????????????????????????????????????????')
        }
    }

    const closeEditFeild = () => {
        setIsDisyplayEditFeild(false)
    }

    const closeAlertMessage = () => {
        setAlertMessage('')
    }

    useEffect(() => {
        fetchShopData()
        if (!isReloadData) {
            fetchShopData()
            fetchFavoriteData()
        }
        if (currentUser && !favorite) {
            fetchFavoriteData()
        }
        if (!requests) {
            fetchRequestsData()
        }
        console.log('requests', requests)
        setIsOpenShopPage(true)
    }, [isReloadData, query, currentUser!, requests]);

    return (
        <>
            <Header title='???????????????' />
            <div>{shop &&
                <>
                    <div className='sticky top-0 z-10'>
                        <NavBar />
                    </div>
                    {!isDisplayEditFeild ?
                        <div className='flex flex-col mt-28'>
                            <ShopDataField shop={shop} favorite={favorite} request={requests} isOpenShopPage={isOpenShopPage} setIsReloadData={setIsReloadData} />
                            <div className='my-4'>{(alertMessage != '') &&
                                <div>
                                    <p className='flex justify-center text-red-400'>{alertMessage}</p>
                                    <div className='flex justify-center my-4'>
                                        <IconButton onClick={closeAlertMessage} style={{ color: 'red', }}>
                                            <CancelIcon style={{ height: 40, width: 40, }} />
                                        </IconButton>
                                    </div>
                                </div>
                            }</div>
                            <div className='flex justify-center mb-28 h-20 md:ml-12'>
                                <Button
                                    variant='contained'
                                    style={{ backgroundColor: '#00a6af', color: 'white', }}
                                    onClick={openEditFeild}
                                >
                                    <p className='text-xl' style={{ fontFamily: '??????A???????????????' }}>??????????????????????????????</p>
                                </Button>
                            </div>
                        </div>
                        :
                        <div className='flex flex-col'>{currentUser &&
                            <div>
                                <div>
                                    <ShopUpdateField request={requests} shop={shop} shopId={shopPageId} setIsReloadData={setIsReloadData} />
                                </div>
                                <div className='flex justify-center mb-20 ml-4 z-0'>
                                    <IconButton onClick={closeEditFeild}>
                                        <CancelIcon style={{ height: 50, width: 50, color: '#00a6af', }} />
                                    </IconButton>
                                </div>
                            </div>
                        }</div>
                    }
                </>
            }</div>
        </>
    )
}
