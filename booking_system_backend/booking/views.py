from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from .models import Event, Slot, Booking
from .serializers import EventSerializer, SlotSerializer, BookingSerializer, UserSerializer
from django.db import transaction
from drf_yasg.utils import swagger_auto_schema
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

class RegisterView(APIView):
    permission_classes = []
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['get'], url_path='slots')
    @swagger_auto_schema(
        operation_description="Get all available slots for the event.",
        responses={200: SlotSerializer(many=True)},
    )
    def available_slots(self, request, pk=None):
        event = self.get_object()
        available_slots = Slot.objects.filter(event=event, capacity__gt=0)
        serializer = SlotSerializer(available_slots, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class SlotViewSet(viewsets.ModelViewSet):
    queryset = Slot.objects.all()
    serializer_class = SlotSerializer
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Book a slot for a user",
        responses={201: BookingSerializer, 400: "Bad Request"},
    )
    @action(detail=True, methods=['post'])
    def book(self, request, pk=None):
        slot = self.get_object()
        user = request.user

        with transaction.atomic():
            # Check if the user has already booked the slot
            if Booking.objects.filter(user=user, slot=slot).exists():
                return Response({'detail': 'You have already booked this slot.'},
                                status=status.HTTP_400_BAD_REQUEST)

            # Check if slot capacity is exceeded
            if slot.bookings.count() >= slot.capacity:
                return Response({'detail': 'Slot is fully booked.'},
                                status=status.HTTP_400_BAD_REQUEST)

            # Proceed with booking
            booking = Booking.objects.create(user=user, slot=slot)

            # Broadcast the update to WebSocket clients
            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                'slots_updates',  # Room group name
                {
                    'type': 'slot_update',
                    'message': f'Slot {slot.id} booked, {slot.available_seats} seats remaining.'
                }
            )
            return Response(BookingSerializer(booking).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['delete'])
    def cancel(self, request, pk=None):
        slot = self.get_object()
        user = request.user

        booking = Booking.objects.filter(user=user, slot=slot).first()
        if booking:
            booking.delete()
            return Response({'detail': 'Booking canceled.'}, status=status.HTTP_200_OK)
        return Response({'detail': 'No booking found to cancel.'}, status=status.HTTP_400_BAD_REQUEST)