// AUTO-GENERATED. Do not edit by hand.
// Source: docs/nitrosend.mcp.json
// Regenerate with: npm run generate:schemas

import { z } from 'zod';

type NitroComposeFlowFilterNode = {
    name: string;
    predicate: "eq" | "not_eq" | "cont" | "not_cont" | "start" | "not_start" | "end" | "not_end" | "gt" | "lt" | "gteq" | "lteq" | "present" | "blank" | "true" | "false" | "in" | "not_in" | "within_days" | "not_within_days";
    value: unknown;
    [key: string]: unknown;
  } |
  {
    type: "event";
    event: string;
    predicate: "performed" | "not_performed" | "count_at_least" | "count_at_most";
    value?: number;
    within_days?: number;
    since?: string;
    [key: string]: unknown;
  } |
  {
    op: "and" | "or" | "not";
    conditions: Array<NitroComposeFlowFilterNode>;
    [key: string]: unknown;
  };
type NitroComposeFlowFlowStep = {
    action_name?: string;
    key?: string;
    type: "email" | "sms" | "wait" | "split" | "random_split" | "classify_reply" | "reply" | "emit_event" | "webhook" | "subscribe" | "unsubscribe";
    subject?: string;
    body?: string;
    content_format?: "designed" | "plain";
    plain_text_mode?: "derived" | "custom";
    transactional: boolean;
    preheader?: string;
    from_name?: string;
    from_email?: string;
    reply_to?: string;
    design?: Record<string, unknown>;
    if_version?: number;
    template_version?: number;
    reply_all: boolean;
    cc?: Array<string>;
    bcc?: string |
    Array<string>;
    categories?: Array<Record<string, unknown>>;
    paths?: Array<Record<string, unknown>>;
    branches?: Record<string, unknown>;
    duration?: number;
    send_at?: string;
    time_zone?: string;
    event_name?: string;
    event_data?: Record<string, unknown>;
    event_data_keys?: Array<string>;
    forward_event_data: boolean;
    url?: string;
    endpoint_configured?: boolean;
    method: "POST" | "PUT";
    headers?: Record<string, unknown>;
    filters?: Array<NitroComposeFlowFilterNode> |
    NitroComposeFlowFilterNode;
    yes?: Array<NitroComposeFlowFlowStep>;
    no?: Array<NitroComposeFlowFlowStep>;
    channel: "phone" | "email" | "all";
  };
type NitroDefineSegmentFilterNode = {
    name: string;
    predicate: "eq" | "not_eq" | "cont" | "not_cont" | "start" | "not_start" | "end" | "not_end" | "gt" | "lt" | "gteq" | "lteq" | "present" | "blank" | "true" | "false" | "in" | "not_in" | "within_days" | "not_within_days";
    value: unknown;
    [key: string]: unknown;
  } |
  {
    type: "event";
    event: string;
    predicate: "performed" | "not_performed" | "count_at_least" | "count_at_most";
    value?: number;
    within_days?: number;
    since?: string;
    [key: string]: unknown;
  } |
  {
    op: "and" | "or" | "not";
    conditions: Array<NitroDefineSegmentFilterNode>;
    [key: string]: unknown;
  };

const NitroComposeFlowFilterNodeSchema: z.ZodType<NitroComposeFlowFilterNode> = z.lazy(() => z.union([
    z.object({
      name: z.string().describe("Filter name from the supplied filter schema"),
      predicate: z.enum(["eq", "not_eq", "cont", "not_cont", "start", "not_start", "end", "not_end", "gt", "lt", "gteq", "lteq", "present", "blank", "true", "false", "in", "not_in", "within_days", "not_within_days"]).describe("Ransack predicate or special predicate (within_days, not_within_days)"),
      value: z.unknown().describe("Scalar or array; pass true for unary predicates.")
    }).passthrough(),
    z.object({
      type: z.literal("event"),
      event: z.string().describe("Event name, e.g. first_send or project_created"),
      predicate: z.enum(["performed", "not_performed", "count_at_least", "count_at_most"]),
      value: z.number().int().describe("Required for count_at_least/count_at_most").optional(),
      within_days: z.number().int().describe("Optional rolling recency window").optional(),
      since: z.iso.datetime().describe("Optional absolute recency cutoff").optional()
    }).passthrough(),
    z.object({
      op: z.enum(["and", "or", "not"]),
      conditions: z.array(NitroComposeFlowFilterNodeSchema).max(25)
    }).passthrough()
  ]));
