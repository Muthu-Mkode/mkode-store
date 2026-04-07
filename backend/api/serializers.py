from rest_framework import serializers
from .models import User, Project, CartItem, Purchase

class UserSerializer(serializers.ModelSerializer):
    profile_picture_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'is_admin', 'password', 'profile_picture', 'profile_picture_url']
        extra_kwargs = {'password': {'write_only': True}}

    def get_profile_picture_url(self, obj):
        if obj.profile_picture:
            return obj.profile_picture.url
        return None

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['email'],
            name=validated_data.get('name', ''),
            password=validated_data['password']
        )
        return user


class ProjectSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    zip_url = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = '__all__'

    def get_image_url(self, obj):
        if obj.image:
            return obj.image.url
        return None

    def get_zip_url(self, obj):
        if obj.zip_file:
            return obj.zip_file.url
        return None


class CartItemSerializer(serializers.ModelSerializer):
    project = ProjectSerializer(read_only=True)
    project_id = serializers.PrimaryKeyRelatedField(
        queryset=Project.objects.all(), source='project', write_only=True
    )

    class Meta:
        model = CartItem
        fields = ['id', 'user', 'project', 'project_id']
        read_only_fields = ['user']


class PurchaseSerializer(serializers.ModelSerializer):
    project = ProjectSerializer(read_only=True)
    project_id = serializers.PrimaryKeyRelatedField(
        queryset=Project.objects.all(), source='project', write_only=True
    )

    class Meta:
        model = Purchase
        fields = ['id', 'user', 'project', 'project_id', 'purchased_at']
        read_only_fields = ['user']
