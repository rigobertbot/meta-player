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
use Doctrine\DBAL\LockMode;
use MetaPlayer\Model\UserAlbum;
use Doctrine\ORM\EntityRepository;
use MetaPlayer\Model\UserTrack;

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
        return $this->findBy(array('user' => $user, 'userAlbum' => $userAlbumId), array('serial' => 'asc'));
    }

    /**
     * @param UserAlbum $userAlbum
     * @param $title
     * @return \MetaPlayer\Model\UserTrack
     */
    public function findOneByUserAlbumAndTitle(UserAlbum $userAlbum, $title) {
        return $this->findOneBy(array('user' => $userAlbum->getUser(), 'userAlbum' => $userAlbum, 'title' => $title));
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

    /**
     * @param int $id
     * @param int $lockMode
     * @param null $lockVersion
     * @return UserTrack
     */
    public function find($id, $lockMode = LockMode::NONE, $lockVersion = null) {
        return parent::find($id, $lockMode, $lockVersion);
    }


}
