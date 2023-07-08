from django.db import models


class BaseModel(models.Model):
    created = models.DateTimeField(verbose_name='Created', auto_now_add=True)
    updated = models.DateTimeField(verbose_name='Updated', auto_now=True)

    class Meta:
        abstract = True
