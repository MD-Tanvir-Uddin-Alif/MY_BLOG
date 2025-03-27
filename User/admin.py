from django.contrib import admin
from .models import CustomUserModel
# Register your models here.


@admin.register(CustomUserModel)
class CustomUserModelAdmin(admin.ModelAdmin):
    list_display = ('id', 'first_name', 'last_name', 'username', 'email')
    search_fields = ('username',)