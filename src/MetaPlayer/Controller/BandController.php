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

use Oak\MVC\JsonViewModel;
use MetaPlayer\Model\Band;
use MetaPlayer\Repository\BandRepository;
use MetaPlayer\Repository\UserBandRepository;
use MetaPlayer\ViewHelper;
use MetaPlayer\Contract\BandDto;
use Oak\Json\JsonUtils;
use MetaPlayer\Model\UserBand;
use MetaPlayer\Manager\SecurityManager;
use Ding\Logger\ILoggerAware;
use MetaPlayer\JsonException;
use MetaPlayer\Contract\BandHelper;

/**
 * Description of BandController
 *
 * @Controller
 * @RequestMapping(url={/band/})
 * @author Val Dubrava <valery.dubrava@gmail.com>
 */
class BandController extends BaseSecurityController implements ILoggerAware
{
    /**
     * @Resource
     * @var BandRepository
     */
    private $bandRepository;
    
    /**
     * @Resource
     * @var \MetaPlayer\Repository\UserBandRepository
     */
    private $userBandRepository;

    /**
     * @Resource
     * @var \MetaPlayer\Contract\BandHelper
     */
    private $bandHelper;
    
    /**
     * @Resource
     * @var JsonUtils
     */
    private $jsonUtils;
    
    /**
     * @var \Logger
     */
    private $logger;


    public function indexAction() {
        return $this->listAction();
    }
    
    public function listAction() {
        $bands = $this->userBandRepository->findByUser($this->securityManager->getUser());

        $data = array();
        
        foreach ($bands as $band) {
            $bandDto = $this->bandHelper->convertUserBandToDto($band);

            $data[] = $bandDto;
        }
        
        return new JsonViewModel($data, $this->jsonUtils);
    }

    /**
     * @param $json
     * @return \MetaPlayer\Contract\BandDto
     * @throws \MetaPlayer\JsonException
     */
    private function convertJson($json) {
        $bandDto = $this->jsonUtils->deserialize($json);
        /* @var $bandDto BandDto */
        if (!$bandDto instanceof BandDto) {
            $this->logger->error("json should be instance of BandDto but got " . print_r($bandDto, true));
            throw new JsonException("Wrong json format.");
        }
        return $bandDto;
    }
    
    public function addAction($json) {
        $bandDto = $this->convertJson($json);

        $userBand = $this->bandHelper->convertDtoToUserBand($bandDto);

        $band = $this->bandRepository->findByName($userBand->getName());
        if ($band == null) {
            $band = $this->bandHelper->convertDtoToBand($bandDto);
            $this->bandRepository->persist($band);
        }
        $userBand->setBand($band);
        
        $this->userBandRepository->persist($userBand);
        $this->userBandRepository->flush();

        $resultDto = $this->bandHelper->convertUserBandToDto($userBand);

        return new JsonViewModel($resultDto, $this->jsonUtils);
    }

    public function addOrGetAction($json) {
        $bandDto = $this->convertJson($json);
        $band = $this->userBandRepository->findOneByUserAndName($this->securityManager->getUser(), $bandDto->name);
        if ($band == null) {
            return $this->addAction($json);
        } else {
            $dto = $this->bandHelper->convertUserBandToDto($band);
            return new JsonViewModel($dto, $this->jsonUtils);
        }
    }

    public function getAction($id) {
        $userBand = $this->userBandRepository->find($id);
        if ($userBand == null) {
            $this->logger->error("There is no user band with id = $id.");
            throw new JsonException("Invalid id.");
        }
        $dto = $this->bandHelper->convertUserBandToDto($userBand);
        return new JsonViewModel($dto, $this->jsonUtils);
    }

    /**
     * Update user band.
     * @param $json
     * @return \Oak\MVC\JsonViewModel
     */
    public function updateAction($json) {
        $bandDto = $this->convertJson($json);

        $userBand = $this->userBandRepository->find($bandDto->id);
        $this->bandHelper->populateUserBandWithDto($userBand, $bandDto);

        $band = $this->bandRepository->findByName($userBand->getName());
        if ($band == null) {
            $band = $this->bandHelper->convertDtoToBand($bandDto);
            $this->bandRepository->persist($band);
        }
        $userBand->setBand($band);

        $this->userBandRepository->flush();

        $resultDto = $this->bandHelper->convertUserBandToDto($userBand);

        return new JsonViewModel($resultDto, $this->jsonUtils);
    }

    /**
     * Remove user band
     * @param $id
     * @throws \MetaPlayer\JsonException
     * @return void
     */
    public function removeAction($id) {
        $userBand = $this->userBandRepository->find($id);
        if ($userBand == null) {
            $this->logger->error("There is no user band with id $id.");
            throw new JsonException("Invalid band id.");
        }

        $this->
            userBandRepository->
            remove($userBand)->
            flush();
    }

    public function setLogger(\Logger $logger) {
        $this->logger = $logger;
    }
}
