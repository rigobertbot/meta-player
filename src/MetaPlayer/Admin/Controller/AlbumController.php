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

/**
 * Description of AlbumController
 *
 * @author Val Dubrava <valery.dubrava@gmail.com>
 * @Controller
 * @RequestMapping(url={/admin/album/})
 */
class AlbumController extends BaseAdminController
{
    /**
     * @Resource
     * @var JsonUtils
     */
    private $jsonNativeSerializer;

    /**
     * @Resource
     * @var \MetaPlayer\Repository\UserAlbumRepository
     */
    private $userAlbumRepository;

    public function indexAction() {
        return new \Ding\Mvc\ModelAndView("Album/index");
    }

    public function listAction() {
        return new \Oak\MVC\JsonViewModel($this->userAlbumRepository->findAll(), $this->jsonNativeSerializer);
    }
}
