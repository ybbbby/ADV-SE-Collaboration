from utils.create_all_tables import *
from models.User import User
from models.Event import Event
from models.Comment import Comment
from models.Join import Join
from models.Like import Like
import datetime

create_tables()
User.create_user(User("lrghust@gmail.com", "ruiguang"))
User.create_user(User("123123@gmail.com", "123"))
event_id = Event.create_event(Event("lrghust@gmail.com", "12 st", "12345", datetime.datetime.now(), 1.1, 2.2))
Comment.create_comment(Comment("lrghust@gmail.com", event_id, "aaaaaaaaaaa", datetime.datetime.now()))
Join.create_join(Join("lrghust@gmail.com", event_id))
Join.create_join(Join("123123@gmail.com", event_id))
Like.create_like(Like("123123@gmail.com", event_id))
