/** album **/
ALTER TABLE `user_album` 
	DROP FOREIGN KEY `fk_user_album_album`,
	DROP FOREIGN KEY `fk_user_album_user_band`;

ALTER TABLE `album`
	DROP FOREIGN KEY `fk_album_band`;

DELETE FROM album;

ALTER TABLE `album` 
	ADD CONSTRAINT `fk_album_band` FOREIGN KEY `fk_album_band` (`band_id`)
	    REFERENCES `band` (`id`)
	    ON DELETE CASCADE
	    ON UPDATE RESTRICT;

DELETE FROM user_album WHERE user_band_id NOT IN (SELECT id FROM user_band);

INSERT INTO album (title, band_id, release_date) 
	SELECT ua.title, ub.band_id, MIN(ua.release_date) 
	FROM user_album ua LEFT JOIN user_band ub ON ua.user_band_id = ub.id 
	GROUP BY ua.title, ub.band_id;

UPDATE user_album u SET album_id = (
	SELECT a.id 
	FROM album a, user_band ub 
	WHERE ub.id = u.user_band_id AND a.band_id = ub.band_id AND lower(a.title) = lower(u.title) LIMIT 1
);

ALTER TABLE `user_album` 
	DROP COLUMN `is_approved`,
	ADD CONSTRAINT `fk_user_album_user_band` FOREIGN KEY `fk_user_album_user_band` (`user_band_id`)
    	REFERENCES `user_band` (`id`)
	    ON DELETE CASCADE
    	ON UPDATE RESTRICT,
	ADD CONSTRAINT `fk_user_album_user` FOREIGN KEY `fk_user_album_user` (`user_id`)
	    REFERENCES `user` (`id`)
    	ON DELETE CASCADE
	    ON UPDATE RESTRICT,
	ADD CONSTRAINT `fk_user_album_album` FOREIGN KEY `fk_user_album_album` (`album_id`)
	    REFERENCES `album` (`id`)
    	ON DELETE RESTRICT
	    ON UPDATE RESTRICT;
