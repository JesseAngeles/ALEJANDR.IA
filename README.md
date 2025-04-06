# Tienda Online

A continuación, se describen los pasos para configurar el entorno de desarrollo y cómo definir las variables de entorno en el archivo `.env`.

## Configuración del archivo `.env`

Para configurar el servidor, debes crear un archivo `.env` en la raíz del proyecto. Este archivo contendrá las variables de entorno necesarias para configurar el puerto del servidor y la URL de la base de datos de MongoDB.

1. **Crea un archivo `.env`** en la raíz de tu proyecto:
   En la raíz de tu proyecto, crea un archivo llamado `.env`. Puedes hacerlo manualmente o ejecutando el siguiente comando en la terminal:

   ```bash
   touch .env

2. **Seleccionar el puerto y la URL de mongo**
   Dentro del archivo `.env` especificar el puerto (8000 por defecto) y la URL de conexión con a la base de datos (local)

```bash
  PORT=8080
  MONGO_URL=mongodb://localhost:27017/alejandria
