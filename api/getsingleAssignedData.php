<?php
require_once("./functions.php");


// Handling preflight request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header("Access-Control-Allow-Methods: GET, OPTIONS");
    exit(0);
}

try {
    $conn = createConnection();

    if ($conn) {
        // Get assignment ID from URL parameters
        $assignmentId = $_GET['assignmentId'] ?? '';

        // Retrieve assignment data from the database using the assignment ID
        $sql = "SELECT * FROM dbo.assignedMobile WHERE id = ?";
        $params = array(&$assignmentId);
        $stmt = sqlsrv_query($conn, $sql, $params);

        if ($stmt === false) {
            echo json_encode(["error" => "Error fetching assignment data.", "details" => sqlsrv_errors()]);
            exit;
        }

        $assignmentData = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC);

        if ($assignmentData) {
            echo json_encode($assignmentData);
        } else {
            echo json_encode(["error" => "Assignment not found."]);
        }

    } else {
        echo json_encode(["error" => "Connection could not be established.", "details" => sqlsrv_errors()]);
        exit;
    }

    sqlsrv_close($conn);

} catch (Exception $e) {
    echo json_encode(["error" => "An exception occurred.", "details" => $e->getMessage()]);
}
?>
