ALTER TABLE `user_track` DROP INDEX `ux_serial`,
 ADD UNIQUE INDEX `ux_serial` USING BTREE(`user_id`, `user_album_id`, `serial`);
