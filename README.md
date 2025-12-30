# Eden Torre - Desarrollo Inmobiliario

Sitio web para el desarrollo inmobiliario Eden Torre. Plataforma para mostrar disponibilidad de unidades, precios, planos y administración de stock.

## 🚀 Tecnologías

- **React 18** - Framework UI
- **Vite** - Build tool rápido
- **TypeScript** - Tipado estático
- **Bootstrap 5 + SASS** - Framework CSS con personalización
- **React Router** - Navegación
- **Supabase** - Base de datos PostgreSQL y Storage (gratis, no se suspende)

## 📦 Instalación

```bash
npm install
```

## 🛠️ Desarrollo

```bash
npm run dev
```

El servidor se iniciará en `http://localhost:5173`

## 🏗️ Build para Producción

```bash
npm run build
```

## 📝 Configuración de Supabase

1. Crea una cuenta en [Supabase](https://supabase.com) (gratis)
2. Crea un nuevo proyecto
3. Crea un archivo `.env` en la raíz del proyecto:
   ```env
   VITE_SUPABASE_URL=tu_url_de_supabase
   VITE_SUPABASE_ANON_KEY=tu_clave_anonima
   ```
4. Ejecuta el script SQL en Supabase (ver `supabase/schema.sql`)
5. Configura el bucket de Storage llamado `planos` (ver `SUPABASE_SETUP.md`)

Para más detalles, consulta `SUPABASE_SETUP.md`

## 📁 Estructura del Proyecto

```
src/
├── pages/              # Páginas principales (Home, Admin)
├── components/         # Componentes reutilizables
│   └── sections/      # Secciones de la landing page
├── lib/               # Utilidades y configuración
│   └── supabase.ts    # Cliente de Supabase
├── services/          # Servicios y lógica de negocio
│   └── unitsService.ts # CRUD de unidades
├── types/             # Tipos TypeScript
│   └── unit.ts        # Tipos de unidades
└── styles/            # Estilos globales
    └── main.scss      # Bootstrap personalizado

supabase/
└── schema.sql         # Script para crear la base de datos
```

## 🎯 Características

- ✅ Landing page con secciones: Hero, Proyecto, Amenidades, Tipologías, Disponibilidad
- ✅ Panel de administración en `/admin/gprop`
- ✅ Gestión completa de unidades (CRUD)
- ✅ Carga de imágenes de planos a Supabase Storage
- ✅ Filtros de disponibilidad y tipología
- ✅ Cálculo automático de valores (m², entrega, saldo, cuotas)
- ✅ Stock en tiempo real

## 🔐 Rutas

- `/` - Landing page pública
- `/admin/gprop` - Panel de administración (sin autenticación por ahora)

## 📄 Licencia

Privado - Todos los derechos reservados
