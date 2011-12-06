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

use \Ding\MVC\ModelAndView;

/**
 * @Controller
 * @RequestMapping(url={/, /index, /index.php})
 */
class IndexController 
{
    public function indexAction() 
    {
        $view = new ModelAndView("index/index", array('result' => 'index action handled successfull'));
        return $view;
    }
}