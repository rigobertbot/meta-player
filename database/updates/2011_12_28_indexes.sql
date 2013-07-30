ALTER TABLE `album` ADD UNIQUE INDEX `uix_title`(`band_id`, `title`);

ALTER TABLE `band` ADD UNIQUE INDEX `uix_name`(`name`);

ALTER TABLE `track` ADD UNIQUE INDEX `uix_title`(`album_id`, `title`);

ALTER TABLE `track` ADD INDEX `uix_serial`(`album_id`, `serial`);

ALTER TABLE `user_band` ADD INDEX `uix_name`(`user_id`, `name`);