const NitroComposeFlowFlowStepSchema: z.ZodType<NitroComposeFlowFlowStep> = z.lazy(() => z.object({
    action_name: z.string().describe("Stable existing-node identity; preserve exactly.").optional(),
    key: z.string().optional(),
    type: z.enum(["email", "sms", "wait", "split", "random_split", "classify_reply", "reply", "emit_event", "webhook", "subscribe", "unsubscribe"]),
    subject: z.string().optional(),
    body: z.string().optional(),
    content_format: z.enum(["designed", "plain"]).optional(),
    plain_text_mode: z.enum(["derived", "custom"]).optional(),
    transactional: z.boolean().default(false).describe("Email: true for requested receipts/alerts, never promotions. Set on initial intent; copy edits preserve it. Suppression and abuse checks apply."),
    preheader: z.string().optional(),
    from_name: z.string().optional(),
    from_email: z.string().optional(),
    reply_to: z.string().optional(),
    design: z.object({}).passthrough().optional(),
    if_version: z.number().int().describe("Required for existing email edits.").optional(),
    template_version: z.number().int().optional(),
    reply_all: z.boolean().default(false),
    cc: z.array(z.string()).optional(),
    bcc: z.union([
      z.string(),
      z.array(z.string())
    ]).optional(),
    categories: z.array(z.object({}).passthrough()).optional(),
    paths: z.array(z.object({}).passthrough()).optional(),
    branches: z.object({}).passthrough().optional(),
    duration: z.number().int().optional(),
    send_at: z.string().regex(new RegExp("^(?:[01][0-9]|2[0-3]):[0-5][0-9]$")).optional(),
    time_zone: z.string().optional(),
    event_name: z.string().optional(),
    event_data: z.object({}).passthrough().optional(),
    event_data_keys: z.array(z.string()).optional(),
    forward_event_data: z.boolean().default(false),
    url: z.string().optional(),
    endpoint_configured: z.boolean().optional(),
    method: z.enum(["POST", "PUT"]).default("POST"),
    headers: z.object({}).passthrough().optional(),
    filters: z.union([
      z.array(NitroComposeFlowFilterNodeSchema),
      NitroComposeFlowFilterNodeSchema
    ]).describe("Split filters: flat AND array or boolean group tree.").optional(),
    yes: z.array(NitroComposeFlowFlowStepSchema).optional(),
    no: z.array(NitroComposeFlowFlowStepSchema).optional(),
    channel: z.enum(["phone", "email", "all"]).default("phone")
  }).strict());
const NitroDefineSegmentFilterNodeSchema: z.ZodType<NitroDefineSegmentFilterNode> = z.lazy(() => z.union([
    z.object({
      name: z.string().describe("Filter name from the supplied filter schema"),
      predicate: z.enum(["eq", "not_eq", "cont", "not_cont", "start", "not_start", "end", "not_end", "gt", "lt", "gteq", "lteq", "present", "blank", "true", "false", "in", "not_in", "within_days", "not_within_days"]).describe("Ransack predicate or special predicate (within_days, not_within_days)"),
      value: z.unknown().describe("Scalar or array; pass true for unary predicates.")
    }).passthrough(),
    z.object({
      type: z.literal("event"),
      event: z.string().describe("Event name, e.g. first_send or project_created"),
      predicate: z.enum(["performed", "not_performed", "count_at_least", "count_at_most"]),
      value: z.number().int().describe("Required for count_at_least/count_at_most").optional(),
      within_days: z.number().int().describe("Optional rolling recency window").optional(),
      since: z.iso.datetime().describe("Optional absolute recency cutoff").optional()
    }).passthrough(),
    z.object({
      op: z.enum(["and", "or", "not"]),
      conditions: z.array(NitroDefineSegmentFilterNodeSchema).max(25)
    }).passthrough()
  ]));

