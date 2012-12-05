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
use MetaPlayer\Model\ModelException;
use MetaPlayer\Model\UserTrack;

/**
 * The class TrackHelper provides methods for converting Track to TrackDto and vise versa.
 * @Component(name={trackHelper})
 *
 * @author Val Dubrava <valery.dubrava@gmail.com>
 */
class TrackHelper extends BaseHelper
{
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
     * @Resource
     * @var AssociationHelper
     */
    private $associationHelper;

    /**
     * @param TrackDto $dto
     * @return \MetaPlayer\Model\UserTrack
     */
    public function convertDtoToUserTrack(TrackDto $dto) {
        $userAlbum = $this->userAlbumRepository->find($dto->albumId);

        $userTrack = new UserTrack(
            $this->securityManager->getUser(),
            $userAlbum,
            $dto->source,
            $dto->title,
            $dto->duration,
            $dto->serial);

        return $userTrack;
    }

    public function convertDtoToTrack(TrackDto $dto) {
        $userAlbum = $this->userAlbumRepository->find($dto->albumId);
        $album = $userAlbum->getGlobalAlbum();
        if ($album == null) {
            throw ModelException::thereIsNoGlobalObject($userAlbum, 'Album');
        }
        $track = new Track(
            $album,
            $dto->title,
            $dto->duration,
            $dto->serial);
        return $track;
    }

    /**
     * Populates the specified user track with values from dto.
     * @param \MetaPlayer\Model\UserTrack $userTrack
     * @param TrackDto $dto
     */
    public function populateUserTrackWithDto(UserTrack $userTrack, TrackDto $dto) {
        $userTrack->setTitle($this->trimText($dto->title));
        $userTrack->setDuration($this->parseInt($dto->duration));
        $userTrack->setSerial($this->parseInt($dto->serial));
        $userTrack->setSource($dto->source);
    }

    /**
     * @param \MetaPlayer\Model\UserTrack $userTrack
     * @return TrackDto
     */
    public function convertUserTrackToDto(\MetaPlayer\Model\UserTrack $userTrack) {
        $dto = $this->convertBaseTrackToDto($userTrack);

        $dto->id = $userTrack->getId();
        $dto->albumId = $userTrack->getUserAlbum()->getId();
        $dto->source = $userTrack->getSource();
        $association = $userTrack->getAssociation($this->securityManager->getSocialNetwork());
        if ($association != null) {
            $dto->association = $this->associationHelper->convertAssociationToDto($association);
            $dto->association->userTrackId = $userTrack->getId();
        }
        $dto->shareId = "t" . $userTrack->getGlobalTrack()->getId();

        return $dto;
    }

    /**
     * @param \MetaPlayer\Model\BaseTrack $baseTrack
     * @return TrackDto
     */
    private function convertBaseTrackToDto(\MetaPlayer\Model\BaseTrack $baseTrack) {
        $dto = new TrackDto();
        $dto->id = $baseTrack->getId();
        $dto->title = $baseTrack->getTitle();
        $dto->duration = $baseTrack->getDuration();
        $dto->serial = $baseTrack->getSerial();
        $dto->queries = $baseTrack->getQueries();
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
}
