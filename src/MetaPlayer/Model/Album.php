<?php

/*
 * MetaPlayer 1.0
 *  
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 * 
 * Copyright(c) 2010-2013 Val Dubrava [ valery.dubrava@gmail.com ]
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
class Album extends BaseAlbum
{
    /**
     * @ManyToOne(targetEntity="Band")
     * @var Band 
     */
    protected $band;

    /**
     * @param Band $band
     * @param string $title
     * @param \DateTime $releaseDate
     */
    public function __construct(Band $band, $title, \DateTime $releaseDate) {
        $this->band = $band;
        parent::__construct($title, $releaseDate);
    }

   
    /**
     * @return Band
     */
    public function getBand() {
        return $this->band;
    }
}
