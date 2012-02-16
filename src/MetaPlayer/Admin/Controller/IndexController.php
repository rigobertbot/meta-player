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

namespace MetaPlayer\Admin\Controller;

use Oak\Json\JsonUtils;

/**
 * Description of AlbumController
 *
 * @author Val Dubrava <valery.dubrava@gmail.com>
 * @Controller
 * @RequestMapping(url={/admin/,/admin/index/index,/admin/index})
 */
class IndexController extends BaseAdminController
{
    public function indexAction() {
        return new \Ding\Mvc\ModelAndView("Index/index");
    }
}
