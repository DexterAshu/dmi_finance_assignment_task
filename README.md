# DMI Finance Loan Application & Lead Management Dashboard

An Angular 20 single-page application built for the DMI Finance Take-Home Assignment. The project provides a clean, responsive, interview-ready solution showcasing modern Angular best practices, standalone components, Angular Signals for local state, and simple feature-based architecture.

---

## Project Overview

This repository contains the complete frontend solution for the DMI Finance assessment, structured into three primary modules:
1. **Loan Application Tracker (Part 1)**: Core feature featuring application list, summary strip, client-side filtering/sorting, detail side panel with credit score gauge, status update workflow, and explicit loading/empty/error states.
2. **KYB / Document Verification (Part 2)**: Multi-step document submission flow replicating the design specifications for business certificate upload and secondary document prompts.
3. **Lead Management Dashboard (Part 3)**: Executive dashboard displaying key pipeline metrics, category breakdown cards, lead table, and client-side filtering/pagination powered by local mock data.

---

## Technology Stack

* **Framework**: Angular 20 (Standalone Components, no `NgModule` bloat)
* **Language**: TypeScript 5.x
* **State Management**: Angular Signals (`signal`, `computed`)
* **API / HTTP**: Angular `HttpClient` (`provideHttpClient`)
* **Forms**: Angular Reactive Forms (`FormBuilder`, `Validators`)
* **Styling**: Modern Vanilla CSS / SCSS
* **Mock Backend**: `json-server` (REST API serving `db.json`)

---

## Project Structure

```
src/
└── app/
    ├── models/                 # Shared TypeScript interfaces & types
    ├── services/               # Core data services
    ├── shared/                 # Reusable UI components & layouts
    │   └── status-badge/
    ├── loan-applications/       # Part 1: Loan Application Tracker
    │   ├── application-detail/
    │   ├── credit-score-gauge/
    │   ├── application-filters/
    │   ├── loan-application-list/
    │   ├── summary-strip/
    │   └── loan-application-card/
    ├── kyc/                    # Part 2: KYB Document Verification Flow
    │   ├── verify-kyb/         # Main KYB container page component
    │   ├── kyc-stepper/        # 5-step visual progress bar
    │   ├── document-upload/    # Reusable file upload & validation box
    │   └── second-document-modal/ # Second document prompt dialog
    ├── dashboard/              # Part 3: Lead Management Dashboard (placeholder)
    ├── app.component.ts        # Root layout with top navigation bar
    ├── app.config.ts           # App providers configuration
    └── app.routes.ts           # Navigation route configuration (/applications, /kyc)
```

---

## Development Setup

### Prerequisites
- **Node.js**: v18.x or higher (Recommended: v20+)
- **npm**: v9.x or higher
- **Angular CLI**: v20+ (`npm install -g @angular/cli`)

---

## Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate into the project folder
cd DMI\ Finance_Assignment_task

# Install project dependencies
npm install
```

---

## Running the Application

### 1. Start the Mock REST API (Port 3000)
Launch `json-server` watching `db.json`:

```bash
npm run mock-api
```

The mock REST API endpoint is available at:
`GET http://localhost:3000/applications`

### 2. Start the Angular Development Server (Port 4200)
In a separate terminal:

```bash
npm start
```

Navigate to `http://localhost:4200/` in your browser.

- **Part 1 (Loan Applications)**: `http://localhost:4200/applications`
- **Part 2 (KYB Verification)**: `http://localhost:4200/kyc`

---

## Build

To compile the application for production:

```bash
npm run build
```

The output artifacts will be placed in the `dist/dmi-finance-assignment` directory.

---

## Assignment Overview

The assignment is divided into three parts:

* **Part 1 — Loan Application Dashboard (Core Feature)**:
  - Application list with applicant name, loan amount, loan type (Personal/Business/Home), status (Pending/Under Review/Approved/Rejected), and applied Date.
  - Client-side filtering by Status and Loan Type.
  - Client-side sorting by Loan Amount and Applied Date.
  - Top Summary Strip: Total applications, total pipeline amount, approval rate (%).
  - Application Detail View (Side Drawer): Full details, visual credit score gauge, and interactive Status Update dropdown with confirmation modal.
  - Comprehensive handling of loading, empty search results, and API error states.

