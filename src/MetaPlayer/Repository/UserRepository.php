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
        return $this->getRepository($socialNetwork)->findOneBy(array('socialId' => $socialId));
    }

    /**
     * @param \MetaPlayer\Model\SocialNetwork $socialNetwork
     * @return \Doctrine\ORM\EntityRepository
     * @throws \MetaPlayer\MetaPlayerException
     */
    private function getRepository(SocialNetwork $socialNetwork) {
        switch ($socialNetwork) {
            case SocialNetwork::$MY:
                return $this->getEntityManager()->getRepository('MetaPlayer\Model\MyUser');
            case SocialNetwork::$VK:
                return $this->getEntityManager()->getRepository('MetaPlayer\Model\VkUser');
            default:
                throw new \MetaPlayer\MetaPlayerException("Unsupport SocialNetwork type " . $socialNetwork);
        }
    }

    /**
     * Creates a new user.
     * @param $socialId
     * @param $socialNetwork
     * @return \MetaPlayer\Model\MyUser|\MetaPlayer\Model\VkUser
     * @throws \MetaPlayer\MetaPlayerException
     */
    public function createUser($socialId, $socialNetwork) {
        switch ($socialNetwork) {
            case SocialNetwork::$MY:
                return new MyUser($socialId);
            case SocialNetwork::$VK:
                return new VkUser($socialId);
            default:
                throw new \MetaPlayer\MetaPlayerException("Unsupport SocialNetwork type " . $socialNetwork);
        }
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
