from django.contrib import admin
from .models import User, Project, CartItem, Purchase

admin.site.register(User)
admin.site.register(Project)
admin.site.register(CartItem)
admin.site.register(Purchase)
