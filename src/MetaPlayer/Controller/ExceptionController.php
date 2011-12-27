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

use Ding\Logger\ILoggerAware;
use Ding\Mvc\ModelAndView;
use Oak\MVC\JsonViewModel;
use Oak\Json\JsonUtils;
/**
 * Description of ExceptionController
 *
 * @Controller
 * @RequestMapping(url=/Exception)
 * @Component(name={ExceptionController, exceptionController})
 * @Scope(value=singleton)
 * 
 * @author Val Dubrava <valery.dubrava@gmail.com>
 */
class ExceptionController implements ILoggerAware
{
    /**
     * @var \Logger
     */
    private $logger;
    
    /**
     * @Resource
     * @var JsonUtils
     */
    private $jsonUtils;
    
    public function _exceptionAction($exception)
    {
        return new ModelAndView("Exception\exception", array('exception' => $exception));
    }
    
    public function metaPlayer_JsonExceptionAction(\Exception $exception) {
        return new JsonViewModel(array('error' => array('code' => $exception->getCode(), 'message' => $exception->getMessage())), $this->jsonUtils);
    }

    public function setLogger(\Logger $logger) {
        $this->logger = $logger;
    }
}

