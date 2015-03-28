#!/usr/bin/python2.7
# Copyright 2015 Ethan Smith

import sys
from HypertrainAPI import HypertrainAPI

args = sys.argv
if len(args) < 2:
   print "Error: This needs to have a url."
   print "Usage: hypertrain-client.py {url}"
   exit()

server_url = args[1]
teamname = 'demo-client'


print "Using URL: "+server_url
api = HypertrainAPI(server_url);

# Register for token
print "\n\n## Sending register command..."
api.register(teamname);
print "Received token: "+api.token

# Join game
print "\n\n## Sending join command..."
gameident = api.join();
print "Joined game: "+gameident

# Fetch board
print "\n\n## Getting game info..."
gameboard = api.board(gameident);
print "Game data:"
print gameboard

# Unregister teamname
print "\n\n## Sending unregister command..."
api.unregister();
