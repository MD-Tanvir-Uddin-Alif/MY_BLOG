from rest_framework import serializers
from .models import CustomUserModel

class CustomUserModelSerializers(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True, required=True)
    class Meta:
        model = CustomUserModel
        fields = ['first_name','last_name','username','email','gender','password','password2']
        extra_kwargs = {
            'first_name' : {'required':True},
            'last_name' : {'required':True},
            'password': {'write_only': True},
            # 'password2': {'write_only': True}
        }
        
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password":"Password did't match"})
        return attrs
        
    def create(self, validate_data):
        validate_data.pop('password2')
        user = CustomUserModel.objects.create_user(
            first_name = validate_data['first_name'],
            last_name = validate_data['last_name'],
            username = validate_data['username'],
            email = validate_data['email'],
            gender = validate_data['gender'],
        )
        
        user.set_password(validate_data['password'])
        user.save()
        return user


class CustomUserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUserModel
        fields = ['id','first_name','last_name','username','email','gender','account_created_at']
        read_only_fields = ['id','username','account_created_at']


