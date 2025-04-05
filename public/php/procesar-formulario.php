<?php
// Permitir solicitudes CORS desde tu dominio de Angular
header("Access-Control-Allow-Origin: https://epd.loopmotion.tech/"); 
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

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
    
    // Configurar el email con diseño mejorado pero manteniendo la estructura que funciona
    $para = "victor@loopmotion.tech"; // Tu correo
    $asunto = "Nueva solicitud de información: $curso";
    
    // Contenido del email con formato HTML mejorado pero manteniendo la simplicidad
    $contenidoHTML = "
    <!DOCTYPE html>
    <html lang='es'>
    <head>
        <meta charset='UTF-8'>
        <title>Nueva solicitud de información</title>
        <style>
            body { 
                font-family: Arial, Helvetica, sans-serif; 
                line-height: 1.6; 
                color: #333; 
                margin: 0;
                padding: 0;
                background-color: #f7f7f7;
            }
            .container { 
                max-width: 600px; 
                margin: 20px auto; 
                background: #fff;
                padding: 25px; 
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header {
                background: linear-gradient(135deg, #3b82f6, #4f46e5);
                color: white;
                padding: 20px;
                text-align: center;
                margin: -25px -25px 20px -25px;
                border-radius: 8px 8px 0 0;
            }
            h2 { 
                color: #3b82f6;
                margin-top: 0;
            }
            .highlight {
                background-color: #f0f7ff;
                border-left: 4px solid #3b82f6;
                padding: 15px;
                margin-bottom: 20px;
                border-radius: 0 8px 8px 0;
            }
            .field { 
                margin-bottom: 15px;
                padding: 10px 15px;
                background: #f9f9f9;
                border-radius: 6px;
            }
            .label { 
                font-weight: bold;
                color: #555;
                display: inline-block;
                min-width: 120px;
            }
            .footer {
                text-align: center;
                margin-top: 30px;
                padding-top: 15px;
                border-top: 1px solid #eee;
                font-size: 13px;
                color: #888;
            }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h2>Nueva solicitud de información</h2>
            </div>
            
            <div class='highlight'>
                <div class='field'>
                    <span class='label'>Curso de interés:</span> 
                    <strong>$curso</strong>
                </div>
            </div>
            
            <div class='field'><span class='label'>Nombre:</span> $nombre</div>
            <div class='field'><span class='label'>Teléfono:</span> $telefono</div>
            <div class='field'><span class='label'>Email:</span> $email</div>
            <div class='field'><span class='label'>Cómo nos conoció:</span> $conocio</div>
            <div class='field'><span class='label'>Mensaje:</span> $mensaje</div>
            
            <div class='footer'>
                <p>Formulario enviado el " . date('d/m/Y \a \l\a\s H:i') . "</p>
                <p>© " . date('Y') . " Escuela Profesional de Dibujo</p>
            </div>
        </div>
    </body>
    </html>
    ";
    
    // Manteniendo las cabeceras simples que funcionan
$cabeceras = "MIME-Version: 1.0\r\n";
$cabeceras .= "Content-type: text/html; charset=UTF-8\r\n";
$cabeceras .= "From: info@epd.edu.mx\r\n";
$cabeceras .= "Reply-To: $email\r\n";
$cabeceras .= "Cc: victor88lm@hotmail.com\r\n";
    
    // Intentar enviar email y registrar resultado
    $send_result = false;
    try {
        $send_result = mail($para, $asunto, $contenidoHTML, $cabeceras);
        log_message($send_result ? "Éxito: Email enviado a $para" : "Error: No se pudo enviar el email");
    } catch (Exception $e) {
        log_message("Error de excepción: " . $e->getMessage());
    }
    
    if ($send_result) {
        // Si el envío fue exitoso, enviar también una confirmación al usuario
        $confirm_subject = "Hemos recibido tu solicitud - Escuela Profesional de Dibujo";
        $confirm_message = "
        <!DOCTYPE html>
        <html lang='es'>
        <head>
            <meta charset='UTF-8'>
            <title>Solicitud Recibida</title>
            <style>
                body { 
                    font-family: Arial, Helvetica, sans-serif; 
                    line-height: 1.6; 
                    color: #333; 
                    margin: 0;
                    padding: 0;
                    background-color: #f7f7f7;
                }
                .container { 
                    max-width: 600px; 
                    margin: 20px auto; 
                    background: #fff;
                    padding: 25px; 
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                .header {
                    background: linear-gradient(135deg, #3b82f6, #4f46e5);
                    color: white;
                    padding: 20px;
                    text-align: center;
                    margin: -25px -25px 20px -25px;
                    border-radius: 8px 8px 0 0;
                }
                h2 { 
                    margin: 0;
                    padding: 0;
                    font-size: 24px;
                }
                .content {
                    padding: 20px 0;
                }
                .footer {
                    text-align: center;
                    margin-top: 30px;
                    padding-top: 15px;
                    border-top: 1px solid #eee;
                    font-size: 13px;
                    color: #888;
                }
                .button {
                    display: inline-block;
                    background: #3b82f6;
                    color: white;
                    padding: 12px 24px;
                    text-decoration: none;
                    border-radius: 4px;
                    margin-top: 20px;
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h2>Solicitud Recibida</h2>
                </div>
                
                <div class='content'>
                    <p>Hola <strong>$nombre</strong>,</p>
                    <p>Hemos recibido tu solicitud de información sobre <strong>$curso</strong>.</p>
                    <p>Uno de nuestros asesores educativos se pondrá en contacto contigo a la brevedad para brindarte toda la información que necesitas.</p>
                    <p>Gracias por tu interés en nuestros programas educativos.</p>
                    <div style='text-align: center;'>
                        <a href='https://epd.loopmotion.tech' class='button'>Visitar nuestro sitio web</a>
                    </div>
                </div>
                
                <div class='footer'>
                    <p>© " . date('Y') . " Escuela Profesional de Dibujo</p>
                    <p>Este es un mensaje automático, por favor no respondas a este correo.</p>
                </div>
            </div>
        </body>
        </html>
        ";
        
        // Usar las mismas cabeceras simples para el mensaje de confirmación
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