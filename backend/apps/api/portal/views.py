"""
Portal API ViewSets

公開用APIエンドポイントを定義する（読み取り専用）
"""
from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from apps.core.models import Post
from apps.core.pagination import StandardPagination

from .serializers import PublicPostDetailSerializer, PublicPostListSerializer


@extend_schema_view(
    list=extend_schema(tags=['public-posts'], summary='List published posts'),
    retrieve=extend_schema(tags=['public-posts'], summary='Get published post detail'),
)
class PublicPostViewSet(viewsets.ReadOnlyModelViewSet):
    """
    公開投稿のViewSet

    公開済み投稿の読み取り専用APIを提供する
    """

    permission_classes = [AllowAny]
    pagination_class = StandardPagination
    lookup_field = 'id'

    def get_queryset(self):
        """
        公開済み投稿のみを返す

        :return: 公開済み投稿のQuerySet
        """
        return Post.objects.filter(is_published=True).select_related('author').prefetch_related('comments')

    def get_serializer_class(self):
        """
        アクションに応じたシリアライザーを返す

        :return: シリアライザークラス
        """
        if self.action == 'retrieve':
            return PublicPostDetailSerializer
        return PublicPostListSerializer
