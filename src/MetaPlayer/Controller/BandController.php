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
use MetaPlayer\ViewHelper;

/**
 * Description of BandController
 *
 * @Controller
 * @RequestMapping(url={/band/})
 * @author Val Dubrava <valery.dubrava@gmail.com>
 */
class BandController extends BaseSecurityController
{
    
    /**
     * @Resource
     * @var BandRepository
     */
    private $bandRepository;
    
    public function indexAction() {
        return $this->listAction();
    }
    
    public function listAction() {
        $bands = $this->bandRepository->findAll();
        $data = array();
        
        foreach ($bands as $band) {
            /* @var $band Band */
            $bandDto = array(
                'className' => 'BandNode',
                'id' => $band->getId(), 
                'name' => $band->getName(),
                'foundDate' => ViewHelper::formatDate($band->getFoundDate()),
                'endDate' => ViewHelper::formatDate($band->getEndDate()),
                );
            $data[] = $bandDto;
        }
        
        return new JsonViewModel($data);
    }
}
