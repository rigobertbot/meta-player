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
namespace MetaPlayer;

use Ding\Logger\ILoggerAware;

/**
 * 
 * @Component(name=testBean)
 * @InitMethod(method=init)
 * @Scope(value=singleton) 
 * 
 */
class TestBean implements ILoggerAware
{
    /**
     * @Resource
     * @var SecondBean
     */
    private $secondBean;
    
    public function setLogger(\Logger $logger) {
        $this->logger = $logger;
    }

    /**
     * @var \Logger
     */
    private $logger;

    public function init() 
    {
        $this->logger->debug("inited.");
    }
    
    public function getValue() {
        return $this->secondBean->getValue();
    }
}