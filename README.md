# 🛒 Ecommerce Backend — Entrega Final

Backend profesional para ecommerce desarrollado con **Node.js**, **Express** y **MongoDB**, implementando patrones de diseño, seguridad avanzada y arquitectura escalable.

---

## 📋 Descripción

Proyecto final de **Backend II** enfocado en:

- Arquitectura profesional con separación de capas (Routes → Controller → Repository → DAO → Model)
- Seguridad con JWT, bcrypt y middleware de autorización por roles
- Patrones de diseño: **Repository**, **DAO** y **DTO**
- Funcionalidades ecommerce: productos, carritos, compras y tickets
- Sistema de recuperación de contraseña por email con token expirable

---

## 🛠️ Tecnologías

| Tecnología | Propósito |
|---|---|
| Node.js + Express | Servidor HTTP y enrutamiento |
| MongoDB + Mongoose | Base de datos NoSQL y ODM |
| Passport.js + JWT | Autenticación y autorización |
| bcrypt | Encriptación de contraseñas |
| nodemailer | Envío de emails para recovery |
| dotenv | Gestión de variables de entorno |

---

## 🏗️ Arquitectura
```
src/
├── config/          # Configuración: passport, db, mail
├── dao/             # Data Access Objects (acceso a BD)
│   ├── BaseDao.js
│   ├── UserDao.js
│   ├── ProductDao.js
│   ├── CartDao.js
│   └── TicketDao.js
├── repository/      # Lógica de negocio
│   ├── UserRepository.js
│   ├── ProductRepository.js
│   ├── CartRepository.js
│   └── TicketRepository.js
├── dto/             # Data Transfer Objects (filtrado de respuestas)
│   ├── UserDTO.js
│   ├── ProductDTO.js
│   └── TicketDTO.js
├── models/          # Schemas de Mongoose
├── services/        # AuthService, MailService
├── middleware/      # auth, roles, validation
├── routes/          # Definición de endpoints
├── controllers/     # Orquestación: request → repository → response
├── utils/           # jwt, bcrypt, logger
├── app.js           # Configuración de Express
└── main.js          # Entry point
```

**Flujo de una petición:**
```
Request → Routes → Controller → Repository → DAO → Model → BD
                                                            ↓
Response ← Controller ← Repository ← DTO ← DAO ← Model ←──┘
```

---

## ⚙️ Instalación
```bash
# 1. Clonar el repositorio
git clone https://github.com/JoseMariaMuller/Backend-II-76985.git
cd backend2

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores reales

# 4. Iniciar el servidor
npm run dev    # Desarrollo con nodemon
npm start      # Producción
```

Servidor disponible en: `http://localhost:4000`

---

## 🔐 Variables de Entorno
```env
# Servidor
PORT=4000
NODE_ENV=development

# MongoDB
MONGO_URL=mongodb+srv://usuario:password@cluster.mongodb.net/ecommerce

# JWT
JWT_SECRET=tu_clave_secreta_muy_segura
JWT_EXPIRES_IN=24h

# Email (Gmail con App Password)
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
EMAIL_FROM=tu_email@gmail.com

# Frontend (para links de recovery)
FRONTEND_URL=http://localhost:3000
```

> ⚠️ `EMAIL_PASS` debe ser una **App Password** generada en Google Account, no tu contraseña normal.

---

## 📡 Endpoints

### 🔐 Autenticación

| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| POST | `/api/sessions/register` | Registro de usuario | ❌ Público |
| POST | `/api/sessions/login` | Login + JWT + cookie | ❌ Público |
| GET | `/api/sessions/current` | Datos del usuario logueado | ✅ Cookie |

<details>
<summary>Ver ejemplos</summary>

**Registro:**
```json
{
  "first_name": "Juan",
  "last_name": "Pérez",
  "email": "juan@example.com",
  "age": 30,
  "password": "secure123"
}
```

**Respuesta (sin password):**
```json
{
  "status": "success",
  "payload": {
    "id": "69bc54f67c2a5c5c4d12a592",
    "first_name": "Juan",
    "email": "juan@example.com",
    "role": "user",
    "cart": "69bc54f67c2a5c5c4d12a590"
  }
}
```
</details>

---

### 📦 Productos

| Método | Ruta | Descripción | Rol |
|---|---|---|---|
| GET | `/api/products` | Listar productos | ❌ Público |
| GET | `/api/products/:pid` | Ver producto por ID | ❌ Público |
| POST | `/api/products` | Crear producto | ✅ admin |
| PUT | `/api/products/:pid` | Actualizar producto | ✅ admin |
| DELETE | `/api/products/:pid` | Eliminar producto (soft delete) | ✅ admin |

<details>
<summary>Ver ejemplo de creación</summary>
```json
{
  "title": "Producto Premium",
  "description": "Descripción del producto",
  "price": 299.99,
  "category": "electronics",
  "stock": 50,
  "status": "active",
  "thumbnail": "https://example.com/image.jpg"
}
```
</details>

---

### 🛒 Carrito

