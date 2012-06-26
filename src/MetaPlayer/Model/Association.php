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

namespace MetaPlayer\Model;

use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\Id;
use Doctrine\ORM\Mapping\Column;
use Doctrine\ORM\Mapping\Table;
use Doctrine\ORM\Mapping\GeneratedValue;
use Doctrine\ORM\Mapping\ManyToOne;

/**
 * The class Association represents association between track in metatree and track in social network.
 * @Entity(repositoryClass="MetaPlayer\Repository\AssociationRepository")
 * @Table(name="association")
 * @author Val Dubrava <valery.dubrava@gmail.com>
 */
class Association implements IIdentified
{
    /**
     * @Id @Column(type="bigint")
     * @GeneratedValue
     * @var int
     */
    protected $id;

    /**
     * @ManyToOne(targetEntity="Track")
     * @var Track
     */
    protected $track;

    /**
     * @Column(type="enum", name="social_network")
     * @var SocialNetwork
     */
    protected $socialNetwork;

    /**
     * @Column(name="social_id")
     * @var string
     */
    protected $socialId;

    /**
     * @Column(type="integer")
     * @var int
     */
    protected $popularity;

    public function __construct(Track $track, SocialNetwork $socialNetwork, $socialId) {
        $this->track = $track;
        $this->socialNetwork = $socialNetwork;
        $this->socialId = $socialId;
        $this->popularity = 0;
    }

    public function getId() {
        return $this->id;
    }

    public function getSocialId() {
        return $this->socialId;
    }

    public function getSocialNetwork() {
        return $this->socialNetwork;
    }

    public function getTrack() {
        return $this->track;
    }

    public function setPopularity($popularity) {
        $this->popularity = $popularity;
    }

    public function getPopularity() {
        return $this->popularity;
    }

    public function decrementPopularity() {
        $this->popularity --;
        if ($this->popularity < 0) {
            \Logger::getLogger('MetaPlayer.Model.Association')->warn("There was attempt to decrement association {$this->id} with zero popularity.");
            $this->popularity = 0;
        }
    }

    public function incrementPopularity() {
        $this->popularity ++;
    }
}
