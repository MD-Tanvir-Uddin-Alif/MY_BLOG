from rest_framework import serializers
from .models import BlogModel, CommentModel

class BlogModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogModel
        fields = '__all__'
    
    def create(self, validated_data):
        blog = BlogModel.objects.create(
            author = validated_data['author'],
            title = validated_data['title'],
            content = validated_data['content'],
        )
        
        return blog
    
class BlogModelListSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogModel
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class CommentModelSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    class Meta:
        model = CommentModel
        fields = '__all__'
        read_only_field = ['id', 'created_at']