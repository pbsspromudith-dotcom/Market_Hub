-- ============================================
-- Database Export: CNMarketHub
-- Generated: 2026-05-06 04:10:02
-- ============================================

CREATE DATABASE IF NOT EXISTS `CNMarketHub` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `CNMarketHub`;

SET FOREIGN_KEY_CHECKS = 0;

-- -------------------------------------------
-- Table: `email_settings`
-- -------------------------------------------
DROP TABLE IF EXISTS `email_settings`;
CREATE TABLE `email_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `setting_key` (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------
-- Table: `listings`
-- -------------------------------------------
DROP TABLE IF EXISTS `listings`;
CREATE TABLE `listings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `category` varchar(100) NOT NULL,
  `location` varchar(255) NOT NULL,
  `time` varchar(100) DEFAULT NULL,
  `image` text DEFAULT NULL,
  `is_featured` tinyint(1) DEFAULT 0,
  `description` text DEFAULT NULL,
  `views` int(11) DEFAULT 0,
  `saves` int(11) DEFAULT 0,
  `inquiries` int(11) DEFAULT 0,
  `user_id` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `contact_email` varchar(255) DEFAULT NULL,
  `contact_phone` varchar(50) DEFAULT NULL,
  `postal_code` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `listings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `listings` (`id`, `title`, `price`, `category`, `location`, `time`, `image`, `is_featured`, `description`, `views`, `saves`, `inquiries`, `user_id`, `created_at`, `contact_email`, `contact_phone`, `postal_code`) VALUES ('1', 'iPhone 13 Pro - 256GB - Unlocked - Mint Condition', '850.00', 'Electronics', 'Toronto, ON', '2 hours ago', 'https://picsum.photos/seed/iphone/800/600', '1', 'Pristine condition iPhone 13 Pro. Fully unlocked and ready for a new owner.', '142', '12', '5', '1', '2026-02-22 23:03:24', NULL, NULL, NULL);
INSERT INTO `listings` (`id`, `title`, `price`, `category`, `location`, `time`, `image`, `is_featured`, `description`, `views`, `saves`, `inquiries`, `user_id`, `created_at`, `contact_email`, `contact_phone`, `postal_code`) VALUES ('2', '2021 BMW M4 Competition - Low Mileage', '78500.00', 'Vehicles', 'Etobicoke, ON', '45 mins ago', 'https://picsum.photos/seed/car1/800/600', '1', 'Low mileage, immaculate condition.', '248', '34', '12', '1', '2026-02-22 23:03:24', NULL, NULL, NULL);
INSERT INTO `listings` (`id`, `title`, `price`, `category`, `location`, `time`, `image`, `is_featured`, `description`, `views`, `saves`, `inquiries`, `user_id`, `created_at`, `contact_email`, `contact_phone`, `postal_code`) VALUES ('3', 'Brand New Running Shoes - Size 10', '120.00', 'Buy & Sell', 'North York, ON', '5 hours ago', 'https://picsum.photos/seed/shoes/800/600', '0', 'Never worn. Box included.', '89', '4', '2', '2', '2026-02-22 23:03:24', NULL, NULL, NULL);
INSERT INTO `listings` (`id`, `title`, `price`, `category`, `location`, `time`, `image`, `is_featured`, `description`, `views`, `saves`, `inquiries`, `user_id`, `created_at`, `contact_email`, `contact_phone`, `postal_code`) VALUES ('4', 'Sony PlayStation 5 User - Like New', '450.00', 'Electronics', 'Vancouver, BC', '3 hours ago', 'https://picsum.photos/seed/ps5/800/600', '1', 'Barely used PS5 console. Comes with 2 controllers and all cables.', '304', '45', '8', '3', '2026-02-22 23:11:41', NULL, NULL, NULL);
INSERT INTO `listings` (`id`, `title`, `price`, `category`, `location`, `time`, `image`, `is_featured`, `description`, `views`, `saves`, `inquiries`, `user_id`, `created_at`, `contact_email`, `contact_phone`, `postal_code`) VALUES ('5', 'Modern Leather Sofa', '890.00', 'Furniture', 'Calgary, AB', '1 day ago', 'https://picsum.photos/seed/sofa/800/600', '0', 'Genuine leather sofa in excellent condition. Perfect for a modern living room.', '120', '15', '2', '4', '2026-02-22 23:11:41', NULL, NULL, NULL);
INSERT INTO `listings` (`id`, `title`, `price`, `category`, `location`, `time`, `image`, `is_featured`, `description`, `views`, `saves`, `inquiries`, `user_id`, `created_at`, `contact_email`, `contact_phone`, `postal_code`) VALUES ('6', '2019 Toyota Rav4 XLE', '25500.00', 'Vehicles', 'Montreal, QC', '2 days ago', 'https://picsum.photos/seed/rav4/800/600', '1', 'Reliable SUV, well maintained. Only 60,000 km. Clean title.', '890', '110', '24', '5', '2026-02-22 23:11:41', NULL, NULL, NULL);
INSERT INTO `listings` (`id`, `title`, `price`, `category`, `location`, `time`, `image`, `is_featured`, `description`, `views`, `saves`, `inquiries`, `user_id`, `created_at`, `contact_email`, `contact_phone`, `postal_code`) VALUES ('7', 'Downtown 2BR Condo with View', '2800.00', 'Real Estate', 'Toronto, ON', '4 hours ago', 'https://picsum.photos/seed/condo2/800/600', '1', 'Spacious 2 bedroom condo right in the heart of the city. Gym and pool included.', '1245', '230', '45', '6', '2026-02-22 23:11:41', NULL, NULL, NULL);
INSERT INTO `listings` (`id`, `title`, `price`, `category`, `location`, `time`, `image`, `is_featured`, `description`, `views`, `saves`, `inquiries`, `user_id`, `created_at`, `contact_email`, `contact_phone`, `postal_code`) VALUES ('8', 'Apple Watch Series 7', '250.00', 'Electronics', 'Ottawa, ON', '5 hours ago', 'https://picsum.photos/seed/watch/800/600', '0', 'Small scratch on the screen but works perfectly. Battery health 95%.', '85', '12', '4', '7', '2026-02-22 23:11:41', NULL, NULL, NULL);
INSERT INTO `listings` (`id`, `title`, `price`, `category`, `location`, `time`, `image`, `is_featured`, `description`, `views`, `saves`, `inquiries`, `user_id`, `created_at`, `contact_email`, `contact_phone`, `postal_code`) VALUES ('9', 'Vintage Oak Dining Table', '450.00', 'Furniture', 'Halifax, NS', '1 week ago', 'https://picsum.photos/seed/table/800/600', '0', 'Beautiful solid oak dining table. Seats 6 comfortably.', '210', '34', '5', '8', '2026-02-22 23:11:41', NULL, NULL, NULL);
INSERT INTO `listings` (`id`, `title`, `price`, `category`, `location`, `time`, `image`, `is_featured`, `description`, `views`, `saves`, `inquiries`, `user_id`, `created_at`, `contact_email`, `contact_phone`, `postal_code`) VALUES ('10', '2015 Honda Civic EX', '12500.00', 'Vehicles', 'Winnipeg, MB', '3 days ago', 'https://picsum.photos/seed/civic/800/600', '0', 'Great commuter car. Extremely fuel efficient and reliable.', '450', '67', '12', '9', '2026-02-22 23:11:41', NULL, NULL, NULL);
INSERT INTO `listings` (`id`, `title`, `price`, `category`, `location`, `time`, `image`, `is_featured`, `description`, `views`, `saves`, `inquiries`, `user_id`, `created_at`, `contact_email`, `contact_phone`, `postal_code`) VALUES ('11', 'Professional DSLR Camera Kit', '1200.00', 'Electronics', 'Edmonton, AB', 'Just now', 'https://picsum.photos/seed/camera/800/600', '1', 'Canon EOS 5D Mark IV with 2 lenses and camera bag.', '56', '8', '1', '10', '2026-02-22 23:11:41', NULL, NULL, NULL);
INSERT INTO `listings` (`id`, `title`, `price`, `category`, `location`, `time`, `image`, `is_featured`, `description`, `views`, `saves`, `inquiries`, `user_id`, `created_at`, `contact_email`, `contact_phone`, `postal_code`) VALUES ('12', 'Cozy 1BR Apartment for Rent', '1600.00', 'Real Estate', 'Quebec City, QC', '2 weeks ago', 'https://picsum.photos/seed/apt/800/600', '0', 'Quiet neighborhood, close to public transit. Utilities included.', '670', '89', '15', '3', '2026-02-22 23:11:41', NULL, NULL, NULL);
INSERT INTO `listings` (`id`, `title`, `price`, `category`, `location`, `time`, `image`, `is_featured`, `description`, `views`, `saves`, `inquiries`, `user_id`, `created_at`, `contact_email`, `contact_phone`, `postal_code`) VALUES ('13', 'Mountain Bike Handlebars', '45.00', 'Sports', 'Victoria, BC', '6 hours ago', 'https://picsum.photos/seed/bike_part/800/600', '0', 'Carbon fiber handlebars, 780mm width. Excellent upgrade.', '42', '5', '0', '4', '2026-02-22 23:11:41', NULL, NULL, NULL);
INSERT INTO `listings` (`id`, `title`, `price`, `category`, `location`, `time`, `image`, `is_featured`, `description`, `views`, `saves`, `inquiries`, `user_id`, `created_at`, `contact_email`, `contact_phone`, `postal_code`) VALUES ('14', 'Designer Sunglasses', '180.00', 'Fashion', 'Toronto, ON', '1 day ago', 'https://picsum.photos/seed/sunglasses/800/600', '0', 'Worn twice. Comes with original case and cleaning cloth.', '134', '22', '3', '5', '2026-02-22 23:11:41', NULL, NULL, NULL);
INSERT INTO `listings` (`id`, `title`, `price`, `category`, `location`, `time`, `image`, `is_featured`, `description`, `views`, `saves`, `inquiries`, `user_id`, `created_at`, `contact_email`, `contact_phone`, `postal_code`) VALUES ('15', 'Acoustic Guitar - Yamaha', '200.00', 'Musical Instruments', 'Regina, SK', '4 days ago', 'https://picsum.photos/seed/guitar/800/600', '1', 'Perfect for beginners. Recently re-strung. Includes gig bag.', '320', '45', '9', '6', '2026-02-22 23:11:41', NULL, NULL, NULL);
INSERT INTO `listings` (`id`, `title`, `price`, `category`, `location`, `time`, `image`, `is_featured`, `description`, `views`, `saves`, `inquiries`, `user_id`, `created_at`, `contact_email`, `contact_phone`, `postal_code`) VALUES ('16', 'Golf Clubs Set', '350.00', 'Sports', 'Kelowna, BC', '12 hours ago', 'https://picsum.photos/seed/golf/800/600', '0', 'Full set of Callaway irons and woods. Includes bag.', '198', '30', '6', '7', '2026-02-22 23:11:41', NULL, NULL, NULL);
INSERT INTO `listings` (`id`, `title`, `price`, `category`, `location`, `time`, `image`, `is_featured`, `description`, `views`, `saves`, `inquiries`, `user_id`, `created_at`, `contact_email`, `contact_phone`, `postal_code`) VALUES ('17', 'MacBook Air M1 2020', '700.00', 'Electronics', 'London, ON', '2 hours ago', 'https://picsum.photos/seed/macbook/800/600', '1', 'Space gray, 8GB RAM, 256GB SSD. Flawless condition.', '540', '78', '18', '8', '2026-02-22 23:11:41', NULL, NULL, NULL);
INSERT INTO `listings` (`id`, `title`, `price`, `category`, `location`, `time`, `image`, `is_featured`, `description`, `views`, `saves`, `inquiries`, `user_id`, `created_at`, `contact_email`, `contact_phone`, `postal_code`) VALUES ('18', 'Leather Office Chair', '150.00', 'Furniture', 'Saskatoon, SK', '5 days ago', 'https://picsum.photos/seed/chair/800/600', '0', 'Ergonomic leather chair. Very comfortable for long hours.', '88', '14', '2', '9', '2026-02-22 23:11:41', NULL, NULL, NULL);
INSERT INTO `listings` (`id`, `title`, `price`, `category`, `location`, `time`, `image`, `is_featured`, `description`, `views`, `saves`, `inquiries`, `user_id`, `created_at`, `contact_email`, `contact_phone`, `postal_code`) VALUES ('19', 'rtujytkkk', '345.00', 'Cars', 'rturuurtu', 'Just now', '/uploads/1771782979732-92122521.png', '0', 'yyu4u6ui6', '0', '0', '0', '1', '2026-02-22 23:26:20', NULL, NULL, NULL);
INSERT INTO `listings` (`id`, `title`, `price`, `category`, `location`, `time`, `image`, `is_featured`, `description`, `views`, `saves`, `inquiries`, `user_id`, `created_at`, `contact_email`, `contact_phone`, `postal_code`) VALUES ('20', 'hupuhp', '4154.00', 'Baby Items', 'hphip[i[i[', 'Just now', '[\"/uploads/1771783632570-935004675.jpg\",\"/uploads/1771783632593-844480740.jpg\",\"/uploads/1771783632599-891643384.jpeg\",\"/uploads/1771783632601-653486324.jpeg\",\"/uploads/1771783632602-610992297.jpeg\"]', '0', 'jjh[', '0', '0', '0', '1', '2026-02-22 23:37:12', NULL, NULL, NULL);
INSERT INTO `listings` (`id`, `title`, `price`, `category`, `location`, `time`, `image`, `is_featured`, `description`, `views`, `saves`, `inquiries`, `user_id`, `created_at`, `contact_email`, `contact_phone`, `postal_code`) VALUES ('21', 'Test Item', '100.00', 'Electronics', 'Vancouver', 'Just now', '[\"/uploads/test.jpg\"]', '0', 'Testing images', '0', '0', '0', NULL, '2026-02-22 23:47:58', NULL, NULL, NULL);
INSERT INTO `listings` (`id`, `title`, `price`, `category`, `location`, `time`, `image`, `is_featured`, `description`, `views`, `saves`, `inquiries`, `user_id`, `created_at`, `contact_email`, `contact_phone`, `postal_code`) VALUES ('22', 'jb;jgb;jh;', '4241.00', 'Baby Items', 'ftiygoyo', 'Just now', '[\"/uploads/1771784981539-272006578.jpeg\",\"/uploads/1771784981540-807552202.png\",\"/uploads/1771784981541-951974687.jpeg\",\"/uploads/1771784981544-138333335.png\",\"/uploads/1771784981556-935539633.jpeg\"]', '0', 'hogyh', '0', '0', '0', '1', '2026-02-22 23:59:41', NULL, NULL, NULL);
INSERT INTO `listings` (`id`, `title`, `price`, `category`, `location`, `time`, `image`, `is_featured`, `description`, `views`, `saves`, `inquiries`, `user_id`, `created_at`, `contact_email`, `contact_phone`, `postal_code`) VALUES ('23', 'Car', '200.00', 'Cars', 'te', 'Just now', '[\"\\/api\\/uploads\\/1776469408658-406735265.jpg\",\"\\/api\\/uploads\\/1776469408662-726503699.jpg\",\"\\/api\\/uploads\\/1776469408664-525487226.jpg\",\"\\/api\\/uploads\\/1776469408666-636563066.jpg\",\"\\/api\\/uploads\\/1776469408667-114119902.jpg\"]', '0', 'Features: Alloy Wheels\n\n', '0', '0', '0', '1', '2026-04-18 05:13:28', 'yomalpbss@gmail.com', '', '');
INSERT INTO `listings` (`id`, `title`, `price`, `category`, `location`, `time`, `image`, `is_featured`, `description`, `views`, `saves`, `inquiries`, `user_id`, `created_at`, `contact_email`, `contact_phone`, `postal_code`) VALUES ('24', 'Civic', '500.00', 'Cars', 'tor', 'Just now', '[\"\\/api\\/uploads\\/1776470362637-591588700.jpg\",\"\\/api\\/uploads\\/1776470362653-365992630.jpg\",\"\\/api\\/uploads\\/1776470362654-586252535.jpg\",\"\\/api\\/uploads\\/1776470362656-507915679.jpg\",\"\\/api\\/uploads\\/1776470362657-649304945.jpg\"]', '0', 'Transmission: Manual\nFuel Type: Diesel\nBody Type: Wagon\nDrivetrain: RWD\nDoors: 4\nFeatures: Alloy Wheels, Bluetooth, Cruise Control, Navigation System, Sunroof/Moonroof, Backup Camera, Leather Seats, Remote Start, Blind Spot Monitor, Heated Seats\n\n', '0', '0', '0', '1', '2026-04-18 05:29:22', '', '', '');
INSERT INTO `listings` (`id`, `title`, `price`, `category`, `location`, `time`, `image`, `is_featured`, `description`, `views`, `saves`, `inquiries`, `user_id`, `created_at`, `contact_email`, `contact_phone`, `postal_code`) VALUES ('25', 'xfjfj', '1.00', 'Cars', 'nfm', 'Just now', '[\"\\/api\\/uploads\\/1777852417274-645897947.jpg\",\"\\/api\\/uploads\\/1777852417278-859837251.png\",\"\\/api\\/uploads\\/1777852417279-110560503.png\",\"\\/api\\/uploads\\/1777852417280-721280641.webp\",\"\\/api\\/uploads\\/1777852417281-535441520.jpg\"]', '0', '', '0', '0', '0', '1', '2026-05-04 05:23:37', '', '', '');
INSERT INTO `listings` (`id`, `title`, `price`, `category`, `location`, `time`, `image`, `is_featured`, `description`, `views`, `saves`, `inquiries`, `user_id`, `created_at`, `contact_email`, `contact_phone`, `postal_code`) VALUES ('26', 'dhdshdsjh', '111.00', 'Cars', 'cbc', 'Just now', '[\"\\/api\\/uploads\\/1777852544133-927789334.jpg\",\"\\/api\\/uploads\\/1777852544135-264356083.png\",\"\\/api\\/uploads\\/1777852544136-307547673.jpg\",\"\\/api\\/uploads\\/1777852544136-835714101.jpg\",\"\\/api\\/uploads\\/1777852544138-939978528.jpg\"]', '0', '', '0', '0', '0', '13', '2026-05-04 05:25:44', '', '', '');

-- -------------------------------------------
-- Table: `options`
-- -------------------------------------------
DROP TABLE IF EXISTS `options`;
CREATE TABLE `options` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `option_type` varchar(100) NOT NULL,
  `option_value` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `options` (`id`, `option_type`, `option_value`, `created_at`) VALUES ('1', 'category', 'Cars', '2026-04-18 05:00:10');
INSERT INTO `options` (`id`, `option_type`, `option_value`, `created_at`) VALUES ('2', 'category', 'Real Estate', '2026-04-18 05:00:10');
INSERT INTO `options` (`id`, `option_type`, `option_value`, `created_at`) VALUES ('3', 'category', 'Electronics', '2026-04-18 05:00:10');
INSERT INTO `options` (`id`, `option_type`, `option_value`, `created_at`) VALUES ('4', 'category', 'Home & Garden', '2026-04-18 05:00:10');
INSERT INTO `options` (`id`, `option_type`, `option_value`, `created_at`) VALUES ('5', 'category', 'Jobs', '2026-04-18 05:00:10');
INSERT INTO `options` (`id`, `option_type`, `option_value`, `created_at`) VALUES ('6', 'car_make', 'Toyota', '2026-04-18 05:00:10');
INSERT INTO `options` (`id`, `option_type`, `option_value`, `created_at`) VALUES ('7', 'car_make', 'Honda', '2026-04-18 05:00:10');
INSERT INTO `options` (`id`, `option_type`, `option_value`, `created_at`) VALUES ('8', 'car_make', 'Ford', '2026-04-18 05:00:10');
INSERT INTO `options` (`id`, `option_type`, `option_value`, `created_at`) VALUES ('9', 'car_make', 'BMW', '2026-04-18 05:00:10');
INSERT INTO `options` (`id`, `option_type`, `option_value`, `created_at`) VALUES ('10', 'car_model', 'Civic', '2026-04-18 05:00:10');
INSERT INTO `options` (`id`, `option_type`, `option_value`, `created_at`) VALUES ('11', 'car_model', 'Corolla', '2026-04-18 05:00:10');
INSERT INTO `options` (`id`, `option_type`, `option_value`, `created_at`) VALUES ('12', 'car_model', 'F-150', '2026-04-18 05:00:10');
INSERT INTO `options` (`id`, `option_type`, `option_value`, `created_at`) VALUES ('13', 'car_model', 'M4', '2026-04-18 05:00:10');
INSERT INTO `options` (`id`, `option_type`, `option_value`, `created_at`) VALUES ('14', 'car_type', 'Sedan', '2026-04-18 05:00:10');
INSERT INTO `options` (`id`, `option_type`, `option_value`, `created_at`) VALUES ('15', 'car_type', 'SUV', '2026-04-18 05:00:10');
INSERT INTO `options` (`id`, `option_type`, `option_value`, `created_at`) VALUES ('16', 'car_type', 'Truck', '2026-04-18 05:00:10');

-- -------------------------------------------
-- Table: `users`
-- -------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(50) DEFAULT 'user',
  `avatar` varchar(255) DEFAULT NULL,
  `join_date` timestamp NULL DEFAULT current_timestamp(),
  `phone` varchar(50) DEFAULT '+1 (555) 123-4567',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `avatar`, `join_date`, `phone`) VALUES ('1', 'Alex Johnson', 'alex.j@example.com', '$2b$12$hHDMFcEwV6bI7AbqzYFaH.Lu2qB.4NswOrVutuuPAclfNzMxqRZnW', 'admin', NULL, '2026-02-22 23:03:24', '+1 (555) 123-4567');
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `avatar`, `join_date`, `phone`) VALUES ('2', 'Test User', 'test@example.com', '$2b$12$YCFn5xoJHkeAEvTSboN6.eMpPtyDEZAnj9dr62FSEDvtz.g/Vxmem', 'user', NULL, '2026-02-22 23:03:24', '+1 (555) 123-4567');
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `avatar`, `join_date`, `phone`) VALUES ('3', 'Michael Smith', 'michael.s@example.com', '$2b$12$dRxDF4zpNo/I0wLlMolH3OCSRq1vW//V4Je5TS7McS6n2YaTthx2G', 'user', NULL, '2026-02-12 23:11:41', '+1 (555) 123-4567');
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `avatar`, `join_date`, `phone`) VALUES ('4', 'Sarah Connor', 'sarah.c@example.com', '$2b$12$9L9.UWQP7EQ8p5pckwmPIOw0jPdLrxAcrI01nPfuBpMAF/A7.vDjq', 'user', NULL, '2026-01-08 23:11:41', '+1 (555) 123-4567');
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `avatar`, `join_date`, `phone`) VALUES ('5', 'David Lee', 'david.l@example.com', '$2b$12$JTqa0.75Ku/WJB8WTKIa9urT/1VKraK1hVdB2NggT1gXu3jFbWnSm', 'user', NULL, '2026-02-10 23:11:41', '+1 (555) 123-4567');
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `avatar`, `join_date`, `phone`) VALUES ('6', 'Emily Chen', 'emily.c@example.com', '$2b$12$43PinK1Tl.ZHKb1SMgLT3O1jR0Sn85gkFSC.6oCkgToVgFG0N4nMG', 'user', NULL, '2026-02-17 23:11:41', '+1 (555) 123-4567');
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `avatar`, `join_date`, `phone`) VALUES ('7', 'James Wilson', 'james.w@example.com', '$2b$12$fLywBksMxYcLLL92y53xcOCTfDJb3olzooBWGXMLctKnbi/qZVr5W', 'user', NULL, '2025-12-24 23:11:41', '+1 (555) 123-4567');
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `avatar`, `join_date`, `phone`) VALUES ('8', 'Olivia Brown', 'olivia.b@example.com', '$2b$12$ugVjFG82XkohCkn/85Eim.nB7tQq1YCltKbv1fDz9MaCzb9.0THee', 'user', NULL, '2026-01-23 23:11:41', '+1 (555) 123-4567');
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `avatar`, `join_date`, `phone`) VALUES ('9', 'William Taylor', 'william.t@example.com', '$2b$12$ukIfHPUjkg8ZrWdPnd6f5.i2hVGIwkEIkX6XiaRS3JKlOeBIv.lHC', 'user', NULL, '2026-02-21 23:11:41', '+1 (555) 123-4567');
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `avatar`, `join_date`, `phone`) VALUES ('10', 'Sophia Anderson', 'sophia.a@example.com', '$2b$12$ItKvHS.9UBZ6dOHoj33kRex.B.ltFRP3ZIG9Hj4dsO2ggceMKXrH.', 'user', NULL, '2025-12-04 23:11:41', '+1 (555) 123-4567');
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `avatar`, `join_date`, `phone`) VALUES ('11', 'Daniel Martinez', 'daniel.m@example.com', '$2b$12$Q7IF0.XvcMOhLzdxdKtDKOWzPyhqhObLncyi4O15iJvPVhUitQQ9O', 'user', NULL, '2026-02-02 23:11:41', '+1 (555) 123-4567');
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `avatar`, `join_date`, `phone`) VALUES ('12', 'Ava Thomas', 'ava.t@example.com', '$2b$12$ud2UX.MbcQMxy4iYfp/z7Obrb2C4JnLwB7MZe8x7wHv7CRg4aWXuu', 'user', NULL, '2026-01-03 23:11:41', '+1 (555) 123-4567');
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `avatar`, `join_date`, `phone`) VALUES ('13', 'rtrtnjrtjrj', 'test@email.com', '$2y$10$9Qb/boB.lMuw7g/S.scC0uxU64btnfepmR00uN0OaBlHJ8uWqL6Hm', 'user', NULL, '2026-02-22 23:31:34', '+1 (555) 123-4567');
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `avatar`, `join_date`, `phone`) VALUES ('14', 'test', 'test123@email.com', '$2y$12$4cYn5J/CdfYMY3IMFGbx.ug/AGfybkZO8hSvUUE..3j05LiyYorLu', 'user', 'https://api.dicebear.com/7.x/avataaars/svg?seed=test', '2026-03-01 22:21:18', '+1 (555) 123-4567');
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `avatar`, `join_date`, `phone`) VALUES ('15', 'Test', 'pbsspromudith@gmail.com', '$2y$12$9Z6KULOBoV4mqxRmSaTaP.9tGb6Wb6YRJLvtlIt8.RWcs/F0kJdA6', 'user', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Test', '2026-05-02 20:10:54', '+1 (555) 123-4567');
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `avatar`, `join_date`, `phone`) VALUES ('16', 'Test', 'test@gmail.com', '$2y$12$AYuxa935Xa2EQNMU3XT4mucmo.E2EcWDgW3l2NPXCe0en.jU8lMS6', 'user', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Test', '2026-05-04 05:14:51', '+1 (555) 123-4567');

SET FOREIGN_KEY_CHECKS = 1;
