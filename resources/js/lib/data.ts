// ============================================================
// COMPLETE TRANSLATIONS FILE
// ============================================================

// ============================================================
// NAVIGATION ITEMS
// ============================================================

export interface NavigationItem {
  label: string;
  href: string;
  icon?: string;
  children?: NavigationItem[];
}

export const navigationItems = {
  superAdmin: [
    {
      label: 'Dashboard',
      href: '/admin/dashboard',
      icon: '📊',
    },
    {
      label: 'Schools',
      href: '/admin/schools',
      icon: '🏫',
    },
    {
      label: 'Reports',
      href: '/admin/reports',
      icon: '📈',
    },
    {
      label: 'Settings',
      href: '/admin/settings',
      icon: '⚙️',
    },
    {
      label: 'Users',
      href: '/admin/users',
      icon: '👥',
    },
    {
      label: 'Logout',
      href: '/logout',
      icon: '🚪',
    },
  ],
  schoolAdmin: [
    {
      label: 'Dashboard',
      href: '/school/dashboard',
      icon: '📊',
    },
    {
      label: 'Students',
      href: '/school/students',
      icon: '👥',
    },
    {
      label: 'Grades',
      href: '/school/grades',
      icon: '📚',
    },
    {
      label: 'Terms',
      href: '/school/terms',
      icon: '📅',
    },
    {
      label: 'Fees',
      href: '/school/fee-structures',
      icon: '💰',
    },
    {
      label: 'Payments',
      href: '/school/payments',
      icon: '💳',
    },
    {
      label: 'Receipts',
      href: '/school/receipts',
      icon: '📄',
    },
    {
      label: 'Payment Methods',
      href: '/school/payment-methods',
      icon: '🏧',
    },
    {
      label: 'Receipt Templates',
      href: '/school/receipt-templates',
      icon: '📋',
    },
    {
      label: 'Settings',
      href: '/school/settings',
      icon: '⚙️',
    },
    {
      label: 'Logout',
      href: '/logout',
      icon: '🚪',
    },
  ],
  parent: [
    {
      label: 'Dashboard',
      href: '/parent/dashboard',
      icon: '📊',
    },
    {
      label: 'Children',
      href: '/parent/students',
      icon: '👨‍👧‍👦',
    },
    {
      label: 'Make Payment',
      href: '/parent/payments/create',
      icon: '💳',
    },
    {
      label: 'Receipts',
      href: '/parent/receipts',
      icon: '📄',
    },
    {
      label: 'Notifications',
      href: '/notifications',
      icon: '🔔',
    },
    {
      label: 'Logout',
      href: '/logout',
      icon: '🚪',
    },
  ],
};

