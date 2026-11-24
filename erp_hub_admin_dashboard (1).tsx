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
  Package,
  AlertTriangle,
  FileSpreadsheet,
  RefreshCw,
  IndianRupee,
  BadgeCheck,
  KeyRound,
  Edit3
} from 'lucide-react';

// --- Constants & Company Metadata ---
const COMPANIES = [
  { id: 'All', name: 'All Companies', short: 'ALL', color: 'indigo', sector: 'Group Conglomerate', location: 'Mumbai HQ' },
  { id: 'Siona Plasto', name: 'Siona Plasto', short: 'SP', color: 'blue', sector: 'Polymer & Packaging', location: 'Vapi Plant' },
  { id: 'Sudhi Impex', name: 'Sudhi Impex', short: 'SI', color: 'emerald', sector: 'Global Trade & Packaging', location: 'Nhava Sheva' },
  { id: 'Swati Enterprise', name: 'Swati Enterprise', short: 'SE', color: 'amber', sector: 'Industrial Supplies & Jobwork', location: 'Ahmedabad' },
  { id: 'Vilaano', name: 'Vilaano', short: 'VL', color: 'purple', sector: 'Consumer & Lifestyle Retail', location: 'Bandra, Mumbai' },
];

// Global Navigation (Shown ONLY when "All" is selected)
const GLOBAL_NAV_ITEMS = [
  { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Consolidated executive overview & multi-entity metrics' },
  { id: 'Task', label: 'Task', icon: CheckSquare, description: 'Group-wide operations, workflows & deliverables' },
  { id: 'HRMS', label: 'HRMS', icon: Users, description: 'Central workforce directory & biometric attendance' },
  { id: 'User', label: 'User', icon: UserCog, description: 'Create accounts & assign multi-entity user access' },
  { id: 'Role', label: 'Role', icon: BadgeCheck, description: 'Define organizational roles, hierarchies & entity scope' },
  { id: 'Rights', label: 'Rights', icon: KeyRound, description: 'Granular module permission matrix per role' },
  { id: 'Control', label: 'Control', icon: Sliders, description: 'System configuration, company policies & governance' },
];

// Company-Specific Navigation (Shown when a specific company is selected)
const COMPANY_NAV_ITEMS = [
  { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Entity overview: Orders, Production, Stock & Tasks' },
  { id: 'Task', label: 'Task', icon: CheckSquare, description: 'Company task manager & daily operational assignments' },
  { id: 'Production', label: 'Production & Jobwork', icon: Factory, description: 'Batch tracking, machine output, raw materials & jobwork' },
  { id: 'Inventory', label: 'Inventory & QR Stock', icon: QrCode, description: 'Live KG/Unit stock levels, SKU search & QR batch tags' },
  { id: 'Sales', label: 'Sales & Dispatch', icon: Truck, description: 'Customer orders, GST invoices, dispatches & transporters' },
  { id: 'Accounts', label: 'Accounts & Billing', icon: Receipt, description: 'Receivables/Payables, GST R1/3B summary & Tally sync' },
];

// --- Initial Realistic Multi-Company Dummy Data ---
const INITIAL_TASKS = [
  { id: 'TSK-1042', title: 'Q4 HDPE & PP Granules Bulk Procurement Audit', company: 'Siona Plasto', assignee: 'Rajesh Sharma', priority: 'High', status: 'In Progress', dueDate: '2026-11-28' },
  { id: 'TSK-1043', title: 'Container Customs Clearance & Bill of Lading', company: 'Sudhi Impex', assignee: 'Meera Nair', priority: 'High', status: 'Pending', dueDate: '2026-11-25' },
  { id: 'TSK-1044', title: 'West Zone Dealer Jobwork Challan Reconciliation', company: 'Swati Enterprise', assignee: 'Vikram Patel', priority: 'Medium', status: 'Completed', dueDate: '2026-11-22' },
  { id: 'TSK-1045', title: 'Winter Collection Flagship Store Merchandising', company: 'Vilaano', assignee: 'Ananya Deshmukh', priority: 'High', status: 'In Progress', dueDate: '2026-11-30' },
  { id: 'TSK-1046', title: 'Injection Molding Line-3 Preventive Maintenance', company: 'Siona Plasto', assignee: 'Suresh Iyer', priority: 'Low', status: 'Completed', dueDate: '2026-11-21' },
  { id: 'TSK-1047', title: '500g Pouch to 25kg Master Carton Repacking Batch', company: 'Sudhi Impex', assignee: 'Karan Malhotra', priority: 'Medium', status: 'In Progress', dueDate: '2026-12-02' },
  { id: 'TSK-1048', title: 'GST E-Way Bill Compliance Automation', company: 'Swati Enterprise', assignee: 'Priya Joshi', priority: 'High', status: 'Pending', dueDate: '2026-11-26' },
  { id: 'TSK-1049', title: 'Regional Distributor Restock & Loyalty Dispatch', company: 'Vilaano', assignee: 'Rohan Kapoor', priority: 'Medium', status: 'Completed', dueDate: '2026-11-20' },
];

const INITIAL_EMPLOYEES = [
  { id: 'EMP-201', name: 'Rajesh Sharma', role: 'Plant Operations Head', department: 'Manufacturing', company: 'Siona Plasto', status: 'Present', shift: 'General (09:00 - 18:00)', email: 'r.sharma@sionaplasto.in' },
  { id: 'EMP-202', name: 'Meera Nair', role: 'Senior EXIM Manager', department: 'Logistics & Trade', company: 'Sudhi Impex', status: 'Present', shift: 'General (09:30 - 18:30)', email: 'meera@sudhiimpex.com' },
  { id: 'EMP-203', name: 'Vikram Patel', role: 'Regional Supply Lead', department: 'Distribution', company: 'Swati Enterprise', status: 'Present', shift: 'General (09:00 - 18:00)', email: 'vikram@swatienterprise.in' },
  { id: 'EMP-204', name: 'Ananya Deshmukh', role: 'Creative Brand Director', department: 'Design & Retail', company: 'Vilaano', status: 'Present', shift: 'Flexi (10:00 - 19:00)', email: 'ananya@vilaano.com' },
  { id: 'EMP-205', name: 'Suresh Iyer', role: 'Quality Assurance Engineer', department: 'Quality Control', company: 'Siona Plasto', status: 'On Leave', shift: 'Shift A (07:00 - 15:30)', email: 's.iyer@sionaplasto.in' },
  { id: 'EMP-206', name: 'Karan Malhotra', role: 'Freight & Customs Specialist', department: 'Compliance', company: 'Sudhi Impex', status: 'Present', shift: 'General (09:30 - 18:30)', email: 'karan@sudhiimpex.com' },
  { id: 'EMP-207', name: 'Priya Joshi', role: 'Accounts & Tax Controller', department: 'Finance', company: 'Swati Enterprise', status: 'On Leave', shift: 'General (09:30 - 18:30)', email: 'priya@swatienterprise.in' },
  { id: 'EMP-208', name: 'Rohan Kapoor', role: 'Omnichannel Retail Lead', department: 'E-Commerce', company: 'Vilaano', status: 'Present', shift: 'Flexi (10:00 - 19:00)', email: 'rohan@vilaano.com' },
];

const INITIAL_USERS = [
  { id: 'USR-01', name: 'Aarav Mehta', email: 'aarav.mehta@erphub.in', role: 'Super Admin', companies: ['Siona Plasto', 'Sudhi Impex', 'Swati Enterprise', 'Vilaano'], active: true, lastLogin: 'Today, 14:12' },
  { id: 'USR-02', name: 'Rajesh Sharma', email: 'r.sharma@sionaplasto.in', role: 'Operations Manager', companies: ['Siona Plasto'], active: true, lastLogin: 'Today, 11:45' },
  { id: 'USR-03', name: 'Meera Nair', email: 'meera@sudhiimpex.com', role: 'Operations Manager', companies: ['Sudhi Impex', 'Swati Enterprise'], active: true, lastLogin: 'Today, 13:05' },
  { id: 'USR-04', name: 'Ananya Deshmukh', email: 'ananya@vilaano.com', role: 'Sales Lead', companies: ['Vilaano'], active: true, lastLogin: 'Yesterday, 18:20' },
  { id: 'USR-05', name: 'Vikram Patel', email: 'vikram@swatienterprise.in', role: 'Production Supervisor', companies: ['Swati Enterprise'], active: true, lastLogin: 'Today, 10:15' },
  { id: 'USR-06', name: 'Priya Joshi', email: 'priya@swatienterprise.in', role: 'Accounts Executive', companies: ['Swati Enterprise', 'Siona Plasto'], active: true, lastLogin: 'Today, 09:40' },
  { id: 'USR-07', name: 'Suresh Iyer', email: 's.iyer@sionaplasto.in', role: 'Production Supervisor', companies: ['Siona Plasto'], active: false, lastLogin: 'Nov 20, 16:40' },
];

const INITIAL_ROLES = [
  {
    id: 'ROL-01',
    name: 'Super Admin',
    description: 'Full unrestricted administrative access across all subsidiaries, HRMS, billing, and governance controls.',
    scope: 'All Companies (Group Wide)',
    level: 'L1 • Executive',
  },
  {
    id: 'ROL-02',
    name: 'Operations Manager',
    description: 'Oversees plant throughput, task allocation, dispatch clearance, and cross-unit vendor coordination.',
    scope: 'Assigned Subsidiaries',
    level: 'L2 • Management',
  },
  {
    id: 'ROL-03',
    name: 'Accounts Executive',
    description: 'Manages GST R1/3B filings, Tally Prime ledger sync, customer receivables, and vendor payouts.',
    scope: 'Assigned Subsidiaries',
    level: 'L3 • Finance',
  },
  {
    id: 'ROL-04',
    name: 'Production Supervisor',
    description: 'Controls shop-floor batch logs, raw material consumption, QR stock tags, and QC approvals.',
    scope: 'Plant / Unit Level',
    level: 'L3 • Operations',
  },
  {
    id: 'ROL-05',
    name: 'Sales Lead',
    description: 'Handles client orders, proforma quotations, e-way bill dispatches, and retail channel replenishment.',
    scope: 'Assigned Subsidiaries',
    level: 'L3 • Commercial',
  },
];

const RIGHTS_MODULES = [
  { id: 'Dashboard', label: 'Dashboard' },
  { id: 'Task', label: 'Task' },
  { id: 'Production', label: 'Production' },
  { id: 'Inventory', label: 'Inventory' },
  { id: 'Sales', label: 'Sales' },
  { id: 'Accounts', label: 'Accounts' },
  { id: 'HRMS', label: 'HRMS' },
  { id: 'UserManagement', label: 'User Management' },
];

const INITIAL_RIGHTS_MATRIX = {
  'Super Admin': {
    Dashboard: true,
    Task: true,
    Production: true,
    Inventory: true,
    Sales: true,
    Accounts: true,
    HRMS: true,
    UserManagement: true,
  },
  'Operations Manager': {
    Dashboard: true,
    Task: true,
    Production: true,
    Inventory: true,
    Sales: true,
    Accounts: false,
    HRMS: true,
    UserManagement: false,
  },
  'Accounts Executive': {
    Dashboard: true,
    Task: true,
    Production: false,
    Inventory: true,
    Sales: true,
    Accounts: true,
    HRMS: false,
    UserManagement: false,
  },
  'Production Supervisor': {
    Dashboard: true,
    Task: true,
    Production: true,
    Inventory: true,
    Sales: false,
    Accounts: false,
    HRMS: false,
    UserManagement: false,
  },
  'Sales Lead': {
    Dashboard: true,
    Task: true,
    Production: false,
    Inventory: true,
    Sales: true,
    Accounts: false,
    HRMS: false,
    UserManagement: false,
  },
};

const INITIAL_ACTIVITY = [
  { id: 1, company: 'Siona Plasto', user: 'Rajesh Sharma', action: 'Approved batch #SP-884 HDPE raw material requisition (4,200 KG)', time: '14 mins ago' },
  { id: 2, company: 'Sudhi Impex', user: 'Meera Nair', action: 'Converted Lot #SI-409 from 500g pouches to 1,850 KG export pallets', time: '42 mins ago' },
  { id: 3, company: 'Vilaano', user: 'Ananya Deshmukh', action: 'Updated Q4 Winter Lookbook SKU pricing matrix & retail stock', time: '1 hour ago' },
  { id: 4, company: 'Swati Enterprise', user: 'Vikram Patel', action: 'Issued Jobwork Challan #JW-312 for CNC precision flange machining', time: '3 hours ago' },
  { id: 5, company: 'Siona Plasto', user: 'Suresh Iyer', action: 'Completed QC melt-flow index test on Extrusion Line-2', time: '4 hours ago' },
];

const INITIAL_MODULES = [
  { id: 'mod-inv', name: 'Automated GST & E-Invoicing', desc: 'Real-time IRN generation and tax ledger sync', enabled: true, scope: 'All Entities' },
  { id: 'mod-bio', name: 'Biometric HRMS Sync', desc: 'Live factory & office attendance webhook bridge', enabled: true, scope: 'Plant & HQ' },
  { id: 'mod-exim', name: 'EXIM Customs Tracker', desc: 'Automated ICEGATE & shipping line container updates', enabled: true, scope: 'Sudhi Impex' },
  { id: 'mod-pos', name: 'Omnichannel POS Bridge', desc: 'Instant retail store inventory & loyalty sync', enabled: true, scope: 'Vilaano' },
  { id: 'mod-audit', name: 'Strict 2FA & IP Whitelisting', desc: 'Enforce hardware/OTP verification for Admin actions', enabled: false, scope: 'Global Security' },
];

// --- Tailored Company-Specific Operational Data ---
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
      tallySync: 'Synced 12 mins ago',
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
      { batchId: 'LOT-SI-511', product: '500g Stand-Up Pouches -> 25KG Master Export Cartons', machine: 'Auto-Packer B2', rawMaterial: 'Bulk Raw Lot #IMP-77 (4,500 KG)', output: '180 Cartons (4,500 KG)', status: 'Running' },
      { batchId: 'LOT-SI-512', product: 'Vacuum-Sealed Grade-A Cashew Kernel 10KG Tins', machine: 'Nitrogen Line 01', rawMaterial: 'Raw W320 Bulk Lot (3,200 KG)', output: '320 Tins (3,200 KG)', status: 'Completed' },
      { batchId: 'LOT-SI-513', product: '1KG Retail Export Pouches (EU Labeling)', machine: 'Form-Fill-Seal 04', rawMaterial: 'Organic Spice Blend Lot #19 (2,000 KG)', output: '1,980 Pouches', status: 'QC Pending' },
    ],
    inventory: [
      { sku: 'SI-IMP-301', name: 'Imported W320 Cashew Bulk (Benin Origin)', category: 'Import Lot', stock: '18,500 KG', minStock: '6,000 KG', qrTag: 'QR-SI-3301', status: 'Optimal' },
      { sku: 'SI-PKG-308', name: '500g Barrier Foil Pouches (Printed)', category: 'Packaging', stock: '4,200 Units', minStock: '10,000 Units', qrTag: 'QR-SI-3308', status: 'Low Stock' },
      { sku: 'SI-FG-315', name: '25KG Export Master Cartons (Palletized)', category: 'Export Ready', stock: '420 Cartons (10,500 KG)', minStock: '150 Cartons', qrTag: 'QR-SI-3315', status: 'Optimal' },
      { sku: 'SI-FG-319', name: '10KG Nitrogen-Flushed Export Tins', category: 'Export Ready', stock: '190 Tins (1,900 KG)', minStock: '250 Tins', qrTag: 'QR-SI-3319', status: 'Low Stock' },
    ],
    sales: [
      { orderId: 'EXP-SI-704', customer: 'EuroFoods GmbH (Rotterdam)', items: '400 Master Cartons (10,000 KG)', invoiceNo: 'EXP/SI/26-27/109', amount: '₹28,90,000', transporter: 'Maersk Line Container #MSKU4419', status: 'Dispatched' },
      { orderId: 'DOM-SI-708', customer: 'Metro Cash & Carry India', items: '2,400 x 500g Retail Packs (1,200 KG)', invoiceNo: 'GST/SI/26-27/418', amount: '₹7,80,000', transporter: 'BlueDart Surface (MH-43-BX-1102)', status: 'Ready to Dispatch' },
      { orderId: 'EXP-SI-710', customer: 'Al-Maya Trading Dubai', items: '350 Tins Export Grade (3,500 KG)', invoiceNo: 'Proforma #EXP-88', amount: '₹14,20,000', transporter: 'JNPT Customs Stuffing', status: 'Processing' },
    ],
    accounts: {
      receivables: '₹64,10,000',
      payables: '₹31,20,000',
      gstR1Status: 'LUT Export Filed',
      gstR3bLiability: '₹1,84,200',
      tallySync: 'Synced 5 mins ago',
      ledgers: [
        { party: 'JNPT Customs & Clearing Agent', type: 'Freight Bill', ref: 'CHA-8821', amount: '₹2,45,000', due: 'Nov 26, 2026', status: 'Due Soon' },
        { party: 'EuroFoods GmbH (LC Realization)', type: 'Export Receivable', ref: 'EXP/SI/26-27/109', amount: '₹28,90,000', due: 'Dec 08, 2026', status: 'On Track' },
        { party: 'West Africa Agro Exports', type: 'Import LC', ref: 'IMP-LC-402', amount: '₹19,80,000', due: 'Dec 15, 2026', status: 'Scheduled' },
      ],
    },
  },
  'Swati Enterprise': {
    metrics: { orders: '56 Challans', output: '3,420 Jobwork Units', inventoryValue: '₹52.90 L', pendingDispatches: 8 },
    production: [
      { batchId: 'JW-SE-601', product: 'CNC Machined SS-304 Hydraulic Flanges', machine: 'Vendor: Apex Precision Works', rawMaterial: 'SS-304 Round Bars (1,400 KG)', output: '680 Flanges', status: 'Running' },
      { batchId: 'JW-SE-602', product: 'Hot-Dip Galvanized Cable Trays 300mm', machine: 'Vendor: Mahavir Galva Coat', rawMaterial: 'MS Perforated Sheets (2,200 KG)', output: '440 Trays', status: 'Completed' },
      { batchId: 'JW-SE-603', product: 'Industrial Rubber Expansion Joints', machine: 'In-House Assembly Bay', rawMaterial: 'EPDM Rings + Steel Rings (450 Sets)', output: '310 Units', status: 'QC Pending' },
    ],
    inventory: [
      { sku: 'SE-IND-401', name: 'SS-304 Seamless Pipes 2-Inch Schedule 40', category: 'Industrial Supply', stock: '1,840 Meters', minStock: '600 Meters', qrTag: 'QR-SE-5501', status: 'Optimal' },
      { sku: 'SE-IND-406', name: 'SKF Heavy Duty Spherical Roller Bearings', category: 'Hardware', stock: '85 Units', minStock: '120 Units', qrTag: 'QR-SE-5506', status: 'Low Stock' },
      { sku: 'SE-JW-412', name: 'Galvanized Cable Trays (Jobwork Finished)', category: 'Finished Goods', stock: '620 Units', minStock: '200 Units', qrTag: 'QR-SE-5512', status: 'Optimal' },
      { sku: 'SE-IND-418', name: 'High-Tensile M16 Hex Bolts (Box of 100)', category: 'Fasteners', stock: '140 Boxes', minStock: '200 Boxes', qrTag: 'QR-SE-5518', status: 'Low Stock' },
    ],
    sales: [
      { orderId: 'SO-SE-912', customer: 'Larsen & Toubro EPC Site', items: '400 Galvanized Cable Trays + Fasteners', invoiceNo: 'GST/SE/26-27/610', amount: '₹8,75,000', transporter: 'Gati KWE (GJ-01-XX-7741)', status: 'Dispatched' },
      { orderId: 'SO-SE-915', customer: 'Torrent Power Substation', items: '350 SS-304 Hydraulic Flanges', invoiceNo: 'GST/SE/26-27/614', amount: '₹5,40,000', transporter: 'Safexpress (Loading)', status: 'Ready to Dispatch' },
      { orderId: 'SO-SE-918', customer: 'Adani Infra Mundra', items: '1,200m Seamless Pipes', invoiceNo: 'Proforma #SE-301', amount: '₹9,60,000', transporter: 'E-Way Bill Pending', status: 'Processing' },
    ],
    accounts: {
      receivables: '₹38,50,000',
      payables: '₹16,90,000',
      gstR1Status: 'Filed (Oct 2026)',
      gstR3bLiability: '₹3,28,900',
      tallySync: 'Synced 28 mins ago',
      ledgers: [
        { party: 'Apex Precision Works (Jobwork)', type: 'Jobwork Bill', ref: 'JW-BILL-118', amount: '₹2,15,000', due: 'Nov 28, 2026', status: 'Due Soon' },
        { party: 'Larsen & Toubro EPC Site', type: 'Receivable', ref: 'GST/SE/26-27/610', amount: '₹8,75,000', due: 'Dec 18, 2026', status: 'On Track' },
        { party: 'Jindal Stainless Stockyard', type: 'Vendor Bill', ref: 'JSL-77412', amount: '₹7,40,000', due: 'Dec 04, 2026', status: 'Approved' },
      ],
    },
  },
  'Vilaano': {
    metrics: { orders: '138 Retail Orders', output: '4,850 Apparel/SKU Units', inventoryValue: '₹94.20 L', pendingDispatches: 11 },
    production: [
      { batchId: 'COL-VL-201', product: 'Winter Merino Knitwear & Structured Blazers', machine: 'Atelier Unit 01', rawMaterial: 'Italian Merino Wool & Viscose (1,200m)', output: '840 Garments', status: 'Running' },
      { batchId: 'COL-VL-202', product: 'Handcrafted Full-Grain Leather Totes', machine: 'Leathercraft Studio', rawMaterial: 'Nappa Leather Hides (420 Sq.ft)', output: '310 Bags', status: 'Completed' },
      { batchId: 'COL-VL-203', product: 'Signature Oud & Cedarwood Eau de Parfum 100ml', machine: 'Bottling Partner #02', rawMaterial: 'Fragrance Concentrate + Glass Flacons', output: '1,500 Bottles', status: 'QC Pending' },
    ],
    inventory: [
      { sku: 'VL-APP-801', name: 'Vilaano Cashmere-Blend Overcoat (Charcoal)', category: 'Winter Apparel', stock: '480 Units', minStock: '150 Units', qrTag: 'QR-VL-9101', status: 'Optimal' },
      { sku: 'VL-ACC-805', name: 'Monogram Leather Weekender Bag (Tan)', category: 'Accessories', stock: '42 Units', minStock: '80 Units', qrTag: 'QR-VL-9105', status: 'Low Stock' },
      { sku: 'VL-FRG-810', name: 'Noir Oud Eau de Parfum 100ml', category: 'Fragrance', stock: '1,120 Units', minStock: '300 Units', qrTag: 'QR-VL-9110', status: 'Optimal' },
      { sku: 'VL-PKG-814', name: 'Magnetic Luxury Rigid Gift Boxes', category: 'Retail Packaging', stock: '290 Units', minStock: '500 Units', qrTag: 'QR-VL-9114', status: 'Low Stock' },
    ],
    sales: [
      { orderId: 'RET-VL-1201', customer: 'Palladium Flagship Store (Mumbai)', items: '420 Winter Collection SKUs', invoiceNo: 'GST/VL/26-27/904', amount: '₹16,80,000', transporter: 'Delhivery Express Air', status: 'Dispatched' },
      { orderId: 'RET-VL-1204', customer: 'DLF Emporio Boutique (New Delhi)', items: '280 Leather Totes & Fragrances', invoiceNo: 'GST/VL/26-27/909', amount: '₹11,45,000', transporter: 'BlueDart Air Priority', status: 'Ready to Dispatch' },
      { orderId: 'D2C-VL-1209', customer: 'Omnichannel D2C Regional Hub (Bengaluru)', items: '650 Assorted Holiday Gift Sets', invoiceNo: 'Proforma #VL-512', amount: '₹14,90,000', transporter: 'Manifesting Labels', status: 'Processing' },
    ],
    accounts: {
      receivables: '₹29,60,000',
      payables: '₹11,80,000',
      gstR1Status: 'Filed (Oct 2026)',
      gstR3bLiability: '₹5,42,100',
      tallySync: 'Synced 9 mins ago',
      ledgers: [
        { party: 'DLF Emporio Retail Settlement', type: 'Store Receivable', ref: 'GST/VL/26-27/909', amount: '₹11,45,000', due: 'Dec 05, 2026', status: 'On Track' },
        { party: 'Como Tessuti Fabrics Pvt Ltd.', type: 'Vendor Bill', ref: 'CTF-3310', amount: '₹6,20,000', due: 'Nov 29, 2026', status: 'Due Soon' },
        { party: 'Razorpay / POS Settlement Pool', type: 'D2C Clearing', ref: 'POS-NOV-W4', amount: '₹8,90,000', due: 'Nov 25, 2026', status: 'Settling' },
      ],
    },
  },
};

