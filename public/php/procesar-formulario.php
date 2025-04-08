<?php
// Permitir solicitudes CORS desde tu dominio de Angular
header("Access-Control-Allow-Origin: https://epd.loopmotion.tech/"); 
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// URL del logo de la institución (reemplaza con la URL real de tu logo)
$LOGO_URL = "https://epd.loopmotion.tech/img/Logo.png";

// Función de logging básica pero efectiva
function log_message($message) {
    $log_file = 'form_log.txt';
    $date = date('Y-m-d H:i:s');
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $log_message = "[$date] [$ip] $message\n";
    file_put_contents($log_file, $log_message, FILE_APPEND);
}

log_message("Solicitud recibida");

// Para solicitudes OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Verificar que sea una solicitud POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Recibir datos JSON
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);
    
    if (!$data) {
        // Intentar obtener datos de POST normal
        $data = $_POST;
    }
    
    // Validar que existan los campos requeridos
    if (empty($data['nombre']) || empty($data['telefono']) || empty($data['email']) || empty($data['curso'])) {
        log_message("Error: Faltan campos obligatorios");
        echo json_encode([
            "status" => "error", 
            "message" => "Por favor completa todos los campos requeridos"
        ]);
        exit;
    }
    
    // Sanitizar datos de entrada para mayor seguridad
    $nombre = htmlspecialchars(trim($data['nombre']));
    $telefono = preg_replace('/[^0-9]/', '', $data['telefono']); // Solo números
    $email = filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL);
    $curso = htmlspecialchars(trim($data['curso']));
    $conocio = isset($data['conocio']) ? htmlspecialchars(trim($data['conocio'])) : 'No especificado';
    $mensaje = isset($data['mensaje']) ? htmlspecialchars(trim($data['mensaje'])) : 'Sin mensaje';
    
    // Validación adicional
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        log_message("Error: Email no válido: $email");
        echo json_encode([
            "status" => "error", 
            "message" => "Por favor ingresa un correo electrónico válido"
        ]);
        exit;
    }
    
    if (strlen($telefono) < 10) {
        log_message("Error: Teléfono incompleto: $telefono");
        echo json_encode([
            "status" => "error", 
            "message" => "Por favor ingresa un número de teléfono válido de 10 dígitos"
        ]);
        exit;
    }
    
    // Configurar el email con diseño mejorado y elegante
    $para = "info@epd.edu.mx";
    $asunto = "Nueva solicitud de información: $curso";
    
    // Contenido del email con diseño HTML más sofisticado
    $contenidoHTML = "
    <!DOCTYPE html>
    <html lang='es'>
    <head>
        <meta charset='UTF-8'>
        <title>Nueva solicitud de información</title>
        <link href='https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap' rel='stylesheet'>
        <style>
            body {
                font-family: 'Poppins', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: #f4f7f6;
                margin: 0;
                padding: 0;
            }
            .email-container {
                max-width: 700px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 15px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                overflow: hidden;
            }
            .email-header {
                background: #0055A4; /* Deep blue background */
                color: white;
                text-align: center;
                padding: 30px 20px;
                position: relative;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            }
            .email-header img {
                max-height: 80px;
                max-width: 250px;
                margin-bottom: 15px;
                filter: brightness(0) invert(1); /* Ensures white logo on blue background */
                object-fit: contain;
            }
            .email-header h1 {
                color: white;
                margin-top: 10px;
                font-size: 22px;
            }
            .email-header h1 {
                margin: 0;
                font-size: 24px;
                font-weight: 600;
            }
            .email-body {
                padding: 30px;
                background-color: #ffffff;
            }
            .info-section {
                background-color: #f9f9f9;
                border-left: 5px solid #3498db;
                padding: 15px;
                margin-bottom: 20px;
                border-radius: 0 5px 5px 0;
            }
            .info-row {
                display: flex;
                margin-bottom: 15px;
                background-color: #f1f4f6;
                border-radius: 8px;
                padding: 12px;
            }
            .info-label {
                font-weight: 600;
                color: #2c3e50;
                min-width: 180px;
                flex-shrink: 0;
            }
            .info-value {
                color: #34495e;
                flex-grow: 1;
            }
            .email-footer {
                background-color: #f1f4f6;
                text-align: center;
                padding: 20px;
                font-size: 14px;
                color: #7f8c8d;
                border-top: 1px solid #e0e6e9;
            }
            .footer-logo {
                max-height: 40px;
                margin-bottom: 10px;
            }
        </style>
    </head>
    <body>
        <div class='email-container'>
            <div class='email-header'>
                <img src='{$LOGO_URL}' alt='Logo EPD'>
                <h1>Nueva Solicitud de Información</h1>
            </div>
            
            <div class='email-body'>
                <div class='info-section'>
                    <div class='info-row'>
                        <div class='info-label'>Curso de Interés:</div>
                        <div class='info-value'><strong>$curso</strong></div>
                    </div>
                </div>
                
                <div class='info-row'>
                    <div class='info-label'>Nombre Completo:</div>
                    <div class='info-value'>$nombre</div>
                </div>
                
                <div class='info-row'>
                    <div class='info-label'>Teléfono:</div>
                    <div class='info-value'>$telefono</div>
                </div>
                
                <div class='info-row'>
                    <div class='info-label'>Correo Electrónico:</div>
                    <div class='info-value'>$email</div>
                </div>
                
                <div class='info-row'>
                    <div class='info-label'>Cómo nos Conoció:</div>
                    <div class='info-value'>$conocio</div>
                </div>
                
                <div class='info-row'>
                    <div class='info-label'>Mensaje Adicional:</div>
                    <div class='info-value'>$mensaje</div>
                </div>
            </div>
            
            <div class='email-footer'>
                <img src='{$LOGO_URL}' alt='Logo EPD' class='footer-logo'>
                <p>Solicitud recibida el " . date('d/m/Y \a \l\a\s H:i') . "</p>
                <p>© " . date('Y') . " Escuela Profesional de Dibujo | Todos los derechos reservados</p>
            </div>
        </div>
    </body>
    </html>
    ";
    
    // Configuración de confirmación con diseño similar
    $confirm_subject = "Solicitud Recibida - Escuela Profesional de Dibujo";
    $confirm_message = "
    <!DOCTYPE html>
    <html lang='es'>
    <head>
        <meta charset='UTF-8'>
        <title>Solicitud Recibida</title>
        <link href='https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap' rel='stylesheet'>
        <style>
            body {
                font-family: 'Poppins', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: #f4f7f6;
                margin: 0;
                padding: 0;
            }
            .email-container {
                max-width: 700px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 15px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                overflow: hidden;
            }
            .email-header {
                background: #0055A4; /* Deep blue background */
                color: white;
                text-align: center;
                padding: 30px 20px;
                position: relative;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            }
            .email-header img {
                max-height: 80px;
                max-width: 250px;
                margin-bottom: 15px;
                filter: brightness(0) invert(1); /* Ensures white logo on blue background */
                object-fit: contain;
            }
            .email-header h1 {
                margin: 0;
                font-size: 24px;
                font-weight: 600;
                color: white;
            }
            .email-body {
                padding: 30px;
                text-align: center;
                background-color: #ffffff;
            }
            .cta-button {
                display: inline-block;
                background: linear-gradient(135deg, #3498db, #2980b9);
                color: white;
                text-decoration: none;
                padding: 12px 25px;
                border-radius: 8px;
                font-weight: 600;
                margin-top: 20px;
                transition: transform 0.2s, box-shadow 0.2s;
            }
            .cta-button:hover {
                transform: translateY(-3px);
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            }
            .email-footer {
                background-color: #f1f4f6;
                text-align: center;
                padding: 20px;
                font-size: 14px;
                color: #7f8c8d;
                border-top: 1px solid #e0e6e9;
            }
            .footer-logo {
                max-height: 40px;
                margin-bottom: 10px;
            }
        </style>
    </head>
    <body>
        <div class='email-container'>
            <div class='email-header'>
                <img src='{$LOGO_URL}' alt='Logo EPD'>
            </div>
            
            <div class='email-body'>
                <p>Hola <strong>$nombre</strong>,</p>
                <p>Hemos recibido tu solicitud de información sobre <strong>$curso</strong>.</p>
                <p>Uno de nuestros asesores educativos se pondrá en contacto contigo a la brevedad para brindarte toda la información que necesitas.</p>
                <p>Gracias por tu interés en nuestros programas educativos.</p>
                
                <a href='https://epd.edu.mx' class='cta-button'>Visitar Sitio Web</a>
            </div>
            
            <div class='email-footer'>
                <img src='{$LOGO_URL}' alt='Logo EPD' class='footer-logo'>
                <p>© " . date('Y') . " Escuela Profesional de Dibujo</p>
                <p>Este es un mensaje automático, por favor no respondas a este correo.</p>
            </div>
        </div>
    </body>
    </html>
    ";
    
    // Manteniendo las cabeceras simples que funcionan
    $cabeceras = "MIME-Version: 1.0\r\n";
    $cabeceras .= "Content-type: text/html; charset=UTF-8\r\n";
    $cabeceras .= "From: Escuela Profesional de Dibujo <info@epd.edu.mx>\r\n";
    $cabeceras .= "Reply-To: $email\r\n";
    
    // Intentar enviar email y registrar resultado
    $send_result = false;
    try {
        $send_result = mail($para, $asunto, $contenidoHTML, $cabeceras);
        log_message($send_result ? "Éxito: Email enviado a $para" : "Error: No se pudo enviar el email");
    } catch (Exception $e) {
        log_message("Error de excepción: " . $e->getMessage());
    }
    
    if ($send_result) {
        // Cabeceras para el correo de confirmación
        $confirm_headers = "MIME-Version: 1.0\r\n";
        $confirm_headers .= "Content-type: text/html; charset=UTF-8\r\n";
        $confirm_headers .= "From: Escuela Profesional de Dibujo <informes@epd.edu.mx>\r\n";
        
        // Intentar enviar confirmación
        try {
            mail($email, $confirm_subject, $confirm_message, $confirm_headers);
            log_message("Confirmación enviada a $email");
        } catch (Exception $e) {
            log_message("Error al enviar confirmación: " . $e->getMessage());
        }
        
        echo json_encode([
            "status" => "success", 
            "message" => "¡Gracias! Tu solicitud ha sido enviada correctamente. Te contactaremos pronto."
        ]);
    } else {
        echo json_encode([
            "status" => "error", 
            "message" => "Hubo un problema al procesar tu solicitud. Por favor, inténtalo nuevamente o contáctanos directamente por teléfono."
        ]);
    }
} else {
    log_message("Método no permitido: " . $_SERVER["REQUEST_METHOD"]);
    echo json_encode([
        "status" => "error", 
        "message" => "Método no permitido"
    ]);
}
?>