export const translations = {
  // ============================================================
  // COMMON TRANSLATIONS
  // ============================================================
  common: {
    labels: {
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      address: 'Address',
      status: 'Status',
      actions: 'Actions',
      notes: 'Notes',
      description: 'Description',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      termsOfService: 'Terms of Service',
      privacyPolicy: 'Privacy Policy',
      quickActions: 'Quick Actions',
      whatNext: 'What Next?',
    },
    buttons: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      viewAll: 'View All',
      export: 'Export',
      import: 'Import',
      filter: 'Filter',
      search: 'Search',
      reset: 'Reset',
      submit: 'Submit',
      approve: 'Approve',
      reject: 'Reject',
      confirm: 'Confirm',
      back: 'Back',
      backToList: 'Back to List',
      backToDashboard: 'Back to Dashboard',
      next: 'Next',
      previous: 'Previous',
      active: 'Active',
      inactive: 'Inactive',
      all: 'All',
      preview: 'Preview',
      hidePreview: 'Hide Preview',
      logout: 'Logout',
    },
    messages: {
      created: 'Created successfully',
      updated: 'Updated successfully',
      deleted: 'Deleted successfully',
      error: 'An error occurred. Please try again.',
      success: 'Operation completed successfully',
      confirm: 'Are you sure? This action cannot be undone.',
      loading: 'Loading...',
      noData: 'No data available',
      confirmDelete: 'Are you sure you want to delete this?',
    },
  },

  // ============================================================
  // AUTHENTICATION TRANSLATIONS
  // ============================================================
  auth: {
    signIn: 'Sign In',
    signUp: 'Sign Up',
    createAccount: 'Create Account',
    welcomeBack: 'Welcome back to Feeyangu',
    joinFeeyangu: 'Join Feeyangu today',
    enterPassword: 'Enter your password',
    rememberMe: 'Remember me',
    forgotPassword: 'Forgot password?',
    haveAccount: 'Already have an account?',
    invalidCredentials: 'Invalid email or password',
    
    // Registration
    selectRole: 'Select your role',
    iAm: 'I am registering as',
    roleSchoolAdmin: 'School Admin',
    roleParent: 'Parent/Guardian',
    demoAccount: 'Demo Account',
    demoEmail: 'Email: admin@example.com',
    demoPassword: 'Password: password123',
    and: 'and',
    agreeTerms: 'I agree to the',
    passwordRequirements: 'Use uppercase, lowercase, numbers and special characters',
    
    // School Admin Benefits
    schoolAdminBenefits: 'School Admin Benefits',
    benefit1: 'Manage students and fees efficiently',
    benefit2: 'Track payments in real-time',
    benefit3: 'Generate detailed reports',
    
    // Parent Benefits
    parentBenefits: 'Parent Benefits',
    parentBenefit1: 'Monitor children\'s fees',
    parentBenefit2: 'Make secure payments online',
    parentBenefit3: 'Download receipts anytime',
    
    // Forgot Password
    resetPasswordSubtitle: 'We\'ll help you reset it',
    resetInstructions: 'Enter your email address and we\'ll send you a link to reset your password.',
    sendResetLink: 'Send Reset Link',
    checkEmail: 'Check your email',
    passwordResetSent: 'Password reset link sent',
    resetLinkSent: 'Reset link sent successfully! Check your email.',
    linkExpires: 'The reset link expires in 24 hours',
    step1: 'Click the link in your email',
    step2: 'Enter your new password',
    step3: 'Sign in with your new password',
    
    // Reset Password
    resetPassword: 'Reset Password',
    createNewPassword: 'Create a new password',
    newPassword: 'New Password',
    emailVerified: 'Email verified',
    passwordUpdateMessage: 'Your password has been successfully reset.',
    allDone: 'All done!',
    signInWithNewPassword: 'Sign In With New Password',
    
    // Reset Failed
    resetFailed: 'Password reset failed. Please try again.',
    registrationFailed: 'Registration failed. Please check your details.',
  },

  // ============================================================
  // DASHBOARD TRANSLATIONS
  // ============================================================
  dashboard: {
    title: 'Dashboard',
    welcome: 'Welcome',
    schoolOverview: 'School overview and management',
    trackChildrenFees: 'Track your children\'s school fees and make payments',
    paymentSummary: 'Payment Summary',
    myChildren: 'My Children',
    viewChildren: 'View Children',
    viewReceipts: 'View Receipts',
    manageStudents: 'Manage Students',
    manageFees: 'Manage Fees',
    viewPayments: 'View Payments',
    manageGrades: 'Manage Grades',
    manageTerms: 'Manage Terms',
    recentPayments: 'Recent Payments',
    pendingPayments: 'Pending Payments',
    recentSchools: 'Recent Schools',
    topPerformingSchools: 'Top Performing Schools',
    upcomingTerms: 'Upcoming Terms',
    performanceSummary: 'Performance Summary',
    performanceMetrics: 'Performance Metrics',
    alerts: 'Alerts',
    chartPlaceholder: 'Chart will display here',
    superAdminDashboard: 'Super Admin Dashboard',
    platformOverview: 'Platform overview and management',
    collectionTrend: 'Collection Trend (Last 12 Months)',
    
    // Metrics
    metrics: {
      totalSchools: 'Total Schools',
      totalStudents: 'Total Students',
      totalParents: 'Total Parents',
      totalFees: 'Total Fees',
      totalFeesAssigned: 'Total Fees Assigned',
      totalFeesCollected: 'Total Fees Collected',
      totalFeesPending: 'Total Fees Pending',
      collectionRate: 'Collection Rate',
      overdueCount: 'Overdue Payments',
      overdue: 'Overdue',
      pending: 'Pending',
    },
    
    // System Health
    systemHealth: 'System Health',
    activeSchools: 'Active Schools',
    inactiveSchools: 'Inactive Schools',
    totalUsers: 'Total Users',
    databaseSize: 'Database Size',
    
    // Performance
    avgStudentsPerSchool: 'Avg Students per School',
    avgParentsPerSchool: 'Avg Parents per School',
    avgFeesPerStudent: 'Avg Fees per Student',
    avgCollectionPerStudent: 'Avg Collection per Student',
    avgCollectionRate: 'Average Collection Rate',
    revenue: 'Total Revenue',
    overdueAmount: 'Overdue Amount',
    
    // Alerts
    overduePayments: 'Overdue Payments',
    overdueCount: 'overdue payments',
    lowSchoolCount: 'Low School Count',
    considerMarketing: 'Consider marketing to increase adoptions',
    lowCollectionRate: 'Low Collection Rate',
    improveCollection: 'Focus on improving fee collection',
    
    // Subscription
    subscription: 'Subscription',
    createSchool: 'Create School',
    manageSchools: 'Manage Schools',
    systemSettings: 'System Settings',
    viewReports: 'View Reports',
    noChildren: 'No children assigned',
    noPayments: 'No payments yet',
    noActivity: 'No recent activity',
    allCaughtUp: 'You\'re all caught up!',
    paymentInstructions: 'Payment Instructions',
    instruction1: 'Review your pending fees',
    instruction2: 'Select payment method',
    instruction3: 'Complete the transaction',
    instruction4: 'Download your receipt',
    greatJob: 'Great Job!',
    noNewNotifications: 'You have no new notifications',
  },

  // ============================================================
  // SCHOOLS TRANSLATIONS
  // ============================================================
  schools: {
    singular: 'School',
    list: 'Schools',
    create: 'Create School',
    edit: 'Edit School',
    show: 'School Details',
    delete: 'Delete School',
    name: 'School Name',
    email: 'Email Address',
    phone: 'Phone Number',
    address: 'Address',
    status: 'Status',
    owner: 'School Admin',
    ownerName: 'Admin Name',
    ownerEmail: 'Admin Email',
    ownerPhone: 'Admin Phone',
    ownerPassword: 'Admin Password',
    general: 'General Information',
    schoolInformation: 'School Information',
    contactInformation: 'Contact Information',
    adminAccount: 'Admin Account',
    customization: 'Customization',
    selectTheme: 'Select Theme',
    subscription: 'Subscription Status',
    subscriptionStatus: 'Subscription & Status',
    setupInfo: 'Setup Information',
    setupMessage: 'After creation, the school admin will receive a welcome email with login credentials.',
    noSchools: 'No schools found',
    confirmDelete: 'Delete this school?',
    financialSummary: 'Financial Summary',
    recentStudents: 'Recent Students',
    totalSchools: 'Total Schools',
    activeSchools: 'Active Schools',
  },

  // ============================================================
  // STUDENTS TRANSLATIONS
  // ============================================================
  students: {
    singular: 'Student',
    list: 'Students',
    create: 'Add Student',
    edit: 'Edit Student',
    show: 'Student Details',
    delete: 'Delete Student',
    fullName: 'Full Name',
    firstName: 'First Name',
    lastName: 'Last Name',
    admissionNo: 'Admission Number',
    email: 'Email Address',
    phone: 'Phone Number',
    dateOfBirth: 'Date of Birth',
    grade: 'Grade',
    status: 'Status',
    parent: 'Parent/Guardian',
    fees: 'Fees',
    payments: 'Payments',
    totalFeesDue: 'Total Fees Due',
    totalChildren: 'Total Children',
    activeChildren: 'Active Children',
    grades: 'Grades',
    myChildren: 'My Children',
    childrenDescription: 'View and manage your children\'s information',
    noStudents: 'No students found',
    confirmDelete: 'Delete this student?',
    recentStudents: 'Recent Students',
    paymentInstructions: 'Payment Instructions',
    paymentMessage: 'Your child has outstanding fees. Please make a payment to avoid late penalties.',
  },

  // ============================================================
  // GRADES TRANSLATIONS
  // ============================================================
  grades: {
    singular: 'Grade',
    list: 'Grades',
    create: 'Create Grade',
    edit: 'Edit Grade',
    show: 'Grade Details',
    delete: 'Delete Grade',
    name: 'Grade Name',
    code: 'Grade Code',
    level: 'Level',
    description: 'Description',
    status: 'Status',
    noGrades: 'No grades found',
    confirmDelete: 'Delete this grade?',
  },

  // ============================================================
  // TERMS TRANSLATIONS
  // ============================================================
  terms: {
    singular: 'Term',
    list: 'Terms',
    create: 'Create Term',
    edit: 'Edit Term',
    show: 'Term Details',
    delete: 'Delete Term',
    name: 'Term Name',
    year: 'Year',
    termNumber: 'Term Number',
    startDate: 'Start Date',
    endDate: 'End Date',
    description: 'Description',
    status: 'Status',
    noTerms: 'No terms found',
    confirmDelete: 'Delete this term?',
  },

  // ============================================================
  // CLASSES TRANSLATIONS
  // ============================================================
  classes: {
    singular: 'Class',
    list: 'Classes',
    create: 'Create Class',
    edit: 'Edit Class',
    show: 'Class Details',
    delete: 'Delete Class',
    name: 'Class Name',
    teacher: 'Class Teacher',
    capacity: 'Class Capacity',
    description: 'Description',
    status: 'Status',
    noClasses: 'No classes found',
    classDetails: 'Class details and student roster',
    confirmDelete: 'Delete this class?',
  },

  // ============================================================
  // FEES TRANSLATIONS
  // ============================================================
  fees: {
    singular: 'Fee',
    list: 'Fees',
    create: 'Create Fee Structure',
    edit: 'Edit Fee Structure',
    show: 'Fee Details',
    delete: 'Delete Fee Structure',
    name: 'Fee Name',
    grade: 'Grade',
    term: 'Term',
    totalAmount: 'Total Amount',
    dueDate: 'Due Date',
    status: 'Status',
    noFees: 'No fees found',
    description: 'Description',
    breakdowns: 'Fee Breakdowns',
    itemName: 'Item Name',
    addBreakdown: 'Add Item',
    removeBreakdown: 'Remove',
    confirmDelete: 'Delete this fee structure?',
  },

  // ============================================================
  // PAYMENTS TRANSLATIONS
  // ============================================================
  payments: {
    singular: 'Payment',
    list: 'Payments',
    create: 'Record Payment',
    show: 'Payment Details',
    amount: 'Amount',
    method: 'Payment Method',
    status: 'Payment Status',
    reference: 'Payment Reference',
    fee: 'Fee',
    noPayments: 'No payments found',
    makePay: 'Make Payment',
    pay: 'Pay',
    confirmation: 'Payment Confirmation',
    success: 'Payment Submitted',
    submittedMessage: 'Your payment has been submitted successfully. The school will verify and confirm it shortly.',
    fillPaymentDetails: 'Fill in the payment details below',
    selectStudent: 'Select Student',
    selectFee: 'Select Fee',
    feeSummary: 'Fee Summary',
    paymentDetails: 'Payment Details',
    referenceInfo: 'Payment Reference',
    referencePlaceholder: 'e.g., M-Pesa code or transaction ID',
    referenceHelp: 'Enter the payment reference from your payment method',
    additionalInfo: 'Additional Information',
    confirmationMessage: 'Your payment will be processed shortly. A confirmation will be sent to your email.',
    securityNotice: 'Security & Privacy',
    securityMessage: 'All payments are secure and encrypted. Your financial information is never stored on our servers.',
    whatNext: 'What happens next?',
    nextStep1: 'The school will verify your payment',
    nextStep2: 'You\'ll receive a confirmation email',
    nextStep3: 'Your receipt will be available for download',
    nextStep4: 'Fees will be updated in the system',
    importantNotice: 'Important Notice',
    importantMessage: 'Please keep your payment reference safe. You may need it for support inquiries.',
    haveQuestions: 'Have Questions?',
    contactSupport: 'If you have any questions about your payment, please contact the school support team.',
    email: 'Email',
    phone: 'Phone',
    viewReceipts: 'View Receipts',
    viewFees: 'View Fees',
  },

  // ============================================================
  // RECEIPTS TRANSLATIONS
  // ============================================================
  receipts: {
    singular: 'Receipt',
    list: 'Receipts',
    show: 'Receipt',
    receiptNo: 'Receipt Number',
    amount: 'Amount',
    date: 'Date',
    download: 'Download',
    print: 'Print',
    noReceipts: 'No receipts found',
    receiptDescription: 'View and download your payment receipts',
    receiptInfo: 'About Your Receipts',
    receiptMessage: 'Keep your receipts for record keeping. You can download them anytime for your records.',
    createdDate: 'Created Date',
  },

  // ============================================================
  // RECEIPT TEMPLATES TRANSLATIONS
  // ============================================================
  receiptTemplates: {
    singular: 'Template',
    list: 'Receipt Templates',
    create: 'Create Template',
    edit: 'Edit Template',
    templateName: 'Template Name',
    templateHTML: 'Template HTML',
    setAsDefault: 'Set as Default',
    createDescription: 'Customize your receipt template with your school branding',
    templateInfo: 'Template Information',
    noTemplates: 'No templates created yet',
    availableVariables: 'Available Variables',
    createDefault: 'Create Default Template',
    preview: 'Preview',
  },

  // ============================================================
  // PAYMENT METHODS TRANSLATIONS
  // ============================================================
  paymentMethods: {
    singular: 'Method',
    list: 'Payment Methods',
    create: 'Add Payment Method',
    edit: 'Edit Payment Method',
    methodType: 'Payment Method Type',
    mpesaNumber: 'M-Pesa Number',
    bankName: 'Bank Name',
    accountHolderName: 'Account Holder Name',
    accountNumber: 'Account Number',
    status: 'Status',
    noMethods: 'No payment methods configured',
  },

  // ============================================================
  // NOTIFICATIONS TRANSLATIONS
  // ============================================================
  notifications: {
    notifications: 'Notifications',
    unread: 'Unread',
    youHave: 'You have',
    unreadNotifications: 'unread notifications',
    markAllAsRead: 'Mark All as Read',
    noNotifications: 'No notifications',
    allCaughtUp: 'You\'re all caught up!',
    new: 'New',
  },

  // ============================================================
  // SETTINGS TRANSLATIONS
  // ============================================================
  settings: {
    settings: 'Settings',
    schoolSettings: 'School Settings',
    generalSettings: 'General Settings',
    appearanceSettings: 'Appearance Settings',
    supportSettings: 'Support Settings',
    legalSettings: 'Legal Settings',
    paymentSettings: 'Payment Settings',
    features: 'Features',
    maintenance: 'Maintenance',
    settingsDescription: 'Manage system settings and configurations',
    configureSchoolSettings: 'Configure school settings',
    appName: 'Application Name',
    appUrl: 'Application URL',
    appUrlHelp: 'The public URL of your application',
    appDescription: 'Application Description',
    defaultCurrency: 'Default Currency',
    timezone: 'Timezone',
    language: 'Language',
    supportEmail: 'Support Email',
    supportPhone: 'Support Phone',
    termsUrl: 'Terms of Service URL',
    termsUrlHelp: 'Link to your terms of service page',
    privacyUrl: 'Privacy Policy URL',
    privacyUrlHelp: 'Link to your privacy policy page',
    logoUrl: 'Logo URL',
    faviconUrl: 'Favicon URL',
    schoolMotto: 'School Motto',
    schoolMottoHelp: 'The motto or tagline of your school',
    receiptFooter: 'Receipt Footer Text',
    receiptPrefix: 'Receipt Number Prefix',
    receiptPrefixHelp: 'e.g., RCP will generate RCP-001, RCP-002, etc.',
    primaryColor: 'Primary Color',
    secondaryColor: 'Secondary Color',
    colorPreview: 'These colors will be used throughout the system',
    enableParentPortal: 'Enable Parent Portal',
    parentPortalHelp: 'Allow parents to access the system',
    enableStudentPortal: 'Enable Student Portal',
    studentPortalHelp: 'Allow students to view their information',
    requireFeeApproval: 'Require Fee Approval',
    requireFeeApprovalHelp: 'Payments must be approved before confirmation',
    defaultPaymentMethod: 'Default Payment Method',
    maxUploadSize: 'Max Upload Size (MB)',
    maxUploadSizeHelp: 'Maximum file size for document uploads',
    maintenanceMode: 'Maintenance Mode',
    maintenanceModeDescription: 'Enable maintenance mode to prevent users from accessing the system.',
    enableMaintenanceMode: 'Enable Maintenance Mode',
    supportContactInfo: 'This email will be displayed in the support section',
    note: 'Note',
    settingsNote: 'Changes to settings may affect the entire system. Please review carefully before saving.',
    settingsChangeNote: 'Changes to these settings will be applied immediately.',
  },

  // ============================================================
  // ERROR MESSAGES TRANSLATIONS
  // ============================================================
  errors: {
    required: 'This field is required',
    email: 'Please enter a valid email address',
    minLength: 'Must be at least {min} characters',
    maxLength: 'Must not exceed {max} characters',
    passwordMismatch: 'Passwords do not match',
    invalidURL: 'Please enter a valid URL',
    serverError: 'Server error. Please try again later.',
    notFound: 'The requested resource was not found',
    unauthorized: 'You are not authorized to perform this action',
    forbidden: 'Access denied',
  },

  // ============================================================
  // VALIDATION MESSAGES TRANSLATIONS
  // ============================================================
  validation: {
    passwordRequirements: 'Password must contain uppercase, lowercase, numbers and special characters',
    confirmPassword: 'Passwords must match',
    agreeTerms: 'You must agree to the terms of service',
  },
};

// Export individual sections for convenience
export const authTranslations = translations.auth;
export const commonTranslations = translations.common;
export const dashboardTranslations = translations.dashboard;
export const schoolsTranslations = translations.schools;
export const studentsTranslations = translations.students;
export const feesTranslations = translations.fees;
export const paymentsTranslations = translations.payments;
export const receiptsTranslations = translations.receipts;
export const settingsTranslations = translations.settings;