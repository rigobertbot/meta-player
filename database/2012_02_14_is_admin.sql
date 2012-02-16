ALTER TABLE `metaplayer`.`user` ADD COLUMN `is_admin` TINYINT UNSIGNED NOT NULL DEFAULT 0 AFTER `vk_id`;

CREATE TABLE `metaplayer`.`applied_script` (
  `script` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`script`)
)
ENGINE = InnoDB;

INSERT INTO `metaplayer`.`applied_script` VALUES ('2012_02_14_is_admin.sql');