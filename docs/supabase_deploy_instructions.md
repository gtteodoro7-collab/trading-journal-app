# Como aplicar a migration e deployar a Edge Function

Abaixo há passos práticos — comece pelo 1. (mais simples) e depois 2. (CLI) quando estiver confortável.

Prerequisitos
- Conta Supabase e projeto criado
- `supabase` CLI instalado (opcional para passo 2)
- Chaves: `SUPABASE_SERVICE_ROLE_KEY` (somente necessário para função) e `WEBHOOK_SECRET` (se usar função)

1) Método rápido (via SQL Editor no painel Supabase)
- Acesse o painel do seu projeto Supabase
- Abra **SQL Editor** → **New query**
- Abra o arquivo `migrations/enable-rls.sql` no repositório e copie todo o conteúdo
- Cole no SQL Editor e clique em **Run**
- Verifique se não houve erros

2) Usando Supabase CLI (recomendado para repetir facilmente)
- Login no cli:

```powershell
supabase login
```

- Linkar seu repositório ao projeto (substitua `<project-ref>`):

```powershell
supabase link --project-ref <project-ref>
```

- Aplicar migration local (opção 1: rodar SQL diretamente via supabase db):
  - Simples: abrir `migrations/enable-rls.sql` e colar no SQL editor (mais seguro)
  - Ou usar `psql` com a `SUPABASE_DB_URL` se preferir uma linha de comando

3) Deploy da Edge Function `set-subscription`
- Configure um arquivo com variáveis para o deploy da função (ex.: `.env.functions`) contendo:

```
SUPABASE_URL=https://<your-project>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
WEBHOOK_SECRET=<your-shared-secret>
```

- Deploy (exemplo):

```powershell
# link ao projeto já feito
supabase functions deploy set-subscription --project-ref <project-ref>
```

- Após deploy, no painel Supabase vá em **Functions** → sua função → **Settings / Environment Variables** e adicione `SUPABASE_SERVICE_ROLE_KEY` e `WEBHOOK_SECRET` (ou use o .env.functions se o CLI suportar).

4) Testar a função via curl (substitua valores):

```powershell
curl -X POST https://<your-project>.functions.supabase.co/set-subscription -H "Content-Type: application/json" -H "X-Webhook-Secret: <your-webhook-secret>" -d "{ \"userId\": \"<user-uuid>\", \"subscribed\": true }"
```

5) Recomendações de segurança
- Nunca exponha `SUPABASE_SERVICE_ROLE_KEY` no cliente. Use sempre variables em funções/servidor.
- Políticas RLS precisam estar ativas para garantir isolamento dos dados.

Se quiser, eu gero um script PowerShell que executa os passos básicos de deploy (só não roda automaticamente aqui)."}**}]}**json_POSTFAILED**