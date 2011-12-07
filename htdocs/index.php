<?php
require_once '../src/MetaPlayer/bootstrap.php';

global $config;

\Ding\MVC\Http\HttpFrontController::handle($config);

