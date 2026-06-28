/*
------------------------------------------------------------
v0.8.0
Configuration Engine Refactor
------------------------------------------------------------
*/

/*
------------------------------------------------------------
Drop Mapping Table First
------------------------------------------------------------
*/

DROP TABLE configuration_dropdown_value_business_actions;

/*
------------------------------------------------------------
Drop Business Actions
------------------------------------------------------------
*/

DROP TABLE configuration_business_actions;

/*
------------------------------------------------------------
Recreate Business Actions
------------------------------------------------------------
*/

CREATE TABLE configuration_business_actions
(
    id                  VARCHAR(30)     NOT NULL,

    code                VARCHAR(100)    NOT NULL,
    name                VARCHAR(150)    NOT NULL,
    description         VARCHAR(255)    NULL,

    domain              VARCHAR(100)    NULL,

    is_system           TINYINT(1)      NOT NULL DEFAULT 1,
    is_active           TINYINT(1)      NOT NULL DEFAULT 1,

    created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP
                                        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    UNIQUE KEY uk_configuration_business_actions_code
        (code)
);

/*
------------------------------------------------------------
Recreate Mapping Table
------------------------------------------------------------
*/

CREATE TABLE configuration_dropdown_value_business_actions
(
    id                  VARCHAR(30)     NOT NULL,

    dropdown_value_id   VARCHAR(30)     NOT NULL,

    business_action_id  VARCHAR(30)     NOT NULL,

    created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP
                                        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    UNIQUE KEY
    uk_configuration_dropdown_value_business_actions
    (
        dropdown_value_id,
        business_action_id
    ),

    CONSTRAINT fk_configuration_dropdown_value
        FOREIGN KEY (dropdown_value_id)
        REFERENCES configuration_dropdown_values(id),

    CONSTRAINT fk_configuration_business_action
        FOREIGN KEY (business_action_id)
        REFERENCES configuration_business_actions(id)
);