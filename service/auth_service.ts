import { auth } from "./firebase_service";
import firebase from "firebase/app";

export async function authSendSignInLinkToEmail(email: string) {
    if (process.env.NEXT_PUBLIC_SIGN_IN_URL == undefined) {
        console.log('url is undefined');
        return;
    }
    // メールリンクで開くページを設定(環境ごとに設定必要)
    const actionCodeSettings = {
        url: process.env.NEXT_PUBLIC_SIGN_IN_URL,
        handleCodeInApp: true,
    }
    try {
        await auth.sendSignInLinkToEmail(email, actionCodeSettings);
    } catch (e) {
        throw e;
    }
}

export async function authSignInWithEmailLink(email: string, link: string) {
    try {
        await setPersistence();
        const userCredential = await auth.signInWithEmailLink(email, link);
        if (userCredential.user == null) {
            throw `userCredential is null on signInWithEmailLink()`
        }
        return userCredential.user.uid;
    } catch (e) {
        throw e;
    }
}

export function authIsSignInWithEmailLink(link: string) {
    return auth.isSignInWithEmailLink(link)
}

export async function authSignOut() {
    try {
        await auth.signOut()
    } catch (e) {
        throw e;
    }
}

async function setPersistence() {
    await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
}
