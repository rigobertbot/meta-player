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


use MetaPlayer\Model\SocialNetwork;
use MetaPlayer\Logic\Exception\MyApiException;

class MyApi implements ISocialApi
{
    private $secret;
    private $appId;
    private $apiUrl = 'http://www.appsmail.ru/platform/api';

    public function __construct($appId, $secret, $apiUrl = null) {
        $this->secret = $secret;
        $this->appId = $appId;
        if (isset($apiUrl)) {
            $this->apiUrl = $apiUrl;
        }
    }

    /**
     * @abstract
     * @return \MetaPlayer\Model\SocialNetwork
     */
    public function getSocialNetwork() {
        return SocialNetwork::$MY;
    }

    /**
     * Check signature.
     * @param array $params
     * @param $params
     * @throws Exception\MyApiException
     * @throws Exception\MyApiException
     * @return bool
     */
    public function checkSignature($params) {
        $app_id = $params['app_id'];
        $sig = $params['sig'];
        unset($params['sig']);

        if ($app_id != $this->appId) {
            throw MyApiException::wrongApiId($app_id, $this->appId);
        }

        $expectedSign = $this->getSignature($params);

        if ($expectedSign != $sig) {
            throw MyApiException::wrongAuthKey($sig, $expectedSign);
        }
    }

    private function sendRequest($method, array $params) {
        $params['method'] = $method;
        $params['app_id'] = $this->appId;
        $params['format'] = 'json';
        $params['secure'] = 1;
        $sig = $this->getSignature($params);
        $params['sig'] = $sig;
        $query = http_build_query($params);
        $response = file_get_contents($this->apiUrl . "?" . $query);
        $result = json_decode($response, true);
        if (isset($result['error'])) {
            $error = $result['error'];
            throw MyApiException::externalException($method, $error['error_code'], $error['error_msg']);
        }
        return $result;
    }

    private function getSignature($params) {
        ksort($params);
        $combined = '';
        foreach ($params as $key => $value) {
            $combined .= "$key=$value";
        }
        return md5($combined . $this->secret);
    }

    /**
     * Sends notification to the specified user list.
     * @param string $message
     * @param array $userIds
     * @return void
     */
    public function sendNotification($message, array $userIds) {
        $params = array('text' => $message);
        do {
            $result = array();
            if (count ($userIds) > 200) {
                for ($i = 0; !empty($userIds) && $i < 200; $i ++) {
                    $result[] = array_pop($userIds);
                }
            } else {
                $result =& $userIds;
                $userIds = array();
            }
            $params['uids'] = implode(",", $result);
            $this->sendRequest('notifications.send', $params);
        } while (!empty($userIds));
    }
}
