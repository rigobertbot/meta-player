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
 * Description of Band
 *
 * @Entity
 * @author Val Dubrava <valery.dubrava@gmail.com>
 */
class Band 
{
    /**
     * @Id @Column(type="integer")
     * @GeneratedValue
     * @var int
     */
    protected $id;
    /**
     * @Column
     * @var string
     */
    protected $name;
    /**
     * @Column(type="date")
     * @var date 
     */
    protected $foundDate;
    /**
     * @Column(type="date", nullable=true)
     * @var date
     */
    protected $endDate;
    
    function __construct($name, $foundDate, $endDate = null) {
        $this->name = $name;
        $this->foundDate = $foundDate;
        $this->endDate = $endDate;
    }

}
