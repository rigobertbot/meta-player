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
try {
    $config = require_once '../src/bootstrap.php';

    \Ding\Mvc\Http\HttpFrontController::handle($config);
} catch (Exception $ex) {
    $logger = \Logger::getLogger("MetaPlayer.index");
    $logger->error($ex->getMessage() . "\n" . $ex->getTraceAsString(), $ex);
}
