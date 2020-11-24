"""
Module for sending email
"""
from typing import List
import smtplib
from email.mime.text import MIMEText
from email.header import Header


def send(smtp_obj: 'SMTP', title: str, recipients: List, content: str, hide: bool):
    """
    Send email to all recipients
    :param smtp_obj: SMTP object
    :param title: Email subject
    :param recipients: a list of user emails
    :param content: email content
    :param hide: if recipients address need to be hidden
    """

    sender = "no-reply@yesok.com"
    msg = MIMEText(content, 'html')
    msg["From"] = str(Header('YesOKGroup <no-reply@yesok.com>'))
    if hide:
        msg["To"] = str(Header("recipients@yesok.com"))
    else:
        msg["To"] = ".".join(recipients)
    msg["Subject"] = Header(title)
    try:
        smtp_obj.sendmail(sender, recipients, msg.as_string())
    except smtplib.SMTPException:
        print("Email send error")
    # smtp_obj.quit()
