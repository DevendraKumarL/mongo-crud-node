import os

os.system('netstat -aon | find "5002" > util/node-task-kill/output.txt')

file = open('util/node-task-kill/output.txt')
data = file.readlines()

items = []
for i in data:
	args = i.split(' ')
	for j in args:
		if j != '':
			items.append(j.rstrip())

pids = []
for i in range(0, len(items)):
	if (i + 1) % 5 == 0:
		pids.append(items[i])

for i in pids:
	print "Process PID: " + i + " port: 3002"

if len(pids) > 0:
	if (pids[0] != "0"):
		print "Terminating pid: " + pids[0]
		os.system('taskkill /pid ' + pids[0] + ' /f')
	else:
		print "No node:5002 process running to kill"
else:
	print "No node process to kill"