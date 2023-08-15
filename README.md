# Kapow! Comics Database Management Website

## Executive Summary

In response to feedback, the Kapow! Comics Database Management Website has undergone several changes since its initial version:

- **Foreign Key Naming**: Foreign key names were simplified to enhance consistency and naming standards.
- **Character Length Specification**: VARCHAR attributes now have specific character lengths for better clarity.
- **NOT NULL Attributes**: Attributes listed as NOT NULL were revised to better align with data and user needs.
- **Design Decisions**: Several design choices were made to improve the database structure.
- **Nullable Relationship Implementation**: Nullable relationships were introduced to accommodate in-house products without suppliers.
- **SELECT Search/Filter Enhancement**: Dynamic drop-down menus were added for improved search/filter functionality.
- **CASCADE Statements Improvement**: CASCADE statements were positioned near table creation queries for better visibility.
- **Rental Aspect Removal**: The rental aspect of the schema was removed for a sharper focus.
- **DDL SQL Commands Clarity**: DDL commands were rewritten for better human readability.
- **Friendly Foreign Keys**: Foreign keys now provide more meaningful options in dropdowns.
- **Primary Key Change**: The Sales_has_products table's primary key was changed for better usability.

## Project Overview

Kapow! Comics is a medium-sized comic book store facing challenges in managing sales, rentals, and customer data as it scales. To address this, a database-driven website was developed to record sales and rentals, capable of handling 35,000 to 40,000 transactions annually.

## Database Outline

### Customers

- customer_id: INT, auto_increment, unique, not NULL (PK)
- customer_name: VARCHAR(50), not NULL
- customer_email: VARCHAR(40), unique, not NULL
- customer_phone: VARCHAR(15), unique, NULL
- Relationship: 1:M relationship with Sales

### Suppliers

- supplier_id: INT, auto_increment, unique, not NULL (PK)
- supplier_name: VARCHAR(50), not NULL
- supplier_email: VARCHAR(40), unique, not NULL
- supplier_phone: VARCHAR(15), unique, not NULL
- supplier_city: VARCHAR(100), not NULL
- supplier_state: VARCHAR(2), not NULL
- Relationship: 1:M relationship with Products

### Products

- product_id: INT, auto_increment, unique, not NULL (PK)
- product_name: VARCHAR(50), not NULL
- product_price: DECIMAL(8, 2), not NULL
- product_type: VARCHAR(11), not NULL
- supplier_id: INT, FK from Suppliers
- Relationships: M:N relationship with Sales (via Sales_has_products), 1:M relationship with Suppliers

### Sales

- sale_id: INT, auto_increment, unique, not NULL (PK)
- sale_revenue: DECIMAL(8, 2), not NULL (calculated)
- sale_date: DATETIME, not NULL (default: CURRENT_TIMESTAMP)
- customer_id: INT, not NULL, FK from Customers
- Relationship: M:N relationship with Products (via Sales_has_products)

### Sales_has_products

- invoice_id: INT, auto_increment, not NULL (PK)
- sale_id: INT, not NULL, FK from Sales
- product_id: INT, not NULL, FK from Products
- unit_price: DECIMAL(8,2), not NULL
- quantity: INT, not NULL
- Relationships: 1:M relationship with Sales, 1:M relationship with Products

## Resources

- [Node.js Starter App](https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main)
- [W3Schools - Input Type "tel"](https://www.w3schools.com/tags/att_input_type_tel.asp)
- [LinuxHint - Parsing Float with Two Decimal Places in JavaScript](https://linuxhint.com/parse-float-with-two-decimal-places-javascript/)
- [W3Schools - `setTimeout()` Method](https://www.w3schools.com/jsref/met_win_settimeout.asp)
- [GeeksforGeeks - How to set float input type in HTML5](https://www.geeksforgeeks.org/how-to-set-float-input-type-in-html5/)
