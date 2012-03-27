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
 * The class MyUser represents User from my.mail.ru.
 *
 * @Entity
 * @author Val Dubrava <valery.dubrava@gmail.com>
 */
class MyUser extends User {
    /**
     * @Column(name="my_social_id")
     * @var string
     */
    protected $socialId;

    /**
     * Gets social network type.
     * @return SocialNetwork
     */
    public function getSocialNetwork() {
        return SocialNetwork::$MY;
    }

    public function __construct($socialId) {
        $this->socialId = $socialId;
    }

    public function getSocialId() {
        return $this->socialId;
    }
}
