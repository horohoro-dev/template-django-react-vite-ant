from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    カスタムユーザーモデル

    :param email: メールアドレス（必須・一意）
    :param bio: 自己紹介文
    """

    email = models.EmailField(unique=True)
    bio = models.TextField(blank=True, default='')

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    class Meta:
        db_table = 'users'
        ordering = ['-date_joined']

    def __str__(self) -> str:
        return self.email


class Post(models.Model):
    """
    投稿モデル

    :param title: タイトル
    :param content: 本文
    :param author: 投稿者
    :param is_published: 公開フラグ
    :param created_at: 作成日時
    :param updated_at: 更新日時
    """

    title = models.CharField(max_length=200)
    content = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'posts'
        ordering = ['-created_at']

    def __str__(self) -> str:
        return self.title


class Comment(models.Model):
    """
    コメントモデル

    :param post: 対象の投稿
    :param author: コメント投稿者
    :param content: コメント内容
    :param created_at: 作成日時
    """

    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'comments'
        ordering = ['-created_at']

    def __str__(self) -> str:
        return f'{self.author.username} on {self.post.title}'
