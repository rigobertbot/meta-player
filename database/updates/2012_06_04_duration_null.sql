ALTER TABLE `track` MODIFY COLUMN `duration` INT(10) UNSIGNED DEFAULT NULL COMMENT 'in seconds';
ALTER TABLE `user_track` MODIFY COLUMN `duration` INT(10) UNSIGNED DEFAULT NULL;

