import cgi

from google.appengine.ext import db

from gaeo.controller import BaseController


class MessageController(BaseController):
    def create(self):
        """
        1. get data from user
        2. use model to save
        3. return json
        """
        data = self.params['json']
        self.data = data

    def delete(self):
        pass

    def read(self):
        """
        1. read model data
        2. return json
        """
        pass

    def update(self):
        pass
