from rest_framework.decorators import action, api_view, permission_classes
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from django.conf import settings
from .models import User, Project, CartItem, Purchase
from .serializers import UserSerializer, ProjectSerializer, CartItemSerializer, PurchaseSerializer
import razorpay
from django.db.models import Sum
from PIL import Image
import io
from django.core.files.uploadedfile import InMemoryUploadedFile

client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

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

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_user(request):
    email = request.data.get('email')
    name = request.data.get('name', 'Developer')
    password = request.data.get('password')

    if not email or not password:
        return Response({"error": "Email and password are required."}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email=email).exists():
        return Response({"error": "Email already registered."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.create_user(email=email, username=email, name=name, password=password)
        user.is_active = True
        user.save()

        return Response({"message": "Account created successfully."}, status=status.HTTP_201_CREATED)
    except Exception as e:
        print(f"Registration Error: {e}")
        return Response({"error": "An unexpected error occurred during registration."},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)
