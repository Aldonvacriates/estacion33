-- Cleanup: drop the practice table from migration 20260427174732_hello_world.
-- `drop table` cascades to its indexes, so no need to drop them separately.

drop table if exists public._practice_hello;
