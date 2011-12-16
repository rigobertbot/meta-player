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

include 'private.config.php';

if (!class_exists('MPConfig')) {
    class MPConfig {
        public $VKSecret = "vk_secret";
        public $VKApiId = 12345678;
    }
}