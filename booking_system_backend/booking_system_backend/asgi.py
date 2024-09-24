import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter  
from booking.consumers import SlotConsumer
from django.urls import path

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'booking_system_backend.settings')
django_asgi_app = get_asgi_application() 

application = ProtocolTypeRouter({
    "http": django_asgi_app,  # Handles regular HTTP/HTTPS traffic
    "websocket": URLRouter([path('ws/slots/', SlotConsumer.as_asgi())])
})