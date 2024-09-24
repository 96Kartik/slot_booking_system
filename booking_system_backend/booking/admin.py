from django.contrib import admin
from .models import Event, Slot, Booking

admin.site.register(Event)
admin.site.register(Slot)
admin.site.register(Booking)