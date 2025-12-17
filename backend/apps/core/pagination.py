from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class StandardPagination(PageNumberPagination):
    """
    標準ページネーションクラス

    :param page_size: デフォルトのページサイズ
    :param page_size_query_param: ページサイズ指定用クエリパラメータ
    :param max_page_size: 最大ページサイズ
    """

    page_size = 100
    page_size_query_param = 'page_size'
    max_page_size = 1000

    def get_paginated_response(self, data: list) -> Response:
        """
        ページネーションレスポンスを返す

        :param data: ページネーション済みデータ
        :return: ページネーション情報を含むレスポンス
        """
        return Response(
            {
                'count': self.page.paginator.count,
                'next': self.get_next_link(),
                'previous': self.get_previous_link(),
                'results': data,
            }
        )
