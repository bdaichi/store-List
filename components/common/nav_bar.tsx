import * as React from 'react';
import { Button, IconButton } from '@material-ui/core';
import CancelIcon from '@mui/icons-material/Cancel';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';

import CssBaseline from '@mui/material/CssBaseline';

import { useContext, useState } from 'react';
import { useRouter } from 'next/router';

import { AuthContext } from '../../context/AuthContext';
import { auth } from '../../service/firebase_service';

export default function NavBar() {
    const router = useRouter()

    const { currentUser } = useContext(AuthContext)
    const [isSignInAlert, setIsSignInAlert] = useState(false)

    const routerInfoPage = () => {
        router.push('/info_page')
    }

    const routerMyPage = () => {
        router.push('/my_page')
    }

    const routerShopListPage = () => {
        router.push('/shop_list_page')
    }

    const routerShopAddPage = () => {
        if (currentUser) {
            router.push('/shop_add_page')
        } else {
            setIsSignInAlert(true)
        }
    }

    const routerSignIn = () => {
        router.push('/send_email_link')
    }

    const logOut = async () => {
        await auth.signOut();
        router.push('/sign_in')
    }

    const closeAlertMessage = () => {
        setIsSignInAlert(false)
    }

    return (
        <>
            <div className='flex flex-row fixed top-4 z-10 m-4 mx-6'>
                <CssBaseline />
                <div>
                    <Button
                        onClick={routerInfoPage}
                    >
                        <p className='text-2xl normal-case md:text-3xl' style={{ fontFamily: "fantasy", color: '#00a6af', }} >
                            StoreList
                        </p>
                    </Button>
                </div>
                <div className='fixed top-0 right-28 my-3 md:top-4 md:right-96 md:mx-4'>
                    <Button
                        onClick={routerMyPage}>
                        <p className='text-sm rounded-md bg-white opacity-75 p-2 md:p-3' style={{ fontFamily: 'Arial unicode ms', color: '#00a6af', }}>
                            マイページ
                        </p>
                    </Button>
                </div>
                <div className='fixed top-0 right-4 my-3 md:top-4 md:right-72'>
                    <Button
                        onClick={routerShopListPage}>
                        <p className='text-sm normal-case rounded-md bg-white opacity-75 p-2 md:p-3' style={{ fontFamily: 'Arial unicode ms', color: '#00a6af', }}>
                            一覧ページ
                        </p>
                    </Button>
                </div>
                <div className='fixed top-10 right-36 my-3 md:top-4 md:right-44'>
                    <Button
                        onClick={routerShopAddPage}>
                        <p className='text-sm rounded-md bg-white opacity-75 p-2 md:p-3' style={{ fontFamily: 'Arial unicode ms', color: '#00a6af', }}>
                            追加ページ
                        </p>
                    </Button>
                </div>
                <div className='fixed top-11 right-4 my-3 md:top-6 md:right-10'>{currentUser ?
                    <div className='text-sm normal-case mt-0.5 mr-4 rounded-md bg-white opacity-75'>
                        <Button
                            onClick={logOut}>
                            <p className='text-sm normal-case rounded-md p-0.5 bg-white opacity-75' style={{ fontFamily: 'Arial unicode ms', color: '#ec407a', }}>
                                ログアウト
                            </p>
                            <LogoutIcon style={{ color: '#ec407a', width: 20, height: 20 }} />
                        </Button>
                    </div>
                    :
                    <div className='text-sm normal-case mr-8 mt-0.5 rounded-md bg-white opacity-75'>
                        <Button
                            onClick={routerSignIn}>
                            <p style={{ fontFamily: 'Arial unicode ms', color: '#00a6af', }}>
                                ログイン
                            </p>
                            <LoginIcon style={{ color: '#00a6af', width: 20, height: 20 }} />
                        </Button>
                    </div>
                }</div>
            </div>
            <div className='fixed top-8 right-8 shadow-2xl m-4 z-30' style={{ borderWidth: isSignInAlert ? 2 : 0, borderColor: '#00a6af', }}>{isSignInAlert &&
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
        </>
    )
}