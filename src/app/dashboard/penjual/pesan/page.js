import MessagesWorkspace from "@/components/dashboard/messages/MessagesWorkspace";
import { getAgentConversations } from "@/lib/dashboard/message-data";

export const metadata = { title: "Pesan" };

/**
 * Halaman Pesan agen.
 *
 * Navbar dan sidebar dipasang sekali oleh `src/app/dashboard/penjual/layout.js`.
 * `?contact=` dari halaman Kontak memilih percakapan yang sesuai saat
 * halaman dibuka. Identitas/riwayat berasal dari pengajuan nyata; isi balasan
 * masih template karena schema belum memiliki tabel pesan.
 */
export default async function MessagesPage({ searchParams }) {
  const params = (await searchParams) ?? {};
  const initialContactId = typeof params.contact === "string" ? params.contact : null;
  const conversations = await getAgentConversations();

  return (
    <MessagesWorkspace conversations={conversations} initialContactId={initialContactId} />
  );
}
