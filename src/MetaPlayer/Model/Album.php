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
class Album extends BaseAlbum
{
    /**
     * @ManyToOne(targetEntity="Band")
     * @var Band 
     */
    protected $band;

    /**
     *
     * @param type $userBand
     * @param type $title
     * @param type $releaseDate
     */
    public function __construct($userBand, $title, \DateTime $releaseDate) {
        $this->band = $userBand;
        parent::__construct($title, $releaseDate);
    }

   
    /**
     * @return Band
     */
    public function getBand() {
        return $this->band;
    }
}
