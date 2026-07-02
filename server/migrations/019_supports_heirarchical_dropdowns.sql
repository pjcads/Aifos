ALTER TABLE configuration_dropdown_types
ADD COLUMN supports_parent_values TINYINT(1)
NOT NULL
DEFAULT 0
AFTER is_system,

ADD COLUMN supports_business_actions TINYINT(1)
NOT NULL
DEFAULT 0
AFTER supports_parent_values,

ADD COLUMN supports_default_value TINYINT(1)
NOT NULL
DEFAULT 1
AFTER supports_business_actions,

ADD COLUMN supports_sort_order TINYINT(1)
NOT NULL
DEFAULT 1
AFTER supports_default_value;

CREATE INDEX idx_dropdown_values_parent
ON configuration_dropdown_values(parent_dropdown_value_id);

CREATE INDEX idx_dropdown_values_sort
ON configuration_dropdown_values(dropdown_type_id, sort_order);