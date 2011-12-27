<?php

/*
 * MetaPlayer 1.0
 *  
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 * 
 * Copyright(c) 2010-2011 Val Dubrava [ valery.dubrava@gmail.com ] 
 *  
 */

namespace MetaPlayer\Repository;

use MetaPlayer\Model\Band;
use MetaPlayer\Model\UserBand;
use MetaPlayer\Model\User;
use MetaPlayer\Manager\SecurityManager;

/**
 * The class UserBandRepository represents repository of the UserBand.
 *
 * @author Val Dubrava <valery.dubrava@gmail.com>
 */
class UserBandRepository extends BaseRepository {
    public function findNotApproved(User $user) {
        return $this->findBy(array('isApproved' => false, 'user' => $user));
    }
}
