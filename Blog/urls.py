from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .import views


router = DefaultRouter()
router.register(r'comment', views.CommentModelView, basename='comment')

urlpatterns = [
    path('create/', views.BlogModelView.as_view(), name='create_blog'),
    path('list/', views.BlogModelListView.as_view(), name='blog_list'),
    path('update/<int:id>/', views.BlogModelUpdateView.as_view(), name='update_blog'),
    path('delete/<int:id>/', views.BlogModelDeleteView.as_view(), name='delete_blog'),
    path('', include(router.urls)),
    path('create/blog/', views.create_post, name='create_post'),
]
