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
use MetaPlayer\Model\UserAlbum;
use MetaPlayer\Model\ModelException;
use MetaPlayer\Model\BaseAlbum;
use MetaPlayer\Model\Album;
use MetaPlayer\ViewHelper;
use MetaPlayer\Repository\UserBandRepository;

/**
 * Description of AlbumHelper
 * @Component(name={albumHelper})
 *
 * @author Val Dubrava <valery.dubrava@gmail.com>
 */
class AlbumHelper extends BaseHelper {
    /**
     * @Resource
     * @var BandHelper
     */
    private $bandHelper;
    
    /**
     * @Resource
     * @var \MetaPlayer\Repository\UserBandRepository
     */
    private $userBandRepository;

    /**
     * @param \MetaPlayer\Model\BaseAlbum $album
     * @return AlbumDto
     */
    private function convertBaseAlbumToDto(BaseAlbum $album) {
        $dto = new AlbumDto();
        
        $dto->id = $album->getId();
        $dto->releaseDate = ViewHelper::formatDate($album->getReleaseDate());
        $dto->bandId = $album->getBand()->getId();
        $dto->title = $album->getTitle();
        
        return $dto;
    }


    public function convertAlbumToDto(Album $album) {
        return $this->convertBaseAlbumToDto($album);
    }
    
    public function convertUserAlbumToDto(UserAlbum $album) {
        $dto = $this->convertBaseAlbumToDto($album);

        $dto->bandId = $album->getBand()->getId();
        $dto->id = $album->getId();
        $dto->source = $album->getSource();

        return $dto;
    }
    
    /**
     * @param AlbumDto $albumDto
     * @return UserAlbum 
     */
    public function convertDtoToUserAlbum(AlbumDto $albumDto) {
        $userBand = $this->userBandRepository->find($albumDto->bandId);

        $userAlbum = new UserAlbum(
                        $userBand,
                        $albumDto->title,
                        ViewHelper::parseDate($albumDto->releaseDate),
                        $albumDto->source);
        
        return $userAlbum;
    }

    public function convertDtoToAlbum(AlbumDto $albumDto) {
        $userBand = $this->userBandRepository->find($albumDto->bandId);
        $band = $userBand->getGlobalBand();

        if ($band == null) {
            throw ModelException::thereIsNoGlobalObject($userBand, 'Band');
        }

        $album  = new Album(
            $band,
            $albumDto->title,
            ViewHelper::parseDate($albumDto->releaseDate));

        return $album;
    }

    /**
     * Populates the specified user album with values from the specified dto.
     * @param \MetaPlayer\Model\UserAlbum $userAlbum
     * @param AlbumDto $dto
     */
    public function populateUserAlbumWithDto(UserAlbum $userAlbum, AlbumDto $dto) {
        $userAlbum->setTitle($this->trimText($dto->title));
        $userAlbum->setReleaseDate(ViewHelper::parseDate($dto->releaseDate));
        $userAlbum->setSource($dto->source);
    }
}
