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
 * The class MetaPlayerException represents
 *
 * @author Val Dubrava <valery.dubrava@gmail.com>
 */
class MetaPlayerException extends \Exception
{
    public function __construct($message = null, $code = 0, $previous = null) {
        parent::__construct($message, $code, $previous);
    }

    public static function unsupportedSocialNetwork(\MetaPlayer\Model\SocialNetwork $socialNetwork) {
        return new self("Social network $socialNetwork is not supported by this code.");
    }

}
