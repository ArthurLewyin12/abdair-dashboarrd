"use client";

import { useMemo, useState } from "react";
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
  Mail as MailIcon,
  CheckCircle,
  Clock,
  MessageSquare,
  Archive,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Tabs } from "@/components/ui/custom-tabs";

import {
  useContactMessages,
  useDeleteContactMessage,
  useUpdateContactMessageStatus,
} from "@/hooks/useContactMessages";
import {
  ContactMessage,
  MessageStatus,
  MessageType,
} from "@/types/contact-message";
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
  DropdownMenuSeparator,
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

interface ContactMessagesTableProps {
  onSelectMessage: (message: ContactMessage) => void;
  onSendEmail: (message: ContactMessage) => void;
}

const getStatusBadge = (status: MessageStatus) => {
  switch (status) {
    case MessageStatus.NEW:
      return <Badge variant="default">Nouveau</Badge>;
    case MessageStatus.READ:
      return <Badge variant="secondary">Lu</Badge>;
    case MessageStatus.REPLIED:
      return (
        <Badge className="bg-green-500 text-white hover:bg-green-600">
          Répondu
        </Badge>
      );
    case MessageStatus.ARCHIVED:
      return <Badge variant="outline">Archivé</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getTypeBadge = (type: MessageType) => {
  switch (type) {
    case MessageType.QUOTE:
      return <Badge variant="default">Devis</Badge>;
    case MessageType.INFO:
      return <Badge variant="secondary">Info</Badge>;
    case MessageType.OTHER:
      return <Badge variant="outline">Autre</Badge>;
    default:
      return <Badge variant="outline">{type}</Badge>;
  }
};

export function ContactMessagesTable({
  onSelectMessage,
  onSendEmail,
}: ContactMessagesTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "dateCreation", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [messageToDelete, setMessageToDelete] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data: messages, isLoading, error } = useContactMessages();
  const deleteMutation = useDeleteContactMessage();
  const updateStatusMutation = useUpdateContactMessageStatus();

  // Filtrer les messages par tab
  const filteredMessagesByTab = useMemo(() => {
    if (!messages) return [];

    switch (activeTab) {
      case "new":
        return messages.filter((m) => m.statut === MessageStatus.NEW);
      case "read":
        return messages.filter((m) => m.statut === MessageStatus.READ);
      case "replied":
        return messages.filter((m) => m.statut === MessageStatus.REPLIED);
      case "archived":
        return messages.filter((m) => m.statut === MessageStatus.ARCHIVED);
      default:
        return messages;
    }
  }, [messages, activeTab]);

  // Compter les messages par statut pour les badges
  const messageCounts = useMemo(() => {
    if (!messages) return { all: 0, new: 0, read: 0, replied: 0, archived: 0 };

    return {
      all: messages.length,
      new: messages.filter((m) => m.statut === MessageStatus.NEW).length,
      read: messages.filter((m) => m.statut === MessageStatus.READ).length,
      replied: messages.filter((m) => m.statut === MessageStatus.REPLIED).length,
      archived: messages.filter((m) => m.statut === MessageStatus.ARCHIVED).length,
    };
  }, [messages]);

  const columns = useMemo<ColumnDef<ContactMessage>[]>(
    () => [
      {
        accessorKey: "nom",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="-ml-4"
            >
              Nom
              {column.getIsSorted() === "asc" ? (
                <ChevronUp className="ml-2 size-4" />
              ) : column.getIsSorted() === "desc" ? (
                <ChevronDown className="ml-2 size-4" />
              ) : null}
            </Button>
          );
        },
        cell: ({ row }) => (
          <div className="font-medium">{row.getValue("nom")}</div>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => {
          const email = row.getValue("email") as string;
          return (
            <a
              href={`mailto:${email}`}
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              {email}
            </a>
          );
        },
      },
      {
        accessorKey: "sujet",
        header: "Sujet",
        cell: ({ row }) => {
          const sujet = row.getValue("sujet") as string;
          return (
            <div className="max-w-[300px] truncate" title={sujet}>
              {sujet}
            </div>
          );
        },
      },
      {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => {
          const type = row.getValue("type") as MessageType;
          return getTypeBadge(type);
        },
      },
      {
        accessorKey: "statut",
        header: "Statut",
        cell: ({ row }) => {
          const statut = row.getValue("statut") as MessageStatus;
          return getStatusBadge(statut);
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
              Date
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
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => onSelectMessage(row.original)}>
                <Eye className="size-4 mr-2" />
                Voir détails
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSendEmail(row.original)}>
                <MailIcon className="size-4 mr-2" />
                Envoyer un email
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {row.original.statut === MessageStatus.NEW && (
                <DropdownMenuItem
                  onClick={() =>
                    updateStatusMutation.mutate({
                      id: row.original.id,
                      status: MessageStatus.READ,
                    })
                  }
                >
                  <CheckCircle className="size-4 mr-2" />
                  Marquer comme lu
                </DropdownMenuItem>
              )}
              {row.original.statut !== MessageStatus.ARCHIVED && (
                <DropdownMenuItem
                  onClick={() =>
                    updateStatusMutation.mutate({
                      id: row.original.id,
                      status: MessageStatus.ARCHIVED,
                    })
                  }
                >
                  <CheckCircle className="size-4 mr-2" />
                  Archiver
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => setMessageToDelete(row.original.id)}
              >
                <Trash2 className="size-4 mr-2" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [onSelectMessage, onSendEmail, updateStatusMutation],
  );

  const table = useReactTable({
    data: filteredMessagesByTab || [],
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

  // Tabs configuration
  const tabItems = [
    {
      id: "all",
      label: "Tous",
      icon: <MailIcon className="size-4" />,
      badge: messageCounts.all,
      content: null,
    },
    {
      id: "new",
      label: "Nouveaux",
      icon: <Clock className="size-4" />,
      badge: messageCounts.new,
      content: null,
    },
    {
      id: "read",
      label: "Lus",
      icon: <MessageSquare className="size-4" />,
      badge: messageCounts.read,
      content: null,
    },
    {
      id: "replied",
      label: "Répondus",
      icon: <CheckCircle className="size-4" />,
      badge: messageCounts.replied,
      content: null,
    },
    {
      id: "archived",
      label: "Archivés",
      icon: <Archive className="size-4" />,
      badge: messageCounts.archived,
      content: null,
    },
  ];

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
          Erreur lors du chargement des messages de contact
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Tabs + Barre de recherche au même niveau */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Tabs */}
        <Tabs
          items={tabItems}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          renderTabsOnly
          size="sm"
        />

        {/* Barre de recherche */}
        <div className="flex items-center gap-2 w-full sm:flex-1 sm:max-w-2xl">
          <div className="relative w-full">
            <Input
              placeholder="Rechercher un message par nom, email ou sujet..."
              value={(table.getColumn("nom")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("nom")?.setFilterValue(event.target.value)
              }
              className="w-full rounded-3xl pr-10"
            />
            {(table.getColumn("nom")?.getFilterValue() as string) && (
              <Button
                variant="ghost"
                onClick={() => table.getColumn("nom")?.setFilterValue("")}
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 size-8 rounded-full"
              >
                <X className="size-4" />
              </Button>
            )}
          </div>
        </div>
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
                  Aucun message de contact trouvé.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} message(s) au total
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
        open={messageToDelete !== null}
        onOpenChange={(open) => !open && setMessageToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le message</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce message de contact ? Cette
              action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (messageToDelete) {
                  deleteMutation.mutate(messageToDelete);
                  setMessageToDelete(null);
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
