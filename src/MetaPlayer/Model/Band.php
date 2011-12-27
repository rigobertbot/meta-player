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
/**
 * The Band
 *
 * @Entity(repositoryClass="MetaPlayer\Repository\BandRepository")
 * @Table(name="band")
 * @author Val Dubrava <valery.dubrava@gmail.com>
 */
class Band 
{
    /**
     * @Id @Column(type="bigint")
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
     * @Column(type="date", name="found_date")
     * @var \DateTime
     */
    protected $foundDate;
    /**
     * @Column(type="date", nullable=true, name="end_date")
     * @var \DateTime
     */
    protected $endDate;
    
    public function __construct($name, \DateTime $foundDate, \DateTime $endDate = null) {
        $this->name = $name;
        $this->foundDate = $foundDate;
        $this->endDate = $endDate;
    }

    public function getId() {
        return $this->id;
    }
    
    /**
     * Gets name.
     *
     * @return string
     */
    public function getName() {
        return $this->name;
    }

    /**
     * Gets the band found date.
     * @return \DateTime
     */
    public function getFoundDate() {
        return $this->foundDate;
    }

    /**
     * @return \DateTime
     */
    public function getEndDate() {
        return $this->endDate;
    }


}
