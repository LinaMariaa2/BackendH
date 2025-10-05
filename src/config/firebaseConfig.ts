import * as admin from 'firebase-admin';
import path from 'path';

const serviceAccountPath = path.join(__dirname, '../../serviceAccountKey.json');

try {
    const serviceAccount = require(serviceAccountPath);

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });

    console.log('✅ Firebase Admin SDK inicializado correctamente.');

} catch (error) {
    console.error('❌ Error al inicializar Firebase Admin SDK:', error);
    process.exit(1);
}

// CORRECCIÓN: Usamos el tipo a través del namespace 'admin.messaging.Messaging'
export const fcm: admin.messaging.Messaging = admin.messaging();