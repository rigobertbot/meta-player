CREATE TABLE `user_album` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `user_band_id` BIGINT UNSIGNED NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `releace_date` DATE NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `uix_title`(`user_id`, `user_band_id`, `title`)
)
ENGINE = InnoDB;

ALTER TABLE `user_album` ADD COLUMN `source` VARCHAR(1024) NOT NULL AFTER `releace_date`,
 ADD COLUMN `is_approved` TINYINT(1) UNSIGNED NOT NULL DEFAULT 0 AFTER `source`;
ALTER TABLE `user_album` CHANGE COLUMN `releace_date` `release_date` DATE NOT NULL;

ALTER TABLE `user_album` DROP INDEX `uix_title`,
 ADD UNIQUE INDEX `uix_title` USING BTREE(`user_id`, `user_band_id`, `title`);

 ALTER TABLE `user_album` DROP PRIMARY KEY,
 ADD PRIMARY KEY (`id`);

