// 'use strict';

// module.exports = {
//   async up(queryInterface, Sequelize) {
//     // Agregar columna con llave foránea
//     await queryInterface.addColumn('tbl_gestion_cultivo', 'id_responsable', {
//       type: Sequelize.INTEGER,
//       allowNull: false, // o true si puede quedar vacío
//       references: {
//         model: 'tbl_persona', // la tabla donde está el responsable
//         key: 'id_persona'     // la columna clave primaria
//       },
//       onUpdate: 'CASCADE',
//       onDelete: 'SET NULL' // o 'CASCADE', según lo que quieras
//     });
//   },

//   async down(queryInterface, Sequelize) {
//     // Eliminar columna si se hace rollback
//     await queryInterface.removeColumn('tbl_gestion_cultivo', 'id_responsable');
//   }
// };
