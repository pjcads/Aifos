CREATE TABLE negative_inventory_approval_consumptions
(
    id VARCHAR(30) NOT NULL,
    approval_id VARCHAR(30) NOT NULL,
    transaction_id VARCHAR(30) NOT NULL,
    quantity DECIMAL(12,3) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    KEY idx_nia_consumption_approval
        (approval_id),

    KEY idx_nia_consumption_transaction
        (transaction_id)
);