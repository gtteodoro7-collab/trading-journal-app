## Configuração do Supabase para Trading Journal

Este documento contém os scripts SQL necessários para configurar seu banco de dados Supabase, incluindo as tabelas `accounts` e `trades`, e as políticas de Row Level Security (RLS) para garantir que cada usuário acesse apenas seus próprios dados.

### 1. Criar as Tabelas

Execute os seguintes comandos SQL no seu editor SQL do Supabase (SQL Editor) para criar as tabelas `accounts` e `trades`.

```sql
-- Tabela: accounts
CREATE TABLE public.accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    balance NUMERIC NOT NULL,
    broker TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela: trades
CREATE TABLE public.trades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    account_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE NOT NULL,
    pair TEXT NOT NULL,
    direction TEXT NOT NULL, -- \buy'