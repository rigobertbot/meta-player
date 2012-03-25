ALTER TABLE `user` 
	ADD COLUMN `social_id` VARCHAR(255) NOT NULL DEFAULT '' AFTER `is_admin`, 
	ADD UNIQUE INDEX `ux_social_id`(`social_id`, `type`);

UPDATE `user` SET `social_id` = `vk_id`, `type` = 'MetaPlayer\\Model\\SocialNetwork::vk';

ALTER TABLE `user` 
	MODIFY COLUMN `type` VARCHAR(127) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL;

ALTER TABLE `user` 
	DROP COLUMN `vk_id`,
	DROP COLUMN `my_id`,
	MODIFY COLUMN `social_id` VARCHAR(255) NOT NULL;

