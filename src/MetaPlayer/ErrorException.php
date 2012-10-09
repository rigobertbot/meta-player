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
namespace MetaPlayer;

use MetaPlayer\MetaPlayerException;

/**
 * Exception wraps handed PHP errors.
 * @author Val Dubrava <valery.dubrava@gmail.com>
 */
class ErrorException extends MetaPlayerException
{
    public function __construct($message = null, $code = 0, $previous = null) {
        parent::__construct($message, $code, $previous);
    }

}
