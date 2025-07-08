-- Create separate databases for each microservice
CREATE DATABASE IF NOT EXISTS user_management_db;
CREATE DATABASE IF NOT EXISTS order_management_db;
CREATE DATABASE IF NOT EXISTS product_management_db;

-- Create a user with privileges for all databases
CREATE USER IF NOT EXISTS 'microservice_user'@'%' IDENTIFIED BY 'password';
CREATE USER IF NOT EXISTS 'microservice_user'@'172.22.0.1' IDENTIFIED BY 'password';
CREATE USER IF NOT EXISTS 'microservice_user'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON user_management_db.* TO 'microservice_user'@'%';
GRANT ALL PRIVILEGES ON order_management_db.* TO 'microservice_user'@'%';
GRANT ALL PRIVILEGES ON product_management_db.* TO 'microservice_user'@'%';
GRANT ALL PRIVILEGES ON user_management_db.* TO 'microservice_user'@'172.22.0.1';
GRANT ALL PRIVILEGES ON order_management_db.* TO 'microservice_user'@'172.22.0.1';
GRANT ALL PRIVILEGES ON product_management_db.* TO 'microservice_user'@'172.22.0.1';
GRANT ALL PRIVILEGES ON user_management_db.* TO 'microservice_user'@'localhost';
GRANT ALL PRIVILEGES ON order_management_db.* TO 'microservice_user'@'localhost';
GRANT ALL PRIVILEGES ON product_management_db.* TO 'microservice_user'@'localhost';
FLUSH PRIVILEGES;
