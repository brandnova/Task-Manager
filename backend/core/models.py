from django.db import models

# Create your models here.

class Post(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    created_at = models.CharField(max_length=50, null=True, blank=True)
    release_date = models.DateField(auto_now_add=True)
    status = models.BooleanField( default=False, null=True)

    def __str__(self):
        return self.title
