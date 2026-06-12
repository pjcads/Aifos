CREATE DATABASE  IF NOT EXISTS `aifos_core` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `aifos_core`;
-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: aifos_core
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cashier_sessions`
--

DROP TABLE IF EXISTS `cashier_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cashier_sessions` (
  `id` varchar(30) NOT NULL,
  `terminal_id` varchar(30) NOT NULL,
  `cashier_id` varchar(30) NOT NULL,
  `opened_at` datetime NOT NULL,
  `closed_at` datetime DEFAULT NULL,
  `status` enum('OPEN','CLOSED') NOT NULL,
  `opening_notes` varchar(500) DEFAULT NULL,
  `closing_notes` varchar(500) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `sales_count` int DEFAULT '0',
  `sales_amount` decimal(12,2) DEFAULT '0.00',
  `refund_count` int DEFAULT '0',
  `refund_amount` decimal(12,2) DEFAULT '0.00',
  `closed_by` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `customer_credit_transactions`
--

DROP TABLE IF EXISTS `customer_credit_transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer_credit_transactions` (
  `id` varchar(30) NOT NULL,
  `customer_id` varchar(30) NOT NULL,
  `transaction_type` enum('PURCHASE','REFUND','ADJUSTMENT') DEFAULT NULL,
  `amount` decimal(12,2) NOT NULL,
  `reference_id` varchar(30) DEFAULT NULL,
  `payroll_status` enum('UNENDORSED','BATCHED','ENDORSED','PROCESSED') DEFAULT 'UNENDORSED',
  `payroll_batch_id` varchar(30) DEFAULT NULL,
  `remarks` varchar(500) DEFAULT NULL,
  `created_by` varchar(30) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `original_transaction_id` varchar(30) DEFAULT NULL,
  `sync_status` varchar(20) NOT NULL DEFAULT 'PENDING',
  PRIMARY KEY (`id`),
  KEY `fk_credit_customer` (`customer_id`),
  CONSTRAINT `fk_credit_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `id` varchar(30) NOT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `address` text,
  `loyalty_points` int DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `customer_code` varchar(50) DEFAULT NULL,
  `barcode` varchar(100) DEFAULT NULL,
  `userid` varchar(100) DEFAULT NULL,
  `credit_limit` decimal(12,2) DEFAULT '0.00',
  `available_credit` decimal(12,2) DEFAULT '0.00',
  `department` varchar(100) DEFAULT NULL,
  `status` enum('ACTIVE','INACTIVE') DEFAULT 'ACTIVE',
  `current_cycle_used_credit` decimal(12,2) DEFAULT '0.00',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `customer_code` (`customer_code`),
  UNIQUE KEY `barcode` (`barcode`),
  UNIQUE KEY `userid` (`userid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `document_sequences`
--

DROP TABLE IF EXISTS `document_sequences`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `document_sequences` (
  `document_type` varchar(30) NOT NULL,
  `document_date` date NOT NULL,
  `last_sequence` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`document_type`,`document_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `goods_receipt_headers`
--

DROP TABLE IF EXISTS `goods_receipt_headers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `goods_receipt_headers` (
  `id` varchar(30) NOT NULL,
  `receipt_no` varchar(50) NOT NULL,
  `supplier_name` varchar(255) DEFAULT NULL,
  `receipt_date` datetime NOT NULL,
  `remarks` varchar(500) DEFAULT NULL,
  `received_by` varchar(30) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `sync_status` varchar(20) NOT NULL DEFAULT 'PENDING',
  PRIMARY KEY (`id`),
  UNIQUE KEY `receipt_no` (`receipt_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `goods_receipt_lines`
--

DROP TABLE IF EXISTS `goods_receipt_lines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `goods_receipt_lines` (
  `id` varchar(30) NOT NULL,
  `goods_receipt_id` varchar(30) NOT NULL,
  `product_id` varchar(30) NOT NULL,
  `quantity` decimal(12,3) NOT NULL,
  `unit_cost` decimal(12,2) DEFAULT '0.00',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_goods_receipt_line_header` (`goods_receipt_id`),
  KEY `fk_goods_receipt_line_product` (`product_id`),
  CONSTRAINT `fk_goods_receipt_line_header` FOREIGN KEY (`goods_receipt_id`) REFERENCES `goods_receipt_headers` (`id`),
  CONSTRAINT `fk_goods_receipt_line_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `inventory_balances`
--

DROP TABLE IF EXISTS `inventory_balances`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory_balances` (
  `product_id` varchar(30) NOT NULL,
  `quantity_on_hand` decimal(12,3) NOT NULL DEFAULT '0.000',
  `last_updated` datetime NOT NULL,
  PRIMARY KEY (`product_id`),
  CONSTRAINT `fk_inventory_balance_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `inventory_documents`
--

DROP TABLE IF EXISTS `inventory_documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory_documents` (
  `id` varchar(30) NOT NULL,
  `document_type` enum('RECEIPT','ADJUSTMENT','TRANSFER') NOT NULL,
  `document_no` varchar(50) NOT NULL,
  `remarks` varchar(500) DEFAULT NULL,
  `created_by` varchar(30) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `inventory_movements`
--

DROP TABLE IF EXISTS `inventory_movements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory_movements` (
  `id` varchar(30) NOT NULL,
  `product_id` varchar(30) NOT NULL,
  `movement_type` enum('RECEIPT','ADJUSTMENT_IN','ADJUSTMENT_OUT','SALE','REFUND','TRANSFER_IN','TRANSFER_OUT','OPENING_BALANCE','RECONCILIATION') DEFAULT NULL,
  `quantity_change` decimal(12,3) NOT NULL,
  `reference_id` varchar(30) DEFAULT NULL,
  `remarks` varchar(500) DEFAULT NULL,
  `created_by` varchar(30) DEFAULT NULL,
  `movement_datetime` datetime NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `approval_id` varchar(30) DEFAULT NULL,
  `sync_status` varchar(20) NOT NULL DEFAULT 'PENDING',
  PRIMARY KEY (`id`),
  KEY `fk_inventory_movement_product` (`product_id`),
  CONSTRAINT `fk_inventory_movement_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `inventory_reconciliations`
--

DROP TABLE IF EXISTS `inventory_reconciliations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory_reconciliations` (
  `id` varchar(30) NOT NULL,
  `approval_id` varchar(30) NOT NULL,
  `product_id` varchar(30) NOT NULL,
  `reconciliation_type` enum('SUPPLIER_RECEIPT','WRONG_PRODUCT','COUNT_CORRECTION','OTHER') NOT NULL,
  `quantity` decimal(12,3) NOT NULL,
  `remarks` varchar(500) DEFAULT NULL,
  `reconciled_by` varchar(30) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `sync_status` varchar(20) NOT NULL DEFAULT 'PENDING',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `negative_inventory_approvals`
--

DROP TABLE IF EXISTS `negative_inventory_approvals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `negative_inventory_approvals` (
  `id` varchar(30) NOT NULL,
  `product_id` varchar(30) NOT NULL,
  `requested_by` varchar(30) NOT NULL,
  `approved_by` varchar(30) DEFAULT NULL,
  `approved_quantity` decimal(12,3) NOT NULL,
  `remarks` varchar(500) DEFAULT NULL,
  `status` enum('PENDING','APPROVED','REJECTED','USED') DEFAULT 'PENDING',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `approved_at` datetime DEFAULT NULL,
  `used_quantity` decimal(12,3) NOT NULL DEFAULT '0.000',
  `transaction_id` varchar(30) DEFAULT NULL,
  `reconciled_quantity` decimal(12,3) NOT NULL DEFAULT '0.000',
  `reconciliation_status` enum('OPEN','PARTIALLY_RECONCILED','FULLY_RECONCILED') DEFAULT 'OPEN',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `order_headers`
--

DROP TABLE IF EXISTS `order_headers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_headers` (
  `id` varchar(30) NOT NULL,
  `order_no` varchar(50) NOT NULL,
  `customer_id` varchar(30) NOT NULL,
  `status` enum('PENDING','PREPARING','READY','RELEASED','CANCELLED') NOT NULL DEFAULT 'PENDING',
  `payment_method` enum('CUSTOMER_CREDIT','XEMCO_WALLET','CASH') NOT NULL,
  `subtotal` decimal(12,2) NOT NULL,
  `total_amount` decimal(12,2) NOT NULL,
  `terminal_id` varchar(30) DEFAULT NULL,
  `session_id` varchar(30) DEFAULT NULL,
  `created_by` varchar(30) DEFAULT NULL,
  `released_transaction_id` varchar(30) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `released_at` datetime DEFAULT NULL,
  `remarks` varchar(500) DEFAULT NULL,
  `prepared_at` datetime DEFAULT NULL,
  `ready_at` datetime DEFAULT NULL,
  `released_by` varchar(30) DEFAULT NULL,
  `sync_status` varchar(20) NOT NULL DEFAULT 'PENDING',
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_no` (`order_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `order_lines`
--

DROP TABLE IF EXISTS `order_lines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_lines` (
  `id` varchar(30) NOT NULL,
  `order_id` varchar(30) NOT NULL,
  `product_id` varchar(30) NOT NULL,
  `sku` varchar(100) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `quantity` decimal(12,3) NOT NULL,
  `unit_price` decimal(12,2) NOT NULL,
  `line_total` decimal(12,2) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `payroll_batch_details`
--

DROP TABLE IF EXISTS `payroll_batch_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payroll_batch_details` (
  `id` varchar(30) NOT NULL,
  `payroll_batch_id` varchar(30) NOT NULL,
  `customer_id` varchar(30) NOT NULL,
  `customer_name` varchar(255) DEFAULT NULL,
  `deduction_amount` decimal(12,2) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_batch_details_batch` (`payroll_batch_id`),
  KEY `fk_batch_details_customer` (`customer_id`),
  CONSTRAINT `fk_batch_details_batch` FOREIGN KEY (`payroll_batch_id`) REFERENCES `payroll_batches` (`id`),
  CONSTRAINT `fk_batch_details_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `payroll_batches`
--

DROP TABLE IF EXISTS `payroll_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payroll_batches` (
  `id` varchar(30) NOT NULL,
  `batch_no` varchar(50) NOT NULL,
  `payroll_period_from` date NOT NULL,
  `payroll_period_to` date NOT NULL,
  `total_employees` int NOT NULL DEFAULT '0',
  `total_amount` decimal(12,2) NOT NULL DEFAULT '0.00',
  `status` enum('DRAFT','ENDORSED','PROCESSED','CANCELLED') NOT NULL DEFAULT 'DRAFT',
  `remarks` varchar(500) DEFAULT NULL,
  `created_by` varchar(30) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `batch_no` (`batch_no`),
  UNIQUE KEY `uq_payroll_batch_no` (`batch_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `product_prices`
--

DROP TABLE IF EXISTS `product_prices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_prices` (
  `id` varchar(30) NOT NULL,
  `product_id` varchar(30) NOT NULL,
  `price_type` enum('REGULAR','EMPLOYEE','PROMO') DEFAULT 'REGULAR',
  `price` decimal(12,2) NOT NULL,
  `effective_from` datetime NOT NULL,
  `effective_to` datetime DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_by` varchar(30) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_product_price_product` (`product_id`),
  CONSTRAINT `fk_product_price_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` varchar(30) NOT NULL,
  `sku` varchar(50) NOT NULL,
  `barcode` varchar(100) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `unit_of_measure` varchar(20) DEFAULT 'PCS',
  `allow_negative_inventory` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `sku` (`sku`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `terminals`
--

DROP TABLE IF EXISTS `terminals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `terminals` (
  `id` varchar(30) NOT NULL,
  `terminal_code` varchar(5) NOT NULL,
  `terminal_name` varchar(100) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `terminal_code` (`terminal_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `transaction_headers`
--

DROP TABLE IF EXISTS `transaction_headers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transaction_headers` (
  `id` varchar(30) NOT NULL,
  `transaction_no` varchar(50) NOT NULL,
  `transaction_type` enum('SALE','REFUND') NOT NULL,
  `payment_method` enum('CUSTOMER_CREDIT','XEMCO_WALLET','CASH') NOT NULL,
  `customer_id` varchar(30) DEFAULT NULL,
  `subtotal` decimal(12,2) NOT NULL,
  `discount_amount` decimal(12,2) DEFAULT '0.00',
  `total_amount` decimal(12,2) NOT NULL,
  `transaction_datetime` datetime NOT NULL,
  `terminal_id` varchar(30) DEFAULT NULL,
  `cashier_id` varchar(30) DEFAULT NULL,
  `sync_status` enum('PENDING','SYNCED','FAILED') DEFAULT 'PENDING',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `original_transaction_id` varchar(30) DEFAULT NULL,
  `refund_status` enum('NOT_REFUNDED','PARTIALLY_REFUNDED','FULLY_REFUNDED') DEFAULT 'NOT_REFUNDED',
  `refund_reason` varchar(500) DEFAULT NULL,
  `amount_tendered` decimal(12,2) DEFAULT NULL,
  `change_amount` decimal(12,2) DEFAULT NULL,
  `session_id` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `transaction_no` (`transaction_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `transaction_lines`
--

DROP TABLE IF EXISTS `transaction_lines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transaction_lines` (
  `id` varchar(30) NOT NULL,
  `transaction_id` varchar(30) NOT NULL,
  `product_id` varchar(30) NOT NULL,
  `sku` varchar(50) DEFAULT NULL,
  `product_name` varchar(255) DEFAULT NULL,
  `quantity` decimal(12,3) NOT NULL,
  `unit_price` decimal(12,2) NOT NULL,
  `line_total` decimal(12,2) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `original_transaction_line_id` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_transaction_line_header` (`transaction_id`),
  CONSTRAINT `fk_transaction_line_header` FOREIGN KEY (`transaction_id`) REFERENCES `transaction_headers` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` varchar(30) NOT NULL,
  `username` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('ADMIN','CASHIER','MANAGER') NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wallet_account_barcodes`
--

DROP TABLE IF EXISTS `wallet_account_barcodes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wallet_account_barcodes` (
  `id` varchar(30) NOT NULL,
  `wallet_id` varchar(30) NOT NULL,
  `barcode` varchar(100) NOT NULL,
  `barcode_type` enum('EMPLOYEE_ID','WALLET_CARD','VISITOR_CARD','QR_CODE','OTHER') DEFAULT 'OTHER',
  `is_primary` tinyint(1) DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_wallet_barcode` (`barcode`),
  KEY `fk_wallet_barcode_wallet` (`wallet_id`),
  CONSTRAINT `fk_wallet_barcode_wallet` FOREIGN KEY (`wallet_id`) REFERENCES `wallet_accounts` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wallet_accounts`
--

DROP TABLE IF EXISTS `wallet_accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wallet_accounts` (
  `id` varchar(30) NOT NULL,
  `customer_id` varchar(30) DEFAULT NULL,
  `wallet_barcode` varchar(100) NOT NULL,
  `account_name` varchar(255) NOT NULL,
  `current_balance` decimal(12,2) NOT NULL DEFAULT '0.00',
  `account_type` enum('EMPLOYEE','VISITOR','GENERAL') DEFAULT 'GENERAL',
  `status` enum('ACTIVE','BLOCKED','CLOSED') DEFAULT 'ACTIVE',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `wallet_barcode` (`wallet_barcode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wallet_transactions`
--

DROP TABLE IF EXISTS `wallet_transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wallet_transactions` (
  `id` varchar(30) NOT NULL,
  `wallet_id` varchar(30) NOT NULL,
  `transaction_type` enum('TOPUP','PURCHASE','REFUND','ADJUSTMENT') NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `reference_id` varchar(30) DEFAULT NULL,
  `remarks` varchar(500) DEFAULT NULL,
  `created_by` varchar(30) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `sync_status` varchar(20) NOT NULL DEFAULT 'PENDING',
  PRIMARY KEY (`id`),
  KEY `fk_wallet_txn_wallet` (`wallet_id`),
  CONSTRAINT `fk_wallet_txn_wallet` FOREIGN KEY (`wallet_id`) REFERENCES `wallet_accounts` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-12 23:38:03
