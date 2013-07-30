#!/usr/bin/php
<?php
require_once __DIR__ . '/../vendor/autoload.php';
use Symfony\Component\Console\Application;
use Symfony\Component\Console\Command\Command;


$console = new Application();

// console should not contain any dependencies on project's infrastructure, because of it is invoked before project would be properly deployed (installed).
$cliPath = __DIR__ . '/../src/MetaPlayer/Cli';
$cliNamespace = '\MetePlayer\Cli';
$commandDef = \MetaPlayer\Cli\CommandDefinitionProvider::getInstance();
foreach (scandir($cliPath) as $filename) {
    $path = $cliPath . DIRECTORY_SEPARATOR . $filename;
    if (is_file($path) && strcmp(substr($filename, -4), '.php') == 0) {
        require $path;

        $className = $cliNamespace . '\\' . substr($filename, 0, strlen($filename) - 4);

        if (!class_exists($className)) {
            continue;
        }
        $object = new $className();
        if (!($object instanceof Command)) {
            continue;
        }
        if ($object instanceof \MetaPlayer\Cli\IBean) {
            $commandDef->addCommand($className, $object);
        }
        $console->add($object);
    }
}

$console = new Application();
$console->run();