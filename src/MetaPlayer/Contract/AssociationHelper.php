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
/**
 * User: v.dubrava
 * Date: 13.01.12
 * Time: 19:10
 */
namespace MetaPlayer\Contract;

use MetaPlayer\Model\Track;
use MetaPlayer\Model\Association;
use MetaPlayer\Model\ModelException;
use MetaPlayer\Model\UserTrack;

/**
 * The class AssociationHelper provides methods for converting Association to AssociationDto and vise versa.
 * @Component(name={AssociationHelper, associationHelper})
 *
 * @author Val Dubrava <valery.dubrava@gmail.com>
 */
class AssociationHelper implements \Ding\Logger\ILoggerAware
{
    /**
     * @var \Logger
     */
    private $logger;

    /**
     * @Resource
     * @var \MetaPlayer\Manager\SecurityManager
     */
    private $securityManager;

    /**
     * @Resource
     * @var \MetaPlayer\Repository\UserTrackRepository
     */
    private $userTrackRepository;

    /**
     * @param AssociationDto $dto
     * @param UserTrack $userTrack
     * @throws \MetaPlayer\Model\ModelException
     * @return \MetaPlayer\Model\Association
     */
    public function convertDtoToAssociation(AssociationDto $dto, UserTrack $userTrack) {
        $socialNetwork = $this->securityManager->getSocialNetwork();

        $track = $userTrack->getGlobalTrack();
        if ($track == null) {
            throw ModelException::thereIsNoGlobalObject($userTrack, 'Track');
        }

        return new Association($track, $socialNetwork, $dto->socialId);
    }

    /**
     * @param Association $association
     * @return AssociationDto
     */
    public function convertAssociationToDto(Association $association) {
        $dto = new AssociationDto();
        $dto->id = $association->getId();
        $dto->popularity = $association->getPopularity();
        $dto->socialId = $association->getSocialId();
        return $dto;
    }

    /**
     * Called by the container to inject the logger instance.
     *
     * @param \Logger $logger A log4php instance or dummy logger.
     *
     * @return void
     */
    public function setLogger(\Logger $logger) {
        $this->logger = $logger;
    }
}
