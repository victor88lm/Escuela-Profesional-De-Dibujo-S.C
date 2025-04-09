<?php
// Configuración para permitir CORS desde tu aplicación Angular
header('Access-Control-Allow-Origin: *'); // Reemplaza * con el origen específico de tu app en producción
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Manejar preflight request (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Asegurarse de que la solicitud sea POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit();
}

// Obtener datos JSON de la solicitud
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Validar los datos recibidos
if (!isset($data['amount']) || !isset($data['currency']) || !isset($data['name'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Datos incompletos']);
    exit();
}

// Cargar la biblioteca de Stripe (descargada manualmente)
require_once('stripe-php/init.php');

// Configurar la clave secreta de Stripe
$stripeSecretKey = 'sk_test_51RByiNPHx1YvSlrK42TVxzt7DEvEV9RR0ti20RA1fsu02qsNps7SZNhMxyiMcgigpdrHO69Ed9UAZK7c6nRBKweV00OeQwGqbo'; // Reemplaza con tu clave secreta de Stripe
\Stripe\Stripe::setApiKey($stripeSecretKey);

// Configurar URLs de redirección
$successUrl = isset($data['success_url']) ? $data['success_url'] : 'https://epd.loopmotion.tech/success';
$cancelUrl = isset($data['cancel_url']) ? $data['cancel_url'] : 'https://epd.loopmotion.tech/cancel';

try {
    // Crear la sesión de Checkout
    $checkout_session = \Stripe\Checkout\Session::create([
        'payment_method_types' => ['card'],
        'line_items' => [[
            'price_data' => [
                'currency' => $data['currency'],
                'unit_amount' => $data['amount'] * 100, // Convertir a centavos
                'product_data' => [
                    'name' => $data['name'],
                    'description' => isset($data['description']) ? $data['description'] : '',
                ],
            ],
            'quantity' => 1,
        ]],
        'mode' => 'payment',
        'success_url' => $successUrl,
        'cancel_url' => $cancelUrl,
        'client_reference_id' => isset($data['client_reference_id']) ? $data['client_reference_id'] : null,
        'customer_email' => isset($data['customer_email']) ? $data['customer_email'] : null,
    ]);

    // Opcional: Registrar información de la sesión para seguimiento
    $logMessage = date('Y-m-d H:i:s') . " - Nueva sesión creada: " . $checkout_session->id . "\n";
    file_put_contents('stripe_logs.txt', $logMessage, FILE_APPEND);

    // Devolver el ID de la sesión
    echo json_encode(['id' => $checkout_session->id]);
} catch (\Stripe\Exception\ApiErrorException $e) {
    http_response_code(400);
    echo json_encode(['error' => $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error del servidor: ' . $e->getMessage()]);
}