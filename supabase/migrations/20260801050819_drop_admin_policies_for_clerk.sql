
/*
# Drop admin policies referencing profiles.id (Clerk migration step 1b)

These policies use EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid()) and
block the column type change on profiles.id. They will be recreated with
relaxed access after the column change.
*/

-- Categories admin policies
DROP POLICY IF EXISTS "admin_insert_categories" ON categories;
DROP POLICY IF EXISTS "admin_update_categories" ON categories;
DROP POLICY IF EXISTS "admin_delete_categories" ON categories;

-- Books admin policies
DROP POLICY IF EXISTS "admin_insert_books" ON books;
DROP POLICY IF EXISTS "admin_update_books" ON books;
DROP POLICY IF EXISTS "admin_delete_books" ON books;
