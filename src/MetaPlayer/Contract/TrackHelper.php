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
     * Populates the specified user track with values from dto.
     * @param \MetaPlayer\Model\UserTrack $userTrack
     * @param TrackDto $dto
     */
    public function populateUserTrackWithDto(UserTrack $userTrack, TrackDto $dto) {
        $userTrack->setTitle($dto->title);
        $userTrack->setDuration($dto->duration);
        $userTrack->setSerial($dto->serial);
        $userTrack->setSource($dto->source);
    }

    /**
     * @param \MetaPlayer\Model\UserTrack $userTrack
     * @return TrackDto
     */
    public function convertUserTrackToDto(\MetaPlayer\Model\UserTrack $userTrack) {
        $dto = $this->convertBaseTrackToDto($userTrack);
        $dto->id = $this->convertUserTrackIdToDto($userTrack->getId());
        $dto->albumId = $this->albumHelper->convertUserAlbumIdToDto($userTrack->getUserAlbum()->getId());
        $dto->source = $userTrack->getSource();
        return $dto;
    }

    /**
     * @param \MetaPlayer\Model\BaseTrack $baseTrack
     * @return TrackDto
     */
    private function convertBaseTrackToDto(\MetaPlayer\Model\BaseTrack $baseTrack) {
        $dto = new TrackDto();
        $dto->title = $baseTrack->getTitle();
        $dto->duration = $baseTrack->getDuration();
        $dto->serial = $baseTrack->getSerial();
        return $dto;
    }

    /**
     * @param \MetaPlayer\Model\Track $track
     * @return TrackDto
     */
    public function convertTrackToDto(Track $track) {
        $dto = $this->convertBaseTrackToDto($track);
        $dto->albumId = $track->getAlbum()->getId();
        return $dto;
    }

    public function convertUserTrackIdToDto($userTrackId) {
        return self::$userTrackIdPrefix . $userTrackId;
    }

    public function convertDtoToUserTrackId($dtoUserTrackId) {
        if (!$this->isDtoUserTrackId($dtoUserTrackId)) {
            throw new \MetaPlayer\MetaPlayerException("Argument dtoAlbumId ($dtoUserTrackId) isn't a user album id.");
        }
        return substr($dtoUserTrackId, strlen(self::$userTrackIdPrefix));
    }

    /**
     * Checks if specified DTO's id belongs to user track.
     * @param $dtoId
     * @return bool
     */
    public function isDtoUserTrackId($dtoId) {
        return strpos($dtoId, self::$userTrackIdPrefix) === 0;
    }
}
