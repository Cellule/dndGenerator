#!/usr/bin/python
import random, sys

if len(sys.argv)<2 or len(sys.argv)>6:
	print ('usage: python ' + sys.argv[0]+ ' <filename> .')
	sys.exit(-1)

class RRow:
	def __init__(self):
		self.weight = 0
		self.val = ""

class RTable:
	def __init__(self):
		self.rows = []

class RTables:
	def __init__(self):
		self.tabledic = {}

seed = random.SystemRandom().randint(1,sys.maxsize)
random.seed(seed)

tables = RTables()
with open(sys.argv[1], 'r') as f:
	origoutput = f.readline().rstrip()
	for line in f:
		liner = line.rstrip()
		if liner == "":
			curtable = ""
		elif curtable == "":
			curtable = liner;
			tables.tabledic[curtable] = RTable()
		else:
			curline = liner;
			row = RRow()
			row.weight = int(liner[0:liner.find(' ')])
			row.val = liner[liner.find(' ')+1:len(liner)]
			tables.tabledic[curtable].rows.append( row )
f.closed
	
def getrrow( tablename ):
	t = tables.tabledic[tablename]
		
	totalweight = 0
	for i in t.rows:
		totalweight += i.weight
	rnum = random.SystemRandom().randint(1,totalweight)
	totalweight = 0
	for i in t.rows:
		totalweight += i.weight
		if rnum<=totalweight:
			return i.val;


	
maxgen=1
for x in range ( 0, maxgen):
	vars = {}
	output=origoutput
	while output.find('{')>-1:
		bracket1 = output.find('{')
		bracket2 = output.find('}')
		inbrackets = output[bracket1+1:bracket2]
		if inbrackets[0:1] == '%':
			if inbrackets.find('=')>-1:
				pos = inbrackets.find('=')
				varname = inbrackets[1:pos]
				if inbrackets[pos+1:pos+2] == '%':
					varname2 = inbrackets[pos+2:len(inbrackets)]
					vars[varname] = vars[varname2]
				else:
					vars[varname]=int(inbrackets[pos+1:len(inbrackets)])
				output = output[0:bracket1] + output[bracket2+1:len(output)]
			elif inbrackets.find('+')>-1:
				pos = inbrackets.find('+')
				varname = inbrackets[1:pos]
				if inbrackets[pos+1:pos+2] == '%':
					varname2 = inbrackets[pos+2:len(inbrackets)]
					vars[varname] += vars[varname2]
				else:
					vars[varname]+=int(inbrackets[pos+1:len(inbrackets)])
				output = output[0:bracket1] + output[bracket2+1:len(output)]
			elif inbrackets.find('-')>-1:
				pos = inbrackets.find('-')
				varname = inbrackets[1:pos]
				if inbrackets[pos+1:pos+2] == '%':
					varname2 -= inbrackets[pos+2:len(inbrackets)]
					vars[varname] = vars[varname2]
				else:
					vars[varname]-=int(inbrackets[pos+1:len(inbrackets)])
				output = output[0:bracket1] + output[bracket2+1:len(output)]
			else:
				output = output[0:bracket1] + str(vars[inbrackets[1:len(inbrackets)]]) + output[bracket2+1:len(output)]
		elif inbrackets[0:1] == '$':
			if inbrackets.find('=')>-1:
				pos = inbrackets.find('=')
				varname = inbrackets[1:pos]
				if inbrackets[pos+1:pos+2] == '$':
					varname2 = inbrackets[pos+2:len(inbrackets)]
					vars[varname] = vars[varname2]
				else:
					vars[varname]=inbrackets[pos+1:len(inbrackets)]
				output = output[0:bracket1] + output[bracket2+1:len(output)]
			elif inbrackets.find('+')>-1:
				pos = inbrackets.find('+')
				varname = inbrackets[1:pos]
				if inbrackets[pos+1:pos+2] == '$':
					varname2 = inbrackets[pos+2:len(inbrackets)]
					vars[varname] += vars[varname2]
				else:
					vars[varname]+=inbrackets[pos+1:len(inbrackets)]
				output = output[0:bracket1] + output[bracket2+1:len(output)]
			else:
				output = output[0:bracket1] + str(vars[inbrackets[1:len(inbrackets)]]) + output[bracket2+1:len(output)]
		elif inbrackets[0:2] == '\\n':
			output = output[0:bracket1] + '\n' + output[bracket2+1:len(output)]
		else:
			output = output[0:bracket1] + getrrow(inbrackets) + output[bracket2+1:len(output)]
	print (output)