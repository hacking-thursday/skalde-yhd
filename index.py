#! /usr/bin/env python
# -*- coding: utf-8 -*-

import logging, os
from google.appengine.ext import db, webapp
from google.appengine.ext.webapp import template
from google.appengine.ext.webapp.util import run_wsgi_app

class Data(db.Model):
    pass

class Main(webapp.RequestHandler):
    def get(self):
        path = os.path.join(os.path.dirname(__file__), 'index.html')
        self.response.out.write(template.render(path, None))
    def post(self):
        path = os.path.join(os.path.dirname(__file__), 'index.html')
        self.response.out.write(template.render(path, None))

class Message(webapp.RequestHandler):
    def get(self, action):
        if action == 'create':
            self.create(self.request.query_string)
        elif action == 'read':
            self.read(self.request.query_string)
        elif action == 'update':
            self.update(self.request.query_string)
        elif action == 'delete':
            self.delete(self.request.query_string)
    def post(self, action):
        if action == 'create':
            self.create(self.request.body)
        elif action == 'read':
            self.read(self.request.body)
        elif action == 'update':
            self.update(self.request.body)
        elif action == 'delete':
            self.delete(self.request.body)
    def create(self, json):
        self.response.out.write('Content-Type: text/plain\n\ncreate' + json)
    def read(self, json):
        self.response.out.write('Content-Type: text/plain\n\nread' + json)
    def update(self, json):
        self.response.out.write('Content-Type: text/plain\n\nupdate' + json)
    def delete(self, json):
        self.response.out.write('Content-Type: text/plain\n\ndelete' + json)

application = webapp.WSGIApplication([
    ('/', Main),
    ('/message/(.*)', Message),
    ], debug=True)

def main():
    run_wsgi_app(application)

if __name__ == "__main__":
    main()
