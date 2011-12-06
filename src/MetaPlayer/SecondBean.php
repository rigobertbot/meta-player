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
 * 
 * @Component(name=secondBean)
 * @Scope(value=singleton) 
 * 
 */
class SecondBean 
{
    public function getValue() {
        return 'value from second bean.';
    }
}