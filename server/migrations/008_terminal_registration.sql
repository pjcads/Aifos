ALTER TABLE terminals
MODIFY terminal_code VARCHAR(100) NOT NULL;

ALTER TABLE terminals
ADD COLUMN registered_at DATETIME NULL;

ALTER TABLE terminals
ADD COLUMN registered_by VARCHAR(30) NULL;