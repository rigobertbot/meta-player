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

namespace Oak\ORM;

use Doctrine\Common\Cache\CacheProvider;

/**
 * Description of FileCacheProvider
 *
 * @author Val Dubrava <valery.dubrava@gmail.com>
 */
class FileCacheProvider extends CacheProvider {
    
    private $cacheDir;
    
    function __construct($cacheDir) {
        $this->cacheDir = rtrim($cacheDir, "\\/");
    }
    
    private function combinePath($id) {
        return $this->cacheDir . DIRECTORY_SEPARATOR . 'orm_' . md5($id);
    }

    protected function doContains($id) {
        return file_exists($this->combinePath($id));
    }

    protected function doDelete($id) {
        unlink($this->combinePath($id));
    }

    protected function doFetch($id) {
        if (!$this->doContains($id)) {
            return false;
        }
        return unserialize(file_get_contents($this->combinePath($id)));
    }

    protected function doFlush() {
        
    }

    protected function doGetStats() {
        
    }

    protected function doSave($id, $data, $lifeTime = false) {
        file_put_contents($this->combinePath($id), serialize($data));
    }

}
