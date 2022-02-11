
import { db } from "./firebase_service";

import User from "../entity/User";

export const defaultUserName = 'user';
const noUserErrorMessage = 'No User'

export async function createUser(userId: string) {
    console.log('create User !!')
    const newUser = User.createUser(defaultUserName, userId)
    await db.collection('users').doc(userId).set(newUser.toJson())
}


export async function fetchUser(userId: string) {
    try {
        console.log('user_service fetch User !!')
        const snapshot = await db.collection('users').doc(userId).get();
        return User.fromJSON(snapshot.data());
    } catch (e) {
        console.log("No user")
        // ユーザーデータがない場合はエラーを吐く
        throw noUserErrorMessage;
    }
}

export async function fetchUserOrCreateUserIfFirst(userId: string) {
    try {
        return await fetchUser(userId)
    } catch (e) {
        if (e == noUserErrorMessage) {
            await createUser(userId);
            return await fetchUser(userId)
        } else {
            throw e;
        }
    }
}

export async function updateUserData(user: User) {
    console.log('updateShopData')
    await db.collection('users').doc(user.userId).set(user.toJson(), { merge: true })
}