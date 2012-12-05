CREATE TABLE `association` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `track_id` BIGINT UNSIGNED NOT NULL,
  `social_network` VARCHAR(255) NOT NULL COMMENT 'social network',
  `social_id` VARCHAR(255) NOT NULL COMMENT 'audio id in social network',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `ux_social_netowrk_social_id`(`social_network`, `social_id`),
  CONSTRAINT `fk_association_track_track_id` FOREIGN KEY `fk_association_track_track_id` (`track_id`)
    REFERENCES `track` (`id`)
    ON DELETE CASCADE
    ON UPDATE RESTRICT
) ENGINE = InnoDB;

ALTER TABLE `association` ADD COLUMN `popularity` INTEGER NOT NULL DEFAULT 0 AFTER `social_id`;

ALTER TABLE `association` ADD INDEX `ix_popularity`(`popularity`);

