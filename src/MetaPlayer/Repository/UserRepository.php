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

use MetaPlayer\Model\User;

/**
 * The class UserRepository represents repository of the User.
 *
 * @author Val Dubrava <valery.dubrava@gmail.com>
 */
class UserRepository extends BaseRepository {
    public function findOneByVkId($vkId) {
        return $this->findOneBy(array('vkId' => $vkId));
    }

    /**
     * Adds user entity to session.
     *
     * @param User $user 
     */
    public function persistAndFlush($user) {
        $this->getEntityManager()->persist($user);
        $this->getEntityManager()->flush();
    }
}
