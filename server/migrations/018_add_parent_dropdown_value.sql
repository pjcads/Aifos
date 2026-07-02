-- =============================================
-- Configuration Engine Enhancement
-- v0.9.3
-- Parent / Child Dropdown Support
-- =============================================

ALTER TABLE configuration_dropdown_values
ADD COLUMN parent_dropdown_value_id VARCHAR(30) NULL
AFTER dropdown_type_id;

ALTER TABLE configuration_dropdown_values
ADD INDEX idx_dropdown_parent
(
    parent_dropdown_value_id
);

ALTER TABLE configuration_dropdown_values
ADD CONSTRAINT fk_dropdown_parent
FOREIGN KEY (parent_dropdown_value_id)
REFERENCES configuration_dropdown_values(id)
ON UPDATE CASCADE
ON DELETE SET NULL;