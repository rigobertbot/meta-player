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

namespace MetaPlayer\Model;
use Oak\Common\Enum;

class SocialNetwork extends Enum
{
    /**
     * @var self
     */
    public static $VK = "vk";
    /**
     * @var self
     */
    public static $MY = "my";
}

SocialNetwork::init();