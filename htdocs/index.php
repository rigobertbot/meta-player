<?php
set_include_path(get_include_path() . PATH_SEPARATOR . implode(PATH_SEPARATOR, array(
    '../library', // for namespaced direct libraries
    '../library/log4php', // log4php
    '../library/Ding/src/mg', // Ding
    '../library/Doctrine/lib',
    '../library/Doctrine/lib/vendor/doctrine-common/lib',
    '../library/Doctrine/lib/vendor/doctrine-dbal/lib',
    '../src',
)));

//require_once 'Logger.php';
//Logger::configure('../config/log4php.xml');

require_once 'Ding/Autoloader/Autoloader.php';
\Ding\Autoloader\Autoloader::register();

$config = include '../config/ding.config.php';

$container = \Ding\Container\Impl\ContainerImpl::getInstance($config);

$doctrineConfig = new \Doctrine\ORM\Configuration();
$doctrineConfig->setMetadataCacheImpl(new \Doctrine\Common\Cache\ArrayCache());
$doctrineConfig->setMetadataDriverImpl(
        new \Doctrine\ORM\Mapping\Driver\AnnotationDriver(
                new \Doctrine\Common\Annotations\AnnotationReader())
        );
$doctrineConfig->setProxyDir(__DIR__ . '../src/MetaPlayer/Proxies');
$doctrineConfig->setProxyNamespace('\\MetaPlayer\\Proxies');

$connectionOptions = array(
    'driver' => 'pdo_sqlite',
    'path' => 'database.sqlite'
);

$em = \Doctrine\ORM\EntityManager::create($connectionOptions, $doctrineConfig);

$container->setBean("em", $em);

\Ding\MVC\Http\HttpFrontController::handle($config);

