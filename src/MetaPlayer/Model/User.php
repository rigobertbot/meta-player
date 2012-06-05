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
use Doctrine\ORM\Mapping\InheritanceType;
use Doctrine\ORM\Mapping\DiscriminatorColumn;
use Doctrine\ORM\Mapping\DiscriminatorMap;

/**
 * The class User represents User.
 *
 * @Entity(repositoryClass="MetaPlayer\Repository\UserRepository")
 * @Table(name="user")
 * @author Val Dubrava <valery.dubrava@gmail.com>
 */
class User {

    /**
     * @Id @Column(type="bigint")
     * @GeneratedValue
     * @var int
     */
    protected $id;

    /**
     * @Column(type="boolean", name="is_admin")
     * @var boolean
     */
    protected $isAdmin = false;

    /**
     * @Column(name="vk_social_id")
     * @var string
     */
    protected $vkId;

    /**
     * @Column(name="my_social_id")
     * @var string
     */
    protected $myId;

    /**
     * @var SocialNetwork
     */
    protected $socialNetwork = null;


    public function getId() {
        return $this->id;
    }

    /**
     * Gets social id.
     * @abstract
     * @return string
     */
    public function getSocialId() {

    }

    /**
     * Gets social network type.
     * @abstract
     * @return SocialNetwork
     */
    public function getSocialNetwork() {
        return $this->socialNetwork;
    }

    /**
     * @param $socialId
     * @param SocialNetwork $socialNetwork
     * @return \MetaPlayer\Model\User
     */
    public function __construct($socialId, SocialNetwork $socialNetwork) {
        $this->socialNetwork = $socialNetwork;
        $this->setSocialId($socialId, $socialNetwork);
    }

    /**
     * Binds user with the specified social network.
     * @param SocialNetwork $socialNetwork
     * @return \MetaPlayer\Model\User
     */
    public function setSocialNetwork(SocialNetwork $socialNetwork) {
        $this->socialNetwork = $socialNetwork;
        return $this;
    }

    /**
     * Sets social id for the specified social network.
     * @param $socialId
     * @param SocialNetwork $socialNetwork
     * @return User
     */
    public function setSocialId($socialId, SocialNetwork $socialNetwork) {
        switch ($socialNetwork) {
            case SocialNetwork::$MY:
                $this->myId = $socialId;
                break;
            case SocialNetwork::$VK:
                $this->vkId = $socialId;
                break;
        }
        return $this;
    }

    /**
     * Flag means is this user admin.
     * @return boolean
     */
    public function isAdmin() {
        return $this->isAdmin;
    }

    public function __toString() {
        return "User{$this->id}('{$this->getSocialId()}/{$this->getSocialNetwork()})";
    }


}
