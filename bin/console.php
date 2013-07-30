#!/usr/bin/php
<?php
const NO_CONTAINER_OPT = "no-container";

require_once __DIR__ . '/../vendor/autoload.php';
use Ding\Container\Impl\ContainerImpl;
use Symfony\Component\Console\Application;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\ArgvInput;
use Symfony\Component\Console\Input\InputOption;


$console = new Application();
$inputDef = $console->getDefinition();
$input = new ArgvInput(null, $inputDef);

// console application specified options:
$inputDef->addOption(new InputOption(NO_CONTAINER_OPT, null, InputOption::VALUE_NONE, "Disable container usage (only non container commands)."));

// predefined parameters
// console should not contain any dependencies on project's infrastructure, because of it is invoked before project would be properly deployed (installed).
$cliPath = __DIR__ . '/../src/MetaPlayer/Cli/NoContainer';
$cliNamespace = '\MetePlayer\Cli\NoContainer';

if (file_exists($cliPath) && is_dir($cliPath)) {
    foreach (scandir($cliPath) as $filename) {
        $path = $cliPath . DIRECTORY_SEPARATOR . $filename;
        if (is_file($path) && strcmp(substr($filename, -4), '.php') == 0) {
//        require_once $path;

            $className = $cliNamespace . '\\' . substr($filename, 0, strlen($filename) - 4);

            if (!class_exists($className)) {
                continue;
            }

            if (!in_array('\Symfony\Component\Console\Command\Command', class_parents($className))) {
                continue;
            }
            $object = new $className();
            $console->add($object);
        }
    }
}

if (!$input->getOption(NO_CONTAINER_OPT)) {
    require_once __DIR__ . '/../src/bootstrap.php';
    $logger = \Logger::getLogger("console");
    $logger->debug("console bootstrapped");
    $container = ContainerImpl::getInstance();
    /** @var ArrayObject $cli */
    $cli = $container->getBean('cli');
    $logger->debug("cli bean got");
    $console->addCommands($cli->getArrayCopy());
}

$console->run($input);