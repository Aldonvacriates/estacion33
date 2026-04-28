-- Enable Supabase Realtime on estacion33.orders so the customer's order
-- tracking page updates live when the kitchen flips status (paid →
-- preparing → ready → delivered) without a page refresh.
--
-- Realtime is opt-in per table via the supabase_realtime publication.

alter publication supabase_realtime add table estacion33.orders;
