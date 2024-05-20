<?php

require_once("./functions.php");

// Handling preflight request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header("Access-Control-Allow-Methods: PUT, OPTIONS");
    exit(0);
}

try {
    $conn = createConnection();

    if ($conn) {
        // Get assignment ID from URL parameters
        $assignmentId = $_GET['assignmentId'] ?? '';

        // Get assignment data from request payload
        $putData = json_decode(file_get_contents('php://input'), true);
        $model = $putData['model'] ?? '';
        $imei = $putData['imei'] ?? '';
        $serialNumber = $putData['serial_number'] ?? '';
        $comment = $putData['comment'] ?? '';
        $assignedTo = $putData['assignedTo'] ?? '';
        $signatureData = $putData['signatureImage'] ?? ''; // New field for signature data

       

        // Update assignment data in the database using the assignment ID
        $sql = "UPDATE dbo.assignedMobile SET model = ?, imei = ?, serial_number = ?, comment = ?, assignedTo = ?, signature_data = ? WHERE id = ?";
        $params = array(&$model, &$imei, &$serialNumber, &$comment, &$assignedTo, &$signatureData, &$assignmentId);
        $stmt = sqlsrv_prepare($conn, $sql, $params);

        if (!sqlsrv_execute($stmt)) {
            echo json_encode(["error" => "Error updating assignment data.", "details" => sqlsrv_errors()]);
            exit;
        }

        echo json_encode(["success" => "Assignment data updated successfully."]);

    } else {
        echo json_encode(["error" => "Connection could not be established.", "details" => sqlsrv_errors()]);
        exit;
    }

    sqlsrv_close($conn);

} catch (Exception $e) {
    echo json_encode(["error" => "An exception occurred.", "details" => $e->getMessage()]);
}
?>
