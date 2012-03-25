<?php
/*
 * Copyright (c) 2010-2011 All Right Reserved
 * Oak Software, Val Dubrava [ valery.dubrava@gmail.com ]
 *
 * This source is subject to the Microsoft Reference Source License (MS-RSL).
 * Please see the license.txt file for more information.
 * All other rights reserved.
 *
 * THIS CODE AND INFORMATION ARE PROVIDED "AS IS" WITHOUT WARRANTY OF ANY
 * KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A
 * PARTICULAR PURPOSE.
 */

namespace Oak\ORM;

use Oak\Common\Enum;
use Doctrine\DBAL\Types\StringType;
use Doctrine\DBAL\Platforms\AbstractPlatform;
use Doctrine\DBAL\Types\ConversionException;

/*
 * The class ModelEnum represents
 * @author: Val Dubrava <valery.dubrava@gmail.com>
 */
class EnumDatatype extends StringType
{
    public static $typeName = "enum";

    public function convertToPHPValue($value, AbstractPlatform $platform) {
        if ($value == null) {
            return null;
        }
        $parts = explode("::", $value);
        if (count($parts) != 2) {
            throw ConversionException::conversionFailedFormat($value, "enum", "class::field");
        }
        $clazz = $parts[0];
        $value = $parts[1];
        if (!class_exists($clazz)) {
            throw ConversionException::conversionFailed($value, "enum $clazz");
        }
        return Enum::parseEnum($clazz, $value);
    }

    public function convertToDatabaseValue($value, AbstractPlatform $platform) {
        if ($value == null) {
            return null;
        }
        $clazz = get_class($value);
        return $clazz . "::" . $value;
    }

    /**
     * Gets the name of this type.
     *
     * @return string
     */
    public function getName() {
        return self::$typeName;
    }
}

// \Doctrine\DBAL\Types\Type::addType(EnumDatatype::$typeName, 'Oak\ORM\EnumDatatype');
