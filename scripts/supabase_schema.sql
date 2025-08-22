-- Criar tabelas no Supabase
-- Execute este SQL no Supabase SQL Editor

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'guest',
    phone TEXT,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de quartos
CREATE TABLE IF NOT EXISTS rooms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    number TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL,
    capacity INTEGER NOT NULL,
    beds INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    amenities JSONB DEFAULT '[]',
    status TEXT NOT NULL DEFAULT 'available',
    guest_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de reservas futuras
CREATE TABLE IF NOT EXISTS reservations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
    guest_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de histórico
CREATE TABLE IF NOT EXISTS guest_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    guest_data JSONB NOT NULL,
    room_number TEXT NOT NULL,
    room_type TEXT NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    status TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir quartos iniciais
INSERT INTO rooms (number, type, capacity, beds, price, amenities, status) VALUES
('101', 'Solteiro', 1, 1, 80.00, '["wifi", "tv"]', 'available'),
('102', 'Casal', 2, 1, 120.00, '["wifi", "tv", "ar-condicionado"]', 'available'),
('103', 'Triplo', 3, 2, 150.00, '["wifi", "tv", "minibar"]', 'available'),
('104', 'Solteiro', 1, 1, 80.00, '["wifi", "tv"]', 'available'),
('105', 'Casal', 2, 1, 120.00, '["wifi", "tv"]', 'available'),
('201', 'Casal com AR', 2, 1, 149.00, '["wifi", "tv", "ar-condicionado"]', 'available'),
('202', 'Triplo', 3, 2, 160.00, '["wifi", "tv"]', 'available'),
('203', 'Casal com AR', 2, 1, 149.00, '["wifi", "tv", "ar-condicionado"]', 'available')
ON CONFLICT (number) DO NOTHING;

-- Inserir usuários padrão (senhas são hashes de bcrypt)
INSERT INTO users (name, email, role, phone, password_hash) VALUES
('Administrador', 'admin@hotel.com', 'admin', '(11) 99999-9999', '$2b$10$rQZ8kHWKtGKVKjKjKjKjKOeKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK'),
('Funcionário', 'staff@hotel.com', 'staff', '(11) 88888-8888', '$2b$10$rQZ8kHWKtGKVKjKjKjKjKOeKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK'),
('Hóspede', 'guest@hotel.com', 'guest', '(11) 77777-7777', '$2b$10$rQZ8kHWKtGKVKjKjKjKjKOeKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK')
ON CONFLICT (email) DO NOTHING;

-- Habilitar RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_history ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança (permitir acesso público por enquanto)
CREATE POLICY "Allow all operations" ON users FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON rooms FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON reservations FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON guest_history FOR ALL USING (true);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON rooms
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reservations_updated_at BEFORE UPDATE ON reservations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
