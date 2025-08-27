# Sorteo Backend

> API para la gestión y exportación de participantes de sorteos.

## Requisitos

- Node.js >= 20
- PostgreSQL
- Cloudinary (para almacenamiento de imágenes)

## Instalación

```bash
npm install
```

## Variables de entorno

Crea un archivo `.env` con las siguientes variables:

```
PORT=3000
DATABASE_URL=postgres://usuario:password@host:puerto/dbname
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
ENCRYPTION_KEY=tu_encryption_key
PHONE_SALT=tu_phone_salt
FIREBASE_PROJECT_ID=tu_project_id
FIREBASE_CLIENT_EMAIL=tu_client_email
FIREBASE_PRIVATE_KEY=tu_private_key
```

### Comando para crear llaves encryption y phone salt
```
❯ node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

## Uso

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm start
```

## Endpoints principales

- `POST /api/participants` — Registrar participante
- `GET /api/participants` — Listar participantes (admin)
- `GET /api/admin/export` — Exportar Excel y fotos en ZIP (admin)
- `POST /api/admin/purge` — Eliminar registros y fotos (admin)

## Exportación

El ZIP generado contiene:
- Un archivo Excel con los participantes
- Las fotos asociadas

> **Nota:** Para que los hipervínculos a fotos funcionen en el Excel, extrae el ZIP y abre el archivo desde la carpeta extraída.

## Despliegue en Render

- Configura las variables de entorno en el panel de Render
- El comando de inicio es `npm start`
- Render ejecuta automáticamente `npm install`

## Licencia

MIT