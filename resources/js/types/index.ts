// ============================================================
// COMMON TYPES
// ============================================================

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  per_page: number;
  last_page: number;
  total: number;
  from: number;
  to: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status: number;
}

// ============================================================
// USER & AUTHENTICATION TYPES
// ============================================================

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  phone?: string;
  role: UserRole;
  school_id?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  avatar_url?: string;
}

export interface AuthUser extends User {
  permissions: string[];
  roles: UserRole[];
}

export type UserRole = 'super-admin' | 'school-admin' | 'teacher' | 'parent' | 'student';

export interface LoginRequest {
  email: string;
  password: string;
  remember: boolean;
}

export interface RegisterRequest {
  role: UserRole;
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  school_name?: string;
  agree_terms: boolean;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

// ============================================================
// SCHOOL TYPES
// ============================================================

export interface School {
  id: number;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  owner_id: number;
  owner_name?: string;
  owner_email?: string;
  owner_phone?: string;
  logo_path?: string;
  subscription_status: SubscriptionStatus;
  is_active: boolean;
  theme_id?: number;
  students_count?: number;
  created_at: string;
  updated_at: string;
}

export interface SchoolStatistics {
  total_students: number;
  total_parents: number;
  total_assigned: number;
  total_collected: number;
  collection_rate: number;
  overdue_count: number;
  overdue_amount: number;
  active_students: number;
  inactive_students: number;
  recent_students?: any[];
  recent_payments?: any[];
}

export interface SchoolSettings {
  school_motto: string;
  receipt_footer_text: string;
  primary_color: string;
  secondary_color: string;
  enable_parent_portal: boolean;
  enable_student_portal: boolean;
  require_fee_approval: boolean;
  default_payment_method: string;
  max_upload_size: number;
  receipt_prefix: string;
}

export type SubscriptionStatus = 'active' | 'inactive' | 'suspended';

// ============================================================
// STUDENT TYPES
// ============================================================

export interface Student {
  id: number;
  admission_no: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email?: string;
  phone?: string;
  date_of_birth?: string;
  gender?: string;
  school_id: number;
  grade_id: number;
  grade_name?: string;
  class_id?: number;
  class_name?: string;
  parent_id?: number;
  address?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  school?: School;
}

export interface StudentStatistics {
  total_fees: number;
  total_paid: number;
  total_due: number;
  payment_rate: number;
  total_students?: number;
  active_students?: number;
}

export interface StudentFee {
  id: number;
  student_id: number;
  fee_structure_id: number;
  amount_due: number;
  amount_paid: number;
  balance: number;
  fee_name?: string;
  status: FeeStatus;
  due_date?: string;
  is_overdue: boolean;
  created_at: string;
  updated_at: string;
}

export type FeeStatus = 'paid' | 'unpaid' | 'partially_paid' | 'overdue';

// ============================================================
// GRADE TYPES
// ============================================================

export interface Grade {
  id: number;
  school_id: number;
  name: string;
  code: string;
  level?: number;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface GradeStatistics {
  total_students: number;
  active_students: number;
  total_classes: number;
  total_fees_assigned: number;
  total_fees_collected: number;
}

// ============================================================
// TERM TYPES
// ============================================================

export interface Term {
  id: number;
  school_id: number;
  name: string;
  year: number;
  term_number: number;
  start_date: string;
  end_date: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TermStatistics {
  fee_structures_count: number;
  students_count: number;
  total_collected: number;
}

// ============================================================
// CLASS TYPES
// ============================================================

export interface SchoolClass {
  id: number;
  grade_id: number;
  grade_name?: string;
  name: string;
  class_teacher_id?: number;
  class_teacher_name?: string;
  capacity?: number;
  description?: string;
  student_count?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ClassStatistics {
  total_students: number;
  available_capacity: number;
  active_students: number;
}

// ============================================================
// FEE TYPES
// ============================================================

export interface FeeBreakdown {
  item_name: string;
  amount: number;
  description?: string;
}

export interface FeeStructure {
  id: number;
  school_id: number;
  grade_id: number;
  grade_name?: string;
  term_id: number;
  term_name?: string;
  total_amount: number;
  due_date?: string;
  breakdowns?: FeeBreakdown[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FeeStatistics {
  assigned: number;
  collected: number;
  pending: number;
}

// ============================================================
// PAYMENT TYPES
// ============================================================

export interface Payment {
  id: number;
  school_id: number;
  student_fee_id: number;
  student_name?: string;
  student_id?: number;
  fee_name?: string;
  amount: number;
  payment_method: PaymentMethodType;
  payment_status: PaymentStatus;
  reference?: string;
  notes?: string;
  receipt_id?: number;
  paid_at?: string;
  approved_at?: string;
  rejected_at?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

export type PaymentMethodType = 'mpesa' | 'bank_transfer' | 'bank_check' | 'cash' | 'card' | 'paypal';
export type PaymentStatus = 'pending' | 'approved' | 'completed' | 'rejected';

export interface SchoolPaymentMethod {
  id: number;
  school_id: number;
  method_type: PaymentMethodType;
  account_holder_name?: string;
  account_number?: string;
  bank_name?: string;
  branch_code?: string;
  mpesa_number?: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

// ============================================================
// RECEIPT TYPES
// ============================================================

export interface Receipt {
  id: number;
  school_id: number;
  payment_id: number;
  student_id: number;
  student_name?: string;
  receipt_number: string;
  amount: number;
  receipt_html: string;
  created_at: string;
  updated_at: string;
}

export interface ReceiptTemplate {
  id: number;
  school_id: number;
  name: string;
  template_html: string;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================================
// NOTIFICATION TYPES
// ============================================================

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: NotificationType;
  icon?: string;
  color?: string;
  is_read: boolean;
  related_model?: string;
  related_id?: number;
  created_at: string;
  updated_at: string;
}

export type NotificationType = 'payment' | 'fee' | 'student' | 'term' | 'system' | 'announcement';

// ============================================================
// DASHBOARD TYPES
// ============================================================

export interface DashboardStats {
  totalStudents: number;
  totalParents: number;
  totalCollected: number;
  totalPending: number;
  totalAssigned: number;
  collectionRate: number;
  collectionTrend?: number;
  overdueCount: number;
  overdueAmount: number;
  activeTerms?: number;
  recentPayments?: any[];
  pendingPayments?: any[];
  upcomingTerms?: any[];
}

export interface SchoolDashboardStats extends DashboardStats {
  totalSchools?: number;
}

export interface SuperAdminDashboardStats extends DashboardStats {
  totalSchools: number;
  recentSchools?: any[];
  topSchools?: any[];
  systemHealth?: {
    active_schools: number;
    inactive_schools: number;
    total_users: number;
    database_size: string;
  };
}

export interface ParentDashboardStats {
  totalFeesAssigned: number;
  totalFeesPaid: number;
  totalFeesBalance: number;
  paymentCompletionRate: number;
}

// ============================================================
// THEME TYPES
// ============================================================

export interface SchoolTheme {
  id: number;
  name: string;
  description?: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================================
// FORM TYPES
// ============================================================

export interface FormErrors {
  [key: string]: string | string[];
}

export interface FormState {
  processing: boolean;
  errors: FormErrors;
  wasSuccessful: boolean;
}

// ============================================================
// TABLE TYPES
// ============================================================

export interface TableColumn<T = any> {
  key: keyof T | string;
  label: string;
  render?: (value: any, row?: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  emptyMessage?: string;
  loading?: boolean;
  onRowClick?: (row: T) => void;
}

// ============================================================
// FILTER TYPES
// ============================================================

export interface FilterOption {
  value: string | number;
  label: string;
}

export interface Filter {
  [key: string]: string | number | boolean | null;
}

// ============================================================
// COMPONENT PROPS TYPES
// ============================================================

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'info';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  className?: string;
}

export interface InputProps {
  label?: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  helpText?: string;
}

export interface SelectProps {
  label?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: FilterOption[];
  error?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

export interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose?: () => void;
  title?: string;
}

export interface BadgeProps {
  label: string;
  variant?: 'success' | 'danger' | 'warning' | 'info' | 'default';
  size?: 'sm' | 'md' | 'lg';
}

export interface StatCardProps {
  label: string;
  value: string | number;
  trend?: 'up' | 'down';
  change?: number;
  backgroundColor?: string;
}

export interface PaginationProps {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
  onPageChange: (page: number) => void;
}

export interface ModalProps {
  isOpen: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// ============================================================
// UTILITY TYPES
// ============================================================

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;

export interface KeyValue {
  [key: string]: any;
}

export interface DateRange {
  start: string;
  end: string;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string;
  borderColor?: string;
  fill?: boolean;
}