<?php
declare(strict_types=1);

use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;

header('Content-Type: application/json; charset=UTF-8');

const BOT_TOKEN = '8790125181:AAGjYBJFPcf6X6MX9JCRQBXpfuZSA1bn7uA';
const CHAT_ID = '311666698';

const MAIL_LOGIN = 'pma2004@mail.ru';
const MAIL_PASSWORD = 'il8VKcHqZJx1cRzVbsTV';
const MAIL_TO = 'pma2004@mail.ru';

const SMTP_HOST = 'smtp.mail.ru';
const SMTP_PORT = 465;

function respond(bool $success, string $message, int $statusCode = 200): void
{
    http_response_code($statusCode);
    echo json_encode(
        ['success' => $success, 'message' => $message],
        JSON_UNESCAPED_UNICODE
    );
    exit;
}

function loadPhpMailer(): bool
{
    $composerAutoload = __DIR__ . '/vendor/autoload.php';
    if (file_exists($composerAutoload)) {
        require_once $composerAutoload;
        return class_exists(PHPMailer::class);
    }

    $base = __DIR__ . '/phpmailer/src/';
    $requiredFiles = ['Exception.php', 'PHPMailer.php', 'SMTP.php'];
    foreach ($requiredFiles as $file) {
        $fullPath = $base . $file;
        if (!file_exists($fullPath)) {
            return false;
        }
        require_once $fullPath;
    }

    return class_exists(PHPMailer::class);
}

function cleanFormData(array $post): array
{
    $cleanData = [];

    foreach ($post as $key => $value) {
        if (is_array($value)) {
            $value = implode(', ', array_map(static function ($item) {
                return trim(htmlspecialchars((string) $item, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'));
            }, $value));
        } else {
            $value = trim(htmlspecialchars((string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'));
        }

        $cleanData[$key] = $value;
    }

    return $cleanData;
}

function buildMessage(array $cleanData): string
{
    $name = $cleanData['name'] ?? '';
    $phone = $cleanData['phone'] ?? '';
    $comment = $cleanData['comment'] ?? '';

    $messageLines = [
        'Новая заявка с сайта',
        '',
        'Имя: ' . $name,
        'Телефон: ' . $phone,
        'Комментарий: ' . $comment,
    ];

    foreach ($cleanData as $key => $value) {
        if (in_array($key, ['name', 'phone', 'comment'], true)) {
            continue;
        }

        if ($value === '' || strpos($key, '_') === 0) {
            continue;
        }

        $label = ucfirst(str_replace(['_', '-'], ' ', $key));
        $messageLines[] = $label . ': ' . $value;
    }

    return implode(PHP_EOL, $messageLines);
}

function sendToTelegram(string $message): bool
{
    $ch = curl_init();
    if ($ch === false) {
        return false;
    }

    curl_setopt_array($ch, [
        CURLOPT_URL => 'https://api.telegram.org/bot' . BOT_TOKEN . '/sendMessage',
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CONNECTTIMEOUT => 10,
        CURLOPT_TIMEOUT => 20,
        CURLOPT_POSTFIELDS => [
            'chat_id' => CHAT_ID,
            'text' => $message,
        ],
    ]);

    $response = curl_exec($ch);
    $httpCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);

    if ($response === false || $curlError !== '' || $httpCode !== 200) {
        return false;
    }

    $decoded = json_decode($response, true);
    return is_array($decoded) && !empty($decoded['ok']);
}

function sendToEmail(string $message): bool
{
    $mail = new PHPMailer(true);

    try {
        $mail->CharSet = 'UTF-8';
        $mail->isHTML(false);
        $mail->Timeout = 15;
        $mail->isSMTP();
        $mail->Host = SMTP_HOST;
        $mail->SMTPAuth = true;
        $mail->Username = MAIL_LOGIN;
        $mail->Password = MAIL_PASSWORD;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port = SMTP_PORT;

        $mail->setFrom(MAIL_LOGIN, 'Заявки с сайта');
        $mail->addAddress(MAIL_TO);
        $mail->Subject = 'Новая заявка с сайта';
        $mail->Body = $message;
        $mail->AltBody = $message;

        return $mail->send();
    } catch (Exception $e) {
        return false;
    }
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(false, 'Ошибка отправки', 405);
}

if (!loadPhpMailer()) {
    respond(false, 'Ошибка отправки', 500);
}

$cleanData = cleanFormData($_POST);
$name = $cleanData['name'] ?? '';
$phone = $cleanData['phone'] ?? '';

if ($name === '' || $phone === '') {
    respond(false, 'Ошибка отправки', 400);
}

$message = buildMessage($cleanData);

$telegramSent = sendToTelegram($message);
$emailSent = sendToEmail($message);

if ($telegramSent && $emailSent) {
    respond(true, 'Заявка отправлена');
}

respond(false, 'Ошибка отправки', 500);
