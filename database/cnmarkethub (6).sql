-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 25, 2026 at 06:16 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cnmarkethub`
--

-- --------------------------------------------------------

--
-- Table structure for table `car_makes`
--

CREATE TABLE `car_makes` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `car_makes`
--

INSERT INTO `car_makes` (`id`, `name`, `created_at`) VALUES
(5, 'Toyota', '2026-05-10 18:50:01'),
(6, 'Honda', '2026-05-10 18:50:01'),
(7, 'Ford', '2026-05-10 18:50:01'),
(8, 'BMW', '2026-05-10 18:50:01'),
(9, 'Chevrolet', '2026-05-10 18:50:01'),
(10, 'Nissan', '2026-05-10 18:50:01'),
(11, 'Mercedes-Benz', '2026-05-10 18:50:01'),
(12, 'Audi', '2026-05-10 18:50:01'),
(13, 'Volkswagen', '2026-05-10 18:50:01'),
(14, 'Hyundai', '2026-05-10 18:50:01'),
(15, 'Kia', '2026-05-10 18:50:01'),
(16, 'Subaru', '2026-05-10 18:50:01'),
(17, 'Mazda', '2026-05-10 18:50:01'),
(18, 'Lexus', '2026-05-10 18:50:01'),
(19, 'Jeep', '2026-05-10 18:50:01'),
(20, 'Tesla', '2026-05-10 18:50:01'),
(21, 'Porsche', '2026-05-10 18:50:01');

-- --------------------------------------------------------

--
-- Table structure for table `car_models`
--

CREATE TABLE `car_models` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `make_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `car_models`
--

INSERT INTO `car_models` (`id`, `name`, `make_id`, `created_at`) VALUES
(5, 'Camry', 5, '2026-05-10 18:50:01'),
(6, 'Corolla', 5, '2026-05-10 18:50:01'),
(7, 'RAV4', 5, '2026-05-10 18:50:01'),
(8, 'Highlander', 5, '2026-05-10 18:50:01'),
(9, 'Tacoma', 5, '2026-05-10 18:50:01'),
(10, 'Tundra', 5, '2026-05-10 18:50:01'),
(11, 'Prius', 5, '2026-05-10 18:50:01'),
(12, '4Runner', 5, '2026-05-10 18:50:01'),
(13, 'Sienna', 5, '2026-05-10 18:50:01'),
(14, 'Yaris', 5, '2026-05-10 18:50:01'),
(15, 'Land Cruiser', 5, '2026-05-10 18:50:01'),
(16, 'Civic', 6, '2026-05-10 18:50:01'),
(17, 'Accord', 6, '2026-05-10 18:50:01'),
(18, 'CR-V', 6, '2026-05-10 18:50:01'),
(19, 'Pilot', 6, '2026-05-10 18:50:01'),
(20, 'Odyssey', 6, '2026-05-10 18:50:01'),
(21, 'Fit', 6, '2026-05-10 18:50:01'),
(22, 'HR-V', 6, '2026-05-10 18:50:01'),
(23, 'Ridgeline', 6, '2026-05-10 18:50:01'),
(24, 'Passport', 6, '2026-05-10 18:50:01'),
(25, 'F-150', 7, '2026-05-10 18:50:01'),
(26, 'Mustang', 7, '2026-05-10 18:50:01'),
(27, 'Explorer', 7, '2026-05-10 18:50:01'),
(28, 'Escape', 7, '2026-05-10 18:50:01'),
(29, 'Focus', 7, '2026-05-10 18:50:01'),
(30, 'Edge', 7, '2026-05-10 18:50:01'),
(31, 'Ranger', 7, '2026-05-10 18:50:01'),
(32, 'Expedition', 7, '2026-05-10 18:50:01'),
(33, 'Bronco', 7, '2026-05-10 18:50:01'),
(34, '3 Series', 8, '2026-05-10 18:50:01'),
(35, '5 Series', 8, '2026-05-10 18:50:01'),
(36, 'X3', 8, '2026-05-10 18:50:01'),
(37, 'X5', 8, '2026-05-10 18:50:01'),
(38, 'M3', 8, '2026-05-10 18:50:01'),
(39, 'M4', 8, '2026-05-10 18:50:01'),
(40, '7 Series', 8, '2026-05-10 18:50:01'),
(41, 'X7', 8, '2026-05-10 18:50:01'),
(42, '4 Series', 8, '2026-05-10 18:50:01'),
(43, 'X1', 8, '2026-05-10 18:50:01'),
(44, 'Silverado', 9, '2026-05-10 18:50:01'),
(45, 'Equinox', 9, '2026-05-10 18:50:01'),
(46, 'Malibu', 9, '2026-05-10 18:50:01'),
(47, 'Tahoe', 9, '2026-05-10 18:50:01'),
(48, 'Camaro', 9, '2026-05-10 18:50:01'),
(49, 'Corvette', 9, '2026-05-10 18:50:01'),
(50, 'Colorado', 9, '2026-05-10 18:50:01'),
(51, 'Suburban', 9, '2026-05-10 18:50:01'),
(52, 'Traverse', 9, '2026-05-10 18:50:01'),
(53, 'Altima', 10, '2026-05-10 18:50:01'),
(54, 'Sentra', 10, '2026-05-10 18:50:01'),
(55, 'Rogue', 10, '2026-05-10 18:50:01'),
(56, 'Pathfinder', 10, '2026-05-10 18:50:01'),
(57, 'Maxima', 10, '2026-05-10 18:50:01'),
(58, 'Titan', 10, '2026-05-10 18:50:01'),
(59, 'Frontier', 10, '2026-05-10 18:50:01'),
(60, 'Murano', 10, '2026-05-10 18:50:01'),
(61, 'Versa', 10, '2026-05-10 18:50:01'),
(62, 'C-Class', 11, '2026-05-10 18:50:01'),
(63, 'E-Class', 11, '2026-05-10 18:50:01'),
(64, 'GLC', 11, '2026-05-10 18:50:01'),
(65, 'GLE', 11, '2026-05-10 18:50:01'),
(66, 'S-Class', 11, '2026-05-10 18:50:01'),
(67, 'A-Class', 11, '2026-05-10 18:50:01'),
(68, 'GLA', 11, '2026-05-10 18:50:01'),
(69, 'GLS', 11, '2026-05-10 18:50:01'),
(70, 'G-Class', 11, '2026-05-10 18:50:01'),
(71, 'A3', 12, '2026-05-10 18:50:01'),
(72, 'A4', 12, '2026-05-10 18:50:01'),
(73, 'A6', 12, '2026-05-10 18:50:01'),
(74, 'Q3', 12, '2026-05-10 18:50:01'),
(75, 'Q5', 12, '2026-05-10 18:50:01'),
(76, 'Q7', 12, '2026-05-10 18:50:01'),
(77, 'Q8', 12, '2026-05-10 18:50:01'),
(78, 'e-tron', 12, '2026-05-10 18:50:01'),
(79, 'A5', 12, '2026-05-10 18:50:01'),
(80, 'Jetta', 13, '2026-05-10 18:50:01'),
(81, 'Golf', 13, '2026-05-10 18:50:01'),
(82, 'Passat', 13, '2026-05-10 18:50:01'),
(83, 'Tiguan', 13, '2026-05-10 18:50:01'),
(84, 'Atlas', 13, '2026-05-10 18:50:01'),
(85, 'Arteon', 13, '2026-05-10 18:50:01'),
(86, 'Taos', 13, '2026-05-10 18:50:01'),
(87, 'ID.4', 13, '2026-05-10 18:50:01'),
(88, 'Elantra', 14, '2026-05-10 18:50:01'),
(89, 'Sonata', 14, '2026-05-10 18:50:01'),
(90, 'Tucson', 14, '2026-05-10 18:50:01'),
(91, 'Santa Fe', 14, '2026-05-10 18:50:01'),
(92, 'Palisade', 14, '2026-05-10 18:50:01'),
(93, 'Kona', 14, '2026-05-10 18:50:01'),
(94, 'Venue', 14, '2026-05-10 18:50:01'),
(95, 'Ioniq 5', 14, '2026-05-10 18:50:01'),
(96, 'Forte', 15, '2026-05-10 18:50:01'),
(97, 'Optima', 15, '2026-05-10 18:50:01'),
(98, 'K5', 15, '2026-05-10 18:50:01'),
(99, 'Sportage', 15, '2026-05-10 18:50:01'),
(100, 'Sorento', 15, '2026-05-10 18:50:01'),
(101, 'Telluride', 15, '2026-05-10 18:50:01'),
(102, 'Soul', 15, '2026-05-10 18:50:01'),
(103, 'Stinger', 15, '2026-05-10 18:50:01'),
(104, 'Outback', 16, '2026-05-10 18:50:01'),
(105, 'Forester', 16, '2026-05-10 18:50:01'),
(106, 'Crosstrek', 16, '2026-05-10 18:50:01'),
(107, 'Impreza', 16, '2026-05-10 18:50:01'),
(108, 'Legacy', 16, '2026-05-10 18:50:01'),
(109, 'Ascent', 16, '2026-05-10 18:50:01'),
(110, 'WRX', 16, '2026-05-10 18:50:01'),
(111, 'Mazda3', 17, '2026-05-10 18:50:01'),
(112, 'Mazda6', 17, '2026-05-10 18:50:01'),
(113, 'CX-5', 17, '2026-05-10 18:50:01'),
(114, 'CX-9', 17, '2026-05-10 18:50:01'),
(115, 'CX-30', 17, '2026-05-10 18:50:01'),
(116, 'MX-5 Miata', 17, '2026-05-10 18:50:01'),
(117, 'RX', 18, '2026-05-10 18:50:01'),
(118, 'NX', 18, '2026-05-10 18:50:01'),
(119, 'ES', 18, '2026-05-10 18:50:01'),
(120, 'IS', 18, '2026-05-10 18:50:01'),
(121, 'GX', 18, '2026-05-10 18:50:01'),
(122, 'LX', 18, '2026-05-10 18:50:01'),
(123, 'UX', 18, '2026-05-10 18:50:01'),
(124, 'Wrangler', 19, '2026-05-10 18:50:01'),
(125, 'Grand Cherokee', 19, '2026-05-10 18:50:01'),
(126, 'Cherokee', 19, '2026-05-10 18:50:01'),
(127, 'Compass', 19, '2026-05-10 18:50:01'),
(128, 'Renegade', 19, '2026-05-10 18:50:01'),
(129, 'Gladiator', 19, '2026-05-10 18:50:01'),
(130, 'Model S', 20, '2026-05-10 18:50:01'),
(131, 'Model 3', 20, '2026-05-10 18:50:01'),
(132, 'Model X', 20, '2026-05-10 18:50:01'),
(133, 'Model Y', 20, '2026-05-10 18:50:01'),
(134, 'Cybertruck', 20, '2026-05-10 18:50:01'),
(135, '911', 21, '2026-05-10 18:50:01'),
(136, 'Cayenne', 21, '2026-05-10 18:50:01'),
(137, 'Macan', 21, '2026-05-10 18:50:01'),
(138, 'Panamera', 21, '2026-05-10 18:50:01'),
(139, 'Taycan', 21, '2026-05-10 18:50:01');

-- --------------------------------------------------------

--
-- Table structure for table `car_types`
--

CREATE TABLE `car_types` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `car_types`
--

INSERT INTO `car_types` (`id`, `name`, `created_at`) VALUES
(1, 'Sedan', '2026-05-10 18:47:21'),
(2, 'SUV', '2026-05-10 18:47:21'),
(3, 'Truck', '2026-05-10 18:47:21');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `created_at`) VALUES
(1, 'Cars', '2026-05-10 18:47:21'),
(2, 'Real Estate', '2026-05-10 18:47:21'),
(3, 'Electronics', '2026-05-10 18:47:21'),
(4, 'Home & Garden', '2026-05-10 18:47:21'),
(5, 'Jobs', '2026-05-10 18:47:21');

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `CategoryID` int(11) NOT NULL,
  `ParentCategoryID` int(11) DEFAULT NULL,
  `CategoryName` varchar(200) NOT NULL,
  `Slug` varchar(250) DEFAULT NULL,
  `Icon` varchar(100) DEFAULT NULL,
  `Description` text DEFAULT NULL,
  `SortOrder` int(11) DEFAULT 0,
  `IsActive` tinyint(1) DEFAULT 1,
  `CreatedAt` datetime DEFAULT current_timestamp(),
  `template_config` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`CategoryID`, `ParentCategoryID`, `CategoryName`, `Slug`, `Icon`, `Description`, `SortOrder`, `IsActive`, `CreatedAt`, `template_config`) VALUES
