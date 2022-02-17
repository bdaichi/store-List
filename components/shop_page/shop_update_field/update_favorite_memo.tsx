import { Button, TextField } from "@material-ui/core";
import { useContext, useState } from "react";

import { AuthContext } from "../../../context/AuthContext";
import Favorite from "../../../entity/Favorites";
import { updatefavorites } from "../../../service/favorites_service";

type Props = {
    favorite: Favorite
    setIsReloadData: any
}

export default function UpdateFavoriteMemo(props: Props) {
    const { currentUser } = useContext(AuthContext)

    const [editingFavoriteMemo, setEditingFavoriteMemo] = useState('')
    const [isEiditingFavoriteMemo, setIsEiditingFavoriteMemo] = useState(false)

    const editFavoriteMemo = () => {
        setIsEiditingFavoriteMemo(true)
    }

    const updateFavoriteMemo = async () => {
        if (currentUser) {
            const updateFavorite = props.favorite.copyWith(editingFavoriteMemo, null)
            await updatefavorites(currentUser.userId, updateFavorite)
            setIsEiditingFavoriteMemo(false)
            props.setIsReloadData(false)
        }
    }

    return (
        <>{props.favorite.shopId &&
            <div>{!isEiditingFavoriteMemo ?
                <div>
                    <div className='flex justify-center flex-col my-8' style={{ alignItems: 'center', }}>{props.favorite.shopId &&
                        <div>
                            <div className='flex justify-center items-center flex-row '>
                                <div className='mx-2 mr-40'>
                                    <p className='text-xl my-3 lg:text-3xl' style={{ fontFamily: 'Hannotate SC' }}>メモ</p>
                                </div>
                                <div className=''>
                                    <Button
                                        variant='contained'
                                        style={{ backgroundColor: '#00a6af', color: 'white', }}
                                        onClick={editFavoriteMemo}
                                    >
                                        <p className='text-lg' style={{ fontFamily: '筑紫A丸ゴシック', }}>編集</p>
                                    </Button>
                                </div>
                            </div>
                            <div className='rounded-md shadow-2xl text-xl h-44 w-72 p-4 md:h-52 lg:text-2xl' style={{ borderWidth: 2, borderColor: '#ff4081', }}>
                                <p className='whitespace-pre-wrap' style={{ fontFamily: '筑紫A丸ゴシック' }}>{props.favorite.memoColumn}</p>
                            </div>
                        </div>
                    }</div>

                </div>
                :
                <div className='flex flex-col'>
                    <TextField
                        style={{ height: 'auto', width: 250, }}
                        multiline={true}
                        rows={3}
                        defaultValue={props.favorite.memoColumn}
                        variant="outlined"
                        label="メモ"
                        onChange={(e) => setEditingFavoriteMemo(e.target.value)}
                    />
                    <Button
                        variant='contained'
                        style={{ backgroundColor: '#00a6af', color: 'white', margin: 20, }}
                        onClick={updateFavoriteMemo}
                    >
                        <p style={{ fontFamily: '筑紫A丸ゴシック' }}>保存する</p>
                    </Button>
                </div>
            }</div>
        }</>
    )
}