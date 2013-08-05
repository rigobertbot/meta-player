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
namespace MetaPlayer\Manager;

use MetaPlayer\Model\Band;

/**
 * @Component(name={bandManager})
 * @author Val Dubrava <valery.dubrava@gmail.com>
 */
class BandManager
{
    /**
     * @Resource
     * @var \MetaPlayer\Manager\SecurityManager
     */
    private $securityManager;

    /**
     * @Resource
     * @var \MetaPlayer\Repository\UserBandRepository
     */
    private $userBandRepository;

    /**
     * Creates user band using the specified band.
     * @param MetaPlayer\Model\Band $band
     * @param $source
     * @return MetaPlayer\Model\UserBand
     */
    public function createUserBandByBand(\MetaPlayer\Model\Band $band, $source) {
        $userBand = new \MetaPlayer\Model\UserBand(
            $this->securityManager->getUser(),
            $band->getName(),
            $band->getFoundDate(),
            $source,
            $band->getEndDate());
        $userBand->setBand($band);
        $this->userBandRepository->persist($userBand);
        $this->userBandRepository->flush();

        return $userBand;
    }
}
