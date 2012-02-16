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

use \Ding\Mvc\ModelAndView;
use Ding\Logger\ILoggerAware;
use MetaPlayer\Manager\SecurityManager;

/**
 * @Controller
 * @RequestMapping(url={/, /index, /index.php})
 */
class IndexController implements ILoggerAware
{
    /**
     * @var \Logger
     */
    private $logger;
    
    /**
     * @Resource
     * @var SecurityManager
     */
    private $securityManager;

    public function indexAction($api_id, $viewer_id, $auth_key) 
    {
	    $this->logger->debug("index/index with arguments $api_id, $viewer_id, $auth_key");
        //TODO: move this code to SecurityManager
        $view = new ModelAndView("Index/index");
        if ($api_id != \MPConfig::$VKApiId) {
            $this->logger->error("The VK API Id is wrong: expected " . \MPConfig::$VKApiId . ", got $api_id");
            return new ModelAndView("Index/no_vk");
        }
        $expectedAuth = md5($api_id . '_' . $viewer_id . '_' . \MPConfig::$VKSecret);
        if ($auth_key != $expectedAuth) {
            $this->logger->error("The VK auth_key is wrong: expected $expectedAuth, but got $auth_key");
            return new ModelAndView("Index/no_vk");
        }
        $this->logger->debug("authenticate $viewer_id");
        $this->securityManager->authenticate($viewer_id);
        
        return $view;
    }

    public function setLogger(\Logger $logger) {
        $this->logger = $logger;
    }
}
