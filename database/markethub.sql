-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: CNMarketHub
-- ------------------------------------------------------
-- Server version	8.0.45

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
-- Table structure for table `listings`
--

DROP TABLE IF EXISTS `listings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `listings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `category` varchar(100) NOT NULL,
  `location` varchar(255) NOT NULL,
  `time` varchar(100) DEFAULT NULL,
  `image` text,
  `is_featured` tinyint(1) DEFAULT '0',
  `description` text,
  `views` int DEFAULT '0',
  `saves` int DEFAULT '0',
  `inquiries` int DEFAULT '0',
  `user_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `contact_email` varchar(255) DEFAULT NULL,
  `contact_phone` varchar(50) DEFAULT NULL,
  `postal_code` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `listings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `listings`
--

LOCK TABLES `listings` WRITE;
/*!40000 ALTER TABLE `listings` DISABLE KEYS */;
INSERT INTO `listings` VALUES (1,'iPhone 13 Pro - 256GB - Unlocked - Mint Condition',850.00,'Electronics','Toronto, ON','2 hours ago','https://picsum.photos/seed/iphone/800/600',1,'Pristine condition iPhone 13 Pro. Fully unlocked and ready for a new owner.',142,12,5,1,'2026-02-22 17:33:24',NULL,NULL,NULL),(2,'2021 BMW M4 Competition - Low Mileage',78500.00,'Vehicles','Etobicoke, ON','45 mins ago','https://picsum.photos/seed/car1/800/600',1,'Low mileage, immaculate condition.',248,34,12,1,'2026-02-22 17:33:24',NULL,NULL,NULL),(3,'Brand New Running Shoes - Size 10',120.00,'Buy & Sell','North York, ON','5 hours ago','https://picsum.photos/seed/shoes/800/600',0,'Never worn. Box included.',89,4,2,2,'2026-02-22 17:33:24',NULL,NULL,NULL),(4,'Sony PlayStation 5 User - Like New',450.00,'Electronics','Vancouver, BC','3 hours ago','https://picsum.photos/seed/ps5/800/600',1,'Barely used PS5 console. Comes with 2 controllers and all cables.',304,45,8,3,'2026-02-22 17:41:41',NULL,NULL,NULL),(5,'Modern Leather Sofa',890.00,'Furniture','Calgary, AB','1 day ago','https://picsum.photos/seed/sofa/800/600',0,'Genuine leather sofa in excellent condition. Perfect for a modern living room.',120,15,2,4,'2026-02-22 17:41:41',NULL,NULL,NULL),(6,'2019 Toyota Rav4 XLE',25500.00,'Vehicles','Montreal, QC','2 days ago','https://picsum.photos/seed/rav4/800/600',1,'Reliable SUV, well maintained. Only 60,000 km. Clean title.',890,110,24,5,'2026-02-22 17:41:41',NULL,NULL,NULL),(7,'Downtown 2BR Condo with View',2800.00,'Real Estate','Toronto, ON','4 hours ago','https://picsum.photos/seed/condo2/800/600',1,'Spacious 2 bedroom condo right in the heart of the city. Gym and pool included.',1245,230,45,6,'2026-02-22 17:41:41',NULL,NULL,NULL),(8,'Apple Watch Series 7',250.00,'Electronics','Ottawa, ON','5 hours ago','https://picsum.photos/seed/watch/800/600',0,'Small scratch on the screen but works perfectly. Battery health 95%.',85,12,4,7,'2026-02-22 17:41:41',NULL,NULL,NULL),(9,'Vintage Oak Dining Table',450.00,'Furniture','Halifax, NS','1 week ago','https://picsum.photos/seed/table/800/600',0,'Beautiful solid oak dining table. Seats 6 comfortably.',210,34,5,8,'2026-02-22 17:41:41',NULL,NULL,NULL),(10,'2015 Honda Civic EX',12500.00,'Vehicles','Winnipeg, MB','3 days ago','https://picsum.photos/seed/civic/800/600',0,'Great commuter car. Extremely fuel efficient and reliable.',450,67,12,9,'2026-02-22 17:41:41',NULL,NULL,NULL),(11,'Professional DSLR Camera Kit',1200.00,'Electronics','Edmonton, AB','Just now','https://picsum.photos/seed/camera/800/600',1,'Canon EOS 5D Mark IV with 2 lenses and camera bag.',56,8,1,10,'2026-02-22 17:41:41',NULL,NULL,NULL),(12,'Cozy 1BR Apartment for Rent',1600.00,'Real Estate','Quebec City, QC','2 weeks ago','https://picsum.photos/seed/apt/800/600',0,'Quiet neighborhood, close to public transit. Utilities included.',670,89,15,3,'2026-02-22 17:41:41',NULL,NULL,NULL),(13,'Mountain Bike Handlebars',45.00,'Sports','Victoria, BC','6 hours ago','https://picsum.photos/seed/bike_part/800/600',0,'Carbon fiber handlebars, 780mm width. Excellent upgrade.',42,5,0,4,'2026-02-22 17:41:41',NULL,NULL,NULL),(14,'Designer Sunglasses',180.00,'Fashion','Toronto, ON','1 day ago','https://picsum.photos/seed/sunglasses/800/600',0,'Worn twice. Comes with original case and cleaning cloth.',134,22,3,5,'2026-02-22 17:41:41',NULL,NULL,NULL),(15,'Acoustic Guitar - Yamaha',200.00,'Musical Instruments','Regina, SK','4 days ago','https://picsum.photos/seed/guitar/800/600',1,'Perfect for beginners. Recently re-strung. Includes gig bag.',320,45,9,6,'2026-02-22 17:41:41',NULL,NULL,NULL),(16,'Golf Clubs Set',350.00,'Sports','Kelowna, BC','12 hours ago','https://picsum.photos/seed/golf/800/600',0,'Full set of Callaway irons and woods. Includes bag.',198,30,6,7,'2026-02-22 17:41:41',NULL,NULL,NULL),(17,'MacBook Air M1 2020',700.00,'Electronics','London, ON','2 hours ago','https://picsum.photos/seed/macbook/800/600',1,'Space gray, 8GB RAM, 256GB SSD. Flawless condition.',540,78,18,8,'2026-02-22 17:41:41',NULL,NULL,NULL),(18,'Leather Office Chair',150.00,'Furniture','Saskatoon, SK','5 days ago','https://picsum.photos/seed/chair/800/600',0,'Ergonomic leather chair. Very comfortable for long hours.',88,14,2,9,'2026-02-22 17:41:41',NULL,NULL,NULL),(19,'rtujytkkk',345.00,'Cars','rturuurtu','Just now','/uploads/1771782979732-92122521.png',0,'yyu4u6ui6',0,0,0,1,'2026-02-22 17:56:20',NULL,NULL,NULL),(20,'hupuhp',4154.00,'Baby Items','hphip[i[i[','Just now','[\"/uploads/1771783632570-935004675.jpg\",\"/uploads/1771783632593-844480740.jpg\",\"/uploads/1771783632599-891643384.jpeg\",\"/uploads/1771783632601-653486324.jpeg\",\"/uploads/1771783632602-610992297.jpeg\"]',0,'jjh[',0,0,0,1,'2026-02-22 18:07:12',NULL,NULL,NULL),(21,'Test Item',100.00,'Electronics','Vancouver','Just now','[\"/uploads/test.jpg\"]',0,'Testing images',0,0,0,NULL,'2026-02-22 18:17:58',NULL,NULL,NULL),(22,'jb;jgb;jh;',4241.00,'Baby Items','ftiygoyo','Just now','[\"/uploads/1771784981539-272006578.jpeg\",\"/uploads/1771784981540-807552202.png\",\"/uploads/1771784981541-951974687.jpeg\",\"/uploads/1771784981544-138333335.png\",\"/uploads/1771784981556-935539633.jpeg\"]',0,'hogyh',0,0,0,1,'2026-02-22 18:29:41',NULL,NULL,NULL);
/*!40000 ALTER TABLE `listings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(50) DEFAULT 'user',
  `avatar` varchar(255) DEFAULT NULL,
  `join_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `phone` varchar(50) DEFAULT '+1 (555) 123-4567',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Alex Johnson','alex.j@example.com','$2b$12$hHDMFcEwV6bI7AbqzYFaH.Lu2qB.4NswOrVutuuPAclfNzMxqRZnW','admin',NULL,'2026-02-22 17:33:24','+1 (555) 123-4567'),(2,'Test User','test@example.com','$2b$12$YCFn5xoJHkeAEvTSboN6.eMpPtyDEZAnj9dr62FSEDvtz.g/Vxmem','user',NULL,'2026-02-22 17:33:24','+1 (555) 123-4567'),(3,'Michael Smith','michael.s@example.com','$2b$12$dRxDF4zpNo/I0wLlMolH3OCSRq1vW//V4Je5TS7McS6n2YaTthx2G','user',NULL,'2026-02-12 17:41:41','+1 (555) 123-4567'),(4,'Sarah Connor','sarah.c@example.com','$2b$12$9L9.UWQP7EQ8p5pckwmPIOw0jPdLrxAcrI01nPfuBpMAF/A7.vDjq','user',NULL,'2026-01-08 17:41:41','+1 (555) 123-4567'),(5,'David Lee','david.l@example.com','$2b$12$JTqa0.75Ku/WJB8WTKIa9urT/1VKraK1hVdB2NggT1gXu3jFbWnSm','user',NULL,'2026-02-10 17:41:41','+1 (555) 123-4567'),(6,'Emily Chen','emily.c@example.com','$2b$12$43PinK1Tl.ZHKb1SMgLT3O1jR0Sn85gkFSC.6oCkgToVgFG0N4nMG','user',NULL,'2026-02-17 17:41:41','+1 (555) 123-4567'),(7,'James Wilson','james.w@example.com','$2b$12$fLywBksMxYcLLL92y53xcOCTfDJb3olzooBWGXMLctKnbi/qZVr5W','user',NULL,'2025-12-24 17:41:41','+1 (555) 123-4567'),(8,'Olivia Brown','olivia.b@example.com','$2b$12$ugVjFG82XkohCkn/85Eim.nB7tQq1YCltKbv1fDz9MaCzb9.0THee','user',NULL,'2026-01-23 17:41:41','+1 (555) 123-4567'),(9,'William Taylor','william.t@example.com','$2b$12$ukIfHPUjkg8ZrWdPnd6f5.i2hVGIwkEIkX6XiaRS3JKlOeBIv.lHC','user',NULL,'2026-02-21 17:41:41','+1 (555) 123-4567'),(10,'Sophia Anderson','sophia.a@example.com','$2b$12$ItKvHS.9UBZ6dOHoj33kRex.B.ltFRP3ZIG9Hj4dsO2ggceMKXrH.','user',NULL,'2025-12-04 17:41:41','+1 (555) 123-4567'),(11,'Daniel Martinez','daniel.m@example.com','$2b$12$Q7IF0.XvcMOhLzdxdKtDKOWzPyhqhObLncyi4O15iJvPVhUitQQ9O','user',NULL,'2026-02-02 17:41:41','+1 (555) 123-4567'),(12,'Ava Thomas','ava.t@example.com','$2b$12$ud2UX.MbcQMxy4iYfp/z7Obrb2C4JnLwB7MZe8x7wHv7CRg4aWXuu','user',NULL,'2026-01-03 17:41:41','+1 (555) 123-4567'),(13,'rtrtnjrtjrj','test@email.com','$2b$12$mArQonRyO3XbLG7/cLH1vOeAos1foAl7jaVwG61W5.6jkh6IbFB12','user',NULL,'2026-02-22 18:01:34','+1 (555) 123-4567'),(14,'test','test123@email.com','$2y$12$4cYn5J/CdfYMY3IMFGbx.ug/AGfybkZO8hSvUUE..3j05LiyYorLu','user','https://api.dicebear.com/7.x/avataaars/svg?seed=test','2026-03-01 16:51:18','+1 (555) 123-4567');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-01 22:41:56
