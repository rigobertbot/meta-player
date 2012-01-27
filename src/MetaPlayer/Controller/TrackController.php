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

namespace MetaPlayer\Controller;

use \MetaPlayer\Contract\TrackDto;
use \MetaPlayer\JsonException;
use Oak\MVC\JsonViewModel;
use MetaPlayer\ViewHelper;
use MetaPlayer\Repository\TrackRepository;
use MetaPlayer\Model\Track;

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


    public function listAction($albumId) {
        $data = array();
        $isUser = $this->albumHelper->isDtoUserAlbumId($albumId);
        $tracks = $isUser
            ? $this->userTrackRepository->findByUserAndAlbum($this->securityManager->getUser(), $this->albumHelper->convertDtoToUserAlbumId($albumId))
            : $this->trackRepository->findByAlbum($albumId);
        
        foreach ($tracks as $track) {
            $trackDto = $track instanceof \MetaPlayer\Model\UserTrack
                ? $this->trackHelper->convertUserTrackToDto($track)
                : $this->trackHelper->convertTrackToDto($track);

            $data[] = $trackDto;
        }
        
        return new JsonViewModel($data, $this->jsonUtils);
    }

    public function addAction($json) {
        $trackDto = $this->jsonUtils->deserialize($json);
        if (!$trackDto instanceof TrackDto) {
            $this->logger->error("json shuld be instance of AlbumDto but got " . print_r($trackDto, true));
            throw new JsonException("Wrong json format.");
        }
        $userTrack = $this->trackHelper->convertDtoToUserTrack($trackDto);
        $this->userTrackRepository->persist($userTrack);
        $this->userTrackRepository->flush();

        $resultDto = $this->trackHelper->convertUserTrackToDto($userTrack);
        return new JsonViewModel($resultDto, $this->jsonUtils);
    }

    public function removeAction($id) {
        $id = $this->trackHelper->convertDtoToUserTrackId($id);

        $userTrack = $this->userTrackRepository->find($id);
        if ($userTrack == null) {
            $this->logger->error("There is no user track with id $id.");
            throw new JsonException("Invalid track id.");
        }

        if ($userTrack->isApproved()) {
            $this->logger->error("There was try to remove approved user album with id $id.");
            throw new JsonException("This album has already approved.");
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