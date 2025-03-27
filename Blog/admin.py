from django.contrib import admin
from .models import BlogModel, CommentModel
# Register your models here.


@admin.register(BlogModel)
class BlogModelAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'author')
    search_fields = ('author',)


@admin.register(CommentModel)
class CommentModelAdmin(admin.ModelAdmin):
    list_display = ('id', 'blog', 'commentor', 'created_at')
    search_fields = ('blog', 'commentor',)