# Archivo de configuracion de docker 

# Imagen base para trabajar con node
FROM node:18

# Carpeta de trabajo en docker predefinidad
WORKDIR /home/app

# se copian las herraminetas de funcionamiento
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos todo el código
COPY . .

# Compilamos TypeScript
RUN npm run build

# Exponemos el puerto
EXPOSE 4000

# Comando de inicio (ejecuta el archivo compilado en dist)
CMD ["npm", "run", "start"]
