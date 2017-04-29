import sys

#sys.argv[1] input csv path
#sys.argv[2] output csv path
#sys.argv[3] x axis
#sys.argv[4] tiemseries name
#sys.argv[5] number of rows created in the csv data

inputFile = open(sys.argv[1], 'r', encoding = 'utf-8')
outputFile = open(sys.argv[2], 'w', encoding = 'utf-8')

lines = inputFile.readlines();

outputFile.write(sys.argv[3] + "," + sys.argv[4] + "\n")

counter = 0

for line in lines:
	outputFile.write(line[0:4] + "-" + line[4:6] + "-" + line[6:11] +
		":" + line[11:13] + ":" + line[13:15] + "," + line[16:-3] + "\n")
	counter = counter + 1
	if counter == int(sys.argv[5]):
		break

inputFile.close()
outputFile.close()
