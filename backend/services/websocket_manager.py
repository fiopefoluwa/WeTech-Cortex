# services/websocket_manager.py
from typing import Dict, List
import json
from fastapi import WebSocket


class DealRoomConnectionManager:
    def __init__(self):
        # Maps deal_id -> List of active WebSockets
        self.active_connections: Dict[int, List[WebSocket]] = {}

    async def connect(self, deal_id: int, websocket: WebSocket):
        await websocket.accept()
        if deal_id not in self.active_connections:
            self.active_connections[deal_id] = []
        self.active_connections[deal_id].append(websocket)

    def disconnect(self, deal_id: int, websocket: WebSocket):
        if deal_id in self.active_connections:
            if websocket in self.active_connections[deal_id]:
                self.active_connections[deal_id].remove(websocket)
            if not self.active_connections[deal_id]:
                del self.active_connections[deal_id]

    async def broadcast_to_deal(self, deal_id: int, message_data: dict):
        if deal_id in self.active_connections:
            # Send to all connected clients in this deal room
            payload = json.dumps(message_data)
            for connection in list(self.active_connections[deal_id]):
                try:
                    await connection.send_text(payload)
                except Exception:
                    # Connection closed or dead
                    self.disconnect(deal_id, connection)


manager = DealRoomConnectionManager()
