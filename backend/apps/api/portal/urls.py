"""
Portal API URLs

公開用APIのルーティングを定義する
"""
from rest_framework.routers import DefaultRouter

from .views import PublicPostViewSet

router = DefaultRouter()
router.register('posts', PublicPostViewSet, basename='public-post')

urlpatterns = router.urls
