/** track **/
ALTER TABLE `user_track`
    DROP FOREIGN KEY `fk_user_track_user`,
	DROP INDEX `fk_user_track_user_album`,
	DROP INDEX `fk_user_track_track`;

ALTER TABLE `track` 
	DROP INDEX `fk_track_album`;

DELETE FROM track;

ALTER TABLE `track` ADD CONSTRAINT `fk_track_album` FOREIGN KEY `fk_track_album` (`album_id`)
    REFERENCES `album` (`id`)
    ON DELETE CASCADE
    ON UPDATE RESTRICT;

DELETE FROM user_track WHERE user_album_id NOT IN (SELECT id FROM user_album);

INSERT INTO track (title, album_id, duration, serial)
	SELECT ut.title, ua.album_id, max(ut.duration), min(ut.serial) 
	FROM user_track ut LEFT JOIN user_album ua ON ut.user_album_id = ua.id 
	GROUP BY ut.title, ua.album_id;

UPDATE user_track u SET track_id = (
	SELECT t.id 
	FROM track t, user_album ua 
	WHERE ua.id = u.user_album_id AND t.album_id = ua.album_id AND lower(t.title) = lower(u.title) LIMIT 1
);

ALTER TABLE `user_track` 
	DROP COLUMN `is_approved`,
	ADD CONSTRAINT `fk_user_track_user` FOREIGN KEY `fk_user_track_user` (`user_id`)
    	REFERENCES `user` (`id`)
	    ON DELETE CASCADE
    	ON UPDATE RESTRICT,
	ADD CONSTRAINT `fk_user_track_user_album` FOREIGN KEY `fk_user_track_user_album` (`user_album_id`)
	    REFERENCES `user_album` (`id`)
    	ON DELETE CASCADE
	    ON UPDATE RESTRICT,
	ADD CONSTRAINT `fk_user_track_track` FOREIGN KEY `fk_user_track_track` (`track_id`)
    	REFERENCES `track` (`id`)
	    ON DELETE RESTRICT
    	ON UPDATE RESTRICT;
