"""
Dashboard API ViewSets

管理用APIエンドポイントを定義する
"""
from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from apps.core.models import Comment, Post
from apps.core.pagination import StandardPagination

from .serializers import (
    CommentCreateSerializer,
    CommentSerializer,
    PostCreateUpdateSerializer,
    PostDetailSerializer,
    PostListSerializer,
    UserSerializer,
)


@extend_schema_view(
    list=extend_schema(tags=['posts'], summary='List posts'),
    retrieve=extend_schema(tags=['posts'], summary='Get post detail'),
    create=extend_schema(tags=['posts'], summary='Create post'),
    update=extend_schema(tags=['posts'], summary='Update post'),
    partial_update=extend_schema(tags=['posts'], summary='Partial update post'),
    destroy=extend_schema(tags=['posts'], summary='Delete post'),
)
class PostViewSet(viewsets.ModelViewSet):
    """
    投稿のViewSet

    投稿のCRUD操作を提供する
    """

    queryset = Post.objects.select_related('author').prefetch_related('comments')
    permission_classes = [IsAuthenticated]
    pagination_class = StandardPagination
    lookup_field = 'id'

    def get_serializer_class(self):
        """
        アクションに応じたシリアライザーを返す

        :return: シリアライザークラス
        """
        if self.action in ['create', 'update', 'partial_update']:
            return PostCreateUpdateSerializer
        if self.action == 'retrieve':
            return PostDetailSerializer
        return PostListSerializer

    def perform_create(self, serializer):
        """
        投稿作成時に作者を設定

        :param serializer: シリアライザー
        """
        serializer.save(author=self.request.user)


@extend_schema_view(
    list=extend_schema(tags=['comments'], summary='List comments'),
    retrieve=extend_schema(tags=['comments'], summary='Get comment detail'),
    create=extend_schema(tags=['comments'], summary='Create comment'),
    destroy=extend_schema(tags=['comments'], summary='Delete comment'),
)
class CommentViewSet(viewsets.ModelViewSet):
    """
    コメントのViewSet

    コメントのCRUD操作を提供する
    """

    queryset = Comment.objects.select_related('author', 'post')
    permission_classes = [IsAuthenticated]
    pagination_class = StandardPagination
    http_method_names = ['get', 'post', 'delete']
    lookup_field = 'id'

    def get_serializer_class(self):
        """
        アクションに応じたシリアライザーを返す

        :return: シリアライザークラス
        """
        if self.action == 'create':
            return CommentCreateSerializer
        return CommentSerializer

    def perform_create(self, serializer):
        """
        コメント作成時に作者を設定

        :param serializer: シリアライザー
        """
        serializer.save(author=self.request.user)


@extend_schema_view(
    me=extend_schema(tags=['users'], summary='Get current user'),
)
class UserViewSet(viewsets.ViewSet):
    """
    ユーザーのViewSet

    現在のユーザー情報を取得する
    """

    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def me(self, request: Request) -> Response:
        """
        現在のユーザー情報を取得

        :param request: リクエスト
        :return: ユーザー情報
        """
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
