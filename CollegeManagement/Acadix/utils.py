from django.core.mail import send_mail
from Swostitech_Acadix import settings
import random

def generate_otp():
    return str(random.randint(100000, 999999))

def send_otp_email(email, otp):
    send_mail(
        subject="Password Reset OTP",
        message=f"Your OTP is {otp}. Valid for 5 minutes.",
        from_email=f'{settings.DEFAULT_FROM_EMAIL}',
        recipient_list=[email],
        fail_silently=False,
    )