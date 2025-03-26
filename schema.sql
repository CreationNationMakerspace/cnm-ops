-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE asset_status AS ENUM ('available', 'in_use', 'maintenance', 'retired', 'broken');
CREATE TYPE asset_category AS ENUM ('hand_tool', 'power_tool', 'machine', 'safety_equipment', 'other');
CREATE TYPE makerspace_shop AS ENUM (
    'woodshop',
    'metalshop',
    'electronics',
    '3d_printing',
    'laser_cutting',
    'cnc',
    'general',
    'storage'
);

-- Create assets table
CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category asset_category NOT NULL,
    status asset_status NOT NULL DEFAULT 'available',
    shop makerspace_shop NOT NULL DEFAULT 'general',
    serial_number VARCHAR(100),
    model_number VARCHAR(100),
    manufacturer VARCHAR(255),
    purchase_date DATE,
    purchase_price DECIMAL(10,2),
    warranty_expiry DATE,
    location VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_maintenance_date DATE,
    next_maintenance_date DATE,
    maintenance_notes TEXT,
    battery_compatibility TEXT[],
    CONSTRAINT valid_dates CHECK (
        (purchase_date IS NULL OR warranty_expiry IS NULL) OR
        (purchase_date <= warranty_expiry)
    ),
    CONSTRAINT valid_maintenance_dates CHECK (
        (last_maintenance_date IS NULL OR next_maintenance_date IS NULL) OR
        (last_maintenance_date <= next_maintenance_date)
    )
);

-- Create asset_photos table
CREATE TABLE asset_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    caption TEXT,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID, -- References auth.users if you implement user authentication
    CONSTRAINT unique_primary_photo UNIQUE (asset_id, is_primary) DEFERRABLE INITIALLY DEFERRED
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updating updated_at
CREATE TRIGGER update_assets_updated_at
    BEFORE UPDATE ON assets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create index for faster lookups
CREATE INDEX idx_assets_category ON assets(category);
CREATE INDEX idx_assets_status ON assets(status);
CREATE INDEX idx_assets_location ON assets(location);
CREATE INDEX idx_assets_shop ON assets(shop);
CREATE INDEX idx_asset_photos_asset_id ON asset_photos(asset_id);

-- Create function to ensure only one primary photo per asset
CREATE OR REPLACE FUNCTION ensure_single_primary_photo()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_primary THEN
        UPDATE asset_photos
        SET is_primary = FALSE
        WHERE asset_id = NEW.asset_id
        AND id != NEW.id;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for primary photo management
CREATE TRIGGER ensure_single_primary_photo_trigger
    BEFORE INSERT OR UPDATE ON asset_photos
    FOR EACH ROW
    EXECUTE FUNCTION ensure_single_primary_photo();

-- Add RLS (Row Level Security) policies
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_photos ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust these based on your authentication setup)
CREATE POLICY "Enable read access for all users" ON assets
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON assets
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON assets
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON assets
    FOR DELETE USING (auth.role() = 'authenticated');

-- Similar policies for asset_photos
CREATE POLICY "Enable read access for all users" ON asset_photos
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON asset_photos
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON asset_photos
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON asset_photos
    FOR DELETE USING (auth.role() = 'authenticated'); 