import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProfileMenu } from "../components/shared/ProfileMenu";
import { Alert } from "../components/ui/Alert";
import { useAuth } from "../hooks/useAuth";
import { useRallyData } from "../hooks/useRallyData";
import { useSelection } from "../hooks/useSelection";
import { cn } from "../utils/cn";
import {
  ALL_STAGE_KEYS,
  getEditionStageKey,
  getStageMetaByKey,
  StageKey
} from "../utils/editionStage";
import { formatDate } from "../utils/formatters";

const statusLabelMap = {
  em_andamento: "Em andamento",
  planejado: "Planejado",
  concluido: "Concluida",
  ativo: "Ativa",
  inativo: "Inativa"
} as const;

const stageToneMap: Record<StageKey, string> = {
  soja: "bg-primary text-light",
  milho: "bg-accent text-dark",
  algodao: "bg-dark text-light"
};

export const EditionSelectionPage = () => {
  const navigate = useNavigate();
  const { currentUserEmail, logout } = useAuth();
  const { data, loading } = useRallyData();
  const { clearSelection, selectedEditionId, selectedYearId, setSelectedEditionId, setSelectedYearId } =
    useSelection();
  const [redirectingStage, setRedirectingStage] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

  const selectedYear = data.years.find((year) => year.id === selectedYearId) ?? null;

  const editionsForYear = useMemo(
    () => data.editions.filter((edition) => edition.anoRallyId === selectedYearId),
    [data.editions, selectedYearId]
  );

  const sortedYears = useMemo(
    () =>
      [...data.years].sort((left, right) => {
        if (left.ativo !== right.ativo) {
          return left.ativo ? -1 : 1;
        }

        return right.ano - left.ano;
      }),
    [data.years]
  );

  const stageOptions = useMemo(
    () =>
      ALL_STAGE_KEYS.map((stage) => {
        const edition = editionsForYear.find((item) => getEditionStageKey(item) === stage) ?? null;

        return {
          stage,
          meta: getStageMetaByKey(stage),
          edition
        };
      }),
    [editionsForYear]
  );

  const selectedStageLabel =
    stageOptions.find((item) => item.edition?.id === selectedEditionId)?.meta.label ?? "--";

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!mobileMenuRef.current?.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isMobileMenuOpen]);

  return (
    <div className="px-4 py-6 sm:px-6 xl:px-8 2xl:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="rounded-[2rem] border border-primary/10 bg-surface p-6 shadow-soft sm:p-8">
          <div className="flex items-start justify-between gap-4 lg:block">
            <div className="min-w-0">
              <h1 className="mt-3 text-4xl font-semibold leading-tight text-dark sm:text-5xl">
                Escolha a edicao e depois a etapa.
              </h1>
            </div>

            <div ref={mobileMenuRef} className="relative shrink-0 sm:hidden">
              <button
                aria-expanded={isMobileMenuOpen}
                aria-haspopup="menu"
                className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/12 bg-light text-dark shadow-soft transition-colors hover:bg-primary/10 hover:text-black"
                onClick={() => setIsMobileMenuOpen((current) => !current)}
                type="button"
              >
                <span className="flex w-5 flex-col gap-1.5">
                  <span className="h-0.5 w-full rounded-full bg-current" />
                  <span className="h-0.5 w-full rounded-full bg-current" />
                  <span className="h-0.5 w-full rounded-full bg-current" />
                </span>
              </button>

              {isMobileMenuOpen ? (
                <div className="absolute right-0 top-[calc(100%+0.75rem)] z-30 w-[17rem] rounded-[1.5rem] border border-primary/10 bg-white p-3 shadow-[0_20px_60px_rgba(24,48,34,0.14)]">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-[1.2rem] border border-primary/10 bg-primary/10 px-4 py-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary/70">
                        Edicao atual
                      </p>
                      <p className="mt-2 text-xl font-semibold text-dark">
                        {selectedYear ? selectedYear.ano : "--"}
                      </p>
                    </div>
                    <div className="rounded-[1.2rem] border border-primary/10 bg-primary/10 px-4 py-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary/70">
                        Etapa atual
                      </p>
                      <p className="mt-2 text-xl font-semibold text-dark">{selectedStageLabel}</p>
                    </div>
                  </div>

                  <div className="mt-3 rounded-[1.1rem] bg-primary/10 px-4 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary/70">
                      Usuario logado
                    </p>
                    <p className="mt-2 break-all text-sm font-medium text-dark">
                      {currentUserEmail ?? "Sem usuario"}
                    </p>
                  </div>

                  <button
                    className="mt-3 flex w-full items-center justify-between rounded-[1.1rem] px-4 py-3 text-left text-sm font-semibold text-dark transition-colors hover:bg-primary/10 hover:text-black"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      clearSelection();
                      logout();
                    }}
                    type="button"
                  >
                    <span>Sair</span>
                    <span className="text-primary">Encerrar sessao</span>
                  </button>
                </div>
              ) : null}
            </div>

            <div className="hidden flex-wrap items-start justify-end gap-3 sm:flex lg:max-w-[30rem]">
              <div className="grid grid-cols-2 gap-3 sm:w-fit">
                <div className="rounded-[1.2rem] border border-primary/10 bg-primary/10 px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary/70">
                    Edicao atual
                  </p>
                  <p className="mt-2 text-xl font-semibold text-dark">
                    {selectedYear ? selectedYear.ano : "--"}
                  </p>
                </div>
                <div className="rounded-[1.2rem] border border-primary/10 bg-primary/10 px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary/70">
                    Etapa atual
                  </p>
                  <p className="mt-2 text-xl font-semibold text-dark">{selectedStageLabel}</p>
                </div>
              </div>

              <ProfileMenu
                className="shrink-0"
                onLogout={() => {
                  clearSelection();
                  logout();
                }}
              />
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[minmax(18rem,21rem)_minmax(0,1fr)]">
          <section className="rounded-[2rem] border border-primary/10 bg-surface p-5 shadow-soft sm:p-6">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                Edicao
              </p>
              <h2 className="text-2xl font-semibold text-dark">Ano do rally</h2>
            </div>

            <div className="mt-6 space-y-3">
              {sortedYears.map((year) => {
                const isSelected = selectedYearId === year.id;

                return (
                  <button
                    key={year.id}
                    className={cn(
                      "w-full rounded-[1.35rem] border px-5 py-5 text-left transition-all",
                      isSelected
                        ? "border-primary bg-primary text-light shadow-[0_16px_32px_rgba(49,112,57,0.18)]"
                        : "border-primary/10 bg-primary/10 text-dark hover:border-primary/30 hover:bg-primary/15"
                    )}
                    onClick={() => setSelectedYearId(year.id)}
                    type="button"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] opacity-70">
                          Edicao
                        </p>
                        <p className="mt-2 text-3xl font-semibold">{year.ano}</p>
                      </div>
                      <span
                        className={cn(
                          "rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em]",
                          isSelected ? "bg-light/10 text-light" : "bg-primary/10 text-primary"
                        )}
                      >
                        {year.ativo ? "ativa" : "historico"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-[2rem] border border-primary/10 bg-surface p-5 shadow-soft sm:p-6">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                Etapa
              </p>
            </div>

            {!selectedYearId ? (
              <div className="mt-6 rounded-[1.4rem] border border-dashed border-primary/15 bg-primary/10 px-5 py-6 text-sm leading-6 text-text/68">
                Selecione primeiro a edicao ao lado.
              </div>
            ) : (
              <div className="mt-6 grid gap-4 lg:grid-cols-3">
                {stageOptions.map(({ stage, meta, edition }) => {
                  const isSelected = selectedEditionId === edition?.id;
                  const isLoading = redirectingStage === stage;

                  return (
                    <button
                      key={stage}
                      className={cn(
                        "flex min-h-[17rem] flex-col rounded-[1.5rem] border p-5 text-left transition-all",
                        edition
                          ? "border-primary/10 bg-primary/10 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/15"
                          : "cursor-not-allowed border-primary/8 bg-primary/5 opacity-55",
                        isSelected && edition && "border-primary bg-primary/15 shadow-soft"
                      )}
                      disabled={!edition || isLoading}
                      onClick={() => {
                        if (!edition) {
                          return;
                        }

                        setRedirectingStage(stage);
                        setSelectedEditionId(edition.id);
                        navigate("/app/dashboard");
                      }}
                      type="button"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <span
                          className={cn(
                            "rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em]",
                            stageToneMap[stage]
                          )}
                        >
                          {meta.label}
                        </span>
                        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text/45">
                          {edition ? "Disponivel" : "Sem cadastro"}
                        </span>
                      </div>

                      <h3 className="mt-5 text-2xl font-semibold text-dark">{meta.label}</h3>
                      <p className="mt-3 text-sm leading-6 text-text/68">{meta.description}</p>

                      <div className="mt-auto rounded-[1.1rem] border border-primary/10 bg-surface px-4 py-4">
                        {edition ? (
                          <div className="space-y-2 text-sm text-text/68">
                            <p className="font-semibold text-dark">{edition.nome}</p>
                            <p>
                              {formatDate(edition.dataInicio)} a {formatDate(edition.dataFim)}
                            </p>
                            <p>Status: {statusLabelMap[edition.status] ?? edition.status}</p>
                            <p className="pt-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                              {isLoading ? "Abrindo dashboard..." : "Selecionar etapa"}
                            </p>
                          </div>
                        ) : (
                          <p className="text-sm leading-6 text-text/60">
                            Nao ha operacao cadastrada para esta etapa nesta edicao.
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {!loading && selectedYearId && editionsForYear.length === 0 ? (
              <div className="mt-6">
                <Alert title="Nenhuma etapa disponivel">
                  Nao existem etapas cadastradas para a edicao selecionada.
                </Alert>
              </div>
            ) : null}
          </section>
        </div>
      </div>
    </div>
  );
};
