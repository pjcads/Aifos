CREATE TABLE inventory_locations
(
    id                  VARCHAR(30) PRIMARY KEY,

    location_code       VARCHAR(30) NOT NULL,
    location_name       VARCHAR(100) NOT NULL,

    location_type       VARCHAR(20) NOT NULL,

    is_active           TINYINT(1) NOT NULL DEFAULT 1,

    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT uq_inventory_locations_code
        UNIQUE(location_code)
);

INSERT INTO inventory_locations
(
    id,
    location_code,
    location_name,
    location_type
)
VALUES
(
    'LOC_MAIN',
    'MAIN',
    'Main Warehouse',
    'WAREHOUSE'
);