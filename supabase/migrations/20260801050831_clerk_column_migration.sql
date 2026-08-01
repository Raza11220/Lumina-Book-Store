
/*
# Migrate user ID columns to text for Clerk (step 2)

Changes user_id and profile id columns from uuid to text to store Clerk user IDs.
Recreates all RLS policies with anon+authenticated access (Clerk handles auth externally).
*/

-- ─── COLUMN TYPE CHANGES ─────────────────────────────────────────────────────

-- Profiles: id uuid → text
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
ALTER TABLE profiles ALTER COLUMN id TYPE text USING id::text;
ALTER TABLE profiles ALTER COLUMN id DROP DEFAULT;

-- Cart items: user_id uuid → text
ALTER TABLE cart_items DROP CONSTRAINT IF EXISTS cart_items_user_id_fkey;
ALTER TABLE cart_items ALTER COLUMN user_id TYPE text USING user_id::text;
ALTER TABLE cart_items ALTER COLUMN user_id DROP DEFAULT;

-- Wishlist items: user_id uuid → text
ALTER TABLE wishlist_items DROP CONSTRAINT IF EXISTS wishlist_items_user_id_fkey;
ALTER TABLE wishlist_items ALTER COLUMN user_id TYPE text USING user_id::text;
ALTER TABLE wishlist_items ALTER COLUMN user_id DROP DEFAULT;

-- Orders: user_id uuid → text
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_user_id_fkey;
ALTER TABLE orders ALTER COLUMN user_id TYPE text USING user_id::text;
ALTER TABLE orders ALTER COLUMN user_id DROP DEFAULT;

-- Reviews: user_id uuid → text
ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_user_id_fkey;
ALTER TABLE reviews ALTER COLUMN user_id TYPE text USING user_id::text;
ALTER TABLE reviews ALTER COLUMN user_id DROP DEFAULT;

-- ─── RLS POLICIES (relaxed: Clerk handles auth externally) ───────────────────

-- Profiles
CREATE POLICY "anon_select_profiles" ON profiles FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "anon_insert_profiles" ON profiles FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anon_update_profiles" ON profiles FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

-- Categories (public read, anon write - app enforces admin via Clerk)
CREATE POLICY "anon_select_categories" ON categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "anon_insert_categories" ON categories FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anon_update_categories" ON categories FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete_categories" ON categories FOR DELETE TO anon, authenticated USING (true);

-- Books (public read, anon write - app enforces admin via Clerk)
CREATE POLICY "anon_select_books" ON books FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "anon_insert_books" ON books FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anon_update_books" ON books FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete_books" ON books FOR DELETE TO anon, authenticated USING (true);

-- Cart items
CREATE POLICY "anon_select_cart" ON cart_items FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "anon_insert_cart" ON cart_items FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anon_update_cart" ON cart_items FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete_cart" ON cart_items FOR DELETE TO anon, authenticated USING (true);

-- Wishlist items
CREATE POLICY "anon_select_wishlist" ON wishlist_items FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "anon_insert_wishlist" ON wishlist_items FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anon_delete_wishlist" ON wishlist_items FOR DELETE TO anon, authenticated USING (true);

-- Orders
CREATE POLICY "anon_select_orders" ON orders FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "anon_insert_orders" ON orders FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anon_update_orders" ON orders FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

-- Order items
CREATE POLICY "anon_select_order_items" ON order_items FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "anon_insert_order_items" ON order_items FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Reviews
CREATE POLICY "anon_select_reviews" ON reviews FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "anon_insert_reviews" ON reviews FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anon_update_reviews" ON reviews FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete_reviews" ON reviews FOR DELETE TO anon, authenticated USING (true);
