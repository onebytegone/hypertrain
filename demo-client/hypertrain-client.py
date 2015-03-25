#!/usr/bin/python2.7
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
teamname = 'demo-client'

def sendMessage(server, method, command, token):
   url = server+command
   print "Request: " + method + " " + url
   req = urllib2.Request(url)
   req.add_header('token', token)
   req.get_method = lambda: method
   response = urllib2.urlopen(req)
   data = response.read()
   return json.loads(data)

print "Using URL: "+server_url

# Register for token
print "Sending register command..."
response = sendMessage(server_url, 'POST', '/v1/ai/register/' + teamname, '')
token = response['payload']['token']
print response
print "Received token: "+token


# Unregister teamname
print "Sending unregister command..."
response = sendMessage(server_url, 'DELETE', '/v1/ai/register', token)
print response
