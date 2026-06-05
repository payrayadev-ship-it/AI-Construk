-- ============================================================================
-- SCHEMA DEFINITION FOR FORTUNA CONSTRUCT AI PLATFORM
-- RDBMS: PostgreSQL (with PostGIS Spatial Extension)
-- Description: Core database architecture supporting multi-tenant project 
--              monitoring, land release tracking, AI-powered generation 
--              reports (BOQ, RAB, Proposals), and real-time GIS analytics.
-- ============================================================================

-- 1. EXTENSIONS
-- Enable PostGIS to support spatial queries, polygon constraints, and land telemetry mapping.
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. DYNAMIC UPDATED_AT TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = clock_timestamp();
    RETURN NEW;
END;
$$ language 'plpgsql';


-- 3. TENANTS TABLE (Multi-tenant isolation)
CREATE TABLE IF NOT EXISTS tenants (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    license_tier VARCHAR(50) DEFAULT 'Enterprise Gold' CHECK (license_tier IN ('Standard', 'Premium', 'Enterprise Gold', 'Sovereign Government')),
    max_kavling INTEGER DEFAULT 50,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_tenants_modtime
    BEFORE UPDATE ON tenants
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();


-- 4. PROJECTS TABLE 
-- Tracks major civil infrastructure contracts, estimated valuations, and spatial bounds.
CREATE TABLE IF NOT EXISTS projects (
    id VARCHAR(50) PRIMARY KEY,
    tenant_id VARCHAR(50) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    location_name VARCHAR(255),
    invested_amount NUMERIC(20, 2) DEFAULT 0.00,
    current_valuation NUMERIC(20, 2) DEFAULT 0.00,
    roi_to_date NUMERIC(5, 2) DEFAULT 0.00,
    status VARCHAR(100) DEFAULT 'Fase Perencanaan' CHECK (status IN ('Fase Perencanaan', 'Konstruksi Madya', 'Konstruksi Akhir', 'Operasional', 'Ditunda')),
    s_curve_data JSONB, -- Stores phase-by-phase physical progress and budget timeline mapping
    boundary GEOMETRY(Polygon, 4326), -- PostGIS Polygon representing KIPP sector boundary limits
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexing for high-performance spatial querying (GIST) on project boundaries
CREATE INDEX IF NOT EXISTS idx_projects_boundary ON projects USING GIST (boundary);
CREATE INDEX IF NOT EXISTS idx_projects_tenant ON projects (tenant_id);

CREATE TRIGGER update_projects_modtime
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();


-- 5. LAND CERTIFICATES TABLE
-- Tracks agrarian ownership status, release statuses, compensations, and AI risk analysis scores.
CREATE TABLE IF NOT EXISTS land_certificates (
    id VARCHAR(50) PRIMARY KEY,
    tenant_id VARCHAR(50) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    certificate_number VARCHAR(100) UNIQUE NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('SHM', 'HGB', 'HGU', 'AJB', 'Adat')),
    owner_name VARCHAR(255) NOT NULL,
    area_sqm NUMERIC(12, 2) NOT NULL, -- Total land area in square meters
    location VARCHAR(255),
    status VARCHAR(50) DEFAULT 'In Negotiation' CHECK (status IN ('Clean & Clear', 'Acquired', 'Disputed', 'In Negotiation')),
    liberation_progress INTEGER DEFAULT 0 CHECK (liberation_progress >= 0 AND liberation_progress <= 100),
    compensation_value NUMERIC(20, 2) DEFAULT 0.00,
    risk_analysis JSONB, -- Stores raw responses from Gemini Land Risk Analyzers
    geom GEOMETRY(Geometry, 4326), -- Spatial reference shape (Point or Polygon) of the land parcel
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- GIS Indexing for land parcel overlays and overlap identification
CREATE INDEX IF NOT EXISTS idx_land_certificates_geom ON land_certificates USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_land_certificates_tenant_status ON land_certificates (tenant_id, status);

CREATE TRIGGER update_land_certificates_modtime
    BEFORE UPDATE ON land_certificates
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();


-- 6. REPORTS & GENERATED RECORDS TABLE
-- Persistent storage for complex calculations (BOQ, standard unit prices, feasibility pitch decks).
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(50) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    project_id VARCHAR(50) REFERENCES projects(id) ON DELETE SET NULL,
    report_type VARCHAR(50) NOT NULL CHECK (report_type IN ('AI_PROPOSAL', 'AI_RAB_ESTIMATE', 'GIS_ANALYTICS', 'LAND_CONFLICT_AUDIT')),
    title VARCHAR(255) NOT NULL,
    generated_by VARCHAR(255) DEFAULT 'Fortuna AI Agent',
    payload JSONB NOT NULL, -- Stores the structural JSON (Pitch slides, material breakdown, timeline lists)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reports_tenant_type ON reports (tenant_id, report_type);


-- 7. INITIAL DEMO SEED DATA (Aids initial startup simulation)
INSERT INTO tenants (id, name, license_tier, max_kavling, is_active)
VALUES 
('t_0921', 'PT Nusantara Karya', 'Enterprise Gold', 50, TRUE),
('t_0842', 'AeroCitra Modular Hub', 'Premium', 30, TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO projects (id, tenant_id, name, location_name, invested_amount, current_valuation, roi_to_date, status, s_curve_data, boundary)
VALUES 
(
  'PRJ-KND-03', 't_0921', 'Smelter Nikel & Terminal Kendal', 'KIPP Sektor Utama', 
  2200000000000.00, 2650000000000.00, 20.40, 'Konstruksi Madya',
  '{"planned": [10, 25, 45, 60, 80], "actual": [8, 22, 40, 58], "weeks": ["Minggu 1", "Minggu 2", "Minggu 3", "Minggu 4", "Minggu 5"]}',
  ST_GeomFromText('POLYGON((116.94 1.12, 116.95 1.12, 116.95 1.13, 116.94 1.13, 116.94 1.12))', 4326)
),
(
  'PRJ-NGS-04', 't_0921', 'Batam Nongsa AI Center Hub', 'Daerah Penyangga Batam', 
  150000000000.00, 185000000000.00, 23.30, 'Fase Perencanaan',
  '{"planned": [5, 12, 20], "actual": [5, 10], "weeks": ["Minggu 1", "Minggu 2", "Minggu 3"]}',
  ST_GeomFromText('POLYGON((104.08 1.15, 104.09 1.15, 104.09 1.16, 104.08 1.16, 104.08 1.15))', 4326)
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO land_certificates (id, tenant_id, certificate_number, type, owner_name, area_sqm, location, status, liberation_progress, compensation_value, geom)
VALUES 
(
  'LC-101', 't_0921', 'SHM-2910-KIPP', 'SHM', 'H. Sugianto bin Abidin', 
  12500, 'Sepaku, Penajam Paser Utara', 'Clean & Clear', 100, 12500000000.00,
  ST_GeomFromText('POINT(116.947 -0.426)', 4326)
),
(
  'LC-103', 't_0921', 'AJB-028-ADAT', 'AJB', 'Keluarga Adat Dayak Paser', 
  18000, 'Batas Sektor Barat 4', 'Disputed', 45, 16200000000.00,
  ST_GeomFromText('POINT(116.942 -0.422)', 4326)
)
ON CONFLICT (id) DO NOTHING;

-- Comment mapping for database administrators
COMMENT ON TABLE tenants IS 'Stores isolated workspace environments for multi-tenant SaaS integration';
COMMENT ON TABLE projects IS 'Holds active civil infrastructure coordinates, financial states, and physical targets';
COMMENT ON TABLE land_certificates IS 'Tracks legal status of land plots, risk vectors, and custom compensation values';
COMMENT ON TABLE reports IS 'Secures long-running document compilation outputs including physical RAB structures';
