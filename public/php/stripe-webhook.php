<?php
// Configuración inicial
require_once('stripe-php/init.php');

// Clave secreta de Stripe
$stripeSecretKey = 'sk_test_51RByiNPHx1YvSlrK42TVxzt7DEvEV9RR0ti20RA1fsu02qsNps7SZNhMxyiMcgigpdrHO69Ed9UAZK7c6nRBKweV00OeQwGqbo';
\Stripe\Stripe::setApiKey($stripeSecretKey);

// Clave secreta para webhooks
$endpointSecret = 'whsec_F4dztgXX9iIWq9lgQvmMvR6mxqJqtkN4';

// Obtener el payload y la firma
$payload = @file_get_contents('php://input');
$sigHeader = $_SERVER['HTTP_STRIPE_SIGNATURE'];

try {
    // Verificar la firma del webhook
    $event = \Stripe\Webhook::constructEvent(
        $payload, $sigHeader, $endpointSecret
    );
    
    // Manejar el evento específico de pago completado
    if ($event->type == 'checkout.session.completed') {
        $session = $event->data->object;
        
        // Guardar información del evento para depuración
        file_put_contents('stripe_webhook_log.txt', date('Y-m-d H:i:s') . " - Procesando pago completado: " . $session->id . "\n", FILE_APPEND);
        
        try {
            // Obtener información desde la sesión
            $monto = $session->amount_total / 100; // Dividimos por 100 para convertir de centavos
            $moneda = strtoupper($session->currency);
            $email_cliente = $session->customer_details->email;
            $nombre_cliente = $session->customer_details->name;
            $cliente_id = $session->client_reference_id;
            
            // Obtener tipo y ID desde metadata
            $tipo = isset($session->metadata->producto_tipo) ? $session->metadata->producto_tipo : "desconocido";
            $id = isset($session->metadata->producto_id) ? $session->metadata->producto_id : "0";
            
            // Buscar nombre del producto/curso basado en ID
            $producto_nombre = "Inscripción";
            
            // Datos para guardar
            $datos_pago = [
                'session_id' => $session->id,
                'email_cliente' => $email_cliente,
                'nombre_cliente' => $nombre_cliente,
                'monto' => $monto,
                'moneda' => $moneda,
                'tipo' => $tipo,
                'producto_id' => $id,
                'producto_nombre' => $producto_nombre,
                'fecha_pago' => date('Y-m-d H:i:s'),
                'payment_intent' => $session->payment_intent
            ];
            
            // Guardar información en nuestro sistema
            // Reemplaza con la URL real donde esté tu store-payment.php
            $ch = curl_init('https://epd.edu.mx/Pagina_Principal/Cursos/store-payment.php');
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($datos_pago));
            curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
            $response = curl_exec($ch);
            curl_close($ch);
            
            // Registrar información de client_reference_id
            if ($cliente_id && strpos($cliente_id, '_') !== false) {
                list($tipo, $id) = explode('_', $cliente_id);
                file_put_contents('stripe_webhook_log.txt', date('Y-m-d H:i:s') . " - Tipo: $tipo, ID: $id\n", FILE_APPEND);
            } else {
                file_put_contents('stripe_webhook_log.txt', date('Y-m-d H:i:s') . " - No se pudo obtener tipo e ID de: $cliente_id\n", FILE_APPEND);
            }
            
            // Enviar correo al cliente
            $cliente_email_enviado = enviar_correo_cliente($email_cliente, $producto_nombre, $monto, $moneda);
            file_put_contents('stripe_webhook_log.txt', date('Y-m-d H:i:s') . " - Correo cliente enviado: " . ($cliente_email_enviado ? "Sí" : "No") . "\n", FILE_APPEND);
            
            // Enviar correo a administradores
            $admin_email_enviado = enviar_correo_admin($email_cliente, $producto_nombre, $monto, $moneda, $tipo, $id);
            file_put_contents('stripe_webhook_log.txt', date('Y-m-d H:i:s') . " - Correo admin enviado: " . ($admin_email_enviado ? "Sí" : "No") . "\n", FILE_APPEND);
            
            // Responder éxito
            http_response_code(200);
            echo json_encode(['success' => true]);
            
        } catch(\Exception $e) {
            // Registrar el error
            file_put_contents('stripe_webhook_log.txt', date('Y-m-d H:i:s') . " - Error en procesamiento: " . $e->getMessage() . "\n", FILE_APPEND);
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    } else {
        // No nos interesa otro tipo de eventos
        file_put_contents('stripe_webhook_log.txt', date('Y-m-d H:i:s') . " - Evento ignorado: " . $event->type . "\n", FILE_APPEND);
        http_response_code(200);
        echo json_encode(['success' => true, 'message' => 'Evento ignorado']);
    }
} catch(\UnexpectedValueException $e) {
    // Error de firma inválida
    file_put_contents('stripe_webhook_log.txt', date('Y-m-d H:i:s') . " - Error UnexpectedValueException: " . $e->getMessage() . "\n", FILE_APPEND);
    http_response_code(400);
    exit();
} catch(\Stripe\Exception\SignatureVerificationException $e) {
    // Error de firma inválida
    file_put_contents('stripe_webhook_log.txt', date('Y-m-d H:i:s') . " - Error SignatureVerificationException: " . $e->getMessage() . "\n", FILE_APPEND);
    http_response_code(400);
    exit();
} catch(\Exception $e) {
    // Error general
    file_put_contents('stripe_webhook_log.txt', date('Y-m-d H:i:s') . " - Error general: " . $e->getMessage() . "\n", FILE_APPEND);
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
    exit();
}

