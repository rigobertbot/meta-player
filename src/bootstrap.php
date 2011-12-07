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
$projectRoot = realpath(__DIR__ . '../../');

set_include_path(get_include_path() . PATH_SEPARATOR . implode(PATH_SEPARATOR, array(
            $projectRoot . '/library', // for namespaced direct libraries
            $projectRoot . '/library/log4php', // log4php
            $projectRoot . '/library/Ding/src/mg', // Ding
            $projectRoot . '/library/Doctrine/lib',
            $projectRoot . '/library/Doctrine/lib/vendor/doctrine-common/lib',
            $projectRoot . '/library/Doctrine/lib/vendor/doctrine-dbal/lib',
            $projectRoot . '/src',
        )));

//require_once 'Logger.php';
//Logger::configure('../config/log4php.xml');

require_once 'Ding/Autoloader/Autoloader.php';
\Ding\Autoloader\Autoloader::register();

$config = include $projectRoot . '/config/ding.config.php';

$container = \Ding\Container\Impl\ContainerImpl::getInstance($config);

$doctrineConfig = new \Doctrine\ORM\Configuration();
$doctrineConfig->setMetadataCacheImpl(new \Doctrine\Common\Cache\ArrayCache());
$doctrineConfig->setMetadataDriverImpl(
        new \Doctrine\ORM\Mapping\Driver\AnnotationDriver(
                new \Doctrine\Common\Annotations\AnnotationReader())
);
$doctrineConfig->setProxyDir($projectRoot . '/src/MetaPlayer/Proxies');
$doctrineConfig->setProxyNamespace('\\MetaPlayer\\Proxies');

$connectionOptions = include $projectRoot . '/config/doctrine.config.php';

$em = \Doctrine\ORM\EntityManager::create($connectionOptions, $doctrineConfig);

$container->setBean("em", $em);