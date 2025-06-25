import { body, param, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import persona_temporal from '../models/Persona_temporal';

//validacion id
export const validatePersonaTemporalId = [
  param('id_temp')
    .isInt({ gt: 0 }).withMessage('El ID de persona debe ser un número entero positivo')
    .toInt(), // Convierte el parámetro a entero
];

//validacion para la creacion una persona

export const validatePersonaTemporalCreation =[
body ('nombre_usuario_temporal')
.trim() //elimina los espacion vacios al inicio y al final
.notEmpty().withMessage('el nombre de usuario es obligatorio')
.isLength({min:5, max:50}).withMessage('su nombre de usuario debe tener ente 5 y 50 caracteres'),

body ('correo')
.trim()
.notEmpty().withMessage('el correo es obligatorio')
.isEmail().withMessage('el formato de corro electronico no es valdido')
.normalizeEmail(), //si por error ingresa el correo en mayuscula esta funcion la convierte en minuscula

body ('contrasena')
.trim()
.notEmpty().withMessage('la contraseña es obligatoria para su registro')
.isLength({min:8}).withMessage('la contraseña debe tener minimo 8 caracteres'),

body ('rol')
.notEmpty().withMessage('el rol es obligatoro')
.isIn(['administrador', 'instructor', 'aprendiz']).withMessage('rol no valido, debe ser aprendiz, instructor o administrador'),

];

//validaicon para la actualizacion de una persona (todos los campos)
export const validatePersonaTemporalUpdate =[
    body('nombre_usuario_temporal')
    .optional()
    .trim()
    .notEmpty().withMessage('el nombre de usuario no debe estar vacio')
    .isLength({min: 3, max: 50}).withMessage('el nombre de usuario debe tener entre 5 y 50 caracteres'),

    body('correo')
    .optional()
    .trim()
    .notEmpty().withMessage('El correo electrónico no puede estar vacío')
    .isEmail().withMessage('El formato del correo electrónico no es válido')
    .normalizeEmail(),

    
  body('estado')
    .optional()
    .notEmpty().withMessage('El estado no puede estar vacío')
    .isIn(['activo', 'inactivo', 'bloqueado']).withMessage('El estado no es válido. Debe ser "activo", "inactivo" o "bloqueado"'),

    body ('contrasena')
    .trim()
    .notEmpty().withMessage('la contraseña es obligatoria para su registro')
    .isLength({min:8}).withMessage('la contraseña debe tener minimo 8 caracteres'),
]

//validamos nombre de correo unico
export const validatePersonaTemporalCorreoUnico = async(req: Request, res: Response, next: NextFunction) =>{
    const {correo} = req.body;
    const {id_temp} = req.params;

    if (correo){
        try{
            const PersonaTemporalExiste = await persona_temporal.findOne({where: {correo}})

            if (id_temp && PersonaTemporalExiste?.id_persona_temporal === parseInt(id_temp)){
                return next();
            }
            return res.status(409).json({error : 'el correo que proporcionaste ya esta registrado'})
        } catch(error: any){
            console.error('Error al verificar el correo:', error);
            return res.status(500).json({error: 'Error interno al verifiar correo', details: error.message});
        }
    }
     next();
}

//validacion para el login

const MAX_INTENTOS_LOGIN = 5;
const TIEMPO_BLOQUEO_MINUTOS = 30;

// --- MIDDLEWARE DE VALIDACIÓN DE INTENTOS DE LOGIN ---
export const validarIntentosLogin = async (req: Request, res: Response, next: NextFunction) => {
    const { correo } = req.body;

    if (!correo) {
        return res.status(400).json({ error: 'Correo electrónico es requerido para la validación de intentos.' });
    }

    try {
        const personaTemporalEncontrada = await persona_temporal.findOne({ where: { correo } }); 

        // Si la persona temporal no se encuentra en la base de datos,
        // no hay un historial de intentos fallidos para rastrear para ese correo.
        // Se permite que la solicitud continúe para que el siguiente middleware
        // (por ejemplo, el que verifica la contraseña) maneje la credencial no encontrada o incorrecta.
        if (!personaTemporalEncontrada) {
            return next();
        }

    
        const ahora = new Date();
        // Asegúrate de que 'estado' sea una propiedad en tu modelo persona_temporal si la usas
        const estaActualmenteBloqueadaPorEstado = (personaTemporalEncontrada as any).estado === 'bloqueado';
        const estaActualmenteBloqueadaPorExpiracion = personaTemporalEncontrada.codigo_expira && personaTemporalEncontrada.codigo_expira > ahora;

        if (estaActualmenteBloqueadaPorEstado || estaActualmenteBloqueadaPorExpiracion) {
            // Calcula el tiempo restante del bloqueo para informar al usuario
            let minutosRestantes = TIEMPO_BLOQUEO_MINUTOS; // Valor por defecto
            if (personaTemporalEncontrada.codigo_expira) {
                minutosRestantes = Math.ceil((personaTemporalEncontrada.codigo_expira.getTime() - ahora.getTime()) / (1000 * 60));
                if (minutosRestantes < 0) minutosRestantes = 0; 
            }

            // Responde con un estado 429 (Demasiadas solicitudes)
            return res.status(429).json({
                error: `Demasiados intentos fallidos. Tu cuenta está bloqueada temporalmente. Intenta de nuevo en aproximadamente ${minutosRestantes} minutos.`,
                estado: 'bloqueado' 
            });
        }

        // Si la cuenta no está bloqueada, comprueba si ha superado el número máximo de intentos fallidos
        // Asumiendo que 'personaTemporalEncontrada.intentos' es el campo que guarda los intentos fallidos.
        // Si no está definido o es menor que 0, se considera 0.
        const intentosActuales = personaTemporalEncontrada.intentos || 0;

        if (intentosActuales >= MAX_INTENTOS_LOGIN) {
            // Bloquea la cuenta permanentemente o temporalmente estableciendo el 'codigo_expira'
            // NOTA: Si usas un campo 'estado' en persona_temporal, cámbialo a 'bloqueado' aquí.
            if ((personaTemporalEncontrada as any).estado) {
                (personaTemporalEncontrada as any).estado = 'bloqueado'; // Cambia el estado a 'bloqueado'
            }
            // Establece el tiempo de expiración para un bloqueo temporal
            personaTemporalEncontrada.codigo_expira = new Date(ahora.getTime() + TIEMPO_BLOQUEO_MINUTOS * 60 * 1000);
            await personaTemporalEncontrada.save(); // Guarda los cambios en la base de datos

            // Responde con un estado 429 (Demasiadas solicitudes)
            return res.status(429).json({
                error: `Demasiados intentos fallidos. Tu cuenta ha sido bloqueada temporalmente por ${TIEMPO_BLOQUEO_MINUTOS} minutos.`,
                estado: 'bloqueado'
            });
        }

        // Si la cuenta existe, no está bloqueada y no ha excedido los intentos,
        // permite que la solicitud continúe al siguiente middleware.
        next();

    } catch (error: any) {
        
        console.error('Error en el middleware validarIntentosLogin:', error);
        return res.status(500).json({
            error: 'Error interno del servidor durante la validación de intentos de inicio de sesión.',
            detalles: error.message 
        });
    }
};