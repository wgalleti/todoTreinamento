from django.db import models


class Tarefa(models.Model):
    titulo = models.CharField(max_length=100)
    descricao = models.TextField()
    fechada = models.BooleanField(default=False)
    usuario = models.ForeignKey('auth.User', on_delete=models.DO_NOTHING)
    criado_em = models.DateTimeField(auto_now_add=True, null=True, blank=True)

    def __str__(self):
        return self.pk