| Método | Ruta | Descripción | Rol |
|---|---|---|---|
| GET | `/api/carts/:cid` | Ver contenido del carrito | ✅ user (dueño) |
| POST | `/api/carts/:cid/product/:pid` | Agregar producto al carrito | ✅ user (dueño) |
| POST | `/api/carts/:cid/purchase` | Finalizar compra | ✅ user (dueño) |

---

### 🎫 Tickets

| Método | Ruta | Descripción | Rol |
|---|---|---|---|
| GET | `/api/tickets` | Listar todos los tickets | ✅ admin |
| GET | `/api/tickets/:code` | Ver ticket por código | ✅ user o admin |
| GET | `/api/tickets/my-tickets` | Historial de compras del usuario | ✅ user |

<details>
<summary>Ver ejemplo de respuesta</summary>
```json
{
  "status": "success",
  "payload": {
    "code": "TICKET-1773952501-ABC123",
    "purchase_datetime": "2026-03-18T14:30:00.000Z",
    "amount": 599.98,
    "purchaser": "juan@example.com",
    "products": [
      {
        "product": "69ba00bda80f600c05eecccc",
        "quantity": 2,
        "price": 299.99,
        "subtotal": 599.98
      }
    ],
    "status": "completed"
  }
}
```
</details>

---

### 🔑 Recuperación de Contraseña

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/auth/password-recovery` | Solicitar token de recovery |
| POST | `/api/auth/reset-password` | Resetear contraseña con token |

**Flujo:**
1. `POST /api/auth/password-recovery` con `{ "email": "juan@example.com" }` → respuesta genérica (no revela si el email existe)
2. El usuario recibe un email con enlace (token válido por **1 hora**)
3. `POST /api/auth/reset-password` con `{ "token": "...", "newPassword": "nueva123", "oldPassword": "anterior123" }`

**Validaciones:**
- Token JWT con expiración de 1 hora
- No se permite reutilizar la contraseña anterior
- Mínimo 6 caracteres para la nueva contraseña

---

## 🔒 Seguridad

- **JWT** con expiración configurable (24h login / 1h recovery)
- **Cookies** `httpOnly + secure + sameSite` para protección XSS/CSRF
- **Passport.js** con estrategia `current` para extraer token de cookie
- **Middleware de roles** `isAdmin` / `isUser` en cada endpoint
- **bcrypt** con salt rounds para hashear contraseñas
- **DTOs** que filtran datos sensibles en todas las respuestas (nunca se expone el password)
- Validación de propiedad: usuarios solo acceden a **sus** carritos y tickets

---

## 👥 Roles y Permisos

| Acción | Admin | User |
|---|:---:|:---:|
| Ver productos | ✅ | ✅ |
| Crear / editar / eliminar productos | ✅ | ❌ |
| Gestionar su propio carrito | ✅ | ✅ |
| Ver todos los tickets | ✅ | ❌ |
| Ver sus propios tickets | ✅ | ✅ |
| Recovery de contraseña | ✅ | ✅ |

---

## 📧 Sistema de Email

Configurado con **nodemailer + Gmail**.

- **Desarrollo:** si no se configuran las variables de email, se puede usar [Ethereal](https://ethereal.email/) para previsualizar emails de prueba.
- **Producción:** activar verificación en 2 pasos en Google y generar una App Password en [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords).

---

## 🧪 Testing

**Flujo recomendado:**
1. Registrar usuario → Login → obtener cookie
2. Como **admin**: crear producto
3. Como **user**: agregar producto al carrito → comprar → verificar ticket y stock
4. Probar recovery: solicitar → recibir email → resetear → login con nueva contraseña

**Verificaciones clave:**
- Registro no expone password en respuesta
- Login inválido retorna `401`
- User intentando crear productos recibe `403`
- User accediendo a carrito ajeno recibe `403`
- Compra con stock insuficiente maneja partial/failed correctamente
- Token de recovery expirado retorna `400`
- Reset con contraseña anterior es rechazado

---

## 🚀 Deployment

Compatible con **Render**, **Railway**, **Cyclic** y **Vercel** (con config adicional).

Variables de entorno requeridas en producción:
```
PORT, NODE_ENV=production, MONGO_URL, JWT_SECRET, EMAIL_USER, EMAIL_PASS, FRONTEND_URL
```

> En producción: configurar CORS si el frontend está en otro dominio y asegurarse de usar HTTPS para cookies `secure`.

---

## 📁 Estructura del Proyecto
```
backend2/
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── src/
    ├── config/
    │   ├── passport.config.js
    │   └── mail.config.js
    ├── dao/
    ├── repository/
    ├── dto/
    ├── models/
    ├── services/
    ├── middleware/
    ├── routes/
    ├── controllers/
    ├── utils/
    ├── app.js
    └── main.js
```

---

## 👨‍💻 Autor

**Jose Maria Muller** — Backend Developer

📧 joseleps3@gmail.com · [GitHub](https://github.com/JoseMariaMuller)

---

## 📄 Licencia

Proyecto desarrollado con fines académicos para la materia **Backend II**.