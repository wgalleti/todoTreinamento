from django.contrib import admin

from todo.models import Tarefa


@admin.register(Tarefa)
class TarefaAdmin(admin.ModelAdmin):
    search_fields = (
        'titulo',
        'usuario',
        'descricao'
    )

    list_filter = (
        'fechada',
        'usuario'
    )

    list_display = (
        'id',
        'titulo',
        'fechada',
        'usuario',
        'criado_em'
    )
