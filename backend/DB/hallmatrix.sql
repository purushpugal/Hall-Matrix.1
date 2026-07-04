-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Jul 02, 2026 at 09:08 AM
-- Server version: 5.7.39
-- PHP Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hallmatrix`
--

-- --------------------------------------------------------

--
-- Table structure for table `batches`
--

CREATE TABLE `batches` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `college_id` bigint(20) UNSIGNED NOT NULL,
  `from_year` smallint(5) UNSIGNED NOT NULL,
  `to_year` smallint(5) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `batches`
--

INSERT INTO `batches` (`id`, `college_id`, `from_year`, `to_year`, `created_at`, `updated_at`) VALUES
(13, 6, 2021, 2025, '2026-07-02 01:41:23', '2026-07-02 01:41:23'),
(14, 6, 2022, 2026, '2026-07-02 01:41:23', '2026-07-02 01:41:23'),
(15, 6, 2023, 2027, '2026-07-02 01:41:23', '2026-07-02 01:41:23'),
(16, 6, 2024, 2028, '2026-07-02 01:41:23', '2026-07-02 01:41:23'),
(17, 6, 2026, 2030, '2026-07-02 01:54:41', '2026-07-02 01:54:41');

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `colleges`
--

CREATE TABLE `colleges` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `college_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `college_code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contact_person` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contact_number` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `colleges`
--

INSERT INTO `colleges` (`id`, `college_name`, `college_code`, `location`, `contact_person`, `contact_number`, `email`, `password`, `is_active`, `created_at`, `updated_at`) VALUES
(6, 'Christain College of Engineering and Technology', '9203', 'Oddanchatram', 'College Admin', '0000000000', 'christain', '$2y$12$Pmpuo9DhdseAxStrEe0g2uIcNImdZhfFxZt1ZWbaBzxOc8KJJ.VB6', 1, '2026-07-02 00:22:25', '2026-07-02 00:29:07');

-- --------------------------------------------------------

--
-- Table structure for table `degrees`
--

CREATE TABLE `degrees` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `college_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `degrees`
--

