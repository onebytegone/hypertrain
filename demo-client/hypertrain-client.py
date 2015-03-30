#!/usr/bin/python2.7
# Copyright 2015 Ethan Smith

import sys
import os
from HypertrainAPI import HypertrainAPI

args = sys.argv
if len(args) < 2:
   print "Error: This needs to have a url."
   print "Usage: hypertrain-client.py {url}"
   exit()


server_url = args[1]
teamname = 'demo-client'
api = HypertrainAPI(server_url)
gameident = ''


def register():
   print "\n\n## Sending register command..."
   api.register(teamname);
   print "Received token: "+api.token

def unregister():
   print "\n\n## Sending unregister command..."
   api.unregister();

def join():
   print "\n\n## Sending join command..."
   gameident = api.join();
   print "Joined game: "+gameident

def board():
   print "\n\n## Getting game info..."
   gameboard = api.board(gameident);
   print "Game data:"
   print gameboard

def move():
   pass

def exitdemo():
   unregister()
   quit()

mapping = [
   {
      "name": "register: 'POST /v1/ai/register'",
      "funct": register
   },
   {
      "name": "unregister: 'DELETE /v1/ai/register'",
      "funct": unregister
   },
   {
      "name": "join game: 'PUT /v1/ai/join'",
      "funct": join
   },
   {
      "name": "get board: 'GET /v1/ai/board'",
      "funct": board
   },
   {
      "name": "move: 'PUT /v1/ai/move'",
      "funct": move
   },
   {
      "name": "quit",
      "funct": exitdemo
   }
]

def printCommands():
   print "Commands:"
   for index, cmd in enumerate(mapping):
      print " "+str(index+1)+") "+cmd["name"]

def printStats(url, token, gameident):
   print "Stats:"
   print " - server: "+url
   print " - token: "+token
   print " - game ident: "+gameident
   print ""
   print ""

def showScreen(url, token, gameident):
   os.system('clear')
   printStats(url, token, gameident)
   printCommands()

def main():
   while True:
      showScreen(server_url, api.token, gameident)
      choice = raw_input("command:  ")
      choosenIndex = -1
      try:
         choosenIndex = int(choice)-1
      except Exception, e:
         pass
      if choosenIndex >= 0 and choosenIndex < len(mapping):
         try:
            mapping[choosenIndex]['funct']()
         except Exception, e:
            print e
         raw_input("press enter to continue...")


# Capture interrupt for quit
if __name__ == '__main__':
   try:
      main()
   except KeyboardInterrupt:
      exitdemo()
