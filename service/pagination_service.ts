import { db } from "./firebase_service"
import Shop from "../entity/Shop";

export async function fetchLimitShops(limitNumber: number) {
    console.log('sucsess fetchShops!!')
    const snapshot = await db.collection('shops').orderBy('shopName', 'asc').limit(limitNumber).get();
    return snapshot.docs.map((doc) => Shop.fromJson(doc.data()));
}

export async function fetchPrefectureShops(limitNumber: number, prefecture: string) {
    console.log('sucsess fetchPrectureShops!!')
    const snapshot = await db.collection('shops').where('shopPrefecture', '==', prefecture).orderBy('shopName', 'asc').limit(limitNumber).get();
    return snapshot.docs.map((doc) => Shop.fromJson(doc.data()));
}

export async function fetchPreviousPageShopsData(currentFirstRecord: any, limitNumber: number) {
    const snapshot = await db.collection('shops').orderBy('shopName', 'desc').limit(limitNumber).startAfter(currentFirstRecord.shopName).get()
    return snapshot.docs.map((doc) => Shop.fromJson(doc.data()));
}

export async function fetchPreviousPagePrefectureShopsData(currentFirstRecord: any, limitNumber: number, prefecture: string) {
    const snapshot = await db.collection('shops').where('shopPrefecture', '==', prefecture).orderBy('shopName', 'desc').limit(limitNumber).startAfter(currentFirstRecord.shopName).get()
    return snapshot.docs.map((doc) => Shop.fromJson(doc.data()));
}


export async function fetchNextPageShopsData(currentLastRecord: any, limitNumber: number) {
    const snapshot = await db.collection('shops').orderBy('shopName', 'asc').limit(limitNumber).startAfter(currentLastRecord.shopName).get()
    return snapshot.docs.map((doc) => Shop.fromJson(doc.data()));
}

export async function fetchNextPagePrefectureShopsData(currentLastRecord: any, limitNumber: number, prefecture: string) {
    const snapshot = await db.collection('shops').where('shopPrefecture', '==', prefecture).orderBy('shopName', 'asc').limit(limitNumber).startAfter(currentLastRecord.shopName).get()
    return snapshot.docs.map((doc) => Shop.fromJson(doc.data()));
}

