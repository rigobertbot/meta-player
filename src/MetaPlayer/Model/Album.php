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
 * Description of Album
 * @Entity(repositoryClass="MetaPlayer\Repository\AlbumRepository")
 * @Table(name="album")
 * @author Val Dubrava <valery.dubrava@gmail.com>
 */
class Album 
{
    /**
     * @Id @Column(type="bigint")
     * @GeneratedValue
     * @var int
     */
    protected $id;
    /**
     * @ManyToOne(targetEntity="Band")
     * @var Band 
     */
    protected $band;
    /**
     * @Column
     * @var string
     */
    protected $title;
    /**
     * @Column(type="date", name="release_date")
     * @var \DateTime
     */
    protected $releaseDate;

    /**
     *
     * @param type $band
     * @param type $title
     * @param type $releaseDate
     */
    public function __construct($band, $title, \DateTime $releaseDate) {
        $this->band = $band;
        $this->title = $title;
        $this->releaseDate = $releaseDate;
    }

    public function getId() {
        return $this->id;
    }
    
    /**
     * @return Band
     */
    public function getBand() {
        return $this->band;
    }

    /**
     *
     * @return string
     */
    public function getTitle() {
        return $this->title;
    }

    /**
     * @return \DateTime
     */
    public function getReleaseDate() {
        return $this->releaseDate;
    }


}
