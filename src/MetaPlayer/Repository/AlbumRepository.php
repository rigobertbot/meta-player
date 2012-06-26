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
use MetaPlayer\Model\Band;
use MetaPlayer\Model\Album;

/**
 * Description of AlbumRepository
 *
 * @author Val Dubrava <valery.dubrava@gmail.com>
 */
class AlbumRepository extends BaseRepository
{
    public function findByBand($bandId) {
        return $this->findBy(array("band" => $bandId));
    }

    /**
     * Finds album by name ignore case or null.
     * @param Band $band
     * @param string $title
     * @return Album|null
     */
    public function findOneByBandAndTitle(Band $band, $title) {
        $albums = $this->getEntityManager()
            ->createQuery("SELECT a FROM MetaPlayer\\Model\\Album a WHERE a.band = ? AND lower(a.title) = ?")
            ->execute(array($band, strtolower($title)));
        return reset($albums) || null;
    }
}
