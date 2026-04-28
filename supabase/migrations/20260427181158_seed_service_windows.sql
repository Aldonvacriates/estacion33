-- Seed Estación 33 service windows.
-- ISO weekday: 1=Mon … 7=Sun. Restaurant opens Thu(4), Fri(5), Sat(6)
-- 18:30 – 22:30 local time. Mirrors the constants in
-- packages/core/src/service-window.ts.

insert into estacion33.service_windows (dow, opens, closes, active) values
  (4, '18:30', '22:30', true),
  (5, '18:30', '22:30', true),
  (6, '18:30', '22:30', true)
on conflict do nothing;
