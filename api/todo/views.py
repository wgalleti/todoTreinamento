from django.contrib.auth.models import User
from rest_framework import viewsets

from todo.models import Tarefa
from todo.serializers import TarefaSerializer, UserSerializer


class TarefaViewSet(viewsets.ModelViewSet):
    queryset = Tarefa.objects.all()
    serializer_class = TarefaSerializer
    filter_fields = ('id', 'usuario')


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
