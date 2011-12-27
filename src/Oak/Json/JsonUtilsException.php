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

namespace Oak\Json;

/**
 * The JsonUtilsException
 *
 * @author Val Dubrava <valery.dubrava@gmail.com>
 */
class JsonUtilsException extends \Exception {
    public function __construct($message, $code = null, $previous = null) {
        parent::__construct($message, $code, $previous);
    }
}
