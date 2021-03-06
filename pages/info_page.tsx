import { Button, IconButton } from "@material-ui/core";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import MenuIcon from '@material-ui/icons/Menu';

import { useRouter } from "next/router";
import { useState } from "react";

import Header from "../components/common/header";
import NavBar from "../components/common/nav_bar";

export default function InfoPage() {
    const router = useRouter()

    const [isOpenNavBar, setIsOpenNavBar] = useState(false)

    const routerExplanationPage = () => {
        router.push('/explanation_page')
    }

    const openNavBar = () => {
        setIsOpenNavBar(true)
    }

    const closeNavBar = () => {
        setIsOpenNavBar(false)
    }


    return (
        <>
            <Header title='インフォメーション' />
            <div className='flex flex-col absolute top-4'>
                <div>{!isOpenNavBar &&
                    <IconButton onClick={openNavBar} style={{ width: 100, height: 40, }}>
                        <MenuIcon style={{ width: 40, height: 40, color: '#00a6af', }} />
                    </IconButton>
                }</div>
                <div style={{ backgroundColor: !isOpenNavBar ? '' : 'white', height: !isOpenNavBar ? 0 : 100, width: !isOpenNavBar ? 0 : '100%', minWidth: !isOpenNavBar ? 0 : 410, maxWidth: !isOpenNavBar ? 0 : 1000, }}>{isOpenNavBar &&
                    <div>
                        <IconButton onClick={closeNavBar} style={{ width: 60, height: 1, }}>
                            <ExpandLessIcon style={{ width: 40, height: 40, color: '#00a6af' }} />
                        </IconButton>
                        <NavBar />
                    </div>
                }</div>
            </div>
            <div className='flex justify-center flex-col'>
                <div className='flex absolute text-base top-8 right-12' style={{ borderBottomWidth: 1, borderColor: '#00a6af', }}>{!isOpenNavBar &&
                    <Button
                        variant='text'
                        style={{ fontFamily: '筑紫A丸ゴシック', color: '#00a6af', }}
                        onClick={routerExplanationPage}
                    >
                        <p className='mx-2 text-sm md:text-base'>詳しい説明を見る</p>
                        <HelpOutlineIcon style={{ color: '#00a6af', }} />
                    </Button>
                }</div>
                <div className='flex absolute top-20 right-14 text-sm md:text-base p-1' style={{ fontFamily: '筑紫A丸ゴシック', color: '#00a6af', borderBottomWidth: 1, borderColor: '#00a6af', }}>
                    <a href="https://docs.google.com/forms/d/e/1FAIpQLScYjS1JR521ZWnbhUWLHza5kzmNnbsL3DgvxEvW0sZ2aRPdKQ/viewform?usp=sf_link">
                        お問い合わせ
                    </a>
                </div>
                <div className='flex flex-col justify-center items-center mt-40 md:flex-row md:mt-64' >
                    <div className='my-8' style={{ fontFamily: "fantasy", color: '#00a6af', }}>
                        <p className='text-6xl'>Store</p>
                        <p className='text-6xl'>List</p>
                    </div>
                    <div className='flex flex-col text-xl mx-16 md:mx-0 md:ml-20' style={{ fontFamily: '筑紫A丸ゴシック', color: '#00a6af', }}>
                        <p className='flex justify-center'>このStoreListは</p>
                        <p className='flex justify-center'>買い物用のアプリになります</p>
                        <p className='flex justify-center'></p>
                        <p className='flex justify-center'>皆さんの日々の買い物に</p>
                        <p className='flex justify-center'>役立つことができたら</p>
                        <p className='flex justify-center'>幸いです</p>
                    </div>
                </div>
            </div>
        </>
    )
}
