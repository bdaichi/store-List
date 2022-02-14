import { Button, IconButton } from "@material-ui/core";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import MenuIcon from '@material-ui/icons/Menu';

import { useState } from "react"

import Header from "../components/common/header";
import NavBar from '../components/common/nav_bar';

export default function ExplanationPage() {
    const [isOpenNavBar, setIsOpenNavBar] = useState(false)
    const [pageNumber, setPageNumber] = useState(1)
    const pageNames: string[] = ['追加ページ', '一覧ページ', '詳細ページ', 'マイページ']

    const nextPage = () => {
        setPageNumber(pageNumber + 1)
    }

    const previousPage = () => {
        setPageNumber(pageNumber - 1)
    }

    const openNavBar = () => {
        setIsOpenNavBar(true)
    }

    const closeNavBar = () => {
        setIsOpenNavBar(false)
    }

    const addPageExplanation = () => {
        setPageNumber(1)
    }

    const listPageExplanation = () => {
        setPageNumber(2)
    }

    const shopPageExplanation = () => {
        setPageNumber(3)
    }

    const myPageExplanation = () => {
        setPageNumber(4)
    }


    return (
        <>
            <Header title="説明ページ" />
            <div className='flex justify-center rounded-md fixed bottom-4 left-44 right-44 bg-white z-10'>
                <p className='text-base'>{pageNumber} / 4</p>
            </div>
            <div className='flex flex-col absolute top-4 z-0'>
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
                <div className='flex justify-center flex-row rounded-md my-2'>{!isOpenNavBar &&
                    <>
                        <div className='mr-10 my-2  ml-4' style={{ borderBottomWidth: 1, borderColor: '#00a6af', }}>
                            <Button
                                onClick={addPageExplanation}
                                variant='text'
                                style={{ fontFamily: '筑紫A丸ゴシック', color: '#00a6af', }}
                            >
                                <p>{pageNames[0]}</p>
                            </Button>
                        </div>
                        <div className='my-2' style={{ borderBottomWidth: 1, borderColor: '#00a6af', }}>
                            <Button
                                onClick={listPageExplanation}
                                variant='text'
                                style={{ fontFamily: '筑紫A丸ゴシック', color: '#00a6af', }}
                            >
                                <p>{pageNames[1]}</p>
                            </Button>
                        </div>
                    </>
                }</div>
                <div className='flex justify-center flex-row rounded-md'>{!isOpenNavBar &&
                    <>
                        <div className='ml-28 mr-10' style={{ borderBottomWidth: 1, borderColor: '#00a6af', }}>
                            <Button
                                onClick={shopPageExplanation}
                                variant='text'
                                style={{ fontFamily: '筑紫A丸ゴシック', color: '#00a6af', }}
                            >
                                <p>{pageNames[2]}</p>
                            </Button>
                        </div>
                        <div style={{ borderBottomWidth: 1, borderColor: '#00a6af', }}>
                            <Button
                                onClick={myPageExplanation}
                                variant='text'
                                style={{ fontFamily: '筑紫A丸ゴシック', color: '#00a6af', }}
                            >
                                <p>{pageNames[3]}</p>
                            </Button>
                        </div>
                    </>
                }</div>
            </div>
            <div className='flex flex-row fixed bottom-0 left-4 z-10'>{(pageNumber != 1) &&
                <div className='flex flex-row items-center shadow-2xl'>
                    <IconButton onClick={previousPage}>
                        <ArrowBackIosNewIcon style={{ color: '#00a6af', }} />
                    </IconButton>
                    <p className='text-base normal-case rounded-md p-1 py-2 bg-white opacity-75' style={{ color: '#00a6af', fontFamily: '筑紫A丸ゴシック' }}>{pageNames[pageNumber - 2]}</p>
                </div>
            }</div>
            <div className='flex flex-row fixed bottom-0 right-4 z-10'>{(pageNumber != 4) &&
                <div className='flex flex-row items-center shadow-2xl'>
                    <p className='text-base normal-case rounded-md p-1 py-2 bg-white opacity-75' style={{ color: '#00a6af', fontFamily: '筑紫A丸ゴシック' }}>{pageNames[pageNumber]}</p>
                    <IconButton onClick={nextPage}>
                        <ArrowForwardIosIcon style={{ color: '#00a6af', }} />
                    </IconButton>
                </div>
            }</div>
            <div className='flex flex-row justify-center z-0'>
                <div className='flex flex-col mt-40 my-24'>{(pageNumber == 1) &&
                    <>
                        <p className='flex justify-center text-2xl my-12' style={{ color: '#00a6af', fontFamily: '筑紫A丸ゴシック' }}>
                            追加ページ</p>
                        <img src='add_page.jpg' className='flex justify-center  m-4 shadow-2xl border border-gray-400' style={{ width: '60%', height: '60%', marginLeft: '22%' }} />
                        <p className='flex justify-center text-lg my-4' style={{ color: '#00a6af', fontFamily: '筑紫A丸ゴシック' }}>
                            画像、店名、概要、都道府県を入力します</p>
                        <p className='flex justify-center text-lg' style={{ color: 'red', fontFamily: '筑紫A丸ゴシック' }}>
                            ※店名、概要、都道府県は入力必須になってます
                        </p>
                        <img src='add_page_map.jpg' className='m-4 shadow-2xl my-12 border border-gray-400' style={{ width: '60%', height: '60%', marginLeft: '22%' }} />
                        <p className='flex justify-center text-lg my-4' style={{ color: '#00a6af', fontFamily: '筑紫A丸ゴシック' }}>
                            お店の位置を登録しておくことも可能です</p>
                        <p className='flex justify-center text-lg ' style={{ color: '#00a6af', fontFamily: '筑紫A丸ゴシック' }}>
                            お店の経路がわからない場合は</p>
                        <p className='flex justify-center text-lg ' style={{ color: '#00a6af', fontFamily: '筑紫A丸ゴシック' }}>
                            登録しておきましょう👍</p>
                    </>
                }</div>
                <div className='flex flex-col mt-40 my-24'>{(pageNumber == 2) &&
                    <>
                        <p className='flex justify-center text-2xl my-12' style={{ color: '#00a6af', fontFamily: '筑紫A丸ゴシック' }}>
                            一覧ページ</p>
                        <img src='list_page.jpg' className='m-4 shadow-2xl border border-gray-400' style={{ width: '60%', height: '60%', marginLeft: '22%' }} />
                        <p className='flex justify-center text-lg my-4' style={{ color: '#00a6af', fontFamily: '筑紫A丸ゴシック' }}>
                            お店の一覧となってます
                        </p>
                        <img src='list_page_set_prefecture.jpg' className='m-4 shadow-2xl border border-gray-400' style={{ width: '60%', height: '60%', marginLeft: '22%' }} />
                        <p className='flex justify-center text-lg mt-4' style={{ color: '#00a6af', fontFamily: '筑紫A丸ゴシック' }}>
                            都道府県別でお店の一覧を
                        </p>
                        <p className='flex justify-center text-lg ' style={{ color: '#00a6af', fontFamily: '筑紫A丸ゴシック' }}>
                            出すことが可能です
                        </p>

                    </>
                }</div>
                <div className='flex flex-col mt-40 my-24'>{(pageNumber == 3) &&
                    <>
                        <p className='flex justify-center text-2xl my-12' style={{ color: '#00a6af', fontFamily: '筑紫A丸ゴシック' }}>
                            詳細ページ</p>
                        <p className='flex justify-center text-lg mt-8' style={{ color: '#00a6af', fontFamily: '筑紫A丸ゴシック' }}>
                            一覧からお店を選択すると</p>
                        <p className='flex justify-center text-lg mb-8' style={{ color: '#00a6af', fontFamily: '筑紫A丸ゴシック' }}>
                            より詳しいお店の情報が見れます
                        </p>
                        <img src='shop_data.jpg' className='m-4 shadow-2xl border border-gray-400' style={{ width: '60%', height: '100%', marginLeft: '22%' }} />
                        <p className='flex justify-center text-lg mt-8' style={{ color: '#00a6af', fontFamily: '筑紫A丸ゴシック' }}>
                            位置が登録されている場合
                        </p>
                        <p className='flex justify-center text-lg ' style={{ color: '#00a6af', fontFamily: '筑紫A丸ゴシック' }}>
                            現在地からの経路検索ができます
                        </p>
                        <img src='shop_data_map.jpg' className='m-4 shadow-2xl border border-gray-400' style={{ width: '60%', height: '100%', marginLeft: '22%' }} />
                        <p className='flex justify-center text-lg mt-8' style={{ color: '#00a6af', fontFamily: '筑紫A丸ゴシック' }}>
                            また登録者は情報の編集が可能です</p>
                        <img src='createUser.jpg' className='m-4 shadow-2xl border border-gray-400' style={{ width: '60%', height: '100%', marginLeft: '22%' }} />
                        <p className='flex justify-center text-lg mt-8' style={{ color: '#00a6af', fontFamily: '筑紫A丸ゴシック' }}>
                            お店の情報について
                        </p>
                        <p className='flex justify-center text-lg' style={{ color: '#00a6af', fontFamily: '筑紫A丸ゴシック' }}>
                            知りたいこと気になったことを
                        </p>
                        <p className='flex justify-center text-lg mb-8' style={{ color: '#00a6af', fontFamily: '筑紫A丸ゴシック' }}>
                            登録者にメールして編集してもらいましょう
                        </p>
                        <img src='favorites_check_message.jpg' className='m-4 shadow-2xl border border-gray-400' style={{ width: '60%', height: '100%', marginLeft: '22%' }} />
                        <p className='flex justify-center text-lg my-8' style={{ color: '#00a6af', fontFamily: '筑紫A丸ゴシック' }}>
                            登録者はメッセージの確認ができます
                        </p>
                    </>
                }</div>
                <div className='flex flex-col mt-40 my-24'>{(pageNumber == 4) &&
                    <>
                        <p className='flex justify-center text-2xl my-12' style={{ color: '#00a6af', fontFamily: '筑紫A丸ゴシック' }}>
                            マイページ</p>
                        <img src='favorites_list.jpg' className='m-4 shadow-2xl border border-gray-400' style={{ width: '60%', height: '100%', marginLeft: '22%' }} />
                        <p className='flex justify-center text-lg mt-8' style={{ color: '#00a6af', fontFamily: '筑紫A丸ゴシック' }}>
                            マイページではお気に入りの
                        </p>
                        <p className='flex justify-center text-lg mb-8' style={{ color: '#00a6af', fontFamily: '筑紫A丸ゴシック' }}>
                            お店一覧を表示できます
                        </p>
                        <img src='register_favorites.jpg' className='m-4 shadow-2xl border border-gray-400' style={{ width: '60%', height: '100%', marginLeft: '22%' }} />
                        <p className='flex justify-center text-lg mt-8' style={{ color: '#00a6af', fontFamily: '筑紫A丸ゴシック' }}>
                            お気に入り登録を押せば
                        </p>
                        <p className='flex justify-center text-lg my-1' style={{ color: '#00a6af', fontFamily: '筑紫A丸ゴシック' }}>
                            マイページに追加されます
                        </p>
                        <p className='flex justify-center text-lg mt-8' style={{ color: '#00a6af', fontFamily: '筑紫A丸ゴシック' }}>
                            ただし登録可能なお店の数は
                        </p>
                        <p className='flex justify-center text-lg mb-8' style={{ color: '#00a6af', fontFamily: '筑紫A丸ゴシック' }}>
                            20店舗までとなっております
                        </p>
                        <img src='favorites_memo.jpg' className='m-4 shadow-2xl border border-gray-400' style={{ width: '60%', height: '100%', marginLeft: '22%' }} />
                        <p className='flex justify-center text-lg mt-8' style={{ color: '#00a6af', fontFamily: '筑紫A丸ゴシック' }}>
                            お気に入り登録をしたお店には
                        </p>
                        <p className='flex justify-center text-lg mb-8' style={{ color: '#00a6af', fontFamily: '筑紫A丸ゴシック' }}>
                            個人用のメモ欄が追加されます
                        </p>
                        <p className='flex justify-center text-lg' style={{ color: '#00a6af', fontFamily: '筑紫A丸ゴシック' }}>
                            お店で購入するものリストなど
                        </p>
                        <p className='flex justify-center text-lg mb-8' style={{ color: '#00a6af', fontFamily: '筑紫A丸ゴシック' }}>
                            お好きな使い方ができます
                        </p>
                    </>
                }</div>
            </div>
        </>
    )
}