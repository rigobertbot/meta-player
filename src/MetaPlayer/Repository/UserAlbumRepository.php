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

use Doctrine\ORM\Mapping\ClassMetadata;
use Doctrine\DBAL\LockMode;
use MetaPlayer\Model\UserBand;
use MetaPlayer\Model\UserAlbum;
use MetaPlayer\Model\User;

/**
 * The class UserAlbumRepository represents repository of the UserAlbum.
 *
 * @author Val Dubrava <valery.dubrava@gmail.com>
 */
class UserAlbumRepository extends BaseRepository {
    public function __construct($em, ClassMetadata $class) {
        parent::__construct($em, $class);
        
        // $class->rootEntityName = $class->name;
    }

    /**
     * @param \MetaPlayer\Model\User $user
     * @param $userBandId
     * @return \MetaPlayer\Model\UserAlbum[]
     */
    public function findByUserAndUserBand(User $user, $userBandId) {
        return $this->findBy(array('user' => $user, 'userBand' => $userBandId), array('releaseDate' => 'asc'));
    }

    /**
     * @param \MetaPlayer\Model\User $user
     * @param $albumId
     * @return UserAlbum|null
     */
    public function  findOneByUserAndAlbum(User $user, $albumId) {
        return $this->findOneBy(array('user' => $user, 'album' => $albumId));
    }

    /**
     * @param UserBand $userBand
     * @param $title
     * @return UserAlbum
     */
    public function findOneByUserBandAndName(UserBand $userBand, $title) {
        return $this->findOneBy(array('user' => $userBand->getUser(), 'userBand' => $userBand, 'title' => $title));
    }

    /**
     * @param int $id
     * @param int $lockMode
     * @param null $lockVersion
     * @return UserAlbum
     */
    public function find($id, $lockMode = LockMode::NONE, $lockVersion = null) {
        return parent::find($id, $lockMode, $lockVersion);
    }


    /**
     * @param $entity
     * @return UserAlbumRepository
     * @throws \MetaPlayer\MetaPlayerException
     */
    public function remove($entity) {
        if ($entity->isApproved()) {
            throw new \MetaPlayer\MetaPlayerException("Impossible to remove approved user entity.");
        }
        return parent::remove($entity);
    }
}
