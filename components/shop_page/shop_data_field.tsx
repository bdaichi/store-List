import { Button, IconButton, TextField } from "@material-ui/core";
import CancelIcon from '@mui/icons-material/Cancel';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import SendIcon from '@mui/icons-material/Send';

import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

import { AuthContext } from "../../context/AuthContext";
import { addMessage, createRequestRoom, setLatestMassage } from "../../service/request_service";
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
    request: Request[] | null
    isOpenShopPage: boolean
    setIsReloadData: Dispatch<SetStateAction<boolean>>
}

export default function ShopDataField(props: Props) {
    const router = useRouter()

    const { currentUser, reloadCurrentUserData } = useContext(AuthContext)

    const favoritesCountLimit = 20
    const [sendMessage, setSendMessage] = useState('')
    const [alertMessage, setAlertMessage] = useState<string>('')
    const [isSignInAlert, setIsSignInAlert] = useState(false)
    const [isMessageField, setIsMessageField] = useState(false)

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
                setAlertMessage('?????????????????????????????????????????????????????????')
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

    const displaySendMessageField = () => {
        setIsMessageField(true)
    }

    const closeSendMessageField = () => {
        setIsMessageField(false)
    }

    const sendMessageHandler = (e: any) => {
        setSendMessage(e.target.value)
    }

    const sendMessageAndUpdateLatestMessage = async () => {
        if (props.shop) {
            if (props.request && (props.request[0] != null)) {
                console.log('????????????')
            } else {
                const request = Request.createRequest(props.shop.shopName, props.shop.shopId, props.shop.createUserId, '')
                await createRequestRoom(request)
            }
        }
        const message = Message.createMessage(sendMessage, '',)
        await addMessage(props.shop.shopId, message)
        await setLatestMassage(props.shop.shopId, sendMessage)
        setSendMessage('')
        setIsMessageField(false)
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

    const closeSignInAlert = () => {
        setIsSignInAlert(false)
    }

    return (
        <>{props.shop &&
            <div className='flex flex-col'>
                <div className='flex absolute right-8 top-36'>{(props.favorite && props.favorite.shopId != '') ?
                    <div >
                        <Button
                            variant='outlined'
                            style={{ backgroundColor: 'white', borderColor: '#ff4081', }}
                            onClick={unRegisterFavoriteShop}>
                            <p style={{ color: '#ff4081', fontFamily: '??????A???????????????' }}>??????????????????</p>
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
                            <p className='text-base' style={{ color: '#00a6af', fontFamily: '??????A???????????????' }}>?????????????????????</p>
                        </Button>
                    }</div>
                }</div>
                <div className='flex absolute right-8 top-52'>{(currentUser && currentUser.userId == props.shop.createUserId) ?
                    <Button
                        variant='outlined'
                        style={{ borderWidth: 1, borderColor: '#00a6af', color: '#00a6af', }}
                        onClick={routerRequestPage}
                    >
                        <p style={{ color: '#00a6af', fontFamily: '??????A???????????????' }}>??????????????????????????????</p>
                    </Button>
                    :
                    <Button
                        variant='outlined'
                        style={{ borderWidth: 1, borderColor: '#00a6af', color: '#00a6af', }}
                        onClick={displaySendMessageField}>
                        <p className='mx-2' style={{ color: '#00a6af', fontFamily: '??????A???????????????' }}>????????????????????????????????????</p>
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
                            label="???????????????"
                            value={sendMessage}
                            onChange={sendMessageHandler}
                        />
                        <div className='flex flex-row my-2'>
                            <Button onClick={closeSendMessageField} style={{ height: '70%', color: '#00a6af', marginLeft: 20, }}>
                                <p className='text-lg' style={{ color: '#00a6af', fontFamily: '??????A???????????????' }}>???????????????</p>
                            </Button>
                            <Button onClick={sendMessageAndUpdateLatestMessage} style={{ height: '70%', color: '#00a6af', marginLeft: 20, }}>
                                <p className='text-lg mx-2' style={{ color: '#00a6af', fontFamily: '??????A???????????????' }}>??????</p>
                                <SendIcon />
                            </Button>
                        </div>
                    </>
                }</div>
                {(props.favorite && props.favorite.shopId != '') ?
                    //????????????????????????????????????
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
                            <div className='flex justify-center flex-col mx-8 my-10 md:pt-24' style={{ alignItems: 'center', }}>
                                <UpdateFavoriteMemo favorite={props.favorite} setIsReloadData={props.setIsReloadData} />
                            </div>
                        </div>
                        <div className='flex justify-center md:ml-8' style={{ alignItems: 'center', }}>
                            <ShopSummaryList shopSummary={props.shop.shopSummary} />
                        </div>
                    </div>
                    :
                    //???????????????????????????????????????
                    <div className='flex justify-center flex-col md:flex-row'>
                        <div className='mt-40 md:mx-8'>
                            <div className='flex justify-center items-center my-8 md:my-4 text-2xl lg:text-3xl'>
                                <ShopNameField shopName={props.shop.shopName} />
                            </div>
                            <div className='flex justify-center my-4'>
                                <ShopImage imageUrl={props.shop.shopImageUrl} size={'auto'} />
                            </div>
                        </div>
                        <div className='flex justify-center pt-8 md:pt-40 md:mx-4' style={{ alignItems: 'center', }}>
                            <ShopSummaryList shopSummary={props.shop.shopSummary} />
                        </div>
                    </div>
                }
                <div className='flex justify-center my-20 ml-4 md:ml-12'>
                    <GoogleMapFeild setShopLocation={null} shopLocation={props.shop.shopLocation} isDisplayRouteGuidance={props.isOpenShopPage} isDisplaySearchDestination={false} prefecture="" />
                </div>
                <div className=''>{!props.shop.shopLocation &&
                    <p className='flex justify-center text-xl ml-4 md:ml-10 my-2 mb-20' style={{ fontFamily: 'Hannotate SC' }}>googleMap??????????????????????????????</p>
                }</div>
                <div className='fixed top-0 right-0 shadow-2xl m-4 z-30' style={{ borderWidth: isSignInAlert ? 2 : 0, borderColor: '#00a6af', }}>{isSignInAlert &&
                    <div className='flex flex-col justify-center items-center px-8 pt-8 bg-white'>
                        <p style={{ fontFamily: '??????A???????????????' }}>??????????????????????????????????????????</p>
                        <p style={{ fontFamily: '??????A???????????????' }}>????????????????????????????????????????????????</p>
                        <div className='my-3'>
                            <Button
                                variant='contained'
                                onClick={routerSignIn}
                                style={{ color: 'white', backgroundColor: '#00a6af', }}
                            >
                                <p style={{ fontFamily: '??????A???????????????' }}>?????????????????????????????????</p>
                            </Button>
                        </div>
                        <IconButton onClick={closeSignInAlert} style={{ color: 'red', }}>
                            <CancelIcon style={{ height: 30, width: 30, }} />
                        </IconButton>
                    </div>
                }</div>
            </div>
        }</>
    )
}
