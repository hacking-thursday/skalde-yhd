from google.appengine.ext import db
from gaeo.model import BaseModel, SearchableBaseModel

class Message(BaseModel):
    data = db.TextProperty(required=True)
