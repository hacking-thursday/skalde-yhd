import cgi,pickle
import logging

from google.appengine.ext import db

from gaeo.controller import BaseController

from model.message import Message


class MessageController(BaseController):
    def create(self):
        """
        1. get data from user
        2. use model to save
        3. return json
        """
        user_data = self.params['json']
        data = user_data
        message = Message(data=user_data)
        message.put()
        message.data['m_id'] = message.key()
        message.put()

    def delete(self):
        pass

    def read(self):
        """
        0. get message key
        1. read model data
        2. return json
        """
        key = self.params['key']
        message = Message.get(key)
        data = message.data
        self.render(data)

    def update(self):
        pass
