INSERT INTO users
(
    id,
    username,
    full_name,
    password,
    role,
    is_active,
    is_system_account
)
SELECT
    'USR000000000000000000000000001',
    'admin',
    'SystemAdministrator',
    '$2b$10$Ol4KR3Oa1t1fOE.GQWHIlefGuqae7ebEy2DhIoid2p8ki2t6LbWT6',
    'ADMIN',
    1, 1
WHERE NOT EXISTS
(
    SELECT 1
    FROM users
    WHERE username = 'admin'
);

INSERT INTO system_information
(
    id,
    company_name,
    installed_version,
    installed_at
)
SELECT
    'SYS000000000000000000000000001',
    '__COMPANY_NAME__',
    '__VERSION__',
    NOW()
WHERE NOT EXISTS
(
    SELECT 1
    FROM system_information
);