#! /usr/bin/env python
# -*- coding: utf-8 -*-

import logging, os, pickle, urllib
from django.utils import simplejson
from google.appengine.ext import db, webapp
from google.appengine.ext.webapp import template
from google.appengine.ext.webapp.util import run_wsgi_app

class Data(db.Model):
    json = db.BlobProperty()
    created = db.DateTimeProperty(auto_now_add=True)
    updated = db.DateTimeProperty(auto_now=True)

class Main(webapp.RequestHandler):
    def get(self):
        path = os.path.join(os.path.dirname(__file__), 'index.html')
        self.response.out.write(template.render(path, None))
    def post(self):
        path = os.path.join(os.path.dirname(__file__), 'index.html')
        self.response.out.write(template.render(path, None))

class Message(webapp.RequestHandler):
    def get(self, action):
        json = simplejson.loads(urllib.unquote(self.request.query_string)) if self.request.query_string else None
        if action == 'create':
            self.create(json)
        elif action == 'read':
            self.read()
        elif action == 'update':
            self.update(json)
        elif action == 'delete':
            self.delete(json)
    def post(self, action):
        logging.debug(self.request.body)
        json = simplejson.loads(urllib.unquote(self.request.body))
        if action == 'create':
            self.create(json)
        elif action == 'read':
            self.read()
        elif action == 'update':
            self.update(json)
        elif action == 'delete':
            self.delete(json)
    def create(self, json):
        for item in json:
            data = Data()
            data.put()
            logging.debug(item['m_id'])
            item['m_id'] = str(data.key())

            data.json = pickle.dumps(item)
            data.put()
        self.response.out.write('0')
    def read(self):
        datum = Data.all().order('-updated').fetch(1000)
        if len(datum) == 0:
            return
        output = '['
        for item in datum:
            raw = pickle.loads(item.json)
            output = output + simplejson.dumps(raw) + ','
        output = output[:-1] + ']'
        self.response.out.write(output)
    def update(self, json):
        for item in json:
            data = Data.get(item['m_id'])
            if data is not None:
                data.json = pickle.dumps(item)
                data.put()
        self.response.out.write('0')
    def delete(self, json):
        for item in json:
            data = Data.get(item['m_id'])
            if data is not None:
                data.delete()
        self.response.out.write('0')

application = webapp.WSGIApplication([
    ('/', Main),
    ('/message/(.*)/(.*)', Message),
    ('/message/(.*)', Message),
    ], debug=True)

def main():
    run_wsgi_app(application)

if __name__ == "__main__":
    main()
