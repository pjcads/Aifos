/*
------------------------------------------------------------
v0.8.0
Configuration Engine Seed
------------------------------------------------------------
*/

/*
------------------------------------------------------------
Business Actions
------------------------------------------------------------
*/

INSERT INTO configuration_business_actions
(
    id,
    code,
    name,
    description,
    domain,
    is_system,
    is_active
)
VALUES

(
    '{{ACT}}',
    'PURCHASE',
    'Purchase',
    'Allows purchasing.',
    'SALES',
    1,
    1
),

(
    '{{ACT}}',
    'CREDIT',
    'Credit',
    'Allows credit transactions.',
    'SALES',
    1,
    1
),

(
    '{{ACT}}',
    'RETURN',
    'Return',
    'Allows returns.',
    'SALES',
    1,
    1
),

(
    '{{ACT}}',
    'SELL',
    'Sell',
    'Allows selling.',
    'SALES',
    1,
    1
),

(
    '{{ACT}}',
    'CHECKOUT',
    'Checkout',
    'Allows checkout.',
    'POS',
    1,
    1
),

(
    '{{ACT}}',
    'VOID',
    'Void',
    'Allows voiding transactions.',
    'POS',
    1,
    1
),

(
    '{{ACT}}',
    'REFUND',
    'Refund',
    'Allows refunds.',
    'POS',
    1,
    1
),

(
    '{{ACT}}',
    'RECEIVE',
    'Receive',
    'Allows inventory receipt.',
    'INVENTORY',
    1,
    1
),

(
    '{{ACT}}',
    'ADJUST',
    'Adjust',
    'Allows inventory adjustment.',
    'INVENTORY',
    1,
    1
),

(
    '{{ACT}}',
    'TRANSFER',
    'Transfer',
    'Allows inventory transfer.',
    'INVENTORY',
    1,
    1
),

(
    '{{ACT}}',
    'ORDER',
    'Order',
    'Allows ordering.',
    'PROCUREMENT',
    1,
    1
);