<?php
require_once("./functions.php");

// Handling preflight request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    // Respond to preflight request, including Access-Control-Allow-Methods
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
    exit(0);
}

try {
    // Create the database connection
    $conn = createConnection();

    if ($conn) {
        // Collect data from request
        $postData = json_decode(file_get_contents('php://input'), true); // Decode JSON from request body
        $model = $postData['model'] ?? '';
        $imei = $postData['imei'] ?? '';
        $serial_number = $postData['serial_number'] ?? '';
        $comment = $postData['comment'] ?? '';
        $assignedTo = $postData['assignedTo'] ?? '';
        $created_at = $postData['created_at'] ?? '';
        $scrapedDate = $postData['scrapedDate'] ?? '';


        // SQL Query to insert data, including created_at column
        $tsql = "INSERT INTO dbo.scrapedMobile (model, imei, serial_number, comment, created_at, assignedTo, scrapedDate) VALUES (?, ?, ?, ?, ?, ?, ?)";
        $params = array(&$model, &$imei, &$serial_number, &$comment, &$created_at, &$assignedTo, &$scrapedDate);

        
        $stmt = sqlsrv_prepare($conn, $tsql, $params);

        // Execute the query
        if (!sqlsrv_execute($stmt)) {
            echo json_encode(array("error" => "Error in statement execution.", "details" => sqlsrv_errors()));
            exit;
        }

        // If execution is successful
        echo json_encode(array("success" => "User data successfully inserted."));

        // Free the statement resource
        sqlsrv_free_stmt($stmt);

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
