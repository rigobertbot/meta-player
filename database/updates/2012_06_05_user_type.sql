ALTER TABLE `user` 
	DROP COLUMN `type`,
	DROP INDEX `ux_vk_social_id`,
	ADD UNIQUE INDEX `ux_vk_social_id`(`vk_social_id`),
	DROP INDEX `ux_my_social_id`,
	ADD UNIQUE INDEX `ux_my_social_id`(`my_social_id`);
