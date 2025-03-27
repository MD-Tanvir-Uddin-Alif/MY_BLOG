from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.


class CustomUserModel(AbstractUser):
    Gender_CHOICES = [
        ('F' , 'Female'),
        ('M' , 'Male'),
    ]
    
    gender = models.CharField(max_length=1, choices=Gender_CHOICES, blank=True, null=True)
    account_created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.username
