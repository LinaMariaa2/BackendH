// 'use strict';

// /** @type {import('sequelize-cli').Migration} */
// module.exports = {
//   async up (queryInterface, Sequelize) {
//     // 1. Renombrar la columna 'autenticado' a 'isVerified'
//     // y cambiar su tipo y default si es necesario (asumiendo que era BOOLEAN)
//     await queryInterface.renameColumn('tbl_persona', 'autenticado', 'isVerified');
//     await queryInterface.changeColumn('tbl_persona', 'isVerified', {
//       type: Sequelize.BOOLEAN,
//       allowNull: false,
//       defaultValue: false, // Establecer el nuevo valor por defecto a FALSE para la verificación
//     });

//     // 2. Añadir la columna 'verificationCode'
//     await queryInterface.addColumn('tbl_persona', 'verificationCode', {
//       type: Sequelize.STRING(6), // Un string de 6 caracteres para el código
//       allowNull: true,          // Puede ser NULL después de la verificación
//       comment: 'Código de verificación de correo electrónico',
//     });

//     // 3. Añadir la columna 'verificationCodeExpires'
//     await queryInterface.addColumn('tbl_persona', 'verificationCodeExpires', {
//       type: Sequelize.DATE,     // Tipo DATE para la fecha y hora de expiración
//       allowNull: true,          // Puede ser NULL después de la verificación
//       comment: 'Fecha y hora de expiración del código de verificación',
//     });

//     // 4. Añadir la columna 'intentos' para los intentos de login fallidos
//     await queryInterface.addColumn('tbl_persona', 'intentos', {
//       type: Sequelize.INTEGER,
//       allowNull: false,
//       defaultValue: 0, // Inicia en 0 intentos fallidos
//       comment: 'Número de intentos de inicio de sesión fallidos',
//     });
//   },

//   async down (queryInterface, Sequelize) {
//     // La función 'down' debe revertir los cambios de 'up' en el orden inverso

//     // 1. Eliminar la columna 'intentos'
//     await queryInterface.removeColumn('tbl_persona', 'intentos');

//     // 2. Eliminar la columna 'verificationCodeExpires'
//     await queryInterface.removeColumn('tbl_persona', 'verificationCodeExpires');

//     // 3. Eliminar la columna 'verificationCode'
//     await queryInterface.removeColumn('tbl_persona', 'verificationCode');

//     // 4. Renombrar 'isVerified' de vuelta a 'autenticado' y revertir su default
//     await queryInterface.renameColumn('tbl_persona', 'isVerified', 'autenticado');
//     await queryInterface.changeColumn('tbl_persona', 'autenticado', {
//       type: Sequelize.BOOLEAN,
//       allowNull: false,
//       defaultValue: true, // Revertir al valor por defecto original
//     });
//   }
// };