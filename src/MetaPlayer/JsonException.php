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

namespace MetaPlayer;

/**
 * Description of JsonException
 *
 * @author Val Dubrava <valery.dubrava@gmail.com>
 */
class JsonException extends MetaPlayerException
{
    public function __construct($message = null, $code = null, $previous = null) {
        parent::__construct($message, $code, $previous);
    }

}
