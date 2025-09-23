import admin from 'firebase-admin';
import TokenPush from '../models/tokenPush';
import Notificacion from '../models/notificaciones';

/**
 * Envía una notificación push a un usuario y la guarda en el historial.
 * @param userId - El ID del usuario a notificar.
 * @param title - El título de la notificación.
 * @param message - El cuerpo del mensaje de la notificación.
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
    
    // --- INICIA LA CORRECIÓN ---

    // 👈 1. Se crea un objeto de mensaje que incluye los tokens y la notificación
    const messagePayload = {
      notification: { title, body: message },
      tokens: tokens, // El arreglo de tokens va aquí dentro
    };
    
    // 👈 2. Se llama a la nueva función 'sendEachForMulticast'
    const response = await admin.messaging().sendEachForMulticast(messagePayload);
    
    console.log(response.successCount + ' mensajes fueron enviados exitosamente');
    
    // --- FIN DE LA CORRECIÓN ---

    await Notificacion.create({ id_persona: userId, titulo: title, mensaje: message });
    console.log(`✅ Notificación para usuario ${userId} enviada: ${title}`);
  } catch (error) {
    console.error('❌ Error en el servicio de notificaciones:', error);
  }
}