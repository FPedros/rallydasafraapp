import { ChangeEvent, FormEvent, ReactNode, useMemo, useState } from "react";
import { Alert } from "../components/ui/Alert";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { FormField } from "../components/ui/FormField";
import { Input } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import { Select } from "../components/ui/Select";
import { useRallyData } from "../hooks/useRallyData";
import { Alimentacao } from "../types/entities";
import { formatCurrency, formatDate } from "../utils/formatters";

const categoryOptions = ["Cafe", "Almoco", "Jantar", "Lanche", "Outros"];

interface ExpenseFormState {
  pessoaId: string;
  data: string;
  valor: string;
  categoria: string;
  descricao: string;
  comprovanteImagem: string;
  comprovanteNome: string;
  comprovanteMimeType: string;
}

const createDefaultFormState = (): ExpenseFormState => ({
  pessoaId: "",
  data: new Date().toISOString().slice(0, 10),
  valor: "",
  categoria: "Almoco",
  descricao: "",
  comprovanteImagem: "",
  comprovanteNome: "",
  comprovanteMimeType: ""
});

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Falha ao ler o comprovante."));
    reader.readAsDataURL(file);
  });

const IconButton = ({
  label,
  onClick,
  children
}: {
  label: string;
  onClick?: () => void;
  children: ReactNode;
}) => (
  <button
    type="button"
    aria-label={label}
    title={label}
    onClick={onClick}
    className="inline-flex h-9 w-9 items-center justify-center rounded-full text-dark transition-colors hover:bg-primary/10"
  >
    {children}
  </button>
);

