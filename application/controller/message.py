import cgi,pickle

from google.appengine.ext import db

from gaeo.controller import BaseController

from application.model.message import Message


class MessageController(BaseController):
    def create(self):
        """
        1. get data from user
        2. use model to save
        3. return json
        """
        data = self.to_json(self.params['json'])
        message = Message(data=pickle.dumps(data[0]))
        message.put()
        data[0]['m_id'] = message.key()
        message.data = pickle.dumps(data[0])
        message.put()
        self.render(data)

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
