# Generated by Django 5.1 on 2024-08-30 20:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_post_status_alter_post_created_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='created_at',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
    ]
