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
use MetaPlayer\Repository\UserRepository;
use MetaPlayer\Model\User;

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
     * @Resource
     * @var UserRepository
     */
    private $userRepository;
    
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
        $user = $this->getUser();
        if ($user != null) {
            if ($user->getVkId() != $viewerId) {
                $currentUserId = $user->getVkId();
                $this->logger->warn("User $currentUserId replaced with $viewerId.");
            }
        } else {
            $user = $this->userRepository->findOneByVkId($viewerId);
        }
        
        if ($user == null) {
            $user = new User($viewerId);
            $this->userRepository->persistAndFlush($user);
        }
        
        $_SESSION[self::USER_ID] = $user->getId();
    }
    
    /**
     * Checks is current session authenticated.
     *
     * @return bool
     */
    public function isAuthenticated() {
        return array_key_exists(self::USER_ID, $_SESSION);
    }
    
    /**
     * Get current user id.
     *
     * @return int
     */
    public function getUserId() {
        return $_SESSION[self::USER_ID];
    }
    
    /**
     * Get current authenticated use or null.
     * @return User
     */
    public function getUser() {
        return $this->userRepository->find($this->getUserId());
    }

    public function setLogger(\Logger $logger) {
        $this->logger = $logger;
    }
}
