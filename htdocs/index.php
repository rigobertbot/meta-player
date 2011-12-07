<?php
require_once '../src/bootstrap.php';

global $config;

\Ding\MVC\Http\HttpFrontController::handle($config);

