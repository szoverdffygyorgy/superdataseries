import sys

#This script should simply format data into format specified in RFC3339
#sys.argv[1] input .csv path
#sys.argv[2] output influxDB compatible .txt path
#sys.argv[3] database name

inputFile = open(sys.argv[1], 'r', encoding = 'utf-8')
outputFile = open(sys.argv[2], 'w', encoding = 'utf-8')

lines = inputFile.readlines();

outputFile.write("# DDL\nCREATE DATABASE " + sys.argv[3] +
	"\n\n# DML\n# CONTEXT-DATABASE: " +
	sys.argv[3] + "\n\n")

for line in lines:
	if len(line) < 30:
		timeSeriesName = line[-8:-1]
	else:
		outputFile.write(timeSeriesName + ",price=" + line[-11:-1] + " " + line[:10] + "T" +
		line[12:-12] + "Z" + "\n")

inputFile.close()
outputFile.close()
