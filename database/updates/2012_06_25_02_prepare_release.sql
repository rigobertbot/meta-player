DELETE FROM user_band WHERE user_id not in (select id from `user`);

ALTER TABLE `user_band` ADD CONSTRAINT `fk_user_band_user` FOREIGN KEY `fk_user_band_user` (`user_id`)
REFERENCES `user` (`id`)
  ON DELETE CASCADE
  ON UPDATE RESTRICT;

alter table user_band drop index fk_user_band_band;

ALTER TABLE `user_band`
  ADD CONSTRAINT `fk_user_band_band` FOREIGN KEY `fk_user_band_band` (`band_id`)
  REFERENCES `band` (`id`)
    ON DELETE SET NULL
    ON UPDATE RESTRICT;

DELETE from user_album where user_id not in (select id from user);

ALTER TABLE `user_album`
  ADD CONSTRAINT `fk_user_album_user` FOREIGN KEY `fk_user_album_user` (`user_id`)
  REFERENCES `user` (`id`)
    ON DELETE CASCADE
    ON UPDATE RESTRICT;

delete from user_track where user_id not in (select id from user);

ALTER TABLE user_track
  ADD CONSTRAINT `fk_user_track_user` FOREIGN KEY `fk_user_track_user` (`user_id`)
  REFERENCES `user` (`id`)
    ON DELETE CASCADE
    ON UPDATE RESTRICT;
