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
use Oak\Common\Env;

$CACHE_IMPL = Env::isDebug() || Env::isTest() ? array() : array('impl' => 'file', 'directory' => realpath(__DIR__ . '/../data/cache'));
$SCAN_DIRS = array();
$SCAN_DIRS[] = realpath(__DIR__ . '/../src/MetaPlayer');
//if (Env::isTest()) {
//    $SCAN_DIRS[] = realpath(__DIR__ . '/../tests/src');
//}

return array(
    'ding' => array(
        'log4php.properties' => __DIR__ . '/log4php.xml',
        'factory' => array(
            'bdef' => array (
                'annotation' => array(
                    'scanDir' => $SCAN_DIRS,
                ),
                'xml' => array(
                    'filename' => 'beans.xml',
                    'directories' => array (__DIR__),
                ),
            ),
        ),
        'cache' => array(
            'proxy' => $CACHE_IMPL,
            'bdef' => $CACHE_IMPL,
            'beans' => $CACHE_IMPL,
            'autoloader' => $CACHE_IMPL,
            'aspect' => $CACHE_IMPL,
            'annotations' => $CACHE_IMPL,
        )
    )
);