// --- Helper Badge Styling ---
const getCompanyBadgeStyle = (companyName) => {
  switch (companyName) {
    case 'Siona Plasto':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'Sudhi Impex':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'Swati Enterprise':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'Vilaano':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    default:
      return 'bg-indigo-50 text-indigo-700 border-indigo-200';
  }
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

export default function App() {
  // Navigation & Global Filter State
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false);

  // Domain Data State
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [employees] = useState(INITIAL_EMPLOYEES);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [roles, setRoles] = useState(INITIAL_ROLES);
  const [rightsMatrix, setRightsMatrix] = useState(INITIAL_RIGHTS_MATRIX);
  const [modules, setModules] = useState(INITIAL_MODULES);

  // View-Specific Filter & Modal States
  const [taskStatusFilter, setTaskStatusFilter] = useState('All');
  const [taskCompanyPillFilter, setTaskCompanyPillFilter] = useState('All');
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    company: 'Siona Plasto',
    assignee: '',
    priority: 'Medium',
    dueDate: '2026-12-05',
  });

  const [hrSearch, setHrSearch] = useState('');
  const [hrStatusFilter, setHrStatusFilter] = useState('All');
  const [inventorySearch, setInventorySearch] = useState('');

  // User Management Add User Modal/Drawer State
  const [userSearch, setUserSearch] = useState('');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'Operations Manager',
    companies: ['Siona Plasto'],
    active: true,
  });

  // Role Management Create/Edit State
  const [isRoleFormOpen, setIsRoleFormOpen] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState(null);
  const [roleForm, setRoleForm] = useState({
    name: '',
    description: '',
    scope: 'Assigned Subsidiaries',
    level: 'L3 • Operations',
  });

  // Rights Matrix Selected Role Filter
  const [selectedRightsRole, setSelectedRightsRole] = useState('All');

  // Toast Notification State
  const [toast, setToast] = useState(null);
  const dropdownRef = useRef(null);

  const isGlobalMode = selectedCompany === 'All';

  // Dynamically determine which navigation items appear in the sidebar
  const visibleNavItems = useMemo(() => {
    return isGlobalMode ? GLOBAL_NAV_ITEMS : COMPANY_NAV_ITEMS;
  }, [isGlobalMode]);

  // Smooth Auto-Fallback whenever selectedCompany changes and activeNav is invalid for that mode
  useEffect(() => {
    const validIds = visibleNavItems.map((item) => item.id);
    if (!validIds.includes(activeNav)) {
      setActiveNav('Dashboard');
    }
  }, [selectedCompany, visibleNavItems, activeNav]);

  // Close company dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setCompanyDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const triggerToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3200);
  };

  // --- Filtered Datasets ---
  const companyScopedTasks = useMemo(() => {
    return isGlobalMode ? tasks : tasks.filter((t) => t.company === selectedCompany);
  }, [tasks, selectedCompany, isGlobalMode]);

  const filteredTasks = useMemo(() => {
    return companyScopedTasks.filter((t) => {
      const matchesStatus = taskStatusFilter === 'All' || t.status === taskStatusFilter;
      const matchesPill =
        !isGlobalMode || taskCompanyPillFilter === 'All' || t.company === taskCompanyPillFilter;
      return matchesStatus && matchesPill;
    });
  }, [companyScopedTasks, taskStatusFilter, isGlobalMode, taskCompanyPillFilter]);

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesStatus = hrStatusFilter === 'All' || emp.status === hrStatusFilter;
      const matchesQuery =
        emp.name.toLowerCase().includes(hrSearch.toLowerCase()) ||
        emp.role.toLowerCase().includes(hrSearch.toLowerCase()) ||
        emp.department.toLowerCase().includes(hrSearch.toLowerCase());
      return matchesStatus && matchesQuery;
    });
  }, [employees, hrStatusFilter, hrSearch]);

  const filteredActivity = useMemo(() => {
    if (isGlobalMode) return INITIAL_ACTIVITY;
    return INITIAL_ACTIVITY.filter((a) => a.company === selectedCompany);
  }, [selectedCompany, isGlobalMode]);

  // --- Global Mode KPI Calculations ---
  const globalKpiStats = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
    const pendingApprovals = tasks.filter((t) => t.status === 'Pending').length;
    const activeEmployees = employees.filter((e) => e.status === 'Present').length;
    const totalEmployees = employees.length;

    return {
      totalTasks,
      completedTasks,
      pendingApprovals,
      activeEmployees,
      totalEmployees,
      efficiency: 94,
    };
  }, [tasks, employees]);

  // Active company operational dataset (when a specific company is selected)
  const activeCompanyOps = !isGlobalMode ? COMPANY_OPERATIONS_DATA[selectedCompany] : null;

  const filteredCompanyInventory = useMemo(() => {
    if (!activeCompanyOps) return [];
    return activeCompanyOps.inventory.filter(
      (item) =>
        item.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
        item.sku.toLowerCase().includes(inventorySearch.toLowerCase()) ||
        item.category.toLowerCase().includes(inventorySearch.toLowerCase()) ||
        item.qrTag.toLowerCase().includes(inventorySearch.toLowerCase())
    );
  }, [activeCompanyOps, inventorySearch]);

  // --- Handlers ---
  const handleSelectCompany = (companyId) => {
    setSelectedCompany(companyId);
    setCompanyDropdownOpen(false);
    setInventorySearch('');
    setTaskStatusFilter('All');
    setTaskCompanyPillFilter('All');
    if (companyId !== 'All') {
      setNewTask((prev) => ({ ...prev, company: companyId }));
    }
    triggerToast(
      companyId === 'All'
        ? 'Switched to All Companies (Central Group Admin)'
        : `Entered ${companyId} Operational Workspace`
    );
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTask.title.trim() || !newTask.assignee.trim()) return;
    const targetCompany = !isGlobalMode ? selectedCompany : newTask.company;
    const created = {
      id: `TSK-${1050 + tasks.length}`,
      title: newTask.title.trim(),
      company: targetCompany,
      assignee: newTask.assignee.trim(),
      priority: newTask.priority,
      status: 'Pending',
      dueDate: newTask.dueDate,
    };
    setTasks([created, ...tasks]);
    setNewTask({
      title: '',
      company: !isGlobalMode ? selectedCompany : 'Siona Plasto',
      assignee: '',
      priority: 'Medium',
      dueDate: '2026-12-05',
    });
    setIsAddTaskOpen(false);
    triggerToast(`Task ${created.id} added to ${created.company}`);
  };

  const handleCycleTaskStatus = (taskId) => {
    const order = ['Pending', 'In Progress', 'Completed'];
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const nextStatus = order[(order.indexOf(t.status) + 1) % order.length];
        triggerToast(`${t.id} updated to ${nextStatus}`);
        return { ...t, status: nextStatus };
      })
    );
  };

  const handleToggleUserStatus = (userId) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== userId) return u;
        const nextActive = !u.active;
        triggerToast(`${u.name}'s account is now ${nextActive ? 'Active' : 'Suspended'}`);
        return { ...u, active: nextActive };
      })
    );
  };

  const handleToggleModule = (modId) => {
    setModules((prev) =>
      prev.map((m) => {
        if (m.id !== modId) return m;
        const nextState = !m.enabled;
        triggerToast(`${m.name} ${nextState ? 'enabled' : 'disabled'}`);
        return { ...m, enabled: nextState };
      })
    );
  };

  // --- User Creation & Company Access Handlers ---
  const handleToggleNewUserCompany = (compName) => {
    setNewUser((prev) => {
      const exists = prev.companies.includes(compName);
      const updated = exists
        ? prev.companies.filter((c) => c !== compName)
        : [...prev.companies, compName];
      return { ...prev, companies: updated };
    });
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUser.name.trim() || !newUser.email.trim()) return;
    const assignedCompanies =
      newUser.companies.length > 0 ? newUser.companies : ['Siona Plasto'];
    const createdUser = {
      id: `USR-0${users.length + 1}`,
      name: newUser.name.trim(),
      email: newUser.email.trim(),
      role: newUser.role,
      companies: assignedCompanies,
      active: newUser.active,
      lastLogin: 'Just now (Invited)',
    };
    setUsers([createdUser, ...users]);
    setNewUser({
      name: '',
      email: '',
      role: roles[1]?.name || 'Operations Manager',
      companies: ['Siona Plasto'],
      active: true,
    });
    setIsAddUserOpen(false);
    triggerToast(`User ${createdUser.name} created with ${createdUser.role} access`);
  };

  // --- Role Create / Edit Handlers ---
  const openCreateRoleModal = () => {
    setEditingRoleId(null);
    setRoleForm({
      name: '',
      description: '',
      scope: 'Assigned Subsidiaries',
      level: 'L3 • Operations',
    });
    setIsRoleFormOpen(true);
  };

  const openEditRoleModal = (roleObj) => {
    setEditingRoleId(roleObj.id);
    setRoleForm({
      name: roleObj.name,
      description: roleObj.description,
      scope: roleObj.scope,
      level: roleObj.level,
    });
    setIsRoleFormOpen(true);
  };

  const handleSaveRole = (e) => {
    e.preventDefault();
    if (!roleForm.name.trim()) return;

    if (editingRoleId) {
      const oldRole = roles.find((r) => r.id === editingRoleId);
      const trimmedName = roleForm.name.trim();
      setRoles((prev) =>
        prev.map((r) =>
          r.id === editingRoleId
            ? {
                ...r,
                name: trimmedName,
                description: roleForm.description.trim(),
                scope: roleForm.scope,
                level: roleForm.level,
              }
            : r
        )
      );
      if (oldRole && oldRole.name !== trimmedName) {
        setUsers((prev) =>
          prev.map((u) => (u.role === oldRole.name ? { ...u, role: trimmedName } : u))
        );
        setRightsMatrix((prev) => {
          const copy = { ...prev };
          copy[trimmedName] = copy[oldRole.name] || {
            Dashboard: true,
            Task: true,
            Production: false,
            Inventory: false,
            Sales: false,
            Accounts: false,
            HRMS: false,
            UserManagement: false,
          };
          delete copy[oldRole.name];
          return copy;
        });
      }
      triggerToast(`Updated role "${trimmedName}"`);
    } else {
      const trimmedName = roleForm.name.trim();
      const newRoleObj = {
        id: `ROL-0${roles.length + 1}`,
        name: trimmedName,
        description:
          roleForm.description.trim() ||
          'Custom organizational role with tailored module permissions.',
        scope: roleForm.scope,
        level: roleForm.level,
      };
      setRoles([...roles, newRoleObj]);
      setRightsMatrix((prev) => ({
        ...prev,
        [trimmedName]: {
          Dashboard: true,
          Task: true,
          Production: false,
          Inventory: false,
          Sales: false,
          Accounts: false,
          HRMS: false,
          UserManagement: false,
        },
      }));
      triggerToast(`Created new role "${trimmedName}"`);
    }

    setIsRoleFormOpen(false);
    setEditingRoleId(null);
  };

  // --- Rights Matrix Toggle Handler ---
  const handleToggleRight = (roleName, moduleKey) => {
    setRightsMatrix((prev) => {
      const rolePerms = prev[roleName] || {};
      const nextVal = !rolePerms[moduleKey];
      triggerToast(
        `${roleName}: ${moduleKey} access ${nextVal ? 'granted' : 'revoked'}`
      );
      return {
        ...prev,
        [roleName]: {
          ...rolePerms,
          [moduleKey]: nextVal,
        },
      };
    });
  };

  const filteredUsers = useMemo(() => {
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.role.toLowerCase().includes(userSearch.toLowerCase())
    );
  }, [users, userSearch]);

  const currentCompanyObj = COMPANIES.find((c) => c.id === selectedCompany) || COMPANIES[0];
  const currentNavObj =
    visibleNavItems.find((n) => n.id === activeNav) || visibleNavItems[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col lg:flex-row font-sans antialiased">
      {/* Toast Notification Banner */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 bg-slate-900 text-white text-sm font-medium px-4 py-3 rounded-xl shadow-lg border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Mobile Sidebar Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* ================= LEFT SIDEBAR ================= */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-68 bg-slate-900 text-slate-200 flex flex-col justify-between transition-transform duration-200 ease-out border-r border-slate-800 shrink-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center shadow-inner shadow-indigo-400/30">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-base font-bold tracking-tight text-white block leading-none">
                  ERP Hub
                </span>
                <span className="text-[11px] font-medium text-slate-400 tracking-wider uppercase mt-1 block">
                  {isGlobalMode ? 'Group Admin View' : 'Entity Operations'}
                </span>
              </div>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Active Mode / Workspace Indicator Pill */}
          <div className="px-4 pt-4 pb-2 space-y-2">
            <div className="px-3 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/70">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`w-2.5 h-2.5 rounded-full shrink-0 ${getCompanyDotColor(
                      selectedCompany
                    )}`}
                  />
                  <span className="text-xs font-bold text-white truncate">
                    {isGlobalMode ? 'All Companies (Central)' : `${selectedCompany} Workspace`}
                  </span>
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-700 text-slate-300 shrink-0">
                  {currentCompanyObj.short}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 truncate">
                {isGlobalMode
                  ? 'Group Administration & Governance'
                  : `${currentCompanyObj.sector} • ${currentCompanyObj.location}`}
              </p>
            </div>

            {/* Quick Return Button when inside a Specific Company */}
            {!isGlobalMode && (
              <button
                type="button"
                onClick={() => handleSelectCompany('All')}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-300 hover:text-white bg-indigo-950/60 hover:bg-indigo-600/30 border border-indigo-500/30 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to All Companies
              </button>
            )}
          </div>

          {/* Conditional Navigation Menu */}
          <nav className="px-3 py-3 space-y-1" aria-label="Main Navigation">
            <div className="px-3 pb-1.5 flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                {isGlobalMode ? 'Central Admin Modules' : `${selectedCompany} Modules`}
              </span>
            </div>

            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveNav(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-950/50'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      className={`w-4.5 h-4.5 shrink-0 ${
                        isActive ? 'text-white' : 'text-slate-400'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.id === 'Task' && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold shrink-0 ${
                        isActive ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {companyScopedTasks.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Profile */}
        <div className="p-4 border-t border-slate-800/80">
          <div className="flex items-center gap-3 px-2 py-1.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-emerald-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
              AM
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">Aarav Mehta</p>
              <p className="text-[11px] text-slate-400 truncate">
                {isGlobalMode ? 'Group Super Admin' : `${selectedCompany} Lead`}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* ================= MAIN CONTENT SHELL ================= */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOP HEADER BAR */}
        <header className="sticky top-0 z-20 h-16 bg-white/95 backdrop-blur-xs border-b border-slate-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Left: Mobile Trigger & Active Page Title */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2.5">
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight truncate">
                  {currentNavObj.label}
                </h1>
                <span
                  className={`hidden sm:inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full border ${getCompanyBadgeStyle(
                    selectedCompany
                  )}`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${getCompanyDotColor(selectedCompany)}`}
                  />
                  {isGlobalMode ? 'All Companies • Group Admin' : `${selectedCompany} Workspace`}
                </span>
              </div>
              <p className="hidden md:block text-xs text-slate-500 truncate">
                {currentNavObj.description}
              </p>
            </div>
          </div>

          {/* Right: Company Change Dropdown Selector */}
          <div className="flex items-center gap-3 shrink-0" ref={dropdownRef}>
            <div className="relative">
              <button
                type="button"
                onClick={() => setCompanyDropdownOpen((o) => !o)}
                className="flex items-center gap-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 px-3.5 py-2 rounded-xl text-sm font-medium shadow-2xs transition-all cursor-pointer"
                aria-expanded={companyDropdownOpen}
                aria-haspopup="listbox"
              >
                <div className="w-6 h-6 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Building2 className="w-3.5 h-3.5" />
                </div>
                <div className="text-left">
                  <span className="hidden sm:block text-[10px] uppercase tracking-wider font-semibold text-slate-400 leading-none">
                    Select Entity
                  </span>
                  <span className="block text-xs sm:text-sm font-semibold text-slate-900 leading-tight mt-0.5">
                    {selectedCompany === 'All' ? 'All' : selectedCompany}
                  </span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-slate-500 transition-transform duration-150 ml-1 ${
                    companyDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {companyDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-76 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 origin-top-right"
                  role="listbox"
                >
                  <div className="px-3.5 py-2 border-b border-slate-100">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Switch Company Workspace
                    </p>
                  </div>
                  <div className="py-1">
                    {COMPANIES.map((comp) => {
                      const isSelected = selectedCompany === comp.id;
                      return (
                        <button
                          key={comp.id}
                          type="button"
                          onClick={() => handleSelectCompany(comp.id)}
                          className={`w-full px-3.5 py-2.5 text-left flex items-center justify-between transition-colors cursor-pointer ${
                            isSelected ? 'bg-indigo-50/80' : 'hover:bg-slate-50'
                          }`}
                          role="option"
                          aria-selected={isSelected}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span
                              className={`w-2.5 h-2.5 rounded-full shrink-0 ${getCompanyDotColor(
                                comp.id
                              )}`}
                            />
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <p
                                  className={`text-sm font-semibold truncate ${
                                    isSelected ? 'text-indigo-700' : 'text-slate-800'
                                  }`}
                                >
                                  {comp.id === 'All' ? 'All' : comp.name}
                                </p>
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 font-medium">
                                  {comp.id === 'All' ? 'Admin' : 'ERP'}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 truncate">
                                {comp.sector} • {comp.location}
                              </p>
                            </div>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-indigo-600 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ================= DYNAMIC VIEW CONTENT ================= */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* =====================================================================
              1A. GLOBAL DASHBOARD VIEW (When "All" is selected)
             ===================================================================== */}
          {activeNav === 'Dashboard' && isGlobalMode && (
            <>
              {/* Group KPI Summary Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
                <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Group Tasks
                    </span>
                    <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <CheckSquare className="w-4.5 h-4.5" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline justify-between">
                    <p className="text-2xl sm:text-3xl font-bold text-slate-900">
                      {globalKpiStats.totalTasks}
                    </p>
                    <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      {globalKpiStats.completedTasks} Done
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs text-slate-500">
                    Consolidated deliverables across all 4 entities
                  </p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Active Workforce
                    </span>
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Users className="w-4.5 h-4.5" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline justify-between">
                    <p className="text-2xl sm:text-3xl font-bold text-slate-900">
                      {globalKpiStats.activeEmployees}
                      <span className="text-base font-medium text-slate-400">
                        /{globalKpiStats.totalEmployees}
                      </span>
                    </p>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      HRMS Synced
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs text-slate-500">
                    Group biometric attendance checked in today
                  </p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Pending Approvals
                    </span>
                    <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                      <Clock className="w-4.5 h-4.5" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline justify-between">
                    <p className="text-2xl sm:text-3xl font-bold text-slate-900">
                      {globalKpiStats.pendingApprovals}
                    </p>
                    <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                      Action Needed
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs text-slate-500">
                    Awaiting central sign-off or compliance review
                  </p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Group Efficiency
                    </span>
                    <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <TrendingUp className="w-4.5 h-4.5" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline justify-between">
                    <p className="text-2xl sm:text-3xl font-bold text-slate-900">
                      {globalKpiStats.efficiency}%
                    </p>
                    <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                      +3.4% MoM
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs text-slate-500">
                    Cross-entity SLA adherence & turnaround index
                  </p>
                </div>
              </div>

              {/* Entity Breakdown Table + Audit Stream */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col">
                  <div className="px-5 py-4 border-b border-slate-100">
                    <h2 className="text-base font-bold text-slate-900">
                      Operating Companies Overview
                    </h2>
                    <p className="text-xs text-slate-500">
                      Select any company below to open its dedicated operational ERP & Task workspace
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                          <th className="py-3 px-5">Company Entity</th>
                          <th className="py-3 px-4">Sector</th>
                          <th className="py-3 px-4 text-center">Tasks</th>
                          <th className="py-3 px-4 text-right">Stock Value</th>
                          <th className="py-3 px-5 text-right">Workspace</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-sm">
                        {COMPANIES.filter((c) => c.id !== 'All').map((comp) => {
                          const compTasks = tasks.filter((t) => t.company === comp.id);
                          const ops = COMPANY_OPERATIONS_DATA[comp.id];

                          return (
                            <tr
                              key={comp.id}
                              onClick={() => handleSelectCompany(comp.id)}
                              className="cursor-pointer hover:bg-indigo-50/50 transition-colors"
                            >
                              <td className="py-3.5 px-5">
                                <div className="flex items-center gap-3">
                                  <span
                                    className={`w-2.5 h-2.5 rounded-full shrink-0 ${getCompanyDotColor(
                                      comp.id
                                    )}`}
                                  />
                                  <div>
                                    <p className="font-semibold text-slate-900">{comp.name}</p>
                                    <p className="text-xs text-slate-500">{comp.location}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3.5 px-4 text-xs text-slate-600 font-medium">
                                {comp.sector}
                              </td>
                              <td className="py-3.5 px-4 text-center">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700">
                                  {compTasks.length} Tasks
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-right font-semibold text-slate-800">
                                {ops.metrics.inventoryValue}
                              </td>
                              <td className="py-3.5 px-5 text-right">
                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700">
                                  Open ERP <ArrowUpRight className="w-3.5 h-3.5" />
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Recent Activity Feed */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-base font-bold text-slate-900">Group Audit Stream</h2>
                      <p className="text-xs text-slate-500">Live cross-company events</p>
                    </div>
                    <Activity className="w-4 h-4 text-slate-400" />
                  </div>

                  <div className="space-y-4 flex-1">
                    {filteredActivity.map((item) => (
                      <div key={item.id} className="flex gap-3 items-start">
                        <div
                          className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${getCompanyDotColor(
                            item.company
                          )}`}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-slate-800 leading-snug">
                            {item.action}
                          </p>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                            <span className="font-semibold text-slate-700">{item.user}</span>
                            <span
                              className={`px-1.5 py-0.2 rounded border text-[10px] font-medium ${getCompanyBadgeStyle(
                                item.company
                              )}`}
                            >
                              {item.company}
                            </span>
                            <span>• {item.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* =====================================================================
              1B. COMPANY-SPECIFIC DASHBOARD VIEW (When a specific company is selected)
             ===================================================================== */}
          {activeNav === 'Dashboard' && !isGlobalMode && activeCompanyOps && (
            <>
              {/* Company Operational KPIs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Active Orders
                    </span>
                    <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Truck className="w-4.5 h-4.5" />
                    </div>
                  </div>
                  <p className="mt-3 text-2xl sm:text-3xl font-bold text-slate-900">
                    {activeCompanyOps.metrics.orders}
                  </p>
                  <p className="mt-1.5 text-xs text-slate-500">
                    {activeCompanyOps.metrics.pendingDispatches} dispatches scheduled today
                  </p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Production / Output
                    </span>
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Factory className="w-4.5 h-4.5" />
                    </div>
                  </div>
                  <p className="mt-3 text-2xl sm:text-3xl font-bold text-slate-900">
                    {activeCompanyOps.metrics.output}
                  </p>
                  <p className="mt-1.5 text-xs text-slate-500">
                    Current shift & active batch throughput
                  </p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Inventory Valuation
                    </span>
                    <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <Package className="w-4.5 h-4.5" />
                    </div>
                  </div>
                  <p className="mt-3 text-2xl sm:text-3xl font-bold text-slate-900">
                    {activeCompanyOps.metrics.inventoryValue}
                  </p>
                  <p className="mt-1.5 text-xs text-slate-500">
                    Raw materials, WIP & QR-tagged stock
                  </p>
                </div>

                <div
                  onClick={() => setActiveNav('Task')}
                  className="bg-white p-5 rounded-xl border border-slate-200 hover:border-indigo-300 shadow-2xs cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      {selectedCompany} Tasks
                    </span>
                    <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                      <CheckSquare className="w-4.5 h-4.5" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline justify-between">
                    <p className="text-2xl sm:text-3xl font-bold text-slate-900">
                      {companyScopedTasks.length}
                    </p>
                    <span className="text-xs font-semibold text-indigo-600 flex items-center gap-0.5">
                      Open Tasks <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs text-slate-500">
                    {companyScopedTasks.filter((t) => t.status !== 'Completed').length} open operational tasks
                  </p>
                </div>
              </div>

              {/* Company Quick Operational Snapshot */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Active Production Batches Snapshot */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-bold text-slate-900">
                        {selectedCompany} — Active Production & Batch Floor
                      </h2>
                      <p className="text-xs text-slate-500">
                        Live batch status, machine allocation & output metrics
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveNav('Production')}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg cursor-pointer"
                    >
                      View Full Floor
                    </button>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {activeCompanyOps.production.map((batch) => (
                      <div
                        key={batch.batchId}
                        className="px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-indigo-600">
                              {batch.batchId}
                            </span>
                            <span className="text-sm font-semibold text-slate-900">
                              {batch.product}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {batch.machine} • Input: {batch.rawMaterial}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md">
                            {batch.output}
                          </span>
                          <span
                            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                              batch.status === 'Running'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : batch.status === 'Completed'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {batch.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Company Assigned Tasks Snapshot */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-base font-bold text-slate-900">Priority Tasks</h2>
                        <p className="text-xs text-slate-500">{selectedCompany} team queue</p>
                      </div>
                      <button
                        onClick={() => setActiveNav('Task')}
                        className="text-xs font-semibold text-indigo-600 hover:underline cursor-pointer"
                      >
                        Manage All
                      </button>
                    </div>
                    <div className="space-y-3">
                      {companyScopedTasks.map((t) => (
                        <div
                          key={t.id}
                          onClick={() => handleCycleTaskStatus(t.id)}
                          className="p-3 rounded-lg bg-slate-50 hover:bg-slate-100/80 border border-slate-200/70 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center justify-between text-[11px] mb-1">
                            <span className="font-mono font-semibold text-indigo-600">{t.id}</span>
                            <span
                              className={`font-semibold px-2 py-0.2 rounded-full ${
                                t.status === 'Completed'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : t.status === 'In Progress'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-amber-100 text-amber-700'
                              }`}
                            >
                              {t.status}
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-slate-800">{t.title}</p>
                          <p className="text-[11px] text-slate-500 mt-1">
                            Assignee: {t.assignee} • Due {t.dueDate}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* =====================================================================
              2. TASK MANAGEMENT VIEW (Works in BOTH "All" Mode and Specific Company Mode)
             ===================================================================== */}
          {activeNav === 'Task' && (
            <div className="space-y-5">
              {/* Toolbar */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Status Filter Pills */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {['All', 'Pending', 'In Progress', 'Completed'].map((status) => {
                      const active = taskStatusFilter === status;
                      return (
                        <button
                          key={status}
                          onClick={() => setTaskStatusFilter(status)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                            active
                              ? 'bg-slate-900 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                          }`}
                        >
                          {status}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setIsAddTaskOpen(true)}
                    className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg shadow-2xs transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    {isGlobalMode ? 'New Group Task' : `Add ${selectedCompany} Task`}
                  </button>
                </div>

                {/* Company Filter Pills (Shown in "All" mode to filter consolidated tasks) */}
                {isGlobalMode && (
                  <div className="pt-2.5 border-t border-slate-100 flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mr-1">
                      Filter Entity:
                    </span>
                    {COMPANIES.map((c) => {
                      const isSelected = taskCompanyPillFilter === c.id;
                      return (
                        <button
                          key={c.id}
                          onClick={() => setTaskCompanyPillFilter(c.id)}
                          className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {c.id === 'All' ? 'All Companies' : c.name}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Add Task Form Card */}
              {isAddTaskOpen && (
                <form
                  onSubmit={handleCreateTask}
                  className="bg-white p-5 rounded-xl border-2 border-indigo-200 shadow-md space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">
                      {isGlobalMode
                        ? 'Assign New Cross-Entity Task'
                        : `New Operational Task for ${selectedCompany}`}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsAddTaskOpen(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Task Deliverable
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., Verify batch dispatch challan & GST E-Way bill"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Company Entity
                      </label>
                      <select
                        value={!isGlobalMode ? selectedCompany : newTask.company}
                        disabled={!isGlobalMode}
                        onChange={(e) => setNewTask({ ...newTask, company: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white disabled:bg-slate-100 disabled:text-slate-600"
                      >
                        {COMPANIES.filter((c) => c.id !== 'All').map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Team Assignee
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Assignee name"
                        value={newTask.assignee}
                        onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <div className="flex items-center gap-3">
                      <select
                        value={newTask.priority}
                        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                        className="px-3 py-1.5 text-xs font-semibold border border-slate-300 rounded-lg bg-white"
                      >
                        <option value="High">High Priority</option>
                        <option value="Medium">Medium Priority</option>
                        <option value="Low">Low Priority</option>
                      </select>
                      <input
                        type="date"
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                        className="px-3 py-1.5 text-xs font-medium border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAddTaskOpen(false)}
                        className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg cursor-pointer"
                      >
                        Create Task
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Task Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        <th className="py-3.5 px-5">Task ID & Deliverable</th>
                        <th className="py-3.5 px-4">Company</th>
                        <th className="py-3.5 px-4">Assignee</th>
                        <th className="py-3.5 px-4">Priority</th>
                        <th className="py-3.5 px-4">Due Date</th>
                        <th className="py-3.5 px-5 text-right">Status (Click to Toggle)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {filteredTasks.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-10 text-center text-sm text-slate-500">
                            No tasks match the selected filter criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredTasks.map((task) => (
                          <tr key={task.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3.5 px-5">
                              <span className="text-[11px] font-mono font-semibold text-indigo-600 block">
                                {task.id}
                              </span>
                              <span className="font-semibold text-slate-900">{task.title}</span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getCompanyBadgeStyle(
                                  task.company
                                )}`}
                              >
                                {task.company}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-slate-700 font-medium">
                              {task.assignee}
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                                  task.priority === 'High'
                                    ? 'bg-rose-50 text-rose-700'
                                    : task.priority === 'Medium'
                                    ? 'bg-amber-50 text-amber-700'
                                    : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {task.priority}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-xs text-slate-500 font-medium">
                              {task.dueDate}
                            </td>
                            <td className="py-3.5 px-5 text-right">
                              <button
                                onClick={() => handleCycleTaskStatus(task.id)}
                                title="Click to cycle status"
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                                  task.status === 'Completed'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                    : task.status === 'In Progress'
                                    ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                                    : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    task.status === 'Completed'
                                      ? 'bg-emerald-500'
                                      : task.status === 'In Progress'
                                      ? 'bg-blue-500'
                                      : 'bg-amber-500'
                                  }`}
                                />
                                {task.status}
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =====================================================================
              3. COMPANY-SPECIFIC: PRODUCTION & JOBWORK VIEW
             ===================================================================== */}
          {activeNav === 'Production' && !isGlobalMode && activeCompanyOps && (
            <div className="space-y-5">
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      {selectedCompany} — Production Batches & Jobwork Tracking
                    </h2>
                    <p className="text-xs text-slate-500">
                      Real-time machine lines, packaging conversions, raw material consumption & vendor jobwork
                    </p>
                  </div>
                  <button
                    onClick={() => triggerToast(`New batch work-order logged for ${selectedCompany}`)}
                    className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Log New Batch
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        <th className="py-3.5 px-5">Batch / Lot ID</th>
                        <th className="py-3.5 px-4">Product / Process</th>
                        <th className="py-3.5 px-4">Line / Jobwork Vendor</th>
                        <th className="py-3.5 px-4">Raw Material Consumed</th>
                        <th className="py-3.5 px-4">Yield / Output</th>
                        <th className="py-3.5 px-5 text-right">Stage Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {activeCompanyOps.production.map((row) => (
                        <tr key={row.batchId} className="hover:bg-slate-50/80">
                          <td className="py-3.5 px-5 font-mono text-xs font-bold text-indigo-600">
                            {row.batchId}
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-slate-900">{row.product}</td>
                          <td className="py-3.5 px-4 text-xs text-slate-600 font-medium">
                            {row.machine}
                          </td>
                          <td className="py-3.5 px-4 text-xs text-slate-600">{row.rawMaterial}</td>
                          <td className="py-3.5 px-4 font-bold text-slate-800">{row.output}</td>
                          <td className="py-3.5 px-5 text-right">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                row.status === 'Running'
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                  : row.status === 'Completed'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}
                            >
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =====================================================================
              4. COMPANY-SPECIFIC: INVENTORY & QR STOCK VIEW
             ===================================================================== */}
          {activeNav === 'Inventory' && !isGlobalMode && activeCompanyOps && (
            <div className="space-y-5">
              {/* Search & Alert Header */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder={`Search ${selectedCompany} SKUs, KG stock, or QR tags...`}
                    value={inventorySearch}
                    onChange={(e) => setInventorySearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 font-semibold border border-amber-200">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    {activeCompanyOps.inventory.filter((i) => i.status === 'Low Stock').length} Low Stock Alerts
                  </span>
                </div>
              </div>

              {/* Inventory Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        <th className="py-3.5 px-5">SKU & Material Description</th>
                        <th className="py-3.5 px-4">Category</th>
                        <th className="py-3.5 px-4">Available Stock (KG/Units)</th>
                        <th className="py-3.5 px-4">Reorder Threshold</th>
                        <th className="py-3.5 px-4">QR Batch Tag</th>
                        <th className="py-3.5 px-5 text-right">Stock Health</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {filteredCompanyInventory.map((item) => (
                        <tr key={item.sku} className="hover:bg-slate-50/80">
                          <td className="py-3.5 px-5">
                            <span className="text-[11px] font-mono font-bold text-indigo-600 block">
                              {item.sku}
                            </span>
                            <span className="font-semibold text-slate-900">{item.name}</span>
                          </td>
                          <td className="py-3.5 px-4 text-xs font-medium text-slate-600">
                            {item.category}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-slate-900">{item.stock}</td>
                          <td className="py-3.5 px-4 text-xs text-slate-500">{item.minStock}</td>
                          <td className="py-3.5 px-4">
                            <button
                              onClick={() => triggerToast(`Generated printable QR label ${item.qrTag}`)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 font-mono text-xs font-semibold transition-colors cursor-pointer"
                            >
                              <QrCode className="w-3.5 h-3.5" />
                              {item.qrTag}
                            </button>
                          </td>
                          <td className="py-3.5 px-5 text-right">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                item.status === 'Optimal'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200'
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =====================================================================
              5. COMPANY-SPECIFIC: SALES & DISPATCH VIEW
             ===================================================================== */}
          {activeNav === 'Sales' && !isGlobalMode && activeCompanyOps && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    {selectedCompany} — Sales Orders, GST Invoices & Logistics Dispatch
                  </h2>
                  <p className="text-xs text-slate-500">
                    Track client orders, e-invoices, vehicle numbers & dispatch readiness
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      <th className="py-3.5 px-5">Order & Customer</th>
                      <th className="py-3.5 px-4">Line Items</th>
                      <th className="py-3.5 px-4">GST Invoice / Ref</th>
                      <th className="py-3.5 px-4">Order Value</th>
                      <th className="py-3.5 px-4">Transporter / Vehicle</th>
                      <th className="py-3.5 px-5 text-right">Dispatch Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {activeCompanyOps.sales.map((ord) => (
                      <tr key={ord.orderId} className="hover:bg-slate-50/80">
                        <td className="py-3.5 px-5">
                          <span className="text-[11px] font-mono font-bold text-indigo-600 block">
                            {ord.orderId}
                          </span>
                          <span className="font-semibold text-slate-900">{ord.customer}</span>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-slate-700 font-medium">
                          {ord.items}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-xs text-slate-600">
                          {ord.invoiceNo}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">{ord.amount}</td>
                        <td className="py-3.5 px-4 text-xs text-slate-600">{ord.transporter}</td>
                        <td className="py-3.5 px-5 text-right">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              ord.status === 'Dispatched'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : ord.status === 'Ready to Dispatch'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {ord.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =====================================================================
              6. COMPANY-SPECIFIC: ACCOUNTS & BILLING VIEW
             ===================================================================== */}
          {activeNav === 'Accounts' && !isGlobalMode && activeCompanyOps && (
            <div className="space-y-5">
              {/* Financial Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <p className="text-xs font-semibold text-slate-500 uppercase">Total Receivables</p>
                  <p className="text-2xl font-bold text-emerald-600 mt-1">
                    {activeCompanyOps.accounts.receivables}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">Client outstanding invoices</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <p className="text-xs font-semibold text-slate-500 uppercase">Vendor Payables</p>
                  <p className="text-2xl font-bold text-rose-600 mt-1">
                    {activeCompanyOps.accounts.payables}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">Raw material & jobwork dues</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <p className="text-xs font-semibold text-slate-500 uppercase">GST R1 / 3B Summary</p>
                  <p className="text-lg font-bold text-slate-900 mt-1">
                    {activeCompanyOps.accounts.gstR3bLiability}
                  </p>
                  <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                    {activeCompanyOps.accounts.gstR1Status}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase">Tally Prime Sync</p>
                    <p className="text-sm font-bold text-indigo-600 mt-1.5">
                      {activeCompanyOps.accounts.tallySync}
                    </p>
                  </div>
                  <button
                    onClick={() => triggerToast(`Tally Prime ledger synced for ${selectedCompany}`)}
                    className="mt-2 inline-flex items-center justify-center gap-1.5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white py-1.5 px-3 rounded-lg cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Sync Tally Now
                  </button>
                </div>
              </div>

              {/* Ledger & Bills Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100">
                  <h2 className="text-base font-bold text-slate-900">
                    {selectedCompany} — Active Ledgers & GST Bills
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        <th className="py-3.5 px-5">Party / Vendor Name</th>
                        <th className="py-3.5 px-4">Voucher Type</th>
                        <th className="py-3.5 px-4">Reference No.</th>
                        <th className="py-3.5 px-4">Amount</th>
                        <th className="py-3.5 px-4">Due Date</th>
                        <th className="py-3.5 px-5 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {activeCompanyOps.accounts.ledgers.map((item) => (
                        <tr key={item.ref} className="hover:bg-slate-50/80">
                          <td className="py-3.5 px-5 font-semibold text-slate-900">{item.party}</td>
                          <td className="py-3.5 px-4 text-xs text-slate-600">{item.type}</td>
                          <td className="py-3.5 px-4 font-mono text-xs text-indigo-600 font-semibold">
                            {item.ref}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-slate-900">{item.amount}</td>
                          <td className="py-3.5 px-4 text-xs text-slate-500">{item.due}</td>
                          <td className="py-3.5 px-5 text-right">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =====================================================================
              7. GLOBAL ONLY: HRMS VIEW (Only visible when "All" is selected)
             ===================================================================== */}
          {activeNav === 'HRMS' && isGlobalMode && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase">Group Headcount</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{employees.length}</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase">Present Today</p>
                    <p className="text-2xl font-bold text-emerald-600 mt-1">
                      {employees.filter((e) => e.status === 'Present').length}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase">On Leave</p>
                    <p className="text-2xl font-bold text-amber-600 mt-1">
                      {employees.filter((e) => e.status === 'On Leave').length}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Calendar className="w-5 h-5" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search employee name, role, or department..."
                    value={hrSearch}
                    onChange={(e) => setHrSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  {['All', 'Present', 'On Leave'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setHrStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        hrStatusFilter === st
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredEmployees.map((emp) => (
                  <div
                    key={emp.id}
                    className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-sm font-bold text-slate-700 shrink-0">
                            {emp.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-slate-900">{emp.name}</h3>
                            <p className="text-xs text-slate-500">{emp.role}</p>
                          </div>
                        </div>
                        <span
                          className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                            emp.status === 'Present'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {emp.status}
                        </span>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Company</span>
                          <span
                            className={`px-2 py-0.5 rounded-full font-medium border ${getCompanyBadgeStyle(
                              emp.company
                            )}`}
                          >
                            {emp.company}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Department</span>
                          <span className="font-semibold text-slate-700">{emp.department}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Shift Timing</span>
                          <span className="text-slate-600">{emp.shift}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =====================================================================
              8. GLOBAL ONLY: USER MANAGEMENT VIEW (Only visible when "All" is selected)
             ===================================================================== */}
          {activeNav === 'User' && isGlobalMode && (
            <div className="space-y-5">
              {/* Top Action Bar */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search users by name, email, or assigned role..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(true)}
                  className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg shadow-2xs transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add User
                </button>
              </div>

              {/* Add User Modal / Inline Card */}
              {isAddUserOpen && (
                <form
                  onSubmit={handleCreateUser}
                  className="bg-white p-5 rounded-xl border-2 border-indigo-200 shadow-md space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Create New ERP User Account
                      </h3>
                      <p className="text-xs text-slate-500">
                        Assign system role, entity permissions, and initial login status
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsAddUserOpen(false)}
                      className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., Neha Kulkarni"
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Work Email
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="neha@sionaplasto.in"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Assigned Role
                      </label>
                      <select
                        value={newUser.role}
                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      >
                        {roles.map((r) => (
                          <option key={r.id} value={r.name}>
                            {r.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Account Status
                      </label>
                      <select
                        value={newUser.active ? 'Active' : 'Suspended'}
                        onChange={(e) =>
                          setNewUser({ ...newUser, active: e.target.value === 'Active' })
                        }
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      >
                        <option value="Active">Active (Immediate Access)</option>
                        <option value="Suspended">Suspended (Pending Review)</option>
                      </select>
                    </div>
                  </div>

                  {/* Multi-Company Checkbox Assignment */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">
                      Permitted Company Workspaces
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {COMPANIES.filter((c) => c.id !== 'All').map((comp) => {
                        const checked = newUser.companies.includes(comp.id);
                        return (
                          <button
                            key={comp.id}
                            type="button"
                            onClick={() => handleToggleNewUserCompany(comp.id)}
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                              checked
                                ? 'bg-indigo-50 text-indigo-700 border-indigo-300 shadow-2xs'
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            <span
                              className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                                checked
                                  ? 'bg-indigo-600 border-indigo-600 text-white'
                                  : 'border-slate-300 bg-white'
                              }`}
                            >
                              {checked && <Check className="w-2.5 h-2.5" />}
                            </span>
                            {comp.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsAddUserOpen(false)}
                      className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg cursor-pointer"
                    >
                      Save & Create User
                    </button>
                  </div>
                </form>
              )}

              {/* Users Directory Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      Central User Accounts & Multi-Entity Access
                    </h2>
                    <p className="text-xs text-slate-500">
                      Showing {filteredUsers.length} registered ERP users across group entities
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        <th className="py-3.5 px-5">User Account</th>
                        <th className="py-3.5 px-4">System Role</th>
                        <th className="py-3.5 px-4">Permitted Entities</th>
                        <th className="py-3.5 px-4">Last Active</th>
                        <th className="py-3.5 px-5 text-right">Account Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-5">
                            <p className="font-semibold text-slate-900">{user.name}</p>
                            <p className="text-xs text-slate-500">{user.email}</p>
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold ${
                                user.role === 'Super Admin'
                                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                  : 'bg-slate-100 text-slate-800'
                              }`}
                            >
                              <Shield className="w-3 h-3" />
                              {user.role}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex flex-wrap gap-1.5">
                              {user.companies.map((c) => (
                                <span
                                  key={c}
                                  className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${getCompanyBadgeStyle(
                                    c
                                  )}`}
                                >
                                  {c}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-xs text-slate-500">{user.lastLogin}</td>
                          <td className="py-3.5 px-5 text-right">
                            <button
                              onClick={() => handleToggleUserStatus(user.id)}
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                                user.active
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                              }`}
                            >
                              {user.active ? (
                                <>
                                  <Unlock className="w-3 h-3" /> Active
                                </>
                              ) : (
                                <>
                                  <Lock className="w-3 h-3" /> Suspended
                                </>
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =====================================================================
              9. GLOBAL ONLY: ROLE MANAGEMENT VIEW (Only visible when "All" is selected)
             ===================================================================== */}
          {activeNav === 'Role' && isGlobalMode && (
            <div className="space-y-5">
              {/* Header Bar */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Organizational Roles & Access Scopes
                  </h2>
                  <p className="text-xs text-slate-500">
                    Define role hierarchies and map them to module permissions in the Rights tab
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openCreateRoleModal}
                  className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg shadow-2xs transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Create Role
                </button>
              </div>

              {/* Create / Edit Role Form */}
              {isRoleFormOpen && (
                <form
                  onSubmit={handleSaveRole}
                  className="bg-white p-5 rounded-xl border-2 border-indigo-200 shadow-md space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-bold text-slate-900">
                      {editingRoleId ? 'Edit Organizational Role' : 'Create New Organizational Role'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsRoleFormOpen(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Role Title
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., Quality Control Auditor"
                        value={roleForm.name}
                        onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Entity Scope
                      </label>
                      <select
                        value={roleForm.scope}
                        onChange={(e) => setRoleForm({ ...roleForm, scope: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
                      >
                        <option value="All Companies (Group Wide)">All Companies (Group Wide)</option>
                        <option value="Assigned Subsidiaries">Assigned Subsidiaries</option>
                        <option value="Plant / Unit Level">Plant / Unit Level</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Hierarchy Tier
                      </label>
                      <select
                        value={roleForm.level}
                        onChange={(e) => setRoleForm({ ...roleForm, level: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
                      >
                        <option value="L1 • Executive">L1 • Executive</option>
                        <option value="L2 • Management">L2 • Management</option>
                        <option value="L3 • Operations">L3 • Operations</option>
                        <option value="L3 • Finance">L3 • Finance</option>
                        <option value="L3 • Commercial">L3 • Commercial</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Role Responsibilities & Description
                    </label>
                    <input
                      type="text"
                      placeholder="Summarize operational authority and module responsibilities..."
                      value={roleForm.description}
                      onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsRoleFormOpen(false)}
                      className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg cursor-pointer"
                    >
                      {editingRoleId ? 'Save Changes' : 'Create Role'}
                    </button>
                  </div>
                </form>
              )}

              {/* Role Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {roles.map((role) => {
                  const assignedUserCount = users.filter((u) => u.role === role.name).length;
                  const activePermissionsCount = Object.values(
                    rightsMatrix[role.name] || {}
                  ).filter(Boolean).length;

                  return (
                    <div
                      key={role.id}
                      className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between space-y-4"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600">
                              {role.level}
                            </span>
                            <h3 className="text-base font-bold text-slate-900 mt-0.5">
                              {role.name}
                            </h3>
                          </div>
                          <button
                            type="button"
                            onClick={() => openEditRoleModal(role)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit Role"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        </div>

                        <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                          {role.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 space-y-2.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Assigned Scope</span>
                          <span className="font-semibold text-slate-700">{role.scope}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Active Users</span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full font-semibold bg-slate-100 text-slate-800">
                            {assignedUserCount} {assignedUserCount === 1 ? 'User' : 'Users'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Module Rights</span>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedRightsRole(role.name);
                              setActiveNav('Rights');
                            }}
                            className="font-semibold text-indigo-600 hover:underline cursor-pointer"
                          >
                            {activePermissionsCount} / {RIGHTS_MODULES.length} Modules →
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* =====================================================================
              10. GLOBAL ONLY: RIGHTS PERMISSION MATRIX VIEW (Only visible when "All" is selected)
             ===================================================================== */}
          {activeNav === 'Rights' && isGlobalMode && (
            <div className="space-y-5">
              {/* Role Filter Strip */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Role-Based Module Rights Matrix
                  </h2>
                  <p className="text-xs text-slate-500">
                    Toggle module access checkboxes per role across the entire ERP ecosystem
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedRightsRole('All')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      selectedRightsRole === 'All'
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    All Roles
                  </button>
                  {roles.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setSelectedRightsRole(r.name)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        selectedRightsRole === r.name
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {r.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interactive Permission Matrix Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        <th className="py-3.5 px-5 min-w-44">Role Name</th>
                        {RIGHTS_MODULES.map((mod) => (
                          <th key={mod.id} className="py-3.5 px-3 text-center">
                            {mod.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {roles
                        .filter(
                          (r) =>
                            selectedRightsRole === 'All' || r.name === selectedRightsRole
                        )
                        .map((role) => {
                          const rolePerms = rightsMatrix[role.name] || {};
                          return (
                            <tr
                              key={role.id}
                              className="hover:bg-slate-50/80 transition-colors"
                            >
                              <td className="py-3.5 px-5">
                                <p className="font-bold text-slate-900">{role.name}</p>
                                <p className="text-[11px] text-slate-500">{role.scope}</p>
                              </td>
                              {RIGHTS_MODULES.map((mod) => {
                                const isAllowed = Boolean(rolePerms[mod.id]);
                                return (
                                  <td key={mod.id} className="py-3.5 px-3 text-center">
                                    <button
                                      type="button"
                                      role="checkbox"
                                      aria-checked={isAllowed}
                                      aria-label={`Toggle ${mod.label} permission for ${role.name}`}
                                      onClick={() => handleToggleRight(role.name, mod.id)}
                                      className={`w-6 h-6 rounded-md inline-flex items-center justify-center border transition-all cursor-pointer ${
                                        isAllowed
                                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-2xs hover:bg-indigo-700'
                                          : 'bg-white border-slate-300 text-transparent hover:border-indigo-400'
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
            </div>
          )}

          {/* =====================================================================
              11. GLOBAL ONLY: CONTROL VIEW (Only visible when "All" is selected)
             ===================================================================== */}
          {activeNav === 'Control' && isGlobalMode && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-base font-bold text-slate-900">
                    Central ERP Module & Governance Controls
                  </h2>
                  <p className="text-xs text-slate-500">
                    Manage global ERP connectors, GST compliance webhooks, and group security policies
                  </p>
                </div>

                <div className="divide-y divide-slate-100">
                  {modules.map((mod) => (
                    <div
                      key={mod.id}
                      className="py-3.5 first:pt-1 last:pb-1 flex items-center justify-between gap-4"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-slate-900">{mod.name}</p>
                          <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                            {mod.scope}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{mod.desc}</p>
                      </div>

                      <button
                        type="button"
                        role="switch"
                        aria-checked={mod.enabled}
                        onClick={() => handleToggleModule(mod.id)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          mod.enabled ? 'bg-indigo-600' : 'bg-slate-200'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                            mod.enabled ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 flex flex-col justify-between space-y-5">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h2 className="text-base font-bold text-slate-900">Conglomerate Status</h2>
                    <Settings className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Active Subsidiaries</span>
                      <span className="font-bold text-slate-900">4 Entities</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Central HQ</span>
                      <span className="font-semibold text-slate-800">Mumbai, India</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Fiscal Year</span>
                      <span className="font-semibold text-slate-800">FY 2026–2027</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Database Cluster</span>
                      <span className="font-semibold text-emerald-600">Synced (Live)</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => triggerToast('All 4 subsidiary ERP nodes verified healthy')}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Run Group Diagnostics
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}