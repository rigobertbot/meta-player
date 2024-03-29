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

namespace MetaPlayer\Contract;

use MetaPlayer\Model\BaseBand;
use MetaPlayer\Model\UserBand;
use MetaPlayer\ViewHelper;
use MetaPlayer\Model\Band;

/**
 * The class BandHelper provides methods for converting dto to model and vice versa
 *
 * @Component(name={bandHelper})
 * @author Val Dubrava <valery.dubrava@gmail.com>
 */
class BandHelper extends BaseHelper
{
    /**
     * @Resource
     * @var \MetaPlayer\Manager\SecurityManager
     */
    private $securityManager;

    /**
     * Converts base band to dto.
     * @param \MetaPlayer\Model\BaseBand $baseBand
     * @return BandDto
     */
    private function convertBaseBandToDto(BaseBand $baseBand) {
        $dto = new BandDto();

        $dto->id = $baseBand->getId();
        $dto->name = $baseBand->getName();
        $dto->endDate = ViewHelper::formatDate($baseBand->getEndDate());
        $dto->foundDate = ViewHelper::formatDate($baseBand->getFoundDate());

        return $dto;
    }

    /**
     * @param \MetaPlayer\Model\Band $band
     * @return BandDto
     */
    public function convertBandToDto(Band $band) {
        return $this->convertBaseBandToDto($band);
    }

    /**
     * @param \MetaPlayer\Model\UserBand $userBand
     * @return BandDto
     */
    public function convertUserBandToDto(UserBand $userBand) {
        $dto = $this->convertBaseBandToDto($userBand);
        $dto->id = $userBand->getId();
        $dto->source = $userBand->getSource();
        $dto->shareId = "b" . $userBand->getGlobalBand()->getId();

        return $dto;
    }

    /**
     * @param BandDto $dto
     * @return \MetaPlayer\Model\UserBand
     */
    public function convertDtoToUserBand(BandDto $dto) {
        $userBand = new UserBand(
            $this->securityManager->getUser(),
            $dto->name,
            ViewHelper::parseDate($dto->foundDate),
            $dto->source,
            ViewHelper::parseDate($dto->endDate));

        return $userBand;
    }

    /**
     * @param BandDto $dto
     * @return \MetaPlayer\Model\Band
     */
    public function convertDtoToBand(BandDto $dto) {
        $band = new Band(
            $dto->name,
            ViewHelper::parseDate($dto->foundDate),
            ViewHelper::parseDate($dto->endDate));
        return $band;
    }

    /**
     * Populates the specified user band with values from the specified dto.
     *
     * @param \MetaPlayer\Model\UserBand $userBand
     * @param BandDto $dto
     */
    public function populateUserBandWithDto(UserBand $userBand, BandDto $dto) {
        $userBand->setName($this->trimText($dto->name));
        $userBand->setFoundDate(ViewHelper::parseDate($dto->foundDate));
        $userBand->setEndDate(ViewHelper::parseDate($dto->endDate));
        $userBand->setSource($dto->source);
    }

}
