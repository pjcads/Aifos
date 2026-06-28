/*
------------------------------------------------------------
v0.8.0
Configuration Engine Foundation
------------------------------------------------------------
*/

CREATE TABLE configuration_dropdown_types
(
    id                  VARCHAR(30)     NOT NULL,
    code                VARCHAR(100)    NOT NULL,
    name                VARCHAR(150)    NOT NULL,
    description         VARCHAR(255)    NULL,

    is_system           TINYINT(1)      NOT NULL DEFAULT 0,
    is_active           TINYINT(1)      NOT NULL DEFAULT 1,

    created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP
                                        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    UNIQUE KEY uk_configuration_dropdown_types_code
        (code)
);

CREATE TABLE configuration_dropdown_values
(
    id                  VARCHAR(30)     NOT NULL,

    dropdown_type_id    VARCHAR(30)     NOT NULL,

    code                VARCHAR(100)    NOT NULL,
    name                VARCHAR(150)    NOT NULL,
    description         VARCHAR(255)    NULL,

    sort_order          INT             NOT NULL DEFAULT 0,

    is_default          TINYINT(1)      NOT NULL DEFAULT 0,
    is_system           TINYINT(1)      NOT NULL DEFAULT 0,
    is_active           TINYINT(1)      NOT NULL DEFAULT 1,

    metadata_json       JSON            NULL,

    created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP
                                        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    UNIQUE KEY uk_configuration_dropdown_values
    (
        dropdown_type_id,
        code
    ),

    CONSTRAINT fk_configuration_dropdown_values_dropdown_type
        FOREIGN KEY (dropdown_type_id)
        REFERENCES configuration_dropdown_types(id)
);

CREATE TABLE configuration_capabilities
(
    id                  VARCHAR(30)     NOT NULL,

    code                VARCHAR(100)    NOT NULL,
    name                VARCHAR(150)    NOT NULL,
    description         VARCHAR(255)    NULL,

    module              VARCHAR(100)    NULL,

    is_system           TINYINT(1)      NOT NULL DEFAULT 1,
    is_active           TINYINT(1)      NOT NULL DEFAULT 1,

    created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP
                                        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    UNIQUE KEY uk_configuration_capabilities_code
        (code)
);

CREATE TABLE configuration_dropdown_value_capabilities
(
    id                  VARCHAR(30)     NOT NULL,

    dropdown_value_id   VARCHAR(30)     NOT NULL,

    capability_id       VARCHAR(30)     NOT NULL,

    is_allowed          TINYINT(1)      NOT NULL DEFAULT 1,

    created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP
                                        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    UNIQUE KEY uk_configuration_dropdown_value_capabilities
    (
        dropdown_value_id,
        capability_id
    ),

    CONSTRAINT fk_configuration_dropdown_value
        FOREIGN KEY (dropdown_value_id)
        REFERENCES configuration_dropdown_values(id),

    CONSTRAINT fk_configuration_capability
        FOREIGN KEY (capability_id)
        REFERENCES configuration_capabilities(id)
);