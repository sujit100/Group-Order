-- Group Ordering Web App - Supabase Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Groups table
CREATE TABLE groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    restaurant_name TEXT,
    restaurant_id TEXT,
    status TEXT NOT NULL DEFAULT 'browsing' CHECK (status IN ('browsing', 'checkout', 'ordered', 'delivered')),
    checkout_user_email TEXT,
    venmo_handle TEXT,
    venmo_qr_code TEXT,
    order_total DECIMAL(10, 2),
    delivery_eta TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Group members table
CREATE TABLE group_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    first_name TEXT NOT NULL,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(group_id, email)
);

-- Cart items table
CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    added_by_email TEXT NOT NULL,
    added_by_name TEXT NOT NULL,
    item_name TEXT NOT NULL,
    item_description TEXT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    special_instructions TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'placed' CHECK (status IN ('placed', 'preparing', 'in_transit', 'delivered')),
    delivery_eta TIMESTAMPTZ,
    subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),
    tax_rate DECIMAL(5, 4) NOT NULL CHECK (tax_rate >= 0),
    tax_amount DECIMAL(10, 2) NOT NULL CHECK (tax_amount >= 0),
    tip_rate DECIMAL(5, 4) NOT NULL CHECK (tip_rate >= 0),
    tip_amount DECIMAL(10, 2) NOT NULL CHECK (tip_amount >= 0),
    total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0),
    ordered_at TIMESTAMPTZ DEFAULT NOW(),
    invoices_sent BOOLEAN DEFAULT FALSE
);

-- Order items table
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    added_by_email TEXT NOT NULL,
    added_by_name TEXT NOT NULL,
    item_name TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0)
);

-- User order summary table (for invoices)
CREATE TABLE user_order_summary (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    user_email TEXT NOT NULL,
    user_name TEXT NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),
    tax_amount DECIMAL(10, 2) NOT NULL CHECK (tax_amount >= 0),
    tip_amount DECIMAL(10, 2) NOT NULL CHECK (tip_amount >= 0),
    total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0),
    invoice_sent BOOLEAN DEFAULT FALSE,
    invoice_sent_at TIMESTAMPTZ,
    UNIQUE(order_id, user_email)
);

-- Create indexes for better query performance
CREATE INDEX idx_groups_code ON groups(code);
CREATE INDEX idx_groups_status ON groups(status);
CREATE INDEX idx_group_members_group_id ON group_members(group_id);
CREATE INDEX idx_cart_items_group_id ON cart_items(group_id);
CREATE INDEX idx_orders_group_id ON orders(group_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_user_order_summary_order_id ON user_order_summary(order_id);
CREATE INDEX idx_user_order_summary_user_email ON user_order_summary(user_email);

-- Enable Row Level Security (RLS)
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_order_summary ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (since we're not using authentication)
-- In production, you might want to add more restrictive policies

-- Groups: Allow all operations
CREATE POLICY "Allow all operations on groups" ON groups
    FOR ALL USING (true) WITH CHECK (true);

-- Group members: Allow all operations
CREATE POLICY "Allow all operations on group_members" ON group_members
    FOR ALL USING (true) WITH CHECK (true);

-- Cart items: Allow all operations
CREATE POLICY "Allow all operations on cart_items" ON cart_items
    FOR ALL USING (true) WITH CHECK (true);

-- Orders: Allow all operations
CREATE POLICY "Allow all operations on orders" ON orders
    FOR ALL USING (true) WITH CHECK (true);

-- Order items: Allow all operations
CREATE POLICY "Allow all operations on order_items" ON order_items
    FOR ALL USING (true) WITH CHECK (true);

-- User order summary: Allow all operations
CREATE POLICY "Allow all operations on user_order_summary" ON user_order_summary
    FOR ALL USING (true) WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_groups_updated_at BEFORE UPDATE ON groups
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Realtime for tables that need real-time updates
ALTER PUBLICATION supabase_realtime ADD TABLE cart_items;
ALTER PUBLICATION supabase_realtime ADD TABLE groups;
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
