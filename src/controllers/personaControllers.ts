import type { Request, Response } from 'express';
import Persona from '../models/Persona'; 
import { Op } from 'sequelize';


export class PersonaController {


  static getAll = async (req: Request, res: Response) => {
    try {
      const filtro = req.query.filtro?.toString().toLowerCase() || "";

      const personas = await Persona.findAll({
        where: {
          estado: "activo",
          rol: "operario", 
          nombre_usuario: {
            [Op.iLike]: `%${filtro}%`, 
          },
        },
      });

      res.json(personas);
    } catch (error) {
      console.error("Error al obtener personas:", error);
      res.status(500).json({ message: "Error interno" });
    }
  };

  static getOperarios= async (req: Request, res: Response) => {
  try {
    const filtro = req.query.filtro?.toString().toLowerCase();

    const whereCond: any = {
      estado: "activo",
      rol: "operario",
    };

    if (filtro && filtro.trim() !== "") {
      whereCond.nombre_usuario = { [Op.iLike]: `%${filtro}%` };
    }

    const personas = await Persona.findAll({
      where: whereCond,
    });

    res.json(personas);
  } catch (error) {
    console.error("Error al obtener personas:", error);
    res.status(500).json({ message: "Error interno" });
  }
};

  // Personas Activas
  static getAllActivos = async (req: Request, res: Response): Promise<void> => {
    try {
      const personas = await Persona.findAll({
        where: { estado: 'activo' },
        order: [['id_persona', 'ASC']],
      });
      res.json(personas);
    } catch (error: any) {
      console.error('Error al obtener las personas activas:', error);
      res.status(500).json({
        error: 'Error al obtener todas las personas activas',
        details: error.message,
      });
    }
  };

  // Mostramos Persona por ID en ruta
  static async getById(req: Request, res: Response) {
  try {
    const idRaw = req.params.id;
const id = parseInt(idRaw, 10);

if (!idRaw || isNaN(id) || !Number.isInteger(id)) {
  res.status(400).json({ error: 'ID inválido' });
}


    const persona = await Persona.findByPk(id);
    if (!persona) {
      res.status(404).json({ error: 'Persona no encontrada' });
      return 
    }

    res.json(persona);
  } catch (error) {
    console.error('Error al obtener persona por ID:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
    return ;
  }
}





  // Crear una nueva Persona
  static crearPersona = async (req: Request, res: Response): Promise<void> => {
    try {
    
      
      const { contrasena, ...restOfBody } = req.body;
      const personaData = { ...restOfBody, contrasena: contrasena };

      const persona = new Persona(personaData);
      await persona.save();
      
     
      const personaSinContrasena = persona.toJSON();
      delete personaSinContrasena.contrasena;

      res.status(201).json({ mensaje: 'Persona creada correctamente', persona: personaSinContrasena });

    } catch (error: any) {
      console.error('Error al crear la persona:', error);
  
      if (error.name === 'SequelizeUniqueConstraintError') {
        res.status(409).json({ error: 'El correo electrónico ya está registrado. Por favor, usa otro.', details: error.message });
        return;
      }
     
      if (error.name === 'SequelizeValidationError') {
        res.status(400).json({ error: 'Datos de persona inválidos', details: error.errors.map((e: any) => e.message) });
        return;
      }
      res.status(500).json({
        error: 'Error al crear la persona',
        details: error instanceof Error ? error.message : String(error),
      });
    }
  };

  // Actualizar una Persona
  static actualizarPersona = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { contrasena, ...updateData } = req.body; 

      const [rowsUpdated] = await Persona.update(updateData, {
        where: { id_persona: id },
      });

      if (rowsUpdated === 0) {
        res.status(404).json({ error: 'Persona no encontrada' });
        return;
      }

      const personaActualizada = await Persona.findByPk(id);
      
      // Opcional: excluye la contraseña de la respuesta
      const personaSinContrasena = personaActualizada ? personaActualizada.toJSON() : null;
      if (personaSinContrasena) {
        delete personaSinContrasena.contrasena;
      }

      res.json({ mensaje: 'Persona actualizada correctamente', persona: personaSinContrasena });

    } catch (error: any) {
      console.error('Error al actualizar persona:', error);
       if (error.name === 'SequelizeUniqueConstraintError') {
        res.status(409).json({ error: 'El correo electrónico ya está registrado. Por favor, usa otro.', details: error.message });
        return;
      }
      if (error.name === 'SequelizeValidationError') {
        res.status(400).json({ error: 'Datos de persona inválidos', details: error.errors.map((e: any) => e.message) });
        return;
      }
      res.status(500).json({
        error: 'Error al actualizar la persona',
        details: error instanceof Error ? error.message : String(error),
      });
    }
  };

  // Cambiar estado a inactivo
  static inactivarPersona = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const persona = await Persona.findByPk(id);

      if (!persona) {
        res.status(404).json({ error: 'Persona no encontrada' });
        return;
      }

      persona.estado = 'inactivo';
      await persona.save(); 

      res.json({ mensaje: 'Persona inactivada correctamente' });
    } catch (error: any) {
      console.error('Error al inactivar la persona:', error);
      res.status(500).json({
        error: 'Error al inactivar la persona',
        details: error.message,
      });
    }
  };

  // Cambiar estado a activo
  static activarPersona = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const persona = await Persona.findByPk(id);

      if (!persona) {
        res.status(404).json({ error: 'Persona no encontrada' });
        return;
      }

      persona.estado = 'activo';
      await persona.save();

      res.json({ mensaje: 'Persona activada correctamente' });
    } catch (error: any) {
      console.error('Error al activar la persona:', error);
      res.status(500).json({
        error: 'Error al activar la persona',
        details: error.message,
      });
    }
  };

  // Cambiar estado a bloqueado
  static bloquearPersona = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const persona = await Persona.findByPk(id);

      if (!persona) {
        res.status(404).json({ error: 'Persona no encontrada' });
        return;
      }

      persona.estado = 'bloqueado';
      await persona.save();

      res.json({ mensaje: 'Persona bloqueada correctamente' });
    } catch (error: any) {
      console.error('Error al bloquear la persona:', error);
      res.status(500).json({
        error: 'Error al bloquear la persona',
        details: error.message,
      });
    }
  };

  // Eliminar Persona permanentemente
  static eliminarPersona = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const persona = await Persona.findByPk(id);

      if (!persona) {
        res.status(404).json({ error: 'Persona no encontrada' });
        return;
      }

      await persona.destroy();
      res.json({ mensaje: 'Persona eliminada permanentemente' });
    } catch (error: any) {
      console.error('Error al eliminar la persona:', error);
      res.status(500).json({
        error: 'Error al eliminar la persona',
        details: error.message,
      });
    }
  };

  
}