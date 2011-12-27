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

namespace Oak\MVC;

use Ding\Mvc\ModelAndView;

/**
 * The class JsonViewModel handles mapping between view and model for JSON output.
 *
 * @author Val Dubrava <valery.dubrava@gmail.com>
 */
class JsonViewModel extends ModelAndView
{
    public function __construct($object, \Oak\Json\JsonUtils $jsonUtils) {
        $options = array(
            'json' => $jsonUtils->serialize($object),
            'headers' => array(
                'Cache-Control: no-cache, must-revalidate', 
                'Expires: Mon, 26 Jul 1997 05:00:00 GMT', //date in the past
                'Content-type: application/json',
                ),
        );
        
        parent::__construct('json/common', $options);
    }
}
