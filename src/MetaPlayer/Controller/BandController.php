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
    public static $userBandIdPrefix = "user_";
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
    
    public function listAction($onlyUser = false) {
        $bands = $onlyUser ? array() : $this->bandRepository->findAll();
        $userBands = $this->userBandRepository->findNotApproved($this->securityManager->getUser());
        $bands = array_merge($bands, $userBands);
        
        $data = array();
        
        foreach ($bands as $band) {
            /* @var $band Band */
            $id = $band->getId();
            if ($band instanceof UserBand) {
                $id = self::$userBandIdPrefix . $id;
            }
            
            $bandDto = new BandDto();
            $bandDto->id = $id;
            $bandDto->name = $band->getName();
            $bandDto->foundDate = ViewHelper::formatDate($band->getFoundDate());
            $bandDto->endDate = ViewHelper::formatDate($band->getEndDate());
            
            $data[] = $bandDto;
        }
        
        return new JsonViewModel($data, $this->jsonUtils);
    }

    public function listUserAction() {
        $userBands = $this->userBandRepository->findNotApproved($this->securityManager->getUser());
        $result = array();
        foreach ($userBands as $userBand) {

            $dto = array('id' => $userBand->getId(), 'name' => $userBand->getName());
            $result[] = $dto;
        }

        return new JsonViewModel($result, $this->jsonUtils);;
    }
    
    public function addAction($json) {
        $bandDto = $this->jsonUtils->deserialize($json);
        /* @var $bandDto BandDto */
        if (!$bandDto instanceof BandDto) {
            $this->logger->error("json shuld be instance of BandDto but got " . print_r($bandDto, true));
            throw new JsonException("Wrong json format.");
        }

        $userBand = $this->bandHelper->convertDtoToUserBand($bandDto);
        
        $this->userBandRepository->persist($userBand);
        $this->userBandRepository->flush();

        $resultDto = $this->bandHelper->convertUserBandToDto($userBand);

        return new JsonViewModel($resultDto, $this->jsonUtils);
    }

    public function setLogger(\Logger $logger) {
        $this->logger = $logger;
    }
}
