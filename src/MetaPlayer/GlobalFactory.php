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

namespace MetaPlayer;
use Ding\Container\Impl\ContainerImpl;

/**
 * Description of InjectorFactory
 * @Configuration
 * @author Val Dubrava <valery.dubrava@gmail.com>
 */
class GlobalFactory
{
    private static $_entityManager = null;

    /**
     * @Bean(name=container)
     * @return \Ding\Container\IContainer
     */
    public function getContainer() {
        return ContainerImpl::getInstance();
    }

    /**
     * @Bean(name={entityManager, em})
     * @throws \Exception
     * @return \Doctrine\ORM\EntityManager
     */
    public function getEntityManager() {
        if (self::$_entityManager == null) {
            throw new \Exception("GlobalFactory is not initialized properly: there is no EntityManager.");
        }
        return self::$_entityManager;
    }

    /**
     * Sets entity manager to global scope.
     * @param \Doctrine\ORM\EntityManager $em
     */
    public static function setEntityManager(\Doctrine\ORM\EntityManager $em) {
        self::$_entityManager = $em;
    }
}
