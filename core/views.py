from django.contrib.auth import authenticate, login, logout
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import status
from rest_framework.generics import CreateAPIView, GenericAPIView, RetrieveUpdateDestroyAPIView, UpdateAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import User
from .serializers import ChangePasswordSerializer, RegistrationSerializer, UserSerializer


class UserCreateView(CreateAPIView):
    serializer_class = RegistrationSerializer
    permission_classes = [AllowAny]


class UserAuthenticateView(GenericAPIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)

        if user is not None:
            login(request, user)
            return Response({'message': 'Authentication successful'}, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'Invalid login credentials'}, status=status.HTTP_401_UNAUTHORIZED)


class UserView(RetrieveUpdateDestroyAPIView):
    queryset = User.objects.filter(is_active=True)
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    @method_decorator(ensure_csrf_cookie)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=False)
        serializer.is_valid(raise_exception=True)

        # Check if the username already exists
        username = serializer.validated_data.get('username')
        if User.objects.exclude(pk=instance.pk).filter(username=username).exists():
            return Response({'message': 'Username already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        self.perform_update(serializer)
        return Response(serializer.data)

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        # Check if the username already exists
        username = serializer.validated_data.get('username')
        if User.objects.exclude(pk=instance.pk).filter(username=username).exists():
            return Response({'message': 'Username already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        self.perform_update(serializer)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        logout(request)
        return Response(status=status.HTTP_204_NO_CONTENT)


class UserUpdatePasswordView(UpdateAPIView):
    queryset = User.objects.filter(is_active=True)
    serializer_class = ChangePasswordSerializer
    permission_classes = [IsAuthenticated]

    @method_decorator(ensure_csrf_cookie)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        old_password = serializer.validated_data.get('old_password')
        new_password = serializer.validated_data.get('new_password')

        # Check if the old password matches the user's current password
        if not instance.check_password(old_password):
            return Response({'message': 'Old password is not correct!'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the new password is the same as old password
        if old_password == new_password:
            return Response(
                {'message': 'The new password must not match the old password!'}, status=status.HTTP_400_BAD_REQUEST
            )

        instance.set_password(new_password)
        instance.save()

        return Response(serializer.data)
