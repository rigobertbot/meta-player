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
     * @ManyToOne(targetEntity="UserBand")
     * @JoinColumn(name="user_band_id", referencedColumnName="id")
     * @var UserBand 
     */
    protected $userBand;

    /**
     * @ManyToOne(targetEntity="Album")
     * @var Album
     */
    protected $album = null;
    
    public function __construct(UserBand $userBand, $title, \DateTime $releaseDate, $source) {
        parent::__construct($title, $releaseDate);
        $this->userBand = $userBand;
        $this->source = $source;
        $this->user = $userBand->getUser();
    }

    /**
     * @return UserBand
     */
    public function getBand() {
        return $this->userBand;
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

    /**
     * Mark as approved, and set produced entity.
     *
     * @param Album $album
     */
    public function approve(Album $album) {
        $this->album = $album;
    }

    /**
     * Is this user entity approved and simple entity was produced.
     * @return bool
     */
    public function isApproved() {
        return $this->album != null;
    }

    /**
     * Gets approved album.
     * @return Album|null
     */
    public function getApprovedAlbum() {
        return $this->album;
    }

    /**
     * @param string $source
     */
    public function setSource($source)
    {
        $this->source = $source;
    }
}