INSERT INTO `degrees` (`id`, `college_id`, `name`, `created_at`, `updated_at`) VALUES
(16, 6, 'B.E', '2026-07-02 01:41:23', '2026-07-02 01:41:23'),
(17, 6, 'B.Tech', '2026-07-02 01:41:23', '2026-07-02 01:41:23'),
(18, 6, 'M.E', '2026-07-02 01:41:23', '2026-07-02 01:41:23');

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `college_id` bigint(20) UNSIGNED NOT NULL,
  `degree_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`id`, `college_id`, `degree_id`, `name`, `created_at`, `updated_at`) VALUES
(13, 6, 16, 'CSE', '2026-07-02 01:41:23', '2026-07-02 01:41:23'),
(14, 6, 16, 'ECE', '2026-07-02 01:41:23', '2026-07-02 01:41:23'),
(15, 6, 16, 'MECH', '2026-07-02 01:41:23', '2026-07-02 01:41:23'),
(16, 6, 16, 'EEE', '2026-07-02 01:41:23', '2026-07-02 01:41:23'),
(17, 6, 17, 'IT', '2026-07-02 01:41:23', '2026-07-02 01:41:23'),
(18, 6, 17, 'CIVIL', '2026-07-02 01:41:23', '2026-07-02 01:41:23'),
(19, 6, 18, 'CSE', '2026-07-02 01:41:23', '2026-07-02 01:41:23');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` smallint(5) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0000_12_31_000000_create_colleges_table', 1),
(2, '0001_01_01_000000_create_users_table', 1),
(3, '0001_01_01_000001_create_cache_table', 1),
(4, '0001_01_01_000002_create_jobs_table', 1),
(5, '2026_06_30_103314_create_personal_access_tokens_table', 1),
(6, '2026_06_30_104224_add_location_to_colleges_table', 2),
(7, '2026_07_02_000001_create_degrees_table', 3),
(8, '2026_07_02_000002_create_departments_table', 3),
(9, '2026_07_02_000003_create_batches_table', 3),
(10, '2026_07_02_000004_create_subjects_table', 4),
(11, '2026_07_02_000005_create_students_table', 5),
(12, '2026_07_02_000006_create_semesters_table', 6);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(11, 'App\\Models\\User', 3, 'auth_token', 'a2a6de974b6feb9d8c550bae5a298f96558988e88a60ad7491a2cef72b169be8', '[\"*\"]', '2026-07-01 23:51:44', NULL, '2026-07-01 23:51:43', '2026-07-01 23:51:44'),
(13, 'App\\Models\\User', 5, 'auth_token', '7dccc52cba9bf6b1b19558af39ffba88e6a05167bd3b1fea8e9836a0d20e3dd2', '[\"*\"]', NULL, NULL, '2026-07-02 00:14:27', '2026-07-02 00:14:27'),
(15, 'App\\Models\\User', 1, 'auth_token', 'a6ffe1225be5aa57edc6703899dd824c12e4ef3031b3ff639d5b9cdeb73559ed', '[\"*\"]', '2026-07-02 00:46:43', NULL, '2026-07-02 00:21:47', '2026-07-02 00:46:43'),
(16, 'App\\Models\\User', 7, 'auth_token', '0e96eaf3ccedea6027a7a810e305f919b9865f1e735dfaf2298a88c7d1b0242d', '[\"*\"]', '2026-07-02 02:08:11', NULL, '2026-07-02 00:22:37', '2026-07-02 02:08:11'),
(33, 'App\\Models\\User', 8, 'auth_token', 'ca4c7248c6e449ed4ef10f7f21e61675e877b71c1d4cf17591493a3682a51ab7', '[\"*\"]', NULL, NULL, '2026-07-02 01:08:34', '2026-07-02 01:08:34'),
(53, 'App\\Models\\User', 2, 'auth_token', '8ca194e05dc70efd7f8896a2b86cf2b891e3102255101f0e756e0fafe5c7ed9b', '[\"*\"]', '2026-07-02 01:59:17', NULL, '2026-07-02 01:59:16', '2026-07-02 01:59:17');

-- --------------------------------------------------------

--
-- Table structure for table `semesters`
--

CREATE TABLE `semesters` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `college_id` bigint(20) UNSIGNED NOT NULL,
  `degree_id` bigint(20) UNSIGNED NOT NULL,
  `department_id` bigint(20) UNSIGNED NOT NULL,
  `batch_id` bigint(20) UNSIGNED NOT NULL,
  `semester_number` tinyint(3) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `semesters`
--

INSERT INTO `semesters` (`id`, `college_id`, `degree_id`, `department_id`, `batch_id`, `semester_number`, `created_at`, `updated_at`) VALUES
(3, 6, 16, 13, 17, 1, '2026-07-02 01:55:16', '2026-07-02 01:55:16');

-- --------------------------------------------------------

--
-- Table structure for table `semester_subject`
--

CREATE TABLE `semester_subject` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `semester_id` bigint(20) UNSIGNED NOT NULL,
  `subject_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `semester_subject`
--

INSERT INTO `semester_subject` (`id`, `semester_id`, `subject_id`) VALUES
(7, 3, 5),
(8, 3, 6),
(9, 3, 7),
(10, 3, 8),
(11, 3, 9);

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `college_id` bigint(20) UNSIGNED NOT NULL,
  `degree_id` bigint(20) UNSIGNED NOT NULL,
  `department_id` bigint(20) UNSIGNED NOT NULL,
  `batch_id` bigint(20) UNSIGNED NOT NULL,
  `register_no` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `profile_photo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`id`, `user_id`, `college_id`, `degree_id`, `department_id`, `batch_id`, `register_no`, `phone`, `profile_photo`, `created_at`, `updated_at`) VALUES
