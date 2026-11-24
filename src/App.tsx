import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  UserCog,
  Sliders,
  Building2,
  ChevronDown,
  Menu,
  X,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  TrendingUp,
  Shield,
  Check,
  ArrowUpRight,
  Calendar,
  Lock,
  Unlock,
  Layers,
  Activity,
  Settings,
  Factory,
  QrCode,
  Truck,
  Receipt,
  ArrowLeft,
  ArrowRight,
  Package,
  AlertTriangle,
  FileSpreadsheet,
  RefreshCw,
  IndianRupee,
  BadgeCheck,
  KeyRound,
  Edit3,
  ShoppingBag,
  Target,
  ShoppingCart,
  FolderKanban,
  Wrench,
  Hammer,
  ShieldCheck,
  Building,
  Wallet,
  Landmark,
  Percent,
  LayoutGrid,
  Bell,
  Sparkles,
  LogOut,
  Home,
  SlidersHorizontal,
  ChevronRight,
  Paperclip,
  MessageSquare,
  Repeat,
  UserCheck,
  Send,
  AtSign,
  Trash2,
  FileText,
  AlertCircle
} from 'lucide-react';

// --- Companies Metadata (Multi-Company ERP) ---
const COMPANIES = [
  { id: 'All', name: 'All Companies', altName: 'All Companies (Central)', short: 'ALL', color: 'indigo', sector: 'Central Group Conglomerate', location: 'Mumbai HQ' },
  { id: 'Siona Plasto', name: 'Siona Plasto', altName: 'Siona Plastics', short: 'SP', color: 'blue', sector: 'Polymer & Packaging', location: 'Vapi Plant' },
  { id: 'Sudhi Impex', name: 'Sudhi Impex', altName: 'Sudhi', short: 'SI', color: 'emerald', sector: 'Global Trade & Packaging', location: 'Nhava Sheva' },
  { id: 'Swati Enterprise', name: 'Swati Enterprise', altName: 'Swati', short: 'SE', color: 'amber', sector: 'Industrial Supplies & Jobwork', location: 'Ahmedabad' },
  { id: 'Vilaano', name: 'Vilaano', altName: 'Vilaano', short: 'VL', color: 'purple', sector: 'Consumer & Lifestyle Retail', location: 'Bandra, Mumbai' },
];

// --- Workspaces For Operating Companies (Includes Task Management) ---
const WORKSPACES_CONFIG = [
  {
    id: 'Task',
    title: 'Tasks',
    desc: 'Group-wide operations, deliverables, and team assignments.',
    icon: CheckSquare,
    gradient: 'from-indigo-500/10 via-indigo-50/40 to-white',
    border: 'border-indigo-100 hover:border-indigo-300',
    iconBg: 'bg-indigo-600 text-white',
    accentText: 'text-indigo-700',
  },
  {
    id: 'Accounts',
    title: 'Accounts',
    desc: 'Ledgers, vouchers, bank reconciliation and the books.',
    icon: Receipt,
    gradient: 'from-emerald-500/10 via-emerald-50/40 to-white',
    border: 'border-emerald-100 hover:border-emerald-300',
    iconBg: 'bg-emerald-600 text-white',
    accentText: 'text-emerald-700',
  },
  {
    id: 'Sales',
    title: 'Sales',
    desc: 'From inquiry and quotation to invoice, return and credit note.',
    icon: ShoppingBag,
    gradient: 'from-blue-500/10 via-blue-50/40 to-white',
    border: 'border-blue-100 hover:border-blue-300',
    iconBg: 'bg-blue-600 text-white',
    accentText: 'text-blue-700',
  },
  {
    id: 'CRM',
    title: 'CRM',
    desc: 'Leads, follow-ups and campaigns.',
    icon: Target,
    gradient: 'from-rose-500/10 via-rose-50/40 to-white',
    border: 'border-rose-100 hover:border-rose-300',
    iconBg: 'bg-rose-600 text-white',
    accentText: 'text-rose-700',
  },
  {
    id: 'Purchase',
    title: 'Purchase',
    desc: 'Requisitions, quotations, orders, receipts and vendor bills.',
    icon: ShoppingCart,
    gradient: 'from-purple-500/10 via-purple-50/40 to-white',
    border: 'border-purple-100 hover:border-purple-300',
    iconBg: 'bg-purple-600 text-white',
    accentText: 'text-purple-700',
  },
  {
    id: 'Projects',
    title: 'Projects',
    desc: 'Projects, their teams, tasks and timesheets, billing and...',
    icon: FolderKanban,
    gradient: 'from-indigo-500/10 via-indigo-50/40 to-white',
    border: 'border-indigo-100 hover:border-indigo-300',
    iconBg: 'bg-indigo-600 text-white',
    accentText: 'text-indigo-700',
  },
  {
    id: 'Service',
    title: 'Service',
    desc: 'After-sales service: the installed base, service tickets with SLA...',
    icon: Wrench,
    gradient: 'from-cyan-500/10 via-cyan-50/40 to-white',
    border: 'border-cyan-100 hover:border-cyan-300',
    iconBg: 'bg-cyan-600 text-white',
    accentText: 'text-cyan-700',
  },
  {
    id: 'Inventory',
    title: 'Inventory',
    desc: 'Items, stock movements, transfers and valuation.',
    icon: Package,
    gradient: 'from-amber-500/10 via-amber-50/40 to-white',
    border: 'border-amber-100 hover:border-amber-300',
    iconBg: 'bg-amber-600 text-white',
    accentText: 'text-amber-700',
  },
  {
    id: 'Production',
    title: 'Production',
    desc: 'BOMs, production orders, issues and output.',
    icon: Factory,
    gradient: 'from-teal-500/10 via-teal-50/40 to-white',
    border: 'border-teal-100 hover:border-teal-300',
    iconBg: 'bg-teal-600 text-white',
    accentText: 'text-teal-700',
  },
  {
    id: 'JobWork',
    title: 'Job Work',
    desc: 'Goods sent to job workers, and work done for customers.',
    icon: Hammer,
    gradient: 'from-orange-500/10 via-orange-50/40 to-white',
    border: 'border-orange-100 hover:border-orange-300',
    iconBg: 'bg-orange-600 text-white',
    accentText: 'text-orange-700',
  },
  {
    id: 'Quality',
    title: 'Quality',
    desc: 'Incoming, in-process and return inspections.',
    icon: ShieldCheck,
    gradient: 'from-red-500/10 via-red-50/40 to-white',
    border: 'border-red-100 hover:border-red-300',
    iconBg: 'bg-red-600 text-white',
    accentText: 'text-red-700',
  },
  {
    id: 'FixedAssets',
    title: 'Fixed Assets',
    desc: 'The asset register: what you own, where it is and what it is...',
    icon: Building,
    gradient: 'from-blue-500/10 via-blue-50/40 to-white',
    border: 'border-blue-100 hover:border-blue-300',
    iconBg: 'bg-blue-600 text-white',
    accentText: 'text-blue-700',
  },
  {
    id: 'Budgets',
    title: 'Budgets',
    desc: 'Plan income and expenses per month, then see budget again...',
    icon: Wallet,
    gradient: 'from-lime-500/10 via-lime-50/40 to-white',
    border: 'border-lime-100 hover:border-lime-300',
    iconBg: 'bg-lime-600 text-white',
    accentText: 'text-lime-700',
  },
  {
    id: 'GST',
    title: 'GST',
    desc: 'Returns, reconciliation, e-invoices and e-way bills.',
    icon: Landmark,
    gradient: 'from-teal-500/10 via-teal-50/40 to-white',
    border: 'border-teal-100 hover:border-teal-300',
    iconBg: 'bg-teal-700 text-white',
    accentText: 'text-teal-800',
  },
  {
    id: 'TDSTCS',
    title: 'TDS/TCS',
    desc: 'Income-tax deducted and collected: challans, returns...',
    icon: Percent,
    gradient: 'from-violet-500/10 via-violet-50/40 to-white',
    border: 'border-violet-100 hover:border-violet-300',
    iconBg: 'bg-violet-600 text-white',
    accentText: 'text-violet-700',
  },
  {
    id: 'Reports',
    title: 'Reports',
    desc: 'Build your own reports and share them.',
    icon: FileSpreadsheet,
    gradient: 'from-pink-500/10 via-pink-50/40 to-white',
    border: 'border-pink-100 hover:border-pink-300',
    iconBg: 'bg-pink-600 text-white',
    accentText: 'text-pink-700',
  },
];

// --- Group Staff Directory for Task Assignees & 3rd Person Approvers ---
const STAFF_MEMBERS = [
  'Deepak Sharma',
  'Rajesh Sharma',
  'Meera Nair',
  'Vikram Patel',
  'Ananya Deshmukh',
  'Suresh Iyer',
  'Karan Malhotra',
  'Priya Joshi',
  'Rohan Kapoor',
];

// Initial Realistic Multi-Company Tasks
const INITIAL_TASKS = [
  {
    id: 'TSK-1042',
    title: 'Q4 HDPE & PP Granules Bulk Procurement Audit',
    description: 'Verify raw material weighment slips against purchase orders at Vapi Plant gate. Cross-check Reliance invoice batches and obtain lab QC spectrometer certification before ledger booking.',
    company: 'Siona Plasto',
    assignees: ['Deepak Sharma', 'Suresh Iyer'],
    priority: 'High',
    status: 'In Progress',
    dueDate: '2026-11-28',
    repeat: 'Monthly',
    repeatMonthDate: '28',
    checklist: [
      { id: 'cl-1', text: 'Gate weighment gross & tare slip validation', attachmentRequired: true, attachment: 'weighment_slip_vapi_882.pdf', requiresApproval: false, approvers: [], approvedBy: [], completed: true },
      { id: 'cl-2', text: 'Melt-flow index spectrometer lab test report', attachmentRequired: true, attachment: 'mfi_qc_test_pass.pdf', requiresApproval: true, approvers: ['Rajesh Sharma', 'Meera Nair'], approvedBy: ['Rajesh Sharma'], completed: false },
      { id: 'cl-3', text: 'Reconcile stock ledger in ERP Inventory', attachmentRequired: false, attachment: '', requiresApproval: false, approvers: [], approvedBy: [], completed: false },
    ],
    approvers: ['Rajesh Sharma', 'Meera Nair'],
    approvalStatus: 'Pending Approval',
    approvedBy: ['Rajesh Sharma'],
    extensionRequest: {
      requestedDate: '2026-12-04',
      reason: 'Awaiting secondary lab spectrometer test results from Mumbai center.',
      status: 'Pending',
      requestedAt: 'Today, 14:10',
    },
    comments: [
      { id: 'cm-1', author: 'Deepak Sharma', text: 'Checked raw lot samples. Melt index is 0.75 g/10min. Reached lab for approval.', timestamp: 'Today, 11:30' },
      { id: 'cm-2', author: 'Rajesh Sharma', text: 'Primary QC approved. Waiting for Meera to sign off on bill of lading match.', timestamp: 'Today, 14:05' },
    ],
  },
  {
    id: 'TSK-1043',
    title: 'Container Customs Clearance & Bill of Lading',
    description: 'Complete ICEGATE customs electronic filing for imported cashew nut consignment lot #IMP-77 at Nhava Sheva port.',
    company: 'Sudhi Impex',
    assignees: ['Meera Nair', 'Karan Malhotra'],
    priority: 'High',
    status: 'Pending',
    dueDate: '2026-11-25',
    repeat: 'Weekly',
    repeatWeeklyDay: 'Tuesday',
    checklist: [
      { id: 'cl-1', text: 'Original Bill of Lading & Commercial Invoice submission', attachmentRequired: true, attachment: 'bol_maersk_msku4419.pdf', requiresApproval: true, approvers: ['Deepak Sharma'], approvedBy: ['Deepak Sharma'], completed: true },
      { id: 'cl-2', text: 'Customs Duty Payment Challan upload', attachmentRequired: true, attachment: '', requiresApproval: false, approvers: [], approvedBy: [], completed: false },
      { id: 'cl-3', text: 'Port Gate Out pass clearance', attachmentRequired: false, attachment: '', requiresApproval: false, approvers: [], approvedBy: [], completed: false },
    ],
    approvers: ['Deepak Sharma'],
    approvalStatus: 'Approved',
    approvedBy: ['Deepak Sharma'],
    comments: [
      { id: 'cm-1', author: 'Meera Nair', text: 'Submitted documents to CHA. Awaiting duty payment generation.', timestamp: 'Today, 10:15' },
    ],
  },
  {
    id: 'TSK-1044',
    title: 'West Zone Dealer Jobwork Challan Reconciliation',
    description: 'Reconcile outward jobwork challans with incoming finished CNC SS-304 flanges from Apex Precision Works.',
    company: 'Swati Enterprise',
    assignees: ['Vikram Patel'],
    priority: 'Medium',
    status: 'Completed',
    dueDate: '2026-11-22',
    repeat: 'Monthly',
    repeatMonthDate: '22',
    checklist: [
      { id: 'cl-1', text: 'Incoming Delivery Challan signature', attachmentRequired: true, attachment: 'apex_challan_signed.pdf', requiresApproval: false, approvers: [], approvedBy: [], completed: true },
      { id: 'cl-2', text: 'Precision dimension measurement report', attachmentRequired: false, attachment: '', requiresApproval: true, approvers: ['Deepak Sharma'], approvedBy: ['Deepak Sharma'], completed: true },
    ],
    approvers: ['Deepak Sharma'],
    approvalStatus: 'Approved',
    approvedBy: ['Deepak Sharma'],
    comments: [
      { id: 'cm-1', author: 'Vikram Patel', text: 'All 680 flanges verified and put into finished goods rack.', timestamp: 'Nov 22, 17:40' },
    ],
  },
  {
    id: 'TSK-1045',
    title: 'Winter Collection Flagship Store Merchandising',
    description: 'Coordinate dispatch of Cashmere overcoats and leather weekender bags to Bandra and Palladium boutiques with brand audit checklist.',
    company: 'Vilaano',
    assignees: ['Ananya Deshmukh', 'Rohan Kapoor'],
    priority: 'High',
    status: 'In Progress',
    dueDate: '2026-11-30',
    repeat: 'None',
    checklist: [
      { id: 'cl-1', text: 'Visual lookbook tagging and price stickers audit', attachmentRequired: true, attachment: 'store_display_mock.jpg', requiresApproval: false, approvers: [], approvedBy: [], completed: true },
      { id: 'cl-2', text: 'Store manager handover receipt upload', attachmentRequired: true, attachment: '', requiresApproval: true, approvers: ['Deepak Sharma'], approvedBy: [], completed: false },
    ],
    approvers: ['Deepak Sharma'],
    approvalStatus: 'Pending Approval',
    approvedBy: [],
    comments: [
      { id: 'cm-1', author: 'Ananya Deshmukh', text: 'Bandra store setup is done. Moving to Palladium boutique tomorrow morning.', timestamp: 'Yesterday, 16:20' },
    ],
  },
  {
    id: 'TSK-1046',
    title: 'Injection Molding Line-3 Preventive Maintenance',
    description: 'Hydraulic oil filter replacement, heater band temperature calibration, and screw barrel wear check.',
    company: 'Siona Plasto',
    assignees: ['Suresh Iyer'],
    priority: 'Low',
    status: 'Completed',
    dueDate: '2026-11-21',
    repeat: 'Weekly',
    repeatWeeklyDay: 'Saturday',
    checklist: [
      { id: 'cl-1', text: 'Maintenance checklist sign-off by Shift Engineer', attachmentRequired: true, attachment: 'maintenance_log_nov21.pdf', requiresApproval: true, approvers: ['Rajesh Sharma'], approvedBy: ['Rajesh Sharma'], completed: true },
    ],
    approvers: ['Rajesh Sharma'],
    approvalStatus: 'Approved',
    approvedBy: ['Rajesh Sharma'],
    comments: [],
  },
  {
    id: 'TSK-1047',
    title: '500g Pouch to 25kg Master Carton Repacking Batch',
    description: 'Supervise primary nitrogen packaging line and master pallet packing for European export dispatch.',
    company: 'Sudhi Impex',
    assignees: ['Karan Malhotra'],
    priority: 'Medium',
    status: 'In Progress',
    dueDate: '2026-12-02',
    repeat: 'None',
    checklist: [
      { id: 'cl-1', text: 'Nitrogen gas seal pressure testing log', attachmentRequired: true, attachment: '', requiresApproval: false, approvers: [], approvedBy: [], completed: false },
      { id: 'cl-2', text: 'Carton barcode scan verification', attachmentRequired: false, attachment: '', requiresApproval: false, approvers: [], approvedBy: [], completed: false },
    ],
    approvers: ['Meera Nair'],
    approvalStatus: 'Pending Approval',
    approvedBy: [],
    comments: [
      { id: 'cm-1', author: 'Karan Malhotra', text: 'Repacking batch #LOT-SI-511 started on auto-packer line B2.', timestamp: 'Today, 09:40' },
    ],
  },
  {
    id: 'TSK-1048',
    title: 'GST E-Way Bill Compliance Automation',
    description: 'Test IRN portal integration for automated e-way bill generation on dispatches over ₹50,000 threshold.',
    company: 'Swati Enterprise',
    assignees: ['Priya Joshi', 'Vikram Patel'],
    priority: 'High',
    status: 'Pending',
    dueDate: '2026-11-26',
    repeat: 'Monthly',
    repeatMonthDate: '26',
    checklist: [
      { id: 'cl-1', text: 'NIC Sandbox test API response log', attachmentRequired: true, attachment: '', requiresApproval: true, approvers: ['Deepak Sharma'], approvedBy: [], completed: false },
    ],
    approvers: ['Deepak Sharma'],
    approvalStatus: 'Pending Approval',
    approvedBy: [],
    comments: [],
  },
  {
    id: 'TSK-1049',
    title: 'Regional Distributor Restock & Loyalty Dispatch',
    description: 'Dispatch luxury fragrance boxes and skincare assortments to North Zone retail distributors with Delhivery priority airway bill.',
    company: 'Vilaano',
    assignees: ['Rohan Kapoor'],
    priority: 'Medium',
    status: 'Completed',
    dueDate: '2026-11-20',
    repeat: 'Weekly',
    repeatWeeklyDay: 'Wednesday',
    checklist: [
      { id: 'cl-1', text: 'Airway Bill copy and manifest sheet', attachmentRequired: true, attachment: 'delhivery_awb_6641.pdf', requiresApproval: false, approvers: [], approvedBy: [], completed: true },
    ],
    approvers: [],
    approvalStatus: 'Not Required',
    approvedBy: [],
    comments: [],
  },
  {
    id: 'TSK-1050',
    title: 'Extrusion Line 02 Melt-Flow Index QC Certification',
    description: 'Carry out 10-point test on LDPE shrink film rolls 55 micron for Parle Agro bottling order.',
    company: 'Siona Plasto',
    assignees: ['Deepak Sharma', 'Suresh Iyer'],
    priority: 'High',
    status: 'In Progress',
    dueDate: '2026-11-29',
    repeat: 'None',
    checklist: [
      { id: 'cl-1', text: 'Upload Certificate of Analysis (COA)', attachmentRequired: true, attachment: '', requiresApproval: true, approvers: ['Rajesh Sharma'], approvedBy: [], completed: false },
    ],
    approvers: ['Rajesh Sharma'],
    approvalStatus: 'Pending Approval',
    approvedBy: [],
    comments: [],
  },
  {
    id: 'TSK-1051',
    title: 'JNPT Port Container Demurrage Waiver Filing',
    description: 'File formal detention & demurrage exemption letter with Maersk shipping line for delayed berth assignment.',
    company: 'Sudhi Impex',
    assignees: ['Meera Nair'],
    priority: 'High',
    status: 'Pending',
    dueDate: '2026-11-27',
    repeat: 'None',
    checklist: [
      { id: 'cl-1', text: 'Shipping Line Waiver Application draft', attachmentRequired: true, attachment: '', requiresApproval: true, approvers: ['Deepak Sharma'], approvedBy: [], completed: false },
    ],
    approvers: ['Deepak Sharma'],
    approvalStatus: 'Pending Approval',
    approvedBy: [],
    comments: [],
  },
  {
    id: 'TSK-1052',
    title: 'SS-304 Flange Batch Inspection & Raw Mill Test',
    description: 'Conduct metallurgical spectrometer composition analysis on raw round bars from Jindal Stainless.',
    company: 'Swati Enterprise',
    assignees: ['Vikram Patel'],
    priority: 'High',
    status: 'In Progress',
    dueDate: '2026-11-28',
    repeat: 'None',
    checklist: [
      { id: 'cl-1', text: 'Mill Test Certificate (MTC) verification', attachmentRequired: true, attachment: 'jindal_mtc_ss304.pdf', requiresApproval: false, approvers: [], approvedBy: [], completed: true },
    ],
    approvers: ['Deepak Sharma'],
    approvalStatus: 'Pending Approval',
    approvedBy: [],
    comments: [],
  },
  {
    id: 'TSK-1053',
    title: 'Palladium Store Luxury Footwear & POS Restock',
    description: 'Update omnichannel ERP pos register and verify batch tags for winter leather footwear collection.',
    company: 'Vilaano',
    assignees: ['Ananya Deshmukh'],
    priority: 'Medium',
    status: 'Completed',
    dueDate: '2026-11-24',
    repeat: 'None',
    checklist: [
      { id: 'cl-1', text: 'POS inventory receipt match with GST invoice', attachmentRequired: true, attachment: 'pos_settlement_receipt.pdf', requiresApproval: false, approvers: [], approvedBy: [], completed: true },
    ],
    approvers: [],
    approvalStatus: 'Not Required',
    approvedBy: [],
    comments: [],
  },
];

