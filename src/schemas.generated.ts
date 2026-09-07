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
    type: "email" | "sms" | "wait" | "split" | "emit_event" | "webhook" | "subscribe" | "unsubscribe";
    subject?: string;
    body?: string;
    plain_text_mode?: "derived" | "custom";
    preheader?: string;
    from_name?: string;
    from_email?: string;
    reply_to?: string;
    design?: Record<string, unknown>;
    if_version?: number;
    template_version?: number;
    bcc?: string;
    duration?: number;
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
    key: z.string().describe("Scaffold identity for a retained new node.").optional(),
    type: z.enum(["email", "sms", "wait", "split", "emit_event", "webhook", "subscribe", "unsubscribe"]),
    subject: z.string().optional(),
    body: z.string().optional(),
    plain_text_mode: z.enum(["derived", "custom"]).describe("Whether plain text is derived or custom.").optional(),
    preheader: z.string().optional(),
    from_name: z.string().optional(),
    from_email: z.string().optional(),
    reply_to: z.string().optional(),
    design: z.object({}).passthrough().describe("Email {sections, theme} design.").optional(),
    if_version: z.number().int().describe("Version required for an existing email patch.").optional(),
    template_version: z.number().int().optional(),
    bcc: z.string().describe("BCC for a new-flow email only.").optional(),
    duration: z.number().int().describe("Wait seconds.").optional(),
    event_name: z.string().describe("Lowercase underscore event name.").optional(),
    event_data: z.object({}).passthrough().describe("Static emitted-event data.").optional(),
    event_data_keys: z.array(z.string()).describe("Frozen non-secret keys; copy from next_call.").optional(),
    forward_event_data: z.boolean().default(false).describe("Forward triggering event data."),
    url: z.string().describe("Webhook URL; supports merge tags.").optional(),
    endpoint_configured: z.boolean().describe("Frozen endpoint marker; copy from next_call.").optional(),
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
    mode: z.enum(["create", "patch", "replace"]).default("create").describe("create a draft; patch supplied fields; replace all draft state and requires confirm."),
    campaign_id: z.number().int().optional(),
    channel: z.enum(["email", "sms"]).default("email").describe("email or sms; immutable after creation."),
    goal: z.string().optional(),
    category: z.enum(["promotion", "announcement", "newsletter", "welcome", "reengagement", "transactional", "plain", "outreach"]).describe("Email job used to select a baseline.").optional(),
    composition_mode: z.enum(["intent", "draft", "validate", "generate"]).describe("intent plans; validate checks; draft persists; generate composes and persists.").optional(),
    contract_id: z.string().optional(),
    brand_context_ref: z.string().optional(),
    validate_only: z.boolean().default(false).describe("Alias for validate; never persists."),
    design_mode_override: z.enum(["premium_rich", "premium_minimal", "founder_letter", "utility_plain"]).optional(),
    renegotiate: z.boolean().default(false),
    user_instruction: z.string().optional(),
    creative_route_id: z.string().describe("Intent-only route id; unavailable or invalid routes fail explicitly.").optional(),
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
    }).passthrough().describe("Optional authoring provenance; never blocks validation or persistence.").optional(),
    subject: z.string().optional(),
    preheader: z.string().optional(),
    from_name: z.string().optional(),
    from_email: z.string().optional(),
    reply_to: z.string().optional(),
    body: z.string().optional(),
    plain_text_mode: z.enum(["derived", "custom"]).describe("Whether plain text is derived or custom.").optional(),
    sections: z.array(z.object({}).passthrough()).describe("Email design sections; requires subject. Images accept public or nitro_ingest media_url/image_url, never raw signed_id.").optional(),
    theme: z.object({}).passthrough().describe("Brand-theme overrides. logo_url must be public or a nitro_ingest media_url/image_url, never raw signed_id.").optional(),
    template_id: z.number().int().optional(),
    if_version: z.number().int().describe("Version token for conflict-safe writes.").optional(),
    audience: z.object({
      audience_type: z.enum(["lists", "segment", "all_contacts"]).describe("lists, segment, or all_contacts.").optional(),
      contact_list_ids: z.array(z.number().int()).optional(),
      contact_list_id: z.number().int().describe("Deprecated single list id.").optional(),
      segment_id: z.number().int().optional(),
      exclude_segment_ids: z.array(z.number().int()).describe("Suppressed segment ids; [] clears.").optional(),
      exclude_contact_list_ids: z.array(z.number().int()).describe("Suppressed list ids; [] clears.").optional()
    }).passthrough().describe("Target audience; all_contacts must be explicit.").optional(),
    scheduled_at: z.iso.datetime().describe("ISO 8601 delivery time.").optional(),
    dry_run: z.boolean().default(false),
    idempotency_key: z.string().max(128).describe("Required for non-dry-run persistence; reuse only for an exact retry.").optional(),
    confirm: z.boolean().default(false)
  }).strict(),
  nitro_compose_flow: z.object({
    name: z.string().describe("Flow name; required when creating.").optional(),
    mode: z.enum(["create", "replace", "patch"]).default("create").describe("create: new complete graph; replace: complete existing draft graph; patch: name and/or selected email actions"),
    flow_id: z.number().int().optional(),
    expected_updated_at: z.string().describe("Legacy compatibility token; prefer draft revision id.").optional(),
    expected_draft_revision_id: z.number().int().describe("Latest draft revision id for conflict-safe writes.").optional(),
    goal: z.string().optional(),
    composition_mode: z.enum(["intent", "draft", "validate", "generate"]).describe("intent plans; validate checks; draft persists; generate composes and persists.").optional(),
    contract_id: z.string().optional(),
    brand_context_ref: z.string().optional(),
    validate_only: z.boolean().default(false).describe("Alias for validate; never persists."),
    design_mode_override: z.enum(["premium_rich", "premium_minimal", "founder_letter", "utility_plain"]).optional(),
    renegotiate: z.boolean().default(false),
    user_instruction: z.string().optional(),
    creative_route_id: z.string().describe("Intent-only sequence-wide route id; invalid choices fail.").optional(),
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
    }).passthrough().describe("Optional authoring provenance; never blocks validation or persistence.").optional(),
    trigger: z.object({
      event: z.string().describe("Built-in or lowercase underscore event name.").optional(),
      action_name: z.string().describe("Persisted trigger identity; preserve it.").optional(),
      segment_id: z.number().int().optional(),
      contact_list_id: z.number().int().optional(),
      resource_type: z.string().describe("Frozen trigger resource type.").optional(),
      resource_id: z.unknown().describe("Frozen trigger resource id.").optional(),
      data: z.object({}).passthrough().describe("Event-specific configuration.").optional()
    }).passthrough().optional(),
    steps: z.array(NitroComposeFlowFlowStepSchema).describe("Ordered graph steps; exact typed fields are in $defs.flowStep.").optional(),
    dry_run: z.boolean().default(false),
    idempotency_key: z.string().max(128).describe("Required for non-dry-run persistence; reuse only for an exact retry.").optional(),
    confirm: z.boolean().default(false)
  }).strict(),
  nitro_configure_account: z.object({
    from_name: z.string().describe("Sender display name (e.g. 'Acme Marketing')").optional(),
    from_email: z.string().describe("Exact visible From address to select. May use the apex when a ready aligned sending subdomain authorizes it.").optional(),
    reply_to: z.string().describe("Reply-to email address").optional(),
    test_email_recipients: z.array(z.email()).max(5).describe("Saved email addresses for test sends (max 5). Pass empty array to clear.").optional()
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
    revision_id: z.number().int().gte(1).describe("Optional for flow approve, reject, and live. Omit to use the current draft; supply it as a current-draft staleness assertion.").optional(),
    confirm_send_to_all: z.boolean().describe("Explicit all_contacts confirmation for live/schedule.").optional(),
    confirm: z.boolean().describe("Required for delete.").optional(),
    idempotency_key: z.string().describe("Campaign-live retry key; reuse only for the same send.").optional()
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
    scope: z.enum(["account", "flow", "campaign", "message"]).describe("Scope of insights: account-wide, per flow, per campaign, or per message"),
    entity_id: z.number().int().gte(1).describe("Required for flow/campaign/message scope").optional(),
    period: z.enum(["7d", "30d", "90d"]).default("30d").describe("Time period for metrics (default 30d)")
  }).strict(),
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
      opt_in: z.boolean().describe("Explicit subscription state; required true for SMS opt-in.").optional()
    }).passthrough()).describe("Up to 100 contacts; use data for custom fields.").optional(),
    import_id: z.number().int().optional(),
    signed_id: z.string().describe("signed_id returned after the reserved CSV upload PUT.").optional(),
    upload: z.object({
      filename: z.string(),
      content_type: z.string(),
      byte_size: z.number().int(),
      checksum: z.string().describe("Base64 MD5.")
    }).strict().describe("Reserve a CSV upload; PUT bytes, then process its signed_id.").optional(),
    resource: z.string().default("contacts"),
    parser: z.string().default("default"),
    columns: z.object({}).passthrough().optional(),
    options: z.object({
      list_ids: z.array(z.number().int()).optional()
    }).passthrough().describe("Import options, including list_ids.").optional(),
    dry_run: z.boolean().default(false),
    idempotency_key: z.string().optional()
  }).strict(),
  nitro_inbox: z.object({
    command: z.enum(["list_queue", "get_item", "validate_reply", "list_mailbox", "get_thread", "get_thread_page", "get_message_body"]),
    action_item_id: z.number().int().optional(),
    conversation_id: z.number().int().optional(),
    before_occurred_at: z.string().describe("Exact ISO 8601 thread cursor returned by get_thread or get_thread_page").optional(),
    before_message_id: z.number().int().describe("Exact thread cursor message id returned with before_occurred_at").optional(),
    message_id: z.number().int().optional(),
    offset: z.number().int().gte(0).describe("Exact sanitized-body character offset returned by get_thread or get_message_body").optional(),
    state: z.enum(["quarantine", "needs_human", "agent_ready", "handled", "needs_attention", "all"]).describe("Optional queue state filter; default needs_attention").optional(),
    status: z.enum(["open", "closed", "archived"]).optional(),
    query: z.string().optional(),
    inbox_id: z.number().int().optional(),
    page: z.number().int().optional(),
    per: z.number().int().optional(),
    brand_context_ref: z.string().describe("Current context ref for get_item/get_thread.").optional(),
    reply_context_digest: z.string().describe("Current reply_context.context_digest required by validate_reply.").optional(),
    subject: z.string().optional(),
    body: z.string().optional(),
    html: z.string().optional()
  }).strict(),
  nitro_inbox_action: z.object({
    command: z.enum(["send_reply", "send_reply_test", "mark_handled", "request_human", "release_to_agent", "mark_quarantine", "classify_spam", "set_sender_policy", "set_read_state", "set_contact"]).describe("Inbox action command"),
    action_item_id: z.number().int().describe("Queue item id for queue-gated commands").optional(),
    conversation_id: z.number().int().describe("Mailbox conversation id for reply commands").optional(),
    subject: z.string().describe("Optional reply subject for send_reply or send_reply_test").optional(),
    body: z.string().describe("Plain text reply body for send_reply or send_reply_test").optional(),
    html: z.string().describe("Optional HTML reply body for send_reply or send_reply_test").optional(),
    reply_context_digest: z.string().describe("Current reply_context.context_digest from nitro_inbox get_item/get_thread. Required for reply commands.").optional(),
    to: z.array(z.string()).max(5).describe("Explicit test recipients for send_reply_test").optional(),
    idempotency_key: z.string().describe("Required for all action commands").optional(),
    dry_run: z.boolean().default(false).describe("Validate send_reply or send_reply_test without creating or sending"),
    classification: z.enum(["spam", "not_spam"]).describe("Spam feedback for classify_spam").optional(),
    inbox_id: z.number().int().describe("Inbox id for sender policy").optional(),
    matcher_type: z.enum(["address", "domain"]).optional(),
    matcher_value: z.string().optional(),
    decision: z.enum(["allow", "block"]).optional(),
    read: z.boolean().describe("Read or unread state for set_read_state").optional(),
    last_read_message_id: z.number().int().optional(),
    contact_id: z.number().int().describe("Existing contact id for set_contact").optional(),
    create_contact: z.boolean().default(false),
    first_name: z.string().optional(),
    last_name: z.string().optional()
  }).strict(),
  nitro_ingest: z.object({
    kind: z.string().optional(),
    image_data: z.string().describe("Base64/data URL for PNG, JPEG, or WebP under 10 MB.").optional(),
    image_url: z.string().describe("Public PNG, JPEG, or WebP URL under 10 MB.").optional(),
    signed_id: z.string().describe("signed_id returned after the reserved upload PUT.").optional(),
    description: z.string().describe("Truthful visible content for library selection and alt text.").optional(),
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
    operation: z.enum(["create_contact", "update_contact", "set_subscription", "manage_list", "record_event", "delete_segment", "bulk_tag", "validate"]).describe("Choose one audience operation. validate accepts exactly one of contact_channel_ids, contact_ids, list_id, or segment_id. Dry-run quotes without mutation; execution needs idempotency_key and prepaid funds. Deletion needs confirm."),
    params: z.object({}).passthrough().describe("Parameters named by operation. Contact custom fields belong in attributes.data."),
    dry_run: z.boolean().default(false).describe("Preview changes without persisting (default: false)"),
    confirm: z.boolean().default(false).describe("Required for destructive operations: delete_segment, manage_list with action='delete'"),
    idempotency_key: z.string().describe("Optional deduplication key. Same key returns cached result.").optional()
  }).strict(),
  nitro_manage_billing: z.object({
    operation: z.enum(["status", "checkout", "checkout_status", "plans", "add_funds", "funding_purchase_status"]).describe("Billing operation. Start with status; use plans/checkout for subscriptions and add_funds/funding_purchase_status for prepaid balance."),
    params: z.object({
      plan_id: z.number().int().describe("Plan ID (required for checkout)").optional(),
      confirm: z.boolean().describe("Set true only after operator confirmation when checkout reports confirmation_required").optional(),
      amount_cents: z.number().int().describe("Integer amount in minor currency units").optional(),
      currency: z.string().describe("Three-letter funding currency").optional(),
      instrument: z.enum(["stripe_checkout", "shopify_one_time"]).describe("Optional add-funds instrument; omit to use the account default").optional(),
      purchase_id: z.number().int().describe("Local purchase ID returned by checkout or add_funds, interpreted by operation").optional()
    }).strict().describe("Operation parameters: checkout requires plan_id and may require confirm; checkout_status accepts its plan purchase_id; add_funds requires amount_cents and currency; funding_purchase_status requires its funding purchase_id.").optional(),
    idempotency_key: z.string().max(128).describe("Required stable key for checkout and add_funds. Reuse it only for an unchanged request.").optional()
  }).strict(),
  nitro_manage_domains: z.object({
    operation: z.enum(["prepare_brand_subdomain", "select_brand_subdomain", "add", "verify", "check_dns", "list", "remove"]).describe("prepare_brand_subdomain locally materializes the shared-root sender and is idempotent.\nselect_brand_subdomain selects a ready sender with optional local_part and apex.\nadd registers a customer domain and returns required DNS records.\nverify checks provider and DNS readiness. check_dns diagnoses DNS and tracking HTTPS only.\nlist returns domains, readiness, records, DMARC, and allowance use.\nremove requires domain_name and confirm; retry paired removal with unpair after showing its effect."),
    params: z.object({
      domain_name: z.string().describe("Customer sending domain for add, verify, check_dns, or remove.").optional(),
      author_domain: z.string().describe("Optional aligned visible From domain for Nitrosend SES.").optional(),
      local_part: z.string().describe("Optional brand-subdomain From local part.").optional(),
      apex: z.string().describe("Optional active Nitrosend sending apex.").optional(),
      unpair: z.boolean().describe("Confirm removal of the domain's identity pair.").optional()
    }).strict().describe("Operation-specific parameters.").optional(),
    confirm: z.boolean().default(false).describe("Required for remove operation (destructive)")
  }).strict(),
  nitro_manage_outreach: z.object({
    action: z.enum(["intent", "estimate", "start", "status", "pause", "resume", "cancel"]),
    goal: z.string().describe("Outreach objective for intent.").optional(),
    name: z.string().describe("Required for start.").optional(),
    target_profile: z.object({
      criteria: z.array(z.object({
        key: z.string().optional(),
        subject: z.enum(["prospect", "company", "signal"]).default("prospect"),
        field: z.string().describe("Canonical person, company, or signal field."),
        operator: z.enum(["equals", "includes", "includes_any", "in", "range", "present"]).default("equals"),
        value: z.unknown().describe("Scalar, list, or range; omit for present.").optional(),
        required: z.boolean().default(false).describe("Unknown/mismatch prevents a match."),
        weight: z.number().default(1),
        minimum_confidence: z.number().gte(0).lte(1).default(0),
        maximum_age_days: z.number().int().gte(1).optional()
      }).strict()).min(1)
    }).strict().optional(),
    capabilities: z.array(z.enum(["professional_profiles", "connected_profiles", "community_signals", "hiring_activity"])).refine(values => new Set(values).size === values.length, { message: "Array items must be unique" }).describe("Requested intent capabilities; required capabilities remain included.").optional(),
    seeds: z.array(z.object({
      domain: z.string().optional(),
      website_url: z.string().optional(),
      careers_url: z.string().optional(),
      company_name: z.string().optional(),
      first_name: z.string().optional(),
      last_name: z.string().optional(),
      linkedin_url: z.string().optional(),
      source_record_id: z.string().optional()
    }).strict()).max(100).describe("Up to 100 first-party person/company seeds.").optional(),
    seed_artifacts: z.array(z.object({
      signed_id: z.string()
    }).strict()).max(5).describe("Uploaded CSV seed manifests.").optional(),
    exclusions: z.object({
      company_domains: z.array(z.string()).max(100).refine(values => new Set(values).size === values.length, { message: "Array items must be unique" }).optional()
    }).strict().describe("Campaign company exclusions; brand suppressions always apply.").optional(),
    target_count: z.number().int().gte(1).lte(1000).describe("Qualified-person limit.").optional(),
    maximum_spend_cents: z.number().int().gte(0).describe("Authorized USD-cent cap from estimate.").optional(),
    campaign_id: z.number().int().describe("Required for status or control.").optional(),
    brand_context_ref: z.string().describe("Current ref returned by intent.").optional(),
    idempotency_key: z.string().max(128).describe("Required for start; reuse only for an exact retry.").optional()
  }).strict(),
  nitro_manage_template: z.object({
    sections: z.array(z.object({}).passthrough()).describe("Email sections. Follow next_call for composition; use nitro://schema only for full authoring. Images use public or nitro_ingest media_url/image_url, never signed_id.").optional(),
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
    validate_only: z.boolean().default(false).describe("Alias for validate; never persists."),
    design_mode_override: z.enum(["premium_rich", "premium_minimal", "founder_letter", "utility_plain"]).optional(),
    renegotiate: z.boolean().default(false),
    user_instruction: z.string().optional(),
    creative_route_id: z.string().describe("Intent-only route id; unavailable or invalid routes fail explicitly.").optional(),
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
    }).passthrough().describe("Optional authoring provenance; never blocks validation or persistence.").optional(),
    preheader: z.string().optional(),
    body: z.string().describe("Plain-text alternative for custom mode.").optional(),
    plain_text_mode: z.enum(["derived", "custom"]).describe("Whether plain text is derived or custom.").optional(),
    from_name: z.string().optional(),
    from_email: z.string().optional(),
    reply_to: z.string().optional(),
    theme: z.object({}).passthrough().describe("Brand-theme overrides; logo_url uses public or nitro_ingest media_url/image_url, never signed_id.").optional(),
    template_id: z.number().int().optional(),
    based_on: z.number().int().optional(),
    if_version: z.number().int().describe("Version token for conflict-safe writes.").optional(),
    goal: z.string().optional(),
    dry_run: z.boolean().default(false),
    idempotency_key: z.string().max(128).describe("Required for non-dry-run persistence; reuse only for an exact retry.").optional()
  }).strict(),
  nitro_query: z.object({
    entity: z.enum(["flows", "campaigns", "templates", "segments", "contacts", "lists", "events", "imports", "messages", "suppressions", "history", "products"]).describe("Which entity type to query. Use nitro_search_contacts for full-text contact search."),
    filters: z.object({}).passthrough().describe("Entity filters: flows status/campaign_id/trigger_event/search; campaigns status/search; templates subject; segments/lists name; contacts query/subscribed_email/subscribed_phone/list_id; events name/from/to; imports status; messages channel/status/to; suppressions email/reason/source_provider/active; history source/event_type/tool/actor/correlation_id/resource_uri/from/to; products status/query. All support integer id.").optional(),
    page: z.number().int().describe("Page number (default 1)").optional(),
    per: z.number().int().describe("Results per page (max 50, default 25)").optional()
  }).strict(),
  nitro_request_support: z.object({
    subject: z.string().describe("Brief summary of the issue"),
    message: z.string().describe("Complete, self-contained summary of the issue. Must fit within 1500 characters; do not rely on truncation.")
  }).strict(),
  nitro_review_delivery: z.object({
    target_type: z.enum(["template", "flow", "campaign"]).describe("Entity type to review").optional(),
    target_id: z.number().int().gte(1).describe("Entity ID to review").optional(),
    revision_id: z.number().int().gte(1).describe("Optional for flows. Omit to review the current draft, or supply its ID as a current-draft assertion.").optional(),
    contact_id: z.number().int().gte(1).describe("Optional contact ID for merge-tag personalization during review").optional(),
    subject: z.string().max(998).describe("Subject for a self-contained inline email review").optional(),
    html: z.string().min(1).max(262144).describe("Rendered HTML for a self-contained inline email review").optional()
  }).strict(),
  nitro_search_contacts: z.object({
    query: z.string().describe("Email address, name, or phone number"),
    mode: z.enum(["summary", "profile"]).describe("summary = list, profile = single contact detail (default: summary)").optional(),
    page: z.number().int().describe("Page number (default 1)").optional(),
    per: z.number().int().describe("Results per page (max 50, default 25)").optional()
  }).strict(),
  nitro_search_docs: z.object({
    query: z.string().describe("What to look up, e.g. 'verify sending domain', 'rest api authentication', 'cli install', 'connect cursor'"),
    limit: z.number().int().default(6).describe("Maximum results to return (default 6, max 10)")
  }).strict(),
  nitro_select_account: z.object({
    account_id: z.number().int().describe("ID of the account to switch to. Get IDs from nitro_get_status.available_accounts.items[*].id.")
  }).strict(),
  nitro_select_brand: z.object({
    brand_sid: z.string().describe("Exact brand SID to select. Provide either brand_sid or name.").optional(),
    name: z.string().describe("Brand name to select when the SID is unknown. Provide either name or brand_sid. Ambiguous names return candidates without changing context.").optional()
  }).strict(),
  nitro_send_message: z.object({
    channel: z.enum(["email", "sms"]).describe("Delivery channel"),
    to: z.string().describe("Recipient email address or E.164 phone number"),
    subject: z.string().describe("Email subject line (required for email)").optional(),
    body: z.string().describe("Message body. Required for SMS. Optional plain text for email.").optional(),
    template_id: z.number().int().describe("Load email design from an existing template (email only)").optional(),
    data: z.object({}).passthrough().describe("Transactional merge variables. Use in email templates as {{ data.order_id }} or nested paths like {{ data.customer.name }}.").optional(),
    idempotency_key: z.string().min(1).describe("Required for live sends. Reuse the same stable key on retry to prevent duplicate delivery."),
    dry_run: z.boolean().default(false).describe("Validate and preview without sending")
  }).strict(),
  nitro_send_test_message: z.object({
    target_type: z.enum(["template", "flow", "campaign"]).describe("Target entity type. Use with target_id unless latest_campaign or template_id is used.").optional(),
    target_id: z.number().int().gte(1).describe("Target entity ID. Use with target_type.").optional(),
    latest_campaign: z.boolean().default(false).describe("Use the most recently created campaign in this brand."),
    template_id: z.number().int().gte(1).describe("Template to test directly, or the specific flow/campaign template to choose.").optional(),
    action_id: z.number().int().gte(1).describe("Flow action ID to test when a flow has multiple message steps.").optional(),
    revision_id: z.number().int().gte(1).describe("Required for flow targets. Exact immutable flow revision to test.").optional(),
    channel: z.enum(["auto", "email", "sms"]).default("auto").describe("Channel to test. Use auto unless a standalone template is ambiguous."),
    contact_id: z.number().int().gte(1).describe("Contact ID for recipient and merge-tag personalization. If present, this contact supplies the recipient address/phone.").optional(),
    to: z.array(z.string()).max(5).describe("Explicit test recipients. Use email addresses for email targets and E.164 phone numbers for SMS targets.").optional(),
    data: z.object({}).passthrough().describe("Sample values for required data.* merge fields in an email test.").optional(),
    dry_run: z.boolean().default(false).describe("Validate target and recipients without sending."),
    idempotency_key: z.string().min(1).describe("Required for live test sends. Reuse the same stable key on retry to prevent duplicate delivery.").optional()
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
    }).passthrough().describe("Typed Brand Kit fields.").optional(),
    document: z.string().optional(),
    dry_run: z.boolean().default(false),
    mode: z.enum(["sync", "async"]).default("sync"),
    idempotency_key: z.string().max(128).describe("Required for live URL scraping or remote logo fetch; reuse only for an exact retry.").optional()
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
