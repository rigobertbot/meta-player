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

namespace Oak\Json;

/**
 * @author Val Dubrava <valery.dubrava@gmail.com>
 */
class NativeSerializer implements ISerializer
{

    /**
     * @param object|array $object
     * @return string
     */
    public function serialize($object)
    {
        return json_encode($object);
    }
}
