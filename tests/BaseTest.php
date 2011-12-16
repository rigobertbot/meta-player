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

/**
 * Description of BaseTest
 *
 * @author Val Dubrava <valery.dubrava@gmail.com>
 */
abstract class BaseTest extends \PHPUnit_Framework_TestCase {
    /**
     * @var Ding\Container\IContainer
     */
    protected $container;

    /**
     * Sets up the fixture, for example, opens a network connection.
     * This method is called before a test is executed.
     */
    protected function setUp() {
        $this->container = \Ding\Container\Impl\ContainerImpl::getInstance();
    }

}
