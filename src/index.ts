import server from './server'
import sequelize from './config/db'

const port = process.env.PORT || 3000;
async function startServer(){
    try{
        await sequelize.authenticate();
        console.log('conexion a la base de datos establecida')
        
        await sequelize.sync();
        console.log('base de datos y modelos sincornizados')

        server.listen(port, () =>{
            console.log(`Servidor escuchando en el puerto http://localhost:4000`)
        });
    }catch (error){
        console.log('error durante la inicializacion', error)
    }
}
startServer();