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
 * Description of Track
 * @Entity
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
}