* **Part 2 — KYB Document Verification**:
  - Multi-step header ("Verify Your KYB"): Basic details → Loan offers → Verify KYC → Address & e-mandate → Sign agreement.
  - Document type selection (GST Certificate, Udyam, Shop & Establishment, Business License, FSSAI, Import Export).
  - Document number input and drag-and-drop / select file upload (max 2.5MB, PDF/JPG/PNG).
  - Secondary document prompt dialog ("Do you have second business document?").

* **Part 3 — Lead Management Dashboard**:
  - Branded header bar (DMI Finance logo, Search, Welcome profile).
  - 4 status-group metric cards with sub-status counts.
  - Lead table with search/filters, creation dates, status badges, and pagination.

---

## Loan Application Tracker (Part 1 Implementation)

### 1. Application List & Service Integration
The `LoanApplicationListComponent` (`src/app/loan-applications/loan-application-list/`) retrieves loan records dynamically over HTTP from `json-server` via `LoanApplicationService.getApplications()`.

### 2. Summary Strip & Metric Formulas
The `SummaryStripComponent` (`src/app/loan-applications/summary-strip/`) computes real-time top-level metric counters based on the complete dataset:
- **Total Applications**: Count of all fetched application records (e.g. `20`).
- **Pipeline Amount**: Sum of loan amounts for active pipeline applications (`Pending` + `Under Review`). Formatted as Indian Currency (e.g., `₹2,31,00,000`).
  $$\text{Pipeline Amount} = \sum (\text{amount} \text{ where status } \in \{\text{Pending}, \text{Under Review}\})$$
- **Approval Rate (%)**: Percentage of total applications in `Approved` status, rounded to the nearest whole percentage (e.g., `35%`).
  $$\text{Approval Rate} = \left( \frac{\text{Count}(\text{Approved})}{\text{Total Applications}} \right) \times 100$$

### 3. Client-Side Filtering & Sorting (Stage 04)
All filtering and sorting occur **100% client-side** in memory using Angular `computed()` signals:
- **Status Filter**: `All`, `Pending`, `Under Review`, `Approved`, `Rejected`
- **Loan Type Filter**: `All`, `Personal`, `Business`, `Home`
- **Sort Options**: `Applied Date — Newest First` (**Default**), `Applied Date — Oldest First`, `Loan Amount — High to Low`, `Loan Amount — Low to High`

### 4. Application Detail View & Side Drawer (Stage 05)
Clicking any application card opens `ApplicationDetailComponent` (`src/app/loan-applications/application-detail/`) in a right slide-over drawer:
- **Complete Field Display**: Application ID, Applicant Name, Requested Amount, Status Badge, Loan Type, Applied Date, Assigned Officer, and Underwriter Remarks.
- **Visual Credit Score Gauge**: `CreditScoreGaugeComponent` renders a non-interactive SVG arc gauge mapping score ranges (300–900 scale) to color ratings (`Poor`, `Fair`, `Good`, `Excellent`).

### 5. Status Update & Confirmation Workflow (Stage 05)
Selecting a new status triggers a confirmation modal before applying local state changes. Derived signals (`Pipeline Amount`, `Approval Rate`, `filteredApplications`) update reactively.

---

## KYB / Document Verification Flow (Part 2 — Stage 06 Implementation)

### 1. Route & Component Architecture
The KYB verification feature is accessible via the `/kyc` route (`VerifyKybComponent` at `src/app/kyc/verify-kyb/`):
- **Visual Stepper**: `KycStepperComponent` (`src/app/kyc/kyc-stepper/`) renders a 5-step progress indicator matching the Figma screens (Basic details → Loan offers → **Verify KYC** → Address & e-mandate → Sign agreement).
- **Reusable Document Upload Box**: `DocumentUploadComponent` (`src/app/kyc/document-upload/`) encapsulates file selection, drag-and-drop, client-side validation, and uploaded file state display.
- **Second Document Prompt Modal**: `SecondDocumentModalComponent` (`src/app/kyc/second-document-modal/`) handles the prompt dialog for secondary business registration documents.

