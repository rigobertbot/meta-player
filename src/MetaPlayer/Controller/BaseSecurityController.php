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
use MetaPlayer\Manager\SecurityManager;

/**
 * Description of BaseSecurityController
 *
 * @author Val Dubrava <valery.dubrava@gmail.com>
 * @PreDispatchMethod(method=preDispatch)
 */
class BaseSecurityController 
{
    /**
     * @Resource
     * @var SecurityManager
     */
    protected $securityManager;


    public function preDispatch() {
        if (!$this->securityManager->isAuthenticated()) {
            throw new \Exception("Is not authenticated.");
        }
    }
}
