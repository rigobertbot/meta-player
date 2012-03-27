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
 * @InheritanceType("SINGLE_TABLE")
 * @Table(name="user")
 * @DiscriminatorColumn(name="type", type="string")
 * @DiscriminatorMap({"MetaPlayer\Model\SocialNetwork::vk" = "MetaPlayer\Model\VkUser", "MetaPlayer\Model\SocialNetwork::my" = "MetaPlayer\Model\MyUser"})
 * @author Val Dubrava <valery.dubrava@gmail.com>
 */
abstract class User {

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

    public function getId() {
        return $this->id;
    }

    /**
     * Gets social id.
     * @abstract
     * @return string
     */
    public abstract function getSocialId();

    /**
     * Gets social network type.
     * @abstract
     * @return SocialNetwork
     */
    public abstract function getSocialNetwork();

    /**
     * @param $socialId
     */
    public function __construct() {
    }

    /**
     * Flag means is this user admin.
     * @return boolean
     */
    public function isAdmin() {
        return $this->isAdmin;
    }
}