(5, 12, 6, 16, 13, 13, '9203CSE21001', '9876500001', NULL, '2026-07-02 01:41:23', '2026-07-02 01:41:23'),
(6, 13, 6, 16, 13, 13, '9203CSE21002', '9876500002', NULL, '2026-07-02 01:41:23', '2026-07-02 01:41:23'),
(7, 14, 6, 16, 14, 14, '9203ECE22001', '9876500003', NULL, '2026-07-02 01:41:23', '2026-07-02 01:41:23'),
(8, 15, 6, 16, 15, 14, '9203MEC22001', '9876500004', NULL, '2026-07-02 01:41:24', '2026-07-02 01:41:24'),
(9, 16, 6, 17, 17, 15, '9203IT23001', '9876500005', NULL, '2026-07-02 01:41:24', '2026-07-02 01:41:24'),
(10, 17, 6, 17, 18, 15, '9203CIV23001', '9876500006', NULL, '2026-07-02 01:41:24', '2026-07-02 01:41:24'),
(11, 18, 6, 16, 13, 16, '9203CSE24001', '9876500007', NULL, '2026-07-02 01:41:25', '2026-07-02 01:41:25'),
(12, 19, 6, 18, 19, 13, '9203MCS21001', '9876500008', NULL, '2026-07-02 01:41:25', '2026-07-02 01:41:25'),
(13, 20, 6, 16, 13, 17, 'CHRI001', '8098111311', 'students/kcIASqpRrcvzT9eJ0M3bpQ1OY1Vn4MmWOZuz79zL.jpg', '2026-07-02 01:55:53', '2026-07-02 01:55:53');

-- --------------------------------------------------------

--
-- Table structure for table `subjects`
--

