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

    /**
     * Tells the EntityManager to make an instance managed and persistent.
     *
     * @param $entity
     */
    public function persist($entity) {
        $this->getEntityManager()->persist($entity);
    }

    /**
     * Removes an entity instance.
     *
     * @param $entity
     * @return \MetaPlayer\Repository\BaseRepository
     */
    public function remove($entity) {
        $this->getEntityManager()->remove($entity);
        return $this;
    }
    
    public function flush() {
        $this->getEntityManager()->flush();
        return $this;
    }
}
