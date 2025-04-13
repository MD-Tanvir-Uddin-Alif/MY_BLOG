from django.shortcuts import render
from rest_framework.generics import CreateAPIView, ListAPIView, UpdateAPIView, DestroyAPIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly
from .serializers import BlogModelSerializer, BlogModelListSerializer,  CommentModelSerializer
from .models import BlogModel, CommentModel

# Create your views here.

class BlogModelView(CreateAPIView):
    queryset = BlogModel.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = BlogModelSerializer
    
    # def perform_create(self, serializer):
    #     return serializer.save(author=self.request.user)
    
    
class BlogModelListView(ListAPIView):
    queryset = BlogModel.objects.all()
    permission_classes = [AllowAny]
    serializer_class = BlogModelListSerializer
    
    
class BlogModelUpdateView(UpdateAPIView):
    queryset = BlogModel.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = BlogModelListSerializer
    lookup_field = 'id'
    
    def get_queryset(self):
        return BlogModel.objects.filter(author=self.request.user)
    

class BlogModelDeleteView(DestroyAPIView):
    queryset = BlogModel.objects.all()
    serializer_class = BlogModelListSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'


class CommentModelView(ModelViewSet):
    # queryset = CommentModel.objects.all()
    serializer_class = CommentModelSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        blog_id = self.request.query_params.get('blog')
        
        if blog_id:
            return CommentModel.objects.filter(blog=blog_id)
        return CommentModel.objects.all()
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)





# rendering 

def create_post(request):
    return render(request, 'create_blog.html')