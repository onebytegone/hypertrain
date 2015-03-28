# Helper class to access the hypertrain api
# Copyright 2015 Ethan Smith

import urllib
import urllib2
import json

class HypertrainAPI(object):

   def __init__(self, url):
      self.server = url
      self.token = ''

   def sendMessage(self, method, command, token):
      url = self.server+command
      print "Request: " + method + " " + url
      req = urllib2.Request(url)
      req.add_header('token', token)
      req.get_method = lambda: method
      response = urllib2.urlopen(req)
      data = response.read()
      return json.loads(data)

   def register(self, teamname):
      response = self.sendMessage('POST', '/v1/ai/register/' + teamname, '')
      self.token = response['payload']['token']

   def unregister(self):
      self.sendMessage('DELETE', '/v1/ai/register', self.token)

   def join(self):
      response = self.sendMessage('PUT', '/v1/ai/join', self.token)
      return response['payload']['gameident']

   def board(self, gameident):
      response = self.sendMessage('GET', '/v1/ai/board/' + gameident, self.token)
      return response['payload']
