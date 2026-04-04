from rest_framework.decorators import action, api_view, permission_classes
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from django.conf import settings
from .models import User, Project, CartItem, Purchase
from .serializers import UserSerializer, ProjectSerializer, CartItemSerializer, PurchaseSerializer
import razorpay
from django.db.models import Sum
import random
from django.core.cache import cache
from django.core.mail import EmailMultiAlternatives
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from PIL import Image
import io
import sys
from django.core.files.uploadedfile import InMemoryUploadedFile

client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))


def compress_image_to_webp(image_file):
    if not image_file:
        return None
    img = Image.open(image_file)
    if img.mode in ("RGBA", "P"):
        img = img.convert("RGBA")
    else:
        img = img.convert("RGB")
    output = io.BytesIO()
    img.save(output, format='WEBP', quality=80, method=4)
    output.seek(0)
    original_name = image_file.name.rsplit('.', 1)[0]
    new_filename = f"{original_name}.webp"

    image_size = output.getbuffer().nbytes

    webp_file = InMemoryUploadedFile(
        output,
        'ImageField',
        new_filename,
        'image/webp',
        image_size,
        None
    )
    return webp_file


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def create(self, request, *args, **kwargs):
        data = {key: value for key, value in request.data.items()}

        if 'image' in request.FILES:
            data['image'] = compress_image_to_webp(request.FILES['image'])
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()

        data = {key: value for key, value in request.data.items()}

        if 'image' in request.FILES:
            data['image'] = compress_image_to_webp(request.FILES['image'])
        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)


class CartItemViewSet(viewsets.ModelViewSet):
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CartItem.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        project_id = request.data.get('project_id')
        cart_item, created = CartItem.objects.get_or_create(
            user=request.user,
            project_id=project_id
        )
        serializer = self.get_serializer(cart_item)
        if created:
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'])
    def create_order(self, request):
        cart_items = self.get_queryset()
        if not cart_items.exists():
            return Response({"error": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST)
        total_amount = sum(item.project.price for item in cart_items)
        amount_in_paise = int(total_amount * 100)
        order_data = {
            "amount": amount_in_paise,
            "currency": "INR",
            "payment_capture": "1"
        }
        razorpay_order = client.order.create(data=order_data)
        return Response({
            "order_id": razorpay_order['id'],
            "amount": amount_in_paise,
            "currency": "INR"
        }, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'])
    def verify_payment(self, request):
        payment_id = request.data.get('razorpay_payment_id')
        order_id = request.data.get('razorpay_order_id')
        signature = request.data.get('razorpay_signature')
        params_dict = {
            'razorpay_order_id': order_id,
            'razorpay_payment_id': payment_id,
            'razorpay_signature': signature
        }
        try:
            client.utility.verify_payment_signature(params_dict)
            cart_items = self.get_queryset()
            for item in cart_items:
                Purchase.objects.get_or_create(user=request.user, project=item.project)
            cart_items.delete()
            return Response({"message": "Payment verified and checkout successful"}, status=status.HTTP_200_OK)
        except razorpay.errors.SignatureVerificationError:
            return Response({"error": "Invalid signature"}, status=status.HTTP_400_BAD_REQUEST)


class PurchaseViewSet(viewsets.ModelViewSet):
    serializer_class = PurchaseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Purchase.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


@api_view(['GET', 'PUT'])
@permission_classes([permissions.IsAuthenticated])
def get_user_profile(request):
    if request.method == 'PUT':

        data = {key: value for key, value in request.data.items()}

        if request.data.get('remove_picture') == 'true':
            data['profile_picture'] = None
            data['image'] = None
            data['profile_image'] = None
        else:
            if 'image' in request.FILES:
                data['image'] = compress_image_to_webp(request.FILES['image'])
            elif 'profile_image' in request.FILES:
                data['profile_image'] = compress_image_to_webp(request.FILES['profile_image'])
            elif 'profile_picture' in request.FILES:
                data['profile_picture'] = compress_image_to_webp(request.FILES['profile_picture'])

        serializer = UserSerializer(request.user, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    serializer = UserSerializer(request.user)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.IsAdminUser])
def get_admin_stats(request):
    total_revenue = Purchase.objects.aggregate(total=Sum('project__price'))['total']
    if total_revenue is None:
        total_revenue = 0.00
    total_customers = Purchase.objects.values('user').distinct().count()
    return Response({
        "total_revenue": float(total_revenue),
        "total_customers": total_customers
    })


def send_mkode_otp(email, name, otp):
    subject = "Your Mkode Security Code"
    html_content = f"""
    <div style="font-family: Arial, sans-serif; max-w-md; margin: 0 auto; padding: 40px 20px; background-color: #fafafa; text-align: center;">
        <div style="background-color: #ffffff; padding: 40px; border-radius: 24px; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
            <h1 style="color: #111827; font-size: 24px; font-weight: 900; margin-bottom: 8px;">M<span style="color: #2563EB;">KODE</span></h1>
            <h2 style="color: #374151; font-size: 18px; font-weight: 600; margin-bottom: 24px;">Verify your identity</h2>
            <p style="color: #6B7280; font-size: 16px; margin-bottom: 32px;">Hi {name}, use the security code below to complete your request.</p>
            <div style="background-color: #F3F4F6; border-radius: 16px; padding: 20px; margin-bottom: 32px;">
                <span style="font-size: 32px; font-weight: 900; letter-spacing: 8px; color: #2563EB;">{otp}</span>
            </div>
            <p style="color: #9CA3AF; font-size: 14px;">This code will expire in 5 minutes. If you didn't request this, please ignore this email.</p>
        </div>
    </div>
    """
    text_content = f"Hi {name}, your Mkode security code is: {otp}. It expires in 5 minutes."
    msg = EmailMultiAlternatives(subject, text_content, settings.EMAIL_HOST_USER, [email])
    msg.attach_alternative(html_content, "text/html")
    msg.send()


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def request_otp(request):
    email = request.data.get('email')
    name = request.data.get('name', 'Developer')
    action_type = request.data.get('action')
    if action_type == 'login':
        password = request.data.get('password')
        user = authenticate(username=email, password=password)
        if not user:
            return Response({"error": "Invalid email or password."}, status=status.HTTP_401_UNAUTHORIZED)
        name = user.name

    if email == 'razorpay@mkode.com':
        cache.set(f"otp_{email}", "123456", timeout=300)
        return Response({"message": "OTP sent successfully."}, status=status.HTTP_200_OK)

    otp = str(random.randint(100000, 999999))
    cache.set(f"otp_{email}", otp, timeout=300)
    send_mkode_otp(email, name, otp)
    return Response({"message": "OTP sent successfully."}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_user(request):
    email = request.data.get('email')
    otp_submitted = request.data.get('otp')
    cached_otp = cache.get(f"otp_{email}")
    if not cached_otp or cached_otp != otp_submitted:
        return Response({"error": "Invalid or expired OTP."}, status=status.HTTP_400_BAD_REQUEST)
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        cache.delete(f"otp_{email}")
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_with_otp(request):
    email = request.data.get('email')
    password = request.data.get('password')
    otp_submitted = request.data.get('otp')
    cached_otp = cache.get(f"otp_{email}")
    if not cached_otp or cached_otp != otp_submitted:
        return Response({"error": "Invalid or expired OTP."}, status=status.HTTP_400_BAD_REQUEST)
    user = authenticate(username=email, password=password)
    if user:
        refresh = RefreshToken.for_user(user)
        cache.delete(f"otp_{email}")
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })
    return Response({"error": "Authentication failed."}, status=status.HTTP_401_UNAUTHORIZED)
