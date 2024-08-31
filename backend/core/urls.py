from django.urls import path
from .views import post_list, add_post, post_detail

urlpatterns = [
    path('posts/', post_list, name='all_posts'),
    path('add/', add_post, name='add_post'),
    path('posts/<int:pk>', post_detail, name='post_detail'),
]
