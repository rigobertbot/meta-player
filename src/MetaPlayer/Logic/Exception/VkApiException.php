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
namespace MetaPlayer\Logic\Exception;



class VkApiException extends \Exception
{
    public function __construct($message = "", $code = 0, \Exception $previous = null) {
        parent::__construct($message, $code, $previous);
    }

    public static function wrongApiId($got, $expected) {
        return new self("The api_id is wrong: expected $expected, but got $got.");
    }

    public static function wrongAuthKey($got, $expected) {
        return new self("The auth_key is wrong: expected $expected, but got $got.");
    }

    public static function externalException ($method, $code, $message) {
        return new self("Method '$method' returned error ($code): $message.");
    }

}
