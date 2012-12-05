ALTER TABLE `metaplayer`.`album` ADD UNIQUE INDEX `uix_title`(`band_id`, `title`);

ALTER TABLE `metaplayer`.`band` ADD UNIQUE INDEX `uix_name`(`name`);

ALTER TABLE `metaplayer`.`track` ADD UNIQUE INDEX `uix_title`(`album_id`, `title`);

ALTER TABLE `metaplayer`.`track` ADD INDEX `uix_serial`(`album_id`, `serial`);

ALTER TABLE `metaplayer`.`user_band` ADD INDEX `uix_name`(`user_id`, `name`);
