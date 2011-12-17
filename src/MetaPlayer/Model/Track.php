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
use Doctrine\ORM\Mapping\GeneratedValue;
use Doctrine\ORM\Mapping\ManyToOne;

/**
 * Description of Track
 * @Entity(repositoryClass="MetaPlayer\Repository\TrackRepository")
 * @author Val Dubrava <valery.dubrava@gmail.com>
 */
class Track 
{
    /**
     * @Id @Column(type="integer")
     * @GeneratedValue
     * @var integer
     */
    protected $id;
    /**
     * @ManyToOne(targetEntity="Album")
     * @var Album
     */
    protected $album;
    /**
     * @Column
     * @var string
     */
    protected $title;
    /**
     * @Column(type="integer");
     * @var int
     */
    protected $duration;
    /**
     * @Column(type="integer")
     * @var int
     */
    protected $serial;
    
    public function __construct($album, $title, $duration, $serial) {
        $this->album = $album;
        $this->title = $title;
        $this->duration = $duration;
        $this->serial = $serial;
    }
    
    public function getId() {
        return $this->id;
    }

    /**
     *
     * @return Album
     */
    public function getAlbum() {
        return $this->album;
    }

    public function getTitle() {
        return $this->title;
    }

    public function getDuration() {
        return $this->duration;
    }

    public function getSerial() {
        return $this->serial;
    }

    /**
     * @return string[]
     */
    public function getQueries() {
        $result = array();
        
        $band = $this->album->getBand();
        
        $result[] = implode(" ", array($band->getName(), $this->album->getTitle(), $this->getTitle()));
        $result[] = implode(" ", array($band->getName(), $this->getTitle()));
        $result[] = $this->getTitle();
        
        return $result;
    }


}
