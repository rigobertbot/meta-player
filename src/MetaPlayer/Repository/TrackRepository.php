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
 * Description of TrackRepository
 *
 * @author Val Dubrava <valery.dubrava@gmail.com>
 */
class TrackRepository extends EntityRepository
{
    public function findByAlbum($albumId) {
        return $this->findBy(array('album' => $albumId));
    }
}