(1, NULL, 'Vehicles', 'vehicles', 'directions_car', NULL, 1, 1, '2026-05-31 21:23:02', NULL),
(2, 1, 'Cars & Trucks', 'cars-trucks', NULL, NULL, 1, 1, '2026-05-31 21:23:02', NULL),
(3, 1, 'SUVs', 'suvs', NULL, NULL, 2, 1, '2026-05-31 21:23:02', NULL),
(4, 1, 'Pickup Trucks', 'pickup-trucks', NULL, NULL, 3, 1, '2026-05-31 21:23:02', NULL),
(5, 1, 'Vans', 'vans', NULL, NULL, 4, 1, '2026-05-31 21:23:02', NULL),
(6, 1, 'Commercial Vehicles', 'commercial-vehicles', NULL, NULL, 5, 1, '2026-05-31 21:23:02', NULL),
(7, 1, 'Auto Parts', 'auto-parts', NULL, NULL, 6, 1, '2026-05-31 21:23:02', NULL),
(8, 1, 'Tires & Rims', 'tires-rims', NULL, NULL, 7, 1, '2026-05-31 21:23:02', NULL),
(9, 1, 'Motorcycles', 'motorcycles', NULL, NULL, 8, 1, '2026-05-31 21:23:02', NULL),
(10, 1, 'ATVs', 'atvs', NULL, NULL, 9, 1, '2026-05-31 21:23:02', NULL),
(11, 1, 'Boats', 'boats', NULL, NULL, 10, 1, '2026-05-31 21:23:02', NULL),
(12, 1, 'RVs', 'rvs', NULL, NULL, 11, 1, '2026-05-31 21:23:02', NULL),
(13, 1, 'Trailers', 'trailers', NULL, NULL, 12, 1, '2026-05-31 21:23:02', NULL),
(14, 1, 'Heavy Equipment', 'heavy-equipment', NULL, NULL, 13, 1, '2026-05-31 21:23:02', NULL),
(15, 1, 'Vehicle Services', 'vehicle-services', NULL, NULL, 14, 1, '2026-05-31 21:23:02', NULL),
(16, 1, 'Classic Cars', 'classic-cars', NULL, NULL, 15, 1, '2026-05-31 21:23:02', NULL),
(17, 1, 'Salvage Vehicles', 'salvage-vehicles', NULL, NULL, 16, 1, '2026-05-31 21:23:02', NULL),
(18, 1, 'Snowmobiles', 'snowmobiles', NULL, NULL, 17, 1, '2026-05-31 21:23:02', '{\"carFeaturesList\":[]}'),
(19, 1, 'Dirt Bikes', 'dirt-bikes', NULL, NULL, 18, 1, '2026-05-31 21:23:02', NULL),
(20, NULL, 'Real Estate', 'real-estate', 'real_estate_agent', NULL, 2, 1, '2026-05-31 21:23:02', '{\"hideCondition\":true}'),
(21, 20, 'Houses for Sale', 'houses-for-sale', NULL, NULL, 1, 1, '2026-05-31 21:23:02', NULL),
(22, 20, 'Condos for Sale', 'condos-for-sale', NULL, NULL, 2, 1, '2026-05-31 21:23:02', NULL),
(23, 20, 'Townhouses', 'townhouses', NULL, NULL, 3, 1, '2026-05-31 21:23:02', NULL),
(24, 20, 'Commercial Property', 'commercial-property', NULL, NULL, 4, 1, '2026-05-31 21:23:02', NULL),
(25, 20, 'Land for Sale', 'land-for-sale', NULL, NULL, 5, 1, '2026-05-31 21:23:02', NULL),
(26, 20, 'Apartments for Rent', 'apartments-for-rent', NULL, NULL, 6, 1, '2026-05-31 21:23:02', NULL),
(27, 20, 'Basements for Rent', 'basements-for-rent', NULL, NULL, 7, 1, '2026-05-31 21:23:02', NULL),
(28, 20, 'Office Space', 'office-space', NULL, NULL, 8, 1, '2026-05-31 21:23:02', NULL),
(29, 20, 'Retail Space', 'retail-space', NULL, NULL, 9, 1, '2026-05-31 21:23:02', NULL),
(30, 20, 'Vacation Rentals', 'vacation-rentals', NULL, NULL, 10, 1, '2026-05-31 21:23:02', NULL),
(31, 20, 'Room Rentals', 'room-rentals', NULL, NULL, 11, 1, '2026-05-31 21:23:02', NULL),
(32, 20, 'Storage & Parking', 'storage-parking', NULL, NULL, 12, 1, '2026-05-31 21:23:02', NULL),
(33, 20, 'Shared Accommodation', 'shared-accommodation', NULL, NULL, 13, 1, '2026-05-31 21:23:02', NULL),
(34, 20, 'Student Housing', 'student-housing', NULL, NULL, 14, 1, '2026-05-31 21:23:02', NULL),
(35, 20, 'Farm Land', 'farm-land', NULL, NULL, 15, 1, '2026-05-31 21:23:02', NULL),
(36, 20, 'Industrial Property', 'industrial-property', NULL, NULL, 16, 1, '2026-05-31 21:23:02', NULL),
(37, NULL, 'Jobs', 'jobs', 'work', NULL, 3, 1, '2026-05-31 21:23:02', '{\"hideCondition\":true,\"priceLabel\":\"Salary \\/ Year\",\"pricePlaceholder\":\"Annual salary or 0 for negotiable\"}'),
(38, 37, 'Hospitality & Restaurant', 'hospitality-restaurant', NULL, NULL, 1, 1, '2026-05-31 21:23:02', NULL),
(39, 37, 'Cleaning & Maintenance', 'cleaning-maintenance', NULL, NULL, 2, 1, '2026-05-31 21:23:02', NULL),
(40, 37, 'Manufacturing & Warehouse', 'manufacturing-warehouse', NULL, NULL, 3, 1, '2026-05-31 21:23:02', NULL),
(41, 37, 'Education & Training', 'education-training', NULL, NULL, 4, 1, '2026-05-31 21:23:02', NULL),
(42, 37, 'Beauty & Wellness', 'beauty-wellness', NULL, NULL, 5, 1, '2026-05-31 21:23:02', NULL),
(43, 37, 'Media & Creative', 'media-creative', NULL, NULL, 6, 1, '2026-05-31 21:23:02', NULL),
(44, 37, 'Remote Jobs', 'remote-jobs', NULL, NULL, 7, 1, '2026-05-31 21:23:02', NULL),
(45, 37, 'Internship', 'internship', NULL, NULL, 8, 1, '2026-05-31 21:23:02', NULL),
(46, 37, 'Cash Jobs', 'cash-jobs', NULL, NULL, 9, 1, '2026-05-31 21:23:02', NULL),
(47, 37, 'Seasonal & Temporary', 'seasonal-temporary', NULL, NULL, 10, 1, '2026-05-31 21:23:02', NULL),
(48, 37, 'Gig Jobs', 'gig-jobs', NULL, NULL, 11, 1, '2026-05-31 21:23:02', NULL),
(49, 37, 'Seasonal Jobs', 'seasonal-jobs', NULL, NULL, 12, 1, '2026-05-31 21:23:02', NULL),
(50, 37, 'Work From Home', 'work-from-home', NULL, NULL, 13, 1, '2026-05-31 21:23:02', NULL),
(51, NULL, 'Local Services', 'local-services', 'handyman', NULL, 4, 1, '2026-05-31 21:23:02', '{\"hideCondition\":true}'),
(52, 51, 'Skilled Trades', 'skilled-trades', NULL, NULL, 1, 1, '2026-05-31 21:23:02', NULL),
(53, 51, 'Home & Appliances Repair', 'home-appliances-repair', NULL, NULL, 2, 1, '2026-05-31 21:23:02', NULL),
(54, 53, 'Snow Removal', 'snow-removal', NULL, NULL, 1, 1, '2026-05-31 21:23:02', NULL),
(55, 53, 'Junk Removal', 'junk-removal', NULL, NULL, 2, 1, '2026-05-31 21:23:02', NULL),
(56, 53, 'Pest Control', 'pest-control', NULL, NULL, 3, 1, '2026-05-31 21:23:02', NULL),
(57, 53, 'Appliance Repair', 'appliance-repair', NULL, NULL, 4, 1, '2026-05-31 21:23:02', NULL),
(58, 53, 'Locksmith Services', 'locksmith-services', NULL, NULL, 5, 1, '2026-05-31 21:23:02', NULL),
(59, 53, 'Plumbing', 'plumbing', NULL, NULL, 6, 1, '2026-05-31 21:23:02', NULL),
(60, 53, 'Electrical', 'electrical', NULL, NULL, 7, 1, '2026-05-31 21:23:02', NULL),
(61, 53, 'Roofing', 'roofing', NULL, NULL, 8, 1, '2026-05-31 21:23:02', NULL),
(62, 51, 'Home Improvement', 'home-improvement', NULL, NULL, 3, 1, '2026-05-31 21:23:02', NULL),
(63, 51, 'Cleaning Services', 'cleaning-services', NULL, NULL, 4, 1, '2026-05-31 21:23:02', NULL),
(64, 51, 'Landscaping & Outdoor', 'landscaping-outdoor', NULL, NULL, 5, 1, '2026-05-31 21:23:02', NULL),
(65, 51, 'Moving & Transportation', 'moving-transportation', NULL, NULL, 6, 1, '2026-05-31 21:23:02', NULL),
(66, 51, 'Automotive Services', 'automotive-services', NULL, NULL, 7, 1, '2026-05-31 21:23:02', NULL),
(67, 51, 'Business Services', 'business-services', NULL, NULL, 8, 1, '2026-05-31 21:23:02', NULL),
(68, 51, 'Marketing & Advertising', 'marketing-advertising', NULL, NULL, 9, 1, '2026-05-31 21:23:02', NULL),
(69, 51, 'Technology Services', 'technology-services', NULL, NULL, 10, 1, '2026-05-31 21:23:02', NULL),
(70, 51, 'Education & Training', 'education-training', NULL, NULL, 11, 1, '2026-05-31 21:23:02', NULL),
(71, 51, 'Health & Beauty', 'health-beauty', NULL, NULL, 12, 1, '2026-05-31 21:23:02', NULL),
(72, 51, 'Event Services', 'event-services', NULL, NULL, 13, 1, '2026-05-31 21:23:02', NULL),
(73, 51, 'Child & Senior Care', 'child-senior-care', NULL, NULL, 14, 1, '2026-05-31 21:23:02', NULL),
(74, 51, 'Creative & Media', 'creative-media', NULL, NULL, 15, 1, '2026-05-31 21:23:02', NULL),
(75, NULL, 'Buy & Sell', 'buy-sell', 'shopping_cart', NULL, 5, 1, '2026-05-31 21:23:02', NULL),
(76, 75, 'Furniture', 'furniture', NULL, NULL, 1, 1, '2026-05-31 21:23:02', NULL),
(77, 75, 'Electronics', 'electronics', NULL, NULL, 2, 1, '2026-05-31 21:23:02', NULL),
(78, 75, 'TVs', 'tvs', NULL, NULL, 3, 1, '2026-05-31 21:23:02', NULL),
(79, 75, 'Computers', 'computers', NULL, NULL, 4, 1, '2026-05-31 21:23:02', NULL),
(80, 75, 'Laptops', 'laptops', NULL, NULL, 5, 1, '2026-05-31 21:23:02', NULL),
(81, 75, 'Tools', 'tools', NULL, NULL, 6, 1, '2026-05-31 21:23:02', NULL),
(82, 75, 'Appliances', 'appliances', NULL, NULL, 7, 1, '2026-05-31 21:23:02', NULL),
(83, 75, 'Home Décor', 'home-decor', NULL, NULL, 8, 1, '2026-05-31 21:23:02', NULL),
(84, 75, 'Office Furniture', 'office-furniture', NULL, NULL, 9, 1, '2026-05-31 21:23:02', NULL),
(85, 75, 'Baby Items', 'baby-items', NULL, NULL, 10, 1, '2026-05-31 21:23:02', NULL),
(86, 75, 'Musical Instruments', 'musical-instruments', NULL, NULL, 11, 1, '2026-05-31 21:23:02', NULL),
(87, 75, 'Collectibles', 'collectibles', NULL, NULL, 12, 1, '2026-05-31 21:23:02', NULL),
(88, 75, 'Sports & Recreation', 'sports-recreation', NULL, NULL, 13, 1, '2026-05-31 21:23:02', NULL),
(89, 75, 'Mobility equipment', 'mobility-equipment', NULL, NULL, 14, 1, '2026-05-31 21:23:02', NULL),
(90, 75, 'Medical supplies', 'medical-supplies', NULL, NULL, 15, 1, '2026-05-31 21:23:02', NULL),
(91, 75, 'Signs & Print Advertising', 'signs-print-advertising', NULL, NULL, 16, 1, '2026-05-31 21:23:02', NULL),
(92, 75, 'Arts & Crafts', 'arts-crafts', NULL, NULL, 17, 1, '2026-05-31 21:23:02', NULL),
(93, 75, 'Antiques', 'antiques', NULL, NULL, 18, 1, '2026-05-31 21:23:02', NULL),
(94, 75, 'Books, Music & Movies', 'books-music-movies', NULL, NULL, 19, 1, '2026-05-31 21:23:02', NULL),
(95, 75, 'CDs / DVDs / Blu-ray', 'cds-dvds-blu-ray', NULL, NULL, 20, 1, '2026-05-31 21:23:02', NULL),
(96, 75, 'Toys & Games', 'toys-games', NULL, NULL, 21, 1, '2026-05-31 21:23:02', NULL),
(97, 75, 'Free Stuff', 'free-stuff', NULL, NULL, 22, 1, '2026-05-31 21:23:02', NULL),
(98, 75, 'Tickets', 'tickets', NULL, NULL, 23, 1, '2026-05-31 21:23:02', NULL),
(99, 75, 'Garage Sale & Yard Sale', 'garage-sale-yard-sale', NULL, NULL, 24, 1, '2026-05-31 21:23:02', NULL),
(100, 75, 'Estate Sale', 'estate-sale', NULL, NULL, 25, 1, '2026-05-31 21:23:02', NULL),
(101, 75, 'Miscellaneous', 'miscellaneous', NULL, NULL, 26, 1, '2026-05-31 21:23:02', NULL),
(102, NULL, 'Business & Industrial', 'business-industrial', 'business', NULL, 6, 1, '2026-05-31 21:23:02', NULL),
(103, 102, 'Industrial Machinery', 'industrial-machinery', NULL, NULL, 1, 1, '2026-05-31 21:23:02', NULL),
(104, 102, 'Farm & Agricultural Equipment', 'farm-agricultural-equipment', NULL, NULL, 2, 1, '2026-05-31 21:23:02', NULL),
(105, 102, 'Printing & Packaging Equipment', 'printing-packaging-equipment', NULL, NULL, 3, 1, '2026-05-31 21:23:02', NULL),
(106, 102, 'Food & Beverage Business Supplies', 'food-beverage-business-supplies', NULL, NULL, 4, 1, '2026-05-31 21:23:02', NULL),
(107, 102, 'Safety & Security Equipment', 'safety-security-equipment', NULL, NULL, 5, 1, '2026-05-31 21:23:02', NULL),
(108, 102, 'Liquidation & Wholesale Lots', 'liquidation-wholesale-lots', NULL, NULL, 6, 1, '2026-05-31 21:23:02', NULL),
(109, 102, 'Other Business & Industrial', 'other-business-industrial', NULL, NULL, 7, 1, '2026-05-31 21:23:02', NULL),
(110, NULL, 'Community', 'community', 'people', NULL, 7, 1, '2026-05-31 21:23:02', '{\"hideCondition\":true,\"photosRequired\":false}'),
(111, 110, 'Events', 'events', NULL, NULL, 1, 1, '2026-05-31 21:23:02', NULL),
(112, 110, 'Volunteers', 'volunteers', NULL, NULL, 2, 1, '2026-05-31 21:23:02', NULL),
(113, 110, 'Lost & Found', 'lost-found', NULL, NULL, 3, 1, '2026-05-31 21:23:02', NULL),
(114, 110, 'Local News', 'local-news', NULL, NULL, 4, 1, '2026-05-31 21:23:02', NULL),
(115, 110, 'Networking', 'networking', NULL, NULL, 5, 1, '2026-05-31 21:23:02', NULL),
(116, 110, 'Artists', 'artists', NULL, NULL, 6, 1, '2026-05-31 21:23:02', NULL),
(117, 110, 'Musicians', 'musicians', NULL, NULL, 7, 1, '2026-05-31 21:23:02', NULL),
(118, 110, 'Activity Partners', 'activity-partners', NULL, NULL, 8, 1, '2026-05-31 21:23:02', NULL),
(119, NULL, 'Pets', 'pets', 'pets', NULL, 8, 1, '2026-05-31 21:23:02', '{\"hideCondition\":true}'),
(120, 119, 'Dogs & Puppies', 'dogs-puppies', NULL, NULL, 1, 1, '2026-05-31 21:23:02', NULL),
(121, 119, 'Cats & Kittens', 'cats-kittens', NULL, NULL, 2, 1, '2026-05-31 21:23:02', NULL),
(122, 119, 'Fish', 'fish', NULL, NULL, 3, 1, '2026-05-31 21:23:02', NULL),
(123, 119, 'Birds', 'birds', NULL, NULL, 4, 1, '2026-05-31 21:23:02', NULL),
(124, 119, 'Pet Services', 'pet-services', NULL, NULL, 5, 1, '2026-05-31 21:23:02', NULL),
(125, 119, 'Pet Accessories', 'pet-accessories', NULL, NULL, 6, 1, '2026-05-31 21:23:02', NULL),
(126, 119, 'Pet Adoption', 'pet-adoption', NULL, NULL, 7, 1, '2026-05-31 21:23:02', NULL),
(127, NULL, 'Home & Garden', 'home-garden', 'yard', NULL, 9, 1, '2026-05-31 21:23:02', NULL),
(128, 127, 'Furniture', 'furniture', NULL, NULL, 1, 1, '2026-05-31 21:23:02', NULL),
(129, 127, 'Gardening', 'gardening', NULL, NULL, 2, 1, '2026-05-31 21:23:02', NULL),
(130, 127, 'Kitchen', 'kitchen', NULL, NULL, 3, 1, '2026-05-31 21:23:02', NULL),
(131, 127, 'Lighting', 'lighting', NULL, NULL, 4, 1, '2026-05-31 21:23:02', NULL),
(132, 127, 'Outdoor', 'outdoor', NULL, NULL, 5, 1, '2026-05-31 21:23:02', NULL),
(133, 127, 'Renovation Materials', 'renovation-materials', NULL, NULL, 6, 1, '2026-05-31 21:23:02', NULL),
(134, 127, 'Home Improvement', 'home-improvement', NULL, NULL, 7, 1, '2026-05-31 21:23:02', NULL),
(135, NULL, 'Electronics & Computers', 'electronics-computers', 'computer', NULL, 10, 1, '2026-05-31 21:23:02', NULL),
(136, 135, 'Laptops', 'laptops', NULL, NULL, 1, 1, '2026-05-31 21:23:02', NULL),
(137, 135, 'Desktop Computers', 'desktop-computers', NULL, NULL, 2, 1, '2026-05-31 21:23:02', NULL),
(138, 135, 'Gaming PCs', 'gaming-pcs', NULL, NULL, 3, 1, '2026-05-31 21:23:02', NULL),
(139, 135, 'Tablets', 'tablets', NULL, NULL, 4, 1, '2026-05-31 21:23:02', NULL),
(140, 135, 'Mobile Phones', 'mobile-phones', NULL, NULL, 5, 1, '2026-05-31 21:23:02', NULL),
(141, 135, 'TVs', 'tvs', NULL, NULL, 6, 1, '2026-05-31 21:23:02', NULL),
(142, 135, 'Audio Systems', 'audio-systems', NULL, NULL, 7, 1, '2026-05-31 21:23:02', NULL),
(143, 135, 'Gaming Consoles', 'gaming-consoles', NULL, NULL, 8, 1, '2026-05-31 21:23:02', NULL),
(144, 135, 'Smart Watches', 'smart-watches', NULL, NULL, 9, 1, '2026-05-31 21:23:02', NULL),
(145, 135, 'Drones', 'drones', NULL, NULL, 10, 1, '2026-05-31 21:23:02', NULL),
(146, 135, 'Cameras & Camcorders', 'cameras-camcorders', NULL, NULL, 11, 1, '2026-05-31 21:23:02', NULL),
(147, 135, 'Computer Parts & Accessories', 'computer-parts-accessories', NULL, NULL, 12, 1, '2026-05-31 21:23:02', NULL),
(148, 135, 'Printers & Scanners', 'printers-scanners', NULL, NULL, 13, 1, '2026-05-31 21:23:02', NULL),
(149, 135, 'Networking Equipment', 'networking-equipment', NULL, NULL, 14, 1, '2026-05-31 21:23:02', NULL),
(150, 135, 'Smart Home Devices', 'smart-home-devices', NULL, NULL, 15, 1, '2026-05-31 21:23:02', NULL),
(151, 135, 'Video Games', 'video-games', NULL, NULL, 16, 1, '2026-05-31 21:23:02', NULL),
(152, 135, 'Miscellaneous Electronics', 'miscellaneous-electronics', NULL, NULL, 17, 1, '2026-05-31 21:23:02', NULL),
(153, NULL, 'Fashion & Beauty', 'fashion-beauty', 'checkroom', NULL, 11, 1, '2026-05-31 21:23:02', NULL),
(154, 153, 'Men’s Clothing', 'men-s-clothing', NULL, NULL, 1, 1, '2026-05-31 21:23:02', NULL),
(155, 153, 'Women’s Clothing', 'women-s-clothing', NULL, NULL, 2, 1, '2026-05-31 21:23:02', NULL),
(156, 153, 'Kids Clothing', 'kids-clothing', NULL, NULL, 3, 1, '2026-05-31 21:23:02', NULL),
(157, 153, 'Shoes & Footwear', 'shoes-footwear', NULL, NULL, 4, 1, '2026-05-31 21:23:02', NULL),
(158, 153, 'Bags & Wallets', 'bags-wallets', NULL, NULL, 5, 1, '2026-05-31 21:23:02', NULL),
(159, 153, 'Jewelry', 'jewelry', NULL, NULL, 6, 1, '2026-05-31 21:23:02', NULL),
(160, 153, 'Watches', 'watches', NULL, NULL, 7, 1, '2026-05-31 21:23:02', NULL),
(161, 153, 'Sunglasses', 'sunglasses', NULL, NULL, 8, 1, '2026-05-31 21:23:02', NULL),
(162, 153, 'Fashion Accessories', 'fashion-accessories', NULL, NULL, 9, 1, '2026-05-31 21:23:02', NULL),
(163, 153, 'Beauty Products', 'beauty-products', NULL, NULL, 10, 1, '2026-05-31 21:23:02', NULL),
(164, 153, 'Skincare & Cosmetics', 'skincare-cosmetics', NULL, NULL, 11, 1, '2026-05-31 21:23:02', NULL),
(165, 153, 'Hair Products', 'hair-products', NULL, NULL, 12, 1, '2026-05-31 21:23:02', NULL),
(166, 153, 'Perfumes & Fragrances', 'perfumes-fragrances', NULL, NULL, 13, 1, '2026-05-31 21:23:02', NULL),
(167, 153, 'Salon Services', 'salon-services', NULL, NULL, 14, 1, '2026-05-31 21:23:02', NULL),
(168, 153, 'Barber Services', 'barber-services', NULL, NULL, 15, 1, '2026-05-31 21:23:02', NULL),
(169, 153, 'Nail Services', 'nail-services', NULL, NULL, 16, 1, '2026-05-31 21:23:02', NULL),
(170, 153, 'Makeup Artists', 'makeup-artists', NULL, NULL, 17, 1, '2026-05-31 21:23:02', NULL),
(171, 153, 'Spa Services', 'spa-services', NULL, NULL, 18, 1, '2026-05-31 21:23:02', NULL),
(172, NULL, 'Events & Entertainment', 'events-entertainment', 'celebration', NULL, 12, 1, '2026-05-31 21:23:02', '{\"hideCondition\":true}'),
(173, 172, 'Concerts', 'concerts', NULL, NULL, 1, 1, '2026-05-31 21:23:02', NULL),
(174, 172, 'Business Events', 'business-events', NULL, NULL, 2, 1, '2026-05-31 21:23:02', NULL),
(175, 172, 'Wedding Services', 'wedding-services', NULL, NULL, 3, 1, '2026-05-31 21:23:02', NULL),
(176, 172, 'DJs', 'djs', NULL, NULL, 4, 1, '2026-05-31 21:23:02', NULL),
(177, 172, 'Party Rentals', 'party-rentals', NULL, NULL, 5, 1, '2026-05-31 21:23:02', NULL),
(178, 172, 'Tickets', 'tickets', NULL, NULL, 6, 1, '2026-05-31 21:23:02', NULL),
(179, 172, 'Catering', 'catering', NULL, NULL, 7, 1, '2026-05-31 21:23:02', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `categoryattribute`
--

CREATE TABLE `categoryattribute` (
  `AttributeID` int(11) NOT NULL,
  `CategoryID` int(11) NOT NULL,
  `AttributeName` varchar(100) NOT NULL,
  `AttributeType` varchar(50) NOT NULL,
  `IsRequired` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categoryattribute`
--

INSERT INTO `categoryattribute` (`AttributeID`, `CategoryID`, `AttributeName`, `AttributeType`, `IsRequired`) VALUES
(1, 2, 'Year', 'Number', 1),
(2, 2, 'Mileage (km)', 'Number', 1),
(3, 2, 'Transmission', 'Dropdown', 1),
(4, 2, 'Fuel Type', 'Dropdown', 1),
(5, 2, 'Body Type', 'Dropdown', 0),
(6, 2, 'Drivetrain', 'Dropdown', 0),
(7, 2, 'Exterior Color', 'Text', 0),
(8, 2, 'Doors', 'Dropdown', 0),
(9, 2, 'Seating Capacity', 'Number', 0),
(10, 2, 'VIN Number', 'Text', 0),
(11, 3, 'Year', 'Number', 1),
(12, 3, 'Mileage (km)', 'Number', 1),
(13, 3, 'Transmission', 'Dropdown', 1),
(14, 3, 'Fuel Type', 'Dropdown', 1),
(15, 3, 'Body Type', 'Dropdown', 0),
(16, 3, 'Drivetrain', 'Dropdown', 0),
(17, 3, 'Exterior Color', 'Text', 0),
(18, 3, 'Doors', 'Dropdown', 0),
(19, 3, 'Seating Capacity', 'Number', 0),
(20, 3, 'VIN Number', 'Text', 0),
(21, 4, 'Year', 'Number', 1),
(22, 4, 'Mileage (km)', 'Number', 1),
(23, 4, 'Transmission', 'Dropdown', 1),
(24, 4, 'Fuel Type', 'Dropdown', 1),
(25, 4, 'Body Type', 'Dropdown', 0),
(26, 4, 'Drivetrain', 'Dropdown', 0),
(27, 4, 'Exterior Color', 'Text', 0),
(28, 4, 'Doors', 'Dropdown', 0),
(29, 4, 'Seating Capacity', 'Number', 0),
(30, 4, 'VIN Number', 'Text', 0),
(31, 5, 'Year', 'Number', 1),
(32, 5, 'Mileage (km)', 'Number', 1),
(33, 5, 'Transmission', 'Dropdown', 1),
(34, 5, 'Fuel Type', 'Dropdown', 1),
(35, 5, 'Body Type', 'Dropdown', 0),
(36, 5, 'Drivetrain', 'Dropdown', 0),
(37, 5, 'Exterior Color', 'Text', 0),
(38, 5, 'Doors', 'Dropdown', 0),
(39, 5, 'Seating Capacity', 'Number', 0),
(40, 5, 'VIN Number', 'Text', 0),
(41, 6, 'Year', 'Number', 1),
(42, 6, 'Mileage (km)', 'Number', 1),
(43, 6, 'Transmission', 'Dropdown', 1),
(44, 6, 'Fuel Type', 'Dropdown', 1),
(45, 6, 'Body Type', 'Dropdown', 0),
(46, 6, 'Drivetrain', 'Dropdown', 0),
(47, 6, 'Exterior Color', 'Text', 0),
(48, 6, 'Doors', 'Dropdown', 0),
(49, 6, 'Seating Capacity', 'Number', 0),
(50, 6, 'VIN Number', 'Text', 0),
(51, 16, 'Year', 'Number', 1),
(52, 16, 'Mileage (km)', 'Number', 1),
(53, 16, 'Transmission', 'Dropdown', 1),
(54, 16, 'Fuel Type', 'Dropdown', 1),
(55, 16, 'Body Type', 'Dropdown', 0),
(56, 16, 'Drivetrain', 'Dropdown', 0),
(57, 16, 'Exterior Color', 'Text', 0),
(58, 16, 'Doors', 'Dropdown', 0),
(59, 16, 'Seating Capacity', 'Number', 0),
(60, 16, 'VIN Number', 'Text', 0),
(61, 17, 'Year', 'Number', 1),
(62, 17, 'Mileage (km)', 'Number', 1),
(63, 17, 'Transmission', 'Dropdown', 1),
(64, 17, 'Fuel Type', 'Dropdown', 1),
(65, 17, 'Body Type', 'Dropdown', 0),
(66, 17, 'Drivetrain', 'Dropdown', 0),
(67, 17, 'Exterior Color', 'Text', 0),
(68, 17, 'Doors', 'Dropdown', 0),
(69, 17, 'Seating Capacity', 'Number', 0),
(70, 17, 'VIN Number', 'Text', 0),
(71, 9, 'Year', 'Number', 1),
(72, 9, 'Mileage (km)', 'Number', 1),
(73, 9, 'Transmission', 'Dropdown', 1),
(74, 9, 'Fuel Type', 'Dropdown', 1),
(75, 9, 'Body Type', 'Dropdown', 0),
(76, 9, 'Drivetrain', 'Dropdown', 0),
(77, 9, 'Exterior Color', 'Text', 0),
(78, 9, 'Doors', 'Dropdown', 0),
(79, 9, 'Seating Capacity', 'Number', 0),
(80, 9, 'VIN Number', 'Text', 0),
(81, 10, 'Year', 'Number', 1),
(82, 10, 'Mileage (km)', 'Number', 1),
(83, 10, 'Transmission', 'Dropdown', 1),
(84, 10, 'Fuel Type', 'Dropdown', 1),
(85, 10, 'Body Type', 'Dropdown', 0),
(86, 10, 'Drivetrain', 'Dropdown', 0),
(87, 10, 'Exterior Color', 'Text', 0),
(88, 10, 'Doors', 'Dropdown', 0),
(89, 10, 'Seating Capacity', 'Number', 0),
(90, 10, 'VIN Number', 'Text', 0),
(91, 12, 'Year', 'Number', 1),
(92, 12, 'Mileage (km)', 'Number', 1),
(93, 12, 'Transmission', 'Dropdown', 1),
(94, 12, 'Fuel Type', 'Dropdown', 1),
(95, 12, 'Body Type', 'Dropdown', 0),
(96, 12, 'Drivetrain', 'Dropdown', 0),
(97, 12, 'Exterior Color', 'Text', 0),
(98, 12, 'Doors', 'Dropdown', 0),
(99, 12, 'Seating Capacity', 'Number', 0),
(100, 12, 'VIN Number', 'Text', 0),
(101, 11, 'Year', 'Number', 1),
(103, 11, 'Transmission', 'Dropdown', 1),
(104, 11, 'Fuel Type', 'Dropdown', 1),
(105, 11, 'Body Type', 'Dropdown', 0),
(106, 11, 'Drivetrain', 'Dropdown', 0),
(107, 11, 'Exterior Color', 'Text', 0),
(108, 11, 'Doors', 'Dropdown', 0),
(109, 11, 'Seating Capacity', 'Number', 0),
(110, 11, 'VIN Number', 'Text', 0),
(111, 13, 'Year', 'Number', 1),
(112, 13, 'Mileage (km)', 'Number', 1),
(113, 13, 'Transmission', 'Dropdown', 1),
(114, 13, 'Fuel Type', 'Dropdown', 1),
(115, 13, 'Body Type', 'Dropdown', 0),
(116, 13, 'Drivetrain', 'Dropdown', 0),
(117, 13, 'Exterior Color', 'Text', 0),
(118, 13, 'Doors', 'Dropdown', 0),
(119, 13, 'Seating Capacity', 'Number', 0),
(120, 13, 'VIN Number', 'Text', 0),
(121, 14, 'Year', 'Number', 1),
(122, 14, 'Mileage (km)', 'Number', 1),
(123, 14, 'Transmission', 'Dropdown', 1),
(124, 14, 'Fuel Type', 'Dropdown', 1),
(125, 14, 'Body Type', 'Dropdown', 0),
(126, 14, 'Drivetrain', 'Dropdown', 0),
(127, 14, 'Exterior Color', 'Text', 0),
(128, 14, 'Doors', 'Dropdown', 0),
(129, 14, 'Seating Capacity', 'Number', 0),
(130, 14, 'VIN Number', 'Text', 0),
(131, 18, 'Year', 'Number', 1),
(132, 18, 'Mileage (km)', 'Number', 1),
(134, 18, 'Fuel Type', 'Dropdown', 1),
(136, 18, 'Drivetrain', 'Dropdown', 0),
(141, 19, 'Year', 'Number', 1),
(142, 19, 'Mileage (km)', 'Number', 1),
(143, 19, 'Transmission', 'Dropdown', 1),
(144, 19, 'Fuel Type', 'Dropdown', 1),
(145, 19, 'Body Type', 'Dropdown', 0),
(146, 19, 'Drivetrain', 'Dropdown', 0),
(147, 19, 'Exterior Color', 'Text', 0),
(148, 19, 'Doors', 'Dropdown', 0),
(149, 19, 'Seating Capacity', 'Number', 0),
(150, 19, 'VIN Number', 'Text', 0),
(151, 21, 'Bedrooms', 'Dropdown', 1),
(152, 21, 'Bathrooms', 'Dropdown', 1),
(153, 21, 'Size (sq ft)', 'Number', 0),
(154, 22, 'Bedrooms', 'Dropdown', 1),
(155, 22, 'Bathrooms', 'Dropdown', 1),
(156, 22, 'Size (sq ft)', 'Number', 0),
(157, 23, 'Bedrooms', 'Dropdown', 1),
(158, 23, 'Bathrooms', 'Dropdown', 1),
(159, 23, 'Size (sq ft)', 'Number', 0),
(160, 26, 'Bedrooms', 'Dropdown', 1),
(161, 26, 'Bathrooms', 'Dropdown', 1),
(162, 26, 'Size (sq ft)', 'Number', 0),
(163, 27, 'Bedrooms', 'Dropdown', 1),
(164, 27, 'Bathrooms', 'Dropdown', 1),
(165, 27, 'Size (sq ft)', 'Number', 0),
(166, 31, 'Bedrooms', 'Dropdown', 1),
(167, 31, 'Bathrooms', 'Dropdown', 1),
(168, 31, 'Size (sq ft)', 'Number', 0),
(169, 38, 'Job Type / Title', 'Text', 1),
(170, 38, 'Employment Type', 'Dropdown', 1),
(171, 38, 'Experience Required', 'Dropdown', 1),
(172, 38, 'Salary Range Min', 'Number', 0),
(173, 38, 'Salary Range Max', 'Number', 0),
(174, 39, 'Job Type / Title', 'Text', 1),
(175, 39, 'Employment Type', 'Dropdown', 1),
(176, 39, 'Experience Required', 'Dropdown', 1),
(177, 39, 'Salary Range Min', 'Number', 0),
(178, 39, 'Salary Range Max', 'Number', 0),
(179, 40, 'Job Type / Title', 'Text', 1),
(180, 40, 'Employment Type', 'Dropdown', 1),
(181, 40, 'Experience Required', 'Dropdown', 1),
(182, 40, 'Salary Range Min', 'Number', 0),
(183, 40, 'Salary Range Max', 'Number', 0),
(184, 41, 'Job Type / Title', 'Text', 1),
(185, 41, 'Employment Type', 'Dropdown', 1),
(186, 41, 'Experience Required', 'Dropdown', 1),
(187, 41, 'Salary Range Min', 'Number', 0),
(188, 41, 'Salary Range Max', 'Number', 0),
(189, 42, 'Job Type / Title', 'Text', 1),
(190, 42, 'Employment Type', 'Dropdown', 1),
(191, 42, 'Experience Required', 'Dropdown', 1),
(192, 42, 'Salary Range Min', 'Number', 0),
(193, 42, 'Salary Range Max', 'Number', 0),
(194, 43, 'Job Type / Title', 'Text', 1),
(195, 43, 'Employment Type', 'Dropdown', 1),
(196, 43, 'Experience Required', 'Dropdown', 1),
(197, 43, 'Salary Range Min', 'Number', 0),
(198, 43, 'Salary Range Max', 'Number', 0),
(199, 44, 'Job Type / Title', 'Text', 1),
(200, 44, 'Employment Type', 'Dropdown', 1),
(201, 44, 'Experience Required', 'Dropdown', 1),
(202, 44, 'Salary Range Min', 'Number', 0),
(203, 44, 'Salary Range Max', 'Number', 0),
(204, 45, 'Job Type / Title', 'Text', 1),
(205, 45, 'Employment Type', 'Dropdown', 1),
(206, 45, 'Experience Required', 'Dropdown', 1),
(207, 45, 'Salary Range Min', 'Number', 0),
(208, 45, 'Salary Range Max', 'Number', 0),
(209, 46, 'Job Type / Title', 'Text', 1),
(210, 46, 'Employment Type', 'Dropdown', 1),
(211, 46, 'Experience Required', 'Dropdown', 1),
(212, 46, 'Salary Range Min', 'Number', 0),
(213, 46, 'Salary Range Max', 'Number', 0),
(214, 47, 'Job Type / Title', 'Text', 1),
(215, 47, 'Employment Type', 'Dropdown', 1),
(216, 47, 'Experience Required', 'Dropdown', 1),
(217, 47, 'Salary Range Min', 'Number', 0),
(218, 47, 'Salary Range Max', 'Number', 0),
(219, 48, 'Job Type / Title', 'Text', 1),
(220, 48, 'Employment Type', 'Dropdown', 1),
(221, 48, 'Experience Required', 'Dropdown', 1),
(222, 48, 'Salary Range Min', 'Number', 0),
(223, 48, 'Salary Range Max', 'Number', 0),
(224, 49, 'Job Type / Title', 'Text', 1),
(225, 49, 'Employment Type', 'Dropdown', 1),
(226, 49, 'Experience Required', 'Dropdown', 1),
(227, 49, 'Salary Range Min', 'Number', 0),
(228, 49, 'Salary Range Max', 'Number', 0),
(229, 50, 'Job Type / Title', 'Text', 1),
(230, 50, 'Employment Type', 'Dropdown', 1),
(231, 50, 'Experience Required', 'Dropdown', 1),
(232, 50, 'Salary Range Min', 'Number', 0),
(233, 50, 'Salary Range Max', 'Number', 0);

-- --------------------------------------------------------

--
-- Table structure for table `categoryattributeoption`
--

CREATE TABLE `categoryattributeoption` (
  `OptionID` int(11) NOT NULL,
  `AttributeID` int(11) NOT NULL,
  `OptionValue` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categoryattributeoption`
--

INSERT INTO `categoryattributeoption` (`OptionID`, `AttributeID`, `OptionValue`) VALUES
(1, 3, 'Automatic'),
(2, 3, 'Manual'),
(3, 3, 'Other'),
(4, 4, 'Gas'),
(5, 4, 'Diesel'),
(6, 4, 'Hybrid'),
(7, 4, 'Electric'),
(8, 4, 'Other'),
(9, 5, 'SUV'),
(10, 5, 'Sedan'),
(11, 5, 'Coupe'),
(12, 5, 'Hatchback'),
(13, 5, 'Truck'),
(14, 5, 'Van'),
(15, 5, 'Wagon'),
(16, 5, 'Other'),
(17, 6, 'FWD'),
(18, 6, 'RWD'),
(19, 6, 'AWD'),
(20, 6, '4WD'),
(21, 8, '2'),
(22, 8, '3'),
(23, 8, '4'),
(24, 8, '5'),
(25, 8, 'Other'),
(26, 13, 'Automatic'),
(27, 13, 'Manual'),
(28, 13, 'Other'),
(29, 14, 'Gas'),
(30, 14, 'Diesel'),
(31, 14, 'Hybrid'),
(32, 14, 'Electric'),
(33, 14, 'Other'),
(34, 15, 'SUV'),
(35, 15, 'Sedan'),
(36, 15, 'Coupe'),
(37, 15, 'Hatchback'),
(38, 15, 'Truck'),
(39, 15, 'Van'),
(40, 15, 'Wagon'),
(41, 15, 'Other'),
(42, 16, 'FWD'),
(43, 16, 'RWD'),
(44, 16, 'AWD'),
(45, 16, '4WD'),
(46, 18, '2'),
(47, 18, '3'),
(48, 18, '4'),
(49, 18, '5'),
(50, 18, 'Other'),
(51, 23, 'Automatic'),
(52, 23, 'Manual'),
(53, 23, 'Other'),
(54, 24, 'Gas'),
(55, 24, 'Diesel'),
(56, 24, 'Hybrid'),
(57, 24, 'Electric'),
(58, 24, 'Other'),
(59, 25, 'SUV'),
(60, 25, 'Sedan'),
(61, 25, 'Coupe'),
(62, 25, 'Hatchback'),
(63, 25, 'Truck'),
(64, 25, 'Van'),
(65, 25, 'Wagon'),
(66, 25, 'Other'),
(67, 26, 'FWD'),
(68, 26, 'RWD'),
(69, 26, 'AWD'),
(70, 26, '4WD'),
(71, 28, '2'),
(72, 28, '3'),
(73, 28, '4'),
(74, 28, '5'),
(75, 28, 'Other'),
(76, 33, 'Automatic'),
(77, 33, 'Manual'),
(78, 33, 'Other'),
(79, 34, 'Gas'),
(80, 34, 'Diesel'),
(81, 34, 'Hybrid'),
(82, 34, 'Electric'),
(83, 34, 'Other'),
(84, 35, 'SUV'),
(85, 35, 'Sedan'),
(86, 35, 'Coupe'),
(87, 35, 'Hatchback'),
(88, 35, 'Truck'),
(89, 35, 'Van'),
(90, 35, 'Wagon'),
(91, 35, 'Other'),
(92, 36, 'FWD'),
(93, 36, 'RWD'),
(94, 36, 'AWD'),
(95, 36, '4WD'),
(96, 38, '2'),
(97, 38, '3'),
(98, 38, '4'),
(99, 38, '5'),
(100, 38, 'Other'),
(101, 43, 'Automatic'),
(102, 43, 'Manual'),
(103, 43, 'Other'),
(104, 44, 'Gas'),
(105, 44, 'Diesel'),
(106, 44, 'Hybrid'),
(107, 44, 'Electric'),
(108, 44, 'Other'),
(109, 45, 'SUV'),
(110, 45, 'Sedan'),
(111, 45, 'Coupe'),
(112, 45, 'Hatchback'),
(113, 45, 'Truck'),
(114, 45, 'Van'),
(115, 45, 'Wagon'),
(116, 45, 'Other'),
(117, 46, 'FWD'),
(118, 46, 'RWD'),
(119, 46, 'AWD'),
(120, 46, '4WD'),
(121, 48, '2'),
(122, 48, '3'),
(123, 48, '4'),
(124, 48, '5'),
(125, 48, 'Other'),
(126, 53, 'Automatic'),
(127, 53, 'Manual'),
(128, 53, 'Other'),
(129, 54, 'Gas'),
(130, 54, 'Diesel'),
(131, 54, 'Hybrid'),
(132, 54, 'Electric'),
(133, 54, 'Other'),
(134, 55, 'SUV'),
(135, 55, 'Sedan'),
(136, 55, 'Coupe'),
(137, 55, 'Hatchback'),
(138, 55, 'Truck'),
(139, 55, 'Van'),
(140, 55, 'Wagon'),
(141, 55, 'Other'),
(142, 56, 'FWD'),
(143, 56, 'RWD'),
(144, 56, 'AWD'),
(145, 56, '4WD'),
(146, 58, '2'),
(147, 58, '3'),
(148, 58, '4'),
(149, 58, '5'),
(150, 58, 'Other'),
(151, 63, 'Automatic'),
(152, 63, 'Manual'),
(153, 63, 'Other'),
(154, 64, 'Gas'),
(155, 64, 'Diesel'),
(156, 64, 'Hybrid'),
(157, 64, 'Electric'),
(158, 64, 'Other'),
(159, 65, 'SUV'),
(160, 65, 'Sedan'),
(161, 65, 'Coupe'),
(162, 65, 'Hatchback'),
(163, 65, 'Truck'),
(164, 65, 'Van'),
(165, 65, 'Wagon'),
(166, 65, 'Other'),
(167, 66, 'FWD'),
(168, 66, 'RWD'),
(169, 66, 'AWD'),
(170, 66, '4WD'),
(171, 68, '2'),
(172, 68, '3'),
(173, 68, '4'),
(174, 68, '5'),
(175, 68, 'Other'),
(176, 73, 'Automatic'),
(177, 73, 'Manual'),
(178, 73, 'Other'),
(179, 74, 'Gas'),
(180, 74, 'Diesel'),
(181, 74, 'Hybrid'),
(182, 74, 'Electric'),
(183, 74, 'Other'),
(184, 75, 'SUV'),
(185, 75, 'Sedan'),
(186, 75, 'Coupe'),
(187, 75, 'Hatchback'),
(188, 75, 'Truck'),
(189, 75, 'Van'),
(190, 75, 'Wagon'),
(191, 75, 'Other'),
(192, 76, 'FWD'),
(193, 76, 'RWD'),
(194, 76, 'AWD'),
(195, 76, '4WD'),
(196, 78, '2'),
(197, 78, '3'),
(198, 78, '4'),
(199, 78, '5'),
(200, 78, 'Other'),
(201, 83, 'Automatic'),
(202, 83, 'Manual'),
(203, 83, 'Other'),
(204, 84, 'Gas'),
(205, 84, 'Diesel'),
(206, 84, 'Hybrid'),
(207, 84, 'Electric'),
(208, 84, 'Other'),
(209, 85, 'SUV'),
(210, 85, 'Sedan'),
(211, 85, 'Coupe'),
(212, 85, 'Hatchback'),
(213, 85, 'Truck'),
(214, 85, 'Van'),
(215, 85, 'Wagon'),
(216, 85, 'Other'),
(217, 86, 'FWD'),
(218, 86, 'RWD'),
(219, 86, 'AWD'),
(220, 86, '4WD'),
(221, 88, '2'),
(222, 88, '3'),
(223, 88, '4'),
(224, 88, '5'),
(225, 88, 'Other'),
(226, 93, 'Automatic'),
(227, 93, 'Manual'),
(228, 93, 'Other'),
(229, 94, 'Gas'),
(230, 94, 'Diesel'),
(231, 94, 'Hybrid'),
(232, 94, 'Electric'),
(233, 94, 'Other'),
(234, 95, 'SUV'),
(235, 95, 'Sedan'),
(236, 95, 'Coupe'),
(237, 95, 'Hatchback'),
(238, 95, 'Truck'),
(239, 95, 'Van'),
(240, 95, 'Wagon'),
(241, 95, 'Other'),
(242, 96, 'FWD'),
(243, 96, 'RWD'),
(244, 96, 'AWD'),
(245, 96, '4WD'),
(246, 98, '2'),
(247, 98, '3'),
(248, 98, '4'),
(249, 98, '5'),
(250, 98, 'Other'),
(251, 103, 'Automatic'),
(252, 103, 'Manual'),
(253, 103, 'Other'),
(254, 104, 'Gas'),
(255, 104, 'Diesel'),
(256, 104, 'Hybrid'),
(257, 104, 'Electric'),
(258, 104, 'Other'),
(259, 105, 'SUV'),
(260, 105, 'Sedan'),
(261, 105, 'Coupe'),
(262, 105, 'Hatchback'),
(263, 105, 'Truck'),
(264, 105, 'Van'),
(265, 105, 'Wagon'),
(266, 105, 'Other'),
(267, 106, 'FWD'),
(268, 106, 'RWD'),
(269, 106, 'AWD'),
(270, 106, '4WD'),
(271, 108, '2'),
(272, 108, '3'),
(273, 108, '4'),
(274, 108, '5'),
(275, 108, 'Other'),
(276, 113, 'Automatic'),
(277, 113, 'Manual'),
(278, 113, 'Other'),
(279, 114, 'Gas'),
(280, 114, 'Diesel'),
(281, 114, 'Hybrid'),
(282, 114, 'Electric'),
(283, 114, 'Other'),
(284, 115, 'SUV'),
(285, 115, 'Sedan'),
(286, 115, 'Coupe'),
(287, 115, 'Hatchback'),
(288, 115, 'Truck'),
(289, 115, 'Van'),
(290, 115, 'Wagon'),
(291, 115, 'Other'),
(292, 116, 'FWD'),
(293, 116, 'RWD'),
(294, 116, 'AWD'),
(295, 116, '4WD'),
(296, 118, '2'),
(297, 118, '3'),
(298, 118, '4'),
(299, 118, '5'),
(300, 118, 'Other'),
(301, 123, 'Automatic'),
(302, 123, 'Manual'),
(303, 123, 'Other'),
(304, 124, 'Gas'),
(305, 124, 'Diesel'),
(306, 124, 'Hybrid'),
(307, 124, 'Electric'),
(308, 124, 'Other'),
(309, 125, 'SUV'),
(310, 125, 'Sedan'),
(311, 125, 'Coupe'),
(312, 125, 'Hatchback'),
(313, 125, 'Truck'),
(314, 125, 'Van'),
(315, 125, 'Wagon'),
(316, 125, 'Other'),
(317, 126, 'FWD'),
(318, 126, 'RWD'),
(319, 126, 'AWD'),
(320, 126, '4WD'),
(321, 128, '2'),
(322, 128, '3'),
(323, 128, '4'),
(324, 128, '5'),
(325, 128, 'Other'),
(329, 134, 'Gas'),
(330, 134, 'Diesel'),
(331, 134, 'Hybrid'),
(332, 134, 'Electric'),
(333, 134, 'Other'),
(342, 136, 'FWD'),
(343, 136, 'RWD'),
(344, 136, 'AWD'),
(345, 136, '4WD'),
(351, 143, 'Automatic'),
(352, 143, 'Manual'),
(353, 143, 'Other'),
(354, 144, 'Gas'),
(355, 144, 'Diesel'),
(356, 144, 'Hybrid'),
(357, 144, 'Electric'),
(358, 144, 'Other'),
(359, 145, 'SUV'),
(360, 145, 'Sedan'),
(361, 145, 'Coupe'),
(362, 145, 'Hatchback'),
(363, 145, 'Truck'),
(364, 145, 'Van'),
(365, 145, 'Wagon'),
(366, 145, 'Other'),
(367, 146, 'FWD'),
(368, 146, 'RWD'),
(369, 146, 'AWD'),
(370, 146, '4WD'),
(371, 148, '2'),
(372, 148, '3'),
(373, 148, '4'),
(374, 148, '5'),
(375, 148, 'Other'),
(376, 151, 'Studio'),
(377, 151, '1'),
(378, 151, '2'),
(379, 151, '3'),
(380, 151, '4'),
(381, 151, '5+'),
(382, 152, '1'),
(383, 152, '2'),
(384, 152, '3'),
(385, 152, '4+'),
(386, 154, 'Studio'),
(387, 154, '1'),
(388, 154, '2'),
(389, 154, '3'),
(390, 154, '4'),
(391, 154, '5+'),
(392, 155, '1'),
(393, 155, '2'),
(394, 155, '3'),
(395, 155, '4+'),
(396, 157, 'Studio'),
(397, 157, '1'),
(398, 157, '2'),
(399, 157, '3'),
(400, 157, '4'),
(401, 157, '5+'),
(402, 158, '1'),
(403, 158, '2'),
(404, 158, '3'),
(405, 158, '4+'),
(406, 160, 'Studio'),
(407, 160, '1'),
(408, 160, '2'),
(409, 160, '3'),
(410, 160, '4'),
(411, 160, '5+'),
(412, 161, '1'),
(413, 161, '2'),
(414, 161, '3'),
(415, 161, '4+'),
(416, 163, 'Studio'),
(417, 163, '1'),
(418, 163, '2'),
(419, 163, '3'),
(420, 163, '4'),
(421, 163, '5+'),
(422, 164, '1'),
(423, 164, '2'),
(424, 164, '3'),
(425, 164, '4+'),
(426, 166, 'Studio'),
(427, 166, '1'),
(428, 166, '2'),
(429, 166, '3'),
(430, 166, '4'),
(431, 166, '5+'),
(432, 167, '1'),
(433, 167, '2'),
(434, 167, '3'),
(435, 167, '4+'),
(436, 170, 'Full-Time'),
(437, 170, 'Part-Time'),
(438, 170, 'Contract'),
(439, 170, 'Freelance'),
(440, 170, 'Internship'),
(441, 171, 'No Experience'),
(442, 171, '1-2 Years'),
(443, 171, '3-5 Years'),
(444, 171, '5+ Years'),
(445, 175, 'Full-Time'),
(446, 175, 'Part-Time'),
(447, 175, 'Contract'),
(448, 175, 'Freelance'),
(449, 175, 'Internship'),
(450, 176, 'No Experience'),
(451, 176, '1-2 Years'),
(452, 176, '3-5 Years'),
(453, 176, '5+ Years'),
(454, 180, 'Full-Time'),
(455, 180, 'Part-Time'),
(456, 180, 'Contract'),
(457, 180, 'Freelance'),
(458, 180, 'Internship'),
(459, 181, 'No Experience'),
(460, 181, '1-2 Years'),
(461, 181, '3-5 Years'),
(462, 181, '5+ Years'),
(463, 185, 'Full-Time'),
(464, 185, 'Part-Time'),
(465, 185, 'Contract'),
(466, 185, 'Freelance'),
(467, 185, 'Internship'),
(468, 186, 'No Experience'),
(469, 186, '1-2 Years'),
(470, 186, '3-5 Years'),
(471, 186, '5+ Years'),
(472, 190, 'Full-Time'),
(473, 190, 'Part-Time'),
(474, 190, 'Contract'),
(475, 190, 'Freelance'),
(476, 190, 'Internship'),
(477, 191, 'No Experience'),
(478, 191, '1-2 Years'),
(479, 191, '3-5 Years'),
(480, 191, '5+ Years'),
(481, 195, 'Full-Time'),
(482, 195, 'Part-Time'),
(483, 195, 'Contract'),
(484, 195, 'Freelance'),
(485, 195, 'Internship'),
(486, 196, 'No Experience'),
(487, 196, '1-2 Years'),
(488, 196, '3-5 Years'),
(489, 196, '5+ Years'),
(490, 200, 'Full-Time'),
(491, 200, 'Part-Time'),
(492, 200, 'Contract'),
(493, 200, 'Freelance'),
(494, 200, 'Internship'),
(495, 201, 'No Experience'),
(496, 201, '1-2 Years'),
(497, 201, '3-5 Years'),
(498, 201, '5+ Years'),
(499, 205, 'Full-Time'),
(500, 205, 'Part-Time'),
(501, 205, 'Contract'),
(502, 205, 'Freelance'),
(503, 205, 'Internship'),
(504, 206, 'No Experience'),
(505, 206, '1-2 Years'),
(506, 206, '3-5 Years'),
(507, 206, '5+ Years'),
(508, 210, 'Full-Time'),
(509, 210, 'Part-Time'),
(510, 210, 'Contract'),
(511, 210, 'Freelance'),
(512, 210, 'Internship'),
(513, 211, 'No Experience'),
(514, 211, '1-2 Years'),
(515, 211, '3-5 Years'),
(516, 211, '5+ Years'),
(517, 215, 'Full-Time'),
(518, 215, 'Part-Time'),
(519, 215, 'Contract'),
(520, 215, 'Freelance'),
(521, 215, 'Internship'),
(522, 216, 'No Experience'),
(523, 216, '1-2 Years'),
(524, 216, '3-5 Years'),
(525, 216, '5+ Years'),
(526, 220, 'Full-Time'),
(527, 220, 'Part-Time'),
(528, 220, 'Contract'),
(529, 220, 'Freelance'),
(530, 220, 'Internship'),
(531, 221, 'No Experience'),
(532, 221, '1-2 Years'),
(533, 221, '3-5 Years'),
(534, 221, '5+ Years'),
(535, 225, 'Full-Time'),
(536, 225, 'Part-Time'),
(537, 225, 'Contract'),
(538, 225, 'Freelance'),
(539, 225, 'Internship'),
(540, 226, 'No Experience'),
(541, 226, '1-2 Years'),
(542, 226, '3-5 Years'),
(543, 226, '5+ Years'),
(544, 230, 'Full-Time'),
(545, 230, 'Part-Time'),
(546, 230, 'Contract'),
(547, 230, 'Freelance'),
(548, 230, 'Internship'),
(549, 231, 'No Experience'),
(550, 231, '1-2 Years'),
(551, 231, '3-5 Years'),
(552, 231, '5+ Years');

-- --------------------------------------------------------

--
-- Table structure for table `drivetrains`
--

CREATE TABLE `drivetrains` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `drivetrains`
--

INSERT INTO `drivetrains` (`id`, `name`, `created_at`) VALUES
(1, 'FWD', '2026-05-10 18:47:21'),
(2, 'RWD', '2026-05-10 18:47:21'),
(3, 'AWD', '2026-05-10 18:47:21'),
(4, '4WD', '2026-05-10 18:47:21');

-- --------------------------------------------------------

--
-- Table structure for table `email_settings`
--

CREATE TABLE `email_settings` (
  `id` int(11) NOT NULL,
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `email_settings`
--

INSERT INTO `email_settings` (`id`, `setting_key`, `setting_value`, `updated_at`) VALUES
(1, 'smtp_host', 'smtp.hostinger.com', '2026-05-31 12:26:06'),
(2, 'smtp_port', '465', '2026-05-31 12:26:06'),
(3, 'smtp_username', 'hello@hitads.ca', '2026-05-10 18:27:25'),
(4, 'smtp_from_email', 'promudithsenanayake@gmail.com', '2026-05-10 18:27:25'),
(5, 'smtp_from_name', 'hello@hitads.ca', '2026-05-10 18:27:25'),
(6, 'smtp_encryption', 'tls', '2026-05-10 18:27:25'),
(22, 'smtp_password', 'Lanka@@1234', '2026-05-10 18:27:25');

-- --------------------------------------------------------

--
-- Table structure for table `fuel_types`
--

CREATE TABLE `fuel_types` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `fuel_types`
--

INSERT INTO `fuel_types` (`id`, `name`, `created_at`) VALUES
(1, 'Gas', '2026-05-10 18:47:21'),
(2, 'Diesel', '2026-05-10 18:47:21'),
(3, 'Hybrid', '2026-05-10 18:47:21'),
(4, 'Electric', '2026-05-10 18:47:21'),
(5, 'Other', '2026-05-10 18:47:21');

-- --------------------------------------------------------

--
-- Table structure for table `listings`
--

CREATE TABLE `listings` (
  `id` int(11) NOT NULL,
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
  `is_top_ad` tinyint(1) DEFAULT 0,
  `is_highlighted` tinyint(1) DEFAULT 0,
  `is_urgent` tinyint(1) DEFAULT 0,
  `is_home_gallery` tinyint(1) DEFAULT 0,
  `youtube_link` varchar(500) DEFAULT NULL,
  `facebook_link` varchar(500) DEFAULT NULL,
  `price_type` varchar(50) DEFAULT 'amount',
  `parent_id` int(11) DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `listings`
--

INSERT INTO `listings` (`id`, `title`, `price`, `category`, `location`, `time`, `image`, `is_featured`, `description`, `views`, `saves`, `inquiries`, `user_id`, `created_at`, `contact_email`, `contact_phone`, `postal_code`, `is_top_ad`, `is_highlighted`, `is_urgent`, `is_home_gallery`, `youtube_link`, `facebook_link`, `price_type`, `parent_id`, `latitude`, `longitude`) VALUES
(39, 'w4yw4e', 326.00, 'Vehicles > SUVs', 'Lac Toron, Lac-au-Brochet, QC', 'Just now', '[\"\\/api\\/uploads\\/1780807931497-110473217.png\"]', 0, 'Year: 1313\nMileage (km): 25\nTransmission: Automatic\nFuel Type: Gas\nBody Type: SUV\nDrivetrain: RWD\nExterior Color: 23236\nDoors: 4\nCondition: New\n\neryrweuy', 0, 0, 0, 23, '2026-06-07 04:52:11', '', '', '', 0, 0, 0, 0, '', '', 'amount', NULL, NULL, NULL),
(42, 'hkh vk', 100.00, 'Vehicles > Cars & Trucks', 'tor', 'Just now', '[\"/api/uploads/1782144638574-9248589.jpeg\"]', 0, 'Condition: New\n\nnn  kh', 1, 0, 0, 23, '2026-06-22 10:40:38', NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 'amount', NULL, NULL, NULL),
(43, 'ljbnkjbbj', 7000.00, 'Business & Industrial > Industrial Machinery', 'Tor Bay, NS', 'Just now', '[\"/api/uploads/1782145930387-93105373.jpeg\"]', 0, 'Condition: New\n\nknb kb ', 2, 0, 0, 23, '2026-06-22 11:02:10', NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 'amount', NULL, 45.19823330, NULL),
(44, 'hgccghc', 5000.00, 'Real Estate > Houses for Sale', 'Tor Bay, NS', 'Just now', '[\"/api/uploads/1782146041214-67805832.jpeg\"]', 0, 'Bedrooms: 3\nBathrooms: 3\nSize (sq ft): 75\n\nhgfxfxxgx', 2, 0, 0, 23, '2026-06-22 11:04:01', NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 'amount', NULL, NULL, NULL),
(45, 'hgccghc', 5000.00, 'Real Estate > Houses for Sale', 'Tor Bay, Charlos Cove, NS', 'Just now', '[\"/api/uploads/1782146041214-67805832.jpeg\"]', 0, 'Bedrooms: 3\nBathrooms: 3\nSize (sq ft): 75\n\nhgfxfxxgx', 0, 0, 0, 23, '2026-06-22 11:04:01', NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 'amount', 44, NULL, NULL),
(46, 'hgccghc', 5000.00, 'Real Estate > Houses for Sale', 'Pete Toy Creek, Area B (Finlay Valley/Beatton Valley), BC', 'Just now', '[\"/api/uploads/1782146041214-67805832.jpeg\"]', 0, 'Bedrooms: 3\nBathrooms: 3\nSize (sq ft): 75\n\nhgfxfxxgx', 0, 0, 0, 23, '2026-06-22 11:04:01', NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, 'amount', 44, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `listing_seo`
--

CREATE TABLE `listing_seo` (
  `id` int(11) NOT NULL,
  `listing_id` int(11) NOT NULL,
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_desc` text DEFAULT NULL,
  `keywords` text DEFAULT NULL,
  `image_alt_text` text DEFAULT NULL,
  `focus_keyword` varchar(255) DEFAULT NULL,
  `seo_score` tinyint(4) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `main_menu_master`
--

CREATE TABLE `main_menu_master` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `icon` varchar(100) DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `main_menu_master`
--

INSERT INTO `main_menu_master` (`id`, `name`, `icon`, `sort_order`, `is_active`, `created_at`) VALUES
(1, 'Home', 'home', 1, 1, '2026-05-10 18:47:21'),
(2, 'Vehicles', 'directions_car', 2, 1, '2026-05-10 18:47:21'),
(3, 'Properties', 'real_estate_agent', 3, 1, '2026-05-10 18:47:21'),
(4, 'Electronics', 'devices', 4, 1, '2026-05-10 18:47:21'),
(5, 'Jobs', 'work', 5, 1, '2026-05-10 18:47:21');

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `listing_id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `receiver_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `sender_name` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `is_read` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `listing_id`, `sender_id`, `receiver_id`, `message`, `sender_name`, `created_at`, `is_read`) VALUES
(1, 29, 1, 23, 'Hello, I am interested in this item!', 'Test Sender', '2026-05-31 17:47:17', 1),
(2, 29, 1, 23, 'Hello, I am interested in this item!', 'Test Sender', '2026-05-31 17:50:46', 1),
(3, 29, 23, 23, 'weqetgewqy', 'promudith', '2026-05-31 17:52:32', 0),
(4, 27, 0, 23, 'test', 'A Guest', '2026-05-31 17:53:44', 0),
(5, 29, 1, 23, 'Hello, I am interested in this item!', 'Test Sender', '2026-05-31 17:56:30', 1),
(6, 29, 1, 23, 'Hello, I am interested in this item!', 'Test Sender', '2026-05-31 17:57:12', 1),
(7, 40, 23, 23, 'Is this still available?', 'promudith', '2026-06-14 17:56:54', 1),
(8, 40, 23, 23, 'tyd', 'promudith', '2026-06-14 22:13:27', 1),
(9, 40, 23, 23, 'fuck', 'promudith', '2026-06-14 22:15:00', 1),
(10, 40, 23, 23, 'dsagvwerbebb', 'promudith', '2026-06-14 22:24:02', 1),
(11, 41, 23, 23, 'hi', 'promudith', '2026-06-17 00:09:32', 1),
(12, 42, 23, 23, 'hit', 'promudith', '2026-06-22 16:16:17', 1);

-- --------------------------------------------------------

--
-- Table structure for table `options`
--

CREATE TABLE `options` (
  `id` int(11) NOT NULL,
  `option_type` varchar(100) NOT NULL,
  `option_value` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `options`
--

INSERT INTO `options` (`id`, `option_type`, `option_value`, `created_at`) VALUES
(1, 'category', 'Cars', '2026-04-17 23:30:10'),
(2, 'category', 'Real Estate', '2026-04-17 23:30:10'),
(3, 'category', 'Electronics', '2026-04-17 23:30:10'),
(4, 'category', 'Home & Garden', '2026-04-17 23:30:10'),
(5, 'category', 'Jobs', '2026-04-17 23:30:10'),
(6, 'car_make', 'Toyota', '2026-04-17 23:30:10'),
(7, 'car_make', 'Honda', '2026-04-17 23:30:10'),
(8, 'car_make', 'Ford', '2026-04-17 23:30:10'),
(9, 'car_make', 'BMW', '2026-04-17 23:30:10'),
(10, 'car_model', 'Civic', '2026-04-17 23:30:10'),
(11, 'car_model', 'Corolla', '2026-04-17 23:30:10'),
(12, 'car_model', 'F-150', '2026-04-17 23:30:10'),
(13, 'car_model', 'M4', '2026-04-17 23:30:10'),
(14, 'car_type', 'Sedan', '2026-04-17 23:30:10'),
(15, 'car_type', 'SUV', '2026-04-17 23:30:10'),
(16, 'car_type', 'Truck', '2026-04-17 23:30:10');

-- --------------------------------------------------------

--
-- Table structure for table `price_options`
--

CREATE TABLE `price_options` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `option_key` varchar(255) NOT NULL,
  `sort_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `price_options`
--

INSERT INTO `price_options` (`id`, `name`, `option_key`, `sort_order`, `is_active`, `created_at`) VALUES
(1, 'Free', 'free', 1, 1, '2026-05-31 16:39:02'),
(2, 'Please Contact', 'contact', 2, 1, '2026-05-31 16:39:02'),
(3, 'Swap/Trade', 'swap', 3, 1, '2026-05-31 16:39:02');

-- --------------------------------------------------------

--
-- Table structure for table `seo_settings`
--

CREATE TABLE `seo_settings` (
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `seo_settings`
--

INSERT INTO `seo_settings` (`setting_key`, `setting_value`, `updated_at`) VALUES
('footer_copyright_text', '© 2026 HitAds.ca — Post free ads, sell fast, buy local, and connect with buyers and sellers across Canada.', '2026-05-31 13:23:16'),
('ga4_id', 'G-XXXXXXXXXX', '2026-05-30 16:26:39'),
('google_ads_id', 'AW-18199746339', '2026-05-31 09:28:33'),
('google_site_verification', 'c-cidgyEcNErCFJpYOhfp_RQm8Cqm9Xn1uHpVmNkvVM', '2026-05-31 09:28:33'),
('gtm_id', 'GTM-P9WWQ4H7', '2026-05-31 09:28:33'),
('homepage_hero_tag_1', 'Free Ads.', '2026-05-31 13:23:16'),
('homepage_hero_tag_2', 'Sell Fast.', '2026-05-31 13:23:16'),
('homepage_hero_tag_3', 'Buy Local.', '2026-05-31 13:23:16'),
('homepage_hero_tag_4', 'Canada-Wide.', '2026-05-31 13:23:16'),
('homepage_hero_title_1', 'Find what you need,', '2026-05-31 13:23:16'),
('homepage_hero_title_2', 'right in your community.', '2026-05-31 13:23:16'),
('homepage_schema_markup', '\n<script type=\"application/ld+json\">\n{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"Organization\",\n  \"name\": \"HitAds.ca\",\n  \"url\": \"https://hitads.ca\",\n  \"logo\": \"https://hitads.ca/assets/logo.png\",\n  \"sameAs\": [\n    \"https://www.facebook.com/hitads.ca\",\n    \"https://www.instagram.com/hitads.ca\",\n    \"https://www.linkedin.com/company/hitads\"\n  ]\n}\n</script>\n<script type=\"application/ld+json\">\n{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"LocalBusiness\",\n  \"name\": \"HitAds.ca\",\n  \"image\": \"https://hitads.ca/assets/logo.png\",\n  \"url\": \"https://hitads.ca\",\n  \"telephone\": \"+1-800-555-0199\",\n  \"address\": {\n    \"@type\": \"PostalAddress\",\n    \"addressLocality\": \"Toronto\",\n    \"addressRegion\": \"ON\",\n    \"addressCountry\": \"CA\"\n  }\n}\n</script>', '2026-05-30 16:26:39'),
('meta_desc_buy-and-sell-toronto', 'Buy and sell items in Toronto. Find electronics, furniture, vehicles, and more. Post your free ad today on HitAds.ca.', '2026-05-30 16:26:39'),
('meta_desc_buying-guides', 'Expert buying guides to help you make smart purchasing decisions on HitAds.ca classifieds.', '2026-05-30 16:26:39'),
('meta_desc_contact', 'Get in touch with the HitAds.ca team. We\'re here to help with questions about listings, advertising, and partnerships.', '2026-05-30 16:26:39'),
('meta_desc_help', 'Find answers to frequently asked questions about posting ads, managing your account, and using HitAds.ca.', '2026-05-30 16:26:39'),
('meta_desc_home', 'HitAds.ca is Canada\'s modern classified ads platform connecting local communities, businesses, services, jobs, real estate, and marketplace listings across Toronto and beyond.', '2026-05-30 16:26:39'),
('meta_desc_jobs-toronto', 'Search job listings in Toronto. Find full-time, part-time, and contract jobs across all industries on HitAds.ca.', '2026-05-30 16:26:39'),
('meta_desc_local-services-toronto', 'Find trusted local services in Toronto including movers, plumbing, electrical, renovation, cleaning, and more on HitAds.ca.', '2026-05-30 16:26:39'),
('meta_desc_market-trends', 'Explore market trends, pricing insights, and popular categories on HitAds.ca Canadian classifieds.', '2026-05-30 16:26:39'),
('meta_desc_real-estate-toronto', 'Browse real estate listings in Toronto. Find houses for sale, condos, apartments for rent, and commercial property on HitAds.ca.', '2026-05-30 16:26:39'),
('meta_desc_safety-tips', 'Stay safe while buying and selling on HitAds.ca. Essential safety guidelines for online classifieds.', '2026-05-30 16:26:39'),
('meta_desc_search', 'Search thousands of classified ads across Canada. Find vehicles, real estate, jobs, services, and more on HitAds.ca.', '2026-05-30 16:26:39'),
('meta_desc_selling-advice', 'Expert tips to sell faster and get the best price for your items on HitAds.ca classifieds.', '2026-05-30 16:26:39'),
('meta_desc_sri-lankan-marketplace-canada', 'Canada\'s Sri Lankan community marketplace. Buy, sell, and connect with the Sri Lankan diaspora across Toronto and Canada on HitAds.ca.', '2026-05-30 16:26:39'),
('meta_desc_terms', 'Read the HitAds.ca terms of service, privacy policy, and posting guidelines.', '2026-05-30 16:26:39'),
('meta_desc_toronto-classifieds', 'Search local classifieds listings in Toronto, ON. Post free advertisements for jobs, cars, real estate, and items for sale on HitAds.ca.', '2026-05-30 16:26:39'),
('meta_pixel_id', 'XXXXXXXXXXXXXXXX', '2026-05-30 16:26:39'),
('page_title_buy-and-sell-toronto', 'Buy and Sell in Toronto - Free Classifieds | HitAds.ca', '2026-05-30 16:26:39'),
('page_title_buying-guides', 'Buying Guides - Smart Shopping Tips | HitAds.ca', '2026-05-30 16:26:39'),
('page_title_contact', 'Contact Us | HitAds.ca', '2026-05-30 16:26:39'),
('page_title_help', 'Help Center | HitAds.ca', '2026-05-30 16:26:39'),
('page_title_home', 'HitAds.ca – Toronto Classified Ads & Local Marketplace Canada', '2026-05-30 16:26:39'),
('page_title_jobs-toronto', 'Jobs in Toronto - Find Employment & Career Opportunities | HitAds.ca', '2026-05-30 16:26:39'),
('page_title_local-services-toronto', 'Local Services in Toronto - Movers, Plumbers, Contractors | HitAds.ca', '2026-05-30 16:26:39'),
('page_title_market-trends', 'Market Trends & Insights | HitAds.ca', '2026-05-30 16:26:39'),
('page_title_real-estate-toronto', 'Real Estate Toronto - Houses, Condos, Rentals | HitAds.ca', '2026-05-30 16:26:39'),
('page_title_safety-tips', 'Safety Tips for Buyers & Sellers | HitAds.ca', '2026-05-30 16:26:39'),
('page_title_search', 'Search Classified Ads | HitAds.ca', '2026-05-30 16:26:39'),
('page_title_selling-advice', 'Selling Advice - Get the Best Price | HitAds.ca', '2026-05-30 16:26:39'),
('page_title_sri-lankan-marketplace-canada', 'Sri Lankan Marketplace Canada - Community Classifieds | HitAds.ca', '2026-05-30 16:26:39'),
('page_title_terms', 'Terms & Conditions | HitAds.ca', '2026-05-30 16:26:39'),
('page_title_toronto-classifieds', 'Toronto Classifieds & Local Marketplace - Buy & Sell | HitAds.ca', '2026-05-30 16:26:39'),
('robots_txt', 'User-agent: *\nDisallow: /admin\nAllow: /\n\nSitemap: https://hitads.ca/sitemap.xml', '2026-05-30 16:26:39'),
('social_facebook', 'https://www.facebook.com/hitads.ca', '2026-05-31 13:23:16'),
('social_instagram', 'https://www.instagram.com/hitads.ca', '2026-05-31 13:23:16'),
('social_x', 'https://x.com', '2026-05-31 13:23:16');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `listing_id` int(11) NOT NULL,
  `ticket` varchar(255) NOT NULL,
  `receipt_id` varchar(255) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `response_code` varchar(50) DEFAULT NULL,
  `payment_type` varchar(50) DEFAULT NULL,
  `promotions` varchar(255) NOT NULL,
  `status` varchar(50) DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(50) DEFAULT 'user',
  `avatar` varchar(255) DEFAULT NULL,
  `join_date` timestamp NULL DEFAULT current_timestamp(),
  `phone` varchar(50) DEFAULT '+1 (555) 123-4567',
  `is_verified` tinyint(1) DEFAULT 0,
  `verification_token` varchar(255) DEFAULT NULL,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expiry` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `avatar`, `join_date`, `phone`, `is_verified`, `verification_token`, `reset_token`, `reset_token_expiry`) VALUES
(23, 'promudith', 'pbsspromudith@gmail.com', '$2b$12$dTdDO2bVKr8PWFAPXB3zduaLSZ196WxnhjsGAaMJu0SAf2aloP/ee', 'admin', 'https://api.dicebear.com/7.x/avataaars/svg?seed=pbsspromudith%40gmail.com', '2026-05-10 04:15:23', '+1 (555) 123-4567', 1, NULL, NULL, NULL),
(26, 'Nishantha D', 'nishan.don@gmail.com', '$2y$12$p8768y8IH2HPF1QmwEOSj.5WHfM5fCwnrf1qk6mU65habFoYM2zY2', 'admin', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nishantha+D', '2026-05-30 17:46:02', '+1 (555) 123-4567', 1, NULL, 'TEST_TOKEN_123', '2026-06-22 16:35:07'),
(27, 'Dave Bowatta', 'dewakabowatta@gmail.com', '$2y$12$1abe47ULG8kR1LIBJaFysulG4aPMVh2NgthWzZcKkP.W/E7y5Tz6q', 'seo', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dave+Bowatta', '2026-06-01 01:33:17', '+1 (555) 123-4567', 1, NULL, 'TEST_TOKEN_123', '2026-06-22 16:35:07'),
(29, 'Ashan', 'ashanabeywickrama@gmail.com', '$2y$12$4k9HI5TS.l1OdWF9ePrB1OQQ2ihwvenWenzYqTrjDltmjBNEPgDZu', 'admin', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ashan+Abeywickrama', '2026-06-05 12:18:49', '+1 (555) 123-4567', 1, NULL, 'TEST_TOKEN_123', '2026-06-22 16:35:07'),
(30, 'Dunali', 'dunali.sam@gmail.com', '$2y$12$hJNlaXNd3m3UCzN.REoPFOwFmZoCRGYl/mSzFyNY/zz5Vq2SnOKoS', 'user', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dunali', '2026-06-05 13:54:21', '+1 (555) 123-4567', 1, NULL, 'TEST_TOKEN_123', '2026-06-22 16:35:07'),
(31, 'Test', 'as2018538@sci.sjp.ac.lk', '$2y$12$Qcny7r6sQCo0lqxyfAN9Rer9/hVqFd3eqZto1dNbv8XJWz9jlnYea', 'seo', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Test', '2026-06-05 19:30:26', '+1 (555) 123-4567', 1, NULL, 'TEST_TOKEN_123', '2026-06-22 16:35:07');

-- --------------------------------------------------------

--
-- Table structure for table `vehicle_types`
--

CREATE TABLE `vehicle_types` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `vehicle_types`
--

INSERT INTO `vehicle_types` (`id`, `name`, `created_at`) VALUES
(1, 'Car', '2026-05-10 18:47:21'),
(2, 'Motorcycle', '2026-05-10 18:47:21'),
(3, 'Van', '2026-05-10 18:47:21'),
(4, 'Bus', '2026-05-10 18:47:21'),
(5, 'Heavy Equipment', '2026-05-10 18:47:21'),
(6, 'egewgwe', '2026-05-10 18:48:42');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `car_makes`
--
ALTER TABLE `car_makes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `car_models`
--
ALTER TABLE `car_models`
  ADD PRIMARY KEY (`id`),
  ADD KEY `make_id` (`make_id`);

--
-- Indexes for table `car_types`
--
ALTER TABLE `car_types`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`CategoryID`),
  ADD KEY `IX_Category_ParentCategoryID` (`ParentCategoryID`),
  ADD KEY `IX_Category_IsActive` (`IsActive`);

--
-- Indexes for table `categoryattribute`
--
ALTER TABLE `categoryattribute`
  ADD PRIMARY KEY (`AttributeID`),
  ADD KEY `fk_category_attribute_category_rel` (`CategoryID`);

--
-- Indexes for table `categoryattributeoption`
--
ALTER TABLE `categoryattributeoption`
  ADD PRIMARY KEY (`OptionID`),
  ADD KEY `fk_category_option_attribute_rel` (`AttributeID`);

--
-- Indexes for table `drivetrains`
--
ALTER TABLE `drivetrains`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `email_settings`
--
ALTER TABLE `email_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `setting_key` (`setting_key`);

--
-- Indexes for table `fuel_types`
--
ALTER TABLE `fuel_types`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `listings`
--
ALTER TABLE `listings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `fk_listings_parent` (`parent_id`);

--
-- Indexes for table `listing_seo`
--
ALTER TABLE `listing_seo`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `listing_id` (`listing_id`);

--
-- Indexes for table `main_menu_master`
--
ALTER TABLE `main_menu_master`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `options`
--
ALTER TABLE `options`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `price_options`
--
ALTER TABLE `price_options`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `option_key` (`option_key`);

--
-- Indexes for table `seo_settings`
--
ALTER TABLE `seo_settings`
  ADD PRIMARY KEY (`setting_key`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `listing_id` (`listing_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `vehicle_types`
--
ALTER TABLE `vehicle_types`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `car_makes`
--
ALTER TABLE `car_makes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `car_models`
--
ALTER TABLE `car_models`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=140;

--
-- AUTO_INCREMENT for table `car_types`
--
ALTER TABLE `car_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `CategoryID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=180;

--
-- AUTO_INCREMENT for table `categoryattribute`
--
ALTER TABLE `categoryattribute`
  MODIFY `AttributeID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=234;

--
-- AUTO_INCREMENT for table `categoryattributeoption`
--
ALTER TABLE `categoryattributeoption`
  MODIFY `OptionID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=553;

--
-- AUTO_INCREMENT for table `drivetrains`
--
ALTER TABLE `drivetrains`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `email_settings`
--
ALTER TABLE `email_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `fuel_types`
--
ALTER TABLE `fuel_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `listings`
--
ALTER TABLE `listings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT for table `listing_seo`
--
ALTER TABLE `listing_seo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `main_menu_master`
--
ALTER TABLE `main_menu_master`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `options`
--
ALTER TABLE `options`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `price_options`
--
ALTER TABLE `price_options`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `vehicle_types`
--
ALTER TABLE `vehicle_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `car_models`
--
ALTER TABLE `car_models`
  ADD CONSTRAINT `car_models_ibfk_1` FOREIGN KEY (`make_id`) REFERENCES `car_makes` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `category`
--
ALTER TABLE `category`
  ADD CONSTRAINT `fk_category_parent_self` FOREIGN KEY (`ParentCategoryID`) REFERENCES `category` (`CategoryID`) ON DELETE CASCADE;

--
-- Constraints for table `categoryattribute`
--
ALTER TABLE `categoryattribute`
  ADD CONSTRAINT `fk_category_attribute_category_rel` FOREIGN KEY (`CategoryID`) REFERENCES `category` (`CategoryID`) ON DELETE CASCADE;

--
-- Constraints for table `categoryattributeoption`
--
ALTER TABLE `categoryattributeoption`
  ADD CONSTRAINT `fk_category_option_attribute_rel` FOREIGN KEY (`AttributeID`) REFERENCES `categoryattribute` (`AttributeID`) ON DELETE CASCADE;

--
-- Constraints for table `listings`
--
ALTER TABLE `listings`
  ADD CONSTRAINT `fk_listings_parent` FOREIGN KEY (`parent_id`) REFERENCES `listings` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `listings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `listing_seo`
--
ALTER TABLE `listing_seo`
  ADD CONSTRAINT `listing_seo_ibfk_1` FOREIGN KEY (`listing_id`) REFERENCES `listings` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`listing_id`) REFERENCES `listings` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
