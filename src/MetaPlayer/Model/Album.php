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

/**
 * Description of Album
 * @Entity
 * @author Val Dubrava <valery.dubrava@gmail.com>
 */
class Album 
{
    /**
     * @Id @Column(type="integer")
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
     * @Column(type="date")
     * @var date
     */
    protected $releaseDate;
    
    function __construct($band, $title, $releaseDate) {
        $this->band = $band;
        $this->title = $title;
        $this->releaseDate = $releaseDate;
    }

}
