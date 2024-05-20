<?php
require_once("./functions.php");

// Fetch assignedTo from request
$assignedTo = isset($_GET['assignedTo']) ? $_GET['assignedTo'] : null;

if (!$assignedTo) {
    echo json_encode(array("error" => "No assignedTo provided."));
    exit;
}

try {
    // Create the database connection
    $conn = createConnection();

    if ($conn) {
        // SQL Query to fetch mobile assignments by assignedTo
        $tsql = "SELECT id, model, imei, serial_number, comment, created_at, assignedTo,signature_data FROM dbo.assignedMobile WHERE assignedTo = ?";
        $params = array($assignedTo);
        $getResults = sqlsrv_query($conn, $tsql, $params);
        if ($getResults === false) {
            echo json_encode(array("error" => "Error in query execution.", "details" => sqlsrv_errors()));
            exit;
        }

        $assignments = array(); // Initialize array to hold all assignments

        // Loop through each row
        while ($row = sqlsrv_fetch_array($getResults, SQLSRV_FETCH_ASSOC)) {
            // Add each assignment to the array
            $assignments[] = $row;
        }

        // If no assignments found
        if (empty($assignments)) {
            echo json_encode(array("error" => "No assignments found for the provided assignedTo."));
            exit;
        }

        // Assignments found
        echo json_encode(array("success" => true, "assignments" => $assignments));

        // Free the statement resource
        sqlsrv_free_stmt($getResults);
    } else {
        echo json_encode(array("error" => "Connection could not be established.", "details" => sqlsrv_errors()));
        exit;
    }

    // Close the connection
    sqlsrv_close($conn);
} catch (Exception $e) {
    // Error handling
    echo json_encode(array("error" => "An exception occurred.", "details" => $e->getMessage()));
}


?>
