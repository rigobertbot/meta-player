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
     * Tells the EntityManager to make an instance managed and persistent.
     * Then flush EM.
     *
     * @param $entity
     * @return BaseRepository
     */
    public function persistAndFlush($entity) {
        $this->getEntityManager()->persist($entity);
        $this->flush();
        return $this;
    }

    /**
     * Merges the state of a detached entity into the persistence context
     * of this EntityManager and returns the managed copy of the entity.
     * The entity passed to merge will not become associated/managed with this EntityManager.
     *
     * @param object $entity The detached entity to merge into the persistence context.
     * @return object The managed copy of the entity.
     */
    public function merge($entity) {
        return $this->getEntityManager()->merge($entity);
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

    /**
     * Flushes all changes to objects that have been queued up to now to the database.
     *
     * @return BaseRepository
     */
    public function flush() {
        $this->getEntityManager()->flush();
        return $this;
    }
}
