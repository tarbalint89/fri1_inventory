<?php
require_once("../functions.php");


try {

    $conn = createConnection();


    $data = array();


    // Get the name of the user
    $stmt = checkStmt(
        $conn,
        "SELECT IIF(firstname = lastname, firstname, CONCAT(firstname,' ',lastname)) AS [name] FROM common.dbo.users WHERE id = ?",
        array($_SESSION["user_id"])
    );


    // Fetch the data
    foreach (sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC) as $key => $val) {
        $data[$key] = $val;
    }

    sqlsrv_free_stmt($stmt);

    // Response
    echo json_encode(array("errors" => 0, "session_data" => $data));
} catch (Exception $e) {

    logError($e);

    echo getErrorResponse($e);
} finally {
    sqlsrv_close($conn);
}