CREATE TABLE `subjects` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `college_id` bigint(20) UNSIGNED NOT NULL,
  `code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `subjects`
--

INSERT INTO `subjects` (`id`, `college_id`, `code`, `name`, `created_at`, `updated_at`) VALUES
(5, 6, 'CS101', 'Data Structures', '2026-07-02 01:41:23', '2026-07-02 01:41:23'),
(6, 6, 'CS102', 'Database Management Systems', '2026-07-02 01:41:23', '2026-07-02 01:41:23'),
(7, 6, 'CS201', 'Operating Systems', '2026-07-02 01:41:23', '2026-07-02 01:41:23'),
(8, 6, 'CS202', 'Computer Networks', '2026-07-02 01:41:23', '2026-07-02 01:41:23'),
(9, 6, 'EC101', 'Digital Electronics', '2026-07-02 01:41:23', '2026-07-02 01:41:23'),
(10, 6, 'ME101', 'Engineering Mechanics', '2026-07-02 01:41:23', '2026-07-02 01:41:23'),
(11, 6, 'MA101', 'Engineering Mathematics I', '2026-07-02 01:41:23', '2026-07-02 01:41:23'),
(12, 6, 'IT101', 'Web Technology', '2026-07-02 01:41:23', '2026-07-02 01:41:23');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('super_admin','admin_employee','college_admin','tutor','student') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'student',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `college_id` bigint(20) UNSIGNED DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `is_active`, `college_id`, `email_verified_at`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Super Admin', 'admin', '$2y$12$0qrGJx6E6yK0Bc0HK3lUveKaLHSKC.OyiItDbPdMztKV04EcUHC8q', 'super_admin', 1, NULL, NULL, NULL, '2026-06-30 05:03:43', '2026-07-02 00:29:06'),
(2, 'Christain College Admin', 'christain', '$2y$12$PLjr88pQhHx00c4/mEqJzeGUxOPRagAW5NAifiiWUKkidOhGnEbhO', 'college_admin', 1, 6, NULL, NULL, '2026-06-30 05:13:00', '2026-07-02 00:29:07'),
(7, 'Purushothaman', 'purushothaman@gmail.com', '$2y$12$egdrDTvNJGG7T2qX/.hVZOtSt9j/Io07wwQOuYCvvca72813ZIaYy', 'college_admin', 1, 6, NULL, NULL, '2026-07-02 00:22:26', '2026-07-02 00:22:26'),
(10, 'CHANDRASEKAR M', 'chandrasekar8992@gmail.com', '$2y$12$81eV.wW8w0q8ICHFmW8TEeWgE6Bx5tQGppxq7rBw8shwTkBMkR002', 'student', 1, 6, NULL, NULL, '2026-07-02 01:30:17', '2026-07-02 01:30:17'),
(11, 'Priya Kumar', 'priya.kumar@example.com', '$2y$12$cto1xcSMTg9eFNS0UfGuHuzMCBKf5F3KQOqsN9U1UZHLs.LfCAh2S', 'student', 1, 6, NULL, NULL, '2026-07-02 01:36:07', '2026-07-02 01:36:07'),
(12, 'Arjun Kumar', 'arjun.kumar@example.com', '$2y$12$.L3fIF31QxI26AC5OotdBe.Cy9sP5nMA9hHOVk9Op7J2HNvl8YLTu', 'student', 1, 6, NULL, NULL, '2026-07-02 01:41:23', '2026-07-02 01:41:23'),
(13, 'Divya Sundaram', 'divya.sundaram@example.com', '$2y$12$tZ9FqGuDbd6z1hQW0vwy0.ebUHvB/X9.t/0z8MOz5uuC8eT8ayJJi', 'student', 1, 6, NULL, NULL, '2026-07-02 01:41:23', '2026-07-02 01:41:23'),
(14, 'Karthik Raja', 'karthik.raja@example.com', '$2y$12$FEfYg0ewL8FCoNvT8hM6c.3v/5/./7DT5zCuwColjg6QrwAwDa/EO', 'student', 1, 6, NULL, NULL, '2026-07-02 01:41:23', '2026-07-02 01:41:23'),
(15, 'Meena Priya', 'meena.priya@example.com', '$2y$12$mDOnFT4h66yP2tan7AnaNeWriCWqQq33ppnl.x1lis00VtmJkC1dC', 'student', 1, 6, NULL, NULL, '2026-07-02 01:41:24', '2026-07-02 01:41:24'),
(16, 'Suresh Babu', 'suresh.babu@example.com', '$2y$12$WCIrv6ZWs5hLvMJEjwlUgOi49tldTX45QgF6ZpsAiSJWlmtCa2gIu', 'student', 1, 6, NULL, NULL, '2026-07-02 01:41:24', '2026-07-02 01:41:24'),
(17, 'Lakshmi Narayan', 'lakshmi.narayan@example.com', '$2y$12$JZabcN98mlfeV2iRg4miUuMpLVK5crI3lqil.chgV5gpZ9i117MGe', 'student', 1, 6, NULL, NULL, '2026-07-02 01:41:24', '2026-07-02 01:41:24'),
(18, 'Ramesh Chandran', 'ramesh.chandran@example.com', '$2y$12$ifgCuhHZ7unJJGKU/vFo.eKtLRsgGHyZgh1Bx7aeZnm1BIeYmrJ5m', 'student', 1, 6, NULL, NULL, '2026-07-02 01:41:25', '2026-07-02 01:41:25'),
(19, 'Anjali Devi', 'anjali.devi@example.com', '$2y$12$Vaj2.BGioXb6RPV38rQy3ecaLOlWzb7W9tsaL7eCXDmUxZ2nDo4Uu', 'student', 1, 6, NULL, NULL, '2026-07-02 01:41:25', '2026-07-02 01:41:25'),
(20, 'CHANDRASEKAR M', 'chandraseka@gmail.com', '$2y$12$EIXY5hTcsfb49SU3zL5dh.gm9kJF2WYDWQsraHJ59lHQL7VFgqRCu', 'student', 1, 6, NULL, NULL, '2026-07-02 01:55:53', '2026-07-02 01:55:53');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `batches`
--
ALTER TABLE `batches`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `batches_college_id_from_year_to_year_unique` (`college_id`,`from_year`,`to_year`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Indexes for table `colleges`
--
ALTER TABLE `colleges`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `colleges_college_code_unique` (`college_code`),
  ADD UNIQUE KEY `colleges_email_unique` (`email`);

--
-- Indexes for table `degrees`
--
ALTER TABLE `degrees`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `degrees_college_id_name_unique` (`college_id`,`name`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `departments_degree_id_name_unique` (`degree_id`,`name`),
  ADD KEY `departments_college_id_foreign` (`college_id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`),
  ADD KEY `failed_jobs_connection_queue_failed_at_index` (`connection`,`queue`,`failed_at`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indexes for table `semesters`
--
ALTER TABLE `semesters`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `semesters_unique_combo` (`degree_id`,`department_id`,`batch_id`,`semester_number`),
  ADD KEY `semesters_college_id_foreign` (`college_id`),
  ADD KEY `semesters_department_id_foreign` (`department_id`),
  ADD KEY `semesters_batch_id_foreign` (`batch_id`);

--
-- Indexes for table `semester_subject`
--
ALTER TABLE `semester_subject`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `semester_subject_semester_id_subject_id_unique` (`semester_id`,`subject_id`),
  ADD KEY `semester_subject_subject_id_foreign` (`subject_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `students_college_id_register_no_unique` (`college_id`,`register_no`),
  ADD UNIQUE KEY `students_user_id_unique` (`user_id`),
  ADD KEY `students_degree_id_foreign` (`degree_id`),
  ADD KEY `students_department_id_foreign` (`department_id`),
  ADD KEY `students_batch_id_foreign` (`batch_id`);

