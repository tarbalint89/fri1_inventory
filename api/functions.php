<?php
require_once __DIR__ . "/vendor/autoload.php";

if(!getenv("DB_HOST")){
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
    $dotenv->load();
}


function createConnection($dbHost = null, $dbUser = null, $dbPwd = null)
{
    $dbHost = getenv("DB_HOST") ?: $_ENV["DB_HOST"] ?: null;
    $dbUser = getenv("DB_USER") ?: $_ENV["DB_USER"] ?: null;
    $dbPwd = getenv("DB_PWD") ?: $_ENV["DB_PWD"] ?: null;

    $connInfo = array("UID" => $dbUser, "PWD" => $dbPwd,"Database" => "fri1_inventory","CharacterSet" => "UTF-8");

    $conn = sqlsrv_connect($dbHost, $connInfo);

    if (!$conn) throw new Exception(sqlsrv_errors()[0]["message"], sqlsrv_errors()[0]["code"]);

    return $conn;
}


function createItacConnection(){
    $conn = oci_connect("tran", "tran_pwd", "(DESCRIPTION =
        (ADDRESS_LIST =
        (ADDRESS = (PROTOCOL = TCP)(HOST = defri-vITACDB01.peiker.local)(PORT = 1521))
        )
        (CONNECT_DATA =
        (SERVER = DEDICATED)
        (SERVICE_NAME = itacdb)
        ))"
    );

    if (!$conn) throw new Exception(oci_error()["message"], oci_error()["code"]); 
        
    return $conn;
}


function getLastInsertId($conn, $table)
{
    $sql = "SELECT IDENT_CURRENT('" . $table . "')";
    $stmt = checkStmt($conn, $sql);

    $id = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_NUMERIC)[0];


    // Free up the statement
    sqlsrv_free_stmt($stmt);


    // Return the ID
    return $id;
}


function checkStmt($conn, $query, $params = array())
{
    $stmt = sqlsrv_prepare($conn, $query, $params);

    if (!$stmt) {
        $backtrace = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1);
        $caller = array_shift($backtrace);
        $errorDetails = [
            'file' => $caller['file'],
            'line' => $caller['line'],
            'message' => sqlsrv_errors()[0]["message"],
            'code' => sqlsrv_errors()[0]["code"]
        ];
        throw new Exception(json_encode($errorDetails));
    }

    if (!sqlsrv_execute($stmt)) {
        $backtrace = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1);
        $caller = array_shift($backtrace);
        $errorDetails = [
            'file' => $caller['file'],
            'line' => $caller['line'],
            'message' => sqlsrv_errors()[0]["message"],
            'code' => sqlsrv_errors()[0]["code"]
        ];
        throw new Exception(json_encode($errorDetails));
    }

    return $stmt;
}


function checkStmtOci($conn, $query)
{
    $stmt = oci_parse($conn, $query);
    oci_execute($stmt);

    if (!$stmt) {
        $backtrace = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1);
        $caller = array_shift($backtrace);
        $errorDetails = [
            'file' => $caller['file'],
            'line' => $caller['line'],
            'message' => oci_error()["message"],
            'code' => oci_error()["code"]
        ];
        throw new Exception(json_encode($errorDetails));
    }

    return $stmt;
}


function logError($e)
{
    // Get the error message
    $errorDetails = json_decode($e->getMessage(), true);

    // Log the errors
    if ($errorDetails) {
        error_log("[" . $errorDetails["code"] . "]: " . $errorDetails["message"] . " in " . $errorDetails["file"] . " on line " . $errorDetails["line"]);
    } else {
        // Fallback in case of an unexpected exception format
        error_log("[" . $e->getCode() . "]: " . $e->getMessage() . " in " . $e->getFile() . " on line " . $e->getLine());
    }
}


function getErrorResponse($e)
{
    $isDev = isset($_ENV["DEV"]) && $_ENV["DEV"] == "true";

    switch($e->getCode()){
        case 2601: 
            $response = array("errors" => 2);
            break;
        default:
            $response = array("errors" => 1);
            break;
    }


    if ($isDev) {
        $response["reason"] = sqlsrv_errors() ? sqlsrv_errors() : $e->getMessage();
    }

    return json_encode($response);
}