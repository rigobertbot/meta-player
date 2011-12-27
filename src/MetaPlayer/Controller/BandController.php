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
     * @var UserBandRepository
     */
    private $userBandRepository;
    
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
        $bands = $this->bandRepository->findAll();
        $userBands = $this->userBandRepository->findNotApproved($this->securityManager->getUser());
        $bands = array_merge($bands, $userBands);
        
        $data = array();
        
        foreach ($bands as $band) {
            /* @var $band Band */
            $bandDto = new BandDto();
            $bandDto->id = $band->getId();
            $bandDto->name = $band->getName();
            $bandDto->foundDate = ViewHelper::formatDate($band->getFoundDate());
            $bandDto->endDate = ViewHelper::formatDate($band->getEndDate());
            
            $data[] = $bandDto;
        }
        
        return new JsonViewModel($data, $this->jsonUtils);
    }
    
    public function addAction($json) {
        $bandDto = $this->jsonUtils->deserialize($json);
        if (!$bandDto instanceof BandDto) {
            $this->logger->error("json shuld be instance of BandDto but got " . print_r($bandDto, true));
            throw new JsonException("Wrong json format.");
        }
        
        /* @var $bandDto BandDto */
        
        $userBand = new UserBand(
                $this->securityManager->getUser(), 
                $bandDto->name, 
                ViewHelper::parceDate($bandDto->foundDate), 
                $bandDto->source, 
                ViewHelper::parceDate($bandDto->endDate));
        
        $this->userBandRepository->persist($userBand);
    }

    public function setLogger(\Logger $logger) {
        $this->logger = $logger;
    }
}
