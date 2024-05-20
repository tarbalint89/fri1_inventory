<?php
// Allow requests from any origin - adjust in production!

require_once("./functions.php");



// Connect using SQL Server Authentication.
try {
$conn = createConnection();


// SQL query to select data grouped by model and condition
$sql = "SELECT model, 
               SUM(CASE WHEN condition = 'New' THEN totalQuantities ELSE 0 END) AS newQuantities, 
               SUM(CASE WHEN condition = 'Used' THEN totalQuantities ELSE 0 END) AS usedQuantities 
        FROM dbo.mobileQuantities 
        GROUP BY model";

$stmt = sqlsrv_query($conn, $sql);

if ($stmt === false) {
    die(print_r(sqlsrv_errors(), true));
}

$mobileQuantities = [];

while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
    $mobileQuantities[] = [
        'model' => $row["model"],
        'quantities' => [
            'New' => $row["newQuantities"],
            'Used' => $row["usedQuantities"]
        ]
    ];
}

if (count($mobileQuantities) > 0) {
    // Output data as JSON
    echo json_encode($mobileQuantities);
} else {
    echo json_encode(['message' => 'No mobile quantities found']);
}

// Close the connection
sqlsrv_close($conn);
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
