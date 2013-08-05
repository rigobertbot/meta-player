<?php

/*
 * MetaPlayer 1.0
 *  
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 * 
 * Copyright(c) 2010-2013 Val Dubrava [ valery.dubrava@gmail.com ]
 *  
 */

namespace MetaPlayer\Controller;

use MetaPlayer\JsonException;
use MetaPlayer\Repository\AlbumRepository;
use MetaPlayer\Repository\UserBandRepository;
use MetaPlayer\Repository\UserAlbumRepository;
use Oak\MVC\JsonViewModel;
use MetaPlayer\Model\Album;
use MetaPlayer\ViewHelper;
use Ding\Logger\ILoggerAware;
use MetaPlayer\Model\UserAlbum;
use MetaPlayer\Contract\AlbumDto;
use MetaPlayer\Contract\AlbumHelper;
use Oak\Json\JsonUtils;
use MetaPlayer\Contract\PlayerState;
use MetaPlayer\Contract\PlayerStatus;

/**
 * The State Controller responsible for saving user state.
 *
 * @author Val Dubrava <valery.dubrava@gmail.com>
 * @Controller
 * @RequestMapping(url={/state/})
 */
class StateController extends BaseSecurityController implements ILoggerAware
{
    /**
     * @var \Logger
     */
    private $logger;
    
    /**
     * @Resource
     * @var JsonUtils
     */
    private $jsonUtils;

    /**
     * @param $json
     * @return PlayerState
     * @throws \MetaPlayer\JsonException
     */
    private function parseJson($json) {
        $playerState = $this->jsonUtils->deserialize($json);
        if (!$playerState instanceof PlayerState) {
            $this->logger->error("json should be instance of PlayerState but got " . print_r($playerState, true));
            throw new JsonException("Wrong json format.");
        }
        return $playerState;
    }

    public function saveAction($json) {
        $state = $this->parseJson($json);
    }

    /**
     * @param \Logger $logger
     */
    public function setLogger(\Logger $logger) {
        $this->logger = $logger;
    }
}
