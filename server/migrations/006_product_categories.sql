CREATE TABLE product_categories
(
    id VARCHAR(30) NOT NULL,
    category_code VARCHAR(20) NOT NULL,
    category_name VARCHAR(100) NOT NULL,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uk_product_categories_code
    (
        category_code
    )
);

ALTER TABLE products
ADD COLUMN category_id VARCHAR(30) NULL;

ALTER TABLE products
ADD CONSTRAINT fk_products_category
FOREIGN KEY (category_id)
REFERENCES product_categories(id);