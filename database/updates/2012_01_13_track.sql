CREATE TABLE `user_track` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `user_album_id` BIGINT UNSIGNED NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `duration` INTEGER UNSIGNED NOT NULL,
  `serial` INTEGER UNSIGNED NOT NULL,
  `source` VARCHAR(255) NOT NULL,
  `is_approved` TINYINT(1) UNSIGNED NOT NULL DEFAULT 0,
  `track_id` BIGINT UNSIGNED,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `ux_title`(`user_id`, `user_album_id`, `title`),
  INDEX `ux_serial`(`user_id`, `user_album_id`, `serial`),
  CONSTRAINT `fk_user_track_user` FOREIGN KEY `fk_user_track_user` (`user_id`)
    REFERENCES `user` (`id`)
    ON DELETE CASCADE
    ON UPDATE RESTRICT,
  CONSTRAINT `fk_user_track_user_album` FOREIGN KEY `fk_user_track_user_album` (`user_album_id`)
    REFERENCES `user_album` (`id`)
    ON DELETE CASCADE
    ON UPDATE RESTRICT,
  CONSTRAINT `fk_user_track_track` FOREIGN KEY `fk_user_track_track` (`track_id`)
    REFERENCES `track` (`id`)
    ON DELETE SET NULL
    ON UPDATE RESTRICT
)
ENGINE = InnoDB;

ALTER TABLE `user_band` ADD COLUMN `band_id` BIGINT UNSIGNED AFTER `is_approved`,
 ADD CONSTRAINT `fk_user_band_band` FOREIGN KEY `fk_user_band_band` (`band_id`)
    REFERENCES `band` (`id`)
    ON DELETE SET NULL
    ON UPDATE RESTRICT;

ALTER TABLE `user_album` ADD COLUMN `album_id` BIGINT UNSIGNED AFTER `is_approved`,
 ADD CONSTRAINT `fk_user_album_album` FOREIGN KEY `fk_user_album_album` (`album_id`)
    REFERENCES `album` (`id`)
    ON DELETE SET NULL
    ON UPDATE RESTRICT,
 ADD CONSTRAINT `fk_user_album_user` FOREIGN KEY `fk_user_album_user` (`user_id`)
    REFERENCES `user` (`id`)
    ON DELETE CASCADE
    ON UPDATE RESTRICT,
 ADD CONSTRAINT `fk_user_album_user_band` FOREIGN KEY `fk_user_album_user_band` (`user_band_id`)
    REFERENCES `user_band` (`id`)
    ON DELETE CASCADE
    ON UPDATE RESTRICT;
