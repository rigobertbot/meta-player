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
use MetaPlayer\Model\Track;
use MetaPlayer\Model\UserTrack;
use MetaPlayer\Contract\AssociationDto;
use MetaPlayer\Model\Association;

/**
 * Description of TrackController
 *
 * @author Val Dubrava <valery.dubrava@gmail.com>
 * @Controller
 * @RequestMapping(url={/association/})
 */
class AssociationController extends BaseSecurityController implements \Ding\Logger\ILoggerAware
{
    /**
     * @var \Logger
     */
    private $logger;

    /**
     * @Resource
     * @var \MetaPlayer\Repository\TrackRepository
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
     * @var \MetaPlayer\Contract\AssociationHelper
     */
    private $associationHelper;

    /**
     * @Resource
     * @var \MetaPlayer\Repository\AssociationRepository
     */
    private $associationRepository;

    /**
     * @Resource
     * @var \Oak\Json\JsonUtils
     */
    private $jsonUtils;

    /**
     * @param $json
     * @return \MetaPlayer\Contract\AssociationDto
     * @throws \MetaPlayer\JsonException
     */
    private function parseJson($json) {
        $associationDto = $this->jsonUtils->deserialize($json);
        if (!$associationDto instanceof AssociationDto) {
            $this->logger->error("json should be instance of AssociationDto but got " . print_r($associationDto, true));
            throw new JsonException("Wrong json format.");
        }
        return $associationDto;
    }

    public function associateAction($trackId, $json) {
        $associationDto = $this->parseJson($json);

        $userTrack = $this->userTrackRepository->find($trackId);

        if ($userTrack == null) {
            $this->logger->error("There is no user track with id = $trackId.");
            throw new JsonException("Invalid id.");
        }

        $association = $this->associationHelper->convertDtoToAssociation($associationDto, $userTrack);
        $association = $this->associationRepository->tryFindTheSame($association);

        $userTrack->associate($this->securityManager->getSocialNetwork(), $association);

        $this->associationRepository->flush();

        $associationDto = $this->associationHelper->convertAssociationToDto($association);
        return new JsonViewModel($associationDto, $this->jsonUtils);
    }

    public function listAction($trackId) {
        $userTrack = $this->userTrackRepository->find($trackId);

        if ($userTrack == null) {
            $this->logger->error("There is no user track with id = $trackId.");
            throw new JsonException("Invalid id.");
        }

        $track = $userTrack->getGlobalTrack();
        if ($track == null) {
            throw \MetaPlayer\Model\ModelException::thereIsNoGlobalObject($track, 'Track');
        }

        $result = array();
        $associations = $this->associationRepository->findByTrack($track);
        foreach ($associations as $association) {
            $result[] = $this->associationHelper->convertAssociationToDto($association);
        }
        return new JsonViewModel($result, $this->jsonUtils);
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
