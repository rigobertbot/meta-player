<?php
/*
 * MetaPlayer 1.0
 *  
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 * 
 * Copyright(c) 2010-2013 Val Dubrava [ valery.dubrava@gmail.com ]
 *  
 */
/**
 * User: v.dubrava
 * Date: 16.01.12
 * Time: 19:08
 */
namespace MetaPlayer\Model;

use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\Id;
use Doctrine\ORM\Mapping\Column;
use Doctrine\ORM\Mapping\Table;
use Doctrine\ORM\Mapping\GeneratedValue;
use Doctrine\ORM\Mapping\ManyToOne;
use Doctrine\ORM\Mapping\JoinColumn;

/**
 * The class UserTrack represents user specified track entity.
 * @Entity(repositoryClass="MetaPlayer\Repository\UserTrackRepository")
 * @Table(name="user_track")
 *
 * @author Val Dubrava <valery.dubrava@gmail.com>
 */
class UserTrack extends BaseTrack
{
    /**
     * @ManyToOne(targetEntity="User")
     * @var User
     */
    protected $user;

    /**
     * @Column
     * @var string
     */
    protected $source;

    /**
     * @ManyToOne(targetEntity="UserAlbum")
     * @JoinColumn(name="user_album_id", referencedColumnName="id")
     * @var UserAlbum
     */
    protected $userAlbum;

    /**
     * @ManyToOne(targetEntity="Track")
     * @var Track
     */
    protected $track;

    /**
     * @ManyToOne(targetEntity="Association")
     * @JoinColumn(name="vk_association_id", referencedColumnName="id")
     * @var Association
     */
    protected $vkAssociation;

    /**
     * @ManyToOne(targetEntity="Association")
     * @JoinColumn(name="my_association_id", referencedColumnName="id")
     * @var Association
     */
    protected $myAssociation;

    public function __construct(User $user, UserAlbum $userAlbum, $source, $title, $duration, $serial) {
        parent::__construct($title, $duration, $serial);
        $this->userAlbum = $userAlbum;
        $this->user = $user;
        $this->source = $source;
    }

    /**
     *
     * @return UserAlbum
     */
    public function getAlbum() {
        return $this->userAlbum;
    }

    /**
     * @param string $source
     */
    public function setSource($source)
    {
        $this->source = $source;
    }

    /**
     * @return string
     */
    public function getSource()
    {
        return $this->source;
    }

    /**
     * @return \MetaPlayer\Model\Track
     */
    public function getGlobalTrack()
    {
        return $this->track;
    }

    /**
     * @return \MetaPlayer\Model\User
     */
    public function getUser()
    {
        return $this->user;
    }

    /**
     * @return \MetaPlayer\Model\UserAlbum
     */
    public function getUserAlbum()
    {
        return $this->userAlbum;
    }

    /**
     * Mark as approved, and set produced entity.
     * @param \MetaPlayer\Model\Track $track
     */
    public function setGlobalTrack(Track $track) {
        if ($this->track !== $track) {
            $this->track = $track;
            // reset association if global track was changed
            $this->vkAssociation = null;
            $this->myAssociation = null;
        }
    }

    /**
     * @param SocialNetwork $socialNetwork
     * @return Association
     * @throws ModelException
     */
    public function getAssociation(SocialNetwork $socialNetwork) {
        switch ($socialNetwork) {
            case SocialNetwork::$MY:
                return $this->myAssociation;
            case SocialNetwork::$VK:
                return $this->vkAssociation;
            default:
                throw ModelException::unsupportedSocialNetwork($socialNetwork);
        }
    }

    /**
     * Associates track with specified the association.
     * @param SocialNetwork $socialNetwork
     * @param Association $association
     * @return \MetaPlayer\Model\UserTrack
     * @throws ModelException
     */
    public function associate(SocialNetwork $socialNetwork, Association $association) {
        $prevAssoc = $this->getAssociation($socialNetwork);
        if (isset($prevAssoc)) {
            $prevAssoc->decrementPopularity();
        }
        switch ($socialNetwork) {
            case SocialNetwork::$MY:
                $this->myAssociation = $association;
                break;
            case SocialNetwork::$VK:
                $this->vkAssociation = $association;
                break;
            default:
                throw ModelException::unsupportedSocialNetwork($socialNetwork);
        }
        $association->incrementPopularity();
        return $this;
    }
}
