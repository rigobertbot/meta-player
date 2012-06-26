/** band **/
DELETE FROM band;

INSERT INTO band (name, found_date, end_date) 
	SELECT u.name, MIN(u.found_date), MAX(u.end_date) 
		FROM user_band u 
		GROUP BY u.name;

UPDATE user_band u SET band_id = (SELECT id FROM band b WHERE lower(b.name) = lower(u.name) LIMIT 1);

ALTER TABLE `user_band` 
	ADD CONSTRAINT `fk_user_band_user` FOREIGN KEY `fk_user_band_user` (`user_id`)
    	REFERENCES `user` (`id`)
	    ON DELETE CASCADE
	    ON UPDATE RESTRICT,
	ADD CONSTRAINT `fk_user_band_band` FOREIGN KEY `fk_user_band_band` (`band_id`)
	    REFERENCES `band` (`id`)
	    ON DELETE RESTRICT
    	ON UPDATE RESTRICT;

/** album **/
DELETE FROM album;

ALTER TABLE `album` ADD CONSTRAINT `fk_album_band` FOREIGN KEY `fk_album_band` (`band_id`)
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
/** track **/
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