export const MealsPage = () => {
  const { data, error, saveResource, saving } = useRallyData();
  const [search, setSearch] = useState("");
  const [personFilter, setPersonFilter] = useState("");
  const [teamFilter, setTeamFilter] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<{ src: string; title: string } | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [form, setForm] = useState<ExpenseFormState>(createDefaultFormState());

  const editionTeams = data.teams;
  const teamIds = new Set(editionTeams.map((team) => team.id));
  const editionPeople = data.people.filter((person) => teamIds.has(person.equipeId));

  const filteredPeople = useMemo(() => {
    if (!teamFilter) {
      return editionPeople;
    }

    return editionPeople.filter((person) => person.equipeId === teamFilter);
  }, [editionPeople, teamFilter]);

  const filteredMeals = useMemo(() => {
    return [...data.meals]
      .filter((meal) => {
        if (personFilter && meal.pessoaId !== personFilter) {
          return false;
        }

        if (teamFilter && meal.equipeId !== teamFilter) {
          return false;
        }

        if (!search.trim()) {
          return true;
        }

        const person = editionPeople.find((entry) => entry.id === meal.pessoaId);
        const team = editionTeams.find((entry) => entry.id === meal.equipeId);
        const haystack = [
          meal.descricao,
          meal.categoria,
          person?.nome,
          team?.nome
        ]
          .join(" ")
          .toLowerCase();

        return haystack.includes(search.trim().toLowerCase());
      })
      .sort((left, right) => right.data.localeCompare(left.data));
  }, [data.meals, editionPeople, editionTeams, personFilter, search, teamFilter]);

  const totalAmount = filteredMeals.reduce((sum, meal) => sum + meal.valor, 0);
  const receiptsCount = filteredMeals.filter((meal) => Boolean(meal.comprovanteImagem)).length;
  const pendingReceipts = filteredMeals.length - receiptsCount;

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm(createDefaultFormState());
    setUploadError(null);
  };

  const startCreate = () => {
    setEditingId(null);
    setForm({
      ...createDefaultFormState(),
      pessoaId: personFilter || filteredPeople[0]?.id || editionPeople[0]?.id || ""
    });
    setUploadError(null);
    setIsModalOpen(true);
  };

  const startEdit = (meal: Alimentacao) => {
    setEditingId(meal.id);
    setForm({
      pessoaId: meal.pessoaId,
      data: meal.data,
      valor: String(meal.valor),
      categoria: meal.categoria,
      descricao: meal.descricao,
      comprovanteImagem: meal.comprovanteImagem ?? "",
      comprovanteNome: meal.comprovanteNome ?? "",
      comprovanteMimeType: meal.comprovanteMimeType ?? ""
    });
    setUploadError(null);
    setIsModalOpen(true);
  };

  const handleReceiptChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const imageData = await readFileAsDataUrl(file);
      setForm((previous) => ({
        ...previous,
        comprovanteImagem: imageData,
        comprovanteNome: file.name,
        comprovanteMimeType: file.type
      }));
      setUploadError(null);
    } catch (cause) {
      setUploadError(cause instanceof Error ? cause.message : "Falha ao carregar o comprovante.");
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const person = editionPeople.find((entry) => entry.id === form.pessoaId);

    if (!person) {
      setUploadError("Selecione um participante valido para registrar a despesa.");
      return;
    }

    await saveResource(
      "meals",
      {
        equipeId: person.equipeId,
        pessoaId: person.id,
        data: form.data,
        valor: Number(form.valor || 0),
        categoria: form.categoria,
        descricao: form.descricao,
        comprovanteImagem: form.comprovanteImagem || undefined,
        comprovanteNome: form.comprovanteNome || undefined,
        comprovanteMimeType: form.comprovanteMimeType || undefined
      },
      editingId ?? undefined
    );

    closeModal();
  };

  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.9fr)]">
        <Card className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              Prestacao de contas
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-dark">Despesas individuais da equipe</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-text/70">
              Cada participante pode registrar refeicoes com valor, descricao e comprovante por
              foto. Em celular, o campo de comprovante permite abrir a camera para tirar a foto.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <FormField label="Buscar">
              <Input
                placeholder="Descricao, categoria, pessoa ou equipe"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </FormField>

            <FormField label="Equipe">
              <Select
                value={teamFilter}
                onChange={(event) => {
                  const nextTeam = event.target.value;
                  setTeamFilter(nextTeam);
                  setPersonFilter((current) => {
                    if (!current) {
                      return current;
                    }

                    const person = editionPeople.find((entry) => entry.id === current);
                    return person?.equipeId === nextTeam || !nextTeam ? current : "";
                  });
                }}
              >
                <option value="">Todas as equipes</option>
                {editionTeams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.nome}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="Participante">
              <Select value={personFilter} onChange={(event) => setPersonFilter(event.target.value)}>
                <option value="">Todos os participantes</option>
                {filteredPeople.map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.nome}
                  </option>
                ))}
              </Select>
            </FormField>

            <div className="flex items-end">
              <Button fullWidth variant="accent" onClick={startCreate}>
                Nova despesa
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
          <Card>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/75">
              Total filtrado
            </p>
            <p className="mt-3 text-3xl font-semibold text-dark">{formatCurrency(totalAmount)}</p>
          </Card>
          <Card>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/75">
              Com comprovante
            </p>
            <p className="mt-3 text-3xl font-semibold text-dark">{receiptsCount}</p>
          </Card>
          <Card>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/75">
              Sem comprovante
            </p>
            <p className="mt-3 text-3xl font-semibold text-dark">{pendingReceipts}</p>
          </Card>
        </div>
      </section>

      {error ? <Alert title="Falha de integracao">{error}</Alert> : null}

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold text-dark">Lancamentos</h2>
          <p className="mt-1 text-sm text-text/68">{filteredMeals.length} registro(s).</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
          {filteredMeals.map((meal) => {
            const person = editionPeople.find((entry) => entry.id === meal.pessoaId);
            const team = editionTeams.find((entry) => entry.id === meal.equipeId);

            return (
              <Card key={meal.id} className="flex h-full flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/75">
                      {meal.categoria}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-dark">{formatCurrency(meal.valor)}</h3>
                    <p className="mt-1 text-sm text-text/70">{formatDate(meal.data)}</p>
                  </div>
                  <Badge variant={meal.comprovanteImagem ? "normal" : "warning"}>
                    {meal.comprovanteImagem ? "Com comprovante" : "Sem comprovante"}
                  </Badge>
                </div>

                <div className="space-y-1 text-sm text-text/75">
                  <p>
                    <span className="font-semibold text-dark">Pessoa:</span>{" "}
                    {person?.nome ?? "Nao identificada"}
                  </p>
                  <p>
                    <span className="font-semibold text-dark">Equipe:</span>{" "}
                    {team?.nome ?? "Nao vinculada"}
                  </p>
                </div>

                <p className="rounded-2xl bg-primary/10 px-4 py-4 text-sm leading-6 text-dark">
                  {meal.descricao}
                </p>

                {meal.comprovanteImagem ? (
                  <button
                    className="overflow-hidden rounded-3xl border border-primary/10 bg-primary/10 text-left"
                    onClick={() =>
                      setPreviewImage({
                        src: meal.comprovanteImagem as string,
                        title: meal.comprovanteNome || `Comprovante de ${person?.nome ?? "participante"}`
                      })
                    }
                    type="button"
                  >
                    <img
                      src={meal.comprovanteImagem}
                      alt={meal.comprovanteNome || "Comprovante"}
                      className="h-44 w-full object-cover"
                    />
                    <div className="px-4 py-3 text-sm text-text/72">
                      {meal.comprovanteNome || "Comprovante enviado"}
                    </div>
                  </button>
                ) : (
                  <div className="rounded-3xl border border-dashed border-primary/15 bg-primary/10 px-4 py-6 text-sm text-text/60">
                    Nenhum comprovante anexado.
                  </div>
                )}

                <div className="mt-auto flex flex-wrap justify-end gap-1">
                  <IconButton label="Editar" onClick={() => startEdit(meal)}>
                    <svg
                      aria-hidden="true"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16.862 4.487a2.25 2.25 0 1 1 3.182 3.182L8.25 19.463 3.75 20.25l.787-4.5L16.862 4.487Z"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                      />
                    </svg>
                  </IconButton>
                  {meal.comprovanteImagem ? (
                    <IconButton
                      label="Ver comprovante"
                      onClick={() =>
                        setPreviewImage({
                          src: meal.comprovanteImagem as string,
                          title: meal.comprovanteNome || "Comprovante"
                        })
                      }
                    >
                      <svg
                        aria-hidden="true"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2.25 12s3.75-6.75 9.75-6.75S21.75 12 21.75 12s-3.75 6.75-9.75 6.75S2.25 12 2.25 12Z"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.8"
                        />
                        <path
                          d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.8"
                        />
                      </svg>
                    </IconButton>
                  ) : null}
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      <Modal
        open={isModalOpen}
        onClose={closeModal}
        title={editingId ? "Editar despesa" : "Nova despesa"}
        description="Registre valor, descricao e foto do comprovante para a prestacao de contas."
        size="wide"
      >
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Participante" hint="A equipe sera vinculada automaticamente.">
              <Select
                required
                value={form.pessoaId}
                onChange={(event) =>
                  setForm((previous) => ({ ...previous, pessoaId: event.target.value }))
                }
              >
                <option value="">Selecione</option>
                {editionPeople.map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.nome}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="Categoria">
              <Select
                value={form.categoria}
                onChange={(event) =>
                  setForm((previous) => ({ ...previous, categoria: event.target.value }))
                }
              >
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="Data">
              <Input
                required
                type="date"
                value={form.data}
                onChange={(event) =>
                  setForm((previous) => ({ ...previous, data: event.target.value }))
                }
              />
            </FormField>

            <FormField label="Valor">
              <Input
                required
                inputMode="decimal"
                min="0"
                step="0.01"
                type="number"
                value={form.valor}
                onChange={(event) =>
                  setForm((previous) => ({ ...previous, valor: event.target.value }))
                }
              />
            </FormField>
          </div>

          <FormField label="Descricao" hint="Exemplo: almoco com cliente em Cascavel.">
            <textarea
              className="min-h-28 w-full rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              required
              value={form.descricao}
              onChange={(event) =>
                setForm((previous) => ({ ...previous, descricao: event.target.value }))
              }
            />
          </FormField>

          <FormField
            label="Comprovante"
            hint="Em celular, o sistema pode abrir a camera para fotografar o recibo."
          >
            <div className="space-y-4 rounded-3xl border border-primary/10 bg-primary/10 p-4">
              <input accept="image/*" capture="environment" type="file" onChange={handleReceiptChange} />

              {form.comprovanteImagem ? (
                <div className="overflow-hidden rounded-3xl border border-primary/10 bg-surface">
                  <img
                    src={form.comprovanteImagem}
                    alt={form.comprovanteNome || "Comprovante selecionado"}
                    className="max-h-[24rem] w-full object-contain bg-primary/10"
                  />
                  <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                    <p className="text-sm text-text/70">
                      {form.comprovanteNome || "Comprovante pronto para envio"}
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      className="px-3 py-2"
                      onClick={() =>
                        setForm((previous) => ({
                          ...previous,
                          comprovanteImagem: "",
                          comprovanteNome: "",
                          comprovanteMimeType: ""
                        }))
                      }
                    >
                      Remover comprovante
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-primary/20 bg-primary/10 px-4 py-8 text-center text-sm text-text/65">
                  Tire uma foto ou selecione a imagem do comprovante.
                </div>
              )}
            </div>
          </FormField>

          {uploadError ? <Alert title="Falha ao preparar comprovante">{uploadError}</Alert> : null}

          <div className="flex flex-wrap justify-end gap-3">
            <Button type="submit" disabled={saving}>
              {editingId ? "Salvar alteracoes" : "Registrar despesa"}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={Boolean(previewImage)}
        onClose={() => setPreviewImage(null)}
        title={previewImage?.title ?? "Comprovante"}
        size="wide"
      >
        {previewImage ? (
          <div className="overflow-hidden rounded-3xl border border-primary/10 bg-primary/10">
            <img src={previewImage.src} alt={previewImage.title} className="w-full object-contain" />
          </div>
        ) : null}
      </Modal>
    </div>
  );
};
