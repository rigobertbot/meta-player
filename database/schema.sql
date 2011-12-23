-- MySQL Administrator dump 1.4
--
-- ------------------------------------------------------
-- Server version	5.5.18


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


--
-- Create schema metaplayer
--

CREATE DATABASE IF NOT EXISTS metaplayer;
USE metaplayer;

--
-- Definition of table `album`
--

DROP TABLE IF EXISTS `album`;
CREATE TABLE `album` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `band_id` bigint(20) unsigned NOT NULL,
  `title` varchar(255) NOT NULL,
  `release_date` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_album_band` (`band_id`),
  CONSTRAINT `fk_album_band` FOREIGN KEY (`band_id`) REFERENCES `band` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `album`
--

/*!40000 ALTER TABLE `album` DISABLE KEYS */;
INSERT INTO `album` (`id`,`band_id`,`title`,`release_date`) VALUES 
 (4,1,'Led Zeppelin','1969-01-12'),
 (5,1,'Led Zeppelin II','1969-10-22'),
 (6,1,'Led Zeppelin III','1970-10-05'),
 (7,1,'Led Zeppelin IV','1971-11-08'),
 (8,1,'Houses of the Holy','1973-03-28'),
 (9,1,'Physical Graffiti','1975-02-24'),
 (10,1,'Presence','1976-03-31'),
 (11,1,'In Through the Out Door','1979-08-15'),
 (12,1,'Coda','1982-11-19');
/*!40000 ALTER TABLE `album` ENABLE KEYS */;


--
-- Definition of table `band`
--

DROP TABLE IF EXISTS `band`;
CREATE TABLE `band` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `found_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `band`
--

/*!40000 ALTER TABLE `band` DISABLE KEYS */;
INSERT INTO `band` (`id`,`name`,`found_date`,`end_date`) VALUES 
 (1,'Led Zeppelin','1968-10-14','1980-12-04');
/*!40000 ALTER TABLE `band` ENABLE KEYS */;


--
-- Definition of table `track`
--

DROP TABLE IF EXISTS `track`;
CREATE TABLE `track` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `album_id` bigint(20) unsigned NOT NULL,
  `title` varchar(255) NOT NULL,
  `duration` int(10) unsigned NOT NULL COMMENT 'in seconds',
  `serial` int(10) unsigned NOT NULL COMMENT 'track number',
  PRIMARY KEY (`id`),
  KEY `fk_track_album` (`album_id`),
  CONSTRAINT `fk_track_album` FOREIGN KEY (`album_id`) REFERENCES `album` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `track`
--

/*!40000 ALTER TABLE `track` DISABLE KEYS */;
INSERT INTO `track` (`id`,`album_id`,`title`,`duration`,`serial`) VALUES 
 (1,4,'Good Times Bad Times',167,11),
 (2,4,'Babe I\'m Gonna Leave You',401,12),
 (3,4,'You Shook Me',390,13),
 (4,4,'Dazed and Confused',387,14),
 (5,4,'Your Time Is Gonna Come',274,21),
 (6,4,'Black Mountain Side',133,22),
 (7,4,'Communication Breakdown',150,23),
 (8,4,'I Can\'t Quit You Baby',283,24),
 (9,4,'How Many More Times',508,25),
 (10,5,'Whole Lotta Love',334,11);
/*!40000 ALTER TABLE `track` ENABLE KEYS */;




/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
