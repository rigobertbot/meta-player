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
/**
 * User: v.dubrava
 * Date: 17.01.12
 * Time: 9:21
 */
namespace MetaPlayer\Repository;
use \Doctrine\ORM\Mapping\ClassMetadata;
use Doctrine\ORM\EntityRepository;

/**
 * The class UserTrackRepository represents
 * @Component(name={UserTrackRepository})
 *
 * @author Val Dubrava <valery.dubrava@gmail.com>
 */
class UserTrackRepository extends BaseRepository {
    public function __construct($em, ClassMetadata $class) {
        parent::__construct($em, $class);
    }

    /**
     * @param \MetaPlayer\Model\User $user
     * @param $userAlbumId
     * @return \MetaPlayer\Model\UserTrack[]
     */
    public function findByUserAndAlbum(\MetaPlayer\Model\User $user, $userAlbumId) {
        return $this->findBy(array('user' => $user, 'userAlbum' => $userAlbumId));
    }

    /**
     * @param $entity
     * @return UserTrackRepository
     * @throws \MetaPlayer\MetaPlayerException
     */
    public function remove($entity) {
        if ($entity->isApproved()) {
            throw new \MetaPlayer\MetaPlayerException("Impossible to remove approved user entity.");
        }
        return parent::remove($entity);
    }
}