const INITIAL_EMPLOYEES = [
  { id: 'EMP-201', name: 'Deepak Sharma', role: 'Plant Operations Head', department: 'Manufacturing', company: 'Siona Plasto', status: 'Present', shift: 'General (09:00 - 18:00)', email: 'deepak@sionaplasto.in' },
  { id: 'EMP-202', name: 'Meera Nair', role: 'Senior EXIM Manager', department: 'Logistics & Trade', company: 'Sudhi Impex', status: 'Present', shift: 'General (09:30 - 18:30)', email: 'meera@sudhiimpex.com' },
  { id: 'EMP-203', name: 'Vikram Patel', role: 'Regional Supply Lead', department: 'Distribution', company: 'Swati Enterprise', status: 'Present', shift: 'General (09:00 - 18:00)', email: 'vikram@swatienterprise.in' },
  { id: 'EMP-204', name: 'Ananya Deshmukh', role: 'Creative Brand Director', department: 'Design & Retail', company: 'Vilaano', status: 'Present', shift: 'Flexi (10:00 - 19:00)', email: 'ananya@vilaano.com' },
  { id: 'EMP-205', name: 'Suresh Iyer', role: 'Quality Assurance Engineer', department: 'Quality Control', company: 'Siona Plasto', status: 'On Leave', shift: 'Shift A (07:00 - 15:30)', email: 's.iyer@sionaplasto.in' },
  { id: 'EMP-206', name: 'Karan Malhotra', role: 'Freight & Customs Specialist', department: 'Compliance', company: 'Sudhi Impex', status: 'Present', shift: 'General (09:30 - 18:30)', email: 'karan@sudhiimpex.com' },
  { id: 'EMP-207', name: 'Priya Joshi', role: 'Accounts & Tax Controller', department: 'Finance', company: 'Swati Enterprise', status: 'On Leave', shift: 'General (09:30 - 18:30)', email: 'priya@swatienterprise.in' },
  { id: 'EMP-208', name: 'Rohan Kapoor', role: 'Omnichannel Retail Lead', department: 'E-Commerce', company: 'Vilaano', status: 'Present', shift: 'Flexi (10:00 - 19:00)', email: 'rohan@vilaano.com' },
];

const INITIAL_USERS = [
  { id: 'USR-01', name: 'Deepak Sharma', email: 'deepak.sharma@erphub.in', role: 'Super Admin', companies: ['Siona Plasto', 'Sudhi Impex', 'Swati Enterprise', 'Vilaano'], active: true, lastLogin: 'Today, 15:45' },
  { id: 'USR-02', name: 'Rajesh Sharma', email: 'r.sharma@sionaplasto.in', role: 'Operations Manager', companies: ['Siona Plasto'], active: true, lastLogin: 'Today, 11:45' },
  { id: 'USR-03', name: 'Meera Nair', email: 'meera@sudhiimpex.com', role: 'Operations Manager', companies: ['Sudhi Impex', 'Swati Enterprise'], active: true, lastLogin: 'Today, 13:05' },
  { id: 'USR-04', name: 'Ananya Deshmukh', email: 'ananya@vilaano.com', role: 'Sales Lead', companies: ['Vilaano'], active: true, lastLogin: 'Yesterday, 18:20' },
  { id: 'USR-05', name: 'Vikram Patel', email: 'vikram@swatienterprise.in', role: 'Production Supervisor', companies: ['Swati Enterprise'], active: true, lastLogin: 'Today, 10:15' },
  { id: 'USR-06', name: 'Priya Joshi', email: 'priya@swatienterprise.in', role: 'Accounts Executive', companies: ['Swati Enterprise', 'Siona Plasto'], active: true, lastLogin: 'Today, 09:40' },
];

const INITIAL_ROLES = [
  { id: 'ROL-01', name: 'Super Admin', description: 'Full administrative access across all subsidiaries, billing, and governance.', scope: 'All Companies (Group Wide)', level: 'L1 • Executive' },
  { id: 'ROL-02', name: 'Operations Manager', description: 'Oversees plant throughput, task allocation, and cross-unit coordination.', scope: 'Assigned Subsidiaries', level: 'L2 • Management' },
  { id: 'ROL-03', name: 'Accounts Executive', description: 'Manages GST R1/3B filings, Tally Prime ledgers, and payouts.', scope: 'Assigned Subsidiaries', level: 'L3 • Finance' },
  { id: 'ROL-04', name: 'Production Supervisor', description: 'Controls shop-floor batch logs, raw materials, and QR tags.', scope: 'Plant / Unit Level', level: 'L3 • Operations' },
  { id: 'ROL-05', name: 'Sales Lead', description: 'Handles client orders, proforma quotations, and dispatches.', scope: 'Assigned Subsidiaries', level: 'L3 • Commercial' },
];

const RIGHTS_MODULES = [
  { id: 'Accounts', label: 'Accounts' },
  { id: 'Sales', label: 'Sales' },
  { id: 'CRM', label: 'CRM' },
  { id: 'Purchase', label: 'Purchase' },
  { id: 'Inventory', label: 'Inventory' },
  { id: 'Production', label: 'Production' },
  { id: 'JobWork', label: 'Job Work' },
  { id: 'GST', label: 'GST & E-Way' },
];

const INITIAL_RIGHTS_MATRIX = {
  'Super Admin': { Accounts: true, Sales: true, CRM: true, Purchase: true, Inventory: true, Production: true, JobWork: true, GST: true },
  'Operations Manager': { Accounts: false, Sales: true, CRM: true, Purchase: true, Inventory: true, Production: true, JobWork: true, GST: false },
  'Accounts Executive': { Accounts: true, Sales: true, CRM: false, Purchase: true, Inventory: true, Production: false, JobWork: false, GST: true },
  'Production Supervisor': { Accounts: false, Sales: false, CRM: false, Purchase: false, Inventory: true, Production: true, JobWork: true, GST: false },
  'Sales Lead': { Accounts: false, Sales: true, CRM: true, Purchase: false, Inventory: true, Production: false, JobWork: false, GST: false },
};

const INITIAL_ACTIVITY = [
  { id: 1, company: 'Siona Plasto', user: 'Deepak Sharma', action: 'Approved batch #SP-884 HDPE raw material requisition (4,200 KG)', time: '10 mins ago' },
  { id: 2, company: 'Sudhi Impex', user: 'Meera Nair', action: 'Converted Lot #SI-409 from 500g pouches to 1,850 KG export pallets', time: '42 mins ago' },
  { id: 3, company: 'Vilaano', user: 'Ananya Deshmukh', action: 'Updated Q4 Winter Lookbook SKU pricing matrix & retail stock', time: '1 hour ago' },
  { id: 4, company: 'Swati Enterprise', user: 'Vikram Patel', action: 'Issued Jobwork Challan #JW-312 for CNC precision flange machining', time: '3 hours ago' },
  { id: 5, company: 'Siona Plasto', user: 'Suresh Iyer', action: 'Completed QC melt-flow index test on Extrusion Line-2', time: '4 hours ago' },
];

// --- Tailored Company Operational Data ---
const COMPANY_OPERATIONS_DATA = {
  'Siona Plasto': {
    metrics: { orders: '42 Active', output: '18,450 KG', inventoryValue: '₹68.40 L', pendingDispatches: 6 },
    production: [
      { batchId: 'BCH-SP-901', product: 'HDPE Injection Molded Crates (Blue)', machine: 'IMM-Line 01', rawMaterial: 'HDPE Granules M60075 (2,400 KG)', output: '1,180 Units', status: 'Running' },
      { batchId: 'BCH-SP-902', product: 'PP Blow-Molded Industrial Jerrycans 20L', machine: 'BM-Line 03', rawMaterial: 'PP Copolymer B120 (1,850 KG)', output: '920 Units', status: 'Completed' },
      { batchId: 'BCH-SP-903', product: 'LDPE Shrink Film Rolls 55 Micron', machine: 'EXT-Line 02', rawMaterial: 'LDPE Virgin 24FS040 (3,100 KG)', output: '3,040 KG', status: 'QC Pending' },
    ],
    inventory: [
      { sku: 'SP-RM-101', name: 'HDPE Virgin Granules (Reliance)', category: 'Raw Material', stock: '14,200 KG', minStock: '5,000 KG', qrTag: 'QR-SP-8810', status: 'Optimal' },
      { sku: 'SP-RM-104', name: 'Masterbatch Royal Blue Pigment', category: 'Additive', stock: '340 KG', minStock: '500 KG', qrTag: 'QR-SP-8814', status: 'Low Stock' },
      { sku: 'SP-FG-205', name: 'Industrial Crates 600x400x320mm', category: 'Finished Goods', stock: '3,450 Units', minStock: '1,000 Units', qrTag: 'QR-SP-8902', status: 'Optimal' },
      { sku: 'SP-FG-209', name: '20L Chemical Jerrycan UN-Certified', category: 'Finished Goods', stock: '620 Units', minStock: '800 Units', qrTag: 'QR-SP-8911', status: 'Low Stock' },
    ],
    sales: [
      { orderId: 'SO-SP-441', customer: 'Amul Dairy Packaging Div.', items: '1,500 HDPE Crates', invoiceNo: 'GST/SP/26-27/812', amount: '₹6,45,000', transporter: 'VRL Logistics (GJ-15-AT-9021)', status: 'Dispatched' },
      { orderId: 'SO-SP-442', customer: 'Asian Paints Ancillary Unit', items: '2,200 Jerrycans 20L', invoiceNo: 'GST/SP/26-27/815', amount: '₹4,92,800', transporter: 'TCI Freight (Pending Gate Pass)', status: 'Ready to Dispatch' },
      { orderId: 'SO-SP-443', customer: 'Parle Agro Bottling Plant', items: '4,500 KG Shrink Film', invoiceNo: 'Proforma #992', amount: '₹5,85,000', transporter: 'Awaiting Vehicle', status: 'Processing' },
    ],
    accounts: {
      receivables: '₹42,80,000',
      payables: '₹19,45,000',
      gstR1Status: 'Filed (Oct 2026)',
      gstR3bLiability: '₹4,12,600',
      tallySync: 'Synced 10 mins ago',
      ledgers: [
        { party: 'Reliance Petrochemicals Ltd.', type: 'Vendor Bill', ref: 'INV-RIL-9928', amount: '₹12,40,000', due: 'Nov 30, 2026', status: 'Due Soon' },
        { party: 'Amul Dairy Packaging Div.', type: 'Receivable', ref: 'GST/SP/26-27/812', amount: '₹6,45,000', due: 'Dec 12, 2026', status: 'On Track' },
        { party: 'Vapi Industrial Power Corp.', type: 'Utility Bill', ref: 'ELEC-NOV-44', amount: '₹3,18,500', due: 'Nov 27, 2026', status: 'Approved' },
      ],
    },
  },
  'Sudhi Impex': {
    metrics: { orders: '29 EXIM Lots', output: '12,600 KG Packed', inventoryValue: '₹1.14 Cr', pendingDispatches: 4 },
    production: [
      { batchId: 'LOT-SI-511', product: '500g Stand-Up Pouches -> 25KG Master Cartons', machine: 'Auto-Packer B2', rawMaterial: 'Bulk Raw Lot #IMP-77 (4,500 KG)', output: '180 Cartons (4,500 KG)', status: 'Running' },
      { batchId: 'LOT-SI-512', product: 'Vacuum-Sealed Grade-A Cashew Kernel 10KG Tins', machine: 'Nitrogen Line 01', rawMaterial: 'Raw W320 Bulk Lot (3,200 KG)', output: '320 Tins (3,200 KG)', status: 'Completed' },
    ],
    inventory: [
      { sku: 'SI-IMP-301', name: 'Imported W320 Cashew Bulk (Benin Origin)', category: 'Import Lot', stock: '18,500 KG', minStock: '6,000 KG', qrTag: 'QR-SI-3301', status: 'Optimal' },
      { sku: 'SI-PKG-308', name: '500g Barrier Foil Pouches (Printed)', category: 'Packaging', stock: '4,200 Units', minStock: '10,000 Units', qrTag: 'QR-SI-3308', status: 'Low Stock' },
    ],
    sales: [
      { orderId: 'EXP-SI-704', customer: 'EuroFoods GmbH (Rotterdam)', items: '400 Master Cartons (10,000 KG)', invoiceNo: 'EXP/SI/26-27/109', amount: '₹28,90,000', transporter: 'Maersk Line Container #MSKU4419', status: 'Dispatched' },
    ],
    accounts: {
      receivables: '₹64,10,000',
      payables: '₹31,20,000',
      gstR1Status: 'LUT Export Filed',
      gstR3bLiability: '₹1,84,200',
      tallySync: 'Synced 5 mins ago',
      ledgers: [
        { party: 'JNPT Customs & Clearing Agent', type: 'Freight Bill', ref: 'CHA-8821', amount: '₹2,45,000', due: 'Nov 26, 2026', status: 'Due Soon' },
      ],
    },
  },
  'Swati Enterprise': {
    metrics: { orders: '56 Challans', output: '3,420 Jobwork Units', inventoryValue: '₹52.90 L', pendingDispatches: 8 },
    production: [
      { batchId: 'JW-SE-601', product: 'CNC Machined SS-304 Hydraulic Flanges', machine: 'Vendor: Apex Precision Works', rawMaterial: 'SS-304 Round Bars (1,400 KG)', output: '680 Flanges', status: 'Running' },
    ],
    inventory: [
      { sku: 'SE-IND-401', name: 'SS-304 Seamless Pipes 2-Inch Schedule 40', category: 'Industrial Supply', stock: '1,840 Meters', minStock: '600 Meters', qrTag: 'QR-SE-5501', status: 'Optimal' },
    ],
    sales: [
      { orderId: 'SO-SE-912', customer: 'Larsen & Toubro EPC Site', items: '400 Galvanized Cable Trays', invoiceNo: 'GST/SE/26-27/610', amount: '₹8,75,000', transporter: 'Gati KWE (GJ-01-XX-7741)', status: 'Dispatched' },
    ],
    accounts: {
      receivables: '₹38,50,000',
      payables: '₹16,90,000',
      gstR1Status: 'Filed (Oct 2026)',
      gstR3bLiability: '₹3,28,900',
      tallySync: 'Synced 18 mins ago',
      ledgers: [
        { party: 'Apex Precision Works (Jobwork)', type: 'Jobwork Bill', ref: 'JW-BILL-118', amount: '₹2,15,000', due: 'Nov 28, 2026', status: 'Due Soon' },
      ],
    },
  },
  'Vilaano': {
    metrics: { orders: '138 Retail Orders', output: '4,850 Apparel/SKU Units', inventoryValue: '₹94.20 L', pendingDispatches: 11 },
    production: [
      { batchId: 'COL-VL-201', product: 'Winter Merino Knitwear & Structured Blazers', machine: 'Atelier Unit 01', rawMaterial: 'Italian Merino Wool & Viscose (1,200m)', output: '840 Garments', status: 'Running' },
    ],
    inventory: [
      { sku: 'VL-APP-801', name: 'Vilaano Cashmere-Blend Overcoat (Charcoal)', category: 'Winter Apparel', stock: '480 Units', minStock: '150 Units', qrTag: 'QR-VL-9101', status: 'Optimal' },
    ],
    sales: [
      { orderId: 'RET-VL-1201', customer: 'Palladium Flagship Store (Mumbai)', items: '420 Winter Collection SKUs', invoiceNo: 'GST/VL/26-27/904', amount: '₹16,80,000', transporter: 'Delhivery Express Air', status: 'Dispatched' },
    ],
    accounts: {
      receivables: '₹29,60,000',
      payables: '₹11,80,000',
      gstR1Status: 'Filed (Oct 2026)',
      gstR3bLiability: '₹5,42,100',
      tallySync: 'Synced 9 mins ago',
      ledgers: [
        { party: 'DLF Emporio Retail Settlement', type: 'Store Receivable', ref: 'GST/VL/26-27/909', amount: '₹11,45,000', due: 'Dec 05, 2026', status: 'On Track' },
      ],
    },
  },
};

