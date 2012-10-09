/** band **/
ALTER TABLE `user_band`
	DROP FOREIGN KEY `fk_user_band_band`;

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

