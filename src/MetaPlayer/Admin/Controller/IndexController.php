<?php
/*
 * MetaPlayer 1.0
 *
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 *
 * Copyright(c) 2010-2013 Val Dubrava [ valery.dubrava@gmail.com ]
 *
 */

namespace MetaPlayer\Admin\Controller;

use Oak\Json\JsonUtils;
use MetaPlayer\Model\SocialNetwork;
use Ding\Mvc\ModelAndView;

/**
 * Description of AlbumController
 *
 * @author Val Dubrava <valery.dubrava@gmail.com>
 * @Controller
 * @RequestMapping(url={/admin/,/admin/index/})
 */
class IndexController extends BaseAdminController
{
    /**
     * @Resource
     * @var \MetaPlayer\Manager\SocialManager
     */
    private $socialManager;

    public function indexAction() {
        return new ModelAndView("Index/index");
    }

    public function notificationAction() {
        return new ModelAndView("Index/sendNotification");
    }

    public function sendNotificationAction($message, $socialNetwork, $onlyAdmins = false) {
        $socialNetwork = SocialNetwork::parse($socialNetwork);
        try {
            $resultIds = $this->socialManager->sendNotification($message, $socialNetwork, $onlyAdmins);
        } catch (\Exception $ex) {
            return new ModelAndView("Index/error", array('exception' => $ex));
        }
        return new ModelAndView("Index/sendNotification", array('ids' => implode(",", $resultIds)));
    }
}
