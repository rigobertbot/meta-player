<?php
/*
 * MetaPlayer 1.0
 *
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 *
 * Copyright(c) 2010-2013 Val Dubrava [ valery.dubrava@gmail.com ]
 *
 */
namespace MetaPlayer\Manager;

use MetaPlayer\Model\Album;

/**
 * @Component(name={albumManager})
 * @author Val Dubrava <valery.dubrava@gmail.com>
 */
class AlbumManager
{
    /**
     * @Resource
     * @var \MetaPlayer\Manager\SecurityManager
     */
    private $securityManager;

    /**
     * @Resource
     * @var \MetaPlayer\Repository\UserAlbumRepository
     */
    private $userAlbumRepository;

    /**
     * @Resource
     * @var \MetaPlayer\Repository\UserBandRepository
     */
    private $userBandRepository;

    /**
     * @Resource
     * @var \MetaPlayer\Manager\BandManager
     */
    private $bandManager;

    /**
     * Creates user album (and band if it necessary) using the specified album.
     *
     * @param MetaPlayer\Model\Album $album
     * @param string $source
     * @return MetaPlayer\Model\UserAlbum
     */
    public function createUserAlbumByAlbum(\MetaPlayer\Model\Album $album, $source) {
        $band = $album->getBand();
        $userBand = $this->userBandRepository->findOneByBandAndUser($band, $this->securityManager->getUser());
        if ($userBand == null) {
            $userBand = $this->bandManager->createUserBandByBand($band, $source);
        }

        $userAlbum = new \MetaPlayer\Model\UserAlbum($userBand, $album->getTitle(), $album->getReleaseDate(), $source);
        $userAlbum->setAlbum($album);

        $this->userAlbumRepository->persistAndFlush($userAlbum);
        return $userAlbum;
    }
}
