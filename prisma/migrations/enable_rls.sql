-- Habilita Row Level Security en todas las tablas
-- Con RLS activo y sin políticas definidas, el rol anon/authenticated
-- no puede ver ninguna fila via la REST API de Supabase.
-- Las conexiones de Prisma usan el superuser postgres, que bypasea RLS.

ALTER TABLE typologies       ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties       ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_images  ENABLE ROW LEVEL SECURITY;
ALTER TABLE users            ENABLE ROW LEVEL SECURITY;
ALTER TABLE agencies         ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands           ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales            ENABLE ROW LEVEL SECURITY;
ALTER TABLE installments     ENABLE ROW LEVEL SECURITY;
ALTER TABLE files            ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_updates  ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images   ENABLE ROW LEVEL SECURITY;

-- Segunda capa: revoca privilegios de lectura/escritura al rol anon y authenticated
-- Esto bloquea el acceso a nivel de privilegio, independientemente de RLS
REVOKE ALL ON typologies      FROM anon, authenticated;
REVOKE ALL ON properties      FROM anon, authenticated;
REVOKE ALL ON property_images FROM anon, authenticated;
REVOKE ALL ON users           FROM anon, authenticated;
REVOKE ALL ON agencies        FROM anon, authenticated;
REVOKE ALL ON brands          FROM anon, authenticated;
REVOKE ALL ON sales           FROM anon, authenticated;
REVOKE ALL ON installments    FROM anon, authenticated;
REVOKE ALL ON files           FROM anon, authenticated;
REVOKE ALL ON project_updates FROM anon, authenticated;
REVOKE ALL ON gallery_images  FROM anon, authenticated;
