from django.shortcuts import render
from rest_framework.generics import CreateAPIView, RetrieveUpdateAPIView, RetrieveAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import CustomUserModelSerializers, CustomUserProfileSerializer
from .models import CustomUserModel
# Create your views here.


class CustomUserModelView(CreateAPIView):
    queryset = CustomUserModel.objects.all()
    serializer_class = CustomUserModelSerializers
    permission_classes = [AllowAny]
    
    
class CustomUserProfileView(RetrieveAPIView):
    queryset = CustomUserModel
    permission_classes = [IsAuthenticated]
    serializer_class = CustomUserProfileSerializer
    
    def get_object(self):
        return self.request.user
    
    
class CustomUserUpdateView(RetrieveUpdateAPIView):
    queryset = CustomUserModel
    serializer_class = CustomUserProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user
