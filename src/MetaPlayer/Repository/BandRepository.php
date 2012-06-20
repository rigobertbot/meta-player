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
 * Description of BandRepository
 *
 * @author Val Dubrava <valery.dubrava@gmail.com>
 */
class BandRepository extends BaseRepository
{
    /**
     * @param $id
     * @param $lockMode
     * @param $lockVersion
     * @return \MetaPlayer\Model\Band
     */
    public function find($id, $lockMode = \Doctrine\DBAL\LockMode::NONE, $lockVersion = null) {
        return parent::find($id, $lockMode, $lockVersion);
    }

    /**
     * Finds band by name ignore case. If there is no band with such name it returns null.
     * @param $name
     * @return Band|null
     */
    public function findByName($name) {
        $bands = $this->getEntityManager()
            ->createQuery("SELECT b FROM MetaPlayer\\Model\\Band b WHERE lower(b.name) = ?")
            ->execute(array(strtolower($name)));
        return reset($bands) || null;
    }

}
