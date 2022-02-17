import { Button, IconButton } from "@material-ui/core";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CancelIcon from '@mui/icons-material/Cancel';

import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { db } from "../service/firebase_service";
import { fetchLimitShops, fetchNextPagePrefectureShopsData, fetchNextPageShopsData, fetchPrefectureShops, fetchPreviousPagePrefectureShopsData, fetchPreviousPageShopsData } from "../service/pagination_service";
import Header from "../components/common/header";
import NavBar from "../components/common/nav_bar";
import prefectureData from "../utility/prefecture_data.json"
import SelectPrefectureFeild from "../components/shop_page/select_prefecture_field";
import Shop from "../entity/Shop";
import ShopListTile from "../components/shop_list_page/shop_list_tile";

export default function ShopListPage() {
    const router = useRouter()

    const limitNumber: number = 10;

    const [shops, setShops] = useState<Shop[]>([]);
    const [firstRecord, setFirstRecord] = useState<any>(null)
    const [lastRecord, setLastRecord] = useState<any>(null)
    const [currentFirstRecord, setCurrentFirstRecord] = useState<any>(null)
    const [currentLastRecord, setCurrentLastRecord] = useState<any>(null)
    const [hasPreviousPage, sethasPreviousPage] = useState<boolean>(false)
    const [hasNextPage, sethasNextPage] = useState<boolean>(false)
    const [pageNumber, setPageNumber] = useState<number>(1)
    const [prefecture, setPrefecture] = useState<string>('')
    const [alertMassge, setAlertMessage] = useState<string>('')
    const [isLoading, setIsLoading] = useState(false)

    async function fetchShopsData() {
        if (prefecture == '') {
            setShops(await fetchLimitShops(limitNumber))
            try {
                await db.collection("shops").orderBy('shopName', 'asc').limitToLast(1)
                    .get()
                    .then(function (querySnapshot) {
                        querySnapshot.forEach(function (doc) {
                            setLastRecord(doc.data())
                        });
                    })
            } catch (e) {
                console.log('setLastRecord Error', e)
            }
            try {
                await db.collection("shops").orderBy('shopName', 'asc').limit(1)
                    .get()
                    .then(function (querySnapshot) {
                        querySnapshot.forEach(function (doc) {
                            setFirstRecord(doc.data())
                        });
                    })
            } catch (e) {
                console.log('setFirstRecord Error', e)
            }
        } else {
            setShops(await fetchPrefectureShops(limitNumber, prefecture))
            setIsLoading(true)
            try {
                await db.collection("shops").where('shopPrefecture', '==', prefecture).orderBy('shopName', 'asc').limitToLast(1)
                    .get()
                    .then(function (querySnapshot) {
                        querySnapshot.forEach(function (doc) {
                            setLastRecord(doc.data())
                        });
                    })
            } catch (e) {
                console.log('setLastRecord Error', e)
            }
            try {
                await db.collection("shops").where('shopPrefecture', '==', prefecture).orderBy('shopName', 'asc').limit(1)
                    .get()
                    .then(function (querySnapshot) {
                        querySnapshot.forEach(function (doc) {
                            setFirstRecord(doc.data())
                        });
                    })
            } catch (e) {
                console.log('setFirstRecord Error', e)
            }
        }
    }

    const queryFetchShopsDataFromStartToEnd = async () => {
        if (lastRecord && shops) {
            if (shops.length > 0) {
                sethasNextPage(true)
                shops.forEach((shop) => {
                    //console.log("useEffect:list.item", item.docId)
                    if (shop.shopId === lastRecord.shopId) {
                        sethasNextPage(false)
                    }
                })
                //最後のレコードを取得する
                setCurrentLastRecord(shops.slice(-1)[0]);
            }
        }

        if (firstRecord && shops) {
            if (shops.length > 0) {
                sethasPreviousPage(true)
                shops.forEach((shop) => {
                    if (shop.shopId === firstRecord.shopId) {
                        sethasPreviousPage(false)
                    }
                })
            }
            //最初のレコードを取得する
            setCurrentFirstRecord(shops[0]);
        }
    }

    const routeNextPage = async () => {
        if (currentLastRecord) {
            if (prefecture == '') {
                setShops(await fetchNextPageShopsData(currentLastRecord, limitNumber))
            } else {
                setShops(await fetchNextPagePrefectureShopsData(currentLastRecord, limitNumber, prefecture))
            }
            setCurrentFirstRecord(null)
            setCurrentLastRecord(null)
            setPageNumber(pageNumber + 1)
        } else {
            console.log('routeNextPage currentLastRecord null')
        }
    }

    const routePreviousPage = async () => {
        if (currentFirstRecord) {
            let shops: Shop[]
            if (prefecture == '') {
                shops = await fetchPreviousPageShopsData(currentFirstRecord, limitNumber)
            } else {
                shops = await fetchPreviousPagePrefectureShopsData(currentFirstRecord, limitNumber, prefecture)
            }
            shops!.sort(function (a, b) {
                if (a.shopName < b.shopName) return -1;
                if (a.shopName > b.shopName) return 1;
                return 0;
            });
            setShops(shops!)
            setCurrentFirstRecord(null)
            setCurrentLastRecord(null)
            setPageNumber(pageNumber - 1)
        } else {
            console.log('route currentFirstRecord null')
        }
    }

    const shopPrefectureHandler = (e: any, value: string | null) => {
        if (value) {
            setPrefecture(value)
            console.log('setPrefecture', value)
        }
    }

    const searchPrefectureShop = () => {
        setPageNumber(1)
        setFirstRecord(null)
        setLastRecord(null)
        setIsLoading(false)
        setAlertMessage('')
    }

    const openShopPage = (shopId: string) => {
        console.log('shopId: ', shopId)
        router.push({
            pathname: '/shop_page',
            query: { shopId: shopId },
        });
    }

    const closeAlertMessage = () => {
        setAlertMessage('')
    }

    useEffect(() => {
        if (!firstRecord && !lastRecord && !isLoading) {
            fetchShopsData()
        }
        if (isLoading && shops[0] == null) {
            setShops([])
            console.log('alert')
            setAlertMessage('この都道府県の店のデータがありません')
        }
        queryFetchShopsDataFromStartToEnd()
    }, [firstRecord, lastRecord, currentFirstRecord, currentLastRecord, isLoading]);

    return (
        <>
            <Header title='一覧ページ' />
            <div>
                <NavBar />
            </div>
            <div className='flex justify-center items-center mt-40'>
                <div className='w-28 mx-8 md:w-44 md:mx-12'>
                    <SelectPrefectureFeild
                        id='prefecture'
                        name='都道府県'
                        value={prefecture}
                        options={prefectureData.prefecturesAndId}
                        onChange={(e, value) => shopPrefectureHandler(e, value)}
                    />
                </div>
                <Button
                    variant='contained'
                    style={{ backgroundColor: '#00a6af', color: 'white', height: '70%', }}
                    onClick={searchPrefectureShop}
                >
                    検索
                </Button>
            </div>
            {alertMassge ?
                <div className='flex flex-row justify-center ml-4 items-center'>
                    <p className='text-base text-red-500'>{alertMassge}</p>
                    <IconButton onClick={closeAlertMessage} style={{ color: 'red', }}>
                        <CancelIcon style={{ height: 30, width: 30, }} />
                    </IconButton>
                </div>
                :
                <>
                    <div className='flex flex-col pt-12 md:pt-24' style={{ alignItems: 'center', }}>{shops.map((shop) =>
                        <div key={shop.shopId} className='z-0 px-10 my-10 md:my-10'>
                            <div>
                                <Button
                                    onClick={() => openShopPage(shop.shopId)}
                                >
                                    <div>
                                        <ShopListTile
                                            imageUrl={shop.shopImageUrl}
                                            shopName={shop.shopName}
                                            color='#4bacb8'
                                        />
                                    </div>
                                </Button>
                            </div>
                        </div>
                    )}</div>
                    <div className='flex felx-row justify-center items-center'>
                        <div className='my-8'>{hasPreviousPage &&
                            <IconButton onClick={routePreviousPage}>
                                <ArrowBackIosNewIcon style={{ color: '#00a6af', width: 30, height: 30, }} />
                            </IconButton>
                        }</div>
                        <p className='flex justify-center items-center rounded h-10 w-10 text-2xl' style={{ borderWidth: 1, borderColor: '#00a6af', color: '#00a6af', fontFamily: '筑紫A丸ゴシック' }}>{pageNumber}</p>
                        <div className='my-8 items-center'>{hasNextPage &&
                            <IconButton onClick={routeNextPage}>
                                <ArrowForwardIosIcon style={{ color: '#00a6af', width: 30, height: 30, }} />
                            </IconButton>
                        }</div>
                    </div>
                </>
            }
        </>
    )
} 