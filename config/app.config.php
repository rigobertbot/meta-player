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
if (!class_exists('MPPrivateConfig')) {
    class MPPrivateConfig {
        public static $VKSecret = "vk_secret";
        public static $VKAppId = 12345678;
        public static $MySecret = "my_secret";
        public static $MyAppId = 12345678;
    }
}

class MPConfig extends MPPrivateConfig {
    public static $ProjectName = "MetaPlayer";
    public static $VersionName = "Demo 2";
}