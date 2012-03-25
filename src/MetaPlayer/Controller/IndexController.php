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

    public function indexAction($api_id, $viewer_id, $auth_key) 
    {
	    $this->logger->debug("index/index with arguments $api_id, $viewer_id, $auth_key");

        if ($api_id != \MPConfig::$VKAppId) {
            $this->logger->error("The VK App Id is wrong: expected " . \MPConfig::$VKAppId . ", got $api_id");
            return new ModelAndView("Index/no_vk");
        }
        $expectedAuth = md5($api_id . '_' . $viewer_id . '_' . \MPConfig::$VKSecret);
        if ($auth_key != $expectedAuth) {
            $this->logger->error("The VK auth_key is wrong: expected $expectedAuth, but got $auth_key");
            return new ModelAndView("Index/no_vk");
        }
        $this->logger->debug("authenticate $viewer_id");
        $this->securityManager->authenticate($viewer_id, SocialNetwork::$VK);
        
        return new ModelAndView("Index/index", array('socialNetwork' => $this->securityManager->getUser()->getSocialNetwork()));
    }

    public function myAction($app_id, $vid, $sig) {
        if ($app_id != \MPConfig::$MyAppId) {
            $this->logger->error("The My App Id is wrong: expected " . \MPConfig::$MyAppId . ", got $app_id");
            return new ModelAndView("Index/no_vk");
        }

        $params = $_REQUEST;
        unset($params['sig']);
        ksort($params);
        $combined = '';
        foreach ($params as $key => $value) {
            $combined .= "$key=$value";
        }
        $expectedSig = md5($combined . \MPConfig::$MySecret);
        if ($sig != $expectedSig) {
            $this->logger->error("The My signature is wrong: expected $expectedSig, but got $sig");
            return new ModelAndView("Index/no_vk");
        }

        $this->securityManager->authenticate($vid, SocialNetwork::$MY);

        return new ModelAndView("Index/index", array('socialNetwork' => $this->securityManager->getUser()->getSocialNetwork()));
    }

    public function setLogger(\Logger $logger) {
        $this->logger = $logger;
    }
}
