CREATE TABLE `metaplayer`.`user` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `vk_id` BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `ix_user_vk_id`(`vk_id`)
)
ENGINE = InnoDB;

ALTER TABLE `metaplayer`.`user` DROP INDEX `ix_user_vk_id`,
 ADD UNIQUE INDEX `ix_user_vk_id` USING BTREE(`vk_id`);

CREATE TABLE `metaplayer`.`user_band` (
  `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `found_date` DATE NOT NULL,
  `end_date` DATE DEFAULT NULL,
  `source` VARCHAR(1025) NOT NULL,
  `in_master` TINYINT(1) UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
)
ENGINE = InnoDB;

ALTER TABLE `metaplayer`.`user_band` MODIFY COLUMN `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE `metaplayer`.`user_band` ADD CONSTRAINT `fk_user_band_user` FOREIGN KEY `fk_user_band_user` (`user_id`)
    REFERENCES `user` (`id`)
    ON DELETE CASCADE
    ON UPDATE RESTRICT;

ALTER TABLE `metaplayer`.`user_band` CHANGE COLUMN `in_master` `is_approved` TINYINT(1) UNSIGNED NOT NULL DEFAULT 0;
