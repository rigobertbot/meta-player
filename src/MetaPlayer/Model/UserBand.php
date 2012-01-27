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
 * The class UserBand represents UserBand.
 *
 * @Entity(repositoryClass="MetaPlayer\Repository\UserBandRepository")
 * @Table(name="user_band")
 * @author Val Dubrava <valery.dubrava@gmail.com>
 */
class UserBand extends BaseBand {
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
     * @ManyToOne(targetEntity="Band")
     * @var Band
     */
    protected $band = null;
    
    public function __construct(User $user, $name, \DateTime $foundDate, $source, \DateTime $endDate = null) {
        parent::__construct($name, $foundDate, $endDate);
        
        $this->user = $user;
        $this->source = $source;
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

    public function setSource($source) {
        $this->source = $source;
    }

    /**
     * Mark as approved, and set produced entity.
     *
     * @param Band $band
     */
    public function approve(Band $band) {
        $this->band = $band;
    }

    public function isApproved() {
        return $this->band != null;
    }
}
