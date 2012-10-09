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

namespace MetaPlayer\Contract;

/**
 * Description of AlbumDto
 *
 * @author Val Dubrava <valery.dubrava@gmail.com>
 */
class PlayerState {
    /**
     * Node id of root playing node path (/band/album/track).
     * @var string
     */
    public $rootPlayingNodePath;
    /**
     * Node id of now playing node path.
     * @var string
     */
    public $nowPlayingNodePath;
    /**
     * Playing progress in seconds.
     * @var int
     */
    public $playingProgress;
    /**
     * Player playing status.
     * @var PlayerStatus
     */
    public $playerStatus;
}
