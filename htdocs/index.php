<?php
require_once '../src/bootstrap.php';

global $config;

\Ding\Mvc\Http\HttpFrontController::handle($config);
