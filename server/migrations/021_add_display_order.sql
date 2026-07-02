ALTER TABLE configuration_dropdown_types
ADD COLUMN display_order INT NOT NULL DEFAULT 0
AFTER parent_dropdown_type_id;