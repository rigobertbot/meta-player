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

namespace MetaPlayer\Repository;

use Doctrine\ORM\EntityRepository;
use MetaPlayer\Model\Album;
use MetaPlayer\Model\Track;

/**
 * The TrackRepository
 *
 * @author Val Dubrava <valery.dubrava@gmail.com>
 */
class TrackRepository extends BaseRepository
{
    public function findByAlbum($albumId) {
        return $this->findBy(array('album' => $albumId), array('serial' => 'asc'));
    }

    /**
     * @param Album $album
     * @param string $title
     * @return Track|null
     */
    public function findOneByAlbumAndTitle(Album $album, $title) {
        $tracks = $this->getEntityManager()
            ->createQuery("SELECT t FROM MetaPlayer\\Model\\Track t WHERE t.album = ?0 AND lower(t.title) = ?1")
            ->execute(array($album, strtolower($title)));
        return reset($tracks) ? current($tracks) : null;
    }
}
