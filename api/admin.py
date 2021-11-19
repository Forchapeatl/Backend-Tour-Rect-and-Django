from django.contrib import admin

from api.models import Package, PackagePermission, WishlistItem, Booking

class PackagePermissionInline(admin.TabularInline):
    model = PackagePermission

class PackageAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'category', 'price', 'rating', 'tour_length', 'start')
    inlines = (PackagePermissionInline,)

class WishlistItemAdmin(admin.ModelAdmin):
    model = WishlistItem

class BookingAdmin(admin.ModelAdmin):
    model = Booking

admin.site.register(Package, PackageAdmin)
admin.site.register(WishlistItem, WishlistItemAdmin)
# admin.site.register(Booking, BookingAdmin)