-- Class: CS340 INTRODUCTION TO DATABASES
-- Assignment: Project Step 3 Final Version
-- Group 90: Shawnpal Singh Kahlon and Alexandra Janssen
-- Due Date: Monday 31 July 2023

-- -----------------------------------------------------
-- Schema Kapow_Comics_DB
-- -----------------------------------------------------
SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

-- -----------------------------------------------------
-- Table `Customers`
-- -----------------------------------------------------
CREATE OR REPLACE TABLE `Customers` (
  `customer_id` int(11) NOT NULL AUTO_INCREMENT,
  `customer_name` varchar(50) NOT NULL,
  `customer_email` varchar(40) NOT NULL,
  `customer_phone` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`customer_id`),
  UNIQUE KEY `customer_id` (`customer_id`),
  UNIQUE KEY `customer_email` (`customer_email`),
  UNIQUE KEY `customer_phone` (`customer_phone`)
);

ALTER TABLE `Customers` AUTO_INCREMENT=1001;

-- -----------------------------------------------------
-- Table `Suppliers`
-- -----------------------------------------------------
CREATE OR REPLACE TABLE `Suppliers` (
  `supplier_id` int(11) NOT NULL AUTO_INCREMENT,
  `supplier_name` varchar(50) NOT NULL,
  `supplier_email` varchar(40) NOT NULL,
  `supplier_phone` varchar(15) NOT NULL,
  `supplier_city` varchar(100) NOT NULL,
  `supplier_state` varchar(2) NOT NULL,
  PRIMARY KEY (`supplier_id`),
  UNIQUE KEY `supplier_id` (`supplier_id`),
  UNIQUE KEY `supplier_email` (`supplier_email`),
  UNIQUE KEY `supplier_phone` (`supplier_phone`)
);

ALTER TABLE `Suppliers` AUTO_INCREMENT=101;

-- -----------------------------------------------------
-- Table `Products`
-- -----------------------------------------------------
CREATE OR REPLACE TABLE `Products` (
  `product_id` int(11) NOT NULL AUTO_INCREMENT,
  `product_name` varchar(50) NOT NULL,
  `product_price` decimal(8,2) NOT NULL,
  `product_type` varchar(11) NOT NULL,
  `supplier_id` int(11),
  PRIMARY KEY (`product_id`),
  UNIQUE KEY `product_id` (`product_id`),
  CONSTRAINT `Products_ibfk_1` FOREIGN KEY (`supplier_id`) REFERENCES `Suppliers` (`supplier_id`) ON DELETE NO ACTION ON UPDATE CASCADE
);

ALTER TABLE `Products` AUTO_INCREMENT=10001;

-- -----------------------------------------------------
-- Table `Sales`
-- -----------------------------------------------------
CREATE OR REPLACE TABLE `Sales` (
  `sale_id` int(11) NOT NULL AUTO_INCREMENT,
  `sale_revenue` decimal(8,2) NOT NULL,
  `sale_date` datetime NOT NULL DEFAULT current_timestamp(),
  `customer_id` int(11) NOT NULL,
  PRIMARY KEY (`sale_id`),
  UNIQUE KEY `sale_id` (`sale_id`),
  CONSTRAINT `Sales_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `Customers` (`customer_id`) ON DELETE NO ACTION ON UPDATE CASCADE
);

ALTER TABLE `Sales` AUTO_INCREMENT=100001;

-- -----------------------------------------------------
-- Table `Sales_has_products`
-- -----------------------------------------------------
CREATE OR REPLACE TABLE `Sales_has_products` (
  `sale_id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `unit_price` decimal(8,2) NOT NULL,
  `quantity` int(11) NOT NULL,
  PRIMARY KEY (`sale_id`, `product_id`),
  CONSTRAINT `FK_Sales_has_products_product_id` FOREIGN KEY (`product_id`) REFERENCES `Products` (`product_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_Sales_has_products_sale_id` FOREIGN KEY (`sale_id`) REFERENCES `Sales` (`sale_id`) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE `Sales_has_products` AUTO_INCREMENT=1000001;

-- -----------------------------------------------------
-- Data Insertion
-- -----------------------------------------------------

-- Create customers (no FK)
INSERT INTO `Customers` (`customer_name`, `customer_email`, `customer_phone`) 
VALUES ('John Smith', 'jsmith@gmail.com', '751-830-4849'),
('Aurora Collins', 'acollins@yahoo.com', '404-111-2345'),
('Darren Walker', 'dwalker@gmail.com', '630-485-1000'),
('Janine McCormack', 'janinemc@yahoo.com', '314-261-7543');

-- Create suppliers (no FK)
INSERT INTO `Suppliers` (`supplier_name`, `supplier_email`, `supplier_phone`, `supplier_city`, `supplier_state`) 
VALUES ('Inked Enigma Enterprises', 'sales@inkedenigma.com', '702-762-8787', 'Las Vegas', 'NV'),
('SuperComics Supply Co.', 'supercomicssupplyco@gmail.com', '212-387-9702', 'New York City', 'NY'),
('WhizBang Comics Wholesalers', 'sales@whizbang.com', '312-220-4205', 'Chicago', 'IL'),
('Golden Age Distribution', 'goldenagedist@yahoo.com', '404-515-6230', 'Atlanta', 'GA');

-- Create products with supplier_id (FK)
INSERT INTO `Products` (`product_name`, `product_price`, `product_type`, `supplier_id`) 
VALUES ('“Watchmen”', 35.00, 'book', 103),
('Limited Edition “Batman” Statue ', 150.00, 'merchandise', 104),
('Retro “Spider-Man” Action Figure', 30.00, 'merchandise', 102),
('“Superman #75”', 50.00, 'book', 104),
('“X-Men #1”', 200.00, 'book', 101);

-- Create sales records with customer_id (FK)
INSERT INTO `Sales` (`sale_revenue`, `sale_date`, `customer_id`) 
VALUES (38.96, '2023-07-17 09:52:33', 1002),
(102.09, '2023-07-17 10:01:54', 1001),
(58.41, '2023-07-17 10:15:00', 1004),
(93.55, '2023-07-17 11:47:36', 1003);

-- Specify which products were purchased as a part of one sale, facilitate M:N relationship
INSERT INTO `Sales_has_products` (`sale_id`, `product_id`, `unit_price`, `quantity`) 
VALUES (100002, 10001, 34.55, 1),
(100002, 10004, 50.00, 1),
(100002, 10003, 32.99, 2);

SET FOREIGN_KEY_CHECKS=1;
COMMIT;