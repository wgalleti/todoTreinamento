from django.contrib.auth.models import User
from rest_framework import serializers
from todo.models import Tarefa


class TarefaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tarefa
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField('_full_name')

    def _full_name(self, data):
        return f'{data.first_name} {data.last_name}'

    class Meta:
        model = User
        fields = ('id', 'username', 'full_name', 'email')
