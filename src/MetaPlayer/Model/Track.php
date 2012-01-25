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
 * The class Track represents track entity.
 * @Entity(repositoryClass="MetaPlayer\Repository\TrackRepository")
 * @Table(name="track")
 * @author Val Dubrava <valery.dubrava@gmail.com>
 */
class Track extends BaseTrack
{
    /**
     * @ManyToOne(targetEntity="Album")
     * @var Album
     */
    protected $album;

    public function __construct(Album $album, $title, $duration, $serial) {
        parent::__construct($title, $duration, $serial);
        $this->album = $album;
    }
    
    /**
     * @return Album
     */
    public function getAlbum() {
        return $this->album;
    }
}
