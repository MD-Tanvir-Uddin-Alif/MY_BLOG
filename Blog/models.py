from django.db import models
from User.models import CustomUserModel
# Create your models here.


class BlogModel(models.Model):
    author = models.ForeignKey(CustomUserModel, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.title} writen by {self.author}"


class CommentModel(models.Model):
    blog = models.ForeignKey(BlogModel, on_delete=models.CASCADE)
    commentor = models.ForeignKey(CustomUserModel, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.blog} commented by {self.commentor}"