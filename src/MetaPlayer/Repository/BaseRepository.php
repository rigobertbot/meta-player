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
 * The class BaseRepository represents repository of the Base.
 *
 * @author Val Dubrava <valery.dubrava@gmail.com>
 */
abstract class BaseRepository extends EntityRepository {
    public function persist($entity) {
        $this->getEntityManager()->persist($entity);
    }
    
    public function flush() {
        $this->getEntityManager()->flush();
    }
}
