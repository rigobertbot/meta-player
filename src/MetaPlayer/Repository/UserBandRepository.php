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

use MetaPlayer\Model\Band;
use MetaPlayer\Model\UserBand;
use MetaPlayer\Model\User;
use MetaPlayer\Manager\SecurityManager;
use Doctrine\ORM\Mapping\ClassMetadata;

/**
 * The class UserBandRepository represents repository of the UserBand.
 *
 * @author Val Dubrava <valery.dubrava@gmail.com>
 */
class UserBandRepository extends BaseRepository {
    /**
     * @param \MetaPlayer\Model\User $user
     * @return \MetaPlayer\Model\UserBand[]
     */
    public function findNotApproved(User $user) {
        return $this->findBy(array('band' => null, 'user' => $user));
    }

    /**
     * @param $id
     * @return UserBand
     */
    public function find($id) {
        return parent::find($id);
    }

    /**
     * @param \MetaPlayer\Model\UserBand $entity
     * @throws \MetaPlayer\MetaPlayerException
     */
    public function remove($entity)
    {
        if ($entity->isApproved()) {
            throw new \MetaPlayer\MetaPlayerException("Impossible to remove approved user entity.");
        }

        parent::remove($entity);
    }
}
