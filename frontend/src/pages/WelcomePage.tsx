import { FormEvent, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Alert } from "../components/ui/Alert";
import { Button } from "../components/ui/Button";
import { FormField } from "../components/ui/FormField";
import { Input } from "../components/ui/Input";
import { useAuth } from "../hooks/useAuth";

export const WelcomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();
  const [email, setEmail] = useState("teste@agroconsult.com.br");
  const [password, setPassword] = useState("agro2026");
  const [error, setError] = useState<string | null>(null);

  if (isAuthenticated) {
    return <Navigate to="/select-edition" replace />;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isValid = login({ email, password });

    if (!isValid) {
      setError("Credenciais invalidas. Use o acesso de demonstracao informado na tela.");
      return;
    }

    setError(null);
    navigate("/select-edition", { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8 sm:px-6">
      <div className="w-full max-w-md">
        <div
          className="overflow-auto rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8"
          style={{ maxHeight: "calc(100vh - 2rem)" }}
        >
          <div className="space-y-2 text-center">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
              Rally da Safra
            </p>
            <h1 className="text-3xl font-semibold text-foreground">Entrar</h1>
            <p className="text-sm text-muted-foreground">
              Acesse a operacao com a linguagem visual padrao do shadcn.
            </p>
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <FormField label="Email">
              <Input
                autoComplete="username"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </FormField>

            <FormField label="Senha">
              <Input
                autoComplete="current-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </FormField>

            {error ? (
              <Alert title="Acesso negado" variant="critical">
                {error}
              </Alert>
            ) : null}

            <Button fullWidth type="submit">
              Entrar
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
