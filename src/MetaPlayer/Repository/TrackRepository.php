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
            ->createQuery("SELECT t FROM MetaPlayer\\Model\\Track t WHERE t.Album = ? AND lower(t.title) = ?")
            ->execute(array($album, strtolower($title)));
        return reset($tracks) || null;
    }
}
