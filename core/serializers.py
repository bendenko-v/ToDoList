from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from core.models import User


class RegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password], style={'input_type': 'password'}
    )
    password_repeat = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    username = serializers.CharField(required=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'password_repeat', 'email', 'first_name', 'last_name')

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError('Username already exists!')
        return value

    def validate(self, data):
        if data['password'] != data['password_repeat']:
            raise serializers.ValidationError('Passwords do not match!')
        return data

    def create(self, validated_data):
        validated_data.pop('password_repeat', None)
        user = User.objects.create(**validated_data)
        user.set_password(user.password)
        user.save()
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'email')


class ChangePasswordSerializer(serializers.ModelSerializer):
    old_password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    new_password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password], style={'input_type': 'password'}
    )

    class Meta:
        model = User
        fields = ('old_password', 'new_password')
