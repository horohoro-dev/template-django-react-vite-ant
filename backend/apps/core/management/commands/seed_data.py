"""
テストデータ生成コマンド

開発用のサンプルデータを生成する
"""
from django.core.management.base import BaseCommand

from apps.core.models import Comment, Post, User


class Command(BaseCommand):
    """
    テストデータを生成するコマンド

    User、Post、Commentのサンプルデータを作成する
    """

    help = 'Generate sample data for development'

    def handle(self, *args, **options):
        """
        コマンドを実行

        :param args: 位置引数
        :param options: キーワード引数
        """
        self.stdout.write('Creating sample data...')

        # Create users
        admin_user, created = User.objects.get_or_create(
            email='admin@example.com',
            defaults={
                'username': 'admin',
                'is_staff': True,
                'is_superuser': True,
                'bio': 'Administrator',
            },
        )
        if created:
            admin_user.set_password('admin123')
            admin_user.save()
            self.stdout.write(self.style.SUCCESS('Created admin user'))

        user1, created = User.objects.get_or_create(
            email='user1@example.com',
            defaults={
                'username': 'user1',
                'bio': 'First test user',
            },
        )
        if created:
            user1.set_password('user123')
            user1.save()
            self.stdout.write(self.style.SUCCESS('Created user1'))

        user2, created = User.objects.get_or_create(
            email='user2@example.com',
            defaults={
                'username': 'user2',
                'bio': 'Second test user',
            },
        )
        if created:
            user2.set_password('user123')
            user2.save()
            self.stdout.write(self.style.SUCCESS('Created user2'))

        # Create posts
        posts_data = [
            {
                'title': 'First Post',
                'content': 'This is the content of the first post.',
                'author': admin_user,
                'is_published': True,
            },
            {
                'title': 'Second Post',
                'content': 'This is the content of the second post.',
                'author': user1,
                'is_published': True,
            },
            {
                'title': 'Draft Post',
                'content': 'This is a draft post that is not published yet.',
                'author': user1,
                'is_published': False,
            },
            {
                'title': 'Third Post',
                'content': 'This is the content of the third post.',
                'author': user2,
                'is_published': True,
            },
        ]

        for post_data in posts_data:
            post, created = Post.objects.get_or_create(
                title=post_data['title'],
                defaults=post_data,
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created post: {post.title}'))

        # Create comments
        posts = Post.objects.filter(is_published=True)
        for post in posts:
            comment, created = Comment.objects.get_or_create(
                post=post,
                author=user1 if post.author != user1 else user2,
                defaults={
                    'content': f'This is a comment on "{post.title}".',
                },
            )
            if created:
                self.stdout.write(
                    self.style.SUCCESS(f'Created comment on: {post.title}')
                )

        self.stdout.write(self.style.SUCCESS('Sample data creation completed!'))
