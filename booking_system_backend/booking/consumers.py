import json
from channels.generic.websocket import AsyncWebsocketConsumer

class SlotConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print("test 12345")
        self.room_group_name = 'slots_updates'

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from room group
    async def receive(self, text_data=None, bytes_data=None):
        # print(text_data)
        # data = json.loads(text_data)
        # print(data)
        # message = data["message"]

        # Send message to WebSocket
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "slot_update",
                "message": "message"
            }

        )
    
    async def slot_update(self, event):
        message = event["message"]
        await self.send(text_data=json.dumps({
            "message": "Slots updated"
        }))