<?php
// api/chat.php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["text" => "Method not allowed"]);
    exit();
}

$data = json_decode(file_get_contents("php://input"));
$message = $data->message ?? '';

if (empty($message)) {
    echo json_encode(["text" => "How can I help you today?"]);
    exit();
}

try {
    $m = strtolower($message);

    // Help Context
    if (strpos($m, "post") !== false && (strpos($m, "how") !== false || strpos($m, "help") !== false || strpos($m, "ad") !== false)) {
        echo json_encode(["text" => "To post an ad, simply click the 'Post Ad' button in the top navigation bar. You will be guided through a simple 3-step process to add your photos, title, price, and location!"]);
        exit();
    }
    if ((strpos($m, "search") !== false || strpos($m, "filter") !== false || strpos($m, "find") !== false) && strpos($m, "how") !== false) {
        echo json_encode(["text" => "You can find items by using the search bar on the home page, or by clicking 'Explore' to visit the Search page where you can filter by price, category, condition, and distance."]);
        exit();
    }
    if ($m === "hello" || $m === "hi" || $m === "hey") {
        echo json_encode(["text" => "Hi there! I am your HitAds AI assistant. I can search our live database for items, or guide you on how to use the site. What do you need help with?"]);
        exit();
    }

    // DB Context Search
    $stmt = $conn->query("SELECT title, price, category, location, id FROM listings ORDER BY id DESC LIMIT 100");
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Simple keyword extraction (ignore common words)
    $ignoreWords = ["how", "can", "find", "search", "give", "me", "want", "buy", "do", "you", "have", "any", "the", "for", "a", "an", "is", "there", "please", "need"];
    
    $words = explode(" ", $m);
    $keywords = array_filter($words, function($w) use ($ignoreWords) {
        return strlen($w) > 2 && !in_array($w, $ignoreWords);
    });

    if (count($keywords) > 0) {
        $matches = array_filter($rows, function($r) use ($keywords) {
            foreach ($keywords as $k) {
                if (strpos(strtolower($r['title']), $k) !== false || 
                    strpos(strtolower($r['category']), $k) !== false || 
                    strpos(strtolower($r['location']), $k) !== false) {
                    return true;
                }
            }
            return false;
        });

        if (count($matches) > 0) {
            $top3 = array_slice($matches, 0, 3);
            $listText = implode("\n", array_map(function($r) {
                return "• " . $r['title'] . " - $" . number_format($r['price']) . " (" . $r['location'] . ")";
            }, $top3));

            echo json_encode(["text" => "I searched our live database and found " . count($matches) . " item(s) that might match what you're looking for:\n\n" . $listText . "\n\nYou can find these by heading over to the main Search page!"]);
        } else {
            echo json_encode(["text" => "I searched our database for \"" . implode(" ", $keywords) . "\" but couldn't find any active listings matching that right now. Try adjusting your keywords or checking different categories!"]);
        }
        exit();
    }

    echo json_encode(["text" => "I'm your friendly HitAds Assistant! Try asking me how to post an ad, how to search, or ask me to check if we have a specific item like 'laptop' or 'car' in our database."]);

} catch(PDOException $e) {
    echo json_encode(["text" => "Oops, my database connection is a bit fuzzy right now. Try again in a moment!"]);
}
?>
