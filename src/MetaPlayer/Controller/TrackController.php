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
class TrackController extends BaseSecurityController
{
    /**
     * @Resource
     * @var TrackRepository
     */
    private $trackRepository;

    /**
     * @Resource
     * @var JsonUtils
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

    }
}