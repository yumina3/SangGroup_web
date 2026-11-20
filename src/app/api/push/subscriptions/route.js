import { clientMeta, requireApiUser } from "@/lib/auth/current-user";
import { ok, readJson, withRoute } from "@/lib/http/api";
import { removePushSubscription, savePushSubscription } from "@/lib/services/notifications";
import { pushSubscriptionSchema, pushUnsubscribeSchema } from "@/lib/validators/domain";

/** Simpan/segarkan subscription Web Push milik pengguna. */
export const POST = withRoute(async (request) => {
  const user = await requireApiUser();
  const input = await readJson(request, pushSubscriptionSchema);
  const meta = await clientMeta();

  const saved = await savePushSubscription(user.id, {
    endpoint: input.endpoint,
    keys: input.keys,
    userAgent: meta.userAgent,
  });

  return ok(saved, { status: 201 });
});

export const DELETE = withRoute(async (request) => {
  const user = await requireApiUser();
  const { endpoint } = await readJson(request, pushUnsubscribeSchema);
  return ok({ removed: await removePushSubscription(user.id, endpoint) });
});