const getCompanyDotColor = (companyName) => {
  switch (companyName) {
    case 'Siona Plasto': return 'bg-blue-500';
    case 'Sudhi Impex': return 'bg-emerald-500';
    case 'Swati Enterprise': return 'bg-amber-500';
    case 'Vilaano': return 'bg-purple-500';
    default: return 'bg-indigo-600';
  }
};

const getCompanyHeaderBadgeColor = (companyName) => {
  switch (companyName) {
    case 'Siona Plasto': return 'bg-blue-600 text-white';
    case 'Sudhi Impex': return 'bg-emerald-600 text-white';
    case 'Swati Enterprise': return 'bg-amber-600 text-white';
    case 'Vilaano': return 'bg-purple-600 text-white';
    default: return 'bg-indigo-600 text-white';
  }
};

const getCompanyBadgeStyle = (companyName) => {
  switch (companyName) {
    case 'Siona Plasto': return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'Sudhi Impex': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'Swati Enterprise': return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'Vilaano': return 'bg-purple-50 text-purple-700 border-purple-200';
    default: return 'bg-indigo-50 text-indigo-700 border-indigo-200';
  }
};


// =========================================================================
// MULTI-COMPANY INVENTORY DATA (Stock List, Stock In, Stock Out)
// Siona Plasto, Sudhi Impex, Swati Enterprise, Vilaano
// =========================================================================
const INITIAL_STOCK_LIST = [
  // Siona Plasto (Polymer & Industrial Packaging)
  { sku: 'SP-RM-101', name: 'HDPE Virgin Granules (Reliance M60075)', company: 'Siona Plasto', category: 'Raw Material Polymer', stock: 14200, uom: 'KG', minStock: 5000, location: 'Vapi Plant - Silo 2', unitPrice: 92, qrTag: 'QR-SP-8810', status: 'Optimal' },
  { sku: 'SP-RM-104', name: 'Masterbatch Royal Blue Pigment', company: 'Siona Plasto', category: 'Color Additive', stock: 340, uom: 'KG', minStock: 500, location: 'Vapi Plant - Chem Store', unitPrice: 240, qrTag: 'QR-SP-8814', status: 'Low Stock' },
  { sku: 'SP-FG-205', name: 'Industrial Crates 600x400x320mm', company: 'Siona Plasto', category: 'Finished Goods', stock: 3450, uom: 'Units', minStock: 1000, location: 'Vapi Plant - Bay C', unitPrice: 420, qrTag: 'QR-SP-8902', status: 'Optimal' },
  { sku: 'SP-FG-209', name: '20L Chemical Jerrycan UN-Certified', company: 'Siona Plasto', category: 'Finished Goods', stock: 620, uom: 'Units', minStock: 800, location: 'Vapi Plant - Bay A', unitPrice: 185, qrTag: 'QR-SP-8911', status: 'Low Stock' },

  // Sudhi Impex (Global Agro Trade & Cashew Packaging)
  { sku: 'SI-IMP-301', name: 'Raw Cashew Nuts in Shell (Benin Origin)', company: 'Sudhi Impex', category: 'Import Raw Consignment', stock: 18500, uom: 'KG', minStock: 6000, location: 'Nhava Sheva - Bonded Cold Store', unitPrice: 145, qrTag: 'QR-SI-3301', status: 'Optimal' },
  { sku: 'SI-FG-304', name: 'Processed Cashew Kernels Grade W-320', company: 'Sudhi Impex', category: 'Export Finished Goods', stock: 6400, uom: 'KG', minStock: 2000, location: 'APMC Vashi Cold Hub - Rack 4', unitPrice: 680, qrTag: 'QR-SI-3304', status: 'Optimal' },
  { sku: 'SI-PKG-308', name: '500g Stand-Up Nitrogen Foil Pouches', company: 'Sudhi Impex', category: 'Packaging Material', stock: 4200, uom: 'Units', minStock: 10000, location: 'Nhava Sheva - Pack Store', unitPrice: 8.5, qrTag: 'QR-SI-3308', status: 'Low Stock' },
  { sku: 'SI-FG-312', name: 'Vacuum Tins Grade W-240 Premium (10KG)', company: 'Sudhi Impex', category: 'Export Finished Goods', stock: 320, uom: 'Tins', minStock: 150, location: 'APMC Vashi Export Bay', unitPrice: 7200, qrTag: 'QR-SI-3312', status: 'Optimal' },

  // Swati Enterprise (Industrial Supplies & CNC Jobwork)
  { sku: 'SE-IND-401', name: 'SS-304 Seamless Pipes 2-Inch Sch 40', company: 'Swati Enterprise', category: 'Industrial Supplies', stock: 1840, uom: 'Meters', minStock: 600, location: 'Ahmedabad Central Yard - Bay 1', unitPrice: 620, qrTag: 'QR-SE-5501', status: 'Optimal' },
  { sku: 'SE-JW-405', name: 'Forged CNC Machined Hydraulic Flanges 4-Inch', company: 'Swati Enterprise', category: 'Jobwork Flanges', stock: 680, uom: 'Units', minStock: 300, location: 'Sanand Jobwork Depot - Rack B', unitPrice: 1450, qrTag: 'QR-SE-5505', status: 'Optimal' },
  { sku: 'SE-FST-408', name: 'High-Tensile Hex Head Bolts M16x75 Gr 8.8', company: 'Swati Enterprise', category: 'Fasteners', stock: 850, uom: 'KG', minStock: 1200, location: 'Ahmedabad Yard - Bin 14', unitPrice: 110, qrTag: 'QR-SE-5508', status: 'Low Stock' },
  { sku: 'SE-IND-412', name: 'Heavy Duty Soluble Cutting Coolant (210L)', company: 'Swati Enterprise', category: 'Shop-Floor Consumable', stock: 28, uom: 'Drums', minStock: 10, location: 'Ahmedabad Yard - Hazmat Bay', unitPrice: 14800, qrTag: 'QR-SE-5512', status: 'Optimal' },

  // Vilaano (Luxury Retail, Fashion & Lifestyle)
  { sku: 'VL-APP-801', name: 'Vilaano Cashmere-Blend Tailored Overcoat', company: 'Vilaano', category: 'Winter Apparel', stock: 480, uom: 'Units', minStock: 150, location: 'Bandra Flagship Vault - Rack A1', unitPrice: 12500, qrTag: 'QR-VL-9101', status: 'Optimal' },
  { sku: 'VL-FTW-804', name: 'Italian Calfskin Chelsea Boots (Cognac)', company: 'Vilaano', category: 'Footwear', stock: 210, uom: 'Pairs', minStock: 100, location: 'Palladium Boutique Vault', unitPrice: 8900, qrTag: 'QR-VL-9104', status: 'Optimal' },
  { sku: 'VL-LXR-808', name: 'Artisan Eau de Parfum 100ml (Oud Bergamot)', company: 'Vilaano', category: 'Fragrance & Beauty', stock: 95, uom: 'Bottles', minStock: 250, location: 'Bhiwandi E-Commerce DC - Sec 3', unitPrice: 4200, qrTag: 'QR-VL-9108', status: 'Low Stock' },
  { sku: 'VL-ACC-812', name: 'Full-Grain Leather Weekender Duffle Bag', company: 'Vilaano', category: 'Leather Goods', stock: 310, uom: 'Units', minStock: 80, location: 'Bandra Flagship Vault - Rack C2', unitPrice: 7800, qrTag: 'QR-VL-9112', status: 'Optimal' },
];

const INITIAL_STOCK_IN = [
  { id: 'INW-SP-701', date: '2026-11-23', company: 'Siona Plasto', sku: 'SP-RM-101', itemName: 'HDPE Virgin Granules (Reliance M60075)', quantity: 4200, uom: 'KG', supplier: 'Reliance Petrochemicals Ltd. (Dahej)', referenceNo: 'PO-SP-26-8812 / LR-991', location: 'Vapi Plant - Silo 2', receivedBy: 'Deepak Sharma', status: 'QC Approved' },
  { id: 'INW-SI-702', date: '2026-11-22', company: 'Sudhi Impex', sku: 'SI-IMP-301', itemName: 'Raw Cashew Nuts in Shell (Benin Origin)', quantity: 8500, uom: 'KG', supplier: 'Societe Agro-Benin Cotonou', referenceNo: 'BL-MSKU-4419 / ICEGATE-882', location: 'Nhava Sheva Cold Store', receivedBy: 'Meera Nair', status: 'Customs Cleared' },
  { id: 'INW-SE-703', date: '2026-11-24', company: 'Swati Enterprise', sku: 'SE-JW-405', itemName: 'Forged CNC Machined Hydraulic Flanges 4-Inch', quantity: 680, uom: 'Units', supplier: 'Apex Precision Works (Sanand)', referenceNo: 'JW-CHALLAN-312', location: 'Sanand Jobwork Depot', receivedBy: 'Vikram Patel', status: 'Dimension Passed' },
  { id: 'INW-VL-704', date: '2026-11-21', company: 'Vilaano', sku: 'VL-APP-801', itemName: 'Vilaano Cashmere-Blend Tailored Overcoat', quantity: 150, uom: 'Units', supplier: 'Atelier Milano Luxury Apparels', referenceNo: 'AIR-AWB-6641 / INV-810', location: 'Bandra Flagship Vault', receivedBy: 'Ananya Deshmukh', status: 'Barcode Tagged' },
  { id: 'INW-SP-705', date: '2026-11-20', company: 'Siona Plasto', sku: 'SP-RM-104', itemName: 'Masterbatch Royal Blue Pigment', quantity: 200, uom: 'KG', supplier: 'Clariant Chemicals Vapi', referenceNo: 'INV-CC-901', location: 'Vapi Plant - Chem Store', receivedBy: 'Suresh Iyer', status: 'QC Approved' },
  { id: 'INW-SI-706', date: '2026-11-19', company: 'Sudhi Impex', sku: 'SI-PKG-308', itemName: '500g Stand-Up Nitrogen Foil Pouches', quantity: 5000, uom: 'Units', supplier: 'Uflex Packaging Ltd.', referenceNo: 'PO-SI-4410', location: 'Nhava Sheva - Pack Store', receivedBy: 'Karan Malhotra', status: 'Sealed & Stored' },
];

const INITIAL_STOCK_OUT = [
  { id: 'OUT-SP-901', date: '2026-11-24', company: 'Siona Plasto', sku: 'SP-FG-205', itemName: 'Industrial Crates 600x400x320mm', quantity: 1500, uom: 'Units', destination: 'Amul Dairy Packaging Div. (Anand)', referenceNo: 'GST/SP/26-27/812 • EWB-99410', dispatchedBy: 'Deepak Sharma', status: 'Dispatched' },
  { id: 'OUT-SI-902', date: '2026-11-23', company: 'Sudhi Impex', sku: 'SI-FG-304', itemName: 'Processed Cashew Kernels Grade W-320', quantity: 4000, uom: 'KG', destination: 'EuroFoods GmbH (Rotterdam Port)', referenceNo: 'EXP/SI/26-27/109 • E-BRC-881', dispatchedBy: 'Meera Nair', status: 'Port Gate-In' },
  { id: 'OUT-SE-903', date: '2026-11-24', company: 'Swati Enterprise', sku: 'SE-IND-401', itemName: 'SS-304 Seamless Pipes 2-Inch Sch 40', quantity: 400, uom: 'Meters', destination: 'Larsen & Toubro EPC Site (Hazira)', referenceNo: 'GST/SE/26-27/610 • EWB-5519', dispatchedBy: 'Vikram Patel', status: 'In Transit' },
  { id: 'OUT-VL-904', date: '2026-11-22', company: 'Vilaano', sku: 'VL-FTW-804', itemName: 'Italian Calfskin Chelsea Boots (Cognac)', quantity: 60, uom: 'Pairs', destination: 'Palladium Mall Boutique (Lower Parel)', referenceNo: 'STR-TRF-VL-404', dispatchedBy: 'Ananya Deshmukh', status: 'Delivered' },
  { id: 'OUT-SP-905', date: '2026-11-21', company: 'Siona Plasto', sku: 'SP-FG-209', itemName: '20L Chemical Jerrycan UN-Certified', quantity: 400, uom: 'Units', destination: 'Asian Paints Ankleshwar Ancillary Unit', referenceNo: 'GST/SP/26-27/815', dispatchedBy: 'Suresh Iyer', status: 'Delivered' },
];