/**
 * Función para enviar correo al cliente (no incluida en tu fragmento, pero referenciada)
 */
function enviar_correo_cliente($email, $producto, $monto, $moneda) {
    require_once 'PHPMailer/src/Exception.php';
    require_once 'PHPMailer/src/PHPMailer.php';
    require_once 'PHPMailer/src/SMTP.php';
    
    $mail = new PHPMailer\PHPMailer\PHPMailer(true);
    
    try {
        // Configuración del servidor con tus datos
        $mail->isSMTP();
        $mail->Host = 'epd.edu.mx';
        $mail->SMTPAuth = true;
        $mail->Username = 'pagos@epd.edu.mx';
        $mail->Password = 'colegiaturasEPD25*';
        $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS; // SSL
        $mail->Port = 465;
        
        // Destinatarios
        $mail->setFrom('pagos@epd.edu.mx', 'Escuela de Arte EPD');
        $mail->addAddress($email);
        
        // Contenido
        $mail->isHTML(true);
        $mail->CharSet = 'UTF-8'; // Para que soporte caracteres españoles
        $mail->Subject = "Confirmación de pago - Escuela de Arte EPD";
        
        $mensaje = "
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #f8f9fa; padding: 20px; text-align: center; }
                .content { padding: 20px; }
                .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h2>¡Gracias por tu inscripción!</h2>
                </div>
                <div class='content'>
                    <p>Estimado(a) estudiante,</p>
                    <p>Hemos recibido tu pago correctamente por <strong>$monto $moneda</strong> para el curso:</p>
                    <p style='font-size: 18px; background-color: #f0f0f0; padding: 10px; text-align: center;'>$producto</p>
                    
                    <p>Detalles importantes:</p>
                    <ul>
                        <li>Conserva este correo como comprobante de pago</li>
                        <li>Próximamente recibirás información sobre el inicio de clases</li>
                        <li>Para cualquier duda, responde a este correo o contáctanos por WhatsApp</li>
                    </ul>
                    
                    <p>¡Estamos emocionados de que formes parte de nuestra comunidad artística!</p>
                </div>
                <div class='footer'>
                    <p>Escuela de Arte EPD - Todos los derechos reservados</p>
                    <p>PLANTEL CENTRO: 55-7987-2332 | PLANTEL ECATEPEC: 55-7321-2343</p>
                </div>
            </div>
        </body>
        </html>";
        
        $mail->Body = $mensaje;
        
        $mail->send();
        
        // Guardar log de éxito
        file_put_contents('correos_log.txt', date('Y-m-d H:i:s') . " - Correo enviado a cliente: $email\n", FILE_APPEND);
        return true;
        
    } catch (Exception $e) {
        // Guardar log de error
        file_put_contents('correos_error_log.txt', date('Y-m-d H:i:s') . " - Error al enviar correo a cliente: {$mail->ErrorInfo}\n", FILE_APPEND);
        return false;
    }
}

