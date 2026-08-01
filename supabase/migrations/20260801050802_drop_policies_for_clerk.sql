
/*
# Drop policies before column type changes (Clerk migration step 1)

Drops all RLS policies that reference columns we need to alter (id, user_id).
Policies will be recreated in the next migration with relaxed anon access.
*/

-- Profiles
DROP POLICY IF EXISTS "select_own_profile" ON profiles;
DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
DROP POLICY IF EXISTS "update_own_profile" ON profiles;
DROP POLICY IF EXISTS "delete_own_profile" ON profiles;
DROP POLICY IF EXISTS "admin_select_all_profiles" ON profiles;

-- Cart items
DROP POLICY IF EXISTS "select_own_cart" ON cart_items;
DROP POLICY IF EXISTS "insert_own_cart" ON cart_items;
DROP POLICY IF EXISTS "update_own_cart" ON cart_items;
DROP POLICY IF EXISTS "delete_own_cart" ON cart_items;

-- Wishlist items
DROP POLICY IF EXISTS "select_own_wishlist" ON wishlist_items;
DROP POLICY IF EXISTS "insert_own_wishlist" ON wishlist_items;
DROP POLICY IF EXISTS "delete_own_wishlist" ON wishlist_items;

-- Orders
DROP POLICY IF EXISTS "select_own_orders" ON orders;
DROP POLICY IF EXISTS "insert_own_orders" ON orders;
DROP POLICY IF EXISTS "update_own_orders" ON orders;
DROP POLICY IF EXISTS "admin_select_all_orders" ON orders;
DROP POLICY IF EXISTS "admin_update_all_orders" ON orders;

-- Order items
DROP POLICY IF EXISTS "select_own_order_items" ON order_items;
DROP POLICY IF EXISTS "insert_own_order_items" ON order_items;
DROP POLICY IF EXISTS "admin_select_all_order_items" ON order_items;

-- Reviews
DROP POLICY IF EXISTS "public_select_reviews" ON reviews;
DROP POLICY IF EXISTS "insert_own_review" ON reviews;
DROP POLICY IF EXISTS "update_own_review" ON reviews;
DROP POLICY IF EXISTS "delete_own_review" ON reviews;
