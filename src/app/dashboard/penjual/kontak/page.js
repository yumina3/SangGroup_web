import ContactsWorkspace from "@/components/dashboard/contacts/ContactsWorkspace";
import { CONTACT_LAST_SYNC, getAgentContacts } from "@/lib/dashboard/contact-data";
import { formatDateTime } from "@/lib/dashboard/format";

export const metadata = { title: "Kontak" };

/**
 * Halaman Kontak agen.
 *
 * Navbar dan sidebar dipasang sekali oleh `src/app/dashboard/penjual/layout.js`;
 * halaman ini hanya mengisi konten utama. Kontak diturunkan dari pengajuan
 * milik agen yang sedang login (tanpa tabel kontak terpisah).
 *
 * `?contact=` dipakai tautan dari halaman Pesan agar kontak yang sedang
 * dibuka langsung terpilih di panel detail.
 */
export default async function ContactsPage({ searchParams }) {
  const params = (await searchParams) ?? {};
  const initialContactId = typeof params.contact === "string" ? params.contact : null;
  const contacts = await getAgentContacts();

  return (
    <ContactsWorkspace
      contacts={contacts}
      initialContactId={initialContactId}
      syncLabel={formatDateTime(CONTACT_LAST_SYNC)}
    />
  );
}