/**
 * Función para enviar correo al administrador
 */
function enviar_correo_admin($email_cliente, $producto, $monto, $moneda, $tipo, $id) {
    require_once 'PHPMailer/src/Exception.php';
    require_once 'PHPMailer/src/PHPMailer.php';
    require_once 'PHPMailer/src/SMTP.php';
    
    $mail = new PHPMailer\PHPMailer\PHPMailer(true);
    
    try {
        // Configuración del servidor con tus datos
        $mail->isSMTP();
        $mail->Host = 'epd.edu.mx';
        $mail->SMTPAuth = true;
        $mail->Username = 'pagos@epd.edu.mx';
        $mail->Password = 'colegiaturasEPD25*';
        $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS; // SSL
        $mail->Port = 465;
        
        // Destinatarios
        $mail->setFrom('pagos@epd.edu.mx', 'Sistema de Pagos EPD');
        
        // Agrega los correos de los administradores
        $admin_emails = ['admin@epd.edu.mx', 'pagos@epd.edu.mx']; // Asegúrate de usar correos reales
        foreach ($admin_emails as $admin_email) {
            $mail->addAddress($admin_email);
        }
        
        // Contenido
        $mail->isHTML(true);
        $mail->CharSet = 'UTF-8';
        $mail->Subject = "Nueva inscripción: $producto";
        
        $mensaje = "
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                table { border-collapse: collapse; width: 100%; }
                th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
                th { background-color: #f2f2f2; }
            </style>
        </head>
        <body>
            <h2>¡Nueva inscripción recibida!</h2>
            
            <p>Se ha registrado un nuevo pago con los siguientes detalles:</p>
            
            <table>
                <tr>
                    <th>Detalle</th>
                    <th>Información</th>
                </tr>
                <tr>
                    <td>Producto</td>
                    <td><strong>$producto</strong></td>
                </tr>
                <tr>
                    <td>Monto</td>
                    <td>$monto $moneda</td>
                </tr>
                <tr>
                    <td>Email del cliente</td>
                    <td>$email_cliente</td>
                </tr>
                <tr>
                    <td>Tipo</td>
                    <td>$tipo</td>
                </tr>
                <tr>
                    <td>ID del producto</td>
                    <td>$id</td>
                </tr>
                <tr>
                    <td>Fecha y hora</td>
                    <td>" . date('Y-m-d H:i:s') . "</td>
                </tr>
            </table>
            
            <p>Por favor, contacta al estudiante lo antes posible para darle la bienvenida y proporcionar información adicional.</p>
        </body>
        </html>";
        
        $mail->Body = $mensaje;
        
        $mail->send();
        
        // Guardar log de éxito
        file_put_contents('correos_log.txt', date('Y-m-d H:i:s') . " - Correo enviado a administradores\n", FILE_APPEND);
        return true;
        
    } catch (Exception $e) {
        // Guardar log de error
        file_put_contents('correos_error_log.txt', date('Y-m-d H:i:s') . " - Error al enviar correo a admin: {$mail->ErrorInfo}\n", FILE_APPEND);
        return false;
    }
}