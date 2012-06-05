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

use \MetaPlayer\Model\SocialNetwork;
use MetaPlayer\Model\User;
use MetaPlayer\Model\MyUser;
use MetaPlayer\Model\VkUser;

/**
 * The class UserRepository represents repository of the User.
 *
 * @author Val Dubrava <valery.dubrava@gmail.com>
 */
class UserRepository extends BaseRepository {
    /**
     * @param $socialId
     * @param \MetaPlayer\Model\SocialNetwork $socialNetwork
     * @return User
     * @throws \MetaPlayer\MetaPlayerException
     */
    public function findOneBySocialId($socialId, SocialNetwork $socialNetwork) {
        $criteria = array();
        switch ($socialNetwork) {
            case SocialNetwork::$VK:
                $criteria['vkId'] = $socialId;
                break;
            case SocialNetwork::$MY:
                $criteria['myId'] = $socialId;
                break;
        }
        $user = $this->findOneBy($criteria);
        $user->setSocialNetwork($socialNetwork);
        return $user;
    }

    /**
     * @param array $criteria
     * @return User
     */
    public function findOneBy(array $criteria) {
        return parent::findOneBy($criteria);
    }

    /**
     * Adds user entity to session.
     *
     * @param \MetaPlayer\Model\User $user
     * @return \MetaPlayer\Repository\BaseRepository
     */
    public function persistAndFlush($user) {
        $this->getEntityManager()->persist($user);
        $this->getEntityManager()->flush();
        return $this;
    }
}
