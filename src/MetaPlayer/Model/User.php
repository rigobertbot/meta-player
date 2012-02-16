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
     * @Column(type="bigint", name="vk_id")
     * @var int
     */
    protected $vkId;

    /**
     * @Column(type="boolean", name="is_admin")
     * @var boolean
     */
    protected $isAdmin;

    public function getId() {
        return $this->id;
    }
    
    public function getVkId() {
        return $this->vkId;
    }

    /**
     * @param int $vkId 
     */
    public function __construct($vkId) {
        $this->vkId = $vkId;
    }

    /**
     * Flag means is this user admin.
     * @return boolean
     */
    public function isAdmin() {
        return $this->isAdmin;
    }
}
