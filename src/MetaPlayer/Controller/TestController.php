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
use MetaPlayer\ViewHelper;
use Ding\MVC\ModelAndView;

/**
 * Description of TestController
 *
 * @author Val Dubrava <valery.dubrava@gmail.com>
 * @Controller
 * @RequestMapping(url={/test/})
 */
class TestController extends BaseSecurityController {
    public function indexAction() {
        return new ModelAndView("index/no_vk");
    }
}