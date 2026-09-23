# DMI Finance Frontend Take-Home Assignment — Interview Implementation Guide

This guide details the technical plan, architectural decisions, design patterns, and interview talking points for the DMI Finance Loan Application & Lead Management application.

---

## Assignment Understanding

The DMI Finance Take-Home assignment requires building a multi-view financial dashboard web application comprising three core modules:

1. **Part 1 — Loan Application Dashboard (Core Feature)**:
   - A single-page tracker to monitor loan applications.
   - Requires top summary metrics (total count, total pipeline value, approval rate %).
   - Grid/List of application cards displaying Applicant Name, Amount, Type (Personal, Business, Home), Status (Pending, Under Review, Approved, Rejected), and Applied Date.
   - Client-side multi-criteria filtering (Status & Loan Type) and sorting (Amount & Date).
   - Side drawer / detail modal with complete details, credit score visual gauge, and status update confirmation flow.
   - Explicit loading, empty results, and API error states.

2. **Part 2 — KYB Document Verification**:
   - A responsive, multi-step document upload flow replicating the "Verify Your KYB" design.
   - Progress indicator (Basic details → Loan offers → Verify KYC → Address & e-mandate → Sign agreement).
   - Dynamic form with Document Type selection (GST Certificate, Udyam Registration, Shop & Establishment, Business License, FSSAI, Import Export) and Document Number input.
   - Drag-and-drop / file selector with file type validation (JPG, PNG, PDF up to 2.5MB) and preview card.
   - Prompt dialog handling optional secondary document upload.

3. **Part 3 — Lead Management Dashboard**:
   - Executive dashboard view matching the DMI Finance design.
   - Stat breakdown cards (Pending for Submission, Lead Submitted, Dedupe Pass; Decision Trigger, Approved, Accepted; KYC Approved, Mandate, Agreement; Agreement Signed, Disbursement Initiated, Disbursed).
   - Filterable, paginated lead table using local mock data.

---

## What the Assignment Requires

### Functional Requirements
- **Mock REST API**: `json-server` running `db.json` with 20 realistic loan records.
- **Data Filtering & Sorting**: Synchronous client-side filtering by status/type and sorting by date/amount.
- **Summary Metrics**: Real-time calculated summary strip values derived from the application list.
- **Detail Panel**: Non-intrusive side panel with visual credit score indicator (300-900 range) and confirmation-driven status updates.
- **KYB Upload Interface**: Form controls matching Figma screens, file state management, and modal prompts.
- **Lead Dashboard**: Stat cards with active selection states and structured data table.

### Non-Functional Requirements
- **Simplicity & Cleanliness**: No over-engineering, unnecessary libraries, or complex state management facades.
- **Performance**: High frame rate, minimal re-renders, instant response for local search/filtering using Angular Signals.
- **Maintainability**: Clear separation of concerns with standalone components and TypeScript interfaces.
- **UX Excellence**: Explicit state handling (loading skeletons, zero-result empty states, error banners).

---

## Overall Solution Approach

The application follows a **pragmatic, component-driven standalone architecture**:
- **Framework Native Capabilities**: Uses Angular 20 standalone APIs without `NgModule` boilerplate.
- **Reactivity Model**: Uses Angular Signals (`signal`, `computed`) for local state management (filtering, sorting, detail selection, upload states).
- **Service Layer**: Light HTTP services wrapping standard `HttpClient` calls for API operations and local JSON asset fetching.
- **UI & Layout**: Custom SCSS with a simple CSS custom properties (variables) system for consistent color tokens, badges, typography, and card layouts.

---

## Stage 06 — KYC/KYB Document Verification Implementation

### 1. Screen Structure & Component Layout
The KYB verification feature (`/kyc`) reproduces the Figma design screens ("Verify Your KYB"):
- **`VerifyKybComponent`**: Root page container managing step transitions, Reactive Form controls, and prompt dialog state.
- **`KycStepperComponent`**: Renders the 5-step progress bar (*Basic details* → *Loan offers* → ***Verify KYC*** → *Address & e-mandate* → *Sign agreement*).
- **`DocumentUploadComponent`**: Reusable document upload card handling file selection, drag-and-drop, format validation, size checking, and "Change File" state switching.
- **`SecondDocumentModalComponent`**: Bottom sheet / dialog prompt for the secondary business document.

### 2. Reactive Forms & Signal State
- **Form Controls**: Built with Angular `FormBuilder`:
  - `docType`: Required selection from document options (`GST Certificate`, `Udyam Registration Certificate (URC)`, `Shop & Establishment Certificate`, `Business/ Trade License`, `FSSAI`, `Import Export Certificate`).
  - `docNumber`: Required text input (`Validators.required`, `Validators.minLength(4)`).
- **File Signals**: `primaryFile = signal<FileMetadata | null>(null)` and `secondFile = signal<FileMetadata | null>(null)`.

### 3. File Validation Logic
Validation is executed in `DocumentUploadComponent`:
1. **Format Validation**: Ensures file extension / MIME type is `.jpg`, `.jpeg`, `.png`, or `.pdf`.
2. **Size Validation**: Ensures file size does not exceed `2.5 MB` (`2,621,440` bytes).
3. **Error Reporting**: Invalid files trigger an inline error banner without updating the file signal.

