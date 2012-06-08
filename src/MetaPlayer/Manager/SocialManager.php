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

use MetaPlayer\Model\SocialNetwork;

/**
 * @author Val Dubrava <valery.dubrava@gmail.com>
 */
class SocialManager
{
    /**
     * @Resource
     * @var \MetaPlayer\Repository\UserRepository
     */
    private $userRepository;

    /**
     * @var \MetaPlayer\Logic\ISocialApi[]
     */
    private $socialApis;

    public function __construct(array $apis) {
        $this->socialApis = array();
        foreach ($apis as $api) {
            /** @var $api \MetaPlayer\Logic\ISocialApi */
            $this->socialApis[(string)$api->getSocialNetwork()] = $api;
        }
    }

    /**
     * Send notification for all users of the specified network.
     * @param $message
     * @param SocialNetwork $socialNetwork
     * @return array
     */
    public function sendNotification($message, SocialNetwork $socialNetwork, $adminsOnly = false) {
        $api = $this->socialApis[(string) $socialNetwork];
        $users = $adminsOnly
            ? $this->userRepository->findAdminsBySocialNetwork($socialNetwork)
            : $this->userRepository->findBySocialNetwork($socialNetwork);
        $userIds = array();
        foreach ($users as $user) {
            $userIds[] = $user->getSocialId();
        }
        return $api->sendNotification($message, $userIds);
    }

    public function authenticate($params, SocialNetwork $socialNetwork) {
        $api = $this->socialApis[(string)$socialNetwork];
        $api->checkSignature($params);
    }
}
