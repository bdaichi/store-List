import Favorite from "../entity/Favorites";
import { db } from "./firebase_service"

export async function createFavorites(favorites: Favorite, userId: string) {
    console.log('createFavorites')
    const newData = Favorite.createFavorite(favorites.shopId)
    await db.collection('users').doc(userId).collection('favorites').doc(favorites.shopId).set(newData.toJson())
}

export async function deleteFavorites(userId: string, shopId: string) {
    console.log('deleteFavorites')
    await db.collection('users').doc(userId).collection('favorites').doc(shopId).delete();
}

export async function fetchFavorites(userId: string) {
    console.log('fetchFavorites!!')
    const snapshot = await db.collection('users').doc(userId).collection('favorites').orderBy('createdAt', 'desc').get();
    return snapshot.docs.map((doc) => Favorite.fromJson(doc.data()));
}

export async function fetchFavorite(userId: string, shopId: string) {
    console.log('fetchFavorite!!')
    try {
        const snapshot = await db.collection('users').doc(userId).collection('favorites').doc(shopId).get();
        return Favorite.fromJson(snapshot.data());
    } catch (e) {
        console.log('お気に入り登録されてません')
        return Favorite.initFavorite
    }
}

export async function updatefavorites(userId: string, favorite: Favorite) {
    console.log('updatefavorite')
    await db.collection('users').doc(userId).collection('favorites').doc(favorite.shopId).set(favorite.toJson(), { merge: true })
}