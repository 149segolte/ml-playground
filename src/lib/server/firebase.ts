import { FIREBASE_ADMIN_SDK_KEY } from '$env/static/private';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { type UserInfo, getAuth } from 'firebase-admin/auth';

const initializeFirebase = () => {
    if (getApps().length === 0) {
        const serviceAccount = JSON.parse(FIREBASE_ADMIN_SDK_KEY);
        return initializeApp({
            credential: cert(serviceAccount),
            databaseURL: 'https://ml-playground-4202d-default-rtdb.asia-southeast1.firebasedatabase.app'
        });
    }
};

export async function decodeToken(token: string): Promise<UserInfo | null> {
    if (!token) {
        return null;
    }
    try {
        let app = initializeFirebase();
        let decodedID = await getAuth(app).verifyIdToken(token);
        return (await getAuth(app).getUser(decodedID.uid)).providerData[0];
    } catch (err) {
        console.error('An error occurred validating token', (err as Error).message);
        return null;
    }
}
