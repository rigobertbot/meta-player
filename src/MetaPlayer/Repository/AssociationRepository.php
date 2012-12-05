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
use MetaPlayer\Model\Association;
use MetaPlayer\Model\SocialNetwork;
use MetaPlayer\Model\Album;
use MetaPlayer\Model\Track;

/**
 * The Association Repository
 *
 * @author Val Dubrava <valery.dubrava@gmail.com>
 */
class AssociationRepository extends BaseRepository
{
    /**
     * Tries to find the same association. Returns found or the specified.
     * Persist new entity.
     * @param Association $association
     * @return \MetaPlayer\Model\Association
     */
    public function tryFindTheSame(Association $association) {
        $duplicate = $this->findOneBy(
            array(
                'socialNetwork' => $association->getSocialNetwork(),
                'socialId' => $association->getSocialId(),
                'track' => $association->getTrack()
            )
        );
        if ($duplicate == null) {
            $this->persist($association);
            return $association;
        }
        return $duplicate;
    }

    /**
     * @param Track $track
     * @return Association[]
     */
    public function findByTrack(Track $track) {
        return $this->findBy(array('track' => $track), array('popularity' => 'desc'));
    }

    /**
     * Gets most popular association for the specified track.
     * @param Track $track
     * @return Association
     */
    public function findOnePopularByTrack(Track $track) {
        $result = $this->findBy(array('track' => $track), array('popularity' => 'desc'), 1);
        return reset($result);
    }
}
