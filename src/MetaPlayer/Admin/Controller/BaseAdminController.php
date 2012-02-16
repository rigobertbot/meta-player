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

namespace MetaPlayer\Admin\Controller;

use MetaPlayer\Controller\BaseSecurityController;

/**
 * Description of BaseAdminController
 *
 * @author Val Dubrava <valery.dubrava@gmail.com>
 * @PreDispatchMethod(method=preDispatch)
 */
abstract class BaseAdminController extends BaseSecurityController
{
    public function preDispatch() {
        parent::preDispatch();
        if (!$this->securityManager->isAdmin()) {
            throw new \Exception("This section is only for administrators.");
        }
    }
}
