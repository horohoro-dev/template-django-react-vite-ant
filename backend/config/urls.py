"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    # JWT endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # API endpoints
    path('api/dashboard/', include('apps.api.dashboard.urls')),
    path('api/portal/', include('apps.api.portal.urls')),
    # OpenAPI Schema - Dashboard
    path(
        'api/schema/dashboard/',
        SpectacularAPIView.as_view(urlconf='apps.api.dashboard.urls'),
        name='schema-dashboard',
    ),
    path(
        'api/schema/dashboard/swagger/',
        SpectacularSwaggerView.as_view(url_name='schema-dashboard'),
        name='swagger-ui-dashboard',
    ),
    path(
        'api/schema/dashboard/redoc/',
        SpectacularRedocView.as_view(url_name='schema-dashboard'),
        name='redoc-dashboard',
    ),
    # OpenAPI Schema - Portal
    path(
        'api/schema/portal/',
        SpectacularAPIView.as_view(urlconf='apps.api.portal.urls'),
        name='schema-portal',
    ),
    path(
        'api/schema/portal/swagger/',
        SpectacularSwaggerView.as_view(url_name='schema-portal'),
        name='swagger-ui-portal',
    ),
    path(
        'api/schema/portal/redoc/',
        SpectacularRedocView.as_view(url_name='schema-portal'),
        name='redoc-portal',
    ),
]
