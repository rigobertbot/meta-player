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

namespace MetaPlayer\Manager;
use Ding\Logger\ILoggerAware;

/**
 * The SecurityManager provides security mehods and manages session.
 *
 * @author Val Dubrava <valery.dubrava@gmail.com>
 * @Component(name={securityManager,SecurityManager})
 * @InitMethod(method=init)
 */
class SecurityManager implements ILoggerAware
{
    const USER_ID = "session_user_id";
    
    /**
     * @var \Logger
     */
    private $logger;
    
    /**
     * Init session.
     */
    public function init() {
        \session_start();
    }

    /**
     * Authenticates the specified user in session.
     *
     * @param int $viewerId 
     */
    public function authenticate($viewerId) {
        if ($this->isAuthenticated()) {
            $currentUserId = $_SESSION[self::USER_ID];
            if ($currentUserId != $viewerId) {
                $this->logger->warn("User $currentUserId replaced with $viewerId.");
            }
        }
        $_SESSION[self::USER_ID] = $viewerId;
    }
    
    /**
     * Checks is current session authenticated.
     *
     * @return bool
     */
    public function isAuthenticated() {
        return array_key_exists(self::USER_ID, $_SESSION);
    }

    public function setLogger(\Logger $logger) {
        $this->logger = $logger;
    }
}
