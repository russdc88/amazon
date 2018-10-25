/*Drop the database if the database name already exist*/
DROP DATABASE IF EXISTS bamazon;

/* Create database */
CREATE DATABASE bamazon;
USE bamazon;

/* Create new table with a primary key that auto-increments, some text fields, and number valued fields, totaling 5 columns. */
CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
	department_name VARCHAR(100) NOT NULL,
	price FLOAT(10) NOT NULL,
	stock_quantity INT NOT NULL,
  PRIMARY KEY (id)
	
);


