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
import {
  ChevronDown,
  ChevronUp,
  Eye,
  Trash2,
  X,
  MoreVertical,
  Image as ImageIcon,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

import { useServices, useDeleteService } from "@/hooks/useServices";
import { Service } from "@/types/service";
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

interface ServicesTableProps {
  onSelectService: (service: Service) => void;
}

export function ServicesTable({ onSelectService }: ServicesTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [serviceToDelete, setServiceToDelete] = useState<number | null>(null);

  const { data: services, isLoading, error } = useServices();
  const deleteMutation = useDeleteService();

  const columns = useMemo<ColumnDef<Service>[]>(
    () => [
      {
        accessorKey: "titre",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="-ml-4"
            >
              Titre
              {column.getIsSorted() === "asc" ? (
                <ChevronUp className="ml-2 size-4" />
              ) : column.getIsSorted() === "desc" ? (
                <ChevronDown className="ml-2 size-4" />
              ) : null}
            </Button>
          );
        },
        cell: ({ row }) => (
          <div className="font-medium">{row.getValue("titre")}</div>
        ),
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => {
          const description = row.getValue("description") as string;
          return (
            <div className="max-w-md truncate text-muted-foreground">
              {description}
            </div>
          );
        },
      },
      {
        accessorKey: "imageUrl",
        header: "Image",
        cell: ({ row }) => {
          const imageUrl = row.getValue("imageUrl") as string | null;
          return imageUrl ? (
            <Badge variant="default" className="gap-1">
              <ImageIcon className="size-3" />
              Oui
            </Badge>
          ) : (
            <Badge variant="secondary">Non</Badge>
          );
        },
      },
      {
        accessorKey: "actif",
        header: "Statut",
        cell: ({ row }) => {
          const actif = row.getValue("actif") as boolean;
          return actif ? (
            <Badge variant="default">Actif</Badge>
          ) : (
            <Badge variant="secondary">Inactif</Badge>
          );
        },
      },
      {
        accessorKey: "dateCreation",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="-ml-4"
            >
              Date de création
              {column.getIsSorted() === "asc" ? (
                <ChevronUp className="ml-2 size-4" />
              ) : column.getIsSorted() === "desc" ? (
                <ChevronDown className="ml-2 size-4" />
              ) : null}
            </Button>
          );
        },
        cell: ({ row }) => {
          const date = new Date(row.getValue("dateCreation"));
          return (
            <span className="text-muted-foreground">
              {format(date, "PPP", { locale: fr })}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="size-8 p-0">
                <MoreVertical className="size-4" />
                <span className="sr-only">Ouvrir le menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => onSelectService(row.original)}>
                <Eye className="size-4 mr-2" />
                Voir détails
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => setServiceToDelete(row.original.id)}
              >
                <Trash2 className="size-4 mr-2" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [onSelectService],
  );

  const table = useReactTable({
    data: services || [],
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
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-destructive">
          Erreur lors du chargement des services
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Barre de recherche */}
      <div className="flex items-center gap-2">
        <Input
          placeholder="Rechercher un service..."
          value={(table.getColumn("titre")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("titre")?.setFilterValue(event.target.value)
          }
          className="max-w-sm rounded-3xl"
        />
        {(table.getColumn("titre")?.getFilterValue() as string) && (
          <Button
            variant="ghost"
            onClick={() => table.getColumn("titre")?.setFilterValue("")}
            size="sm"
            className="rounded-3xl"
          >
            <X className="size-4" />
          </Button>
        )}
      </div>

      {/* Tableau */}
      <div className="rounded-3xl border">
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
                <TableRow key={row.id}>
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
                  className="h-24 text-center"
                >
                  Aucun service trouvé.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} service(s) au total
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-3xl"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Précédent
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-3xl"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Suivant
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={serviceToDelete !== null}
        onOpenChange={(open) => !open && setServiceToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le service</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce service ? Cette action est
              irréversible et supprimera également l'image associée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (serviceToDelete) {
                  deleteMutation.mutate(serviceToDelete);
                  setServiceToDelete(null);
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
