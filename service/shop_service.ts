import { db } from "./firebase_service"
import Shop from "../entity/Shop";
import firebase from "firebase";

export const defaultShopName = 'shop';

export async function createShop(shop: Shop) {
    console.log('createShop')
    await db.collection('shops').doc(shop.shopId).set(shop.toJson())
}


export async function deleteShop(shopId: string) {
    console.log('deleteShop')
    await db.collection('shops').doc(shopId).delete();
}

export async function fetchShop(shopId: string) {
    console.log('sucsess fetchShop!!')
    if (shopId) {
        const snapshot = await db.collection('shops').doc(shopId).get();
        return Shop.fromJson(snapshot.data())
    } else {
        console.log('fetchShop Error')
    }
}


export async function fetchFavoriteShops(shopIds: string[]) {
    console.log('sucsess fetchFavoriteShops!!')
    const snapshot = await db.collection('shops').where('shopId', 'in', shopIds).get();
    return snapshot.docs.map((doc) => Shop.fromJson(doc.data()));
}

export async function searchShop(geoLocation: firebase.firestore.GeoPoint) {
    console.log('sucsess fetchShops!!')
    console.log(geoLocation)
    const snapshot = await db.collection('shops').where('shopLocation', '==', geoLocation).get();
    return snapshot.docs.map((doc) => Shop.fromJson(doc.data()));
}


export async function updateShopData(shop: Shop) {
    console.log('updateShopData')
    await db.collection('shops').doc(shop.shopId).set(shop.toJson(), { merge: true })
}
