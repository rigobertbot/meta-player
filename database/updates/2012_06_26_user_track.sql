ALTER TABLE `user_track` 
	ADD COLUMN `vk_association_id` BIGINT UNSIGNED AFTER `track_id`,
 	ADD COLUMN `my_association_id` BIGINT UNSIGNED AFTER `vk_association_id`,
 	ADD CONSTRAINT `fk_user_track_association_vk_association_id` FOREIGN KEY `fk_user_track_association_vk_association_id` (`vk_association_id`)
    	REFERENCES `association` (`id`)
	    ON DELETE SET NULL
    	ON UPDATE RESTRICT,
	ADD CONSTRAINT `fk_user_track_association_my_association_id` FOREIGN KEY `fk_user_track_association_my_association_id` (`my_association_id`)
    	REFERENCES `association` (`id`)
	    ON DELETE SET NULL
    	ON UPDATE RESTRICT;