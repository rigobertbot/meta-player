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
namespace Oak\Memcache;

/**
 * The class MemcacheClient is a facade for memcache.
 */
class MemcacheClient
{
    /**
     * @var \Memcache
     */
    private $memcache;

    public $host = "localhost";
    public $port = 11211;
    public $useCompression = false;

    public function init() {
        $this->memcache = new \Memcache();
        $this->memcache->pconnect($this->host, $this->port);
    }

    /**
     * Stores an item var with key on the memcached server.
     * @param string $key
     * @param mixed $value The variable to store. Strings and integers are stored as is, other types are stored serialized.
     * @param int $expired Expiration time of the item. If it's equal to zero, the item will never expire. You can also use Unix timestamp or a number of seconds starting from current time, but in the latter case the number of seconds may not exceed 2592000 (30 days).
     * @return boolean
     */
    public function set($key, $value, $expired = 0) {
        return $this->memcache->set($key, $value, $this->getFlags(), $expired);
    }

    /**
     * Stores variable var with key only if such key doesn't exist at the server yet.
     * @see set
     * @param string $key
     * @param mixed $value
     * @param int $expired
     * @return boolean Returns TRUE on success or FALSE on failure. Returns FALSE if such key already exist.
     */
    public function add($key, $value, $expired = 0) {
        return $this->memcache->add($key, $value, $this->getFlags(), $expired);
    }

    /**
     * Replaces value of existing item with key.
     * @param string $key
     * @param mixed $value
     * @param int $expired
     * @return boolean Returns TRUE on success or FALSE on failure. In case if item with such key doesn't exists, it returns FALSE.
     */
    public function replace($key, $value, $expired = 0) {
        return $this->memcache->replace($key, $value, $this->getFlags(), $expired);
    }

    /**
     * Gets previously stored data if an item with such key exists on the server at this moment.
     * @param $key
     * @return mixed Returns the string associated with the key or FALSE on failure or if such key was not found.
     */
    public function get($key) {
        return $this->memcache->get($key);
    }

    /**
     * Deletes an item with the key.
     * @param string $key
     * @return boolean
     */
    public function delete($key) {
        return $this->memcache->delete($key);
    }

    public function __destruct() {
        $this->memcache->close();
    }

    private function getFlags() {
        return $this->useCompression ? MEMCACHE_COMPRESSED : 0;
    }
}
