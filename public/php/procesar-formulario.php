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
    $para = "info@epd.edu.mx";
    $asunto = "Nueva solicitud de información: $curso";
    
    // Contenido del email con formato HTML mejorado y elegante
    $contenidoHTML = "
    <!DOCTYPE html>
    <html lang='es'>
    <head>
        <meta charset='UTF-8'>
        <title>Nueva solicitud de información</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap');
            body { 
                font-family: 'Inter', Arial, sans-serif; 
                line-height: 1.6; 
                color: #333; 
                margin: 0;
                padding: 0;
                background-color: #f4f6f9;
            }
            .container { 
                max-width: 650px; 
                margin: 20px auto; 
                background: white;
                border-radius: 12px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                overflow: hidden;
            }
            .header {
                background: linear-gradient(135deg, #4F46E5, #6366F1);
                color: white;
                padding: 25px;
                text-align: center;
            }
            .header h2 {
                margin: 0;
                font-weight: 600;
                font-size: 24px;
            }
            .content {
                padding: 30px;
            }
            .section {
                background-color: #f9fafb;
                border-left: 4px solid #4F46E5;
                padding: 15px;
                margin-bottom: 20px;
                border-radius: 0 6px 6px 0;
            }
            .field {
                display: flex;
                margin-bottom: 15px;
                background-color: #f1f3f5;
                border-radius: 8px;
                padding: 12px;
            }
            .field-label {
                font-weight: 600;
                color: #374151;
                min-width: 150px;
                display: inline-block;
            }
            .field-value {
                color: #111827;
                flex-grow: 1;
            }
            .footer {
                background-color: #f9fafb;
                text-align: center;
                padding: 20px;
                border-top: 1px solid #e5e7eb;
                font-size: 13px;
                color: #6b7280;
            }
            .logo {
                max-width: 150px;
                margin-bottom: 15px;
            }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h2>🎨 Nueva Solicitud de Información</h2>
            </div>
            
            <div class='content'>
                <div class='section'>
                    <div class='field'>
                        <span class='field-label'>Curso de Interés:</span>
                        <span class='field-value'><strong>$curso</strong></span>
                    </div>
                </div>
                
                <div class='field'>
                    <span class='field-label'>Nombre Completo:</span>
                    <span class='field-value'>$nombre</span>
                </div>
                
                <div class='field'>
                    <span class='field-label'>Teléfono:</span>
                    <span class='field-value'>$telefono</span>
                </div>
                
                <div class='field'>
                    <span class='field-label'>Correo Electrónico:</span>
                    <span class='field-value'>$email</span>
                </div>
                
                <div class='field'>
                    <span class='field-label'>Cómo nos Conoció:</span>
                    <span class='field-value'>$conocio</span>
                </div>
                
                <div class='field'>
                    <span class='field-label'>Mensaje Adicional:</span>
                    <span class='field-value'>$mensaje</span>
                </div>
            </div>
            
            <div class='footer'>
                <p>Solicitud recibida el " . date('d/m/Y \a \l\a\s H:i') . "</p>
                <p>© " . date('Y') . " Escuela Profesional de Dibujo | Todos los derechos reservados</p>
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
        // Mensaje de confirmación para el usuario con diseño actualizado
        $confirm_subject = "Solicitud Recibida - Escuela Profesional de Dibujo";
        $confirm_message = "
        <!DOCTYPE html>
        <html lang='es'>
        <head>
            <meta charset='UTF-8'>
            <title>Solicitud Recibida</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap');
                body { 
                    font-family: 'Inter', Arial, sans-serif; 
                    line-height: 1.6; 
                    color: #333; 
                    margin: 0;
                    padding: 0;
                    background-color: #f4f6f9;
                }
                .container { 
                    max-width: 650px; 
                    margin: 20px auto; 
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                    overflow: hidden;
                }
                .header {
                    background: linear-gradient(135deg, #4F46E5, #6366F1);
                    color: white;
                    padding: 25px;
                    text-align: center;
                }
                .header h2 {
                    margin: 0;
                    font-weight: 600;
                    font-size: 24px;
                }
                .content {
                    padding: 30px;
                    text-align: center;
                }
                .button {
                    display: inline-block;
                    background: linear-gradient(135deg, #4F46E5, #6366F1);
                    color: white;
                    text-decoration: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-weight: 600;
                    margin-top: 20px;
                    transition: transform 0.2s;
                }
                .button:hover {
                    transform: scale(1.05);
                }
                .footer {
                    background-color: #f9fafb;
                    text-align: center;
                    padding: 20px;
                    border-top: 1px solid #e5e7eb;
                    font-size: 13px;
                    color: #6b7280;
                }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h2>✉️ Solicitud Recibida</h2>
                </div>
                
                <div class='content'>
                    <p>Hola <strong>$nombre</strong>,</p>
                    <p>Hemos recibido tu solicitud de información sobre <strong>$curso</strong>.</p>
                    <p>Uno de nuestros asesores educativos se pondrá en contacto contigo a la brevedad para brindarte toda la información que necesitas.</p>
                    <p>Gracias por tu interés en nuestros programas educativos.</p>
                    
                    <a href='https://epd.loopmotion.tech' class='button'>Visitar Sitio Web</a>
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