--
-- Indexes for table `subjects`
--
ALTER TABLE `subjects`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `subjects_college_id_code_unique` (`college_id`,`code`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD KEY `users_college_id_foreign` (`college_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `batches`
--
ALTER TABLE `batches`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `colleges`
--
ALTER TABLE `colleges`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `degrees`
--
ALTER TABLE `degrees`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT for table `semesters`
--
ALTER TABLE `semesters`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `semester_subject`
--
ALTER TABLE `semester_subject`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `subjects`
--
ALTER TABLE `subjects`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `batches`
--
ALTER TABLE `batches`
  ADD CONSTRAINT `batches_college_id_foreign` FOREIGN KEY (`college_id`) REFERENCES `colleges` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `degrees`
--
ALTER TABLE `degrees`
  ADD CONSTRAINT `degrees_college_id_foreign` FOREIGN KEY (`college_id`) REFERENCES `colleges` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `departments`
--
ALTER TABLE `departments`
  ADD CONSTRAINT `departments_college_id_foreign` FOREIGN KEY (`college_id`) REFERENCES `colleges` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `departments_degree_id_foreign` FOREIGN KEY (`degree_id`) REFERENCES `degrees` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `semesters`
--
ALTER TABLE `semesters`
  ADD CONSTRAINT `semesters_batch_id_foreign` FOREIGN KEY (`batch_id`) REFERENCES `batches` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `semesters_college_id_foreign` FOREIGN KEY (`college_id`) REFERENCES `colleges` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `semesters_degree_id_foreign` FOREIGN KEY (`degree_id`) REFERENCES `degrees` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `semesters_department_id_foreign` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `semester_subject`
--
ALTER TABLE `semester_subject`
  ADD CONSTRAINT `semester_subject_semester_id_foreign` FOREIGN KEY (`semester_id`) REFERENCES `semesters` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `semester_subject_subject_id_foreign` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `students_batch_id_foreign` FOREIGN KEY (`batch_id`) REFERENCES `batches` (`id`),
  ADD CONSTRAINT `students_college_id_foreign` FOREIGN KEY (`college_id`) REFERENCES `colleges` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `students_degree_id_foreign` FOREIGN KEY (`degree_id`) REFERENCES `degrees` (`id`),
  ADD CONSTRAINT `students_department_id_foreign` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`),
  ADD CONSTRAINT `students_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `subjects`
--
ALTER TABLE `subjects`
  ADD CONSTRAINT `subjects_college_id_foreign` FOREIGN KEY (`college_id`) REFERENCES `colleges` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_college_id_foreign` FOREIGN KEY (`college_id`) REFERENCES `colleges` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
