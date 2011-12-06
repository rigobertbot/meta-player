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
    /**
     * The flal debug means that it is debug invitoment.
     *
     * @return bool
     */
    public static function isDebug() 
    {
        if (array_key_exists('APPLICATION_ENV', $_SERVER))
        {
            return strtolower($_SERVER['APPLICATION_ENV']) == 'development';
        }
    }
}