// AUTO-GENERATED. Do not edit by hand.
// Source: docs/nitrosend.mcp.json
// Regenerate with: npm run generate:schemas

import { z } from 'zod';

export const nitrosendToolSchemas = {
  nitro_compose_campaign: z.object({
    name: z.string().describe("Campaign name").optional(),
    mode: z.enum(["create", "patch", "replace"]).default("create").describe("create: new campaign; patch: update provided fields on an existing draft campaign; replace: replace existing draft content/audience/schedule and requires confirm: true. Replace clears omitted audience/schedule. Patch/replace cannot change channel."),
    campaign_id: z.number().int().describe("Required for patch/replace modes").optional(),
    channel: z.enum(["email", "sms"]).default("email").describe("Auto-detected as 'email' when sections or template_id provided. Set explicitly to 'sms' for SMS campaigns. Immutable after campaign creation."),
    goal: z.string().describe("Goal string for host-composed campaign composition contracts").optional(),
    composition_mode: z.enum(["intent", "draft", "validate"]).describe("intent returns composition_contract; validate checks a draft without persistence; draft validates and persists.").optional(),
    contract_id: z.string().describe("Email composition contract id returned from composition_mode=intent.").optional(),
    validate_only: z.boolean().default(false).describe("Alias for composition_mode=validate. Does not persist or consume repair attempts."),
    design_mode_override: z.enum(["premium_rich", "premium_minimal", "founder_letter", "utility_plain"]).describe("Renegotiate/validate the draft under a different design mode.").optional(),
    renegotiate: z.boolean().default(false).describe("When true with design_mode_override, keeps the same contract but changes the design mode."),
    user_instruction: z.string().describe("Latest user instruction to preserve inside the composition contract.").optional(),
    draft_meta: z.object({
      creative_route_id: z.string().describe("Chosen composition_contract.creative_routes[].id").optional(),
      concrete_anchor: z.string().describe("Specific proof, product detail, visual, code/output, quote, number, or brand moment used.").optional(),
      why_this_earns_the_inbox: z.string().describe("One sentence explaining the creative move.").optional()
    }).passthrough().describe("Host-composed draft metadata from composition_contract: creative_route_id, concrete_anchor, why_this_earns_the_inbox.").optional(),
    subject: z.string().describe("Email subject line (email campaigns)").optional(),
    preheader: z.string().describe("Email preheader (email campaigns)").optional(),
    from_name: z.string().describe("Sender name override").optional(),
    from_email: z.string().describe("Sender email override").optional(),
    reply_to: z.string().describe("Reply-to email override").optional(),
    body: z.string().describe("SMS body text (sms campaigns) or email plain text").optional(),
    sections: z.array(z.object({}).passthrough()).describe("Email design sections array — same format as nitro_manage_template. Requires subject.").optional(),
    theme: z.object({}).passthrough().describe("Email theme overrides merged on brand theme: {brand_color, bg_color, text_color, font_body, font_heading, logo_url}").optional(),
    template_id: z.number().int().describe("Clone design from existing template (email campaigns)").optional(),
    if_version: z.number().int().describe("Optimistic concurrency token for patch/replace writes to an existing campaign template.").optional(),
    audience: z.object({
      audience_type: z.enum(["lists", "segment", "all_contacts"]).describe("Explicit audience target: lists, segment, or all_contacts").optional(),
      contact_list_ids: z.array(z.number().int()).describe("Send to contacts in these lists (union with dedup)").optional(),
      contact_list_id: z.number().int().describe("Deprecated — use contact_list_ids. Send to contacts in this list").optional(),
      segment_id: z.number().int().describe("Filter trigger to contacts matching this segment").optional()
    }).passthrough().describe("Target audience for the campaign. Use audience_type='all_contacts' only for an explicit all-subscribed-contacts send.").optional(),
    scheduled_at: z.iso.datetime().describe("ISO 8601 delivery time (e.g. '2026-03-01T10:00:00Z'). Omit for manual send.").optional(),
    dry_run: z.boolean().default(false).describe("Preview campaign without creating (default: false)"),
    idempotency_key: z.string().describe("Optional deduplication key").optional(),
    confirm: z.boolean().default(false).describe("Required for replace mode")
  }).strict(),
  nitro_compose_flow: z.object({
    name: z.string().describe("Flow name (required for create mode)").optional(),
    mode: z.enum(["create", "replace", "patch"]).default("create").describe("create: new flow; replace: rebuild existing flow graph; patch: metadata only"),
    flow_id: z.number().int().describe("Required for replace/patch modes").optional(),
    goal: z.string().describe("Goal string for host-composed flow composition contracts").optional(),
    composition_mode: z.enum(["intent", "draft", "validate"]).describe("intent returns composition_contract; validate checks a draft without persistence; draft validates and persists.").optional(),
    contract_id: z.string().describe("Email composition contract id returned from composition_mode=intent.").optional(),
    validate_only: z.boolean().default(false).describe("Alias for composition_mode=validate. Does not persist or consume repair attempts."),
    design_mode_override: z.enum(["premium_rich", "premium_minimal", "founder_letter", "utility_plain"]).describe("Renegotiate/validate the draft under a different design mode.").optional(),
    renegotiate: z.boolean().default(false).describe("When true with design_mode_override, keeps the same contract but changes the design mode."),
    user_instruction: z.string().describe("Latest user instruction to preserve inside the composition contract.").optional(),
    draft_meta: z.object({
      creative_route_id: z.string().describe("Chosen composition_contract.creative_routes[].id").optional(),
      concrete_anchor: z.string().describe("Specific proof, product detail, visual, code/output, quote, number, or brand moment used.").optional(),
      why_this_earns_the_inbox: z.string().describe("One sentence explaining the creative move.").optional()
    }).passthrough().describe("Host-composed draft metadata from composition_contract: creative_route_id, concrete_anchor, why_this_earns_the_inbox.").optional(),
    trigger: z.object({
      event: z.string().describe("Trigger event name. Built-in: contact_add, contact_enriched, keyword, message, list_add, list_remove, product_view, checkout, cart_add, cart_remove, cart_abandoned, browse_abandoned. Custom: any lowercase alphanumeric with underscores (e.g. order_confirmed, password_reset).").optional(),
      segment_id: z.number().int().describe("Optional segment filter on trigger").optional(),
      contact_list_id: z.number().int().describe("Optional contact list for audience targeting").optional(),
      data: z.object({}).passthrough().describe("Event-specific config (e.g. {keywords: ['STOP']})").optional()
    }).passthrough().optional(),
    steps: z.array(z.object({
      type: z.enum(["email", "sms", "wait", "split", "emit_event", "webhook", "subscribe", "unsubscribe"]),
      subject: z.string().describe("Email subject line (email steps)").optional(),
      body: z.string().describe("SMS body text (sms steps) or email plain text").optional(),
      preheader: z.string().describe("Email preheader (email steps)").optional(),
      from_name: z.string().describe("Sender name override (email steps)").optional(),
      from_email: z.string().describe("Sender email override (email steps)").optional(),
      reply_to: z.string().describe("Reply-to override (email steps)").optional(),
      design: z.object({}).passthrough().describe("Email design: { sections: [...], theme: {...} }").optional(),
      if_version: z.number().int().describe("Optimistic concurrency token for replace-mode writes to an existing backing template.").optional(),
      template_version: z.number().int().describe("Read-only backing template version returned by Nitrosend; pass it back as if_version when replacing a flow.").optional(),
      bcc: z.string().describe("Optional BCC email address. A copy of each email sent by this step will be blind-copied to this address.").optional(),
      duration: z.number().int().describe("Wait duration in seconds (wait steps)").optional(),
      event_name: z.string().describe("Event name to fire (emit_event steps). Lowercase alphanumeric with underscores.").optional(),
      event_data: z.object({}).passthrough().describe("Static data payload for emitted event (emit_event steps)").optional(),
      forward_event_data: z.boolean().default(false).describe("Merge triggering event data into emitted event (emit_event steps)"),
      url: z.string().describe("Webhook URL (webhook steps). Supports merge tags.").optional(),
      method: z.enum(["POST", "PUT"]).default("POST").describe("HTTP method (webhook steps)"),
      headers: z.object({}).passthrough().describe("Custom HTTP headers as key-value pairs (webhook steps)").optional(),
      filters: z.array(z.object({
        name: z.enum(["contact_first_name", "contact_last_name", "contact_phone_number", "contact_email", "contact_country", "contact_subscribed_phone", "contact_subscribed_email", "contact_created_at", "contact_last_interacted_at", "contact_source", "contact_tag", "contact_verified", "contact_enriched"]).describe("Filter name — read nitro://schema for full details"),
        predicate: z.enum(["eq", "not_eq", "cont", "not_cont", "start", "end", "gt", "lt", "gteq", "lteq", "present", "blank", "true", "false", "in", "not_in"]).describe("Ransack predicate"),
        value: z.unknown().describe("Filter value. For present/blank/true/false predicates, omit or pass true.").optional()
      }).passthrough()).describe("Split condition filters").optional(),
      yes: z.array(z.object({}).passthrough()).describe("Steps for yes branch (split steps, nested splits allowed)").optional(),
      no: z.array(z.object({}).passthrough()).describe("Steps for no branch (split steps, nested splits allowed)").optional(),
      channel: z.enum(["phone", "email", "all"]).default("phone").describe("Channel for subscribe/unsubscribe steps")
    }).passthrough()).describe("Ordered array of flow steps. Required props per type:\n\n- **email** — subject (required), design ({sections, theme}) or body, preheader, from_name, from_email, reply_to, bcc (string, optional BCC email address)\n- **sms** — body (required)\n- **wait** — duration (integer, seconds — e.g. 86400 = 1 day)\n- **split** — filters (required, [{name, predicate, value}]), yes (steps array), no (steps array). Nested splits are allowed.\n- **emit_event** — event_name (required), event_data (object), forward_event_data (boolean)\n- **webhook** — url (required), method (POST or PUT, default POST), headers (object), body (template string with merge tags)\n- **subscribe** — channel (phone, email, or all — default phone). Subscribes the contact.\n- **unsubscribe** — channel (phone, email, or all — default phone). Unsubscribes the contact.").optional(),
    dry_run: z.boolean().default(false).describe("Preview graph without persisting"),
    idempotency_key: z.string().describe("Deduplication key for retry safety").optional(),
    confirm: z.boolean().default(false).describe("Required for replace mode")
  }).strict(),
  nitro_configure_account: z.object({
    from_name: z.string().describe("Sender display name (e.g. 'Acme Marketing')").optional(),
    from_email: z.string().describe("Visible From address. May use the apex domain when an aligned sending subdomain authorizes it.").optional(),
    reply_to: z.string().describe("Reply-to email address").optional(),
    test_email_recipients: z.array(z.email()).max(5).describe("Saved email addresses for test sends (max 5). Pass empty array to clear.").optional()
  }).strict(),
  nitro_configure_providers: z.object({
    operation: z.enum(["configure", "status"]).describe("configure sets BYO provider credentials; status checks current provider health"),
    provider: z.enum(["mailgun", "ses"]).describe("Email provider (required for configure)").optional(),
    api_key: z.string().describe("Provider API key (required for configure, never returned in responses)").optional(),
    api_secret: z.string().describe("Optional provider secret (never returned in responses)").optional(),
    region: z.string().describe("Optional provider region, e.g. us-east-1").optional()
  }).strict(),
  nitro_control_delivery: z.object({
    target_type: z.enum(["flow", "campaign"]).describe("Entity type"),
    target_id: z.number().int().gte(1).describe("Entity ID"),
    operation: z.enum(["approve", "reject", "live", "schedule", "pause", "resume", "cancel", "archive", "restore", "delete"]).describe("Lifecycle operation. approve runs preflight. schedule is campaign-only (requires scheduled_at). delete requires confirm: true and only applies to never-sent non-live drafts/archives."),
    scheduled_at: z.iso.datetime().describe("Required for schedule operation (ISO 8601 datetime)").optional(),
    confirm_send_to_all: z.boolean().describe("Required when making a campaign live or scheduled with audience_type='all_contacts'. Forces an explicit all-subscribed-contacts confirmation.").optional(),
    confirm: z.boolean().describe("Required for operation='delete'.").optional(),
    idempotency_key: z.string().describe("Optional retry key for campaign live sends. Reuse the same key after a timeout to recover the same delivery progress.").optional()
  }).strict(),
  nitro_define_segment: z.object({
    name: z.string().describe("Segment name (required when preview_only: false)").optional(),
    filters: z.array(z.object({
      name: z.enum(["contact_first_name", "contact_last_name", "contact_phone_number", "contact_email", "contact_country", "contact_subscribed_phone", "contact_subscribed_email", "contact_created_at", "contact_last_interacted_at", "contact_source", "contact_tag", "contact_verified", "contact_enriched"]).describe("Filter name — read nitro://schema for full details"),
      predicate: z.enum(["eq", "not_eq", "cont", "not_cont", "start", "end", "gt", "lt", "gteq", "lteq", "present", "blank", "true", "false", "in", "not_in"]).describe("Ransack predicate"),
      value: z.unknown().describe("Filter value — string, number, boolean, or array. For present/blank predicates, pass true.")
    }).passthrough()).describe("Array of filter objects. Each filter has:\n- **name** — filter alias from flows.yml (e.g. \"contact_email\", \"contact_first_name\", \"contact_country\", \"contact_subscribed_email\", \"contact_created_at\", \"contact_tag\")\n- **predicate** — Ransack predicate — eq, not_eq, cont, not_cont, start, end, gt, lt, gteq, lteq, present, blank, true, false, in, not_in\n- **value** — filter value (string, number, boolean, or array for in/not_in). For present/blank/true/false predicates, pass true."),
    segment_id: z.number().int().describe("Existing segment ID to update (omit for new segment)").optional(),
    preview_only: z.boolean().default(true).describe("Only preview matching contacts, do not save (default: true). Set to false + provide name to persist."),
    idempotency_key: z.string().describe("Optional deduplication key").optional()
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
      opt_in: z.boolean().describe("Subscribe contact for delivery. Defaults to true for email contacts. Must be explicitly true for SMS (TCPA). Set false to import without subscribing.").optional()
    }).passthrough()).describe("Array of contact objects (max 100): {email, phone, first_name, last_name, country_code, source, opt_in}").optional(),
    import_id: z.number().int().describe("Existing Import record ID for CSV processing").optional(),
    dry_run: z.boolean().default(false).describe("Preview import without persisting (default: false)"),
    idempotency_key: z.string().describe("Optional deduplication key").optional()
  }).strict(),
  nitro_ingest_image: z.object({
    image_data: z.string().describe("Image payload as raw base64 bytes or a full data URL. PNG, JPEG, or WebP only; decoded size must be under 10MB.").optional(),
    filename: z.string().describe("Original filename for the image, such as hero.png or product-shot.jpg.").optional(),
    content_type: z.string().describe("Optional MIME type hint when image_data is raw base64 rather than a data URL.").optional()
  }).strict(),
  nitro_manage_audience: z.object({
    operation: z.enum(["create_contact", "set_subscription", "manage_list", "record_event", "delete_segment", "bulk_tag"]).describe("Which audience operation to perform. Each operation expects specific params:\n\n- **create_contact** — params: {email (string), phone (string), opt_in (boolean, recommended: true), attributes: {first_name, last_name, country_code, source}}\n- **set_subscription** — params: {contact_id (required), kind: \"email\"|\"phone\" (required), opt_in (boolean), opt_out (boolean), unsubscribe_all (boolean)}. Value auto-resolved from contact.\n- **manage_list** — params: {action: \"create\"|\"rename\"|\"delete\"|\"add_contacts\"|\"remove_contacts\" (required), list_id (integer), name (string), contact_ids (integer[]) or emails (string[])}\n- **record_event** — params: {contact_id or contact_email (one required), event (required, custom names allowed e.g. order_confirmed), data (object, max 32KB), resource_uid, resource_name, resource_url, amount}\n- **delete_segment** — params: {segment_id (required), force (boolean)}. Requires confirm: true.\n- **bulk_tag** — params: {contact_ids (integer[], required), tags (string[], required), tag_action: \"add\"|\"remove\"|\"set\" (default: \"add\")}"),
    params: z.object({}).passthrough().describe("Operation-specific parameters. See operation description for required/optional fields."),
    dry_run: z.boolean().default(false).describe("Preview changes without persisting (default: false)"),
    confirm: z.boolean().default(false).describe("Required for destructive operations: delete_segment, manage_list with action='delete'"),
    idempotency_key: z.string().describe("Optional deduplication key. Same key returns cached result.").optional()
  }).strict(),
  nitro_manage_billing: z.object({
    operation: z.enum(["status", "checkout", "checkout_status", "plans"]).describe("Billing operation to perform"),
    params: z.object({
      plan_id: z.number().int().describe("Plan ID (required for checkout)").optional()
    }).strict().describe("Operation-specific parameters.").optional()
  }).strict(),
  nitro_manage_domains: z.object({
    operation: z.enum(["add", "verify", "check_dns", "list", "remove"]).describe("Which domain operation to perform:\n\n- **add** — params: {domain_name (required, e.g. \"send.acme.com\"), author_domain (optional, e.g. \"acme.com\")}. Registers the technical sending domain with the email provider and returns DNS records. Managed SES also prepares the aligned visible From domain when the sending domain is a subdomain. Idempotent: calling add on a pending domain re-returns the DNS records.\n- **verify** — params: {domain_name (required)}. Checks with the email provider if the core DNS records have propagated. Also runs independent DNS validation and returns per-record dns_health. Optional records like tracking are reported separately and do not block completion. If verified, completes the domain_verified onboarding step and unlocks sending. If still pending, returns the DNS records again so you can re-show them to the user.\n- **check_dns** — params: {domain_name (required)}. Runs independent DNS validation plus live HTTPS readiness for branded tracking. Does not call the email provider. Useful for diagnosing missing or incorrect customer-facing records, Nitro-managed delegate targets, and tracking TLS failures before verify. Optional improvements are surfaced without blocking setup completion.\n- **list** — no params needed. Returns all account domains with their verification status and DNS records. Includes dns_health, dmarc_policy, domain_limit (from tier), and domains_used count.\n- **remove** — params: {domain_name (required)}. Deletes the domain. Requires confirm: true."),
    params: z.object({
      domain_name: z.string().describe("Technical sending domain to manage (e.g. 'send.acme.com'). Required for add, verify, remove.").optional(),
      author_domain: z.string().describe("Optional visible From domain to authorize for managed SES (e.g. 'acme.com'). Must be the organizational domain of domain_name.").optional()
    }).strict().describe("Operation-specific parameters.").optional(),
    confirm: z.boolean().default(false).describe("Required for remove operation (destructive)")
  }).strict(),
  nitro_manage_template: z.object({
    sections: z.array(z.object({}).passthrough()).describe("Array of section objects: {type, props, styles?}. Read nitro://schema for full prop specs.\n\nSection types and key props:\n\n- **header** — {logo_url, logo_alt, logo_width, background_color}\n- **text** — {content (HTML string)}\n- **image** — {src, alt, href, width}\n- **button** — {text, href, background_color, text_color, align, border_radius, padding}\n- **columns** — {columns: [{width, sections: [...]}]} — nested sections inside columns\n- **product** — {name, price, image_url, href, description}\n- **social** — {links: [{platform, url}], align}\n- **divider** — {color, width, padding}\n- **spacer** — {height}\n- **footer** — {company_name, address, unsubscribe_text}").optional(),
    section_updates: z.array(z.object({
      index: z.number().int().describe("0-based section index").optional(),
      type: z.string().describe("Existing section type to target or assert").optional(),
      occurrence: z.number().int().describe("0-based occurrence among sections of the requested type").optional(),
      props: z.object({}).passthrough().describe("Props to shallow-merge into the target section").optional(),
      styles: z.object({}).passthrough().describe("Styles to shallow-merge into the target section").optional()
    }).strict()).describe("Small update shortcut for existing sections. Each item targets by 0-based index, or by type plus optional 0-based occurrence, and shallow-merges props/styles. Does not change section order or type.").optional(),
    subject: z.string().describe("Email subject line (recommended under 60 chars)").optional(),
    name: z.string().describe("Template display name").optional(),
    composition_mode: z.enum(["intent", "draft", "validate"]).describe("intent returns composition_contract; validate checks a draft without persistence; draft validates and persists.").optional(),
    contract_id: z.string().describe("Email composition contract id returned from composition_mode=intent.").optional(),
    validate_only: z.boolean().default(false).describe("Alias for composition_mode=validate. Does not persist or consume repair attempts."),
    design_mode_override: z.enum(["premium_rich", "premium_minimal", "founder_letter", "utility_plain"]).describe("Renegotiate/validate the draft under a different design mode.").optional(),
    renegotiate: z.boolean().default(false).describe("When true with design_mode_override, keeps the same contract but changes the design mode."),
    user_instruction: z.string().describe("Latest user instruction to preserve inside the composition contract.").optional(),
    draft_meta: z.object({
      creative_route_id: z.string().describe("Chosen composition_contract.creative_routes[].id").optional(),
      concrete_anchor: z.string().describe("Specific proof, product detail, visual, code/output, quote, number, or brand moment used.").optional(),
      why_this_earns_the_inbox: z.string().describe("One sentence explaining the creative move.").optional()
    }).passthrough().describe("Host-composed draft metadata from composition_contract: creative_route_id, concrete_anchor, why_this_earns_the_inbox.").optional(),
    preheader: z.string().describe("Email preheader text shown in inbox preview").optional(),
    from_name: z.string().describe("Sender name (falls back to account default)").optional(),
    from_email: z.string().describe("Sender email (falls back to account default)").optional(),
    reply_to: z.string().describe("Reply-to email address").optional(),
    theme: z.object({}).passthrough().describe("Theme overrides merged on top of brand theme. Keys: brand_color (hex), bg_color (hex), text_color (hex), font_body (string), font_heading (string), logo_url (URL)").optional(),
    template_id: z.number().int().describe("Template ID for update mode — provide with fields to change").optional(),
    based_on: z.number().int().describe("Source template ID for clone mode — creates a copy").optional(),
    if_version: z.number().int().describe("Optimistic concurrency — rejects update if template version mismatches").optional(),
    goal: z.string().describe("Goal string for host-composed template composition contracts").optional(),
    dry_run: z.boolean().default(false).describe("Validate and preview without persisting"),
    idempotency_key: z.string().describe("Dedup key — same key returns cached result").optional()
  }).strict(),
  nitro_query: z.object({
    entity: z.enum(["flows", "campaigns", "templates", "segments", "contacts", "lists", "events", "imports", "messages", "history"]).describe("Which entity type to query. Use nitro_search_contacts for full-text contact search."),
    filters: z.object({}).passthrough().describe("Entity-specific filters. All entities support id (integer) to fetch a single record.\n\n- **flows** — status (draft/active/paused/archived), campaign_id (integer|null), trigger_event (string), search (string)\n- **campaigns** — status (draft/active/paused/completed), search (string)\n- **templates** — subject (string, ILIKE match on subject line)\n- **segments** — name (string, ILIKE match)\n- **contacts** — query (string, full-text search), subscribed_email (boolean), subscribed_phone (boolean), list_id (integer)\n- **lists** — name (string, ILIKE match)\n- **events** — name (string, exact event type), from (ISO 8601 datetime), to (ISO 8601 datetime)\n- **imports** — status (pending/processing/completed/failed)\n- **messages** — channel (email/sms), status (queued/sent/failed), to (string, recipient address)\n- **history** — source (notification/tool), event_type, tool, actor, correlation_id, resource_uri, from, to").optional(),
    page: z.number().int().describe("Page number (default 1)").optional(),
    per: z.number().int().describe("Results per page (max 50, default 25)").optional()
  }).strict(),
  nitro_request_support: z.object({
    subject: z.string().describe("Brief summary of the issue"),
    message: z.string().describe("Detailed description of the issue (max 1000 chars)")
  }).strict(),
  nitro_review_delivery: z.object({
    target_type: z.enum(["template", "flow", "campaign"]).describe("Entity type to review"),
    target_id: z.number().int().gte(1).describe("Entity ID to review"),
    contact_id: z.number().int().gte(1).describe("Optional contact ID for merge-tag personalization during review").optional()
  }).strict(),
  nitro_search_contacts: z.object({
    query: z.string().describe("Email address, name, or phone number"),
    mode: z.enum(["summary", "profile"]).describe("summary = list, profile = single contact detail (default: summary)").optional(),
    page: z.number().int().describe("Page number (default 1)").optional(),
    per: z.number().int().describe("Results per page (max 50, default 25)").optional()
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
    data: z.object({}).passthrough().describe("Merge variables e.g. { order_id: 123, name: 'Alice' }").optional(),
    idempotency_key: z.string().describe("Prevents duplicate sends on retry").optional(),
    dry_run: z.boolean().default(false).describe("Validate and preview without sending")
  }).strict(),
  nitro_send_test_message: z.object({
    target_type: z.enum(["template", "flow", "campaign"]).describe("Target entity type. Use with target_id unless latest_campaign or template_id is used.").optional(),
    target_id: z.number().int().gte(1).describe("Target entity ID. Use with target_type.").optional(),
    latest_campaign: z.boolean().default(false).describe("Use the most recently created campaign in this brand."),
    template_id: z.number().int().gte(1).describe("Template to test directly, or the specific flow/campaign template to choose.").optional(),
    action_id: z.number().int().gte(1).describe("Flow action ID to test when a flow has multiple message steps.").optional(),
    channel: z.enum(["auto", "email", "sms"]).default("auto").describe("Channel to test. Use auto unless a standalone template is ambiguous."),
    contact_id: z.number().int().gte(1).describe("Contact ID for recipient and merge-tag personalization. If present, this contact supplies the recipient address/phone.").optional(),
    to: z.array(z.string()).max(5).describe("Explicit test recipients. Use email addresses for email targets and E.164 phone numbers for SMS targets.").optional(),
    dry_run: z.boolean().default(false).describe("Validate target and recipients without sending."),
    idempotency_key: z.string().describe("Optional deduplication key for retry safety.").optional()
  }).strict(),
  nitro_set_brand_kit: z.object({
    url: z.string().describe("Website URL to scrape Brand Kit identity from").optional(),
    logo_url: z.string().describe("Direct URL to a logo image (png/jpg/webp/svg) to attach — SVGs are auto-converted to PNG").optional(),
    fields: z.object({
      company_name: z.string().optional(),
      company_description: z.string().optional(),
      brand_color: z.string().describe("Hex color e.g. #ff0000").optional(),
      text_color: z.string().describe("Hex color").optional(),
      bg_color: z.string().describe("Hex color").optional(),
      font_heading: z.string().optional(),
      font_body: z.string().optional(),
      physical_address: z.string().optional()
    }).passthrough().describe("Direct Brand Kit field updates").optional(),
    document: z.string().describe("Full brand voice markdown document").optional(),
    dry_run: z.boolean().default(false).describe("Preview changes without persisting"),
    mode: z.enum(["sync", "async"]).default("sync").describe("sync (default) or async for URL scraping"),
    idempotency_key: z.string().describe("Optional dedup key").optional()
  }).strict(),
  nitro_set_memory: z.object({
    operation: z.enum(["read", "update", "patch", "append"]).describe("read: get current document. update: replace entirely. patch: replace a ## section by heading. append: add text to end."),
    document: z.string().describe("Full markdown document (required for update).").optional(),
    heading: z.string().describe("Section heading to patch (e.g. 'Brand Goals'). Required for patch operation. Matches ## headings.").optional(),
    content: z.string().describe("New content for the section (patch) or text to append (append).").optional(),
    dry_run: z.boolean().default(false),
    idempotency_key: z.string().optional()
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
