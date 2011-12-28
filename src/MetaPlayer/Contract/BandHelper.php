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

namespace MetaPlayer\Contract;

/**
 * The class BandHelper provides methods for converting dto to model and vice versa
 *
 * @Component(name={bandHelper})
 * @author Val Dubrava <valery.dubrava@gmail.com>
 */
class BandHelper 
{
    private static $userBandIdPrefix = "user_";
    
    public function convertUserBandIdToDto($userBandId) {
        return self::$userBandIdPrefix . $userBandId;
    }
    
    public function convertDtoToUserBandId($dtoBandId) {
        if (strpos($dtoBandId, self::$userBandIdPrefix) === 0) {
            return substr($dtoBandId, strlen(self::$userBandIdPrefix));
        }
        return null;
    }

}
