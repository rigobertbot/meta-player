<?php
namespace MetaPlayer\Cli;

use Ding\Bean\IBeanDefinitionProvider;
use Ding\Bean\BeanDefinition;
use Ding\Container\Impl\ContainerImpl;
use Symfony\Component\Console\Command\Command;

class CommandDefinitionProvider implements IBeanDefinitionProvider
{
    /**
     * @var array
     */
    private $commands;
    /** @var bool */
    private $registered = false;

    private static $instance = null;

    public static function getInstance()
    {
        if (self::$instance === null) {
            self::$instance = new CommandDefinitionProvider();
        }
        return self::$instance;
    }

    public function register()
    {
        if ($this->registered) {
            return;
        }
        $container = ContainerImpl::getInstance();
        $container->registerBeanDefinitionProvider($this);
        $this->registered = true;
    }

    /**
     * Returns a bean definition with the given name.
     *
     * @param string $name Name of the bean.
     *
     * @return \Ding\Bean\BeanDefinition
     */
    public function getBeanDefinition($name)
    {
        if ($name === __CLASS__) {
            return $this;
        }

        if (!isset($this->commands[$name])) {
            return null;
        }

        $def = new BeanDefinition($name);
        $def->setClass($name);
        $def->setFactoryBean(__CLASS__);
        $def->setFactoryMethod('getCommand');
        $def->setArguments(array($name));

        return $def;
    }

    public function getCommand($name)
    {
        return isset($this->commands[$name]) ? $this->commands[$name] : null;
    }

    public function addCommand($name, Command $instance)
    {
        $this->commands[$name] = $instance;
    }

    /**
     * Returns all bean names that match a given class
     *
     * @param string $class Class to look for.
     *
     * @return string[]
     */
    public function getBeansByClass($class)
    {
        if (!isset($this->commands[$class])) {
            return array();
        }
        return array($class);
    }

    /**
     * Returns all names of the beans listening for the given event.
     *
     * @param string $eventName The event name.
     *
     * @return string[]
     */
    public function getBeansListeningOn($eventName)
    {
        return array();
    }
}
