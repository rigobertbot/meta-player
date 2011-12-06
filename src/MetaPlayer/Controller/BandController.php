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
/**
 * Description of BandController
 *
 * @Controller
 * @RequestMapping(url={/band/})
 * @author Val Dubrava <valery.dubrava@gmail.com>
 */
class BandController {
    
    public function indexAction() {
        return $this->listAction();
    }
    
    public function listAction() {
        $data = array('some' => 123, 'other' => 345);
        return new JsonViewModel($data);
    }
}
