import Zona from '../models/zona';
import Invernadero from '../models/invernadero';

export const actualizarConteoZonas = async (id_invernadero: number) => {
  const zonas = await Zona.findAll({ where: { id_invernadero } });
  const zonasActivas = zonas.filter(zona => zona.estado === 'activo');

  await Invernadero.update(
    {
      zonas_totales: zonas.length,
      zonas_activas: zonasActivas.length,
    },
    { where: { id_invernadero } }
  );
};
