from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=100)
    is_admin = models.BooleanField(default=False)

    profile_picture = models.ImageField(upload_to='profiles/', null=True, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email


class Project(models.Model):
    CATEGORY_CHOICES = [
        ('Full Stack', 'Full Stack'),
        ('Frontend', 'Frontend'),
        ('Backend', 'Backend'),
        ('UI Kits', 'UI Kits'),
        ('Mobile Apps', 'Mobile Apps'),
        ('Machine Learning', 'Machine Learning'),
    ]

    title = models.CharField(max_length=250, unique=True)
    subtitle = models.CharField(max_length=250)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(
        max_length=50,
        choices=CATEGORY_CHOICES,
        default='Full Stack'
    )
    description = models.TextField()
    image = models.ImageField(upload_to='images/')
    zip_file = models.FileField(upload_to='projects/')

    def __str__(self):
        return self.title


class CartItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='cart_items')
    project = models.ForeignKey(Project, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('user', 'project')


class Purchase(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='purchases')
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    purchased_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} bought {self.project.title}"
