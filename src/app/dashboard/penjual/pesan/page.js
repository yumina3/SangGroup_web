import MessagesWorkspace from "@/components/dashboard/messages/MessagesWorkspace";
import { getAgentConversations } from "@/lib/dashboard/message-data";

export const metadata = { title: "Pesan" };

/**
 * Halaman Pesan agen.
 *
 * Navbar dan sidebar dipasang sekali oleh `src/app/dashboard/layout.js`.
 * `?contact=` dari halaman Kontak memilih percakapan yang sesuai saat
 * halaman dibuka. Data percakapan masih demo internal dan nanti diambil dari
 * tabel pesan di database.
 */
export default async function MessagesPage({ searchParams }) {
  const params = (await searchParams) ?? {};
  const initialContactId = typeof params.contact === "string" ? params.contact : null;
  const conversations = getAgentConversations();

  return (
    <MessagesWorkspace conversations={conversations} initialContactId={initialContactId} />
  );
}
