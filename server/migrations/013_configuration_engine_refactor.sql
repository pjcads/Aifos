/*
------------------------------------------------------------
v0.8.0
Configuration Engine Refactor
------------------------------------------------------------
*/

/*
------------------------------------------------------------
Rename Tables
------------------------------------------------------------
*/

RENAME TABLE
    configuration_capabilities
TO
    configuration_business_actions;

RENAME TABLE
    configuration_dropdown_value_capabilities
TO
    configuration_dropdown_value_business_actions;