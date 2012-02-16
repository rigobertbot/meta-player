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
require_once '../src/bootstrap.php';

global $config;

\Ding\Mvc\Http\HttpFrontController::handle($config);
