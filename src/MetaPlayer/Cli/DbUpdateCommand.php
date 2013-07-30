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
namespace MetaPlayer\Cli;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Doctrine\ORM\EntityManager;

class DbUpdateCommand extends Command
{
    /**
     * @var EntityManager
     * @Resource
     */
    private $entityManager;

    protected function configure()
    {
        $this->setName('db:update');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        echo "DB updater started\n";
        $connection = $this->entityManager->getConnection();
        $host = $connection->getHost();
        $user = $connection->getUsername();
        $password = $connection->getPassword();
        $database = $connection->getDatabase();

        $scriptPath = PROJECT_ROOT . 'database/updates';

        echo "host: $host", PHP_EOL, "user: $user", PHP_EOL, "database: $database", PHP_EOL;
        echo "connect to db...\n";
        $link = mysql_connect($host, $user, $password);
        mysql_select_db($database, $link);

        echo "create version table\n";
        $this->createVersion($link);

        echo "get actual version\n";
        $result = $this->simpleQuery($link, "select id, applied_script from version");
        $applied = array();

        foreach ($result as $row) {
            $applied[$row['applied_script']] = $row['id'];
        }

        echo "scan dir $scriptPath\n";
        $files = scandir($scriptPath);
        $toApply = array();
        foreach ($files as $file) {
            if (is_dir($file)) {
                echo "$file skipped because it is dir.\n";
                continue;
            }

            if (strrpos($file, ".sql") != strlen($file) - 4) {
                echo "$file skipped because it is not .sql.\n";
                continue;
            }

            if (isset($applied[$file])) {
                echo "Script '$file' already applied.. ignore.'\n";
                continue;
            }

            echo "Script '$file' added to apply\n";
            $toApply[] = $file;
        }

        if (count($toApply) == 0) {
            echo "nothing to play\n";
            mysql_close($link);
            return;
        }

        echo "playing scripts...\n";
        chdir($scriptPath);
        foreach ($toApply as $script) {
            echo "==== $script ====\n";
            $output = array();
            $error = 0;
            exec("mysql -h $host -u $user --password=$password -v $database 2>&1 <$script", $output, $error);
            echo "Result code $error\n";
            $success = $error == 0;
            foreach ($output as $line) {
                if (strpos($line, 'ERROR') === 0) {
                    $success = false;
                }
                echo "$line\n";
            }
            if (!$success) {
                echo "There was an error, process aborted.";
                break;
            }

            $this->simpleQuery($link, "INSERT INTO `version` (applied_script) VALUES ('$script')");
        }

        mysql_close($link);
    }

    private function simpleQuery($link, $sql) {
        $query = mysql_query($sql, $link);
        if ($query === true) {
            return array();
        } else if ($query === false) {
            throw new \Exception(mysql_error($link), mysql_errno($link));
        }
        $result = array();

        while (($row = mysql_fetch_array($query)) != false) {
            $result[] = $row;
        }

        mysql_free_result($query);
        return $result;
    }

    private function createVersion($link) {
        $this->simpleQuery($link, "CREATE TABLE IF NOT EXISTS `version` (`id` INT AUTO_INCREMENT PRIMARY KEY, `applied_script` VARCHAR(127) UNIQUE)");
    }
}
