ALTER TABLE `metaplayer`.`user` ADD COLUMN `type` VARCHAR(127) NOT NULL DEFAULT 'MetaPlayer\\Model\\SocialNetwork::vk' AFTER `my_id`;