export default function App() {
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Operational states
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [taskCompanyFilter, setTaskCompanyFilter] = useState('All');
  const [taskStatusFilter, setTaskStatusFilter] = useState('All');
  const [taskSearch, setTaskSearch] = useState('');
  const [selectedTaskDetail, setSelectedTaskDetail] = useState(null);
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [roles, setRoles] = useState(INITIAL_ROLES);

  // User and Role Creation Modals
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    role: 'Operations Manager',
    companies: ['Siona Plasto'],
  });

  const [isAddRoleOpen, setIsAddRoleOpen] = useState(false);
  const [newRoleData, setNewRoleData] = useState({
    name: '',
    description: '',
    scope: 'Assigned Subsidiaries',
    level: 'L2 • Management',
    modules: ['Inventory', 'Production'],
  });
  const [rightsMatrix, setRightsMatrix] = useState(INITIAL_RIGHTS_MATRIX);
  const [inventorySearch, setInventorySearch] = useState('');
  const [inventoryTab, setInventoryTab] = useState('StockList'); // 'StockList' | 'StockIn' | 'StockOut'
  const [inventoryCompanyFilter, setInventoryCompanyFilter] = useState('All');
  const [stockItems, setStockItems] = useState(INITIAL_STOCK_LIST);
  const [stockInRecords, setStockInRecords] = useState(INITIAL_STOCK_IN);
  const [stockOutRecords, setStockOutRecords] = useState(INITIAL_STOCK_OUT);

  // Stock In Modal State
  const [isStockInModalOpen, setIsStockInModalOpen] = useState(false);
  const [newStockIn, setNewStockIn] = useState({
    company: 'Siona Plasto',
    sku: 'SP-RM-101',
    quantity: 1000,
    supplier: '',
    referenceNo: '',
    location: '',
    receivedBy: 'Deepak Sharma',
  });

  // Stock Out Modal State
  const [isStockOutModalOpen, setIsStockOutModalOpen] = useState(false);
  const [newStockOut, setNewStockOut] = useState({
    company: 'Siona Plasto',
    sku: 'SP-FG-205',
    quantity: 200,
    destination: '',
    referenceNo: '',
    dispatchedBy: 'Deepak Sharma',
  });

  // Task creation state with rich fields
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    company: 'Siona Plasto',
    assignees: ['Deepak Sharma'],
    priority: 'Medium',
    dueDate: '2026-12-05',
    repeat: 'None',
    repeatMonthDate: '5',
    repeatWeeklyDay: 'Monday',
    attachmentRequired: false,
    approvalRequired: false,
    approver: 'Deepak Sharma',
  });

  // State for Extension of Date request
  const [isRequestingExtension, setIsRequestingExtension] = useState(false);
  const [extensionNewDate, setExtensionNewDate] = useState('2026-12-10');
  const [extensionReason, setExtensionReason] = useState('');

  // State for Comment in Task Detail
  const [taskCommentInput, setTaskCommentInput] = useState('');

  // Notification and Active User State
  const [currentUser, setCurrentUser] = useState('Deepak Sharma');
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef(null);

  const dropdownRef = useRef(null);
  const isGlobalMode = selectedCompany === 'All';

  const currentCompanyObj = useMemo(() => {
    return COMPANIES.find((c) => c.id === selectedCompany) || COMPANIES[0];
  }, [selectedCompany]);

  // When switching company, ensure 'All' defaults to Dashboard and specific company defaults to Workspaces
  useEffect(() => {
    if (selectedCompany === 'All') {
      if (activeNav === 'Workspaces' || WORKSPACES_CONFIG.some((w) => w.id === activeNav)) {
        setActiveNav('Dashboard');
      }
      setInventoryCompanyFilter('All');
    } else {
      if (activeNav === 'Dashboard') {
        setActiveNav('Workspaces');
      }
      setInventoryCompanyFilter(selectedCompany);
    }
  }, [selectedCompany]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setCompanyDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSelectCompany = (companyId) => {
    setSelectedCompany(companyId);
    setCompanyDropdownOpen(false);
    if (companyId === 'All') {
      setActiveNav('Dashboard');
      triggerToast('Switched to Central Group Dashboard (All Companies)');
    } else {
      setActiveNav('Workspaces');
      triggerToast(`Entered ${companyId} Operational Workspace`);
    }
  };

  const activeCompanyOps = !isGlobalMode
    ? COMPANY_OPERATIONS_DATA[selectedCompany] || COMPANY_OPERATIONS_DATA['Siona Plasto']
    : null;

  // Tasks assigned to current individual user for notification bell
  const userAssignedTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (Array.isArray(t.assignees)) {
        return t.assignees.includes(currentUser);
      }
      return t.assignee === currentUser;
    });
  }, [tasks, currentUser]);

  const filteredTasksList = useMemo(() => {
    return tasks.filter((t) => {
      const matchesCompany = taskCompanyFilter === 'All' || t.company === taskCompanyFilter;
      const matchesStatus = taskStatusFilter === 'All' || t.status === taskStatusFilter;
      const searchLower = taskSearch.toLowerCase();
      const matchesSearch =
        taskSearch === '' ||
        (t.title && t.title.toLowerCase().includes(searchLower)) ||
        (t.description && t.description.toLowerCase().includes(searchLower)) ||
        (t.id && t.id.toLowerCase().includes(searchLower)) ||
        (t.assignee && t.assignee.toLowerCase().includes(searchLower)) ||
        (Array.isArray(t.assignees) && t.assignees.some((a) => a.toLowerCase().includes(searchLower))) ||
        (t.company && t.company.toLowerCase().includes(searchLower));
      return matchesCompany && matchesStatus && matchesSearch;
    });
  }, [tasks, taskCompanyFilter, taskStatusFilter, taskSearch]);

  // --- Task Action Handlers ---
  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    const createdTask = {
      id: `TSK-${1050 + tasks.length}`,
      title: newTask.title,
      description: newTask.description || 'Operational task created for ' + newTask.company,
      company: newTask.company,
      assignees: newTask.assignees.length > 0 ? newTask.assignees : ['Deepak Sharma'],
      priority: newTask.priority,
      status: 'Pending',
      dueDate: newTask.dueDate,
      repeat: newTask.repeat,
      repeatMonthDate: newTask.repeat === 'Monthly' ? newTask.repeatMonthDate : undefined,
      repeatWeeklyDay: newTask.repeat === 'Weekly' ? newTask.repeatWeeklyDay : undefined,
      attachmentRequired: newTask.attachmentRequired,
      attachment: null,
      checklist: newTask.attachmentRequired
        ? [
            {
              id: 'cl-1',
              text: 'Upload required document attachment / delivery proof',
              attachmentRequired: true,
              attachment: null,
              requiresApproval: newTask.approvalRequired,
              approvers: newTask.approvalRequired && newTask.approver ? [newTask.approver] : [],
              completed: false,
            },
          ]
        : [
            {
              id: 'cl-1',
              text: 'Complete operational deliverable',
              attachmentRequired: false,
              attachment: null,
              requiresApproval: newTask.approvalRequired,
              approvers: newTask.approvalRequired && newTask.approver ? [newTask.approver] : [],
              completed: false,
            },
          ],
      approvers: newTask.approvalRequired && newTask.approver ? [newTask.approver] : [],
      approvalStatus: newTask.approvalRequired && newTask.approver ? 'Pending Approval' : 'Not Required',
      approvedBy: [],
      comments: [
        {
          id: 'cm-init',
          author: 'System',
          text: `Task created and assigned to ${newTask.assignees.join(', ')}.`,
          timestamp: 'Just now',
        },
      ],
    };

    setTasks([createdTask, ...tasks]);
    setIsAddTaskOpen(false);
    setNewTask({
      title: '',
      description: '',
      company: selectedCompany !== 'All' ? selectedCompany : 'Siona Plasto',
      assignees: ['Deepak Sharma'],
      priority: 'Medium',
      dueDate: '2026-12-05',
      repeat: 'None',
      repeatMonthDate: '5',
      repeatWeeklyDay: 'Monday',
      attachmentRequired: false,
      approvalRequired: false,
      approver: 'Deepak Sharma',
    });
    triggerToast(`Task created for ${createdTask.company}`);
  };

  const handleToggleChecklist = (taskId, checklistId) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const updatedChecklist = t.checklist.map((item) => {
          if (item.id !== checklistId) return item;
          // If attachment is required but not attached, enforce requirement!
          if (item.attachmentRequired && !item.attachment && !item.completed) {
            triggerToast('Attachment is required before marking this checklist item done!');
            return item;
          }
          return { ...item, completed: !item.completed };
        });
        const allCompleted = updatedChecklist.length > 0 && updatedChecklist.every((c) => c.completed);
        const updatedTask = {
          ...t,
          checklist: updatedChecklist,
          status: allCompleted ? 'Completed' : t.status === 'Completed' ? 'In Progress' : t.status,
        };
        if (selectedTaskDetail && selectedTaskDetail.id === taskId) {
          setSelectedTaskDetail(updatedTask);
        }
        return updatedTask;
      })
    );
  };

  const handleAttachFileToChecklist = (taskId, checklistId, filename) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const updatedChecklist = t.checklist.map((item) => {
          if (item.id !== checklistId) return item;
          return { ...item, attachment: filename };
        });
        const updatedTask = { ...t, checklist: updatedChecklist };
        if (selectedTaskDetail && selectedTaskDetail.id === taskId) {
          setSelectedTaskDetail(updatedTask);
        }
        return updatedTask;
      })
    );
    triggerToast(`Attached ${filename} to checklist item`);
  };

  const handleRequestExtension = (taskId) => {
    if (!extensionNewDate || !extensionReason.trim()) {
      triggerToast('Please provide a new date and a valid reason for extension');
      return;
    }
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const updatedTask = {
          ...t,
          extensionRequest: {
            requestedDate: extensionNewDate,
            reason: extensionReason,
            status: 'Pending',
            requestedAt: 'Just now',
          },
        };
        if (selectedTaskDetail && selectedTaskDetail.id === taskId) {
          setSelectedTaskDetail(updatedTask);
        }
        return updatedTask;
      })
    );
    setIsRequestingExtension(false);
    setExtensionReason('');
    triggerToast('Extension request submitted for review');
  };

  const handleApproveExtension = (taskId) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const newDueDate = t.extensionRequest ? t.extensionRequest.requestedDate : t.dueDate;
        const updatedTask = {
          ...t,
          dueDate: newDueDate,
          extensionRequest: {
            ...t.extensionRequest,
            status: 'Approved',
          },
        };
        if (selectedTaskDetail && selectedTaskDetail.id === taskId) {
          setSelectedTaskDetail(updatedTask);
        }
        return updatedTask;
      })
    );
    triggerToast('Date extension approved and due date updated');
  };

  const handleRejectExtension = (taskId) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const updatedTask = {
          ...t,
          extensionRequest: {
            ...t.extensionRequest,
            status: 'Rejected',
          },
        };
        if (selectedTaskDetail && selectedTaskDetail.id === taskId) {
          setSelectedTaskDetail(updatedTask);
        }
        return updatedTask;
      })
    );
    triggerToast('Date extension request rejected');
  };

  const handleSignApproval = (taskId, approverName) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const currentApprovedBy = t.approvedBy || [];
        const isAlreadyApproved = currentApprovedBy.includes(approverName);
        const updatedApprovedBy = isAlreadyApproved
          ? currentApprovedBy.filter((a) => a !== approverName)
          : [...currentApprovedBy, approverName];
        const allApproversSigned = t.approvers && t.approvers.length > 0 && t.approvers.every((app) => updatedApprovedBy.includes(app));
        const updatedTask = {
          ...t,
          approvedBy: updatedApprovedBy,
          approvalStatus: allApproversSigned ? 'Approved' : updatedApprovedBy.length > 0 ? 'Partially Approved' : 'Pending Approval',
        };
        if (selectedTaskDetail && selectedTaskDetail.id === taskId) {
          setSelectedTaskDetail(updatedTask);
        }
        return updatedTask;
      })
    );
    triggerToast(`Signed approval for ${approverName}`);
  };

  const handleAddTaskComment = (taskId) => {
    if (!taskCommentInput.trim()) return;
    const newComment = {
      id: `cm-${Date.now()}`,
      author: 'Deepak Sharma',
      text: taskCommentInput.trim(),
      timestamp: 'Just now',
    };
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const updatedComments = [...(t.comments || []), newComment];
        const updatedTask = { ...t, comments: updatedComments };
        if (selectedTaskDetail && selectedTaskDetail.id === taskId) {
          setSelectedTaskDetail(updatedTask);
        }
        return updatedTask;
      })
    );
    setTaskCommentInput('');
    triggerToast('Comment posted');
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUserData.name.trim() || !newUserData.email.trim()) return;
    const createdUser = {
      id: `USR-0${users.length + 1}`,
      name: newUserData.name.trim(),
      email: newUserData.email.trim(),
      role: newUserData.role,
      companies: newUserData.companies.length > 0 ? newUserData.companies : ['Siona Plasto'],
      active: true,
      lastLogin: 'Just now',
    };
    setUsers([createdUser, ...users]);
    setIsAddUserOpen(false);
    setNewUserData({
      name: '',
      email: '',
      role: 'Operations Manager',
      companies: ['Siona Plasto'],
    });
    triggerToast(`Added user ${createdUser.name}`);
  };

  const handleCreateRole = (e) => {
    e.preventDefault();
    if (!newRoleData.name.trim()) return;
    const createdRole = {
      id: `ROL-0${roles.length + 1}`,
      name: newRoleData.name.trim(),
      description: newRoleData.description || 'Custom defined administrative role',
      scope: newRoleData.scope,
      level: newRoleData.level,
    };
    setRoles([...roles, createdRole]);

    // Update rightsMatrix for the new role
    const newRights = {};
    RIGHTS_MODULES.forEach((m) => {
      newRights[m.id] = newRoleData.modules.includes(m.id);
    });
    setRightsMatrix((prev) => ({
      ...prev,
      [createdRole.name]: newRights,
    }));

    setIsAddRoleOpen(false);
    setNewRoleData({
      name: '',
      description: '',
      scope: 'Assigned Subsidiaries',
      level: 'L2 • Management',
      modules: ['Inventory', 'Production'],
    });
    triggerToast(`Created role ${createdRole.name}`);
  };

  // --- Inventory Handlers for Stock In & Stock Out ---
  const handleRecordStockIn = (e) => {
    e.preventDefault();
    const qty = Number(newStockIn.quantity);
    if (!qty || qty <= 0) {
      triggerToast('Please enter a valid positive quantity');
      return;
    }
    const matchedItem = stockItems.find((item) => item.sku === newStockIn.sku);
    const itemName = matchedItem ? matchedItem.name : 'Stock Item';
    const uom = matchedItem ? matchedItem.uom : 'Units';

    const inwardRecord = {
      id: `INW-${Date.now().toString().slice(-5)}`,
      date: new Date().toISOString().split('T')[0],
      company: newStockIn.company,
      sku: newStockIn.sku,
      itemName: itemName,
      quantity: qty,
      uom: uom,
      supplier: newStockIn.supplier || 'Standard Vendor Receipt',
      referenceNo: newStockIn.referenceNo || `GRN-${Date.now().toString().slice(-4)}`,
      location: newStockIn.location || (matchedItem ? matchedItem.location : 'Main Warehouse'),
      receivedBy: newStockIn.receivedBy,
      status: 'QC Approved & Stored',
    };

    // Update stockInRecords
    setStockInRecords([inwardRecord, ...stockInRecords]);

    // Increment quantity in stockItems
    setStockItems((prev) =>
      prev.map((item) => {
        if (item.sku === newStockIn.sku) {
          const newStockQty = item.stock + qty;
          return {
            ...item,
            stock: newStockQty,
            status: newStockQty <= item.minStock ? 'Low Stock' : 'Optimal',
          };
        }
        return item;
      })
    );

    setIsStockInModalOpen(false);
    triggerToast(`Stock In: +${qty} ${uom} added to ${itemName}`);
  };

  const handleRecordStockOut = (e) => {
    e.preventDefault();
    const qty = Number(newStockOut.quantity);
    if (!qty || qty <= 0) {
      triggerToast('Please enter a valid positive quantity');
      return;
    }
    const matchedItem = stockItems.find((item) => item.sku === newStockOut.sku);
    if (!matchedItem) {
      triggerToast('Selected item not found');
      return;
    }
    if (matchedItem.stock < qty) {
      triggerToast(`Cannot dispatch ${qty} ${matchedItem.uom}. Only ${matchedItem.stock} ${matchedItem.uom} available in stock!`);
      return;
    }

    const outwardRecord = {
      id: `OUT-${Date.now().toString().slice(-5)}`,
      date: new Date().toISOString().split('T')[0],
      company: newStockOut.company,
      sku: newStockOut.sku,
      itemName: matchedItem.name,
      quantity: qty,
      uom: matchedItem.uom,
      destination: newStockOut.destination || 'Customer Dispatch Delivery',
      referenceNo: newStockOut.referenceNo || `DC-${Date.now().toString().slice(-4)}`,
      dispatchedBy: newStockOut.dispatchedBy,
      status: 'Dispatched',
    };

    // Update stockOutRecords
    setStockOutRecords([outwardRecord, ...stockOutRecords]);

    // Decrement quantity in stockItems
    setStockItems((prev) =>
      prev.map((item) => {
        if (item.sku === newStockOut.sku) {
          const newStockQty = item.stock - qty;
          return {
            ...item,
            stock: newStockQty,
            status: newStockQty <= item.minStock ? 'Low Stock' : 'Optimal',
          };
        }
        return item;
      })
    );

    setIsStockOutModalOpen(false);
    triggerToast(`Stock Out: -${qty} ${matchedItem.uom} dispatched from ${matchedItem.name}`);
  };

  const handleToggleRight = (roleName, modId) => {
    setRightsMatrix((prev) => ({
      ...prev,
      [roleName]: {
        ...prev[roleName],
        [modId]: !prev[roleName]?.[modId],
      },
    }));
    triggerToast(`Updated permission for ${roleName} on ${modId}`);
  };

  // Helper to render text with highlighted @Company mentions
  const renderWithMentions = (text) => {
    if (!text) return null;
    const parts = text.split(/(@(?:Siona Plasto|Sudhi Impex|Swati Enterprise|Vilaano))/g);
    return parts.map((part, i) => {
      if (part.startsWith('@')) {
        const compName = part.substring(1);
        return (
          <span
            key={i}
            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200 text-xs mx-0.5 shadow-2xs"
          >
            <AtSign className="w-3 h-3 text-indigo-500" />
            {compName}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-800 flex flex-col lg:flex-row font-sans antialiased">
      {/* Toast Banner */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg border border-slate-700 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* ================= LEFT SIDEBAR ================= */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-white text-slate-700 flex flex-col justify-between transition-transform duration-200 ease-out border-r border-slate-200/80 shrink-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Top Logo / Selected Company Brand Row (NEVER ZipERP 360) */}
          <div className="h-14 px-4 flex items-center justify-between border-b border-slate-100">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shadow-2xs shrink-0 ${getCompanyHeaderBadgeColor(
                  selectedCompany
                )}`}
              >
                {currentCompanyObj.short}
              </div>
              <div className="min-w-0">
                <span className="text-sm font-bold tracking-tight text-slate-900 block truncate leading-tight">
                  {currentCompanyObj.name}
                </span>
                <span className="text-[10px] font-semibold text-slate-400 block leading-none mt-0.5">
                  {isGlobalMode ? 'Group HQ • FY 2026-27' : 'FY 2026-27'}
                </span>
              </div>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-1 rounded-lg text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Company Switcher Card */}
          <div className="p-3">
            <div className="relative">
              <button
                type="button"
                onClick={() => setCompanyDropdownOpen((o) => !o)}
                className="w-full text-left p-2 rounded-xl border border-slate-200/90 hover:border-slate-300 bg-slate-50/70 hover:bg-slate-100/70 transition-all flex items-center justify-between group shadow-2xs cursor-pointer"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
                    <Building2 className="w-3.5 h-3.5 text-slate-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate leading-tight">
                      {currentCompanyObj.name}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate leading-none mt-0.5">
                      {currentCompanyObj.sector}
                    </p>
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 shrink-0" />
              </button>

              {/* Dropdown Menu */}
              {companyDropdownOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute left-0 mt-1.5 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-1"
                >
                  <div className="px-3 py-1.5 border-b border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Switch Company Workspace
                    </span>
                  </div>
                  {COMPANIES.map((comp) => (
                    <button
                      key={comp.id}
                      type="button"
                      onClick={() => handleSelectCompany(comp.id)}
                      className={`w-full px-3 py-2 text-left flex items-center justify-between transition-colors cursor-pointer ${
                        selectedCompany === comp.id
                          ? 'bg-indigo-50/90 text-indigo-700 font-semibold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={`w-2 h-2 rounded-full ${getCompanyDotColor(comp.id)}`} />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold truncate leading-tight">
                            {comp.name}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate leading-none mt-0.5">
                            {comp.sector}
                          </p>
                        </div>
                      </div>
                      {selectedCompany === comp.id && (
                        <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ================= CONDITIONAL NAVIGATION MENU ================= */}
          {isGlobalMode ? (
            /* In "All Companies": ONLY Central Governance & Dashboard! NO workspaces list! */
            <nav className="flex-1 px-3 py-1 space-y-1 overflow-y-auto" aria-label="Central Group Navigation">
              <div className="px-2 pt-1 pb-1 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                  Central Group Admin
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 font-semibold">
                  HQ
                </span>
              </div>

              {[
                { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard, desc: 'Group executive overview' },
                { id: 'Task', label: 'Tasks', icon: CheckSquare, desc: 'Group-wide deliverables' },
                { id: 'HRMS', label: 'HRMS & Biometrics', icon: Users, desc: 'Central workforce directory' },
                { id: 'User', label: 'User Management', icon: UserCog, desc: 'Accounts & subsidiary scopes' },
                { id: 'Role', label: 'Role Scopes', icon: BadgeCheck, desc: 'Role definitions & levels' },
                { id: 'Rights', label: 'Rights Matrix', icon: KeyRound, desc: 'RBAC module permissions' },
                { id: 'Control', label: 'System Control', icon: Sliders, desc: 'Governance & group policies' },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeNav === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveNav(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-2xs'
                        : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                      <div className="text-left min-w-0">
                        <span className="block truncate leading-tight">{item.label}</span>
                        <span className={`text-[10px] block truncate leading-none mt-0.5 ${isActive ? 'text-indigo-200' : 'text-slate-400'}`}>
                          {item.desc}
                        </span>
                      </div>
                    </div>
                    {item.id === 'Task' && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${isActive ? 'bg-indigo-500 text-white' : 'bg-slate-200 text-slate-700'}`}>
                        {tasks.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          ) : (
            /* In Specific Company (Siona Plasto, Sudhi, Swati, Vilaano): Workspaces Pill + 15 Workspaces */
            <div className="flex-1 flex flex-col min-h-0">
              <div className="px-3 pb-2 space-y-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setActiveNav('Workspaces');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeNav === 'Workspaces'
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'bg-slate-100/90 text-slate-700 hover:bg-slate-200/80'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>Workspaces</span>
                  </div>
                  <span className="text-[10px] opacity-60 font-mono">Alt+W</span>
                </button>
              </div>

              <nav className="flex-1 px-3 py-1 space-y-0.5 overflow-y-auto" aria-label="Workspaces Navigation">
                <p className="px-2 pt-1 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {currentCompanyObj.name} Workspaces
                </p>

                {WORKSPACES_CONFIG.map((ws) => {
                  const Icon = ws.icon;
                  const isActive = activeNav === ws.id;
                  return (
                    <button
                      key={ws.id}
                      type="button"
                      onClick={() => {
                        setActiveNav(ws.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-800 font-semibold border-l-2 border-emerald-600'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-emerald-700' : 'text-slate-400'}`} />
                        <span className="truncate">{ws.title}</span>
                      </div>
                      {ws.id === 'Task' && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-slate-100 text-slate-700">
                          {tasks.length}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          )}

          {/* Sidebar Footer */}
          <div className="p-3 border-t border-slate-100">
            <div className="flex items-center justify-between p-1.5 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  D
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">Deepak</p>
                  <p className="text-[10px] text-slate-400 truncate">
                    {isGlobalMode ? 'Group Super Admin' : currentCompanyObj.name}
                  </p>
                </div>
              </div>
              <LogOut className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 cursor-pointer" />
            </div>
          </div>
        </div>
      </aside>

      {/* ================= MAIN CONTENT AREA ================= */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOP HEADER BAR */}
        <header className="sticky top-0 z-20 h-14 bg-white/95 backdrop-blur-xs border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 max-w-xl">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="flex-1 relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search items, accounts, documents, pages..."
                className="w-full bg-slate-50 hover:bg-slate-100/60 focus:bg-white text-xs pl-8 pr-12 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all text-slate-800"
              />
              <kbd className="hidden sm:inline-flex items-center text-[10px] text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 px-1 py-0.2 bg-white border border-slate-200 rounded font-mono">
                Ctrl K
              </kbd>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100/90 text-xs font-semibold text-slate-700 border border-slate-200">
              <span className={`w-1.5 h-1.5 rounded-full ${getCompanyDotColor(selectedCompany)}`} />
              <span>{currentCompanyObj.name}</span>
            </div>

            <button
              type="button"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 hover:border-slate-300 bg-white text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-all cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span className="hidden sm:inline text-xs">AI Assistant</span>
            </button>

            <div className="relative" ref={notificationRef}>
              <button
                type="button"
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors relative cursor-pointer"
                title="Task Notifications"
              >
                <Bell className="w-4 h-4" />
                {userAssignedTasks.length > 0 ? (
                  <span className="min-w-4 h-4 px-1 bg-rose-500 text-white text-[9px] font-bold rounded-full absolute -top-1 -right-1 flex items-center justify-center ring-2 ring-white animate-pulse">
                    {userAssignedTasks.length}
                  </span>
                ) : (
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full absolute top-1 right-1 ring-2 ring-white" />
                )}
              </button>

              {/* Notification Popover Dropdown */}
              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="p-3.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-indigo-600" />
                      <h4 className="text-xs font-bold text-slate-900">Task Notifications</h4>
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700">
                        {userAssignedTasks.length} Assigned
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-400">User:</span>
                      <select
                        value={currentUser}
                        onChange={(e) => setCurrentUser(e.target.value)}
                        className="text-[10px] font-bold text-slate-700 bg-white border border-slate-200 rounded px-1.5 py-0.5 cursor-pointer focus:outline-none"
                      >
                        {STAFF_MEMBERS.map((u) => (
                          <option key={u} value={u}>
                            {u}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {userAssignedTasks.length === 0 ? (
                      <div className="p-6 text-center space-y-1">
                        <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto" />
                        <p className="text-xs font-semibold text-slate-700">All caught up!</p>
                        <p className="text-[11px] text-slate-400">No active tasks currently assigned to {currentUser}.</p>
                      </div>
                    ) : (
                      userAssignedTasks.map((t) => (
                        <div
                          key={t.id}
                          onClick={() => {
                            setSelectedTaskDetail(t);
                            setActiveNav('Task');
                            setIsNotificationOpen(false);
                            triggerToast(`Opened ${t.id} from notification`);
                          }}
                          className="p-3 hover:bg-slate-50/80 transition-colors cursor-pointer space-y-1"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-mono text-[10px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded">
                              {t.id}
                            </span>
                            <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold border ${getCompanyBadgeStyle(t.company)}`}>
                              {t.company}
                            </span>
                          </div>
                          <div className="text-xs font-bold text-slate-900 line-clamp-1 hover:text-indigo-600 transition-colors">
                            {t.title}
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
                            <span className="flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5 text-slate-400" />
                              Due: {t.dueDate}
                            </span>
                            <span className={`font-bold ${
                              t.priority === 'High' ? 'text-rose-600' : t.priority === 'Medium' ? 'text-amber-600' : 'text-slate-500'
                            }`}>
                              {t.priority}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-2 bg-slate-50/50 border-t border-slate-100 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveNav('Task');
                        setIsNotificationOpen(false);
                      }}
                      className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                    >
                      View All Group Tasks →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* MAIN BODY CONTAINER */}
        <main className="flex-1 p-4 sm:p-6 lg:p-7 max-w-7xl w-full mx-auto space-y-6">
          {/* =========================================================================
              VIEW 0: CENTRAL GROUP DASHBOARD (When "All" is selected)
             ========================================================================= */}
          {activeNav === 'Dashboard' && isGlobalMode && (
            <div className="space-y-6 animate-fade-in">
              {/* Header Greeting Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                    Group Executive Dashboard
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Consolidated overview • Siona Plasto, Sudhi Impex, Swati Enterprise, Vilaano (FY 2026–27)
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => triggerToast('Group health check: All 4 entities synced and operational')}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-2xs transition-all cursor-pointer"
                  >
                    Run Group Diagnostics
                  </button>
                </div>
              </div>

              {/* 4 Group KPI Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Group Tasks
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <CheckSquare className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 mt-2">
                    {tasks.length}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {tasks.filter((t) => t.status === 'Completed').length} Completed • {tasks.filter((t) => t.status === 'Pending').length} Pending signoff
                  </p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Active Workforce
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 mt-2">
                    {employees.filter((e) => e.status === 'Present').length} / {employees.length}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Biometric live attendance synced
                  </p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Group Stock Valuation
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                      <Package className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 mt-2">
                    ₹3.29 Cr
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Consolidated 4-subsidiary inventory
                  </p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Conglomerate Turnaround
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 mt-2">
                    94.2%
                  </p>
                  <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                    +3.4% MoM delivery efficiency
                  </p>
                </div>
              </div>

              {/* Operating Subsidiaries Performance Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Operating Subsidiaries Overview
                  </h2>
                  <span className="text-xs text-slate-500">
                    Click any company to open its dedicated ERP
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {COMPANIES.filter((c) => c.id !== 'All').map((comp) => {
                    const ops = COMPANY_OPERATIONS_DATA[comp.id] || COMPANY_OPERATIONS_DATA['Siona Plasto'];
                    return (
                      <div
                        key={comp.id}
                        className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <span className={`w-2.5 h-2.5 rounded-full ${getCompanyDotColor(comp.id)}`} />
                              <h3 className="text-base font-bold text-slate-900">{comp.name}</h3>
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                              {comp.short}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            {comp.sector} • <span className="text-slate-700 font-medium">{comp.location}</span>
                          </p>

                          <div className="grid grid-cols-3 gap-2 my-4 pt-3 border-t border-slate-100 text-center">
                            <div className="p-2 rounded-xl bg-slate-50">
                              <span className="text-[10px] text-slate-400 block font-semibold">Orders / Lots</span>
                              <span className="text-xs font-bold text-slate-800 block mt-0.5">{ops.metrics.orders}</span>
                            </div>
                            <div className="p-2 rounded-xl bg-slate-50">
                              <span className="text-[10px] text-slate-400 block font-semibold">Throughput</span>
                              <span className="text-xs font-bold text-slate-800 block mt-0.5">{ops.metrics.output}</span>
                            </div>
                            <div className="p-2 rounded-xl bg-slate-50">
                              <span className="text-[10px] text-slate-400 block font-semibold">Stock Valuation</span>
                              <span className="text-xs font-bold text-emerald-700 block mt-0.5">{ops.metrics.inventoryValue}</span>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleSelectCompany(comp.id)}
                          className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <span>Open {comp.name} ERP</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Group Recent Activity Stream */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Consolidated Operational Audit Stream
                    </h3>
                    <p className="text-xs text-slate-500">
                      Real-time activities across manufacturing plants, customs & sales hubs
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                    Live Webhook Synced
                  </span>
                </div>

                <div className="divide-y divide-slate-100">
                  {INITIAL_ACTIVITY.map((act) => (
                    <div key={act.id} className="py-2.5 first:pt-1 last:pb-1 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${getCompanyDotColor(act.company)}`} />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-800 truncate">{act.action}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            <span className="font-semibold text-slate-600">{act.company}</span> • Logged by {act.user}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 shrink-0">{act.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW 1: WORKSPACES OVERVIEW (Only for Individual Companies)
             ========================================================================= */}
          {activeNav === 'Workspaces' && !isGlobalMode && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-3">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                    Good morning, Deepak
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Tuesday, 24 November 2026 • <span className="font-semibold text-slate-800">{currentCompanyObj.name}</span>
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50/90 border border-emerald-200 text-emerald-800 text-xs font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Nothing waits for you: no approvals, nothing sent back, no drafts.</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Workspaces
                  </h2>
                  <span className="text-xs font-medium text-slate-500">
                    {WORKSPACES_CONFIG.length} Operational Modules • {currentCompanyObj.name}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5">
                  {WORKSPACES_CONFIG.map((ws) => {
                    const Icon = ws.icon;
                    return (
                      <div
                        key={ws.id}
                        onClick={() => setActiveNav(ws.id)}
                        className={`group relative p-3.5 rounded-2xl bg-gradient-to-br ${ws.gradient} border ${ws.border} shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[145px]`}
                      >
                        <div>
                          <div className={`w-8 h-8 rounded-lg ${ws.iconBg} flex items-center justify-center shadow-xs mb-2.5`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                            {ws.title}
                          </h3>
                          <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                            {ws.desc}
                          </p>
                        </div>
                        <div className="pt-2 flex items-center text-xs font-semibold text-slate-600 group-hover:text-emerald-700">
                          <span>Open</span>
                          <span className="ml-1 text-slate-400 group-hover:translate-x-0.5 transition-transform">→</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW 2: PRODUCTION & JOBWORK
             ========================================================================= */}
          {(activeNav === 'Production' || activeNav === 'JobWork') && activeCompanyOps && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {currentCompanyObj.name} — Production & Batch Floor
                  </h2>
                  <p className="text-xs text-slate-500">
                    Live batch logs, raw materials consumption & machine output
                  </p>
                </div>
                <button
                  onClick={() => setActiveNav('Workspaces')}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  ← Back to Workspaces
                </button>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Batch ID</th>
                      <th className="py-3 px-4">Finished Product</th>
                      <th className="py-3 px-4">Machine / Bay</th>
                      <th className="py-3 px-4">Raw Material Lot</th>
                      <th className="py-3 px-4">Target Output</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeCompanyOps.production.map((b) => (
                      <tr key={b.batchId} className="hover:bg-slate-50/70">
                        <td className="py-3 px-4 font-bold text-slate-900">{b.batchId}</td>
                        <td className="py-3 px-4 font-medium text-slate-800">{b.product}</td>
                        <td className="py-3 px-4 text-slate-600">{b.machine}</td>
                        <td className="py-3 px-4 text-slate-600">{b.rawMaterial}</td>
                        <td className="py-3 px-4 font-semibold text-slate-900">{b.output}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              b.status === 'Running'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : b.status === 'Completed'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW 3: MULTI-COMPANY INVENTORY (Stock List, Stock In, Stock Out)
              With in-bar Company Filter Option (in Siona, Sudhi, Swati, Vilaano)
             ========================================================================= */}
          {activeNav === 'Inventory' && (() => {
            const currentComp = inventoryCompanyFilter;
            const isAll = currentComp === 'All';

            // Filter items based on active company filter
            const displayedStockItems = stockItems.filter(item => {
              const matchesCompany = isAll || item.company === currentComp;
              const s = inventorySearch.toLowerCase();
              const matchesSearch =
                inventorySearch === '' ||
                item.name.toLowerCase().includes(s) ||
                item.sku.toLowerCase().includes(s) ||
                item.category.toLowerCase().includes(s) ||
                item.location.toLowerCase().includes(s);
              return matchesCompany && matchesSearch;
            });

            const displayedStockIn = stockInRecords.filter(r => {
              const matchesCompany = isAll || r.company === currentComp;
              const s = inventorySearch.toLowerCase();
              const matchesSearch =
                inventorySearch === '' ||
                r.itemName.toLowerCase().includes(s) ||
                r.sku.toLowerCase().includes(s) ||
                r.supplier.toLowerCase().includes(s) ||
                r.referenceNo.toLowerCase().includes(s);
              return matchesCompany && matchesSearch;
            });

            const displayedStockOut = stockOutRecords.filter(r => {
              const matchesCompany = isAll || r.company === currentComp;
              const s = inventorySearch.toLowerCase();
              const matchesSearch =
                inventorySearch === '' ||
                r.itemName.toLowerCase().includes(s) ||
                r.sku.toLowerCase().includes(s) ||
                r.destination.toLowerCase().includes(s) ||
                r.referenceNo.toLowerCase().includes(s);
              return matchesCompany && matchesSearch;
            });

            const companyScopedItems = isAll ? stockItems : stockItems.filter(i => i.company === currentComp);
            const companyScopedIn = isAll ? stockInRecords : stockInRecords.filter(r => r.company === currentComp);
            const companyScopedOut = isAll ? stockOutRecords : stockOutRecords.filter(r => r.company === currentComp);
            const lowStockCount = companyScopedItems.filter(i => i.status === 'Low Stock').length;

            return (
              <div className="space-y-4 animate-fade-in">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-slate-900">
                        {isAll ? 'Central Group — Inventory Hub' : `${currentComp} — Inventory Hub`}
                      </h2>
                      {!isAll ? (
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${getCompanyBadgeStyle(currentComp)}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${getCompanyDotColor(currentComp)}`} />
                          {currentComp}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          All Companies Consolidated
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {isAll
                        ? 'Consolidated stock ledger across Siona Plasto, Sudhi Impex, Swati Enterprise and Vilaano.'
                        : `Live Stock List, Inward GRN (Stock In), and Outward Dispatches (Stock Out) for ${currentComp}.`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const targetComp = currentComp !== 'All' ? currentComp : 'Siona Plasto';
                        const itemsInComp = stockItems.filter(i => i.company === targetComp);
                        setNewStockIn({
                          company: targetComp,
                          sku: itemsInComp[0]?.sku || stockItems[0]?.sku,
                          quantity: 1000,
                          supplier: '',
                          referenceNo: '',
                          location: '',
                          receivedBy: 'Deepak Sharma',
                        });
                        setIsStockInModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer shadow-2xs transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Record Stock In</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const targetComp = currentComp !== 'All' ? currentComp : 'Siona Plasto';
                        const itemsInComp = stockItems.filter(i => i.company === targetComp);
                        setNewStockOut({
                          company: targetComp,
                          sku: itemsInComp[0]?.sku || stockItems[0]?.sku,
                          quantity: 100,
                          destination: '',
                          referenceNo: '',
                          dispatchedBy: 'Deepak Sharma',
                        });
                        setIsStockOutModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer shadow-2xs transition-colors"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Record Stock Out</span>
                    </button>
                  </div>
                </div>

                {/* KPI Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {isAll ? 'Total SKUs Tracked' : `${currentComp} SKUs`}
                    </span>
                    <div className="text-xl font-bold text-slate-900 mt-0.5">
                      {companyScopedItems.length} Items
                    </div>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Stock In Entries</span>
                    <div className="text-xl font-bold text-emerald-600 mt-0.5">
                      {companyScopedIn.length} Inwards
                    </div>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Stock Out Entries</span>
                    <div className="text-xl font-bold text-blue-600 mt-0.5">
                      {companyScopedOut.length} Outwards
                    </div>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Low Stock Alerts</span>
                    <div className="text-xl font-bold text-amber-600 mt-0.5">
                      {lowStockCount} Critical
                    </div>
                  </div>
                </div>

                {/* Sub-Tabs Bar + Company Filter Option (in yellow highlighted spot) + Search */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    {/* Left: Sub-Tabs */}
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0">
                      <button
                        type="button"
                        onClick={() => setInventoryTab('StockList')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          inventoryTab === 'StockList'
                            ? 'bg-white text-slate-900 shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        📦 Stock List ({companyScopedItems.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setInventoryTab('StockIn')}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          inventoryTab === 'StockIn'
                            ? 'bg-emerald-600 text-white shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <span>📥 Stock In</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${inventoryTab === 'StockIn' ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-700'}`}>
                          {companyScopedIn.length}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setInventoryTab('StockOut')}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          inventoryTab === 'StockOut'
                            ? 'bg-blue-600 text-white shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <span>📤 Stock Out</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${inventoryTab === 'StockOut' ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-700'}`}>
                          {companyScopedOut.length}
                        </span>
                      </button>
                    </div>

                    {/* Middle: Company Filter Option (Yellow highlighted area in user screenshot) */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100/90 px-3 py-1.5 rounded-xl border border-slate-200 transition-colors shadow-2xs">
                        <Building2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                          Company Filter:
                        </span>
                        <select
                          value={inventoryCompanyFilter}
                          onChange={(e) => setInventoryCompanyFilter(e.target.value)}
                          className="text-xs font-bold text-slate-800 bg-transparent border-0 focus:outline-none cursor-pointer pr-1"
                        >
                          <option value="All">All Companies ({stockItems.length} SKUs)</option>
                          <option value="Siona Plasto">Siona Plasto (4 SKUs)</option>
                          <option value="Sudhi Impex">Sudhi Impex (4 SKUs)</option>
                          <option value="Swati Enterprise">Swati Enterprise (4 SKUs)</option>
                          <option value="Vilaano">Vilaano (4 SKUs)</option>
                        </select>
                      </div>
                    </div>

                    {/* Right: Search Input */}
                    <div className="relative w-full sm:w-64">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search SKU, item, partner, ref..."
                        value={inventorySearch}
                        onChange={(e) => setInventorySearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                {/* =========================================================================
                    SUB-VIEW 1: STOCK LIST
                   ========================================================================= */}
                {inventoryTab === 'StockList' && (
                  <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                        <tr>
                          <th className="py-3 px-3">SKU Code</th>
                          <th className="py-3 px-3 min-w-[200px]">Item Name & Category</th>
                          <th className="py-3 px-3">Company</th>
                          <th className="py-3 px-3">Warehouse Location</th>
                          <th className="py-3 px-3">Current Stock</th>
                          <th className="py-3 px-3">Unit Valuation</th>
                          <th className="py-3 px-3">QR Batch Tag</th>
                          <th className="py-3 px-3">Stock Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {displayedStockItems.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="py-8 text-center text-slate-400">
                              No inventory items found matching the filter.
                            </td>
                          </tr>
                        ) : (
                          displayedStockItems.map((item) => (
                            <tr key={item.sku} className="hover:bg-slate-50/70 transition-colors">
                              <td className="py-3 px-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                                {item.sku}
                              </td>
                              <td className="py-3 px-3">
                                <div className="font-semibold text-slate-900">{item.name}</div>
                                <div className="text-[11px] text-slate-500">{item.category}</div>
                              </td>
                              <td className="py-3 px-3 whitespace-nowrap">
                                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getCompanyBadgeStyle(item.company)}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${getCompanyDotColor(item.company)}`} />
                                  {item.company}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-slate-600 font-medium whitespace-nowrap">
                                {item.location}
                              </td>
                              <td className="py-3 px-3 whitespace-nowrap">
                                <div className="text-sm font-bold text-slate-900">
                                  {item.stock.toLocaleString()} <span className="text-xs text-slate-500 font-normal">{item.uom}</span>
                                </div>
                                <div className="text-[10px] text-slate-400">
                                  Min: {item.minStock.toLocaleString()} {item.uom}
                                </div>
                              </td>
                              <td className="py-3 px-3 whitespace-nowrap">
                                <div className="font-bold text-slate-800">₹{(item.stock * item.unitPrice).toLocaleString()}</div>
                                <div className="text-[10px] text-slate-500">₹{item.unitPrice}/{item.uom}</div>
                              </td>
                              <td className="py-3 px-3 whitespace-nowrap">
                                <span className="inline-flex items-center gap-1 font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-700 border border-slate-200">
                                  <QrCode className="w-3 h-3 text-slate-500" />
                                  {item.qrTag}
                                </span>
                              </td>
                              <td className="py-3 px-3 whitespace-nowrap">
                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                    item.status === 'Optimal'
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                      : 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse'
                                  }`}
                                >
                                  {item.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* =========================================================================
                    SUB-VIEW 2: STOCK IN
                   ========================================================================= */}
                {inventoryTab === 'StockIn' && (
                  <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                    <div className="p-3 bg-emerald-50/40 border-b border-emerald-100 flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                        <span>📥 Inward Stock Receipts (GRN / Purchases / Incoming Challans)</span>
                      </span>
                      <span className="text-[11px] text-emerald-700 font-medium">
                        All inward transactions directly increase item stock balances
                      </span>
                    </div>
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                        <tr>
                          <th className="py-3 px-3">Inward ID</th>
                          <th className="py-3 px-3">Date</th>
                          <th className="py-3 px-3 min-w-[180px]">Item & SKU</th>
                          <th className="py-3 px-3">Company</th>
                          <th className="py-3 px-3">Quantity Received</th>
                          <th className="py-3 px-3">Supplier / Vendor</th>
                          <th className="py-3 px-3">PO / Challan Ref</th>
                          <th className="py-3 px-3">Received By</th>
                          <th className="py-3 px-3">QC Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {displayedStockIn.length === 0 ? (
                          <tr>
                            <td colSpan={9} className="py-8 text-center text-slate-400">
                              No inward stock records found matching the filter.
                            </td>
                          </tr>
                        ) : (
                          displayedStockIn.map((r) => (
                            <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                              <td className="py-3 px-3 font-mono font-bold text-emerald-700 whitespace-nowrap">
                                {r.id}
                              </td>
                              <td className="py-3 px-3 text-slate-600 whitespace-nowrap">{r.date}</td>
                              <td className="py-3 px-3">
                                <div className="font-semibold text-slate-900">{r.itemName}</div>
                                <div className="text-[10px] font-mono text-slate-400">{r.sku}</div>
                              </td>
                              <td className="py-3 px-3 whitespace-nowrap">
                                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getCompanyBadgeStyle(r.company)}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${getCompanyDotColor(r.company)}`} />
                                  {r.company}
                                </span>
                              </td>
                              <td className="py-3 px-3 whitespace-nowrap">
                                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                  +{r.quantity.toLocaleString()} {r.uom}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-slate-700 font-medium">{r.supplier}</td>
                              <td className="py-3 px-3 font-mono text-slate-600 text-[11px] whitespace-nowrap">{r.referenceNo}</td>
                              <td className="py-3 px-3 text-slate-600 whitespace-nowrap">{r.receivedBy}</td>
                              <td className="py-3 px-3 whitespace-nowrap">
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                  {r.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* =========================================================================
                    SUB-VIEW 3: STOCK OUT
                   ========================================================================= */}
                {inventoryTab === 'StockOut' && (
                  <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                    <div className="p-3 bg-blue-50/40 border-b border-blue-100 flex items-center justify-between text-xs">
                      <span className="font-bold text-blue-900 flex items-center gap-1.5">
                        <span>📤 Outward Stock Dispatches (Sales / Delivery Challans / Transfers)</span>
                      </span>
                      <span className="text-[11px] text-blue-700 font-medium">
                        All dispatch transactions automatically deduct quantity from current stock
                      </span>
                    </div>
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                        <tr>
                          <th className="py-3 px-3">Outward ID</th>
                          <th className="py-3 px-3">Date</th>
                          <th className="py-3 px-3 min-w-[180px]">Item & SKU</th>
                          <th className="py-3 px-3">Company</th>
                          <th className="py-3 px-3">Quantity Dispatched</th>
                          <th className="py-3 px-3">Customer / Destination</th>
                          <th className="py-3 px-3">Delivery Challan / Invoice</th>
                          <th className="py-3 px-3">Dispatched By</th>
                          <th className="py-3 px-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {displayedStockOut.length === 0 ? (
                          <tr>
                            <td colSpan={9} className="py-8 text-center text-slate-400">
                              No outward stock dispatches found matching the filter.
                            </td>
                          </tr>
                        ) : (
                          displayedStockOut.map((r) => (
                            <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                              <td className="py-3 px-3 font-mono font-bold text-blue-700 whitespace-nowrap">
                                {r.id}
                              </td>
                              <td className="py-3 px-3 text-slate-600 whitespace-nowrap">{r.date}</td>
                              <td className="py-3 px-3">
                                <div className="font-semibold text-slate-900">{r.itemName}</div>
                                <div className="text-[10px] font-mono text-slate-400">{r.sku}</div>
                              </td>
                              <td className="py-3 px-3 whitespace-nowrap">
                                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getCompanyBadgeStyle(r.company)}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${getCompanyDotColor(r.company)}`} />
                                  {r.company}
                                </span>
                              </td>
                              <td className="py-3 px-3 whitespace-nowrap">
                                <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                                  -{r.quantity.toLocaleString()} {r.uom}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-slate-700 font-medium">{r.destination}</td>
                              <td className="py-3 px-3 font-mono text-slate-600 text-[11px] whitespace-nowrap">{r.referenceNo}</td>
                              <td className="py-3 px-3 text-slate-600 whitespace-nowrap">{r.dispatchedBy}</td>
                              <td className="py-3 px-3 whitespace-nowrap">
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                                  {r.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* =========================================================================
                    MODAL: RECORD STOCK IN (INWARD RECEIPT)
                   ========================================================================= */}
                {isStockInModalOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
                    <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
                      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/50">
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">Record Inward Stock (Stock In)</h3>
                          <p className="text-[11px] text-slate-500">Log GRN, supplier purchases and incoming challans</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsStockInModalOpen(false)}
                          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <form onSubmit={handleRecordStockIn} className="p-5 space-y-3.5 text-xs">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700">Company *</label>
                          <select
                            value={newStockIn.company}
                            onChange={(e) => {
                              const comp = e.target.value;
                              const compItems = stockItems.filter(i => i.company === comp);
                              setNewStockIn({
                                ...newStockIn,
                                company: comp,
                                sku: compItems[0]?.sku || '',
                              });
                            }}
                            className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                          >
                            {COMPANIES.filter(c => c.id !== 'All').map(c => (
                              <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700">Select Item / SKU *</label>
                          <select
                            value={newStockIn.sku}
                            onChange={(e) => setNewStockIn({ ...newStockIn, sku: e.target.value })}
                            className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                            required
                          >
                            {stockItems
                              .filter(i => i.company === newStockIn.company)
                              .map(i => (
                                <option key={i.sku} value={i.sku}>
                                  {i.sku} — {i.name} ({i.stock} {i.uom} in stock)
                                </option>
                              ))}
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-700">Inward Quantity *</label>
                            <input
                              type="number"
                              min="1"
                              value={newStockIn.quantity}
                              onChange={(e) => setNewStockIn({ ...newStockIn, quantity: e.target.value })}
                              className="w-full p-2 border border-slate-200 rounded-lg"
                              required
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-700">UOM</label>
                            <input
                              type="text"
                              disabled
                              value={stockItems.find(i => i.sku === newStockIn.sku)?.uom || 'Units'}
                              className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 font-bold"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-700">Supplier / Vendor *</label>
                            <input
                              type="text"
                              placeholder="e.g. Reliance Petrochem / Agro Benin"
                              value={newStockIn.supplier}
                              onChange={(e) => setNewStockIn({ ...newStockIn, supplier: e.target.value })}
                              className="w-full p-2 border border-slate-200 rounded-lg"
                              required
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-700">PO / Invoice / Challan Ref *</label>
                            <input
                              type="text"
                              placeholder="e.g. PO-8841 / INV-991"
                              value={newStockIn.referenceNo}
                              onChange={(e) => setNewStockIn({ ...newStockIn, referenceNo: e.target.value })}
                              className="w-full p-2 border border-slate-200 rounded-lg"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-700">Warehouse Location</label>
                            <input
                              type="text"
                              placeholder="e.g. Central Silo / Cold Store"
                              value={newStockIn.location}
                              onChange={(e) => setNewStockIn({ ...newStockIn, location: e.target.value })}
                              className="w-full p-2 border border-slate-200 rounded-lg"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-700">Received By</label>
                            <select
                              value={newStockIn.receivedBy}
                              onChange={(e) => setNewStockIn({ ...newStockIn, receivedBy: e.target.value })}
                              className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                            >
                              {STAFF_MEMBERS.map(staff => (
                                <option key={staff} value={staff}>{staff}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() => setIsStockInModalOpen(false)}
                            className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-semibold text-xs hover:bg-slate-50 cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs cursor-pointer shadow-2xs"
                          >
                            Save Stock In (+Add Stock)
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* =========================================================================
                    MODAL: RECORD STOCK OUT (OUTWARD DISPATCH)
                   ========================================================================= */}
                {isStockOutModalOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
                    <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
                      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/50">
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">Record Outward Stock (Stock Out)</h3>
                          <p className="text-[11px] text-slate-500">Log customer dispatches, jobwork outwards & transfers</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsStockOutModalOpen(false)}
                          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <form onSubmit={handleRecordStockOut} className="p-5 space-y-3.5 text-xs">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700">Company *</label>
                          <select
                            value={newStockOut.company}
                            onChange={(e) => {
                              const comp = e.target.value;
                              const compItems = stockItems.filter(i => i.company === comp);
                              setNewStockOut({
                                ...newStockOut,
                                company: comp,
                                sku: compItems[0]?.sku || '',
                              });
                            }}
                            className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                          >
                            {COMPANIES.filter(c => c.id !== 'All').map(c => (
                              <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <label className="text-[11px] font-bold text-slate-700">Select Item / SKU *</label>
                            <span className="text-[10px] text-indigo-600 font-bold">
                              Available: {stockItems.find(i => i.sku === newStockOut.sku)?.stock.toLocaleString()} {stockItems.find(i => i.sku === newStockOut.sku)?.uom}
                            </span>
                          </div>
                          <select
                            value={newStockOut.sku}
                            onChange={(e) => setNewStockOut({ ...newStockOut, sku: e.target.value })}
                            className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                            required
                          >
                            {stockItems
                              .filter(i => i.company === newStockOut.company)
                              .map(i => (
                                <option key={i.sku} value={i.sku}>
                                  {i.sku} — {i.name} (Stock: {i.stock} {i.uom})
                                </option>
                              ))}
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-700">Dispatch Quantity *</label>
                            <input
                              type="number"
                              min="1"
                              max={stockItems.find(i => i.sku === newStockOut.sku)?.stock || 999999}
                              value={newStockOut.quantity}
                              onChange={(e) => setNewStockOut({ ...newStockOut, quantity: e.target.value })}
                              className="w-full p-2 border border-slate-200 rounded-lg"
                              required
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-700">UOM</label>
                            <input
                              type="text"
                              disabled
                              value={stockItems.find(i => i.sku === newStockOut.sku)?.uom || 'Units'}
                              className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 font-bold"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-700">Customer / Destination *</label>
                            <input
                              type="text"
                              placeholder="e.g. Amul Dairy / EuroFoods / L&T"
                              value={newStockOut.destination}
                              onChange={(e) => setNewStockOut({ ...newStockOut, destination: e.target.value })}
                              className="w-full p-2 border border-slate-200 rounded-lg"
                              required
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-700">Delivery Challan / Invoice Ref *</label>
                            <input
                              type="text"
                              placeholder="e.g. GST/26-27/812 • EWB-991"
                              value={newStockOut.referenceNo}
                              onChange={(e) => setNewStockOut({ ...newStockOut, referenceNo: e.target.value })}
                              className="w-full p-2 border border-slate-200 rounded-lg"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700">Dispatched By</label>
                          <select
                            value={newStockOut.dispatchedBy}
                            onChange={(e) => setNewStockOut({ ...newStockOut, dispatchedBy: e.target.value })}
                            className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                          >
                            {STAFF_MEMBERS.map(staff => (
                              <option key={staff} value={staff}>{staff}</option>
                            ))}
                          </select>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() => setIsStockOutModalOpen(false)}
                            className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-semibold text-xs hover:bg-slate-50 cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold text-xs cursor-pointer shadow-2xs"
                          >
                            Dispatch Stock Out (-Deduct Stock)
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
          {/* =========================================================================
              VIEW 4: ACCOUNTS & GST
             ========================================================================= */}
          {(activeNav === 'Accounts' || activeNav === 'GST' || activeNav === 'TDSTCS') && activeCompanyOps && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {currentCompanyObj.name} — Accounts, GST & Billing
                  </h2>
                  <p className="text-xs text-slate-500">
                    Ledgers, GST liabilities & automated Tally sync status
                  </p>
                </div>
                <button
                  onClick={() => setActiveNav('Workspaces')}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  ← Back to Workspaces
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Receivables</span>
                  <p className="text-lg font-bold text-emerald-700 mt-1">{activeCompanyOps.accounts.receivables}</p>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Payables</span>
                  <p className="text-lg font-bold text-rose-700 mt-1">{activeCompanyOps.accounts.payables}</p>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">GST R1 Status</span>
                  <p className="text-xs font-bold text-slate-900 mt-1">{activeCompanyOps.accounts.gstR1Status}</p>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tally Sync</span>
                  <p className="text-xs font-semibold text-emerald-600 mt-1">{activeCompanyOps.accounts.tallySync}</p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Party Name</th>
                      <th className="py-3 px-4">Voucher Type</th>
                      <th className="py-3 px-4">Ref Invoice</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Due Date</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeCompanyOps.accounts.ledgers.map((l, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70">
                        <td className="py-3 px-4 font-bold text-slate-900">{l.party}</td>
                        <td className="py-3 px-4 text-slate-600">{l.type}</td>
                        <td className="py-3 px-4 font-mono text-slate-500">{l.ref}</td>
                        <td className="py-3 px-4 font-bold text-slate-900">{l.amount}</td>
                        <td className="py-3 px-4 text-slate-600">{l.due}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700">
                            {l.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW 5: SALES & DISPATCH
             ========================================================================= */}
          {activeNav === 'Sales' && activeCompanyOps && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {currentCompanyObj.name} — Sales & Transporter Dispatch
                  </h2>
                  <p className="text-xs text-slate-500">
                    Customer orders, GST tax invoices & vehicle tracking
                  </p>
                </div>
                <button
                  onClick={() => setActiveNav('Workspaces')}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  ← Back to Workspaces
                </button>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Items / SKU</th>
                      <th className="py-3 px-4">GST Invoice</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Transporter</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeCompanyOps.sales.map((s) => (
                      <tr key={s.orderId} className="hover:bg-slate-50/70">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">{s.orderId}</td>
                        <td className="py-3 px-4 font-semibold text-slate-800">{s.customer}</td>
                        <td className="py-3 px-4 text-slate-600">{s.items}</td>
                        <td className="py-3 px-4 font-mono text-slate-500">{s.invoiceNo}</td>
                        <td className="py-3 px-4 font-bold text-slate-900">{s.amount}</td>
                        <td className="py-3 px-4 text-slate-600">{s.transporter}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              s.status === 'Dispatched'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-blue-50 text-blue-700'
                            }`}
                          >
                            {s.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW 6: GENERIC WORKSPACES (CRM, Purchase, Projects, Service, etc.)
             ========================================================================= */}
          {[
            'CRM',
            'Purchase',
            'Projects',
            'Service',
            'Quality',
            'FixedAssets',
            'Budgets',
            'Reports',
          ].includes(activeNav) && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {currentCompanyObj.name} — {activeNav} Workspace
                  </h2>
                  <p className="text-xs text-slate-500">
                    Operational workspace active for {currentCompanyObj.name} (FY 2026–27)
                  </p>
                </div>
                <button
                  onClick={() => setActiveNav('Workspaces')}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  ← Back to Workspaces
                </button>
              </div>

              <div className="p-8 rounded-xl bg-slate-50 border border-slate-200/80 text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800">
                  {activeNav} Module Active for {currentCompanyObj.name}
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  All transaction ledgers, item masters, and operational workflows for {currentCompanyObj.name} are loaded and ready.
                </p>
                <div className="pt-2 flex justify-center gap-3">
                  <button
                    onClick={() => triggerToast(`New record created in ${activeNav}`)}
                    className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 cursor-pointer"
                  >
                    + Create New Entry
                  </button>
                  <button
                    onClick={() => triggerToast(`Synced ${activeNav} with ERP database`)}
                    className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-white cursor-pointer"
                  >
                    Sync Records
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW 7: RIGHTS MATRIX (RBAC)
             ========================================================================= */}
          {activeNav === 'Rights' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Role-Based Access Rights Matrix
                  </h2>
                  <p className="text-xs text-slate-500">
                    Configure granular module access permissions across all subsidiary roles
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Organizational Role</th>
                      {RIGHTS_MODULES.map((m) => (
                        <th key={m.id} className="py-3 px-3 text-center">
                          {m.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {roles.map((r) => {
                      const perms = rightsMatrix[r.name] || {};
                      return (
                        <tr key={r.id} className="hover:bg-slate-50/70">
                          <td className="py-3 px-4 font-bold text-slate-900">
                            {r.name}
                            <span className="block text-[10px] font-normal text-slate-400">{r.scope}</span>
                          </td>
                          {RIGHTS_MODULES.map((m) => {
                            const allowed = Boolean(perms[m.id]);
                            return (
                              <td key={m.id} className="py-3 px-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleToggleRight(r.name, m.id)}
                                  className={`w-6 h-6 rounded-md inline-flex items-center justify-center border transition-all cursor-pointer ${
                                    allowed
                                      ? 'bg-emerald-600 border-emerald-600 text-white'
                                      : 'bg-white border-slate-300 text-transparent hover:border-slate-400'
                                  }`}
                                >
                                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                </button>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW 8: TASKS (Group-Wide Advanced Operational Deliverables)
             ========================================================================= */}
          {activeNav === 'Task' && (
            <div className="space-y-4 animate-fade-in">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-900">
                      Tasks & Operational Deliverables
                    </h2>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      Multi-Company Hub
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Central task tracker across Siona Plasto, Sudhi Impex, Swati Enterprise & Vilaano with recurring cycles, @company tagging, evidence attachments, approvals & extension requests.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsAddTaskOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Task</span>
                  </button>
                </div>
              </div>

              {/* Quick Summary Metric Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Group Tasks</span>
                  <div className="text-xl font-bold text-slate-900 mt-0.5">{tasks.length}</div>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">In Progress</span>
                  <div className="text-xl font-bold text-blue-600 mt-0.5">{tasks.filter(t => t.status === 'In Progress').length}</div>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Extension Requests</span>
                  <div className="text-xl font-bold text-amber-600 mt-0.5">{tasks.filter(t => t.extensionRequest && t.extensionRequest.status === 'Pending').length} Pending</div>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Completed</span>
                  <div className="text-xl font-bold text-emerald-600 mt-0.5">{tasks.filter(t => t.status === 'Completed').length}</div>
                </div>
              </div>

              {/* Company & Status Filter Pills */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                {/* Company Filter Pills */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1.5">
                    Company:
                  </span>
                  <button
                    type="button"
                    onClick={() => setTaskCompanyFilter('All')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      taskCompanyFilter === 'All'
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                    }`}
                  >
                    All Companies ({tasks.length})
                  </button>
                  {COMPANIES.filter((c) => c.id !== 'All').map((c) => {
                    const count = tasks.filter((t) => t.company === c.id).length;
                    const isSelected = taskCompanyFilter === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setTaskCompanyFilter(c.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-2xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : getCompanyDotColor(c.id)}`} />
                        <span>{c.name}</span>
                        <span className={`text-[10px] px-1 py-0.2 rounded font-bold ${isSelected ? 'bg-indigo-700 text-white' : 'bg-slate-200/80 text-slate-600'}`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Status Filter Pills & Search */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2 border-t border-slate-100">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1.5">
                      Status:
                    </span>
                    {['All', 'In Progress', 'Pending', 'Completed'].map((st) => {
                      const count = st === 'All' ? tasks.length : tasks.filter((t) => t.status === st).length;
                      const isSelected = taskStatusFilter === st;
                      return (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setTaskStatusFilter(st)}
                          className={`px-2 py-0.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-slate-800 text-white'
                              : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                          }`}
                        >
                          {st} ({count})
                        </button>
                      );
                    })}
                  </div>

                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search title, @company, staff, id..."
                      value={taskSearch}
                      onChange={(e) => setTaskSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Tasks Table (Shows all tasks with rich indicators) */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-3">Task ID</th>
                      <th className="py-3 px-3 min-w-[220px]">Title & Description</th>
                      <th className="py-3 px-3">Company</th>
                      <th className="py-3 px-3">Assignees</th>
                      <th className="py-3 px-3">Due Date</th>
                      <th className="py-3 px-3">Checklist / Attachments</th>
                      <th className="py-3 px-3">3rd-Person Approval</th>
                      <th className="py-3 px-3">Priority</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredTasksList.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="py-8 text-center text-slate-400">
                          No tasks match the selected filters.
                        </td>
                      </tr>
                    ) : (
                      filteredTasksList.map((t) => {
                        const totalChecklist = t.checklist ? t.checklist.length : 0;
                        const completedChecklist = t.checklist ? t.checklist.filter((c) => c.completed).length : 0;
                        const attachmentCount = t.checklist ? t.checklist.filter((c) => c.attachment).length : 0;
                        const hasPendingExtension = t.extensionRequest && t.extensionRequest.status === 'Pending';

                        return (
                          <tr key={t.id} className="hover:bg-slate-50/70 transition-colors group">
                            {/* Task ID */}
                            <td className="py-3 px-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                              {t.id}
                            </td>

                            {/* Title & Description with Repeat Badge */}
                            <td className="py-3 px-3">
                              <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                {t.title}
                              </div>
                              <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                {renderWithMentions(t.description)}
                              </div>
                              {/* Repeat Frequency Indicator */}
                              {t.repeat && t.repeat !== 'None' && (
                                <div className="mt-1 flex items-center gap-1 text-[10px] text-indigo-600 font-semibold">
                                  <Repeat className="w-2.5 h-2.5" />
                                  <span>
                                    Repeats {t.repeat}
                                    {t.repeat === 'Monthly' && t.repeatMonthDate ? ` (every ${t.repeatMonthDate}th)` : ''}
                                    {t.repeat === 'Weekly' && t.repeatWeeklyDay ? ` (${t.repeatWeeklyDay})` : ''}
                                  </span>
                                </div>
                              )}
                            </td>

                            {/* Company */}
                            <td className="py-3 px-3 whitespace-nowrap">
                              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getCompanyBadgeStyle(t.company)}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${getCompanyDotColor(t.company)}`} />
                                {t.company}
                              </span>
                            </td>

                            {/* Multiple Assignees */}
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-1">
                                {(t.assignees || [t.assignee || 'Unassigned']).slice(0, 2).map((assignee, idx) => (
                                  <span
                                    key={idx}
                                    title={assignee}
                                    className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] flex items-center justify-center border border-slate-200"
                                  >
                                    {assignee.split(' ').map(n => n[0]).join('')}
                                  </span>
                                ))}
                                {(t.assignees || []).length > 2 && (
                                  <span className="text-[10px] text-slate-500 font-semibold">
                                    +{(t.assignees || []).length - 2}
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-slate-600 mt-0.5 truncate max-w-[110px]" title={(t.assignees || [t.assignee]).join(', ')}>
                                {(t.assignees || [t.assignee]).join(', ')}
                              </div>
                            </td>

                            {/* Due Date & Extension Alert */}
                            <td className="py-3 px-3 whitespace-nowrap">
                              <div className="text-slate-600 font-medium">{t.dueDate}</div>
                              {hasPendingExtension && (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 text-[9px] font-bold mt-0.5 animate-pulse">
                                  <Clock className="w-2.5 h-2.5" />
                                  <span>Ext: {t.extensionRequest.requestedDate}</span>
                                </span>
                              )}
                              {t.extensionRequest && t.extensionRequest.status === 'Approved' && (
                                <span className="inline-flex items-center gap-1 text-[9px] text-emerald-600 font-semibold mt-0.5">
                                  ✓ Ext. Approved
                                </span>
                              )}
                            </td>

                            {/* Checklist & Attachments */}
                            <td className="py-3 px-3 whitespace-nowrap">
                              {totalChecklist > 0 ? (
                                <div className="space-y-1">
                                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-700">
                                    <CheckSquare className="w-3 h-3 text-slate-400" />
                                    <span>{completedChecklist}/{totalChecklist} done</span>
                                  </div>
                                  {attachmentCount > 0 && (
                                    <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
                                      <Paperclip className="w-2.5 h-2.5" />
                                      <span>{attachmentCount} file(s) attached</span>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <span className="text-slate-400 text-[11px]">No checklist</span>
                              )}
                            </td>

                            {/* 3rd-Person Approval */}
                            <td className="py-3 px-3 whitespace-nowrap">
                              {t.approvers && t.approvers.length > 0 ? (
                                <div>
                                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    t.approvalStatus === 'Approved'
                                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                                  }`}>
                                    <ShieldCheck className="w-2.5 h-2.5" />
                                    <span>{t.approvalStatus || 'Pending'}</span>
                                  </span>
                                  <div className="text-[10px] text-slate-500 mt-0.5 truncate max-w-[100px]" title={t.approvers.join(', ')}>
                                    {t.approvers.join(', ')}
                                  </div>
                                </div>
                              ) : (
                                <span className="text-slate-400 text-[11px]">Not Required</span>
                              )}
                            </td>

                            {/* Priority */}
                            <td className="py-3 px-3 whitespace-nowrap">
                              <span className={`font-bold ${
                                t.priority === 'High' ? 'text-rose-600' : t.priority === 'Medium' ? 'text-amber-600' : 'text-slate-500'
                              }`}>
                                {t.priority}
                              </span>
                            </td>

                            {/* Status */}
                            <td className="py-3 px-3 whitespace-nowrap">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  t.status === 'Completed'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : t.status === 'In Progress'
                                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                                }`}
                              >
                                {t.status}
                              </span>
                            </td>

                            {/* Action */}
                            <td className="py-3 px-3 text-right whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedTaskDetail(t);
                                  setIsRequestingExtension(false);
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer transition-colors"
                              >
                                <span>Manage</span>
                                {t.comments && t.comments.length > 0 && (
                                  <span className="flex items-center gap-0.5 text-[10px] text-indigo-600 bg-indigo-50 px-1 rounded font-bold">
                                    <MessageSquare className="w-2.5 h-2.5" />
                                    {t.comments.length}
                                  </span>
                                )}
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* =========================================================================
                  MODAL 1: ADD NEW OPERATIONAL TASK (Rich Multi-Assignee & Repeat Builder)
                 ========================================================================= */}
              {isAddTaskOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
                  <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
                    {/* Modal Header */}
                    <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/50">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">Create Operational Task</h3>
                        <p className="text-[11px] text-slate-500">Assign multi-company deliverables with recurring schedules, attachments & approvals</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsAddTaskOpen(false)}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Modal Form */}
                    <form onSubmit={handleCreateTask} className="p-5 overflow-y-auto space-y-4 text-xs">
                      {/* Title & Company Dropdown */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2 space-y-1">
                          <label className="text-[11px] font-bold text-slate-700">Task Title *</label>
                          <input
                            type="text"
                            placeholder="e.g. Q4 Raw Material Inward Verification & QC Report"
                            value={newTask.title}
                            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                            className="w-full p-2 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700">Company (Drop Down) *</label>
                          <select
                            value={newTask.company}
                            onChange={(e) => setNewTask({ ...newTask, company: e.target.value })}
                            className="w-full p-2 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                          >
                            {COMPANIES.filter((c) => c.id !== 'All').map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700">Description</label>
                        <textarea
                          rows={3}
                          placeholder="Provide detailed instructions..."
                          value={newTask.description}
                          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                          className="w-full p-2 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                        />
                      </div>

                      {/* Repeat Configuration: None, Daily, Weekly, Monthly (Fixed Date) */}
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                        <div className="flex items-center gap-1.5 font-bold text-slate-800 text-[11px]">
                          <Repeat className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Task Repeat Schedule (Daily / Weekly / Monthly with Fixed Date)</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Frequency</label>
                            <select
                              value={newTask.repeat}
                              onChange={(e) => setNewTask({ ...newTask, repeat: e.target.value })}
                              className="w-full p-1.5 mt-0.5 border border-slate-200 rounded-lg text-xs bg-white"
                            >
                              <option value="None">None (One-time)</option>
                              <option value="Daily">Daily</option>
                              <option value="Weekly">Weekly</option>
                              <option value="Monthly">Monthly (Fixed Date)</option>
                            </select>
                          </div>

                          {newTask.repeat === 'Weekly' && (
                            <div>
                              <label className="text-[10px] font-bold text-slate-500 uppercase">Repeat Day</label>
                              <select
                                value={newTask.repeatWeeklyDay}
                                onChange={(e) => setNewTask({ ...newTask, repeatWeeklyDay: e.target.value })}
                                className="w-full p-1.5 mt-0.5 border border-slate-200 rounded-lg text-xs bg-white"
                              >
                                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((d) => (
                                  <option key={d} value={d}>
                                    Every {d}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}

                          {newTask.repeat === 'Monthly' && (
                            <div>
                              <label className="text-[10px] font-bold text-slate-500 uppercase">Fixed Month Date (1-31)</label>
                              <input
                                type="number"
                                min="1"
                                max="31"
                                value={newTask.repeatMonthDate}
                                onChange={(e) => setNewTask({ ...newTask, repeatMonthDate: e.target.value })}
                                placeholder="e.g. 5 or 28"
                                className="w-full p-1.5 mt-0.5 border border-slate-200 rounded-lg text-xs bg-white"
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Due Date & Priority */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700">Due Date *</label>
                          <input
                            type="date"
                            value={newTask.dueDate}
                            onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                            className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700">Priority Level</label>
                          <select
                            value={newTask.priority}
                            onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                            className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                          >
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                          </select>
                        </div>
                      </div>

                      {/* Multiple Assignees Selector */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-700">
                          Select Assignees (Multiple People) *
                        </label>
                        <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 rounded-lg border border-slate-200">
                          {STAFF_MEMBERS.map((staff) => {
                            const isAssigned = newTask.assignees.includes(staff);
                            return (
                              <button
                                key={staff}
                                type="button"
                                onClick={() => {
                                  const updated = isAssigned
                                    ? newTask.assignees.filter((a) => a !== staff)
                                    : [...newTask.assignees, staff];
                                  setNewTask({ ...newTask, assignees: updated });
                                }}
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                                  isAssigned
                                    ? 'bg-slate-900 text-white shadow-2xs'
                                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                                }`}
                              >
                                {isAssigned && <Check className="w-3 h-3 text-emerald-400" />}
                                <span>{staff}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Deliverable Requirements (Checklist Options) */}
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                        <span className="font-bold text-slate-800 text-[11px]">
                          Task Deliverable Requirements (Checklist)
                        </span>
                        <div className="flex flex-wrap items-center gap-6 pt-0.5">
                          <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={newTask.attachmentRequired}
                              onChange={(e) => setNewTask({ ...newTask, attachmentRequired: e.target.checked })}
                              className="rounded text-indigo-600 w-4 h-4 cursor-pointer"
                            />
                            <Paperclip className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Require Attachment (Document / Proof Required)</span>
                          </label>
                          <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={newTask.approvalRequired}
                              onChange={(e) => setNewTask({ ...newTask, approvalRequired: e.target.checked })}
                              className="rounded text-indigo-600 w-4 h-4 cursor-pointer"
                            />
                            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Require 3rd-Person Approval</span>
                          </label>
                        </div>
                      </div>

                      {/* 3rd-Person Approver (Single Selection Dropdown) */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-700">
                          Select 3rd-Person Approver (Drop Down)
                        </label>
                        <select
                          value={newTask.approver}
                          onChange={(e) => setNewTask({ ...newTask, approver: e.target.value })}
                          className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                        >
                          <option value="">-- No 3rd-Person Approver --</option>
                          {STAFF_MEMBERS.map((staff) => (
                            <option key={staff} value={staff}>
                              {staff}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Modal Footer Buttons */}
                      <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => setIsAddTaskOpen(false)}
                          className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-semibold text-xs hover:bg-slate-50 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-slate-900 text-white rounded-lg font-semibold text-xs hover:bg-slate-800 cursor-pointer shadow-2xs"
                        >
                          Create & Dispatch Task
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* =========================================================================
                  MODAL 2: TASK DETAIL, INTERACTIVE CHECKLIST, APPROVAL & COMMENTS
                 ========================================================================= */}
              {selectedTaskDetail && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
                  <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs bg-slate-900 text-white px-2 py-0.5 rounded">
                          {selectedTaskDetail.id}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
                          {selectedTaskDetail.title}
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedTaskDetail(null)}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Modal Body */}
                    <div className="p-6 overflow-y-auto space-y-5 text-xs">
                      {/* Company & Status Meta Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${getCompanyBadgeStyle(selectedTaskDetail.company)}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${getCompanyDotColor(selectedTaskDetail.company)}`} />
                            {selectedTaskDetail.company}
                          </span>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            selectedTaskDetail.status === 'Completed'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : selectedTaskDetail.status === 'In Progress'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {selectedTaskDetail.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-600">
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-bold mr-1">Due Date:</span>
                            <span className="font-bold text-slate-800">{selectedTaskDetail.dueDate}</span>
                          </div>
                          {selectedTaskDetail.repeat && selectedTaskDetail.repeat !== 'None' && (
                            <div className="flex items-center gap-1 text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                              <Repeat className="w-3 h-3" />
                              <span>{selectedTaskDetail.repeat}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Description with Highlighted @Company mentions */}
                      <div className="space-y-1">
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                          Task Description & Scope
                        </h4>
                        <div className="p-3 bg-white rounded-xl border border-slate-200 text-slate-700 leading-relaxed">
                          {renderWithMentions(selectedTaskDetail.description)}
                        </div>
                      </div>

                      {/* Assignees & Approvers */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Assigned People</span>
                          <div className="flex flex-wrap gap-1">
                            {(selectedTaskDetail.assignees || [selectedTaskDetail.assignee || 'Staff']).map((assignee, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-800 font-semibold text-xs"
                              >
                                <span className="w-4 h-4 rounded-full bg-slate-200 text-[9px] font-bold flex items-center justify-center">
                                  {assignee[0]}
                                </span>
                                {assignee}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">3rd-Person Approvers</span>
                          <div className="flex flex-wrap gap-1">
                            {(selectedTaskDetail.approvers && selectedTaskDetail.approvers.length > 0) ? (
                              selectedTaskDetail.approvers.map((app, idx) => {
                                const hasSigned = selectedTaskDetail.approvedBy && selectedTaskDetail.approvedBy.includes(app);
                                return (
                                  <button
                                    key={idx}
                                    type="button"
                                    onClick={() => handleSignApproval(selectedTaskDetail.id, app)}
                                    title="Click to toggle approval sign-off"
                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold cursor-pointer border transition-colors ${
                                      hasSigned
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                        : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                                    }`}
                                  >
                                    <ShieldCheck className="w-3 h-3" />
                                    <span>{app}: {hasSigned ? '✓ Signed' : 'Sign & Approve'}</span>
                                  </button>
                                );
                              })
                            ) : (
                              <span className="text-slate-400 text-xs">No 3rd-person approval required</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Date Extension Request Section */}
                      <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 font-bold text-amber-900 text-xs">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            <span>Request For Extension of Date</span>
                          </div>
                          {!isRequestingExtension && (!selectedTaskDetail.extensionRequest || selectedTaskDetail.extensionRequest.status !== 'Pending') && (
                            <button
                              type="button"
                              onClick={() => setIsRequestingExtension(true)}
                              className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold text-[11px] cursor-pointer shadow-2xs"
                            >
                              + Request Date Extension
                            </button>
                          )}
                        </div>

                        {/* If an extension request is pending review */}
                        {selectedTaskDetail.extensionRequest && selectedTaskDetail.extensionRequest.status === 'Pending' && (
                          <div className="p-2.5 bg-white rounded-lg border border-amber-200 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-amber-800 text-xs">
                                ⏳ Pending Request: Extend due date to {selectedTaskDetail.extensionRequest.requestedDate}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {selectedTaskDetail.extensionRequest.requestedAt}
                              </span>
                            </div>
                            <p className="text-slate-600 text-xs">
                              <strong>Reason:</strong> {selectedTaskDetail.extensionRequest.reason}
                            </p>
                            <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                              <button
                                type="button"
                                onClick={() => handleApproveExtension(selectedTaskDetail.id)}
                                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs cursor-pointer"
                              >
                                ✓ Approve Extension
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRejectExtension(selectedTaskDetail.id)}
                                className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold text-xs cursor-pointer"
                              >
                                ✕ Reject Extension
                              </button>
                            </div>
                          </div>
                        )}

                        {/* If extension request was approved */}
                        {selectedTaskDetail.extensionRequest && selectedTaskDetail.extensionRequest.status === 'Approved' && (
                          <div className="text-xs text-emerald-700 font-semibold">
                            ✓ Due date extended to {selectedTaskDetail.dueDate} (Extension Approved).
                          </div>
                        )}

                        {/* Form to submit a new extension request */}
                        {isRequestingExtension && (
                          <div className="p-3 bg-white rounded-lg border border-amber-200 space-y-2 mt-2">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div>
                                <label className="text-[10px] font-bold text-slate-600 uppercase">Proposed New Due Date</label>
                                <input
                                  type="date"
                                  value={extensionNewDate}
                                  onChange={(e) => setExtensionNewDate(e.target.value)}
                                  className="w-full p-1.5 border border-slate-200 rounded-lg text-xs"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-slate-600 uppercase">Reason for Extension</label>
                                <input
                                  type="text"
                                  placeholder="e.g. Awaiting lab spectrometer report from QC..."
                                  value={extensionReason}
                                  onChange={(e) => setExtensionReason(e.target.value)}
                                  className="w-full p-1.5 border border-slate-200 rounded-lg text-xs"
                                />
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleRequestExtension(selectedTaskDetail.id)}
                                className="px-3 py-1 bg-amber-600 text-white rounded-lg font-semibold text-xs hover:bg-amber-700 cursor-pointer"
                              >
                                Submit Extension Request
                              </button>
                              <button
                                type="button"
                                onClick={() => setIsRequestingExtension(false)}
                                className="px-3 py-1 border border-slate-200 text-slate-600 rounded-lg font-semibold text-xs hover:bg-slate-50 cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Checklist with Mandatory Document Attachments */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                            Verification Checklist & Required Proof
                          </h4>
                          <span className="text-[10px] text-slate-400">
                            Items with paperclip require file attachment before checking off
                          </span>
                        </div>

                        <div className="space-y-2">
                          {(selectedTaskDetail.checklist || []).map((item) => (
                            <div
                              key={item.id}
                              className={`p-3 rounded-xl border transition-all ${
                                item.completed
                                  ? 'bg-emerald-50/50 border-emerald-200'
                                  : 'bg-white border-slate-200'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <label className="inline-flex items-start gap-2.5 cursor-pointer flex-1">
                                  <input
                                    type="checkbox"
                                    checked={item.completed}
                                    onChange={() => handleToggleChecklist(selectedTaskDetail.id, item.id)}
                                    className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                                  />
                                  <div>
                                    <span className={`text-xs font-semibold ${item.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                                      {item.text}
                                    </span>
                                    <div className="flex flex-wrap items-center gap-2 mt-1">
                                      {item.attachmentRequired && (
                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">
                                          <Paperclip className="w-2.5 h-2.5" />
                                          <span>Attachment Required</span>
                                        </span>
                                      )}
                                      {item.requiresApproval && (
                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                                          <ShieldCheck className="w-2.5 h-2.5" />
                                          <span>3rd Person Approval</span>
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </label>

                                {/* File Attachment Controls */}
                                <div className="flex items-center gap-2">
                                  {item.attachment ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-200">
                                      <FileText className="w-3 h-3 text-emerald-600" />
                                      <span>{item.attachment}</span>
                                    </span>
                                  ) : item.attachmentRequired ? (
                                    <div className="flex items-center gap-1.5">
                                      <label className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold cursor-pointer border border-indigo-200 transition-colors">
                                        <Paperclip className="w-3 h-3 text-indigo-600" />
                                        <span>Attach Document</span>
                                        <input
                                          type="file"
                                          className="hidden"
                                          onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                              handleAttachFileToChecklist(selectedTaskDetail.id, item.id, file.name);
                                            }
                                          }}
                                        />
                                      </label>
                                      <button
                                        type="button"
                                        onClick={() => handleAttachFileToChecklist(selectedTaskDetail.id, item.id, 'signed_qc_slip_vapi.pdf')}
                                        className="text-[10px] text-slate-400 hover:text-indigo-600 underline cursor-pointer"
                                      >
                                        Sample PDF
                                      </button>
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Comments & Discussion Thread */}
                      <div className="space-y-3 pt-2 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                          <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                            Comments & Operational Discussion ({selectedTaskDetail.comments?.length || 0})
                          </h4>
                          <span className="text-[10px] text-slate-400">Comment option for assignees and managers</span>
                        </div>

                        {/* Comments Stream */}
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                          {(selectedTaskDetail.comments || []).length === 0 ? (
                            <p className="text-slate-400 text-xs italic">No comments yet. Post an update below.</p>
                          ) : (
                            selectedTaskDetail.comments.map((cm) => (
                              <div key={cm.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 font-bold text-[9px] flex items-center justify-center">
                                      {cm.author[0]}
                                    </span>
                                    <span className="font-bold text-slate-800 text-xs">{cm.author}</span>
                                  </div>
                                  <span className="text-[10px] text-slate-400">{cm.timestamp}</span>
                                </div>
                                <p className="text-slate-600 text-xs pl-5">{cm.text}</p>
                              </div>
                            ))
                          )}
                        </div>

                        {/* Add Comment Input */}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Write an operational comment or task update..."
                            value={taskCommentInput}
                            onChange={(e) => setTaskCommentInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddTaskComment(selectedTaskDetail.id);
                              }
                            }}
                            className="flex-1 p-2 bg-white border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleAddTaskComment(selectedTaskDetail.id)}
                            className="inline-flex items-center gap-1 px-3.5 py-2 bg-slate-900 text-white rounded-lg font-semibold text-xs hover:bg-slate-800 cursor-pointer transition-colors shadow-2xs"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Comment</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              VIEW 9: HRMS WORKFORCE DIRECTORY
             ========================================================================= */}
          {activeNav === 'HRMS' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Central HRMS & Biometric Attendance
                  </h2>
                  <p className="text-xs text-slate-500">
                    Workforce directory across all factories, ports and retail outlets
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Employee ID</th>
                      <th className="py-3 px-4">Full Name</th>
                      <th className="py-3 px-4">Designation</th>
                      <th className="py-3 px-4">Department</th>
                      <th className="py-3 px-4">Subsidiary</th>
                      <th className="py-3 px-4">Attendance Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {employees.map((e) => (
                      <tr key={e.id} className="hover:bg-slate-50/70">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">{e.id}</td>
                        <td className="py-3 px-4 font-bold text-slate-800">{e.name}</td>
                        <td className="py-3 px-4 text-slate-600">{e.role}</td>
                        <td className="py-3 px-4 text-slate-600">{e.department}</td>
                        <td className="py-3 px-4 font-semibold text-slate-700">{e.company}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              e.status === 'Present'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-rose-50 text-rose-700'
                            }`}
                          >
                            {e.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW 10: USERS, ROLES & GOVERNANCE
             ========================================================================= */}
          {/* USER MANAGEMENT VIEW */}
          {activeNav === 'User' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-900">
                      User Management & Directory
                    </h2>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {users.length} Active Accounts
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Centralized identity management across Siona Plasto, Sudhi Impex, Swati Enterprise and Vilaano
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer shadow-2xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New User</span>
                </button>
              </div>

              {/* Users Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">User ID & Name</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Assigned Subsidiaries</th>
                      <th className="py-3 px-4">Last Activity</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <span className="w-7 h-7 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                              {u.name.split(' ').map((n) => n[0]).join('')}
                            </span>
                            <div>
                              <div className="font-bold text-slate-900">{u.name}</div>
                              <div className="text-[10px] font-mono text-slate-400">{u.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-600 font-medium">{u.email}</td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {u.companies.map((c) => (
                              <span key={c} className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold border ${getCompanyBadgeStyle(c)}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${getCompanyDotColor(c)}`} />
                                {c}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-500 text-[11px]">{u.lastLogin}</td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Active
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add User Modal */}
              {isAddUserOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
                  <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/50">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">Add New ERP User</h3>
                        <p className="text-[11px] text-slate-500">Create an authenticated enterprise identity</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsAddUserOpen(false)}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleCreateUser} className="p-5 space-y-3.5 text-xs">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700">Full Name *</label>
                        <input
                          type="text"
                          placeholder="e.g. Rahul Sharma"
                          value={newUserData.name}
                          onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                          className="w-full p-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700">Corporate Email Address *</label>
                        <input
                          type="email"
                          placeholder="e.g. rahul@sionaplasto.in"
                          value={newUserData.email}
                          onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                          className="w-full p-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700">Assigned Role *</label>
                        <select
                          value={newUserData.role}
                          onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
                          className="w-full p-2 border border-slate-200 rounded-lg bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                        >
                          {roles.map((r) => (
                            <option key={r.id} value={r.name}>
                              {r.name} ({r.level})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-700">Assigned Subsidiaries (Multiple)</label>
                        <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                          {COMPANIES.filter((c) => c.id !== 'All').map((comp) => {
                            const isSelected = newUserData.companies.includes(comp.id);
                            return (
                              <label key={comp.id} className="flex items-center gap-2 cursor-pointer text-slate-700 text-xs font-medium">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => {
                                    const updated = isSelected
                                      ? newUserData.companies.filter((c) => c !== comp.id)
                                      : [...newUserData.companies, comp.id];
                                    setNewUserData({ ...newUserData, companies: updated });
                                  }}
                                  className="rounded text-indigo-600"
                                />
                                <span>{comp.name}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => setIsAddUserOpen(false)}
                          className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-semibold text-xs hover:bg-slate-50 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-slate-900 text-white rounded-lg font-semibold text-xs hover:bg-slate-800 cursor-pointer shadow-2xs"
                        >
                          Save User
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ROLE & PERMISSIONS VIEW */}
          {activeNav === 'Role' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-900">
                      Roles & Administrative Governance
                    </h2>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      {roles.length} System Roles
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Define administrative access levels, operational scopes and RBAC permission matrices
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddRoleOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer shadow-2xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Role</span>
                </button>
              </div>

              {/* Roles Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {roles.map((r) => {
                  const perms = rightsMatrix[r.name] || {};
                  const activeModules = Object.keys(perms).filter((k) => perms[k]);
                  return (
                    <div key={r.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-mono font-bold text-slate-400">{r.id}</span>
                          <h3 className="text-sm font-bold text-slate-900">{r.name}</h3>
                        </div>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {r.level}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 min-h-[36px]">{r.description}</p>
                      <div className="pt-2 border-t border-slate-100 space-y-1.5">
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Operational Scope:</div>
                        <div className="text-xs font-semibold text-slate-800">{r.scope}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase pt-1">Active Modules ({activeModules.length}):</div>
                        <div className="flex flex-wrap gap-1">
                          {activeModules.length > 0 ? (
                            activeModules.map((m) => (
                              <span key={m} className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200">
                                {m}
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">No modules granted</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add Role Modal */}
              {isAddRoleOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
                  <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/50">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">Define New Role</h3>
                        <p className="text-[11px] text-slate-500">Configure RBAC role hierarchy and module access</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsAddRoleOpen(false)}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleCreateRole} className="p-5 space-y-3.5 text-xs">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700">Role Title *</label>
                        <input
                          type="text"
                          placeholder="e.g. Quality Assurance Manager"
                          value={newRoleData.name}
                          onChange={(e) => setNewRoleData({ ...newRoleData, name: e.target.value })}
                          className="w-full p-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700">Description</label>
                        <input
                          type="text"
                          placeholder="Brief description of responsibilities..."
                          value={newRoleData.description}
                          onChange={(e) => setNewRoleData({ ...newRoleData, description: e.target.value })}
                          className="w-full p-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700">Operational Scope</label>
                          <select
                            value={newRoleData.scope}
                            onChange={(e) => setNewRoleData({ ...newRoleData, scope: e.target.value })}
                            className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                          >
                            <option value="All Companies (Group Wide)">All Companies (Group Wide)</option>
                            <option value="Assigned Subsidiaries">Assigned Subsidiaries</option>
                            <option value="Plant / Unit Level">Plant / Unit Level</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700">Access Level</label>
                          <select
                            value={newRoleData.level}
                            onChange={(e) => setNewRoleData({ ...newRoleData, level: e.target.value })}
                            className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                          >
                            <option value="L1 • Executive">L1 • Executive</option>
                            <option value="L2 • Management">L2 • Management</option>
                            <option value="L3 • Operations">L3 • Operations</option>
                            <option value="L4 • Staff">L4 • Staff</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-700">Module Permissions</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                          {RIGHTS_MODULES.map((m) => {
                            const isChecked = newRoleData.modules.includes(m.id);
                            return (
                              <label key={m.id} className="flex items-center gap-1.5 cursor-pointer text-slate-700 text-xs font-medium">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => {
                                    const updated = isChecked
                                      ? newRoleData.modules.filter((mod) => mod !== m.id)
                                      : [...newRoleData.modules, m.id];
                                    setNewRoleData({ ...newRoleData, modules: updated });
                                  }}
                                  className="rounded text-indigo-600"
                                />
                                <span>{m.label}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => setIsAddRoleOpen(false)}
                          className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-semibold text-xs hover:bg-slate-50 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-slate-900 text-white rounded-lg font-semibold text-xs hover:bg-slate-800 cursor-pointer shadow-2xs"
                        >
                          Save Role
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ACCESS CONTROL MATRIX */}
          {activeNav === 'Control' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <h2 className="text-lg font-bold text-slate-900">Enterprise Rights & Permission Matrix</h2>
                <p className="text-xs text-slate-500 mt-0.5">Toggle permissions for each role across core modules</p>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Role Name</th>
                      {RIGHTS_MODULES.map((m) => (
                        <th key={m.id} className="py-3 px-3 text-center">{m.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {roles.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/70">
                        <td className="py-3 px-4 font-bold text-slate-900">{r.name}</td>
                        {RIGHTS_MODULES.map((m) => {
                          const hasAccess = rightsMatrix[r.name]?.[m.id];
                          return (
                            <td key={m.id} className="py-3 px-3 text-center">
                              <button
                                type="button"
                                onClick={() => handleToggleRight(r.name, m.id)}
                                className={`w-6 h-6 rounded-md inline-flex items-center justify-center transition-colors cursor-pointer ${
                                  hasAccess
                                    ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                    : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                                }`}
                              >
                                {hasAccess ? <Check className="w-3.5 h-3.5" /> : <X className="w-3 h-3" />}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          </main>
      </div>
    </div>
  );
}
