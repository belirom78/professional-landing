<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');

const BOT_TOKEN = '8790125181:AAGjYBJFPcf6X6MX9JCRQBXpfuZSA1bn7uA';
const CHAT_ID = '311666698';

function respond(bool $success, string $message, int $statusCode = 200): void
{
    http_response_code($statusCode);
    echo json_encode(
        ['success' => $success, 'message' => $message],
        JSON_UNESCAPED_UNICODE
    );
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(false, 'Ошибка отправки', 405);
}

$cleanData = [];
foreach ($_POST as $key => $value) {
    if (is_array($value)) {
        $value = implode(', ', array_map(static function ($item) {
            return trim(htmlspecialchars((string) $item, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'));
        }, $value));
    } else {
        $value = trim(htmlspecialchars((string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'));
    }

    $cleanData[$key] = $value;
}

$name = $cleanData['name'] ?? '';
$phone = $cleanData['phone'] ?? '';
$comment = $cleanData['comment'] ?? '';

if ($name === '' || $phone === '') {
    respond(false, 'Ошибка отправки', 400);
}

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

$message = implode(PHP_EOL, $messageLines);

$ch = curl_init();
if ($ch === false) {
    respond(false, 'Ошибка отправки', 500);
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
    respond(false, 'Ошибка отправки', 500);
}

$decoded = json_decode($response, true);
if (!is_array($decoded) || empty($decoded['ok'])) {
    respond(false, 'Ошибка отправки', 500);
}

respond(true, 'Заявка отправлена');
