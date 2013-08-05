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

namespace MetaPlayer\Controller;

use \MetaPlayer\Contract\TrackDto;
use MetaPlayer\Model\ModelException;
use \MetaPlayer\JsonException;
use Oak\MVC\JsonViewModel;
use MetaPlayer\ViewHelper;
use MetaPlayer\Repository\TrackRepository;
use MetaPlayer\Model\Track;
use \MetaPlayer\Model\UserTrack;

/**
 * Description of TrackController
 *
 * @author Val Dubrava <valery.dubrava@gmail.com>
 * @Controller
 * @RequestMapping(url={/track/})
 */
class TrackController extends BaseSecurityController implements \Ding\Logger\ILoggerAware
{
    /**
     * @var \Logger
     */
    private $logger;

    /**
     * @Resource
     * @var TrackRepository
     */
    private $trackRepository;

    /**
     * @Resource
     * @var \MetaPlayer\Repository\UserTrackRepository
     */
    private $userTrackRepository;

    /**
     * @Resource
     * @var \MetaPlayer\Repository\UserAlbumRepository
     */
    private $userAlbumRepository;

    /**
     * @Resource
     * @var \MetaPlayer\Repository\AlbumRepository
     */
    private $albumRepository;

    /**
     * @Resource
     * @var \MetaPlayer\Contract\TrackHelper
     */
    private $trackHelper;

    /**
     * @Resource
     * @var \MetaPlayer\Contract\AlbumHelper
     */
    private $albumHelper;

    /**
     * @Resource
     * @var \Oak\Json\JsonUtils
     */
    private $jsonUtils;

    /**
     * @Resource
     * @var \MetaPlayer\Manager\AlbumManager
     */
    private $albumManager;

    /**
     * @Resource
     * @var \MetaPlayer\Repository\AssociationRepository
     */
    private $associationRepository;


    public function listAction($albumId) {
        $data = array();
        $tracks = $this->userTrackRepository->findByUserAndAlbum($this->securityManager->getUser(), $albumId);

        foreach ($tracks as $track) {
            $this->checkAssociation($track);
            $trackDto = $this->trackHelper->convertUserTrackToDto($track);
            $data[] = $trackDto;
        }
        
        return new JsonViewModel($data, $this->jsonUtils);
    }

    private function checkAssociation(UserTrack $userTrack) {
        $association = $userTrack->getAssociation($this->securityManager->getSocialNetwork());
        if ($association == null) {
            $track = $userTrack->getGlobalTrack();
            if ($track == null) {
                throw ModelException::thereIsNoGlobalObject($userTrack, 'Track');
            }
            $association = $this->associationRepository->findOnePopularByTrack($userTrack->getGlobalTrack());
            if ($association != null) {
                $userTrack->associate($this->securityManager->getSocialNetwork(), $association);
            }
        }
    }

    /**
     * @param $json
     * @return TrackDto
     * @throws \MetaPlayer\JsonException
     */
    private function parseJson($json) {
        $trackDto = $this->jsonUtils->deserialize($json);
        if (!$trackDto instanceof TrackDto) {
            $this->logger->error("json should be instance of AlbumDto but got " . print_r($trackDto, true));
            throw new JsonException("Wrong json format.");
        }
        return $trackDto;
    }

    public function addAction($json) {
        $trackDto = $this->parseJson($json);

        $userTrack = $this->trackHelper->convertDtoToUserTrack($trackDto);
        $userAlbum = $userTrack->getAlbum();
        $album = $userAlbum->getGlobalAlbum();

        $track = $this->trackRepository->findOneByAlbumAndTitle($album, $userTrack->getTitle());
        if ($track == null) {
            $track = $this->trackHelper->convertDtoToTrack($trackDto);
            $this->trackRepository->persist($track);
        }
        $userTrack->setGlobalTrack($track);

        $this->userTrackRepository->persist($userTrack);
        $this->userTrackRepository->flush();

        $this->checkAssociation($userTrack);
        $this->userTrackRepository->flush();

        $resultDto = $this->trackHelper->convertUserTrackToDto($userTrack);
        return new JsonViewModel($resultDto, $this->jsonUtils);
    }

    public function addOrGetAction($json) {
        $trackDto = $this->parseJson($json);

        $userAlbum = $this->userAlbumRepository->find($trackDto->albumId);
        if ($userAlbum == null) {
            $this->logger->error("There is no user album with id = {$trackDto->albumId}.");
            throw new JsonException("Invalid id.");
        }
        if ($this->securityManager->getUser() !== $userAlbum->getUser()) {
            $this->logger->error("The user {$this->securityManager->getUser()} tried to access now own album with id = {$trackDto->albumId}.");
            throw new JsonException("Invalid id.");
        }

        $track = $this->userTrackRepository->findOneByUserAlbumAndTitle($userAlbum, $trackDto->title);

        if ($track == null) {
            return $this->addAction($json);
        } else {
            $dto = $this->trackHelper->convertUserTrackToDto($track);
            return new JsonViewModel($dto, $this->jsonUtils);
        }
    }

    public function getAction($id) {
        $userTrack = $this->userTrackRepository->find($id);
        if ($userTrack == null) {
            $this->logger->error("There is no user track with id = $id.");
            throw new JsonException("Invalid id.");
        }
        $this->checkAssociation($userTrack);
        $dto = $this->trackHelper->convertUserTrackToDto($userTrack);
        return new JsonViewModel($dto, $this->jsonUtils);
    }

    /**
     * Update the specified data.
     * @param $json
     * @return \Oak\MVC\JsonViewModel
     */
    public function updateAction($json) {
        $trackDto = $this->parseJson($json);
        $userTrack = $this->userTrackRepository->find($trackDto->id);
        $this->trackHelper->populateUserTrackWithDto($userTrack, $trackDto);
        $album = $userTrack->getAlbum()->getGlobalAlbum();

        $track = $this->trackRepository->findOneByAlbumAndTitle($album, $userTrack->getTitle());
        if ($track == null) {
            $track = $this->trackHelper->convertDtoToTrack($trackDto);
            $this->trackRepository->persist($track);
        }
        $userTrack->setGlobalTrack($track);
        $this->checkAssociation($userTrack);

        $this->userTrackRepository->flush();

        $resultDto = $this->trackHelper->convertUserTrackToDto($userTrack);
        return new JsonViewModel($resultDto, $this->jsonUtils);
    }

    public function removeAction($id) {
        $userTrack = $this->userTrackRepository->find($id);
        if ($userTrack == null) {
            $this->logger->error("There is no user track with id $id.");
            throw new JsonException("Invalid track id.");
        }

        $this->userTrackRepository->
            remove($userTrack)->
            flush();
    }

    /**
     * Called by the container to inject the logger instance.
     *
     * @param \Logger $logger A log4php instance or dummy logger.
     *
     * @return void
     */
    public function setLogger(\Logger $logger) {
        $this->logger = $logger;
    }
}
