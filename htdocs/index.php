<?php
set_include_path(get_include_path() . PATH_SEPARATOR . implode(PATH_SEPARATOR, array(
    '../library', // for namespaced direct libraries
    '../library/log4php', // log4php
    '../library/Ding/src/mg', // Ding
    '../src',
)));

//require_once 'Logger.php';
//Logger::configure('../config/log4php.xml');

require_once 'Ding/Autoloader/Autoloader.php';
\Ding\Autoloader\Autoloader::register();

$config = include '../config/ding.config.php';

$container = \Ding\Container\Impl\ContainerImpl::getInstance($config );

\Ding\MVC\Http\HttpFrontController::handle($config);
