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

namespace MetaPlayer\Repository;
use Doctrine\ORM\EntityRepository;

/**
 * Description of AlbumRepository
 *
 * @author Val Dubrava <valery.dubrava@gmail.com>
 */
class AlbumRepository extends EntityRepository
{
    public function findByBand($bandId) {
        return $this->findBy(array("band" => $bandId));
    }
}
