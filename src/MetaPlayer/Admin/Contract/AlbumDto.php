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
namespace MetaPlayer\Admin\Contract;

class AlbumDto extends \MetaPlayer\Contract\AlbumDto
{
    public $userId;
    public $trackCount;
    public $approvedTo;
}
