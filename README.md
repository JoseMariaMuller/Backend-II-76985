## ⚙️ Configuración Inicial

1. Clona el repositorio:
   ```bash
   git clone https://github.com/JoseMariaMuller/Backend-II-76985.git
   cd backend2
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura variables de entorno:
   ```bash
   cp .env.example .env
   ```

4. Inicia el servidor:
   ```bash
   npm start
   ```
5. Prueba los endpoints con Postman/Insomnia:

   - [POST] http://localhost:4000/api/sessions/register
   - [POST] http://localhost:4000/api/sessions/login
   - [GET]  http://localhost:4000/api/sessions/current (requiere cookie de login previo)

