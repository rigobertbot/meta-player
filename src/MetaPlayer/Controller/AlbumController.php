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
     * @var \MetaPlayer\Contract\BandHelper
     */
    private $bandHelper;

    /**
     * @Resource
     * @var \MetaPlayer\Repository\BandRepository
     */
    private $bandRepository;
    
    /**
     * @Resource
     * @var AlbumHelper
     */
    private $albumHelper;

    /**
     * @Resource
     * @var \MetaPlayer\Manager\BandManager
     */
    private $bandManager;

    /**
     * @Resource
     * @var JsonUtils
     */
    private $jsonUtils;

    public function listAction($bandId) {
        $albums =  $this->userAlbumRepository->findByUserAndUserBand($this->securityManager->getUser(), $bandId);

        $data = array();
        foreach ($albums as $album) {
            /* @var $album Album */
            $albumDto = $this->albumHelper->convertUserAlbumToDto($album);

            $data[] = $albumDto;
        }
        
        return new JsonViewModel($data, $this->jsonUtils);
    }

    public function listUserAction($bandId) {
        $result = array();
        $albums = $this->userAlbumRepository->findByUserAndUserBand($this->securityManager->getUser(), $bandId);
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
        $userAlbum = $this->userAlbumRepository->find($id);
        if ($userAlbum == null) {
            $this->logger->error("There is no user album with id = $id.");
            throw new JsonException("Invalid id.");
        }
        $dto = $this->albumHelper->convertUserAlbumToDto($userAlbum);
        return new JsonViewModel($dto, $this->jsonUtils);
    }
    
    public function addAction($json) {
        $albumDto = $this->parseJson($json);

        $userBand = $this->userBandRepository->find($albumDto->bandId);
        if ($userBand == null) {
            $this->logger->error("There is no user band with id = {$albumDto->bandId}.");
            throw new JsonException("Invalid id.");
        }
        if ($userBand->getUser() !== $this->securityManager->getUser()) {
            $this->logger->error("The requested user band is not correspond to current user: userBandId = {$userBand->getId()}, userId = {$this->securityManager->getUser()}.");
            throw new JsonException("Wrong request.");
        }

        $userAlbum = $this->albumHelper->convertDtoToUserAlbum($albumDto);

        $album = $this->albumRepository->findOneByBandAndTitle($userBand->getGlobalBand(), $userAlbum->getTitle());
        if ($album == null) {
            $album = $this->albumHelper->convertDtoToAlbum($albumDto);
            $this->albumRepository->persist($album);
        }

        $userAlbum->setAlbum($album);
        
        $this->userAlbumRepository->persist($userAlbum);
        $this->userAlbumRepository->flush();
        
        $resultDto = $this->albumHelper->convertUserAlbumToDto($userAlbum);
        return new JsonViewModel($resultDto, $this->jsonUtils);
    }

    public function addOrGetAction($json) {
        $albumDto = $this->parseJson($json);

        $userBand = $this->userBandRepository->find($albumDto->bandId);
        if ($userBand == null) {
            $this->logger->error("There is no user band with id = {$albumDto->bandId}.");
            throw new JsonException("Invalid id.");
        }

        if ($userBand->getUser() !== $this->securityManager->getUser()) {
            $user = $this->securityManager->getUser();
            $this->logger->error("The user {$user} tried to access now own band with id = {$albumDto->bandId}.");
            throw new JsonException("Invalid id.");
        }

        $album = $this->userAlbumRepository->findOneByUserBandAndName($userBand, $albumDto->title);
        if ($album == null) {
            return $this->addAction($json);
        } else {
            $dto = $this->albumHelper->convertUserAlbumToDto($album);
            return new JsonViewModel($dto, $this->jsonUtils);
        }
    }

    public function updateAction($json) {
        $albumDto = $this->parseJson($json);

        $userAlbum = $this->userAlbumRepository->find($albumDto->id);
        $userBand = $userAlbum->getBand();
        $this->albumHelper->populateUserAlbumWithDto($userAlbum, $albumDto);

        $album = $this->albumRepository->findOneByBandAndTitle($userBand->getGlobalBand(), $userAlbum->getTitle());
        if ($album == null) {
            $album = $this->albumHelper->convertDtoToAlbum($albumDto);
            $this->albumRepository->persist($album);
        }
        $userAlbum->setAlbum($album);

        $this->userAlbumRepository->flush();

        $resultDto = $this->albumHelper->convertUserAlbumToDto($userAlbum);
        return new JsonViewModel($resultDto, $this->jsonUtils);
    }

    public function removeAction($id) {
        $userAlbum = $this->userAlbumRepository->find($id);
        if ($userAlbum == null) {
            $this->logger->error("There is no user album with id $id.");
            throw new JsonException("Invalid album id.");
        }

        $this->
            userAlbumRepository->
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
