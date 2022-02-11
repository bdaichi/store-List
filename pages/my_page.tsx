import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

import { AuthContext } from "../context/AuthContext";
import Favorite from "../entity/Favorites";
import FavoriteListTile from "../components/my_page/favorite_list_tile";
import { fetchFavorites } from "../service/favorites_service";
import Header from "../components/common/header";
import NavBar from "../components/common/nav_bar";

export default function MyPage() {
    const router = useRouter()
    const { currentUser } = useContext(AuthContext)

    const [favorites, setFavorites] = useState<Favorite[] | null>(null)

    const fetchFavoritesData = async () => {
        if (currentUser) {
            setFavorites(await fetchFavorites(currentUser.userId))
        }
    }

    useEffect(() => {
        // 読み込み時に上手くとれないから、currentUserが入ってから取る
        if (currentUser && !favorites) {
            fetchFavoritesData()
        }
    }, [currentUser]);

    return (
        <>
            <Header title='マイページ' />
            <NavBar />
            <div>{favorites &&

                <div className='flex flex-col pt-40' style={{ alignItems: 'center', }}>
                    <p className='text-2xl mb-12' style={{ color: '#ff4081', fontFamily: '筑紫A丸ゴシック' }}>お気に入り☆</p>
                    {favorites.map((favorite) =>
                        <div key={favorite.shopId} className='z-0 my-8 transform -skew-y-1'>
                            <FavoriteListTile shopId={favorite.shopId} />
                        </div>
                    )}
                </div>

            }</div>
        </>
    )
}