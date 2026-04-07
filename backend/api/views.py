from rest_framework.decorators import action, api_view, permission_classes
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from django.conf import settings
from .models import User, Project, CartItem, Purchase
from .serializers import UserSerializer, ProjectSerializer, CartItemSerializer, PurchaseSerializer
import razorpay
from django.db.models import Sum
from django.core.mail import EmailMultiAlternatives
from rest_framework_simplejwt.tokens import RefreshToken
from PIL import Image
import io
import sys
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
import socket

client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))


old_getaddrinfo = socket.getaddrinfo
def new_getaddrinfo(*args, **kwargs):
    responses = old_getaddrinfo(*args, **kwargs)
    return [response for response in responses if response[0] == socket.AF_INET]
socket.getaddrinfo = new_getaddrinfo


def compress_image_to_webp(image_file):
    if not image_file:
        return None
    try:
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
            output, 'ImageField', new_filename, 'image/webp', image_size, None
        )
        return webp_file
    except Exception as e:
        print(f"Image Compression Error: {e}")
        return None


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def create(self, request, *args, **kwargs):
        try:
            data = {key: value for key, value in request.data.items()}
            if 'image' in request.FILES:
                data['image'] = compress_image_to_webp(request.FILES['image'])
            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except Exception as e:
            return Response({"error": "Failed to create project. Please check your data."},
                            status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        try:
            partial = kwargs.pop('partial', False)
            instance = self.get_object()
            data = {key: value for key, value in request.data.items()}
            if 'image' in request.FILES:
                data['image'] = compress_image_to_webp(request.FILES['image'])
            serializer = self.get_serializer(instance, data=data, partial=partial)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": "Failed to update project."}, status=status.HTTP_400_BAD_REQUEST)


class CartItemViewSet(viewsets.ModelViewSet):
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CartItem.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        try:
            project_id = request.data.get('project_id')
            cart_item, created = CartItem.objects.get_or_create(
                user=request.user,
                project_id=project_id
            )
            serializer = self.get_serializer(cart_item)
            if created:
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": "Could not add item to cart."}, status=status.HTTP_400_BAD_REQUEST)

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

        try:
            razorpay_order = client.order.create(data=order_data)
            return Response({
                "order_id": razorpay_order['id'],
                "amount": amount_in_paise,
                "currency": "INR"
            }, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"Razorpay Order Error: {e}")
            return Response({"error": "Payment gateway is currently down. Please try again later."},
                            status=status.HTTP_503_SERVICE_UNAVAILABLE)

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
            return Response({"error": "Payment verification failed. Invalid signature."},
                            status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(f"Checkout Error: {e}")
            return Response({"error": "An error occurred while finalizing your purchase. Please contact support."},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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
        try:
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
        except Exception as e:
            return Response({"error": "Failed to update profile."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    serializer = UserSerializer(request.user)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.IsAdminUser])
def get_admin_stats(request):
    try:
        total_revenue = Purchase.objects.aggregate(total=Sum('project__price'))['total']
        if total_revenue is None:
            total_revenue = 0.00
        total_customers = Purchase.objects.values('user').distinct().count()
        return Response({
            "total_revenue": float(total_revenue),
            "total_customers": total_customers
        })
    except Exception as e:
        return Response({"error": "Could not load stats."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



def send_magic_link(user, action_type):
    """
    Returns True if email sent successfully, False otherwise.
    """
    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:5173')
    link = f"{frontend_url}/verify-auth?uid={uid}&token={token}&action={action_type}"
    subject = "Verify your Mkode account"

    html_content = f"""
    <div style="font-family: Arial, sans-serif; max-width: 400px; margin: auto; text-align: center; padding: 40px; border: 1px solid #eee; border-radius: 24px;">
        <h1 style="color: #111827; margin-bottom: 20px;">M<span style="color: #2563EB;">KODE</span></h1>
        <p style="color: #4B5563; font-size: 16px; line-height: 1.5;">Hi {user.name}, click the button below to verify your identity and access your account.</p>
        <a href="{link}" style="display: inline-block; background: #2563EB; color: white; padding: 16px 32px; text-decoration: none; border-radius: 14px; font-weight: bold; margin-top: 24px; box-shadow: 0 10px 15px rgba(37, 99, 235, 0.2);">Verify Account</a>
        <p style="color: #9CA3AF; font-size: 12px; margin-top: 30px;">This link will expire in 24 hours.</p>
    </div>
    """

    try:
        msg = EmailMultiAlternatives(subject, f"Verify here: {link}", settings.EMAIL_HOST_USER, [user.email])
        msg.attach_alternative(html_content, "text/html")
        msg.send(fail_silently=False)
        return True
    except Exception as e:
        print(f"SMTP EMAIL ERROR: {e}")
        return False


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def request_access(request):
    email = request.data.get('email')
    action_type = request.data.get('action')

    if not email:
        return Response({"error": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)

    if action_type == 'register':
        if User.objects.filter(email=email).exists():
            return Response({"error": "Email already registered."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            name = request.data.get('name', 'Developer')
            password = request.data.get('password')
            user = User.objects.create_user(email=email, username=email, name=name, password=password)
            user.is_active = False
            user.save()

            if send_magic_link(user, action_type):
                return Response({"message": "Verification link sent to email."})
            else:
                user.delete()
                return Response({"error": "We couldn't send the email right now. Please try again later."},
                                status=status.HTTP_503_SERVICE_UNAVAILABLE)
        except Exception as e:
            return Response({"error": "An unexpected error occurred during registration."},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    if action_type == 'reset_password':
        try:
            user = User.objects.get(email=email)
            if send_magic_link(user, action_type):
                return Response({"message": "Verification link sent to email."})
            else:
                return Response({"error": "Failed to send reset email. Please try again later."},
                                status=status.HTTP_503_SERVICE_UNAVAILABLE)
        except User.DoesNotExist:
            return Response({"error": "Account not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": "An unexpected error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response({"error": "Invalid action type."}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def verify_access(request):
    uidb64 = request.data.get('uid')
    token = request.data.get('token')
    action_type = request.data.get('action')
    new_password = request.data.get('new_password')

    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        return Response({"error": "Invalid or expired verification link."}, status=status.HTTP_400_BAD_REQUEST)

    if default_token_generator.check_token(user, token):
        try:
            if action_type == 'register':
                user.is_active = True
            if action_type == 'reset_password' and new_password:
                user.set_password(new_password)
            user.save()

            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': UserSerializer(user).data
            })
        except Exception as e:
            return Response({"error": "Failed to authenticate account. Please contact support."},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response({"error": "Verification link is invalid or has expired."}, status=status.HTTP_400_BAD_REQUEST)
