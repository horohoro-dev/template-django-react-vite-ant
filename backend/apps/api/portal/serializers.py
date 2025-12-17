"""
Portal API Serializers

公開用APIのシリアライザーを定義する
"""
from rest_framework import serializers

from apps.core.models import Comment, Post, User


class PublicUserSerializer(serializers.ModelSerializer):
    """公開用ユーザーシリアライザー"""

    class Meta:
        model = User
        fields = ['id', 'username']


class PublicCommentSerializer(serializers.ModelSerializer):
    """公開用コメントシリアライザー"""

    author = PublicUserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'author', 'content', 'created_at']


class PublicPostListSerializer(serializers.ModelSerializer):
    """公開用投稿一覧シリアライザー"""

    author = PublicUserSerializer(read_only=True)
    comment_count = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            'id',
            'title',
            'author',
            'comment_count',
            'created_at',
        ]

    def get_comment_count(self, obj: Post) -> int:
        """
        コメント数を取得

        :param obj: Postインスタンス
        :return: コメント数
        """
        return obj.comments.count()


class PublicPostDetailSerializer(serializers.ModelSerializer):
    """公開用投稿詳細シリアライザー"""

    author = PublicUserSerializer(read_only=True)
    comments = PublicCommentSerializer(many=True, read_only=True)

    class Meta:
        model = Post
        fields = [
            'id',
            'title',
            'content',
            'author',
            'comments',
            'created_at',
        ]
