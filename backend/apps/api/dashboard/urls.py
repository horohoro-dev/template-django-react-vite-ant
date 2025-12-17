"""
Dashboard API URLs

管理用APIのルーティングを定義する
"""
from rest_framework.routers import DefaultRouter

from .views import CommentViewSet, PostViewSet, UserViewSet

router = DefaultRouter()
router.register('posts', PostViewSet, basename='post')
router.register('comments', CommentViewSet, basename='comment')
router.register('users', UserViewSet, basename='user')

urlpatterns = router.urls
