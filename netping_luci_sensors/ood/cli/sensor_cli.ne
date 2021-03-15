
# Section for an architector
# ==========================

MAIN 			-> 	SENSOR_CLI

SENSOR_CLI		->	sensor status			# list all sensors and their statuses
				|	sensor NAME status 		# get status of sensor with defined NAME
				|	sensor NUMBER status	# get status of sensor with defined N (number)

				|	sensor NAME data		# get data of sensor by NAME of sensor
				|	sensor NUMBER data		# get data of sensor by NUMBER of sensor

				|	sensor add --name=[NAME] --tmpl=[NAME]			# add sensor using template NAME
				|	sensor add --name=[NAME] --tmpl=[NUMBER] 		# add sensor using template NUMBER
				|	sensor del [NAME]								# delete sensor by NAME
				|	sensor del [NUMBER]								# delete sensor by NUMBER
			

# Section for a programmer
# ========================

# NAME 			Letters, Digits, Spaces, Special characters (e.g. !#$%, etc.)
# NUMBER 		1..999