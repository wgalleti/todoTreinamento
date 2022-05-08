from rest_framework import routers

from todo.views import TarefaViewSet, UserViewSet

r = routers.DefaultRouter()
r.register('tarefas', TarefaViewSet)
r.register('usuarios', UserViewSet)

urlpatterns = r.urls
