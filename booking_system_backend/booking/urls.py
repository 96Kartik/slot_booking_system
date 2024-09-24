from rest_framework.routers import DefaultRouter
from .views import EventViewSet, SlotViewSet
from django.urls import path

router = DefaultRouter()
router.register(r'events', EventViewSet)
router.register(r'slots', SlotViewSet)

urlpatterns = router.urls