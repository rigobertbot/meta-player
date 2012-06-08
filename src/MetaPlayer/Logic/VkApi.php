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
use MetaPlayer\Logic\Exception\VkApiException;

class VkApi implements ISocialApi
{
    private $secret;
    private $apiId;
    private $apiUrl = 'http://api.vk.com/api.php';


    public function __construct($apiId, $secret, $apiUrl = null) {
        $this->secret = $secret;
        $this->apiId = $apiId;
        if (isset($apiUrl)) {
            $this->apiUrl = $apiUrl;
        }
    }

    /**
     * @abstract
     * @return \MetaPlayer\Model\SocialNetwork
     */
    public function getSocialNetwork() {
        return SocialNetwork::$VK;
    }

    /**
     * Check signature.
     * @param array $params
     * @throws Exception\VkApiException
     * @throws Exception\VkApiException
     * @return bool
     */
    public function checkSignature($params) {
        $api_id = $params['api_id'];
        $viewer_id = $params['viewer_id'];
        $auth_key = $params['auth_key'];

        if ($api_id != $this->apiId) {
            throw VkApiException::wrongApiId($api_id, $this->apiId);
        }

        $expectedAuth = md5($api_id . '_' . $viewer_id . '_' . \MPConfig::$VKSecret);
        if ($auth_key != $expectedAuth) {
            throw VkApiException::wrongAuthKey($auth_key, $expectedAuth);
        }
    }

    private function sendRequest($method, array $params) {
        $params['method'] = $method;
        $params['api_id'] = $this->apiId;
        $params['v'] = '3.0';
        $params['format'] = 'json';
        $sig = $this->getSignature($params);
        $params['sig'] = $sig;
        $query = http_build_query($params);
        $response = file_get_contents($this->apiUrl . "?" . $query);
        $result = json_decode($response, true);
        if (isset($result['error'])) {
            $error = $result['error'];
            throw VkApiException::externalException($method, $error['error_code'], $error['error_msg']);
        }
        return $result['response'];
    }

    private function getSignature($params) {
        ksort($params);
        $result = '';
        foreach ($params as $key => $value) {
            $result .= "$key=$value";
        }
        $result .= $this->secret;
        return md5($result);
    }

    /**
     * Sends notification to the specified user list.
     * @param string $message
     * @param array $userIds
     * @return array
     */
    public function sendNotification($message, array $userIds) {
        $sentIds = array();
        $params = array('message' => $message, 'random' => rand(), 'timestamp' => time());
        do {
            $result = array();
            if (count ($userIds) > 100) {
                for ($i = 0; !empty($userIds) && $i < 100; $i ++) {
                    $result[] = array_pop($userIds);
                }
            } else {
                $result = $userIds;
                $userIds = array();
            }
            $params['uids'] = implode(",", $result);
            $response = $this->sendRequest('secure.sendNotification', $params);
            $sentIds += explode(",", $response);
        } while (!empty($userIds));
        return $sentIds;
    }
}
