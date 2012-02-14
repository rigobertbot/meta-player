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
class BandRepository extends EntityRepository
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

}
