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
 * Date: 12.01.12
 * Time: 19:31
 */
namespace MetaPlayer\Contract;

class ExceptionDto
{
    public $message;
    public $code;

    public function __construct($message, $code) {
        $this->message = $message;
        $this->code = $code;
    }
}
