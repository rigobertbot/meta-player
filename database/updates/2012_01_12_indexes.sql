ALTER TABLE `user_band` DROP INDEX `uix_name`,
 ADD UNIQUE INDEX `uix_name` USING BTREE(`user_id`, `name`);
