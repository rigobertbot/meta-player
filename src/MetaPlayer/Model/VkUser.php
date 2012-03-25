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

use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\Id;
use Doctrine\ORM\Mapping\Column;
use Doctrine\ORM\Mapping\Table;
use Doctrine\ORM\Mapping\GeneratedValue;
use Doctrine\ORM\Mapping\ManyToOne;

/**
 * The class User represents from vk.com.
 *
 * @Entity
 * @author Val Dubrava <valery.dubrava@gmail.com>
 */
class VkUser extends User {
    /**
     * Gets social network type.
     * @return SocialNetwork
     */
    public function getSocialNetwork() {
        return SocialNetwork::$VK;
    }

    public function __construct($socialId) {
        parent::__construct($socialId);
        $this->vkId = $socialId;
    }
}
