<?php
	include_once("lib/public.php");
	include_once("lib/mongodb.php");
	$adminAuthObj = new adminAuthInterface();
	$adminAuthObj->auth();
	class adminAuthInterface
	{
		public function auth()
		{
			//$username = fcgi_getvar("username");
			//$password = fcgi_getvar("password");
			$mongoObj = new mongoInterface();
			for ( $i=0; $i<100000; $i++)
			{
			$account = $mongoObj->getAdminUser("testAdmin");
			//echo "ok"a;
			
echo $account["username"];}
/*			$db = $mongoObj->getMongoDb("admin");
			$conn = new MongoClient("mongodb://admin:ccq245722@localhost:27017");
			$db = $conn->admin;
			$coll = $db->manager;
			$account = $coll->findOne(array("username" => "testAdmin"));			
var_dump($account);
$account = $coll->find();
			var_dump(iterator_to_array($account));	*/	
}
	}
?>
