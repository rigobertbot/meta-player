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

use Oak\Common\Enum;

/**
 * The enum PlayerStatus defines possible player status
 *
 * @author Val Dubrava <valery.dubrava@gmail.com>
 */
class PlayerStatus extends Enum {
    public $playing = "PLAYING";
    public $stopped = "STOPPED";
    public $paused = "PAUSED";
}

PlayerStatus::init();