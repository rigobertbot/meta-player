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
namespace MetaPlayer\Logic;


interface ISocialApi
{
    /**
     * Get supported social network.
     * @abstract
     * @return \MetaPlayer\Model\SocialNetwork
     */
    public function getSocialNetwork();

    /**
     * Check signature.
     * @abstract
     * @param array $params
     * @return bool
     */
    public function checkSignature($params);

    /**
     * Sends notification to the specified user list.
     * @abstract
     * @param string $message
     * @param array $userIds
     * @return array
     */
    public function sendNotification($message, array $userIds);
}
