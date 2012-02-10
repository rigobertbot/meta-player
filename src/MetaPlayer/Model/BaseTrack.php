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
 * The BaseTrack defines common representation of the track entity.
 * @author Val Dubrava <valery.dubrava@gmail.com>
 */
abstract class BaseTrack
{
    /**
     * @Id @Column(type="bigint")
     * @GeneratedValue
     * @var integer
     */
    protected $id;

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
    
    public function __construct($title, $duration, $serial) {
        $this->title = $title;
        $this->duration = $duration;
        $this->serial = $serial;
    }
    
    public function getId() {
        return $this->id;
    }

    /**
     *
     * @return BaseAlbum
     */
    public abstract function getAlbum();

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
        
        $band = $this->getAlbum()->getBand();
        
        $result[] = implode(" ", array($band->getName(), $this->getAlbum()->getTitle(), $this->getTitle()));
        $result[] = implode(" ", array($band->getName(), $this->getTitle()));
        $result[] = $this->getTitle();
        
        return $result;
    }

    /**
     * @param int $duration
     */
    public function setDuration($duration)
    {
        $this->duration = $duration;
    }

    /**
     * @param int $serial
     */
    public function setSerial($serial)
    {
        $this->serial = $serial;
    }

    /**
     * @param string $title
     */
    public function setTitle($title)
    {
        $this->title = $title;
    }
}
