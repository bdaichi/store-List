import { storage } from "./firebase_service";

export async function uploadShopImageAndGetUrl(shopId: string, file: Blob): Promise<string> {
    try {
        console.log('uploadShopImageAndGetUrl')
        const storageRef = storage.ref();
        const uploadTask = storageRef.child('shopImages/' + shopId).put(file);

        return await new Promise<string>((resolve, reject) => {
            uploadTask.on('state_changed',
                () => {
                    // progress
                },
                (err) => {
                    reject(err);
                },
                async () => {
                    const downloadUrl = await uploadTask.snapshot.ref.getDownloadURL();
                    resolve(downloadUrl);
                });
        });
    } catch (e) {
        console.log('uploadShopImageAndGetUrl Error: ', e)
        throw e;
    }
}