  <?php
require_once('vendor/autoload.php');

use Parse\ParseClient as ParseClient;
use Parse\ParseUser as ParseUser;
use Parse\ParseObject as ParseObject;
use Parse\ParseQuery as ParseQuery;

ParseClient::initialize( "cryptonsignals", null, "kayskjbfaevbfilquwebfsndfsjdfnsdkjnfkajdnfkad" );
ParseClient::setServerURL('https://cryptonsignals.herokuapp.com','parse');

$mail = (string)$_POST['mail'];
$password = (string)$_POST['password1'];
$gender = (string)$_POST['gender'];  

$user = new ParseUser();
$user->set("username", $mail);
$user->set("password", $password);
$user->set("email", $mail);

// other fields can be set just like with ParseObject
$user->set("gender", $gender);

try {
  $user->signUp();
$Types = true;
} catch (ParseException $ex) {
$Types = false;
  echo "Error: " . $ex->getCode() . " " . $ex->getMessage();
}


$result = array('Success' => $Types);

	


	
 echo json_encode($result); //przekształcamy naszą tablicę na zapis typu json


?>