<?php
/*
 * Copyright (c) 2010-2013 All Right Reserved
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

namespace Oak\Common;

/*
 * The class Enum represents
 * @author: Val Dubrava <valery.dubrava@gmail.com>
 */
class Enum
{
    private $name;
    private $value;
    /**
     * The hash of enum => array(lowerCaseValue => enumInstance)
     *
     * @var array
     */
    private static $lowerCaseHash = array();

    /**
     * Initializes an enum class.
     *
     * @static
     * @throws \Exception
     */
    public static function init() {
        $clazz = get_called_class();

        if (array_key_exists($clazz, self::$lowerCaseHash)) {
            throw new \Exception("The enum class $clazz already initialized or has duplicate.");
        }
        $lowerHash = array();

        $refClass = new \ReflectionClass($clazz);
        $properties = $refClass->getProperties(\ReflectionProperty::IS_PUBLIC | \ReflectionProperty::IS_STATIC);
        foreach ($properties as $property) {
            if (!$property->isDefault())
                continue;
            $value = $property->getValue(null);
            $enumInstance = $refClass->newInstanceArgs(array($property->name, $value));
            $property->setValue($enumInstance);

            $lowerHash[strtolower($value)] = $enumInstance;
        }
        self::$lowerCaseHash[$clazz] = $lowerHash;
    }

    public function __construct($name, $value) {
        $this->name = $name;
        $this->value = $value;
    }

    public function __toString() {
        return $this->value;
    }

    public function toString() {
        return (string)$this;
    }

    public function getName() {
        return $this->name;
    }

    /**
     * Parses the specified string and gets the instance of current called enum class.
     *
     * @static
     * @param $value
     * @return Enum
     * @throws \Exception
     */
    public static function parse($value) {
        $clazz = get_called_class();
        return self::parseEnum($clazz, $value);
    }

    /**
     * Parses the specified string of a specified class and gets the instance of such enum.
     *
     * @static
     * @param $clazz
     * @param $value
     * @return mixed
     * @throws \Exception
     */
    public static function parseEnum($clazz, $value) {
        if (!array_key_exists($clazz, self::$lowerCaseHash)) {
            throw new \Exception("The enum class $clazz is not initialized yet.");
        }
        $lowerHash = self::$lowerCaseHash[$clazz];
        return $lowerHash[strtolower($value)];
    }

    /**
     * Gets all enum values.
     * @static
     * @return Enum[]
     * @throws \Exception
     */
    public static function getValues() {
        $clazz = get_called_class();
        return self::getEnumValues($clazz);
    }

    /**
     * Gets all values of the specified enum class.
     * @static
     * @param $clazz
     * @return Enum[]
     * @throws \Exception
     */
    public static function getEnumValues($clazz) {
        if (!array_key_exists($clazz, self::$lowerCaseHash)) {
            throw new \Exception("The enum class $clazz is not initialized yet.");
        }
        $result = array();
        foreach (self::$lowerCaseHash[$clazz] as $enum) {
            /* @var  $enum Enum */
            $result[$enum->getName()] = $enum;
        }
        return $result;
    }

    /**
     * Checks if the specified class exists.
     * @static
     * @param $clazz
     * @return bool
     */
    public static function isEnum($clazz) {
        return array_key_exists($clazz, self::$lowerCaseHash);
    }
}
