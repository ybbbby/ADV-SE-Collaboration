from typing import List
from flask_mail import Message

def send(mail: 'Mail', title: str, recipients: List, content: str):
    msg = Message(title,
                  recipients=recipients, sender=("YesOKGroup", "iriszhang2396@gmail.com"))
    msg.body = content
    mail.send(msg)
    