### 2. Form Controls & Validation
- **Document Type Selection**: Options include `GST Certificate`, `Udyam Registration Certificate (URC)`, `Shop & Establishment Certificate`, `Business/ Trade License`, `FSSAI`, and `Import Export Certificate`.
- **Document Number Input**: Input validation supporting document numbers (e.g. `06AAGCL3497D1Z9` or `UDYAM-YY-02-1234567`).
- **File Validation Rules**:
  - **Supported Formats**: `JPG`, `PNG`, `PDF` (`.jpg`, `.jpeg`, `.png`, `.pdf`)
  - **Maximum File Size**: `2.5 MB` (`2,621,440` bytes)
  - **Error Handling**: Displays explicit inline error alert if format or size limits are exceeded.

### 3. File States & Actions
- **Unuploaded State**: Displays dashed border box, upload icon, format instructions, and a `Select` button.
- **Uploaded State**: Displays document icon, file name (e.g. `image (2).pdf`), formatted size (e.g. `190.3 KB`), and a `Change File` button.
- **Continue Activation**: The `Continue` button remains disabled until Document Type, Document Number, and a Valid File are provided.

### 4. Second Document Flow
Clicking `Continue` on the primary document opens the bottom-sheet prompt:
- **"Upload Second Document"**: Advances to Step 2 allowing selection and upload of a secondary document (e.g. `Udyam Registration Certificate`).
- **"Skip & Proceed"**: Skips secondary upload and advances directly to the completed state.
- **Frontend-Only Scope**: Document processing and verification operate entirely in frontend component state without sending multipart uploads to a backend server.

---

## Lead Management Dashboard (Part 3 — Stage 07 Implementation)

### 1. Overview & Route Navigation
The Lead Management Dashboard is accessible at `/dashboard` (`DashboardComponent` at `src/app/dashboard/`):
- **Branded Header & Welcome Banner**: Includes DMI Finance logo, global search input, welcome title, and user profile widget (`Samantha | DMI Finance`).
- **Data-Driven Metric KPI Cards**: 4 KPI stat breakdown cards (`KpiCardComponent`) displaying stage totals derived dynamically from the loaded dataset.
- **Lead Data Table**: Displays Lead Name, Lead ID, Lead Creation Date (formatted via `DatePipe`), and Lead Status with color-coded badges (`LeadStatusBadgeComponent`).
- **Client-Side Search & Filtering**: Case-insensitive search by Lead Name or Lead ID and dropdown filtering by status without re-fetching from API.
- **Client-Side Pagination**: 10 records per page with Previous/Next controls and dynamic record range indicators (`Showing 1 to 10 of 25 entries`).

### 2. Mock Data & HttpClient Service Integration
- **Data Endpoint**: Loaded dynamically from `json-server` via `LeadService.getLeads()` fetching `http://localhost:3000/leads`.
- **Dataset Structure**: `db.json` contains 25 realistic lead records spanning all 11 required lead statuses (`Pending for Submission`, `Lead Submitted`, `Dedup Pass`, `Decision Type Initiated`, `Decision Approved`, `Offer Accepted`, `KYC Approved`, `Mandate Registered`, `Agreement Signed`, `Disbursement Initiated`, `Disbursement`).

### 3. Reactive Metric Breakdown Calculations
KPI card counters are computed dynamically using Angular `computed()` signals without hardcoded figures:
- **Card 1 (Green)**: `Pending for Submission` + `Lead Submitted` + `Dedup Pass`
- **Card 2 (Blue)**: `Decision Type Initiated` + `Decision Approved` + `Offer Accepted`
- **Card 3 (Slate)**: `KYC Approved` + `Mandate Registered`
- **Card 4 (Pink)**: `Agreement Signed` + `Disbursement Initiated` + `Disbursement`

### 4. Robust UI State Handling
- **Loading State**: Displays skeleton/spinner while HTTP request is in-flight.
- **Error State**: Renders error notification with a **Retry** button calling `LeadService` again.
- **Empty Database State**: Shows empty state when no leads are present.
- **Filtered Empty State**: Shows "No leads match your current search or status filter" with a **Clear Filters** button.

