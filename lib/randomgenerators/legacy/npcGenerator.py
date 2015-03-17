#!/usr/bin/python
import random, sys
#races  				#class/profession	 #class			#profession category	#lesser nobility
#0  mountain dwarf      #0 class             #0  barbarian  #0  learned             #0  explorer    
#1  hill dwarf          #1 profession        #1  bard       #1  lesser nobility     #1  diplomat    
#2  wood elf                                 #2  cleric     #2  professional        #2  knight      
#3  high elf                                 #3  druid      #3  working class       #3  minister    
#4  drow                                     #4  fighter    #4  martial             #4  page        
#5  lightfoot halfling                       #5  monk       #5  underclass          #5  squire      
#6  stout halfling                           #6  paladin    #6  entertainer			
#7  human                                    #7  ranger    							#martial			
#8  dragonborn                               #8  rogue                              #0  bodyguard    
#9  rock gnome                               #9  sorcerer                           #1  bounty hunter
#10 forest gnome                             #10 warlock                            #2  forester     
#11 half-elf                                 #11 wizard                             #3  jailer       
#12 half-orc                                                                        #4  soldier      
#13 tiefling                                 
#14 goblin                                   
#15 orc                                      
#16 troglodyte                               
#17 medusa                                   

#learned					#professional		#working class	   #underclass		#entertainer
#0  astrologer              #0  armorer         #0  boatman        #0 bandit        #0 acrobat
#1  cartographer            #1  painter         #1  coachman       #1 beggar        #1 actor
#2  historian               #2  baker           #2  farmer         #2 fence         #2 clown
#3  philosopher             #3  banker          #3  fisher         #3 pickpocket    #3 dancer    
#4  hermit                  #4  blacksmith      #4  gravedigger    #4 procurer      #4 fortune-teller
#5  wandering pilgrim       #5  bowyer          #5  sheppard       #5 prostitute    #5 juggler
#6  barber                  #6  brewer          #6  trapper        #6 slaver        #6 prestidigitator
#7  doctor                  #7  butcher         #7  messenger      #7 smuggler      #7 storyteller
#8  barrister               #8  carpenter       #8  miller         #8 wanderer       
#9  herald                  #9  clothier        #9  miner          
#10 scribe                  #10 cook            #10 peddler        
#11 acolyte                 #11 furrier         #11 ratcatcher     
#12 neophyte                #12 goldsmith       #12 sailor         
                            #13 innkeeper                         
                            #14 jeweler                           
                            #15 leatherworker                     
                            #16 locksmith                         
                            #17 mason                             
                            #18 merchant                          
                            #19 tinker                            
                            #20 torturer                          
                            #21 trader                            
                            #22 weaver                            

#alignment   #gender
#1 good		 #0 female
#2 evil	     #1 male

							
if len(sys.argv)<2 or len(sys.argv)>8:
	print ('usage: python ' + sys.argv[0]+ ' <filename> [race#] [class or profession] [class# /profession category#] [profession#] [alignment] [gender]. Leave any [] at "-1" for random selection.')
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

if len(sys.argv)==8:
		race=int(sys.argv[2])
		classorprof=int(sys.argv[3])
		occupation1=int(sys.argv[4])
		occupation2=int(sys.argv[5])
		alignment=int(sys.argv[6])
		gender=int(sys.argv[7])
else:
	race=-1
	classorprof=-1
	occupation1=-1
	occupation2=-1
	alignment=-1
	gender=-1
	
def getrrow( tablename ):
	t = tables.tabledic[tablename]
	
	if tablename=="race" and race != -1:
		return t.rows[race].val
	elif tablename=="forcealign" and alignment != -1:
		return t.rows[alignment].val
	elif tablename=="gender" and gender != -1:
		return t.rows[gender].val
		
	if classorprof != -1:
		if tablename=="occupation":
			return t.rows[classorprof].val
		elif classorprof==0 and tablename=="class":
			return t.rows[occupation1].val		
		elif classorprof==1 and tablename=="profession":
			return t.rows[occupation1].val	
		elif classorprof==1 and (tablename=="learned" or 
								 tablename=="lesserNobility" or 
								 tablename=="professional" or 
								 tablename=="workClass" or 
								 tablename=="martial" or 
								 tablename=="underclass" or 
								 tablename=="entertainer"):
			return t.rows[occupation2].val
	
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