<?php

namespace MetaPlayer\Model;

use MetaPlayer\Repository\BandRepository;
/**
 * Test class for Band.
 * Generated by PHPUnit on 2011-12-14 at 12:13:15.
 */
class BandTest extends  \MetaPlayer\BaseTest 
{
    /**
     * @var BandRepository
     */
    private $bandRepository;

    /**
     * Sets up the fixture, for example, opens a network connection.
     * This method is called before a test is executed.
     */
    protected function setUp() {
        parent::setUp();
        
        $this->bandRepository = $this->container->getBean("bandRepository");
    }

    /**
     * Tears down the fixture, for example, closes a network connection.
     * This method is called after a test is executed.
     */
    protected function tearDown() {
        
    }

    /**
     * @covers {className}::{origMethodName}
     * @todo Implement testGetId().
     */
    public function testGetId() {
        self::assertNotEmpty($this->bandRepository->findAll());
    }

}

?>
