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

use MetaPlayer\JsonException;
use MetaPlayer\Repository\AlbumRepository;
use MetaPlayer\Repository\UserBandRepository;
use MetaPlayer\Repository\UserAlbumRepository;
use Oak\MVC\JsonViewModel;
use MetaPlayer\Model\Album;
use MetaPlayer\ViewHelper;
use Ding\Logger\ILoggerAware;
use MetaPlayer\Model\UserAlbum;
use MetaPlayer\Contract\AlbumDto;
use MetaPlayer\Contract\AlbumHelper;
use Oak\Json\JsonUtils;

/**
 * Description of AlbumController
 *
 * @author Val Dubrava <valery.dubrava@gmail.com>
 * @Controller
 * @RequestMapping(url={/album/})
 */
class AlbumController extends BaseSecurityController implements ILoggerAware
{
    /**
     * @var \Logger
     */
    private $logger;
    
    /**
     * @Resource
     * @var AlbumRepository
     */
    private $albumRepository;
    
    /**
     * @Resource
     * @var \MetaPlayer\Repository\UserAlbumRepository
     */
    private $userAlbumRepository;
    
    /**
     * @Resource
     * @var UserBandRepository
     */
    private $userBandRepository;
    
    /**
     * @Resource
     * @var AlbumHelper
     */
    private $albumHelper;

    /**
     * @Resource
     * @var JsonUtils
     */
    private $jsonUtils;

    public function listAction($bandId) {
        $userAlbum = false;
        if (strpos($bandId, BandController::$userBandIdPrefix) === 0) {
            $bandId = substr($bandId, strlen(BandController::$userBandIdPrefix));
            $userAlbum = true;
        }
        
        $albums = $userAlbum ? 
            $this->userAlbumRepository->findByUserAndBand($this->securityManager->getUser(), $bandId) :
            $this->albumRepository->findByBand($bandId);
        
        $data = array();
        foreach ($albums as $album) {
            /* @var $album Album */
            $albumDto = $album instanceof UserAlbum ? $this->albumHelper->convertUserAlbumToDto($album) : $this->albumHelper->convertAlbumToDto($album);
            $data[] = $albumDto;
        }
        
        return new JsonViewModel($data, $this->jsonUtils);
    }

    public function listUserAction($bandId) {
        $result = array();
        $albums = $this->userAlbumRepository->findByUserAndBand($this->securityManager->getUser(), $bandId);
        foreach ($albums as $album) {
            $result[] = array('id' => $album->getId(), 'name' => $album->getTitle());
        }

        return new JsonViewModel($result, $this->jsonUtils);
    }

    /**
     * @param $json
     * @return AlbumDto
     * @throws \MetaPlayer\JsonException
     */
    private function parseJson($json) {
        $albumDto = $this->jsonUtils->deserialize($json);
        if (!$albumDto instanceof AlbumDto) {
            $this->logger->error("json shuld be instance of AlbumDto but got " . print_r($albumDto, true));
            throw new JsonException("Wrong json format.");
        }
        return $albumDto;
    }

    public function getAction($id) {
        if ($this->albumHelper->isDtoUserAlbumId($id)) {
            $id = $this->albumHelper->convertDtoToUserAlbumId($id);
            $userAlbum = $this->userAlbumRepository->find($id);
            if ($userAlbum == null) {
                $this->logger->error("There is no user album with id = $id.");
                throw new JsonException("Invalid id.");
            }
            $dto = $this->albumHelper->convertUserAlbumToDto($userAlbum);
            return new JsonViewModel($dto, $this->jsonUtils);
        } else {
            $album = $this->albumRepository->find($id);
            if ($album == null) {
                $this->logger->error("There is no album with id = $id.");
                throw new JsonException("Invalid id.");
            }
            $dto = $this->albumHelper->convertAlbumToDto($album);
            return new JsonViewModel($dto, $this->jsonUtils);
        }
    }
    
    public function addAction($json) {
        $albumDto = $this->parseJson($json);

        $userAlbum = $this->albumHelper->convertDtoToUserAlbum($albumDto);
        
        $this->userAlbumRepository->persist($userAlbum);
        $this->userAlbumRepository->flush();
        
        $resultDto = $this->albumHelper->convertUserAlbumToDto($userAlbum);
        return new JsonViewModel($resultDto, $this->jsonUtils);
    }

    public function updateAction($json) {
        $albumDto = $this->parseJson($json);

        $userAlbumId = $this->albumHelper->convertDtoToUserAlbumId($albumDto->id);
        $userAlbum = $this->userAlbumRepository->find($userAlbumId);
        $this->albumHelper->populateUserAlbumWithDto($userAlbum, $albumDto);

        $this->userAlbumRepository->flush();

        $resultDto = $this->albumHelper->convertUserAlbumToDto($userAlbum);
        return new JsonViewModel($resultDto, $this->jsonUtils);
    }

    public function removeAction($id) {
        $id = $this->albumHelper->convertDtoToUserAlbumId($id);

        $userAlbum = $this->userAlbumRepository->find($id);
        if ($userAlbum == null) {
            $this->logger->error("There is no user album with id $id.");
            throw new JsonException("Invalid album id.");
        }

        if ($userAlbum->isApproved()) {
            $this->logger->error("There was try to remove approved user album with id $id.");
            throw new JsonException("This album has already approved.");
        }

        $this->userAlbumRepository->
            remove($userAlbum)->
            flush();
    }

    /**
     * @param \Logger $logger
     */
    public function setLogger(\Logger $logger) {
        $this->logger = $logger;
    }
}
