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
use Doctrine\DBAL\LockMode;
use MetaPlayer\MetaPlayerException;
use MetaPlayer\Model\User;

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
        $criteria = array($this->getSocialIdField($socialNetwork) => $socialId);
        $user = $this->findOneBy($criteria);
        if (isset($user)) {
            $user->setSocialNetwork($socialNetwork);
        }
        return $user;
    }

    /**
     * @param SocialNetwork $socialNetwork
     * @return string
     * @throws \MetaPlayer\MetaPlayerException
     */
    private function getSocialIdField(SocialNetwork $socialNetwork) {
        switch ($socialNetwork) {
            case SocialNetwork::$VK:
                return 'vkId';
            case SocialNetwork::$MY:
                return 'myId';
            default:
                throw MetaPlayerException::unsupportedSocialNetwork($socialNetwork);
        }
    }

    /**
     * Finds all users of the specified social network.
     * @param SocialNetwork $socialNetwork
     * @return User[]
     */
    public function findBySocialNetwork(SocialNetwork $socialNetwork) {
        $users = $this->getEntityManager()->createQuery("SELECT u FROM MetaPlayer\\Model\\User u WHERE u." . $this->getSocialIdField($socialNetwork) . " IS NOT NULL")->execute();
        foreach ($users as $user) {
            /** @var $user User **/
            $user->setSocialNetwork($socialNetwork);
        }
        return $users;
    }

    /**
     * Finds admin users for the specified social network.
     * @param SocialNetwork $socialNetwork
     * @return mixed
     */
    public function findAdminsBySocialNetwork(SocialNetwork $socialNetwork) {
        $users = $this->getEntityManager()->createQuery("SELECT u FROM MetaPlayer\\Model\\User u WHERE u.isAdmin = TRUE AND u." . $this->getSocialIdField($socialNetwork) . " IS NOT NULL")->execute();
        foreach ($users as $user) {
            /** @var $user User **/
            $user->setSocialNetwork($socialNetwork);
        }
        return $users;
    }

    /**
     * @param array $criteria
     * @return User
     */
    public function findOneBy(array $criteria) {
        return parent::findOneBy($criteria);
    }

    /**
     * @param array $criteria
     * @param array|null $orderBy
     * @param null $limit
     * @param null $offset
     * @return User[]
     */
    public function findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null) {
        return parent::findBy($criteria, $orderBy, $limit, $offset);
    }

    /**
     * @param int $id
     * @param int|null $lockMode
     * @param null $lockVersion
     * @internal param \MetaPlayer\Model\SocialNetwork $socialNetwork
     * @return \MetaPlayer\Model\User
     */
    public function find($id, $lockMode = LockMode::NONE, $lockVersion = null) {
        return parent::find($id, $lockMode, $lockVersion);
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
