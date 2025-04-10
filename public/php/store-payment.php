<?php
// Configuración para permitir CORS desde tu aplicación Angular
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS, GET');
header('Access-Control-Allow-Headers: Content-Type');

// Manejar preflight request (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Función para guardar pago
function guardarPago($datos) {
    $archivo = 'pagos_exitosos.json';
    
    // Leer los pagos existentes
    $pagos = [];
    if (file_exists($archivo)) {
        $contenido = file_get_contents($archivo);
        if (!empty($contenido)) {
            $pagos = json_decode($contenido, true);
            if (!is_array($pagos)) $pagos = [];
        }
    }
    
    // Añadir fecha y ID único
    $datos['fecha_registro'] = date('Y-m-d H:i:s');
    $datos['pago_id'] = uniqid();
    
    // Añadir el nuevo pago
    $pagos[] = $datos;
    
    // Guardar todos los pagos
    file_put_contents($archivo, json_encode($pagos, JSON_PRETTY_PRINT));
    
    return $datos['pago_id'];
}

// Si es una solicitud POST (desde webhook)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if (!empty($data)) {
        $pago_id = guardarPago($data);
        echo json_encode(['success' => true, 'pago_id' => $pago_id]);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Datos inválidos']);
    }
}

// Si es una solicitud GET (para obtener detalles de un pago)
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['id'])) {
    $pago_id = $_GET['id'];
    $archivo = 'pagos_exitosos.json';
    
    if (file_exists($archivo)) {
        $pagos = json_decode(file_get_contents($archivo), true);
        
        $pago = null;
        foreach ($pagos as $p) {
            if ($p['pago_id'] === $pago_id) {
                $pago = $p;
                break;
            }
        }
        
        if ($pago) {
            echo json_encode(['success' => true, 'pago' => $pago]);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Pago no encontrado']);
        }
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'No hay registros de pagos']);
    }
}