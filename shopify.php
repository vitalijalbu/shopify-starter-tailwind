<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed'
    ]);
    exit();
}

// Configuration
define('AC_URL', 'https://sportpress.api-us1.com');
define('AC_API_KEY', '9d13b6ab55db84f0f10e0c5568486872367271606b922e72fcc87d0f8e65b6cf06ecff65');
define('AC_LIST_ID', '77');
define('AC_TAG_ID', '290'); // Tag "Iscritto"


// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Validate input
if (!$input || !isset($input['email'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Email is required'
    ]);
    exit();
}

$email = filter_var($input['email'], FILTER_SANITIZE_EMAIL);
$firstName = $input['firstName'] ?? '';
$lastName = $input['lastName'] ?? '';
$phone = $input['phone'] ?? '';
$newsletter = isset($input['newsletter']); // true se presente, false se non presente

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid email address'
    ]);
    exit();
}

try {
    $acResult = addContactToActiveCampaign($email, $firstName, $lastName, $phone, $newsletter);
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Successfully subscribed to newsletter',
        'data' => [
            'activecampaign' => $acResult
        ]
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

/**
 * Add or update contact in ActiveCampaign
 */
function addContactToActiveCampaign($email, $firstName, $lastName, $phone, $newsletter) {
    // Prima verifica se il contatto esiste già
    $existingContact = findContactByEmail($email);
    $contactId = null;
    $isExisting = false;
    
    if ($existingContact) {
        // Contatto esiste già - aggiorna i dati
        $contactId = $existingContact['id'];
        $isExisting = true;
        updateContact($contactId, $firstName, $lastName, $phone);
    } else {
        // Contatto nuovo - crealo
        $contactId = createContact($email, $firstName, $lastName, $phone);
    }
    
    if ($contactId) {
        // SEMPRE aggiungi alla lista 77 (sia per nuovi che esistenti)
        subscribeToList($contactId, AC_LIST_ID);
        
        // Aggiungi tag SOLO se newsletter NON è presente nella richiesta
        // (sia per nuovi che esistenti)
        if (!$newsletter) {
            addTagToContact($contactId, AC_TAG_ID);
        }
    }
    
    return [
        'id' => $contactId,
        'status' => 'subscribed',
        'is_existing' => $isExisting,
        'newsletter' => $newsletter,
        'tag_added' => !$newsletter
    ];
}

/**
 * Find contact by email
 */
function findContactByEmail($email) {
    $url = AC_URL . '/api/3/contacts?email=' . urlencode($email);
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Api-Token: ' . AC_API_KEY
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode !== 200) {
        return null;
    }
    
    $result = json_decode($response, true);
    
    if (isset($result['contacts']) && count($result['contacts']) > 0) {
        return $result['contacts'][0];
    }
    
    return null;
}

/**
 * Create new contact
 */
function createContact($email, $firstName, $lastName, $phone) {
    $url = AC_URL . '/api/3/contacts';
    
    $data = [
        'contact' => [
            'email' => $email,
            'firstName' => $firstName,
            'lastName' => $lastName,
            'phone' => $phone
        ]
    ];
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Api-Token: ' . AC_API_KEY,
        'Content-Type: application/json'
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode !== 200 && $httpCode !== 201) {
        throw new Exception('ActiveCampaign API error: ' . $response);
    }
    
    $result = json_decode($response, true);
    return $result['contact']['id'] ?? null;
}

/**
 * Update existing contact
 */
function updateContact($contactId, $firstName, $lastName, $phone) {
    $url = AC_URL . '/api/3/contacts/' . $contactId;
    
    $data = [
        'contact' => [
            'firstName' => $firstName,
            'lastName' => $lastName,
            'phone' => $phone
        ]
    ];
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Api-Token: ' . AC_API_KEY,
        'Content-Type: application/json'
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    
    $response = curl_exec($ch);
    curl_close($ch);
    
    return json_decode($response, true);
}

/**
 * Subscribe contact to a list
 */
function subscribeToList($contactId, $listId) {
    $url = AC_URL . '/api/3/contactLists';
    
    $data = [
        'contactList' => [
            'list' => $listId,
            'contact' => $contactId,
            'status' => 1 // 1 = active, 2 = unsubscribed
        ]
    ];
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Api-Token: ' . AC_API_KEY,
        'Content-Type: application/json'
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    
    $response = curl_exec($ch);
    curl_close($ch);
    
    return json_decode($response, true);
}

/**
 * Add tag to contact
 */
function addTagToContact($contactId, $tagId) {
    $url = AC_URL . '/api/3/contactTags';
    
    $data = [
        'contactTag' => [
            'contact' => $contactId,
            'tag' => $tagId
        ]
    ];
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Api-Token: ' . AC_API_KEY,
        'Content-Type: application/json'
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    
    $response = curl_exec($ch);
    curl_close($ch);
    
    return json_decode($response, true);
}