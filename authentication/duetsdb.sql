-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 20, 2025 at 04:55 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `duetsdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `demographic`
--

CREATE TABLE `demographic` (
  `id` int(11) NOT NULL,
  `FIRST_NAME` varchar(255) NOT NULL,
  `MIDDLE_NAME` varchar(255) NOT NULL,
  `LAST_NAME` varchar(255) NOT NULL,
  `AGE` int(11) DEFAULT NULL CHECK (`AGE` >= 0),
  `BIRTHDAY` date DEFAULT NULL,
  `SEX` enum('Male','Female','Other') NOT NULL,
  `CIVIL_STATUS` varchar(255) DEFAULT NULL,
  `PARENTS_GUARDIAN_NAME` varchar(255) DEFAULT NULL,
  `BARANGAY` varchar(255) DEFAULT NULL,
  `SITIO` varchar(255) DEFAULT NULL,
  `CITY` varchar(255) DEFAULT NULL,
  `PROVINCE` varchar(255) DEFAULT NULL,
  `MOBILE_NUMBER` varchar(255) DEFAULT NULL,
  `EMAIL_ADDRESS` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `demographic`
--

INSERT INTO `demographic` (`id`, `FIRST_NAME`, `MIDDLE_NAME`, `LAST_NAME`, `AGE`, `BIRTHDAY`, `SEX`, `CIVIL_STATUS`, `PARENTS_GUARDIAN_NAME`, `BARANGAY`, `SITIO`, `CITY`, `PROVINCE`, `MOBILE_NUMBER`, `EMAIL_ADDRESS`, `created_at`) VALUES
(1, 'Jherson', 'Hilario', 'Bartolay', 20, '2004-08-22', 'Male', '0', 'Rowena Hilario Bartolay', 'Basiao', 'Looc', 'Roxas', 'Capiz', '09218238738', 'admin1@gmail.com', '2025-06-04 13:39:57');

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE `tasks` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `category` varchar(50) NOT NULL,
  `type` varchar(50) NOT NULL,
  `completed` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `due_date` date DEFAULT NULL,
  `repeat_type` varchar(20) DEFAULT 'none',
  `repeat_days` varchar(50) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`id`, `user_id`, `title`, `description`, `category`, `type`, `completed`, `created_at`, `due_date`, `repeat_type`, `repeat_days`, `updated_at`) VALUES
(36, 2, 'asdasd', 'djhsgdjahsghd', 'school', 'Lesson', 1, '2025-05-13 06:28:07', NULL, 'none', NULL, '2025-05-21 01:09:05'),
(37, 2, 'asdad', 'asdasd', 'school', 'Lesson', 1, '2025-05-13 06:29:15', NULL, 'none', NULL, '2025-05-21 01:09:12'),
(38, 2, 'asdasd', '', 'school', 'Lesson', 1, '2025-05-13 06:36:35', NULL, 'daily', '', '2025-05-20 15:33:05'),
(39, 2, 'asdasd', '', 'personal', 'Lesson', 1, '2025-05-13 06:57:17', '2025-05-31', 'none', '', '2025-05-21 01:11:32'),
(40, 3, 'Debut Photoshoot and video event', 'This is about our work', 'work', 'Task', 1, '2025-05-18 12:11:34', '2025-05-20', 'custom', '', '2025-05-18 12:12:42'),
(41, 3, 'asdasd', '', 'work', 'Lesson', 0, '2025-05-18 12:19:40', NULL, 'none', '', '2025-05-18 12:19:40'),
(42, 3, 'asdasd', '', 'personal', 'Lesson', 0, '2025-05-18 12:19:52', '2025-05-18', 'none', '', '2025-05-18 12:19:52'),
(43, 3, 'asdqwqweqwe', '', 'personal', 'Lesson', 0, '2025-05-18 12:20:05', '2025-05-18', 'none', '', '2025-05-18 12:20:05'),
(49, 2, 'Lets go something', '', 'work', 'Lesson', 1, '2025-05-19 06:44:12', NULL, 'none', '', '2025-05-20 15:33:10'),
(50, 2, 'Johnny Lesson 5 ', '', 'school', 'Lesson', 1, '2025-05-19 06:45:54', NULL, 'none', '', '2025-05-20 15:33:12'),
(51, 2, 'askdhkjashjdhas', '', 'personal', 'Lesson', 1, '2025-05-19 23:21:19', NULL, 'none', '', '2025-05-20 15:33:13'),
(52, 2, 'akshdkjahjshdas', '', 'school', 'Lesson', 1, '2025-05-19 23:35:49', NULL, 'daily', '', '2025-05-20 15:33:17'),
(53, 2, 'something', '', 'school', 'Lesson', 1, '2025-05-19 23:37:20', NULL, 'none', '', '2025-05-20 15:33:19'),
(54, 2, 'Something another again', '', 'school', 'Lesson', 0, '2025-05-19 23:38:40', NULL, 'none', '', '2025-05-19 23:38:40'),
(55, 5, 'It is again something again', '', 'work', 'Lesson', 1, '2025-05-19 23:40:22', NULL, 'none', '', '2025-05-19 23:40:25'),
(57, 2, 'ksdhkjfshdkjf', '', 'school', 'Lesson', 0, '2025-05-21 00:25:12', NULL, 'custom', 'mon,tue,wed', '2025-05-21 00:25:12'),
(58, 2, 'Lesson 1', '- Lesson askdhasd\n- rizal \n- chucuhu', 'school', 'Lesson', 0, '2025-05-21 00:35:52', NULL, 'none', '', '2025-05-21 00:36:13'),
(59, 2, 'asjhgdasgdkga', '', 'work', 'Lesson', 0, '2025-05-21 00:43:09', '2025-05-22', 'weekly', '', '2025-05-21 00:43:09'),
(64, 10, 'practice', '', 'personal', 'Lesson', 1, '2025-06-04 02:48:13', '2025-06-04', 'daily', '', '2025-06-04 02:49:25'),
(65, 11, 'Creation of Demographic profile form data collection', '', 'work', 'Lesson', 1, '2025-06-04 13:42:21', '2025-06-04', 'none', '', '2025-06-04 13:42:24'),
(66, 12, 'Meeting Today', 'Lesson 1 for English etc...\n- topic \naksdjlaksjd', 'personal', 'Task', 0, '2025-06-16 03:19:05', '2025-06-16', 'none', '', '2025-06-16 03:20:21'),
(67, 12, 'asdasdasd', '', 'work', 'Lesson', 0, '2025-06-16 03:19:18', NULL, 'none', '', '2025-06-16 03:20:23');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `created_at`, `updated_at`) VALUES
(1, 'jherson bartolay', 'jsonbartolay@gmail.com', '$2y$10$iu/xuFznZc79uNeNPbfKu.cIrb1YLfNmylDk0ififSqS0I4.vPmDm', '2025-05-11 07:14:03', '2025-05-11 07:14:03'),
(2, 'myjj', 'bartolayjherson@gmail.com', '$2y$10$Bx/rQ2JggWKSFWSJEQ3ICeUvYjDTZKl34m9EjPI5jBNwy2.PryaGG', '2025-05-11 07:19:58', '2025-05-11 07:19:58'),
(3, 'Japheth Batan', 'Jap@gmail.com', '$2y$10$y7wHa8CZ.5sJ70d5PHCHv.Ruspc6lH/l108nx8EQZueQWk2RqdRTm', '2025-05-18 12:09:11', '2025-05-18 12:09:11'),
(4, 'Vince Gabriel', 'vince@gmail.com', '$2y$10$ArsUAr5hYHwU1D1koWrRceGKZH4EdjAVkWhYtA5YAhO.Nf/0GYmty', '2025-05-18 12:30:19', '2025-05-18 12:30:19'),
(5, 'Something', 'something@gmail.com', '$2y$10$swOUA/17K9JaFk.GzDR4GeGNKGphlJVKQwbsUaoiLfDAsotCE1ulS', '2025-05-19 23:40:00', '2025-05-19 23:40:00'),
(6, 'mysomething', 'mysomething@gmail.com', '$2y$10$BcCCu2nS1oAN3DlbyZNXoO4km6YfS.mn51JKnujKKGA9iC2RgEx7i', '2025-05-20 14:28:46', '2025-05-20 14:28:46'),
(7, 'duets', 'duets@gmail.com', '$2y$10$nOzg2FD8IEg2SNn74QcIVeGTgqoTLhUgCjsJbv7ST/.rwNH9A4s3.', '2025-05-21 01:20:36', '2025-05-21 01:20:36'),
(8, 'sir jm', 'sirjm@gmail.com', '$2y$10$jm8dSE.3zjRjKs2da3/le.Cc/s5UMvQjhNAZvcyKuYvaeIxp/Oe2G', '2025-05-21 01:43:45', '2025-05-21 01:43:45'),
(9, 'something1', 'something1@gmail.com', '$2y$10$9.TX.XAHxrnN4TRacu4F..w3DY3ajwzr/.zsto8ioxtKqKcXfxlsC', '2025-06-03 16:50:06', '2025-06-03 16:50:06'),
(10, 'Emmerson Bartolay', 'emmerson_bartolay@yahoo.com', '$2y$10$S9XaxOAeklpH9J9OanVHNudDX11cgeGMuWVeT8alLZkuH/0Z7kvyC', '2025-06-04 02:46:44', '2025-06-04 02:46:44'),
(11, 'admin 1', 'admin1@gmail.com', '$2y$10$a.mfyFcDFlVuYKSXEgVFR.nXNnBBqjNFGVnJgksty1AyvaNFu9xiq', '2025-06-04 10:21:13', '2025-06-04 10:21:13'),
(12, 'admin2', 'admin2@gmail.com', '$2y$10$2XF3HAwfS8MeI/RUrcGuP.XhR5ADktZk4ewq80DYC7ABxbzLdOJSW', '2025-06-16 03:16:38', '2025-06-16 03:16:38');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `demographic`
--
ALTER TABLE `demographic`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `demographic`
--
ALTER TABLE `demographic`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=68;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
