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

namespace MetaPlayer\Admin\Controller;

use Oak\Json\JsonUtils;
use MetaPlayer\Admin\Contract\AlbumDto;

/**
 * Description of AlbumController
 *
 * @author Val Dubrava <valery.dubrava@gmail.com>
 * @Controller
 * @RequestMapping(url={/admin/album/})
 */
class AlbumController extends BaseAdminController
{
    /**
     * @Resource
     * @var JsonUtils
     */
    private $jsonNativeSerializer;

    /**
     * @Resource
     * @var \MetaPlayer\Repository\UserAlbumRepository
     */
    private $userAlbumRepository;

    /**
     * @Resource
     * @var \MetaPlayer\Repository\UserTrackRepository
     */
    private $userTrackRepository;

    public function indexAction() {
        return new \Ding\Mvc\ModelAndView("Album/index");
    }

    public function listAction() {

        $userAlbums = $this->userAlbumRepository->findAll();

        $result = array();

        foreach ($userAlbums as $userAlbum) {
            $dto = new AlbumDto();
            $dto->id = $userAlbum->getId();
            $dto->approvedTo = $userAlbum->isApproved() ? $userAlbum->getApprovedAlbum()->getId() : null;
            $dto->bandId = $userAlbum->getBand()->getId();
            $dto->source = $userAlbum->getSource();
            $dto->releaseDate = \MetaPlayer\ViewHelper::formatDate($userAlbum->getReleaseDate());
            $dto->title = $userAlbum->getTitle();
            $dto->trackCount = count($this->userTrackRepository->findByUserAndAlbum($userAlbum->getUser(), $userAlbum));
            $dto->userId = $userAlbum->getUser()->getId();

            $result[] = $dto;
        }

        return new \Oak\MVC\JsonViewModel($result, $this->jsonNativeSerializer);
    }
}
