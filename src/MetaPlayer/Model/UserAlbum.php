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
use Doctrine\ORM\Mapping\JoinColumn;

/**
 * The class UserAlbum represents UserAlbum.
 *
 * @Entity(repositoryClass="MetaPlayer\Repository\UserAlbumRepository")
 * @Table(name="user_album")
 * @author Val Dubrava <valery.dubrava@gmail.com>
 */
class UserAlbum extends BaseAlbum {
    /**
     * @ManyToOne(targetEntity="User")
     * @var User
     */
    protected $user;

    /**
     * @Column
     * @var string
     */
    protected $source;

    /**
     * @Column(type="boolean", nullable=true, name="is_approved")
     * @var bool
     */
    protected $isApproved = false;

    /**
     * @ManyToOne(targetEntity="UserBand")
     * @JoinColumn(name="user_band_id", referencedColumnName="id")
     * @var UserBand 
     */
    protected $band;
    
    public function __construct(UserBand $band, $title, \DateTime $releaseDate, $source) {
        parent::__construct($title, $releaseDate);
        $this->band = $band;
        $this->source = $source;
        $this->user = $band->getUser();
    }

    /**
     * @return UserBand
     */
    public function getBand() {
        return $this->band;
    }

    /**
     * @return User
     */
    public function getUser() {
        return $this->user;
    }

    public function getSource() {
        return $this->source;
    }

    public function getIsApproved() {
        return $this->isApproved;
    }


}
