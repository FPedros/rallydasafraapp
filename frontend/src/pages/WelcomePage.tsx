import { FormEvent, useEffect, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Alert } from "../components/ui/Alert";
import { Button } from "../components/ui/Button";
import { FormField } from "../components/ui/FormField";
import { Input } from "../components/ui/Input";
import { useAuth } from "../hooks/useAuth";

const AnalyticsBackdrop = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    let frameId = 0;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const draw = (time: number) => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const drift = (time * 0.01) % 48;

      context.clearRect(0, 0, width, height);

      const background = context.createLinearGradient(0, 0, 0, height);
      background.addColorStop(0, "#f8fbf8");
      background.addColorStop(0.58, "#eef3ee");
      background.addColorStop(1, "#e6ede7");
      context.fillStyle = background;
      context.fillRect(0, 0, width, height);

      context.strokeStyle = "rgba(73, 115, 62, 0.08)";
      context.lineWidth = 1;
      for (let x = -48; x <= width + 48; x += 48) {
        context.beginPath();
        context.moveTo(x + drift, 0);
        context.lineTo(x + drift, height);
        context.stroke();
      }

      for (let y = -48; y <= height + 48; y += 48) {
        context.beginPath();
        context.moveTo(0, y + drift * 0.35);
        context.lineTo(width, y + drift * 0.35);
        context.stroke();
      }

      frameId = window.requestAnimationFrame(draw);
    };

    resize();
    frameId = window.requestAnimationFrame(draw);
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" />;
};

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
    <div className="relative min-h-screen overflow-hidden">
      <AnalyticsBackdrop />

      <div className="fixed inset-0 z-20 flex items-center justify-center px-4 py-4 sm:px-6">
        <div
          className="flex-none overflow-auto rounded-4xl border border-primary/15 bg-white p-6 shadow-[0_28px_80px_rgba(24,48,34,0.16)] sm:p-8"
          style={{
            width: "min(24rem, calc(100vw - 2rem))",
            maxHeight: "calc(100vh - 2rem)",
          }}
        >
          <div className="space-y-3 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
              Rally da Safra
            </p>
            <h1 className="text-3xl font-semibold text-dark">Login</h1>
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
