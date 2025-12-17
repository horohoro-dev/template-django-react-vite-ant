"""
Dashboard API Serializers

管理用APIのシリアライザーを定義する
"""
from rest_framework import serializers

from apps.core.models import Comment, Post, User


class UserSerializer(serializers.ModelSerializer):
    """ユーザーシリアライザー"""

    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'bio', 'date_joined']
        read_only_fields = ['id', 'date_joined']


class CommentSerializer(serializers.ModelSerializer):
    """コメントシリアライザー"""

    author = UserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'post', 'author', 'content', 'created_at']
        read_only_fields = ['id', 'author', 'created_at']


class CommentCreateSerializer(serializers.ModelSerializer):
    """コメント作成用シリアライザー"""

    class Meta:
        model = Comment
        fields = ['post', 'content']


class PostListSerializer(serializers.ModelSerializer):
    """投稿一覧用シリアライザー"""

    author = UserSerializer(read_only=True)
    comment_count = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            'id',
            'title',
            'author',
            'is_published',
            'comment_count',
            'created_at',
            'updated_at',
        ]

    def get_comment_count(self, obj: Post) -> int:
        """
        コメント数を取得

        :param obj: Postインスタンス
        :return: コメント数
        """
        return obj.comments.count()


class PostDetailSerializer(serializers.ModelSerializer):
    """投稿詳細用シリアライザー"""

    author = UserSerializer(read_only=True)
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Post
        fields = [
            'id',
            'title',
            'content',
            'author',
            'is_published',
            'comments',
            'created_at',
            'updated_at',
        ]


class PostCreateUpdateSerializer(serializers.ModelSerializer):
    """投稿作成・更新用シリアライザー"""

    class Meta:
        model = Post
        fields = ['title', 'content', 'is_published']
