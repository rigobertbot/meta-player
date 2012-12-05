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
use Ding\HttpSession\HttpSession;

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
    const SOCIAL_NETWORK = "session_social_network";
    
    /**
     * @var \Logger
     */
    private $logger;
    
    /**
     * @Resource
     * @var UserRepository
     */
    private $userRepository;

    /** @var HttpSession */
    private $httpSession;
    
    /**
     * Init session.
     */
    public function init() {
        $this->httpSession = HttpSession::getSession();
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
            $user->setSocialNetwork($socialNetwork);
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

        $this->httpSession->setAttribute(self::USER_ID, $user->getId());
        $this->httpSession->setAttribute(self::SOCIAL_NETWORK, (string) $socialNetwork );
    }


    /**
     * Checks is current session authenticated.
     * @return boolean
     */
    public function isAuthenticated() {

        return $this->httpSession->getAttribute(self::USER_ID) && $this->httpSession->hasAttribute(self::SOCIAL_NETWORK);
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
        return $this->httpSession->getAttribute(self::USER_ID);

    }

    /**
     * Get current social network.
     * @return SocialNetwork
     */
    public function getSocialNetwork() {
        return SocialNetwork::parse($this->httpSession->getAttribute(self::SOCIAL_NETWORK));
    }
    
    /**
     * Get current authenticated use or null.
     * @return User
     */
    public function getUser() {
        if (!$this->isAuthenticated()) {
            return null;
        }
        $socialNetwork = $this->getSocialNetwork();
        $user = $this->userRepository->find($this->getUserId());
        if (isset($user)) {
            $user->setSocialNetwork($socialNetwork);
        }
        return $user;
    }

    public function setLogger(\Logger $logger) {
        $this->logger = $logger;
    }
}
