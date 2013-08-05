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

namespace MetaPlayer\Contract;
use MetaPlayer\Model\UserAlbum;
use MetaPlayer\Model\ModelException;
use MetaPlayer\Model\BaseAlbum;
use MetaPlayer\Model\Album;
use MetaPlayer\ViewHelper;
use MetaPlayer\Repository\UserBandRepository;

/**
 * @author Val Dubrava <valery.dubrava@gmail.com>
 */
class BaseHelper {
    protected function trimText($text) {
        return trim($text, "., _;:*&^@#$%~`'\"\\\t\n\r-=+()/[]{}");
    }

    protected function parseInt($string) {
        return intval($string);
    }
}
