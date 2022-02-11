import Request from "../entity/Request";
import Message from "../entity/Message";
import { db } from "./firebase_service";

export async function addMessage(shopId: string, message: Message) {
    const doc = await db.collection('requests').doc(shopId).collection('messages').add(message.toJson());
    await doc.set({ 'messageId': doc.id }, { merge: true })
}

export async function createRequestRoom(request: Request) {
    const newrequest = Request.createRequest(request.requestName, request.shopId, request.createUserId, request.latestMessage)
    await db.collection('requests').doc(request.shopId).set(newrequest.toJson());
    console.log('createrequestRoom')
}

export async function fetchExistsRequests(shopId: string) {
    const snapshot = await db.collection('requests').where('shopId', '==', shopId).get();
    return (snapshot.docs.map((doc) => Request.fromJSON(doc.data())))
}

export async function setLatestMassage(requestId: string, latestMessage: string) {
    try {
        console.log('setLatestMessageAntSetUpDatedAt')
        await db.collection('requests').doc(requestId).set({ 'latestMessage': latestMessage }, { merge: true })
    } catch (e) {
        console.log('setLatestMessageAntSetUpDatedAt Error: ', e)
    }
}