# deploy_supabase.ps1 - helper script (Windows PowerShell)
# WARNING: this script only runs supabase CLI commands; ensure you have supabase CLI installed and logged in.

param(
  [string]$projectRef
)

if (-not $projectRef) {
  Write-Host "Usage: .\deploy_supabase.ps1 -projectRef <project-ref>"
  exit 1
}

Write-Host "Linking project..."
supabase link --project-ref $projectRef

Write-Host "NOTE: apply migrations manually via SQL editor or via your migration tooling."
Write-Host "Deploying Edge Function set-subscription..."
supabase functions deploy set-subscription --project-ref $projectRef

Write-Host "Done. Remember to set SUPABASE_SERVICE_ROLE_KEY and WEBHOOK_SECRET in the function settings."