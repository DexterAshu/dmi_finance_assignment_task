export type SubStatusStage =
  | 'Pending for Submission'
  | 'Lead Submitted'
  | 'Dedupe Pass'
  | 'Decision Trigger Initiate'
  | 'Decision Approved'
  | 'Offer Accepted'
  | 'KYC Approved'
  | 'Mandate Registered'
  | 'Agreement Signed'
  | 'Disbursement Initiated'
  | 'Disbursement';

export type TableLeadStatus = 'Pending' | 'Active' | 'Rejected' | 'Disbursed';

export interface Lead {
  id: string;
  leadName: string;
  leadId: string;
  leadCreationDate: string;
  status: TableLeadStatus;
  subStatus: SubStatusStage;
}

export interface KpiCardGroup {
  id: string;
  title: string;
  colorTheme: 'green' | 'blue' | 'slate' | 'pink';
  items: {
    label: SubStatusStage;
    count: number;
    highlighted?: boolean;
  }[];
}
