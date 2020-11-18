"""
Module for sending email
"""


from typing import List
from flask_mail import Message


def send(mail: 'Mail', title: str, recipients: List, content: str):
    """
    Send email to all recipients
    :param mail: Mail object
    :param title: Email subject
    :param recipients: a list of user emails
    :param content: email content
    """
    msg = Message(title,
                  recipients=recipients, sender=("YesOKGroup", "iriszhang2396@gmail.com"))
    msg.body = content
    mail.send(msg)
