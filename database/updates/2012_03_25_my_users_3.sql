ALTER TABLE `metaplayer`.`user` ADD COLUMN `is_admin` TINYINT(1) UNSIGNED NOT NULL DEFAULT 0 AFTER `type`;