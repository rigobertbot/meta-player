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

use \MetaPlayer\Model\SocialNetwork;
use \Ding\Mvc\ModelAndView;
use Ding\Logger\ILoggerAware;
use MetaPlayer\Manager\SecurityManager;
use Oak\Json\JsonUtils;

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

    /**
     * @Resource
     * @var \MetaPlayer\Manager\SocialManager
     */
    private $socialManager;

    public function indexAction($api_id, $viewer_id, $auth_key) 
    {
	    $this->logger->debug("index/index with arguments $api_id, $viewer_id, $auth_key");
        $this->socialManager->authenticate(array('api_id' => $api_id, 'viewer_id' => $viewer_id, 'auth_key' => $auth_key), SocialNetwork::$VK);
        $this->logger->debug("authenticate $viewer_id");
        $this->securityManager->authenticate($viewer_id, SocialNetwork::$VK);
        
        return new ModelAndView("Index/index", array('socialNetwork' => $this->securityManager->getUser()->getSocialNetwork()));
    }

    public function myAction($app_id, $vid, $sig) {
        $this->logger->debug("index/my with arguments $app_id, $vid, $sig");
        $this->socialManager->authenticate($_REQUEST, SocialNetwork::$MY);
        $this->logger->debug("authenticate $vid");
        $this->securityManager->authenticate($vid, SocialNetwork::$MY);

        return new ModelAndView("Index/index", array('socialNetwork' => $this->securityManager->getUser()->getSocialNetwork()));
    }

    public function setLogger(\Logger $logger) {
        $this->logger = $logger;
    }
}
