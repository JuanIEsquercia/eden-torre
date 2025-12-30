# Configuración de Supabase

Esta guía te ayudará a configurar Supabase para el proyecto Eden.

## 1. Crear un proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Crea una cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Espera a que se complete la configuración (puede tardar unos minutos)

## 2. Obtener las credenciales

1. En tu proyecto de Supabase, ve a **Settings** → **API**
2. Copia los siguientes valores:
   - **Project URL** (será tu `VITE_SUPABASE_URL`)
   - **anon public** key (será tu `VITE_SUPABASE_ANON_KEY`)

## 3. Configurar variables de entorno

1. Crea un archivo `.env` en la raíz del proyecto (junto a `package.json`)
2. Agrega las siguientes variables:

```env
VITE_SUPABASE_URL=tu_url_de_supabase_aqui
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_aqui
```

**Importante:** Reemplaza `tu_url_de_supabase_aqui` y `tu_clave_anonima_aqui` con los valores reales de tu proyecto.

## 4. Crear la tabla en Supabase

1. En tu proyecto de Supabase, ve a **SQL Editor**
2. Abre el archivo `supabase/schema.sql` de este proyecto
3. Copia todo el contenido del archivo
4. Pégalo en el SQL Editor de Supabase
5. Haz click en **Run** para ejecutar el script

Esto creará:
- La tabla `units` con todos los campos necesarios
- Los índices para mejorar el rendimiento
- Las políticas de seguridad (RLS)
- El trigger para actualizar `updated_at` automáticamente

## 5. Configurar Supabase Storage (para imágenes)

1. Ve a **Storage** en el menú lateral
2. Crea un nuevo bucket llamado `planos`
3. Configura el bucket como **Public** (para que las imágenes sean accesibles públicamente)
4. En **Policies**, crea una política que permita:
   - **SELECT**: Público (todos pueden leer)
   - **INSERT**: Público (todos pueden subir) - Solo para desarrollo
   - **UPDATE**: Público (todos pueden actualizar) - Solo para desarrollo
   - **DELETE**: Público (todos pueden eliminar) - Solo para desarrollo

**Nota de seguridad:** En producción, deberías restringir INSERT, UPDATE y DELETE solo a usuarios autenticados.

### Política de ejemplo para Storage:

```sql
-- Permitir lectura pública
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT
USING (bucket_id = 'planos');

-- Permitir subida pública (solo para desarrollo)
CREATE POLICY "Public Upload" ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'planos');

-- Permitir actualización pública (solo para desarrollo)
CREATE POLICY "Public Update" ON storage.objects
FOR UPDATE
USING (bucket_id = 'planos');

-- Permitir eliminación pública (solo para desarrollo)
CREATE POLICY "Public Delete" ON storage.objects
FOR DELETE
USING (bucket_id = 'planos');
```

## 6. Verificar la configuración

1. Reinicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

2. Abre la aplicación en el navegador
3. Ve a `/admin/gprop`
4. Intenta crear una nueva unidad
5. Verifica que se guarde correctamente en Supabase

## 7. Verificar datos en Supabase

1. Ve a **Table Editor** en Supabase
2. Selecciona la tabla `units`
3. Deberías ver las unidades que hayas creado

## Troubleshooting

### Error: "Failed to fetch"
- Verifica que las variables de entorno estén correctamente configuradas
- Asegúrate de que el archivo `.env` esté en la raíz del proyecto
- Reinicia el servidor de desarrollo después de crear/editar `.env`

### Error: "relation 'units' does not exist"
- Asegúrate de haber ejecutado el script SQL en Supabase
- Verifica que la tabla se haya creado correctamente en **Table Editor**

### Error al subir imágenes
- Verifica que el bucket `planos` exista en Storage
- Asegúrate de que las políticas de Storage estén configuradas correctamente
- Verifica que el bucket sea público

### Las unidades no se cargan
- Abre la consola del navegador (F12) y revisa los errores
- Verifica que las políticas RLS de la tabla `units` permitan lectura pública
- Si es necesario, puedes desactivar RLS temporalmente para desarrollo:
  ```sql
  ALTER TABLE units DISABLE ROW LEVEL SECURITY;
  ```

## Próximos pasos

Una vez que todo funcione correctamente:
1. Puedes migrar los datos existentes (si los tienes) a Supabase
2. Configura las políticas de seguridad apropiadas para producción
3. Configura variables de entorno en Vercel para el despliegue

