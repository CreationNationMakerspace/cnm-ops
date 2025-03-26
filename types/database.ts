export type AssetStatus = 'available' | 'in_use' | 'maintenance' | 'retired' | 'broken';
export type AssetCategory = 'hand_tool' | 'power_tool' | 'machine' | 'safety_equipment' | 'other';
export type MakerspaceShop = 'woodshop' | 'metalshop' | 'electronics' | '3d_printing' | 'laser_cutting' | 'cnc' | 'general' | 'storage';

export interface Asset {
  id: string;
  name: string;
  description: string | null;
  category: AssetCategory;
  status: AssetStatus;
  shop: MakerspaceShop;
  serial_number: string | null;
  model_number: string | null;
  manufacturer: string | null;
  purchase_date: string | null;
  purchase_price: number | null;
  warranty_expiry: string | null;
  location: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  last_maintenance_date: string | null;
  next_maintenance_date: string | null;
  maintenance_notes: string | null;
  battery_compatibility: string[] | null;
}

export interface AssetPhoto {
  id: string;
  asset_id: string;
  photo_url: string;
  caption: string | null;
  is_primary: boolean;
  created_at: string;
  created_by: string | null;
}

export interface AssetWithPhotos extends Asset {
  photos: AssetPhoto[];
}

// Type for creating a new asset
export type NewAsset = Omit<Asset, 'id' | 'created_at' | 'updated_at'>;

// Type for updating an asset
export type AssetUpdate = Partial<NewAsset>;

// Type for creating a new asset photo
export type NewAssetPhoto = Omit<AssetPhoto, 'id' | 'created_at'>;

// Database schema type
export interface Database {
  public: {
    Tables: {
      assets: {
        Row: Asset;
        Insert: NewAsset;
        Update: AssetUpdate;
      };
      asset_photos: {
        Row: AssetPhoto;
        Insert: NewAssetPhoto;
        Update: Partial<NewAssetPhoto>;
      };
      inventory_items: {
        Row: InventoryItem;
        Insert: Omit<InventoryItem, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<InventoryItem, 'id' | 'created_at' | 'updated_at'>>;
      };
      inventory_item_photos: {
        Row: InventoryItemPhoto;
        Insert: NewInventoryItemPhoto;
        Update: Partial<NewInventoryItemPhoto>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      asset_status: AssetStatus;
      asset_category: AssetCategory;
      makerspace_shop: MakerspaceShop;
      inventory_category: InventoryCategory;
      consumable_type: ConsumableType;
      inventory_status: InventoryStatus;
    };
  };
}

export type QuestCategory = 'maintenance' | 'training' | 'organization' | 'community';
export type QuestDifficulty = 'easy' | 'medium' | 'hard';
export type QuestStatus = 'available' | 'in_progress' | 'completed' | 'expired';

export interface Quest {
  id: string;
  title: string;
  description: string;
  category: QuestCategory;
  difficulty: QuestDifficulty;
  status: QuestStatus;
  token_reward: number;
  shop: MakerspaceShop;
  requirements: string[];
  instructions: string[];
  created_at: string;
  updated_at: string;
  expires_at: string | null;
  completed_by: string[];
  created_by: string;
}

export interface QuestCompletion {
  id: string;
  quest_id: string;
  user_id: string;
  completed_at: string;
  notes: string | null;
  verified_by: string | null;
  verified_at: string | null;
}

export interface UserTokens {
  id: string;
  user_id: string;
  balance: number;
  created_at: string;
  updated_at: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_type: string;
  earned_at: string;
  description: string;
}

export type InventoryCategory = 'consumable' | 'repair_part';
export type ConsumableType = 'filament' | 'vinyl' | 'sublimation' | 'other';
export type InventoryStatus = 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued';

export interface InventoryItem {
  id: string;
  name: string;
  description: string | null;
  category: InventoryCategory;
  consumable_type?: ConsumableType;
  status: InventoryStatus;
  quantity: number;
  unit: string;
  min_quantity: number;
  location: string | null;
  supplier: string | null;
  supplier_part_number: string | null;
  last_ordered: string | null;
  last_restocked: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface InventoryTransaction {
  id: string;
  item_id: string;
  type: 'in' | 'out';
  quantity: number;
  notes: string | null;
  created_at: string;
  created_by: string;
}

export interface InventoryItemPhoto {
  id: string;
  item_id: string;
  photo_url: string;
  caption: string | null;
  is_primary: boolean;
  created_at: string;
  created_by: string | null;
}

export interface InventoryItemWithPhotos extends InventoryItem {
  photos: InventoryItemPhoto[];
}

// Type for creating a new inventory item photo
export type NewInventoryItemPhoto = Omit<InventoryItemPhoto, 'id' | 'created_at'>; 