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
     * @var \Oak\Json\JsonUtils
     */
    private $jsonUtils;


    public function listAction($albumId) {
        $data = array();
        
        $tracks = $this->trackRepository->findByAlbum($albumId);
        
        foreach ($tracks as $track) {
            /* @var $track Track */
            $trackDto = array(
                'id' => $track->getId(),
                'className' => 'TrackNode',
                'duration' => $track->getDuration(),
                'serial' => $track->getSerial(),
                'albumId' => $albumId,
                'title' => $track->getTitle(),
                'queries' => $track->getQueries(),
            );
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