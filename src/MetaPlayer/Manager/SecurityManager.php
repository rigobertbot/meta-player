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
use \MetaPlayer\Model\SocialNetwork;
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
     * @param \MetaPlayer\Model\SocialNetwork|null $socialNetwork
     */
    public function authenticate($viewerId, SocialNetwork $socialNetwork = null) {
        if ($socialNetwork == null) {
            $socialNetwork = SocialNetwork::$VK;
        }
        $user = $this->getUser();
        if ($user != null) {
            if ($user->getSocialId() != $viewerId) {
                $currentUserId = $user->getSocialId();
                $this->logger->warn("User $currentUserId replaced with $viewerId.");
            }
        } else {
            $user = $this->userRepository->findOneBySocialId($viewerId, $socialNetwork);
        }
        
        if ($user == null) {
            $user = new User($viewerId, $socialNetwork);
            $this->userRepository->persistAndFlush($user);
        }
        
        $_SESSION[self::USER_ID] = $user->getId();
    }


    /**
     * Checks is current session authenticated.
     * @return boolean
     */
    public function isAuthenticated() {
        return array_key_exists(self::USER_ID, $_SESSION);
    }

    /**
     * Checks if current user is admin.
     * @return boolean
     */
    public function isAdmin() {
        return $this->getUser()->isAdmin();
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
        return $this->isAuthenticated() ? $this->userRepository->find($this->getUserId()) : null;
    }

    public function setLogger(\Logger $logger) {
        $this->logger = $logger;
    }
}
