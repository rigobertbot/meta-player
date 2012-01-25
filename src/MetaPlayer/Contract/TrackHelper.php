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
 * Date: 13.01.12
 * Time: 19:10
 */
namespace MetaPlayer\Contract;

use MetaPlayer\Model\Track;
use MetaPlayer\Model\UserTrack;

/**
 * The class TrackHelper provides methods for converting Track to TrackDto and vise versa.
 * @Component(name={trackHelper})
 *
 * @author Val Dubrava <valery.dubrava@gmail.com>
 */
class TrackHelper
{
    private static $userTrackIdPrefix = "user_";

    /**
     * @Resource
     * @var \MetaPlayer\Repository\UserAlbumRepository
     */
    private $userAlbumRepository;

    /**
     * @Resource
     * @var AlbumHelper
     */
    private $albumHelper;

    /**
     * @Resource
     * @var \MetaPlayer\Manager\SecurityManager
     */
    private $securityManager;

    /**
     * @param TrackDto $dto
     * @return \MetaPlayer\Model\UserTrack
     */
    public function convertDtoToUserTrack(TrackDto $dto) {
        $dto->albumId = $this->albumHelper->convertDtoToUserAlbumId($dto->albumId);
        $userAlbum = $this->userAlbumRepository->find($dto->albumId);

        $userTrack = new \MetaPlayer\Model\UserTrack(
            $this->securityManager->getUser(),
            $userAlbum,
            $dto->source,
            $dto->title,
            $dto->duration,
            $dto->serial);

        return $userTrack;
    }

    /**
     * @param \MetaPlayer\Model\UserTrack $userTrack
     * @return TrackDto
     */
    public function convertUserTrackToDto(\MetaPlayer\Model\UserTrack $userTrack) {
        $dto = new TrackDto();
        $dto->id = $this->convertUserTrackIdToDto($userTrack->getId());
        $dto->albumId = $this->albumHelper->convertUserAlbumIdToDto($userTrack->getUserAlbum()->getId());
        $dto->duration = $userTrack->getDuration();
        $dto->serial = $userTrack->getSerial();
        $dto->source = $userTrack->getSource();
        $dto->title = $userTrack->getTitle();
        return $dto;
    }

    public function convertUserTrackIdToDto($userTrackId) {
        return self::$userTrackIdPrefix . $userTrackId;
    }

    public function convertDtoToUserTrackId($dtoUserTrackId) {
        if (strpos($dtoUserTrackId, self::$userTrackIdPrefix) !== 0) {
            throw new \MetaPlayer\MetaPlayerException("Argument dtoAlbumId ($dtoUserTrackId) isn't a user album id.");
        }
        return substr($dtoUserTrackId, strlen(self::$userTrackIdPrefix));
    }
}
