import React, { useState, useEffect } from 'react';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.headers = {Authorization: `Bearer ${localStorage.getItem('token')}`}

const Booking = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [slots, setSlots] = useState([]);

  // Fetch events
  useEffect(() => {
    axios.get('/api/events/')
      .then(response => setEvents(response.data))
      .catch(error => console.log(error));
    axios.get('/api/bookin/')
      .then(response => setEvents(response.data))
      .catch(error => console.log(error));
  }, []);

  // Fetch slots when an event is selected
  const fetchSlots = (eventId) => {
    axios.get(`/api/events/${eventId}/slots/`)
      .then(response => setSlots(response.data))
      .catch(error => console.log(error));
  };

  const handleEventSelect = (eventId) => {
    setSelectedEvent(eventId);
    fetchSlots(eventId);
  };

  const formatTimeToAMPM = (timeString) => {
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // 0 becomes 12
    const formattedTime = `${formattedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}} ${period}`;
  
    return formattedTime;
  }

  // Handle WebSocket for real-time updates
  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8000/ws/slots/');
    // socket.onmessage('update_slots', (data) => {
    //   fetchSlots(selectedEvent);  // Refresh slot list on update
    // });

    // return () => socket.disconnect();
    socket.onmessage = function(e) {
        console.log('Message from server:', e);
        fetchSlots(selectedEvent);
    };
    
    socket.onopen = function(e) {
        socket.send('Hello from client!', e["message"]);
    };
    
    return () => socket.close();
  }, [selectedEvent]);

  return (
    <div>
    <h1>My Bookings</h1>
      
        {events.map(event => (
          <li key={event.id} onClick={() => handleEventSelect(event.id)}>
            {event.name}
          </li>
        ))}
      
      <h1>Select Event</h1>
 
        {events.map(event => (
          <li key={event.id} onClick={() => handleEventSelect(event.id)}>
            {event.name}
          </li>
        ))}
  

      {slots.length > 0 && (
        <div>
          <h2>Available Slots</h2>
          <ul>
            {slots.map(slot => (
              <li key={slot.id}>
                {formatTimeToAMPM(slot.start_time)} - {formatTimeToAMPM(slot.end_time)} ({slot.available_seats} seats available)
                <button onClick={() => bookSlot(slot.id)}>Book</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const bookSlot = (slotId) => {
  axios.post(`/api/slots/${slotId}/book/`)
    .then(response => alert('Booking successful!'))
    .catch(error => {
        console.log(error && error.response && error.response.data && error.response.data.detail, error.response.data.detail) 
        alert(error["message"])
    });
};

export default Booking;