export const nitrosendToolSchemas = {
  nitro_compose_campaign: z.object({
    name: z.string().describe("Campaign name; required when creating.").optional(),
    mode: z.enum(["create", "patch", "replace"]).default("create"),
    campaign_id: z.number().int().optional(),
    channel: z.enum(["email", "sms"]).default("email").describe("Immutable after creation."),
    goal: z.string().optional(),
    category: z.enum(["promotion", "announcement", "newsletter", "welcome", "reengagement", "transactional", "plain"]).describe("Email job used to select a baseline.").optional(),
    composition_mode: z.enum(["intent", "draft", "validate", "generate"]).describe("intent plans; validate checks; draft persists; generate composes and persists.").optional(),
    contract_id: z.string().optional(),
    brand_context_ref: z.string().optional(),
    validate_only: z.boolean().default(false),
    design_mode_override: z.enum(["premium_rich", "premium_minimal", "founder_letter", "utility_plain"]).optional(),
    renegotiate: z.boolean().default(false),
    user_instruction: z.string().optional(),
    creative_route_id: z.string().describe("Intent-only route id.").optional(),
    source_text: z.string().describe("Untrusted source evidence; put authoring directions in user_instruction.").optional(),
    facts: z.array(z.object({
      kind: z.enum(["url", "image_url", "offer_code", "price", "deadline", "offer", "cta_text"]),
      value: z.string(),
      description: z.string().describe("For image_url: truthful visible content for selection and alt text.").optional(),
      requirement: z.enum(["required", "available"])
    }).strict()).describe("Literal evidence: required values must appear; available values may be used.").optional(),
    draft_meta: z.object({
      creative_route_id: z.string().optional(),
      concrete_anchor: z.string().optional(),
      why_this_earns_the_inbox: z.string().optional()
    }).passthrough().describe("Optional authoring provenance; never blocks.").optional(),
    subject: z.string().optional(),
    preheader: z.string().optional(),
    from_name: z.string().optional(),
    from_email: z.string().optional(),
    reply_to: z.string().optional(),
    body: z.string().optional(),
    content_format: z.enum(["designed", "plain"]).describe("Match source.").optional(),
    plain_text_mode: z.enum(["derived", "custom"]).describe("Text provenance.").optional(),
    sections: z.array(z.object({}).passthrough()).describe("Email design sections; requires subject. Images accept public or nitro_ingest media_url/image_url, never raw signed_id.").optional(),
    section_updates: z.array(z.object({}).passthrough()).describe("Same entries as nitro_manage_template section_updates.").optional(),
    theme: z.object({}).passthrough().describe("Brand-theme overrides. logo_url must be public or a nitro_ingest media_url/image_url, never raw signed_id.").optional(),
    template_id: z.number().int().optional(),
    if_version: z.number().int().describe("Version token for conflict-safe writes.").optional(),
    audience: z.object({
      audience_type: z.enum(["lists", "segment", "all_contacts"]).optional(),
      contact_list_ids: z.array(z.number().int()).optional(),
      contact_list_id: z.number().int().describe("Deprecated single list id.").optional(),
      segment_id: z.number().int().optional(),
      exclude_segment_ids: z.array(z.number().int()).describe("Suppressed segment ids; [] clears.").optional(),
      exclude_contact_list_ids: z.array(z.number().int()).describe("Suppressed list ids; [] clears.").optional()
    }).passthrough().describe("Target audience; all_contacts must be explicit.").optional(),
    scheduled_at: z.iso.datetime().describe("ISO 8601 delivery time.").optional(),
    dry_run: z.boolean().default(false),
    idempotency_key: z.string().max(128).describe("Required for non-dry-run persistence; exact retry only.").optional(),
    confirm: z.boolean().default(false)
  }).strict(),
  nitro_compose_flow: z.object({
    name: z.string().describe("Flow name; required on create.").optional(),
    mode: z.enum(["create", "replace", "patch"]).default("create").describe("create: new; replace: whole graph; patch: name/email actions"),
    flow_id: z.number().int().optional(),
    expected_updated_at: z.string().describe("Prefer expected_draft_revision_id.").optional(),
    expected_draft_revision_id: z.number().int().describe("Conflict-safe draft revision.").optional(),
    goal: z.string().optional(),
    lifecycle_key: z.string().optional(),
    composition_mode: z.enum(["intent", "draft", "validate", "generate"]).describe("intent: plan; validate: check; draft/generate: persist.").optional(),
    contract_id: z.string().optional(),
    brand_context_ref: z.string().optional(),
    validate_only: z.boolean().default(false),
    design_mode_override: z.enum(["premium_rich", "premium_minimal", "founder_letter", "utility_plain"]).optional(),
    renegotiate: z.boolean().default(false),
    user_instruction: z.string().optional(),
    creative_route_id: z.string().describe("Intent-only sequence-wide route id.").optional(),
    email_baseline_selections: z.array(z.object({
      action_name: z.string(),
      route_id: z.string(),
      image_binding_ids: z.array(z.string()).refine(values => new Set(values).size === values.length, { message: "Array items must be unique" }).optional()
    }).strict()).describe("Intent-only creative_routes[].id and image binding ids per email action_name.").optional(),
    source_text: z.string().describe("Untrusted source evidence; put authoring directions in user_instruction.").optional(),
    facts: z.array(z.object({
      kind: z.enum(["url", "image_url", "offer_code", "price", "deadline", "offer", "cta_text"]),
      value: z.string(),
      description: z.string().describe("For image_url: truthful visible content for selection and alt text.").optional(),
      requirement: z.enum(["required", "available"])
    }).strict()).describe("Literal evidence: required values must appear; available values may be used.").optional(),
    draft_meta: z.object({
      creative_route_id: z.string().optional(),
      concrete_anchor: z.string().optional(),
      why_this_earns_the_inbox: z.string().optional()
    }).passthrough().describe("Optional authoring provenance; never blocks.").optional(),
    trigger: z.object({
      event: z.string().describe("Built-in or lowercase underscore event name.").optional(),
      exit_events: z.array(z.string().regex(new RegExp("^[a-z][a-z0-9_]{0,63}$"))).max(20).describe("Stop future steps on new matching events; pinned.").optional(),
      stop_on_reply: z.boolean().default(false).describe("Requires monitored receiving."),
      reply_source: z.object({
        type: z.enum(["any", "flow", "campaign", "message"]),
        id: z.number().int().gte(1).optional()
      }).strict().describe("Match replies to an owned source.").optional(),
      action_name: z.string().describe("Preserve trigger identity.").optional(),
      segment_id: z.number().int().optional(),
      contact_list_id: z.number().int().optional(),
      resource_type: z.string().describe("Frozen trigger resource type.").optional(),
      resource_id: z.unknown().describe("Frozen trigger resource id.").optional(),
      data: z.object({}).passthrough().describe("Event settings; list_add backfill_on_publish includes existing list members.").optional()
    }).passthrough().optional(),
    steps: z.array(NitroComposeFlowFlowStepSchema).optional(),
    dry_run: z.boolean().default(false),
    idempotency_key: z.string().max(128).describe("Required for non-dry-run persistence; exact retry only.").optional(),
    confirm: z.boolean().default(false)
  }).strict(),
  nitro_configure_account: z.object({
    from_name: z.string().describe("Sender display name (e.g. 'Acme Marketing')").optional(),
    from_email: z.string().describe("Exact visible From address to select. May use the apex when a ready aligned sending subdomain authorizes it.").optional(),
    reply_to: z.string().optional(),
    test_email_recipients: z.array(z.email()).max(5).describe("Saved test-send addresses; [] clears.").optional()
  }).strict(),
  nitro_configure_providers: z.object({
    operation: z.enum(["configure", "status"]).describe("configure sets BYO provider credentials; status checks current provider health"),
    provider: z.enum(["mailgun", "ses", "postmark", "resend", "sendgrid"]).describe("Email provider (required for configure)").optional(),
    api_key: z.string().describe("Provider API key (required for configure, never returned in responses)").optional(),
    api_secret: z.string().describe("Optional provider secret (never returned in responses)").optional(),
    region: z.string().describe("Provider region where required, or the Mailgun sending domain").optional()
  }).strict(),
  nitro_control_delivery: z.object({
    target_type: z.enum(["flow", "campaign"]),
    target_id: z.number().int().gte(1),
    expected_brand_sid: z.string().min(1).describe("Optional reviewed-brand assertion. When available, copy meta.current_brand.sid from the reviewed result.").optional(),
    operation: z.enum(["approve", "reject", "live", "schedule", "pause", "resume", "cancel", "archive", "restore", "delete"]).describe("approve preflights; schedule is campaign-only; delete requires confirm and a never-sent draft."),
    scheduled_at: z.iso.datetime().describe("Required for schedule.").optional(),
    revision_id: z.number().int().gte(1).describe("Optional current-draft assertion for flow approve, reject, and live.").optional(),
    resume_mode: z.enum(["new_contacts_only", "continue_existing"]).describe("For paused flows: stop current journeys, or restart waits and continue gradually.").optional(),
    confirm_send_to_all: z.boolean().describe("Explicit all_contacts confirmation for live/schedule.").optional(),
    confirm: z.boolean().describe("Required for delete.").optional(),
    idempotency_key: z.string().describe("Campaign-live retry key; reuse only for the same send.").optional(),
    versions: z.array(z.object({}).passthrough()).describe("See nitro_review_delivery versions.").optional(),
    winner: z.object({}).passthrough().optional()
  }).strict(),
  nitro_define_segment: z.object({
    name: z.string().optional(),
    filters: z.union([
      z.array(NitroDefineSegmentFilterNodeSchema),
      NitroDefineSegmentFilterNodeSchema
    ]).describe("Flat AND filters or a boolean group tree of attribute/event filters."),
    segment_id: z.number().int().optional(),
    preview_only: z.boolean().default(true),
    idempotency_key: z.string().optional()
  }).strict(),
  nitro_get_insights: z.object({
    scope: z.enum(["account", "flow", "campaign", "message"]),
    entity_id: z.number().int().gte(1).describe("Required for flow/campaign/message scope").optional(),
    period: z.enum(["7d", "30d", "90d"]).default("30d")
  }).strict(),
  nitro_get_memory: z.object({}).strict(),
  nitro_get_status: z.object({}).passthrough(),
  nitro_import_contacts: z.object({
    records: z.array(z.object({
      email: z.string().optional(),
      phone: z.string().optional(),
      first_name: z.string().optional(),
      last_name: z.string().optional(),
      country_code: z.string().optional(),
      source: z.string().optional(),
      data: z.object({}).passthrough().describe("Custom contact fields.").optional(),
      opt_in: z.boolean().describe("true/false subscribes/unsubscribes new/existing channels written.").optional()
    }).passthrough()).optional(),
    import_id: z.number().int().optional(),
    signed_id: z.string().describe("Uploaded CSV signed ID.").optional(),
    upload: z.object({
      filename: z.string(),
      content_type: z.string(),
      byte_size: z.number().int(),
      checksum: z.string().describe("Base64 MD5.")
    }).strict().describe("Reserve upload; PUT CSV; finalize signed_id.").optional(),
    resource: z.literal("contacts").default("contacts").describe("Inline contacts or CSV contacts."),
    parser: z.string().default("default"),
    columns: z.object({}).passthrough().optional(),
    options: z.object({
      list_ids: z.array(z.number().int()).optional(),
      start_flows: z.boolean().optional()
    }).passthrough().describe("Import options.").optional(),
    dry_run: z.boolean().default(false),
    idempotency_key: z.string().optional()
  }).strict(),
  nitro_inbox: z.object({
    command: z.enum(["list_queue", "get_item", "validate_reply", "list_mailbox", "get_thread", "get_thread_page", "get_message_body", "get_attachment"]),
    action_item_id: z.number().int().optional(),
    conversation_id: z.number().int().optional(),
    before_occurred_at: z.string().describe("Thread cursor from get_thread/get_thread_page").optional(),
    before_message_id: z.number().int().describe("Cursor message id paired with before_occurred_at").optional(),
    message_id: z.number().int().optional(),
    attachment_id: z.number().int().optional(),
    acknowledge_unscanned: z.boolean().describe("Operator accepted the unscanned-download risk").optional(),
    offset: z.number().int().gte(0).describe("Body offset from get_thread/get_message_body").optional(),
    state: z.enum(["quarantine", "needs_human", "agent_ready", "handled", "needs_attention", "all"]).describe("Default needs_attention").optional(),
    status: z.enum(["open", "closed", "archived"]).optional(),
    query: z.string().describe("Subject, preview, or sender").optional(),
    inbox_id: z.number().int().optional(),
    sender: z.string().describe("Sender fragment").optional(),
    reason_code: z.string().optional(),
    since: z.string().describe("ISO 8601").optional(),
    sort: z.enum(["queue", "newest"]).optional(),
    view: z.enum(["compact", "full"]).describe("Default compact").optional(),
    include_counts: z.boolean().optional(),
    purpose: z.enum(["reply", "read"]).describe("get_thread only").optional(),
    page: z.number().int().optional(),
    per: z.number().int().describe("Max 100 compact").optional(),
    brand_context_ref: z.string().describe("Ref from a prior read").optional(),
    reply_context_digest: z.string().describe("From get_item/get_thread; required by validate_reply").optional(),
    subject: z.string().optional(),
    body: z.string().optional(),
    html: z.string().optional(),
    cc: z.array(z.string()).max(10).optional(),
    bcc: z.array(z.string()).max(10).optional(),
    reply_all: z.boolean().default(false),
    attachment_refs: z.array(z.string()).max(10).describe("Signed upload references").optional()
  }).strict(),
  nitro_inbox_action: z.object({
    command: z.enum(["compose", "send_reply", "send_reply_test", "mark_handled", "request_human", "release_to_agent", "mark_quarantine", "classify_spam", "set_sender_policy", "set_read_state", "set_contact", "reserve_attachment_upload"]),
    action_item_id: z.number().int().describe("Queue item id").optional(),
    action_item_ids: z.array(z.number().int()).min(1).max(100).describe("Triage: many items").optional(),
    filter: z.object({}).passthrough().describe("Triage: list_queue filters; needs expected_count").optional(),
    expected_count: z.number().int().gte(0).optional(),
    conversation_id: z.number().int().describe("Mailbox thread id for reply commands").optional(),
    subject: z.string().describe("Compose or reply subject").optional(),
    body: z.string().describe("Plain text compose or reply body").optional(),
    html: z.string().describe("HTML reply body").optional(),
    attachment_refs: z.array(z.string()).max(10).describe("Signed upload references").optional(),
    upload: z.object({
      filename: z.string(),
      content_type: z.string(),
      byte_size: z.number().int().gte(1).lte(6291456),
      checksum: z.string().describe("Base64 MD5")
    }).strict().describe("File metadata for reserve_attachment_upload").optional(),
    reply_context_digest: z.string().describe("From nitro_inbox get_item/get_thread; required for reply commands").optional(),
    to: z.array(z.string()).max(10).describe("Compose recipients, or test recipients for send_reply_test (first 5)").optional(),
    cc: z.array(z.string()).max(10).describe("Overrides reply-all Cc").optional(),
    bcc: z.array(z.string()).max(10).optional(),
    reply_all: z.boolean().default(false).describe("Copy visible thread participants, excluding self"),
    idempotency_key: z.string().describe("Required").optional(),
    dry_run: z.boolean().default(false).describe("Validate compose or reply without sending"),
    classification: z.enum(["spam", "not_spam"]).optional(),
    inbox_id: z.number().int().describe("For compose or set_sender_policy").optional(),
    matcher_type: z.enum(["address", "domain"]).optional(),
    matcher_value: z.string().optional(),
    decision: z.enum(["allow", "block", "handle"]).optional(),
    read: z.boolean().optional(),
    last_read_message_id: z.number().int().optional(),
    contact_id: z.number().int().describe("For set_contact").optional(),
    create_contact: z.boolean().default(false),
    first_name: z.string().optional(),
    last_name: z.string().optional()
  }).strict(),
  nitro_ingest: z.object({
    kind: z.string().optional(),
    image_data: z.string().optional(),
    image_url: z.string().optional(),
    image_file: z.object({
      download_url: z.string().optional(),
      file_id: z.string().optional(),
      mime_type: z.string().optional(),
      file_name: z.string().optional()
    }).passthrough().optional(),
    signed_id: z.string().optional(),
    description: z.string().describe("Truthful visible content (alt text).").optional(),
    upload: z.object({
      kind: z.string(),
      filename: z.string(),
      content_type: z.string(),
      byte_size: z.number().int(),
      checksum: z.string().describe("Base64 MD5.")
    }).strict().describe("Reserve a local-image upload; PUT bytes, then ingest its signed_id.").optional(),
    filename: z.string().optional(),
    content_type: z.string().optional()
  }).strict(),
  nitro_manage_audience: z.object({
    operation: z.enum(["create_contact", "update_contact", "set_subscription", "manage_list", "record_event", "delete_segment", "delete_contacts", "bulk_tag", "validate"]).describe("delete_contacts: one of list_id, segment_id, contact_ids. validate: exactly one of contact_channel_ids, contact_ids, list_id, segment_id, all_contacts: true. Its dry run quotes; pass quote_digest on execution to refuse audience or price drift. Execution needs idempotency_key, prepaid funds."),
    params: z.object({}).passthrough().describe("manage_list action: create (name[, contact_ids|emails]), rename (list_id, name), delete (list_id), add_contacts|remove_contacts (list_id, contact_ids|emails). bulk_tag tag_action: add|remove|set (default add). set_subscription opt_out: true unsubscribes; suppress: true stops all email incl. transactional, false lifts it."),
    dry_run: z.boolean().default(false),
    confirm: z.boolean().default(false).describe("Required for every delete."),
    idempotency_key: z.string().describe("Same key returns the first result.").optional()
  }).strict(),
  nitro_manage_billing: z.object({
    operation: z.enum(["status", "features", "payment_methods", "checkout", "checkout_status", "plans", "add_funds", "funding_purchase_status"]).describe("Start with status or features."),
    params: z.object({
      plan_id: z.number().int().describe("Plan ID (required for checkout)").optional(),
      quantity: z.number().int().gte(1).lte(10000).describe("Number of units for a quantity-based offer, as returned by features. Other offers require one.").optional(),
      product_key: z.string().default("base_plan").describe("Subscription product returned by features; omit for the base plan."),
      confirm: z.boolean().describe("Set true only after operator confirmation when checkout reports confirmation_required").optional(),
      amount_cents: z.number().int().describe("Integer amount in minor currency units").optional(),
      currency: z.string().describe("Three-letter funding currency").optional(),
      instrument: z.enum(["stripe_checkout", "shopify_one_time"]).describe("Optional add-funds instrument; omit to use the account default").optional(),
      purchase_id: z.number().int().describe("Local purchase ID returned by checkout or add_funds, interpreted by operation").optional()
    }).strict().describe("Parameters for the selected operation.").optional(),
    idempotency_key: z.string().max(128).describe("Required stable key for checkout and add_funds. Reuse it only for an unchanged request.").optional()
  }).strict(),
  nitro_manage_domains: z.object({
    operation: z.enum(["prepare_brand_subdomain", "select_brand_subdomain", "rename_brand_subdomain", "add", "verify", "list", "remove", "list_shared_subdomains", "share_subdomain", "revoke_shared_subdomain"]).describe("Prepare/select a hosted sender or manage customer domains.\nRename keeps old addresses receiving. Show a paired removal's effect before unpair."),
    params: z.object({
      domain_id: z.number().int().gte(1).describe("The current brand's domain that owns the subdomain.").optional(),
      shared_domain_id: z.number().int().gte(1).describe("Shared sending-domain claim to revoke.").optional(),
      target_brand_sid: z.string().describe("Exact destination brand; must be in this account or an eligible managed client.").optional(),
      page: z.number().int().gte(1).optional(),
      domain_name: z.string().describe("Customer sending domain for add, verify, or remove.").optional(),
      author_domain: z.string().describe("Optional aligned visible From domain for Nitrosend SES.").optional(),
      subdomain: z.string().describe("Sender name; needs no Brand Kit.").optional(),
      expected_fqdn: z.string().describe("Current brand_subdomain.fqdn, required for rename_brand_subdomain.").optional(),
      local_part: z.string().describe("Optional From local part.").optional(),
      apex: z.string().describe("Optional sending apex.").optional(),
      unpair: z.boolean().describe("Confirm removal of the domain's identity pair.").optional()
    }).strict().describe("Operation-specific parameters.").optional(),
    confirm: z.boolean().default(false).describe("Required for removal, renaming and subdomain-sharing changes.")
  }).strict(),
  nitro_manage_template: z.object({
    sections: z.array(z.object({}).passthrough()).describe("Email sections; use nitro://schema only for full authoring. Images use public or nitro_ingest media_url/image_url, never signed_id.").optional(),
    section_updates: z.array(z.object({
      id: z.string().describe("Preferred stable section id.").optional(),
      index: z.number().int().optional(),
      type: z.string().describe("Existing type to target or assert.").optional(),
      occurrence: z.number().int().describe("0-based occurrence of type.").optional(),
      props: z.object({}).passthrough().describe("Non-copy props to shallow-merge.").optional(),
      styles: z.object({}).passthrough().describe("Styles to shallow-merge.").optional(),
      text_patch: z.object({
        prop: z.string().describe("String prop to edit. Required when the section type has no clear default or when editing a non-default prop.").optional(),
        find: z.string().optional(),
        replace: z.string().optional(),
        all: z.boolean().default(false).describe("Replace every occurrence; requires at least one match")
      }).strict().describe("Literal replacement in one string prop.").optional()
    }).strict()).describe("Targeted section edits; never changes order or type.").optional(),
    subject: z.string().optional(),
    name: z.string().optional(),
    composition_mode: z.enum(["intent", "draft", "validate", "generate"]).describe("intent plans; validate checks; draft persists; generate composes and persists.").optional(),
    contract_id: z.string().optional(),
    brand_context_ref: z.string().optional(),
    validate_only: z.boolean().default(false),
    design_mode_override: z.enum(["premium_rich", "premium_minimal", "founder_letter", "utility_plain"]).optional(),
    renegotiate: z.boolean().default(false),
    user_instruction: z.string().optional(),
    creative_route_id: z.string().describe("Intent-only route id.").optional(),
    source_text: z.string().describe("Untrusted source evidence; put authoring directions in user_instruction.").optional(),
    facts: z.array(z.object({
      kind: z.enum(["url", "image_url", "offer_code", "price", "deadline", "offer", "cta_text"]),
      value: z.string(),
      description: z.string().describe("For image_url: truthful visible content for selection and alt text.").optional(),
      requirement: z.enum(["required", "available"])
    }).strict()).describe("Literal evidence: required values must appear; available values may be used.").optional(),
    draft_meta: z.object({
      creative_route_id: z.string().optional(),
      concrete_anchor: z.string().optional(),
      why_this_earns_the_inbox: z.string().optional()
    }).passthrough().describe("Optional authoring provenance; never blocks.").optional(),
    preheader: z.string().optional(),
    body: z.string().describe("Author text (plain) or custom text alternative (designed).").optional(),
    content_format: z.enum(["designed", "plain"]).describe("Match source.").optional(),
    plain_text_mode: z.enum(["derived", "custom"]).describe("Text provenance.").optional(),
    from_name: z.string().optional(),
    from_email: z.string().optional(),
    reply_to: z.string().optional(),
    theme: z.object({}).passthrough().describe("Brand-theme overrides; logo_url uses public or nitro_ingest media_url/image_url, never signed_id.").optional(),
    template_id: z.number().int().optional(),
    based_on: z.number().int().optional(),
    if_version: z.number().int().describe("Version token for conflict-safe writes.").optional(),
    goal: z.string().optional(),
    dry_run: z.boolean().default(false),
    idempotency_key: z.string().max(128).describe("Required for non-dry-run persistence; exact retry only.").optional()
  }).strict(),
  nitro_query: z.object({
    entity: z.enum(["flows", "campaigns", "templates", "segments", "contacts", "lists", "events", "imports", "messages", "suppressions", "history", "products"]).describe("Contact full text: nitro_search_contacts."),
    filters: z.object({}).passthrough().describe("Filters: flows status/campaign_id/trigger_event/search; campaigns status/search; templates subject; segments/lists name; contacts query/subscribed_email/subscribed_phone/list_id; events name/from/to; imports status; messages channel/status/to; suppressions email/reason/source_provider/active; history source/event_type/tool/actor/correlation_id/resource_uri/from/to; products status/query; all id.").optional(),
    page: z.number().int().describe("Default 1.").optional(),
    per: z.number().int().describe("Max 50, default 25.").optional()
  }).strict(),
  nitro_request_support: z.object({
    subject: z.string().describe("Brief summary of the issue"),
    message: z.string().describe("Complete, self-contained summary of the issue. Must fit within 1500 characters; do not rely on truncation.")
  }).strict(),
  nitro_review_delivery: z.object({
    target_type: z.enum(["template", "flow", "campaign"]).optional(),
    target_id: z.number().int().gte(1).optional(),
    revision_id: z.number().int().gte(1).describe("Optional for flows. Omit to review the current draft, or supply its ID as a current-draft assertion.").optional(),
    contact_id: z.number().int().gte(1).describe("Merge-tag personalization contact.").optional(),
    subject: z.string().max(998).describe("Inline email review subject.").optional(),
    html: z.string().min(1).max(262144).describe("Inline email review HTML.").optional()
  }).strict(),
  nitro_search_contacts: z.object({
    query: z.string(),
    mode: z.enum(["summary", "profile"]).describe("summary = list, profile = single contact detail (default: summary)").optional(),
    page: z.number().int().describe("Default 1.").optional(),
    per: z.number().int().describe("Max 50, default 25.").optional()
  }).strict(),
  nitro_search_docs: z.object({
    query: z.string().describe("e.g. 'verify sending domain' or 'cli install'"),
    limit: z.number().int().default(6).describe("Max 10.")
  }).strict(),
  nitro_select_account: z.object({
    account_id: z.number().int().describe("From nitro_get_status available_accounts.items[*].id.")
  }).strict(),
  nitro_select_brand: z.object({
    brand_sid: z.string().describe("Exact brand SID to select. Provide either brand_sid or name.").optional(),
    name: z.string().describe("Brand name to select when the SID is unknown. Provide either name or brand_sid. Ambiguous names return candidates without changing context.").optional()
  }).strict(),
  nitro_send_message: z.object({
    channel: z.enum(["email", "sms"]),
    to: z.string().describe("Email or E.164 phone"),
    subject: z.string().optional(),
    body: z.string().describe("Plain text; required for SMS").optional(),
    template_id: z.number().int().describe("Email template ID").optional(),
    data: z.object({}).passthrough().describe("Merge variables, e.g. {{ data.order_id }}").optional(),
    from: z.string().describe("Email sender: Name <address>").optional(),
    from_email: z.string().describe("Verified brand sender address").optional(),
    from_name: z.string().describe("Sender name").optional(),
    reply_to: z.string().describe("Reply address").optional(),
    cc: z.array(z.string()).max(10).optional(),
    bcc: z.array(z.string()).max(10).optional(),
    headers: z.object({}).passthrough().refine(value => Object.keys(value).length <= 20, { message: "At most 20 properties" }).describe("Email headers; reserved names rejected").optional(),
    tags: z.object({}).passthrough().refine(value => Object.keys(value).length <= 20, { message: "At most 20 properties" }).describe("Email tags").optional(),
    idempotency_key: z.string().min(1).describe("Reuse only for an exact retry"),
    dry_run: z.boolean().default(false).describe("Preview without sending")
  }).strict(),
  nitro_send_test_message: z.object({
    target_type: z.enum(["template", "flow", "campaign"]).describe("With target_id, or use template_id/latest_campaign.").optional(),
    target_id: z.number().int().gte(1).optional(),
    latest_campaign: z.boolean().default(false).describe("Latest campaign in this brand."),
    template_id: z.number().int().gte(1).describe("Template id; may select a flow/campaign email.").optional(),
    action_id: z.number().int().gte(1).describe("Select a flow message step.").optional(),
    revision_id: z.number().int().gte(1).describe("Exact revision; required for flows.").optional(),
    channel: z.enum(["auto", "email", "sms"]).default("auto").describe("Prefer auto."),
    contact_id: z.number().int().gte(1).describe("Recipient and personalization.").optional(),
    to: z.array(z.string()).max(5).describe("Email addresses or SMS E.164 numbers.").optional(),
    data: z.object({}).passthrough().describe("Sample email data.* values.").optional(),
    event_data: z.object({}).passthrough().describe("Sample email event.* data; no Event/Order writes.").optional(),
    dry_run: z.boolean().default(false).describe("Validate without sending."),
    idempotency_key: z.string().min(1).describe("Required to send; exact retries only.").optional()
  }).strict(),
  nitro_set_brand_kit: z.object({
    url: z.string().optional(),
    logo_url: z.string().describe("Public/Nitro image URL; ingest local logos first.").optional(),
    fields: z.object({
      brand_color: z.string().describe("Hex color e.g. #ff0000").optional(),
      text_color: z.string().describe("Hex color").optional(),
      bg_color: z.string().describe("Hex color").optional(),
      font_body: z.string().optional(),
      font_heading: z.string().optional(),
      heading_size: z.number().int().describe("Heading/title font size in pixels, 12-48").optional(),
      body_size: z.number().int().describe("Body text font size in pixels, 12-20").optional(),
      radius: z.number().int().describe("Global brand corner radius in pixels, 0-64. Defaults to 8; set 0 for square corners across every eligible layer.").optional(),
      spacing_density: z.enum(["compact", "normal", "spacious"]).describe("Section spacing rhythm: compact, normal, or spacious").optional(),
      company_name: z.string().optional(),
      physical_address: z.string().optional(),
      company_description: z.string().optional()
    }).passthrough().optional(),
    document: z.string().optional(),
    scan_id: z.string().optional(),
    new_brand: z.string().optional(),
    dry_run: z.boolean().default(false),
    mode: z.enum(["sync", "async"]).default("sync"),
    idempotency_key: z.string().max(128).describe("Required for URL scraping or remote logo fetch; reuse only for an exact retry.").optional()
  }).strict(),
  nitro_set_memory: z.object({
    operation: z.enum(["read", "update", "patch", "append"]).describe("read: get current document. update: replace entirely. patch: replace a ## section by heading. append: add text to end."),
    document: z.string().describe("Full markdown document (required for update).").optional(),
    heading: z.string().describe("Section heading to patch (e.g. 'Brand Goals'). Required for patch operation. Matches ## headings.").optional(),
    content: z.string().describe("New content for the section (patch) or text to append (append).").optional(),
    dry_run: z.boolean().default(false),
    idempotency_key: z.string().max(128).describe("Required for non-dry-run append. Reuse the same key only for an exact retry. Update and patch are set operations and may omit it.").optional()
  }).strict(),
} as const;

export type NitrosendToolName = keyof typeof nitrosendToolSchemas;

export const nitrosendToolNames: readonly NitrosendToolName[] = Object.freeze(
  Object.keys(nitrosendToolSchemas) as NitrosendToolName[],
);

export type NitrosendToolSchemaMap<T extends readonly NitrosendToolName[]> = {
  [K in T[number]]: { inputSchema: (typeof nitrosendToolSchemas)[K] };
};

export function pickNitrosendToolSchemas<const T extends readonly NitrosendToolName[]>(
  ...names: T
): NitrosendToolSchemaMap<T> {
  const out: Record<string, { inputSchema: unknown }> = {};
  for (const name of names) {
    out[name] = { inputSchema: nitrosendToolSchemas[name] };
  }
  return out as NitrosendToolSchemaMap<T>;
}
