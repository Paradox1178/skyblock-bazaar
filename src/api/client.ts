const API_BASE = 'https://api.dev-dave.de/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

// === PLAYER ===

export interface ApiPlayer {
  id: number;
  username: string;
  shop_name: string | null;
  shop_coordinates: string | null;
  joined_at: string;
  shopItems: { item_id: string; price: number }[];
}

export function loginPlayer(username: string): Promise<ApiPlayer> {
  return request('/players/login', {
    method: 'POST',
    body: JSON.stringify({ username }),
  });
}

export function updatePlayer(
  id: number,
  data: { shop_name?: string; shop_coordinates?: string }
): Promise<{ success: boolean }> {
  return request(`/players/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// === SHOP ITEMS ===

export function addPlayerItem(
  playerId: number,
  item_id: string,
  price: number
): Promise<{ success: boolean }> {
  return request(`/players/${playerId}/items`, {
    method: 'POST',
    body: JSON.stringify({ item_id, price }),
  });
}

export function removePlayerItem(
  playerId: number,
  itemId: string
): Promise<{ success: boolean }> {
  return request(`/players/${playerId}/items/${itemId}`, {
    method: 'DELETE',
  });
}

// === SHOPS (public) ===

export interface ApiShopListing {
  id: number;
  item_id: string;
  price: number;
  created_at: string;
  owner_name: string;
  shop_name: string;
  coordinates: string | null;
}

export function getAllShops(): Promise<ApiShopListing[]> {
  return request('/shops');
}

export function getShopsForItem(itemId: string): Promise<ApiShopListing[]> {
  return request(`/shops/item/${itemId}`);
}

// === PRICE HISTORY ===

export interface ApiPriceHistory {
  id: number;
  item_id: string;
  avg_price: number;
  low_price: number;
  high_price: number;
  shop_count: number;
  recorded_at: string;
}

export function getPriceHistory(itemId: string): Promise<ApiPriceHistory[]> {
  return request(`/price-history/${itemId}`);
}

export function recordPriceSnapshot(
  itemId: string,
  data: { avg_price: number; low_price: number; high_price: number; shop_count: number }
): Promise<{ success: boolean }> {
  return request(`/price-history/${itemId}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// === FEEDBACK ===

export type FeedbackStatus = 'eingereicht' | 'gesehen' | 'beantwortet' | 'geaendert' | 'kein_fehler';

export interface ApiFeedback {
  id: number;
  player_id: number;
  player_name: string;
  item_id: string | null;
  category: string;
  message: string;
  status: FeedbackStatus;
  admin_response: string | null;
  created_at: string;
  updated_at: string;
}

export function submitFeedback(
  playerId: number,
  data: { item_id?: string; category: string; message: string }
): Promise<{ success: boolean; id: number }> {
  return request(`/feedback`, {
    method: 'POST',
    body: JSON.stringify({ player_id: playerId, ...data }),
  });
}

export function getPlayerFeedback(playerId: number): Promise<ApiFeedback[]> {
  return request(`/feedback/player/${playerId}`);
}

export function getAllFeedback(): Promise<ApiFeedback[]> {
  return request(`/feedback`);
}

export function updateFeedbackStatus(
  feedbackId: number,
  data: { status: FeedbackStatus; admin_response?: string }
): Promise<{ success: boolean }> {
  return request(`/feedback/${feedbackId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function getPlayerUnreadFeedbackCount(playerId: number): Promise<{ count: number }> {
  return request(`/feedback/player/${playerId}/unread`);
}

export interface ApiFeedbackMessage {
  id: number;
  feedback_id: number;
  sender_type: 'player' | 'admin';
  message: string;
  created_at: string;
}

export function getFeedbackMessages(feedbackId: number): Promise<ApiFeedbackMessage[]> {
  return request(`/feedback/${feedbackId}/messages`);
}

export function sendFeedbackReply(
  feedbackId: number,
  senderType: 'player' | 'admin',
  message: string,
  playerId?: number
): Promise<{ success: boolean }> {
  return request(`/feedback/${feedbackId}/reply`, {
    method: 'POST',
    body: JSON.stringify({ sender_type: senderType, message, player_id: playerId }),
  });
}
