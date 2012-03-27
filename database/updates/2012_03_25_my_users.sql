ALTER TABLE `user` 
	CHANGE COLUMN `vk_id` `vk_social_id` VARCHAR(127) DEFAULT NULL,
	ADD COLUMN `my_social_id` VARCHAR(127) AFTER `is_admin`,
	ADD COLUMN `type` VARCHAR(255) NOT NULL DEFAULT 'MetaPlayer\\Model\\SocialNetwork::vk' AFTER `my_social_id`, 
	DROP INDEX `ix_user_vk_id`,
	ADD UNIQUE INDEX `ux_vk_social_id`(`type`, `vk_social_id`),
	ADD UNIQUE INDEX `ux_my_social_id`(`type`, `my_social_id`);

ALTER TABLE `user` 
	MODIFY COLUMN `type` VARCHAR(255) NOT NULL;