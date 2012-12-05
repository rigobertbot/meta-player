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

namespace MetaPlayer;

use Doctrine\DBAL\Logging\SQLLogger as ISQLLogger;
use Ding\Logger\ILoggerAware;

/**
 * Application specified SQL logger for Doctrine.
 *
 * @Component(name={SQLLogger, sqlLogger})
 * @author Val Dubrava <valery.dubrava@gmail.com>
 */
class SQLLogger implements ISQLLogger, ILoggerAware
{
    /**
     * @var \Logger
     */
    private $logger;
    
    private $startTime = 0;


    /**
     * Logs a SQL statement somewhere.
     *
     * @param string $sql The SQL to be executed.
     * @param array $params The SQL parameters.
     * @param array $types The SQL parameter types.
     * @return void
     */
    public function startQuery($sql, array $params = null, array $types = null) {
        if ($this->logger->isDebugEnabled()) {
            $this->logger->debug("$sql\n" . print_r($params, true) . print_r($types, true));
        }
        $this->startTime = microtime();
    }

    /**
     * Mark the last started query as stopped. This can be used for timing of queries.
     *
     * @return void
     */
    public function stopQuery() {
        $result = microtime() - $this->startTime;
        if ($this->logger->isDebugEnabled()) {
            $this->logger->debug("query done for $result");
        }
    }

    public function setLogger(\Logger $logger) {
        $this->logger = $logger;
    }
}
