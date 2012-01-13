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
/**
 * User: v.dubrava
 * Date: 13.01.12
 * Time: 19:10
 */
namespace MetaPlayer\Contract;

use MetaPlayer\Model\Track;

/**
 * The class TrackHelper provides methods for converting Track to TrackDto and vise versa.
 * @Component(name={trackHelper})
 *
 * @author Val Dubrava <valery.dubrava@gmail.com>
 */
class TrackHelper
{
    /**
     * @Resource
     * @var \MetaPlayer\Repository\AlbumRepository
     */
    private $albumRepository;

    /**
     * @Resource
     * @var \MetaPlayer\Repository\UserAlbumRepository
     */
    private $userAlbumRepository;

    /**
     * @Resource
     * @var AlbumHelper
     */
    private $albumHelper;

    public function convertDtoToUserTrack(TrackDto $dto) {
        $dto->albumId = $this->albumHelper->convertDtoToUserAlbumId($dto->albumId);
        $userAlbum = $this->userAlbumRepository->find($dto->albumId);
    }
}
