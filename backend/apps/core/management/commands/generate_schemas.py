"""
OpenAPIスキーマ生成コマンド

dashboard用とportal用のOpenAPIスキーマを別々に生成する
"""
import json
from pathlib import Path

from django.conf import settings
from django.core.management.base import BaseCommand
from drf_spectacular.generators import SchemaGenerator


class Command(BaseCommand):
    """
    OpenAPIスキーマを生成するコマンド

    dashboard用とportal用のOpenAPIスキーマをそれぞれ別のJSONファイルとして出力する
    """

    help = 'Generate OpenAPI schemas for dashboard and portal APIs'

    def add_arguments(self, parser):
        """
        コマンドライン引数を追加

        :param parser: ArgumentParser
        """
        parser.add_argument(
            '--output-dir',
            type=str,
            default='..',
            help='Output directory for schema files',
        )

    def handle(self, *args, **options):
        """
        コマンドを実行

        :param args: 位置引数
        :param options: キーワード引数
        """
        output_dir = Path(options['output_dir'])
        api_version = settings.API_VERSION

        # Dashboard API schema
        self.stdout.write('Generating dashboard API schema...')
        dashboard_generator = SchemaGenerator(
            patterns=None,
            urlconf='apps.api.dashboard.urls',
        )
        dashboard_schema = dashboard_generator.get_schema(public=True)

        # パスにプレフィックスを追加
        dashboard_paths = {}
        for path, operations in dashboard_schema.get('paths', {}).items():
            dashboard_paths[f'/api/{api_version}/dashboard{path}'] = operations
        dashboard_schema['paths'] = dashboard_paths

        dashboard_output = output_dir / 'openapi.dashboard.json'
        with open(dashboard_output, 'w') as f:
            json.dump(dashboard_schema, f, indent=2, ensure_ascii=False)
        self.stdout.write(
            self.style.SUCCESS(f'Dashboard schema saved to {dashboard_output}')
        )

        # Portal API schema
        self.stdout.write('Generating portal API schema...')
        portal_generator = SchemaGenerator(
            patterns=None,
            urlconf='apps.api.portal.urls',
        )
        portal_schema = portal_generator.get_schema(public=True)

        # パスにプレフィックスを追加
        portal_paths = {}
        for path, operations in portal_schema.get('paths', {}).items():
            portal_paths[f'/api/{api_version}/portal{path}'] = operations
        portal_schema['paths'] = portal_paths

        portal_output = output_dir / 'openapi.portal.json'
        with open(portal_output, 'w') as f:
            json.dump(portal_schema, f, indent=2, ensure_ascii=False)
        self.stdout.write(
            self.style.SUCCESS(f'Portal schema saved to {portal_output}')
        )

        self.stdout.write(self.style.SUCCESS('Schema generation completed!'))
