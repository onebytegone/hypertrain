#!/usr/bin/python
# Copyright 2015 Ethan Smith

import sys
import urllib
import urllib2
import json

args = sys.argv
if len(args) < 2:
   print "Error: This needs to have a url."
   print "Usage: hypertrain-client.py {url}"
   exit()

server_url = args[1]

def sendMessage(token, command):
   values = {
      'command' : command,
      'token' : token
   }

   data = urllib.urlencode(values)
   req = urllib2.Request(server_url, data)
   response = urllib2.urlopen(req)
   data = response.read()
   print data
   return json.loads(data)

print "Using URL: "+server_url
print "Sending sync command..."
response = sendMessage('', 'sync')
token = response['token']
print "Received token: "+token
