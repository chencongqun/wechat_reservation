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
			//$account = $mongoObj->getAdminUser("testAdmin");
			//echo "ok"a;
			
			//$db = $mongoObj->getMongoDb("admin");
			$conn = new MongoClient("mongodb://admin:ccq245722@localhost:27017");
                        $db = $conn->admin;
			$coll = $db->manager;
			$account = $coll->find();
			var_dump(iterator_to_array($account));		
}
	}
?>
