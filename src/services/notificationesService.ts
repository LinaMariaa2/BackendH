import admin from 'firebase-admin';
import TokenPush from '../models/tokenPush';
import Notificaciones from '../models/notificaciones'; // <-- Usa el nombre en plural

/**
 * Envía una notificación push a un usuario y la guarda en el historial.
 */
export async function sendNotification(userId: number, title: string, message: string) {
  try {
    const userTokens = await TokenPush.findAll({
      where: { id_persona: userId, activo: true },
    });

    if (!userTokens.length) {
      console.log(`(Info) Usuario ${userId} sin tokens activos para notificar.`);
      return;
    }

    const tokens = userTokens.map(t => t.token);
    
    const messagePayload = {
      notification: { title, body: message },
      tokens: tokens,
    };
    
    await admin.messaging().sendEachForMulticast(messagePayload);
    
    await Notificaciones.create({ id_persona: userId, titulo: title, mensaje: message }); // <-- Usa el nombre en plural

    console.log(`✅ Notificación para usuario ${userId} enviada: ${title}`);
  } catch (error) {
    console.error('❌ Error en el servicio de notificaciones:', error);
  }
}