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

require_once 'Ding/Autoloader/Autoloader.php';
\Ding\Autoloader\Autoloader::register();

$logger = \Logger::getLogger("bootstrap");
$config = include $projectRoot . '/config/ding.config.php';

$container = \Ding\Container\Impl\ContainerImpl::getInstance($config);
$logger->debug("container initialized");
$checkContainer = $container->getBean("container");
if ($container != $checkContainer) {
    $logger->error("container was not successfully self registered");
}

set_error_handler(function ($errno, $errstr, $errfile, $errline, array $errcontext) {
    global $logger;
    $logger->fatal("Unhandled Error: $errstr\n $errfile ($errline) [$errno]");
}, E_ALL);

register_shutdown_function(function () {
    global $logger;
            
    $last = error_get_last();
    if ($last != null) {
        $logger->fatal("Fatal error: $last");
    }
});


$logger->debug("initialize doctrine");
use Doctrine\Common\Annotations\AnnotationReader;
use Doctrine\Common\Annotations\AnnotationRegistry;
use Oak\ORM\FileCacheProvider;

AnnotationRegistry::registerFile($projectRoot . "/library/Doctrine/lib/Doctrine/ORM/Mapping/Driver/DoctrineAnnotations.php");

$doctrineConfig = new \Doctrine\ORM\Configuration();
$doctrineConfig->setMetadataCacheImpl(new FileCacheProvider(realpath(__DIR__ . '/../data/cache')));

$annotationReader = new AnnotationReader();

$doctrineConfig->setMetadataDriverImpl(
        new \Doctrine\ORM\Mapping\Driver\AnnotationDriver($annotationReader)
);
$doctrineConfig->setProxyDir($projectRoot . '/src/MetaPlayer/Proxies');
$doctrineConfig->setProxyNamespace('MetaPlayer\\Proxies');

$sqlLogger = null;

if (\Oak\Common\Env::isDebug()) {
    $sqlLogger = $container->getBean("sqlLogger");
}
if (\Oak\Common\Env::isTest()) {
    $sqlLogger = new \Doctrine\DBAL\Logging\EchoSQLLogger();
}
if (isset($sqlLogger)) {
    $doctrineConfig->setSQLLogger($sqlLogger);
}

$connectionOptions = include $projectRoot . '/config/doctrine.config.php';

$em = \Doctrine\ORM\EntityManager::create($connectionOptions, $doctrineConfig);

\MetaPlayer\GlobalFactory::setEntityManager($em);
$checkEm = $container->getBean("entityManager");
if ($checkEm != $em) {
    $logger->error("entity manager was not successfull register");
}

$logger->debug("MetaPlayer was successfull bootstrapped");