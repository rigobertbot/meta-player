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
     * @param $em
     * @param \Doctrine\ORM\Mapping\ClassMetadata $class
     */
    public function __construct($em, ClassMetadata $class) {
        parent::__construct($em, $class);
        
        // i don't need any iheritance on db side.
        $class->rootEntityName = $class->name;
    }

    /**
     * @param \MetaPlayer\Model\User $user
     * @return \MetaPlayer\Model\UserBand[]
     */
    public function findNotApproved(User $user) {
        return $this->findBy(array('isApproved' => false, 'user' => $user));
    }
}
