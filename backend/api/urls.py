from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    ProjectViewSet,
    CartItemViewSet,
    PurchaseViewSet,
    register_user,
    get_user_profile,
    get_admin_stats,
    request_otp,
    login_with_otp,
    reset_password
)
router = DefaultRouter()
router.register(r'projects', ProjectViewSet)
router.register(r'cart', CartItemViewSet, basename='cart')
router.register(r'purchases', PurchaseViewSet, basename='purchase')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', register_user, name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', get_user_profile, name='user_profile'),
    path('admin-stats/', get_admin_stats, name='admin-stats'),
    path('request-otp/', request_otp, name='request-otp'),
    path('login-with-otp/', login_with_otp, name='login-with-otp'),
    path('reset-password/', reset_password, name='reset_password'),
]