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
use Doctrine\ORM\Mapping\MappedSuperclass;
/**
 * The Band
 *
 * @Entity(repositoryClass="MetaPlayer\Repository\BandRepository")
 * @Table(name="band")
 * @author Val Dubrava <valery.dubrava@gmail.com>
 */
class Band extends BaseBand
{
    public function __construct($name, \DateTime $foundDate, \DateTime $endDate = null) {
        parent::__construct($name, $foundDate, $endDate);
    }
}
