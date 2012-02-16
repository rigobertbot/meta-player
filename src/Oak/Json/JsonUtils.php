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

namespace Oak\Json;

/**
 * Description of JsonUtil
 *
 * @author Val Dubrava <valery.dubrava@gmail.com>
 */
class JsonUtils implements ISerializer{
    private static $classNameNotice = "className";
    
    /**
     * Class mappings: extenral system class name => full qualified PHP class name
     * @var array
     */
    private $classMapping = array();
    
    private $classMappingFlipped = array();
    
    /**
     * Flag means if using class mappings.
     * !!! Strongly recomended use mappings, because external system may send any class name.
     * It may causes to case when custom code form __wakeup will be executed.
     *
     * @var bool
     */
    private $useMapping = true;


    public function getClassMapping() {
        return $this->classMapping;
    }

    public function setClassMapping($classMapping) {
        $this->classMapping = $classMapping;
        $this->classMappingFlipped = array_flip($classMapping);
    }

    /**
     * @param string $json
     * @return mixed
     */
    public function deserialize($json) {
        $result = json_decode($json, true);
        return $this->recurseParce($result);
    }

    /**
     * @param object|array $object
     * @return string
     */
    public function serialize($object) {
        if (!is_array($object) && !is_object($object)) {
            throw new JsonUtilsException("object shuld be array or object.");
        }
        $traversed = array();
        $this->recurseMark($object, $traversed);

        return json_encode($object);
    }
    
    private static function newInstance($clazz) {
        return unserialize(sprintf('O:%d:"%s":0:{}', strlen($clazz), $clazz));
    }
    
    private function recurseMark($object, array $traversed) {
        if (is_object($object)) {
            $hash = spl_object_hash($object);
            if (array_key_exists($hash, $traversed)) {
                return;
            }
            $className = get_class($object);
            $traversed[$hash] = $className;
            if (!array_key_exists($className, $this->classMappingFlipped)) {
                throw new JsonUtilsException("There is no mapping (php->json) for class $className.");
            }
            $jsonClassName = $this->classMappingFlipped[$className];
            $object->{self::$classNameNotice} = $jsonClassName;
        }
        
        $values = is_object($object) ? get_object_vars($object) : $object;
        
        foreach ($values as $value) {
            if (is_object($value) || is_array($value)) {
                $this->recurseMark($value, $traversed);
            }
        }
    }
    
    private function getInstance($jsonClassName) {
        if ($this->useMapping && !array_key_exists($jsonClassName, $this->classMapping)) {
            throw new JsonUtilsException("There is no mapping (json->php) for class $jsonClassName.");
        }
        
        $clazz = $this->useMapping ? 
            $clazz = $this->classMapping[$jsonClassName] :
            $clazz = $jsonClassName;

        return self::newInstance($clazz);
    }

    private function recurseParce(array $data) {
        $result = $data;
        if (array_key_exists(self::$classNameNotice, $result)) {
            $jsonClassName = $result[self::$classNameNotice];
            $result = $this->getInstance($jsonClassName);
            unset($data[self::$classNameNotice]);
        }
        foreach ($data as $key => $value) {
            if (is_array($value)) {
                $value = $this->recurseParce($value);
            }
            if (is_array($result)) {
                $result[$key] = $value;
            } else {
                $result->{$key} = $value;
            }
        }
        return $result;
    }
}
