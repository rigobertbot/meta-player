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
/**
 * User: v.dubrava
 * Date: 13.01.12
 * Time: 19:21
 */
namespace MetaPlayer;

/**
 * The class MetaPlayerException represents
 *
 * @author Val Dubrava <valery.dubrava@gmail.com>
 */
class MetaPlayerException extends \Exception
{
    function __construct($message = null, $code = null, $previous = null) {
        parent::__construct($message, $code, $previous);
    }

}
