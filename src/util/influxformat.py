import sys

#This script should simply format data into format specified in RFC3339
#sys.argv[1] input csv path
#sys.argv[2] output csv path
#sys.argv[3] database name
#sys.argv[4] number of rows created in the csv data

inputFile = open(sys.argv[1], 'r', encoding = 'utf-8')
outputFile = open(sys.argv[2], 'w', encoding = 'utf-8')

lines = inputFile.readlines();

#outputFile.write(sys.argv[3] + "," + sys.argv[4] + "\n")

outputFile.write("# DDL\nCREATE DATABASE " + sys.argv[3] +
	"\n\n# DML\n# CONTEXT-DATABASE: " + 
	sys.argv[3])


counter = 0

for line in lines:
	outputFile.write(line[0:4] + "-" + line[4:6] + "-" + line[6:11] + 
		":" + line[11:13] + ":" + line[13:15] + "," + line[16:-3] + "\n")
	counter = counter + 1
	if counter == int(sys.argv[5]):
		break

inputFile.close()
outputFile.close()