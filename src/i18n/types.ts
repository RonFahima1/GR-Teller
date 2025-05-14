export type MessagePath = string;
export type MessageParams = Record<string, string | number>;

export interface Messages {
  common: {
    welcome: string;
    loading: string;
    error: string;
    success: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    create: string;
    search: string;
    filter: string;
    sort: string;
    export: string;
    import: string;
    print: string;
    close: string;
    back: string;
    next: string;
    finish: string;
    confirm: string;
    yes: string;
    no: string;
  };
  auth: {
    login: string;
    logout: string;
    register: string;
    forgotPassword: string;
    resetPassword: string;
    email: string;
    password: string;
    confirmPassword: string;
    rememberMe: string;
    loginSuccess: string;
    loginError: string;
    logoutSuccess: string;
  };
  // Add more message types as needed
} 