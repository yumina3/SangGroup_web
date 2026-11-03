export const metadata = { title: "Login" };

/** URL lama /login dipindahkan ke gerbang /penjual; simpan tautan yang masih memakainya. */
export default function LoginRedirectPage() {
  return (
    <>
      <meta httpEquiv="refresh" content="0;url=/penjual" />
      <p className="p-8 text-center text-sm">
        Halaman login sudah dipindahkan.{" "}
        <a href="/penjual" className="font-semibold underline">
          Lanjut ke /penjual
        </a>
        .
      </p>
    </>
  );
}
