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
namespace Oak\Common;

/**
 * The class Env manages development envitoment.
 */
class Env
{
    const APPLICATION_ENV_KEY = 'APPLICATION_ENV';
    const DEV_ENV_VALUE = 'development';
    const TEST_ENV_VALUE = 'test';


    /**
     * The flal debug means that it is debug invitoment.
     *
     * @return bool
     */
    public static function isDebug() 
    {
        if (array_key_exists(self::APPLICATION_ENV_KEY, $_SERVER))
        {
            return strtolower($_SERVER[self::APPLICATION_ENV_KEY]) == self::DEV_ENV_VALUE;
        }
    }

    public static function isTest() {
        if (array_key_exists(self::APPLICATION_ENV_KEY, $_SERVER)) {
            return strtolower($_SERVER[self::APPLICATION_ENV_KEY]) == self::TEST_ENV_VALUE;
        }
    }

    public static function setTestEnv() {
        $_SERVER[self::APPLICATION_ENV_KEY] = self::TEST_ENV_VALUE;
    }

}