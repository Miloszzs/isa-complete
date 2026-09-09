-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.4.32-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for isa_baza
CREATE DATABASE IF NOT EXISTS `isa_baza` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci */;
USE `isa_baza`;

-- Dumping structure for table isa_baza.categories
CREATE TABLE IF NOT EXISTS `categories` (
  `categoryId` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`categoryId`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table isa_baza.categories: ~9 rows (approximately)
INSERT INTO `categories` (`categoryId`, `name`) VALUES
	(1, 'Kafa'),
	(3, 'Coffee'),
	(4, 'Kafa u zrnu'),
	(5, 'Mlevena kafa'),
	(6, 'Arabica'),
	(7, 'Robusta'),
	(8, 'Blend'),
	(9, 'Single Origin');

-- Dumping structure for table isa_baza.orderitems
CREATE TABLE IF NOT EXISTS `orderitems` (
  `orderItemId` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` int(11) NOT NULL,
  `productId` int(11) DEFAULT NULL,
  `productName` varchar(255) NOT NULL,
  `quantity` int(11) NOT NULL,
  `unitPrice` decimal(10,2) NOT NULL,
  PRIMARY KEY (`orderItemId`),
  KEY `FK_orderitems_order` (`orderId`),
  KEY `FK_orderitems_product` (`productId`),
  CONSTRAINT `FK_orderitems_order` FOREIGN KEY (`orderId`) REFERENCES `orders` (`orderId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_orderitems_product` FOREIGN KEY (`productId`) REFERENCES `products` (`productsId`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table isa_baza.orderitems: ~4 rows (approximately)
INSERT INTO `orderitems` (`orderItemId`, `orderId`, `productId`, `productName`, `quantity`, `unitPrice`) VALUES
	(1, 1, 5, 'Ethiopia Sidamo Arabica 250g', 2, 899.00),
	(2, 1, 6, 'Brazil Santos Arabica 500g', 1, 1399.00),
	(3, 2, 10, 'House Coffee Blend 1kg', 2, 2199.00),
	(4, 2, 13, 'Domaca kafa 250g', 1, 500.00);

-- Dumping structure for table isa_baza.orders
CREATE TABLE IF NOT EXISTS `orders` (
  `orderId` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) DEFAULT NULL,
  `customerEmail` varchar(255) NOT NULL,
  `orderDate` datetime NOT NULL DEFAULT current_timestamp(),
  `totalPrice` decimal(10,2) NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'CREATED',
  PRIMARY KEY (`orderId`),
  KEY `FK_orders_user` (`userId`),
  CONSTRAINT `FK_orders_user` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table isa_baza.orders: ~2 rows (approximately)
INSERT INTO `orders` (`orderId`, `userId`, `customerEmail`, `orderDate`, `totalPrice`, `status`) VALUES
	(1, 5, 'marko@gmail.com', '2026-09-09 23:31:44', 3197.00, 'CREATED'),
	(2, 5, 'marko@gmail.com', '2026-09-10 00:01:33', 4898.00, 'CREATED');

-- Dumping structure for table isa_baza.productcategories
CREATE TABLE IF NOT EXISTS `productcategories` (
  `productCategoryId` int(11) NOT NULL AUTO_INCREMENT,
  `productId` int(11) NOT NULL,
  `categoryId` int(11) NOT NULL,
  PRIMARY KEY (`productCategoryId`),
  KEY `FK_productcategories_product` (`productId`),
  KEY `FK_productcategories_category` (`categoryId`),
  CONSTRAINT `FK_productcategories_category` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`categoryId`) ON UPDATE CASCADE,
  CONSTRAINT `FK_productcategories_product` FOREIGN KEY (`productId`) REFERENCES `products` (`productsId`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table isa_baza.productcategories: ~25 rows (approximately)
INSERT INTO `productcategories` (`productCategoryId`, `productId`, `categoryId`) VALUES
	(6, 5, 4),
	(7, 5, 6),
	(8, 5, 9),
	(9, 6, 4),
	(10, 6, 6),
	(11, 6, 9),
	(12, 7, 4),
	(13, 7, 6),
	(14, 7, 9),
	(18, 9, 4),
	(19, 9, 7),
	(20, 9, 9),
	(21, 10, 4),
	(22, 10, 8),
	(23, 11, 4),
	(24, 11, 8),
	(31, 12, 6),
	(32, 12, 9),
	(33, 12, 5),
	(34, 13, 6),
	(35, 13, 9),
	(36, 13, 4),
	(40, 14, 6),
	(41, 14, 9),
	(42, 14, 4);

-- Dumping structure for table isa_baza.products
CREATE TABLE IF NOT EXISTS `products` (
  `productsId` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `userId` int(11) NOT NULL,
  PRIMARY KEY (`productsId`),
  KEY `FK_userId` (`userId`),
  CONSTRAINT `FK_userId` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table isa_baza.products: ~9 rows (approximately)
INSERT INTO `products` (`productsId`, `name`, `price`, `userId`) VALUES
	(5, 'Ethiopia Sidamo Arabica 250g', 899.00, 6),
	(6, 'Brazil Santos Arabica 500g', 1399.00, 6),
	(7, 'Colombia Supremo Arabica 500g', 1499.00, 6),
	(9, 'India Cherry Robusta 500g', 1099.00, 6),
	(10, 'House Coffee Blend 1kg', 2199.00, 6),
	(11, 'Premium Crema Blend 500g', 1299.00, 6),
	(12, 'Ethiopia Sidamo Mlevena 300g', 1100.00, 6),
	(13, 'Domaca kafa 250g', 500.00, 6),
	(14, 'Kenya AA Arabica 250g', 1099.00, 6);

-- Dumping structure for table isa_baza.roles
CREATE TABLE IF NOT EXISTS `roles` (
  `roleId` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`roleId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table isa_baza.roles: ~2 rows (approximately)
INSERT INTO `roles` (`roleId`, `name`) VALUES
	(1, 'ADMIN'),
	(2, 'CUSTOMER');

-- Dumping structure for table isa_baza.userroles
CREATE TABLE IF NOT EXISTS `userroles` (
  `userRolesId` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `roleId` int(11) NOT NULL,
  PRIMARY KEY (`userRolesId`),
  UNIQUE KEY `uq_userroles_user_role` (`userId`,`roleId`),
  KEY `FK_userroles_roles` (`roleId`),
  CONSTRAINT `FK_userroles_roles` FOREIGN KEY (`roleId`) REFERENCES `roles` (`roleId`) ON UPDATE CASCADE,
  CONSTRAINT `FK_userroles_users` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table isa_baza.userroles: ~7 rows (approximately)
INSERT INTO `userroles` (`userRolesId`, `userId`, `roleId`) VALUES
	(1, 1, 2),
	(2, 4, 2),
	(3, 5, 2),
	(5, 6, 1),
	(4, 6, 2),
	(6, 7, 2),
	(7, 8, 2);

-- Dumping structure for table isa_baza.users
CREATE TABLE IF NOT EXISTS `users` (
  `userId` int(10) NOT NULL AUTO_INCREMENT,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `contactNumber` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`userId`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table isa_baza.users: ~7 rows (approximately)
INSERT INTO `users` (`userId`, `firstName`, `lastName`, `email`, `contactNumber`, `password`) VALUES
	(1, 'Radisa', 'Stojanovic', 'mejl@mail.rs', '062123456', 'sifra123'),
	(2, 'Uros', 'Urkedjani', 'drugi@mail.rs', '061321321', 'sifra123'),
	(4, 'Novi', 'Korisnik', 'proba@mejl.rs', '065525525', '$2a$10$OBE92d/pVBJpyz3lCxBixuFL9BEfLeawJxB.zZ6721iJNBcT9jhle'),
	(5, 'Marko', 'Hujdur', 'marko@gmail.com', '012662704', '$2a$10$RfRIf.uzrIH6Olf.KtTj9uzYXiGZ4rp1p93Ub5wg.3XB0HrzoADHW'),
	(6, 'Admin', 'Coffee', 'admin@coffeeshop.test', '0601234567', '$2a$10$GI5DpYxn0V5rkv5rc1VfJOYl9csTI/uF5z8AYCc2sCLE4LgyHzdbG'),
	(7, 'Provera', 'Registracije', 'provera.ab31182daef741b1961d19d959b2a5f7@example.test', '0601234567', '$2a$10$z9fpKiMerozqAdwoQgspB.U0NnDE./bEepRQAD6GUc.0GfYPaTEr6'),
	(8, 'Milos', 'Avram', 'avra@gmail.com', '061321321', '$2a$10$WlsRMIEpMN6LNai9/pmwpOz55Oy5Rwzgn/CWr02RyamXJf0GtAPla');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
