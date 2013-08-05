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
require_once __DIR__ . '/../vendor/autoload.php';
use Doctrine\Common\Annotations\AnnotationReader;
use MetaPlayer\ErrorException;
use Doctrine\ORM\Tools\Setup;
use Ding\Container\Impl\ContainerImpl;
use Doctrine\Common\Annotations\AnnotationRegistry;

define('PROJECT_ROOT', realpath(__DIR__ . '/../') . DIRECTORY_SEPARATOR);

// TODO: refuse of it
require_once PROJECT_ROOT . '/config/app.config.php';

$config = include PROJECT_ROOT . '/config/ding.config.php';
if (isset($config['ding']['log4php.properties'])) {
    \Logger::configure($config['ding']['log4php.properties']);
}

$logger = \Logger::getLogger("MetaPlayer.bootstrap");
$app = $logger->getAllAppenders();

$container = ContainerImpl::getInstance($config);

// force override error handler
set_error_handler(function ($errno, $errstr, $errfile, $errline, array $errcontext) {
    throw new ErrorException("Unhandled Error: $errstr\n $errfile ($errline) [$errno]");
});

$logger->debug("container initialized");
$logger->trace("container initialized trace");
$checkContainer = $container->getBean("container");
if ($container != $checkContainer) {
    $logger->error("container was not successfully self registered");
}

$logger->debug("initialize doctrine");

$entityManager = $container->getBean("entityManager");
if (!isset($entityManager)) {
    $logger->error("entity manager was not successfully created");
}

//some old-school things
\MetaPlayer\GlobalFactory::setEntityManager($entityManager);

\Doctrine\DBAL\Types\Type::addType(\Oak\ORM\EnumDatatype::$typeName, 'Oak\ORM\EnumDatatype');

// init session
$session = $container->getBean("securityManager");

$logger->debug("MetaPlayer was successfully bootstrapped");
unset($logger);
unset($checkContainer);
unset($container);
unset($session);
unset($entityManager);

return $config;