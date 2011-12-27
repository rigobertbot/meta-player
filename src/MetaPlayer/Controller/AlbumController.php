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

namespace MetaPlayer\Controller;

use MetaPlayer\JsonException;
use MetaPlayer\Repository\AlbumRepository;
use Oak\MVC\JsonViewModel;
use MetaPlayer\Model\Album;
use MetaPlayer\ViewHelper;
use Ding\Logger\ILoggerAware;

/**
 * Description of AlbumController
 *
 * @author Val Dubrava <valery.dubrava@gmail.com>
 * @Controller
 * @RequestMapping(url={/album/})
 */
class AlbumController extends BaseSecurityController implements ILoggerAware
{
    /**
     * @var \Logger
     */
    private $logger;
    
    /**
     * @Resource
     * @var AlbumRepository
     */
    private $albumRepository;
    
    public function listAction($bandId, $params = array()) {
        $albums = $this->albumRepository->findByBand($bandId);
        
        $data = array();
        foreach ($albums as $album) {
            /* @var $album Album */
            $albumDto = array(
                'className' => 'AlbumNode',
                'id' => $album->getId(),
                'title' => $album->getTitle(),
                'releaseDate' => ViewHelper::formatDate($album->getReleaseDate()),
                'bandId' => $bandId,
            );
            $data[] = $albumDto;
        }
        
        return new JsonViewModel($data);
    }
    
    public function addAction($data) {
        $object = json_decode($data);
        if ($object == null) {
            throw new JsonException("Wrong or empty json.");
        }
        
    }

    public function setLogger(\Logger $logger) {
        $this->logger = $logger;
    }
}
