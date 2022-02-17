import { Button, IconButton, TextField } from "@material-ui/core";
import CancelIcon from '@mui/icons-material/Cancel';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import SendIcon from '@mui/icons-material/Send';

import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

import { AuthContext } from "../../context/AuthContext";
import { addMessage, createRequestRoom, fetchExistsRequests, setLatestMassage } from "../../service/request_service";
import { createFavorites, deleteFavorites } from "../../service/favorites_service";
import Favorite from "../../entity/Favorites";
import GoogleMapFeild from "../../components/shop_page/shop_data_field/google_map_field";
import Request from "../../entity/Request";
import Message from "../../entity/Message";
import Shop from "../../entity/Shop";
import ShopImage from "./shop_data_field/shop_image";
import ShopNameField from "../../components/shop_page/shop_data_field/shop_name_field";
import ShopSummaryList from "../../components/shop_page/shop_data_field/shop_summary_list";
import UpdateFavoriteMemo from "./shop_update_field/update_favorite_memo";
import { updateUserData } from "../../service/user_service";

type Props = {
    shop: Shop
    favorite: Favorite | null
    isOpenShopPage: boolean
    setIsReloadData: Dispatch<SetStateAction<boolean>>
}

export default function ShopDataField(props: Props) {
    const router = useRouter()

    const { currentUser, reloadCurrentUserData } = useContext(AuthContext)

    const favoritesCountLimit = 20
    const [requests, setRequests] = useState<Request[] | null>(null)
    const [sendMessage, setSendMessage] = useState('')
    const [alertMessage, setAlertMessage] = useState<string>('')
    const [isSignInAlert, setIsSignInAlert] = useState(false)
    const [isMessageField, setIsMessageField] = useState(false)

    const fetchrequestsData = async () => {
        if (currentUser && props.shop) {
            setRequests(await fetchExistsRequests(props.shop.shopId))
        }
    }

    const registerFavoriteShop = async () => {
        if (props.shop && currentUser) {
            if (currentUser.favoritesCount <= favoritesCountLimit) {
                const favorite = Favorite.createFavorite(props.shop.shopId)
                await createFavorites(favorite, currentUser.userId)

                console.log('currentUser.favoritesCount', currentUser.favoritesCount)
                const updateData = currentUser.copyWith(null, null, currentUser.favoritesCount + 1)
                await updateUserData(updateData)
                await reloadCurrentUserData()

                props.setIsReloadData(false)
            } else {
                setAlertMessage('お気に入りの登録数が上限に達しています')
            }
        } else {
            setIsSignInAlert(true)
        }
    }

    const unRegisterFavoriteShop = async () => {
        if (props.shop && currentUser) {
            await deleteFavorites(currentUser.userId, props.shop.shopId)

            console.log('currentUser.favoritesCount', currentUser.favoritesCount)
            const updateData = currentUser.copyWith(null, null, currentUser.favoritesCount - 1)
            await updateUserData(updateData)
            await reloadCurrentUserData()

            props.setIsReloadData(false)
        }
    }

    const displayMessageField = () => {
        setIsMessageField(true)
    }

    const closeMessageField = () => {
        setIsMessageField(false)
    }

    const sendMessageHandler = (e: any) => {
        setSendMessage(e.target.value)
    }

    const sendMessageAndUpdateLatestMessage = async () => {
        if (currentUser && props.shop) {
            if (requests && (requests[0] != null)) {
                console.log('作成済み')
            } else {
                const request = Request.createRequest(props.shop.shopName, props.shop.shopId, props.shop.createUserId, '')
                await createRequestRoom(request)
            }
        }
        if (currentUser) {
            const message = Message.createMessage(sendMessage, '',)
            await addMessage(props.shop.shopId, message)
            await setLatestMassage(props.shop.shopId, sendMessage)
            setSendMessage('')
            setIsMessageField(false)
        }
    }

    const routerSignIn = () => {
        router.push('/send_email_link')
    }

    const routerRequestPage = () => {
        router.push('/request_page')
    }

    const closeAlertMessage = () => {
        setAlertMessage('')
    }

    useEffect(() => {
        if (!requests) {
            fetchrequestsData()
        }
        console.log('requests', requests)
    }, [currentUser, requests])

    return (
        <>{props.shop &&
            <div className='flex flex-col'>
                <div className='flex absolute right-8 top-36'>{(props.favorite && props.favorite.shopId != '') ?
                    <div >
                        <Button
                            variant='outlined'
                            style={{ backgroundColor: 'white', borderColor: '#ff4081', }}
                            onClick={unRegisterFavoriteShop}>
                            <p style={{ color: '#ff4081', fontFamily: '筑紫A丸ゴシック' }}>お気に入り♡</p>
                        </Button>
                    </div>
                    :
                    <div>{(alertMessage != '') ?
                        <div className='bg-white' style={{ borderWidth: (alertMessage != '') ? 2 : 0, borderColor: '#00a6af', }}>
                            <div>
                                <p className='p-4 text-red-500'>{alertMessage}</p>
                            </div>
                            <div className='flex justify-center my-4'>
                                <IconButton onClick={closeAlertMessage} style={{ color: 'red', }}>
                                    <CancelIcon style={{ height: 40, width: 40, }} />
                                </IconButton>
                            </div>
                        </div>
                        :
                        <Button
                            variant='outlined'
                            style={{ backgroundColor: 'white', borderColor: '#00a6af', }}
                            onClick={registerFavoriteShop}>
                            <p className='text-base' style={{ color: '#00a6af', fontFamily: '筑紫A丸ゴシック' }}>お気に入り登録</p>
                        </Button>
                    }</div>
                }</div>
                <div className='flex absolute right-8 top-52'>{(currentUser && currentUser.userId == props.shop.createUserId) ?
                    <Button
                        variant='outlined'
                        style={{ borderWidth: 1, borderColor: '#00a6af', color: '#00a6af', }}
                        onClick={routerRequestPage}
                    >
                        <p style={{ color: '#00a6af', fontFamily: '筑紫A丸ゴシック' }}>メッセージを確認する</p>
                    </Button>
                    :
                    <Button
                        variant='outlined'
                        style={{ borderWidth: 1, borderColor: '#00a6af', color: '#00a6af', }}
                        onClick={displayMessageField}>
                        <p className='mx-2' style={{ color: '#00a6af', fontFamily: '筑紫A丸ゴシック' }}>登録者にメッセージを送る</p>
                        <ForwardToInboxIcon />
                    </Button>
                }</div>
                <div className='flex fixed items-center left-8 top-4 rounded-md flex-col bg-white z-20' style={{ borderWidth: isMessageField ? 2 : 0, borderColor: '#006978', width: isMessageField ? '60%' : 0, minWidth: 350, maxWidth: 700, }}>{isMessageField &&
                    <>
                        <TextField
                            style={{ height: 'auto', width: '60%', minWidth: 250, maxWidth: 700, marginTop: 20, }}
                            multiline={true}
                            rows={3}
                            variant="outlined"
                            label="メッセージ"
                            value={sendMessage}
                            onChange={sendMessageHandler}
                        />
                        <div className='flex flex-row my-2'>
                            <Button onClick={closeMessageField} style={{ height: '70%', color: '#00a6af', marginLeft: 20, }}>
                                <p className='text-lg' style={{ color: '#00a6af', fontFamily: '筑紫A丸ゴシック' }}>キャンセル</p>
                            </Button>
                            <Button onClick={sendMessageAndUpdateLatestMessage} style={{ height: '70%', color: '#00a6af', marginLeft: 20, }}>
                                <p className='text-lg mx-2' style={{ color: '#00a6af', fontFamily: '筑紫A丸ゴシック' }}>送信</p>
                                <SendIcon />
                            </Button>
                        </div>
                    </>
                }</div>
                {(props.favorite && props.favorite.shopId != '') ?
                    //お気に入り登録してる場合
                    <div className='flex justify-center flex-col md:mt-12'>
                        <div className='flex justify-center flex-col md:flex-row'>
                            <div className='mt-40 md:mx-8'>
                                <div className='flex justify-center items-center my-12 md:my-4 text-2xl lg:text-3xl'>
                                    <ShopNameField shopName={props.shop.shopName} />
                                </div>
                                <div className='flex justify-center my-4'>
                                    <ShopImage imageUrl={props.shop.shopImageUrl} size={'auto'} />
                                </div>
                            </div>
                            <div className='flex justify-center flex-col mx-8 my-10 md:pt-8' style={{ alignItems: 'center', }}>
                                <UpdateFavoriteMemo favorite={props.favorite} setIsReloadData={props.setIsReloadData} />
                            </div>
                        </div>
                        <div className='flex justify-center md:ml-8' style={{ alignItems: 'center', }}>
                            <ShopSummaryList shopSummary={props.shop.shopSummary} />
                        </div>
                    </div>
                    :
                    //お気に入り登録してない場合
                    <div className='flex justify-center flex-col md:flex-row'>
                        <div className='mt-40 md:mx-8'>
                            <div className='flex justify-center items-center my-8 md:my-4 text-2xl lg:text-3xl'>
                                <ShopNameField shopName={props.shop.shopName} />
                            </div>
                            <div className='flex justify-center my-4'>
                                <ShopImage imageUrl={props.shop.shopImageUrl} size={'auto'} />
                            </div>
                        </div>
                        <div className='flex justify-center pt-8 md:pt-24 md:mx-4' style={{ alignItems: 'center', }}>
                            <ShopSummaryList shopSummary={props.shop.shopSummary} />
                        </div>
                    </div>
                }
                <div className='flex justify-center my-20 ml-4 md:ml-12'>
                    <GoogleMapFeild setShopLocation={null} shopLocation={props.shop.shopLocation} isDisplayRouteGuidance={props.isOpenShopPage} isDisplaySearchDestination={false} prefecture="" />
                </div>
                <div className=''>{!props.shop.shopLocation &&
                    <p className='flex justify-center text-xl ml-4 md:ml-10 my-2 mb-20' style={{ fontFamily: 'Hannotate SC' }}>googleMapが設定されていません</p>
                }</div>
                <div className='fixed top-0 right-0 shadow-2xl m-4 z-30' style={{ borderWidth: isSignInAlert ? 2 : 0, borderColor: '#00a6af', }}>{isSignInAlert &&
                    <div className='flex flex-col justify-center items-center px-8 pt-8 bg-white'>
                        <p style={{ fontFamily: '筑紫A丸ゴシック' }}>このページにアクセスするには</p>
                        <p style={{ fontFamily: '筑紫A丸ゴシック' }}>ログインまたは新規登録が必要です</p>
                        <div className='my-3'>
                            <Button
                                variant='contained'
                                onClick={routerSignIn}
                                style={{ color: 'white', backgroundColor: '#00a6af', }}
                            >
                                <p style={{ fontFamily: '筑紫A丸ゴシック' }}>ログイン、新規登録する</p>
                            </Button>
                        </div>
                        <IconButton onClick={closeAlertMessage} style={{ color: 'red', }}>
                            <CancelIcon style={{ height: 30, width: 30, }} />
                        </IconButton>
                    </div>
                }</div>
            </div>
        }</>
    )
}