"use client";

import { useMemo, useState } from "react";
import { useQueryState, parseAsInteger, parseAsString } from "nuqs";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
  flexRender,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { ChevronDown, ChevronUp, Eye, Trash2, X, MoreVertical, Pencil } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

import { useJobOffersPaginated, useDeleteJobOffer } from "@/hooks/useJobOffers";
import { JobOffer, JobOfferStatus } from "@/types/job-offer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface JobOffersTableProps {
  onSelectOffer: (offer: JobOffer) => void;
}

export function JobOffersTable({ onSelectOffer }: JobOffersTableProps) {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(0));
  const [pageSize] = useQueryState("pageSize", parseAsInteger.withDefault(10));
  const [searchQuery, setSearchQuery] = useQueryState(
    "search",
    parseAsString.withDefault(""),
  );

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [offerToDelete, setOfferToDelete] = useState<number | null>(null);

  const { data, isLoading, error } = useJobOffersPaginated(page, pageSize);
  const deleteMutation = useDeleteJobOffer();

  const getStatusBadge = (status: JobOfferStatus) => {
    const variants: Record<
      JobOfferStatus,
      { label: string; variant: "default" | "secondary" | "destructive" }
    > = {
      [JobOfferStatus.OPEN]: { label: "Ouverte", variant: "default" },
      [JobOfferStatus.CLOSED]: { label: "Fermée", variant: "secondary" },
      [JobOfferStatus.ARCHIVED]: { label: "Archivée", variant: "destructive" },
    };

    const config = variants[status];
    return (
      <Badge variant={config.variant} className="rounded-2xl">
        {config.label}
      </Badge>
    );
  };

  const columns = useMemo<ColumnDef<JobOffer>[]>(
    () => [
      {
        accessorKey: "titre",
        header: "Titre",
        cell: ({ row }) => (
          <div className="font-medium">{row.original.titre}</div>
        ),
      },
      {
        accessorKey: "statut",
        header: "Statut",
        cell: ({ row }) => getStatusBadge(row.original.statut),
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
      },
      {
        accessorKey: "nombreCandidatures",
        header: "Candidatures",
        cell: ({ row }) => (
          <div className="text-center">
            <Badge variant="outline" className="rounded-2xl">
              {row.original.nombreCandidatures}
            </Badge>
          </div>
        ),
      },
      {
        accessorKey: "dateLimite",
        header: "Date limite",
        cell: ({ row }) => {
          if (!row.original.dateLimite)
            return <span className="text-muted-foreground">—</span>;
          return format(new Date(row.original.dateLimite), "dd MMM yyyy", {
            locale: fr,
          });
        },
      },
      {
        accessorKey: "dateCreation",
        header: "Créée le",
        cell: ({ row }) => {
          return format(new Date(row.original.dateCreation), "dd MMM yyyy", {
            locale: fr,
          });
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="size-8 p-0"
              >
                <MoreVertical className="size-4" />
                <span className="sr-only">Ouvrir le menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => onSelectOffer(row.original)}>
                <Eye className="size-4 mr-2" />
                Voir détails
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => setOfferToDelete(row.original.id)}
              >
                <Trash2 className="size-4 mr-2" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [onSelectOffer, deleteMutation],
  );

  const table = useReactTable({
    data: data?.content || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
    pageCount: data?.totalPages || 0,
    manualPagination: true,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12 text-destructive">
        Une erreur est survenue lors du chargement des offres.
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Input
            placeholder="Rechercher par titre..."
            value={searchQuery || ""}
            onChange={(e) => {
              setSearchQuery(e.target.value || null);
              table.getColumn("titre")?.setFilterValue(e.target.value);
            }}
            className="rounded-2xl pr-10"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 size-8 p-0 rounded-full"
              onClick={() => {
                setSearchQuery(null);
                table.getColumn("titre")?.setFilterValue("");
              }}
            >
              <X className="size-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer hover:bg-muted/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  Aucune offre d'emploi trouvée.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Page {page + 1} sur {data.totalPages} • {data.totalElements}{" "}
            offre(s) au total
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-2xl"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              Précédent
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-2xl"
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= data.totalPages - 1}
            >
              Suivant
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={offerToDelete !== null} onOpenChange={(open) => !open && setOfferToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer l'offre d'emploi</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette offre d'emploi ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (offerToDelete) {
                  deleteMutation.mutate(offerToDelete);
                  setOfferToDelete(null);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
