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

namespace MetaPlayer\Model;

use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\Id;
use Doctrine\ORM\Mapping\Column;
use Doctrine\ORM\Mapping\Table;
use Doctrine\ORM\Mapping\GeneratedValue;
use Doctrine\ORM\Mapping\ManyToOne;

/**
 * Model base exception.
 * @author Val Dubrava <valery.dubrava@gmail.com>
 */
class ModelException extends \Exception
{
    /**
     * Construct the exception. Note: The message is NOT binary safe.
     * @link http://php.net/manual/en/exception.construct.php
     * @param string $message [optional] The Exception message to throw.
     * @param int $code [optional] The Exception code.
     * @param \Exception $previous [optional] The previous exception used for the exception chaining. Since 5.3.0
     */
    public function __construct ($message = "", $code = 0, \Exception $previous = null) {
        parent::__construct($message, $code, $previous);
    }

    public static function illegalState($reason) {
        return new self("Model illegal state: $reason.");
    }

    public static function thereIsNoGlobalObject(IIdentified $userObject, $globalObjectName) {
        $clazz = get_class($userObject);
        $id = $userObject->getId();
        return self::illegalState("User object '$clazz' with id $id does not have correspond global object '$globalObjectName'");
    }

    public static function unsupportedSocialNetwork(SocialNetwork $socialNetwork) {
        return new self("Unsupported social network $socialNetwork.");
    }

    public static function invalidId($id, $entity) {
        return new self("There is not $entity with id = $id.");
    }
}