### 4. Continue Button Activation (`computed()` Signal)
The `Continue` button activation is derived declaratively:
```typescript
readonly isPrimaryContinueValid = computed(() => {
  return this.primaryForm.valid && !!this.primaryFile();
});
```
The button remains disabled until Document Type, Document Number, and a Valid File are present.

### 5. Second Business Document Prompt & Flow
- Clicking `Continue` on the primary document opens `SecondDocumentModalComponent`.
- **Option 1 ("Upload Second Document")**: Transitions to `activeStep = 2` rendering a second document upload form.
- **Option 2 ("Skip & Proceed")**: Advances directly to the completed state (`activeStep = 3`), displaying a summary of verified documents.

### 6. Frontend-Only Scope
Because this assessment focuses on frontend UI capabilities, file metadata (`name`, `size`, `formattedSize`, `type`) is stored in local signal state. No backend multipart upload endpoints or cloud blob storage APIs (S3/GCS) were added, keeping the implementation clean and lightweight.

---

## Stage 07 — Lead Management Dashboard Implementation

### 1. Architectural Approach
The Lead Management Dashboard (`/dashboard`) reproduces Part 3 of the assignment:
- **`LeadService`**: Simple HTTP service consuming `http://localhost:3000/leads`.
- **`DashboardComponent`**: Feature page controlling signal state for search (`searchTerm`), status filter (`selectedStatus`), pagination (`currentPage`, `pageSize`), and HTTP status (`isLoading`, `error`).
- **`KpiCardComponent`**: Reusable status breakdown card rendering dynamic metric totals and color accents (`green`, `blue`, `slate`, `pink`).
- **`LeadStatusBadgeComponent`**: Visual status badge color-coded by lead lifecycle stage.

### 2. Client-Side Processing with Signals & Computed Values
- **Data Fetching**: `LeadService.getLeads()` returns `Observable<Lead[]>`. The component subscribes and populates `leads = signal<Lead[]>([])`.
- **Filtering & Search**: `filteredLeads` computed signal filters by lead name/ID and status in memory:
  ```typescript
  readonly filteredLeads = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const status = this.selectedStatus();
    return this.leads().filter(lead => {
      const matchesSearch = !term ||
        lead.leadName.toLowerCase().includes(term) ||
        lead.leadId.toLowerCase().includes(term);
      const matchesStatus = status === 'All' || lead.status === status;
      return matchesSearch && matchesStatus;
    });
  });
  ```
- **Pagination**: `paginatedLeads` slice computed from `filteredLeads` and `currentPage`.
- **KPI Metrics**: 4 computed signals derive stage counts from `leads()` array:
  - `pendingGroupCount`: Counts leads in `Pending for Submission`, `Lead Submitted`, or `Dedup Pass`.
  - `decisionGroupCount`: Counts leads in `Decision Type Initiated`, `Decision Approved`, or `Offer Accepted`.
  - `kycGroupCount`: Counts leads in `KYC Approved` or `Mandate Registered`.
  - `disbursementGroupCount`: Counts leads in `Agreement Signed`, `Disbursement Initiated`, or `Disbursement`.

---

## Interview Explanation for Stage 07

When presenting Stage 07 in an interview:

> *"For Part 3 — Lead Management Dashboard, I implemented a standalone component (`/dashboard`) consuming lead records from `json-server` (`/leads`). To reproduce the assignment's executive layout, I created a reusable `KpiCardComponent` and computed the card metric counts reactively using Angular `computed()` signals based on the active dataset. Search (by Lead Name or Lead ID), status dropdown filtering, and pagination are handled completely on the client side in memory using Signals without re-fetching from the REST API. The interface includes explicit states for loading, HTTP error retry, and empty search results."*

---

## Possible Interview Questions & Answers (Stage 07)

### Q1: Why didn't you perform search and filtering on the backend API?
**Answer**: For datasets of modest size (e.g. 25–1,000 records), performing client-side filtering and search using Angular Signals provides instant UI feedback with zero network latency and avoids hammering the server with search input queries. For massive datasets in production (e.g., 50,000+ leads), server-side filtering with debounced API queries and server pagination would be implemented instead.

### Q2: How are the KPI numbers calculated? Are they hardcoded?
**Answer**: No KPI counts are hardcoded. The `leads` signal holds the loaded dataset, and 4 `computed()` signals filter and sum the counts per sub-status stage reactively. If records are added or updated in `db.json`, the KPI cards instantly reflect the exact live dataset counts.

### Q3: How did you implement responsive behavior for the dashboard table and KPI cards?
**Answer**: Using modern CSS Flexbox and Grid with media queries (`@media (max-width: 1024px)` and `@media (max-width: 768px)`). On desktop, KPI cards form a 4-column grid. On tablets, they stack into 2 columns. On mobile screens, cards stack vertically, header items fold into a clean column layout, and the lead table is wrapped in a horizontal scroll container (`overflow-x: auto`) to remain fully usable without clipping or breaking the page layout.
