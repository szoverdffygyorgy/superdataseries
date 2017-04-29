import sys

#sys.argv[1] input csv path
#sys.argv[2] output csv path
#sys.argv[3] tiemseries name
#sys.argv[4] starting row
#sys.argv[5] ending row - 387102 is the highest with the current test file

inputFile = open(sys.argv[1], 'r', encoding = 'utf-8')
outputFile = open(sys.argv[2], 'w', encoding = 'utf-8')

lines = inputFile.readlines();

outputFile.write(sys.argv[3] + "\n")

for index in range(int(sys.argv[4]), int(sys.argv[5])):
	outputFile.write(lines[index][0:4] + "-" + lines[index][4:6] + "-" + lines[index][6:11] +
		":" + lines[index][11:13] + ":" + lines[index][13:15] + "," + lines[index][16:-3] + "\n")

inputFile.close()
outputFile.close()
