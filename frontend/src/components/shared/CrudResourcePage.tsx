import { FormEvent, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useRallyData } from "../../hooks/useRallyData";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { FormField } from "../ui/FormField";
import { Badge } from "../ui/Badge";
import { Alert } from "../ui/Alert";
import { PageSection } from "./PageSection";
import { ResourcePageConfig } from "../../pages/resourceDefinitions";
import { cn } from "../../utils/cn";
import { useSelection } from "../../hooks/useSelection";
import { Modal } from "../ui/Modal";

type FormValue = string | number | boolean | string[];
type FormState = Record<string, FormValue>;

const IconButton = ({
  label,
  onClick,
  children
}: {
  label: string;
  onClick?: () => void;
  children: React.ReactNode;
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

const toInputValue = (value: unknown): FormValue => {
  if (Array.isArray(value)) {
    return value.filter((entry): entry is string => typeof entry === "string");
  }

  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    return value;
  }

  return "";
};

export const CrudResourcePage = ({ config }: { config: ResourcePageConfig }) => {
  const { data, deleteResource, error, saveResource, saving } = useRallyData();
  const { selectedEditionId } = useSelection();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [formValues, setFormValues] = useState<FormState>(config.defaults(data));

  const items = data[config.resource] as unknown as Array<Record<string, unknown>>;
  const editingItem = useMemo(
    () => items.find((item) => String(item.id) === editingId),
    [editingId, items]
  );

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const isPeopleResource = config.resource === "people";
  const isHotelsResource = config.resource === "hotels";

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = config.searchKeys.some((key) =>
        String(item[key] ?? "")
          .toLowerCase()
          .includes(search.toLowerCase())
      );

      if (!matchesSearch) {
        return false;
      }

      return config.filters.every((filter) => {
        const currentValue = filters[filter.name];

        if (!currentValue) {
          return true;
        }

        if (filter.type === "date-from") {
          return String(item[filter.target ?? filter.name] ?? "") >= currentValue;
        }

        if (filter.type === "date-to") {
          return String(item[filter.target ?? filter.name] ?? "") <= currentValue;
        }

        return String(item[filter.target ?? filter.name] ?? "") === currentValue;
      });
    });
  }, [config, filters, items, search]);

  const startCreate = () => {
    setEditingId(null);
    setFormValues(config.defaults(data));
    setIsModalOpen(true);
  };

  const peopleFiltersToolbar = (
    <div className="flex w-full flex-col gap-3 xl:flex-row xl:flex-wrap xl:items-end xl:justify-end">
      <div className="min-w-0 xl:w-[24rem]">
        <FormField label="Busca rapida">
          <Input
            placeholder={config.searchPlaceholder}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </FormField>
      </div>

      {config.filters
        .filter((filter) => filter.name === "equipeId")
        .map((filter) => (
          <div key={filter.name} className="xl:w-[15rem]">
            <FormField label={filter.label}>
              <Select
                value={filters[filter.name] ?? ""}
                onChange={(event) =>
                  setFilters((previous) => ({
                    ...previous,
                    [filter.name]: event.target.value
                  }))
                }
              >
                <option value="">Todas as equipes</option>
                {filter.options(data).map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </FormField>
          </div>
        ))}

      <div className="xl:w-[13rem]">
        <FormField label="Responsavel">
          <Select
            value={filters.isResponsavel ?? ""}
            onChange={(event) =>
              setFilters((previous) => ({
                ...previous,
                isResponsavel: event.target.value
              }))
            }
          >
            <option value="">Todos</option>
            <option value="true">Responsaveis</option>
            <option value="false">Apoio</option>
          </Select>
        </FormField>
      </div>

      <div className="flex flex-wrap gap-2 xl:pb-px">
        <Button
          type="button"
          variant="ghost"
          className="px-3 py-2"
          onClick={() => {
            setSearch("");
            setFilters({});
          }}
        >
          Limpar
        </Button>
        <Button type="button" variant="accent" className="px-4 py-2" onClick={startCreate}>
          Novo cadastro
        </Button>
      </div>
    </div>
  );

  const defaultFiltersToolbar = (
    <div className="flex w-full flex-col gap-3 xl:flex-row xl:flex-wrap xl:items-end xl:justify-end">
      <div className="min-w-0 xl:w-[24rem]">
        <FormField label="Busca rapida">
          <Input
            placeholder={config.searchPlaceholder}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </FormField>
      </div>

      {config.filters.map((filter) => (
        <div key={filter.name} className="xl:w-[15rem]">
          <FormField label={filter.label}>
            {filter.type === "select" ? (
              <Select
                value={filters[filter.name] ?? ""}
                onChange={(event) =>
                  setFilters((previous) => ({
                    ...previous,
                    [filter.name]: event.target.value
                  }))
                }
              >
                <option value="">Todos</option>
                {filter.options(data).map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            ) : (
              <Input
                type="date"
                value={filters[filter.name] ?? ""}
                onChange={(event) =>
                  setFilters((previous) => ({
                    ...previous,
                    [filter.name]: event.target.value
                  }))
                }
              />
            )}
          </FormField>
        </div>
      ))}

      <div className="flex flex-wrap gap-2 xl:pb-px">
        <Button
          type="button"
          variant="ghost"
          className="px-3 py-2"
          onClick={() => {
            setSearch("");
            setFilters({});
          }}
        >
          Limpar
        </Button>
        <Button type="button" variant="accent" className="px-4 py-2" onClick={startCreate}>
          Novo cadastro
        </Button>
      </div>
    </div>
  );

  const startEdit = (item: Record<string, unknown>) => {
    setEditingId(String(item.id));
    const nextValues = config.fields.reduce(
      (accumulator: FormState, field) => ({
        ...accumulator,
        [field.name]:
          config.resource === "teams" && field.name === "pessoaIds"
            ? data.people
                .filter((person) => person.equipeId === item.id)
                .map((person) => person.id)
            : toInputValue(item[field.name])
      }),
      config.defaults(data) as FormState
    );
    setFormValues(nextValues);
    setIsModalOpen(true);
  };

  const parseValues = () => {
    const baseValues = editingItem ? { ...editingItem } : config.defaults(data);
    const parsed = config.fields.reduce<Record<string, unknown>>((accumulator, field) => {
      const currentValue = formValues[field.name];

      if (field.type === "number") {
        accumulator[field.name] = Number(currentValue || 0);
      } else if (field.type === "multiselect") {
        accumulator[field.name] = Array.isArray(currentValue) ? currentValue : [];
      } else if (field.type === "checkbox") {
        accumulator[field.name] = Boolean(currentValue);
      } else {
        accumulator[field.name] = currentValue;
      }

      return accumulator;
    }, { ...baseValues });

    if (selectedEditionId && ["cars", "teams", "routes", "hotels", "alerts"].includes(config.resource)) {
      parsed.edicaoId = selectedEditionId;
    }

    return parsed;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await saveResource(config.resource, parseValues(), editingId ?? undefined);
    setEditingId(null);
    setFormValues(config.defaults(data));
    closeModal();
  };

  const handleDelete = async (id: string) => {
    await deleteResource(config.resource, id);
    if (editingId === id) {
      setFormValues(config.defaults(data));
      closeModal();
    }
  };

  const toggleMultiSelectValue = (fieldName: string, optionValue: string) => {
    setFormValues((previous) => {
      const currentValue = previous[fieldName];
      const selectedValues = Array.isArray(currentValue) ? currentValue : [];
      const nextValues = selectedValues.includes(optionValue)
        ? selectedValues.filter((value) => value !== optionValue)
        : [...selectedValues, optionValue];

      return {
        ...previous,
        [fieldName]: nextValues
      };
    });
  };

  return (
    <div className="space-y-6">
      {error ? <Alert title="Falha de integracao">{error}</Alert> : null}

      <PageSection
        title={`${config.title} cadastrados`}
        description={`${filteredItems.length} registro(s) disponivel(is).`}
        action={isPeopleResource ? peopleFiltersToolbar : defaultFiltersToolbar}
      >
        {isPeopleResource ? (
          <Card className="overflow-hidden p-0">
            <div className="hidden grid-cols-[1.2fr_1fr_1.2fr_1fr_1.4fr_0.8fr_1fr] gap-4 border-b border-primary/10 bg-primary/10 px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-text/70 xl:grid">
              <p>Nome</p>
              <p>Cargo</p>
              <p>Equipe</p>
              <p>Telefone</p>
              <p>Email</p>
              <p>Status</p>
              <p className="text-right">Acoes</p>
            </div>
            <div className="divide-y divide-primary/10">
              {filteredItems.map((item) => {
                const team = data.teams.find((entry) => entry.id === item.equipeId);
                const isResponsible = Boolean(item.isResponsavel);

                return (
                  <div
                    key={String(item.id)}
                    className="grid gap-4 px-4 py-4 sm:px-5 xl:grid-cols-[1.2fr_1fr_1.2fr_1fr_1.4fr_0.8fr_1fr] xl:items-center"
                  >
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text/55 xl:hidden">
                        Nome
                      </p>
                      <p className="text-base font-bold text-dark">{String(item.nome)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text/55 xl:hidden">
                        Cargo
                      </p>
                      <p className="text-sm text-text/80">{String(item.cargo)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text/55 xl:hidden">
                        Equipe
                      </p>
                      <p className="text-sm text-text/80">{team?.nome ?? "Nao vinculada"}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text/55 xl:hidden">
                        Telefone
                      </p>
                      <p className="text-sm text-text/80">{String(item.telefone)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text/55 xl:hidden">
                        Email
                      </p>
                      <p className="break-all text-sm text-text/80">{String(item.email)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text/55 xl:hidden">
                        Status
                      </p>
                      {isResponsible ? (
                        <Badge variant="warning">responsavel</Badge>
                      ) : (
                        <span className="text-sm text-text/70">apoio</span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 xl:justify-end">
                      <Button variant="ghost" className="px-3 py-2" onClick={() => startEdit(item)}>
                        Editar
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        ) : isHotelsResource ? (
          <Card className="overflow-hidden p-0">
            <div className="hidden grid-cols-[1.2fr_0.9fr_1.6fr_0.9fr_1.2fr_0.9fr] gap-4 border-b border-primary/10 bg-primary/10 px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-text/70 xl:grid">
              <p>Hotel</p>
              <p>Local</p>
              <p>Endereco</p>
              <p>Telefone</p>
              <p>Observacoes</p>
              <p className="text-right">Acoes</p>
            </div>
            <div className="divide-y divide-primary/10">
              {filteredItems.map((item) => (
                <div
                  key={String(item.id)}
                  className="grid gap-4 px-4 py-4 sm:px-5 xl:grid-cols-[1.2fr_0.9fr_1.6fr_0.9fr_1.2fr_0.9fr] xl:items-center"
                >
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text/55 xl:hidden">
                      Hotel
                    </p>
                    <p className="text-base font-bold text-dark">{String(item.nome)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text/55 xl:hidden">
                      Local
                    </p>
                    <p className="text-sm text-text/80">
                      {String(item.cidade)}/{String(item.estado)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text/55 xl:hidden">
                      Endereco
                    </p>
                    <p className="text-sm text-text/80">{String(item.endereco)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text/55 xl:hidden">
                      Telefone
                    </p>
                    <p className="text-sm text-text/80">{String(item.telefone)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text/55 xl:hidden">
                      Observacoes
                    </p>
                    <p className="text-sm text-text/80">
                      {String(item.observacoes || "Sem observacoes")}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 xl:justify-end">
                    <Button variant="ghost" className="px-3 py-2" onClick={() => startEdit(item)}>
                      Editar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {filteredItems.map((item) => {
              const card = config.card(item, data);

              return (
                <Card key={String(item.id)} className="flex h-full flex-col gap-4 p-4 xl:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-lg font-bold text-dark">{card.title}</h3>
                      {card.subtitle ? (
                        <p className="mt-1 truncate text-sm text-text/70">{card.subtitle}</p>
                      ) : null}
                    </div>
                    {card.badge ? <Badge variant={card.badge}>{card.badge}</Badge> : null}
                  </div>

                  <div className="grid gap-x-4 gap-y-2 text-sm text-text/80 sm:grid-cols-2">
                    {card.details.map((detail) => (
                      <p key={detail} className="leading-6">
                        {detail}
                      </p>
                    ))}
                  </div>

                  {card.highlight ? (
                    <p className="rounded-2xl bg-primary/10 px-3 py-3 text-sm font-medium leading-6 text-dark">
                      {card.highlight}
                    </p>
                  ) : null}

                  <div className="mt-auto flex items-center justify-end gap-2 border-t border-primary/10 pt-4">
                    <div className="flex flex-wrap justify-end gap-1">
                      {card.detailPath ? (
                        <Link to={card.detailPath}>
                          <IconButton label="Detalhes">
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
                        </Link>
                      ) : null}
                      <IconButton label="Editar" onClick={() => startEdit(item)}>
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
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </PageSection>

      <Modal
        open={isModalOpen}
        onClose={closeModal}
        title={editingId ? "Editar registro" : `Novo ${config.singularLabel.toLowerCase()}`}
        description={config.formDescription}
        size="wide"
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            {config.fields.map((field) => {
              if (field.type === "checkbox") {
                return (
                  <label
                    key={field.name}
                    className="flex min-h-11 items-center gap-3 rounded-2xl border border-primary/15 bg-primary/10 px-4 py-3 text-sm text-dark md:col-span-2"
                  >
                    <input
                      type="checkbox"
                      checked={Boolean(formValues[field.name])}
                      onChange={(event) =>
                        setFormValues((previous) => ({
                          ...previous,
                          [field.name]: event.target.checked
                        }))
                      }
                    />
                    {field.label}
                  </label>
                );
              }

              return (
                <div key={field.name} className={cn(field.fullWidth && "md:col-span-2")}>
                  <FormField label={field.label} hint={field.hint}>
                    {field.type === "select" ? (
                      <Select
                        value={String(formValues[field.name] ?? "")}
                        onChange={(event) =>
                          setFormValues((previous) => ({
                            ...previous,
                            [field.name]: event.target.value
                          }))
                        }
                        required={field.required}
                      >
                        <option value="">Selecione</option>
                        {field.options?.(data).map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Select>
                    ) : field.type === "multiselect" ? (
                      <div className="space-y-3 rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3">
                        {field.options?.(data).map((option) => {
                          const selectedValues = Array.isArray(formValues[field.name])
                            ? (formValues[field.name] as string[])
                            : [];

                          return (
                            <label
                              key={option.value}
                              className="flex items-start gap-3 text-sm text-text"
                            >
                              <input
                                type="checkbox"
                                checked={selectedValues.includes(option.value)}
                                onChange={() => toggleMultiSelectValue(field.name, option.value)}
                              />
                              <span>{option.label}</span>
                            </label>
                          );
                        })}
                      </div>
                    ) : field.type === "textarea" ? (
                      <textarea
                        className="min-h-28 w-full rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        value={String(formValues[field.name] ?? "")}
                        onChange={(event) =>
                          setFormValues((previous) => ({
                            ...previous,
                            [field.name]: event.target.value
                          }))
                        }
                      />
                    ) : (
                      <Input
                        type={field.type}
                        required={field.required}
                        value={String(formValues[field.name] ?? "")}
                        onChange={(event) =>
                          setFormValues((previous) => ({
                            ...previous,
                            [field.name]: event.target.value
                          }))
                        }
                      />
                    )}
                  </FormField>
                </div>
              );
            })}
          </div>
          <div className="flex flex-wrap justify-end gap-3">
            {editingId ? (
              <Button
                type="button"
                variant="ghost"
                onClick={() => handleDelete(editingId)}
              >
                Remover
              </Button>
            ) : null}
            <Button type="submit" disabled={saving}>
              {editingId ? "Salvar alteracoes" : "Salvar cadastro"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
