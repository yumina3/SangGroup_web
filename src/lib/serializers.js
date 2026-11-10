/**
 * Pemetaan baris database → bentuk data yang dipakai komponen UI.
 *
 * Semua fungsi di sini murni (tanpa akses database) supaya mudah diuji dan
 * dipakai ulang oleh Route Handler maupun Server Component.
 */

/** @param {Date|string|null|undefined} value */
export function iso(value) {
  if (!value) return null;
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

/** Nomor tiket tampilan: #INQ-<tahun>-<nomor> (3 digit, lebih bila perlu). */
export function inquiryTicket(ticketNo, createdAt) {
  const year = new Date(createdAt ?? Date.now()).getUTCFullYear();
  return `#INQ-${year}-${String(ticketNo).padStart(3, "0")}`;
}

/** URL gambar stabil milik aplikasi; Route Handler menandatangani aksesnya. */
export function photoUrl(photoId) {
  return `/api/photos/${photoId}`;
}

/**
 * @param {any} property baris Prisma dengan photos + _count + verificationLogs
 * @returns {object} bentuk AgentProperty (lihat lib/dashboard/agent-data.js)
 */
export function serializeAgentProperty(property) {
  const primaryPhoto = property.photos?.[0] ?? null;

  return {
    id: property.id,
    title: property.title,
    cluster: property.cluster,
    unit: property.unit,
    category: property.category,
    price: Number(property.price),
    city: property.city,
    address: property.address,
    landArea: property.landArea,
    buildingArea: property.buildingArea,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    floors: property.floors,
    latitude: Number(property.latitude),
    longitude: Number(property.longitude),
    description: property.description,
    listingStatus: property.listingStatus,
    saleStatus: property.saleStatus,
    version: property.version,
    rejectionReason: property.verificationLogs?.[0]?.reason ?? null,
    activeInquiries: property._count?.inquiries ?? property.activeInquiries ?? 0,
    primaryPhotoUrl: primaryPhoto ? photoUrl(primaryPhoto.id) : null,
    photoCount: property._count?.photos ?? property.photos?.length ?? 0,
    createdAt: iso(property.createdAt),
    updatedAt: iso(property.updatedAt),
  };
}

/**
 * @param {any} inquiry baris Prisma dengan buyer + property
 */
export function serializeAgentInquiry(inquiry) {
  return {
    id: inquiry.id,
    ticket: inquiryTicket(inquiry.ticketNo, inquiry.createdAt),
    type: inquiry.type,
    status: inquiry.status,
    createdAt: iso(inquiry.createdAt),
    scheduledAt: iso(inquiry.scheduledAt),
    message: inquiry.message,
    offerPrice: inquiry.offerPrice === null ? null : Number(inquiry.offerPrice),
    sellerNote: inquiry.sellerNote,
    buyer: {
      id: inquiry.buyer.id,
      name: inquiry.buyer.fullName,
      phone: inquiry.buyer.phone,
      email: inquiry.buyer.email,
    },
    property: {
      id: inquiry.property.id,
      title: inquiry.property.title,
      price: Number(inquiry.property.price),
      unit: inquiry.property.unit,
      cluster: inquiry.property.cluster,
    },
  };
}

/** @param {any} task */
export function serializeTask(task, now = new Date()) {
  return {
    id: task.id,
    title: task.title,
    type: task.type,
    status: task.status,
    dueAt: iso(task.dueAt),
    note: task.note,
    inquiryId: task.inquiryId,
    doneAt: iso(task.doneAt),
    createdAt: iso(task.createdAt),
    isOverdue: task.status === "OPEN" && task.dueAt.getTime() < now.getTime(),
    inquiry: task.inquiry
      ? {
          id: task.inquiry.id,
          ticket: inquiryTicket(task.inquiry.ticketNo, task.inquiry.createdAt),
          buyerName: task.inquiry.buyer?.fullName ?? null,
        }
      : null,
  };
}

/** @param {any} contact */
export function serializeContact(contact) {
  return {
    id: contact.id,
    buyerId: contact.buyerId,
    name: contact.buyer.fullName,
    phone: contact.buyer.phone,
    email: contact.buyer.email,
    status: contact.status,
    source: contact.source,
    lastInteractionAt: iso(contact.lastInteractionAt),
    property: contact.property
      ? {
          id: contact.property.id,
          title: contact.property.title,
          cluster: contact.property.cluster,
          unit: contact.property.unit,
          price: Number(contact.property.price),
        }
      : null,
    history: (contact.events ?? []).map((event) => ({
      id: event.id,
      at: iso(event.createdAt),
      status: event.toStatus,
      fromStatus: event.fromStatus,
      note: event.note,
      actorName: event.actor?.fullName ?? null,
    })),
    conversationId: contact.conversation?.id ?? null,
    lastMessageAt: iso(contact.conversation?.lastMessageAt),
  };
}

/** @param {any} conversation */
export function serializeConversation(conversation) {
  const lastMessage = conversation.messages?.[0] ?? null;

  return {
    id: conversation.id,
    contactId: conversation.contactId,
    buyer: {
      id: conversation.contact.buyer.id,
      name: conversation.contact.buyer.fullName,
      phone: conversation.contact.buyer.phone,
    },
    property: conversation.contact.property
      ? {
          id: conversation.contact.property.id,
          title: conversation.contact.property.title,
          unit: conversation.contact.property.unit,
        }
      : null,
    lastMessageAt: iso(conversation.lastMessageAt),
    lastMessage: lastMessage ? serializeMessage(lastMessage) : null,
    unread: conversation.messages?.length ?? 0,
  };
}

/** @param {any} message */
export function serializeMessage(message) {
  return {
    id: message.id,
    conversationId: message.conversationId,
    sender: message.sender,
    body: message.body,
    createdAt: iso(message.createdAt),
    authorName: message.author?.fullName ?? null,
  };
}

/** @param {any} notification */
export function serializeNotification(notification) {
  return {
    id: notification.id,
    type: notification.type,
    title: notification.title,
    body: notification.body,
    url: notification.url,
    status: notification.status,
    readAt: iso(notification.readAt),
    createdAt: iso(notification.createdAt),
  };
}
