"use client";

import { useState } from "react";

import { ContactMessage } from "@/types/contact-message";
import { ContactMessagesStats } from "@/components/pages/contact-messages/contact-messages-stats";
import { ContactMessagesTable } from "@/components/pages/contact-messages/contact-messages-table";
import { ContactDetailsDialog } from "@/components/pages/contact-messages/contact-details-dialog";
import { SendEmailDialog } from "@/components/pages/contact-messages/send-email-dialog";

export default function ContactMessagesPage() {
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null,
  );
  const [messageToEmail, setMessageToEmail] = useState<ContactMessage | null>(
    null,
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Messages de contact
          </h1>
          <p className="text-muted-foreground mt-1">
            Gérez les demandes de contact reçues
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <ContactMessagesStats />

      {/* Table */}
      <div className="">
        <ContactMessagesTable
          onSelectMessage={setSelectedMessage}
          onSendEmail={setMessageToEmail}
        />
      </div>

      {/* Dialogs */}
      <ContactDetailsDialog
        message={selectedMessage}
        open={!!selectedMessage}
        onOpenChange={(open) => !open && setSelectedMessage(null)}
      />

      <SendEmailDialog
        message={messageToEmail}
        open={!!messageToEmail}
        onOpenChange={(open) => !open && setMessageToEmail(null)}
      />
    </div>
  );
}
