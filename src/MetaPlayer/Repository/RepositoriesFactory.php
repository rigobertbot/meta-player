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

use Doctrine\ORM\EntityManager;

/**
 * The class RepositoryFactory construct all repositories.
 *
 * @author Val Dubrava <valery.dubrava@gmail.com>
 * @Configuration
 */
class RepositoriesFactory
{
    /**
     * @Resource
     * @var EntityManager
     */
    private $entityManager;


    /**
     * @Bean(name={bandRepository, BandRepository})
     * @return BandRepository
     */
    public function getBandRepository() {
        return $this->entityManager->getRepository('MetaPlayer\Model\Band');
    }

    /**
     * @Bean(name={albumRepository, AlbumRepository})
     * @return AlbumRepository
     */
    public function getAlbumRepository() {
        return $this->entityManager->getRepository('MetaPlayer\Model\Album');
    }

    /**
     * @Bean(name={trackRepository, TrackRepository})
     * @return TrackRepository
     */
    public function getTrackRepository() {
        return $this->entityManager->getRepository('MetaPlayer\Model\Track');
    }
    
    /**
     * @Bean(name={userRepository, UserRepository})
     * @return UserRepository
     */
    public function getUserRepository() {
        return $this->entityManager->getRepository('MetaPlayer\Model\User');
    }
    
    /**
     * @Bean(name={userBandRepository, UserBandRepository})
     * @return UserBandRepository
     */
    public function getUserBandRepository() {
        return $this->entityManager->getRepository('MetaPlayer\Model\UserBand');
    }
    
    /**
     * @Bean(name={userAlbumRepository, UserAlbumRepository})
     * @return UserAlbumRepository
     */
    public function getUserAlbumRepository() {
        return $this->entityManager->getRepository('MetaPlayer\Model\UserAlbum');
    }

    /**
     * @Bean(name={userTrackRepository, UserTrackRepository})
     * @return UserTrackRepository
     */
    public function getUserTrackRepository() {
        return $this->entityManager->getRepository('MetaPlayer\Model\UserTrack');
    }

    /**
     * @Bean(name={associationRepository, AssociationRepository})
     * @return AssociationRepository
     */
    public function getAssociationRepository() {
        return $this->entityManager->getRepository('MetaPlayer\Model\Association');
    }
}
