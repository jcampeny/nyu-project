<?php 

/*

gravity.model(
	"SELECT gci.*,cepi.comlang_off, cepi.colony, LN(cepi.distw) as ldistw, cepi.contig, LN(oe_1.value*oe_2.value) as lgdp1xgdp2, 0 as lgdppcratio FROM GCI gci INNER JOIN CEPIIGeoDist cepi ON cepi.iso1 = gci.iso1 AND cepi.iso2 = gci.iso2 INNER JOIN OxfordEconomics oe_1 ON oe_1.iso = gci.iso1 AND oe_1.year = gci.year INNER JOIN OxfordEconomics oe_2 ON oe_2.iso = gci.iso2 AND oe_2.year = gci.year WHERE gci.code='m.exports' AND gci.year>=2005 AND gci.year <= 2015 LIMIT 100",
	"value",
	c("comlang_off", "colony", "ldistw", "contig"),
	"lgdp1xgdp2",
	"2005:2015",
	"ols",
	TRUE,
	TRUE,
	TRUE
)

*/


$url = "http://52.32.163.154/ocpu/library/cagecomparator/R/gravity.model/json";
// $url ='http://api.ean.com/ean-services/rs/hotel/v3/avail?minorRev14&apiKey=p9ycn9cxb2zp3k3gfvbf5aym&cid=55505&locale=en_US&hotelId=122212&stateProvinceCode=%20NV%C2%A4cyCode=USD&arrivalDate=12/27/2012&departureDate=12/28/2012&room1=2,&room2=2,18,15&room3=3,16,16,15&room4=3,&includeDetails=true&includeRoomImages=true';

$header = array('Content-Type:application/json');

$ch = curl_init();

$data = json_encode(array(
	"dataset" => curl_escape($ch,"SELECT gci.*,cepi.comlang_off, cepi.colony, LN(cepi.distw) as ldistw, cepi.contig, LN(oe_1.value*oe_2.value) as lgdp1xgdp2, 0 as lgdppcratio FROM GCI gci INNER JOIN CEPIIGeoDist cepi ON cepi.iso1 = gci.iso1 AND cepi.iso2 = gci.iso2 INNER JOIN OxfordEconomics oe_1 ON oe_1.iso = gci.iso1 AND oe_1.year = gci.year INNER JOIN OxfordEconomics oe_2 ON oe_2.iso = gci.iso2 AND oe_2.year = gci.year WHERE gci.code='m.exports' AND gci.year>=2005 AND gci.year <= 2015 LIMIT 1000"),
	// "dataset" => "SELECT gci.*,cepi.comlang_off, cepi.colony, LN(cepi.distw) as ldistw, cepi.contig, LN(oe_1.value*oe_2.value) as lgdp1xgdp2, 0 as lgdppcratio FROM GCI gci INNER JOIN CEPIIGeoDist cepi ON NOT(cepi.iso1<>gci.iso1) AND NOT(cepi.iso2 <> gci.iso2) INNER JOIN OxfordEconomics oe_1 ON NOT(oe_1.iso <> gci.iso1) AND NOT(oe_1.year <> gci.year) INNER JOIN OxfordEconomics oe_2 ON NOT(oe_2.iso <> gci.iso2) AND NOT(oe_2.year <> gci.year) WHERE NOT(gci.code<>'m.exports') AND gci.year>2004 AND gci.year < 2016 LIMIT 100",
	"dep.vars" => "value",
	"distance.vars" => array("comlang_off", "colony", "ldistw", "contig"),
	"size.vars" => "lgdp1xgdp2",
	"years" => array("2005","2006","2007","2008","2009","2010","2011","2012","2013","2014","2015"),
	"olsppml" => "ols",
	"rse" => TRUE,
	"crfx" => TRUE,
	"yfx" => TRUE
));



curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
curl_setopt($ch, CURLOPT_ENCODING, "gzip");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
// curl_setopt($ch, CURLOPT_POST, true); 
// curl_setopt($ch, CURLOPT_POSTFIELDS, '{"dataset":"SELECT gci.*,cepi.comlang_off, cepi.colony, LN(cepi.distw) as ldistw, cepi.contig, LN(oe_1.value*oe_2.value) as lgdp1xgdp2, 0 as lgdppcratio FROM GCI gci INNER JOIN CEPIIGeoDist cepi ON cepi.iso1 = gci.iso1 and cepi.iso2 = gci.iso2 INNER JOIN OxfordEconomics oe_1 ON oe_1.iso = gci.iso1 and oe_1.year = gci.year INNER JOIN OxfordEconomics oe_2 ON oe_2.iso = gci.iso2 and oe_2.year = gci.year WHERE gci.code=\"m.exports\" AND gci.year>=2005 and gci.year <= 2015 LIMIT 100", "dep.vars" : "value", "distance.vars": ["comlang_off", "colony", "ldistw", "contig"],"size.vars" : "lgdp1xgdp2", "years" : "2005:2015", "olsppml" : "ols", "rse" : true, "crfx": true, "yfx" : true }');
// curl_setopt($ch, CURLOPT_POSTFIELDS, 'dataset=SELECT gci.*,cepi.comlang_off, cepi.colony, LN(cepi.distw) as ldistw, cepi.contig, LN(oe_1.value*oe_2.value) as lgdp1xgdp2, 0 as lgdppcratio FROM GCI gci INNER JOIN CEPIIGeoDist cepi ON cepi.iso1 = gci.iso1 and cepi.iso2 = gci.iso2 INNER JOIN OxfordEconomics oe_1 ON oe_1.iso = gci.iso1 and oe_1.year = gci.year INNER JOIN OxfordEconomics oe_2 ON oe_2.iso = gci.iso2 and oe_2.year = gci.year WHERE gci.code=\"m.exports\" AND gci.year>=2005 and gci.year <= 2015 LIMIT 100&dep.vars=value&distance.vars": ["comlang_off", "colony", "ldistw", "contig"],"size.vars" : "lgdp1xgdp2", "years" : "2005:2015", "olsppml" : "ols", "rse" : true, "crfx": true, "yfx" : true }');
// curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.0.3705; .NET CLR 1.1.4322)');

$retValue = curl_exec($ch);
$response = json_decode(curl_exec($ch));
$ee       = curl_getinfo($ch);
print "<pre>";
print_r($ee);
print "</pre>";
print "<br/><br/>--<br/><br/>";
print "<pre>";
print_r($retValue);
print "</pre>";
 ?>