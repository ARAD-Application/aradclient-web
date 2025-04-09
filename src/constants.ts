


export const BASE_URL = 'https://api.aradapp.dev/api';
// export const BASE_URL = 'http://localhost:8080/api';
// export const BASE_URL = 'http://localhost:1235/api';
// export const BASE_URL = 'http://192.168.1.118:8080/api';
// export const BASE_URL = 'http://10.0.0.48:8080/api';

export const OPERATION_URLS = {
    LOGIN: BASE_URL + '/auth/login',
    SIGNUP: BASE_URL + '/auth/signup',
    CHANGE_USER_DETAILS: BASE_URL + '/user/setdetails',
    ACCOUNT_DETAILS: BASE_URL + '/user/details',
    VERIFY_ACCOUNT_WITH_CODE: BASE_URL + '/auth/verify_account_with_code',
    RESEND_ACCOUNT_VERIFICATION_EMAIL: BASE_URL + '/auth/resend_account_verification_email',
    SEARCH_USER: BASE_URL + '/user/search',
    SEARCH_CPTCODE_BY_CODE: BASE_URL + '/cptcode/search_by_code',
    SEARCH_CPTCODE_BY_DESCRIPTION: BASE_URL + '/cptcode/search_by_description',
    GET_ALL_FEEDBACK: BASE_URL + '/feedback/get_all',
    CREATE_FEEDBACK: BASE_URL + '/feedback/create',
    SET_FEEDBACK_AS_READ: BASE_URL + '/feedback/mark_feedback_as_read',
    GET_ALL_ASSIGNED_LEARNING_MATERIALS: BASE_URL + '/learning_materials/get_all',
    ASSIGN_LEARNING_MATERIALS: BASE_URL + '/learning_materials/assign',
    SET_LEARNING_MATERIAL_AS_READ: BASE_URL + '/learning_materials/mark_learning_material_as_read',
}

export const JWT_EXPIRED_MESSAGE: string = 'Your authentication session has expired. Please login again.';

export const ACCOUNT_SUCCESSFULLY_VERIFIED_MESSAGE: string = 'Account successfully verified';

export enum AutoArchiveFrequency {
    NEVER = 'NEVER',
    WEEKLY = 'WEEKLY',
    MONTHLY = 'MONTHLY',
    EVERY_THREE_MONTHS = 'EVERY_THREE_MONTHS',
    EVERY_SIX_MONTHS = 'EVERY_SIX_MONTHS',
    YEARLY = 'YEARLY'
}

export default {};  // get rid of the "missing the required default export" warning
