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

namespace Oak\MVC;

use Ding\Mvc\ModelAndView;

/**
 * The class JsonViewModel handles mapping between view and model for JSON output.
 *
 * @author Val Dubrava <valery.dubrava@gmail.com>
 */
class JsonViewModel extends ModelAndView
{
    public function __construct($object, \Oak\Json\ISerializer $jsonUtils, array $headers = array()) {
        $options = array(
            'json' => $jsonUtils->serialize($object),
            'headers' => \array_merge(array(
                'Cache-Control: no-cache, must-revalidate', 
                'Expires: Mon, 26 Jul 1997 05:00:00 GMT', //date in the past
                'Content-type: application/json',
                ), $headers),
        );
        
        parent::__construct('json/common', $options);
    }
}
