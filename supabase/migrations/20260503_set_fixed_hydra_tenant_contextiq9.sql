-- Sets the newest workspace to the fixed HydraDB tenant for ContextIQ demo/live setup.
-- This avoids touching multiple workspaces and avoids unique conflicts.

with newest_workspace as (
  select id
  from public.workspaces
  order by created_at desc
  limit 1
)
update public.workspaces w
set hydradb_tenant_id = 'workspace_contextIQ9'
from newest_workspace n
where w.id = n.id;
