from django.db import models
from django.contrib.auth.models import User

class Event(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    date = models.DateField()

    def __str__(self):
        return self.name

class Slot(models.Model):
    event = models.ForeignKey(Event, related_name='slots', on_delete=models.CASCADE)
    start_time = models.TimeField()
    end_time = models.TimeField()
    capacity = models.PositiveIntegerField()

    @property
    def available_seats(self):
        # Count the number of bookings associated with this slot
        booked_seats = Booking.objects.filter(slot=self).count()
        return self.capacity - booked_seats

    def __str__(self):
        return f'{self.event.name} ({self.start_time}-{self.end_time})'

class Booking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    slot = models.ForeignKey(Slot, related_name='bookings', on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'slot')  # Prevents double bookings

    def __str__(self):
        return f'{self.user.username} booked {self.slot}'