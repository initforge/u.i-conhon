/**
 * API Service - Connects frontend to backend
 * Replaces mockData with real API calls
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Pagination metadata returned by paginated endpoints
export interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
}


// Helper to get stored token
const getToken = () => localStorage.getItem('conhon_token');

// Helper for API requests
async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = getToken();

    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Network error' }));
        throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
}

// ============ AUTH ============

export async function login(phone: string, password: string) {
    return apiRequest<{ token: string; user: User }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ phone, password }),
    });
}

export async function register(data: {
    phone: string;
    password: string;
    name: string;
    zalo: string;
}) {
    return apiRequest<{ token: string; user: User }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function getCurrentUser() {
    return apiRequest<{ user: User }>('/auth/me');
}

// ============ USER PROFILE ============

export interface UpdateProfileData {
    name?: string;
    zalo?: string;
    bank_code?: string;
    bank_account?: string;
    bank_holder?: string;
}

export async function updateUserProfile(data: UpdateProfileData) {
    return apiRequest<{ user: User }>('/users/me', {
        method: 'PATCH',
        body: JSON.stringify(data),
    });
}

export async function completeUserTask(taskId: string) {
    return apiRequest<{ completed_tasks: string[]; message: string }>('/users/complete-task', {
        method: 'POST',
        body: JSON.stringify({ taskId }),
    });
}

// ============ SESSIONS ============

export async function getCurrentSession(thaiId: string) {
    return apiRequest<{ session: Session }>(`/sessions/current?thai_id=${thaiId}`);
}

export async function getSessionAnimals(sessionId: string) {
    return apiRequest<{ animals: SessionAnimal[] }>(`/sessions/${sessionId}/animals`);
}

export async function getSessionResults(options?: { thaiId?: string; date?: string; limit?: number }) {
    const params = new URLSearchParams();
    if (options?.thaiId) params.append('thai_id', options.thaiId);
    if (options?.date) params.append('date', options.date);
    if (options?.limit) params.append('limit', options.limit.toString());
    return apiRequest<{ results: SessionResult[]; count: number }>(`/sessions/results?${params}`);
}

// ============ CAU THAI ============

export async function getCauThai(options?: { thaiId?: string; year?: number; limit?: number }) {
    const params = new URLSearchParams();
    if (options?.thaiId) params.append('thai_id', options.thaiId);
    if (options?.year) params.append('year', options.year.toString());
    if (options?.limit) params.append('limit', options.limit.toString());
    return apiRequest<{ cauThais: CauThaiItem[]; count: number }>(`/cau-thai?${params}`);
}

export async function getTodayCauThai() {
    return apiRequest<{ cauThais: CauThaiItem[] }>('/cau-thai/today');
}

// ============ ORDERS ============

export async function createOrder(data: {
    session_id: string;
    items: Array<{ animal_order: number; quantity: number; unit_price: number }>;
}) {
    return apiRequest<{ order: Order }>('/orders', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function getMyOrders(options?: { thaiId?: string; status?: string; page?: number; limit?: number }) {
    const params = new URLSearchParams();
    if (options?.thaiId) params.append('thai_id', options.thaiId);
    if (options?.status) params.append('status', options.status);
    if (options?.page) params.append('page', String(options.page));
    if (options?.limit) params.append('limit', String(options.limit));
    return apiRequest<{ orders: Order[] } & PaginationMeta>(`/orders/me?${params}`);
}

export async function getOrderDetail(orderId: string) {
    return apiRequest<{ order: Order; items: OrderItem[] }>(`/orders/${orderId}`);
}

// ============ COMMUNITY ============

export async function getCommunityPosts(options?: { thaiId?: string; page?: number; limit?: number }) {
    const params = new URLSearchParams();
    if (options?.thaiId) params.append('thai_id', options.thaiId);
    if (options?.page) params.append('page', String(options.page));
    if (options?.limit) params.append('limit', String(options.limit));
    return apiRequest<{ posts: CommunityPost[] } & PaginationMeta>(`/community/posts?${params}`);
}

export async function likePost(postId: string) {
    return apiRequest<{ liked: boolean }>(`/community/posts/${postId}/like`, {
        method: 'POST',
    });
}

export async function addComment(postId: string, content: string) {
    return apiRequest<{ comment: Comment }>(`/community/posts/${postId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ content }),
    });
}

// ============ USER ============

export async function updateProfile(data: Partial<User>) {
    return apiRequest<{ user: User }>('/users/me', {
        method: 'PATCH',
        body: JSON.stringify(data),
    });
}

export async function completeTask(taskId: string) {
    return apiRequest<{ completed_tasks: string[] }>('/users/complete-task', {
        method: 'POST',
        body: JSON.stringify({ taskId }),
    });
}

// ============ SYSTEM ============

export async function getSystemStatus() {
    return apiRequest<{ master_switch: boolean; maintenance_message?: string }>(
        '/system-status'
    );
}

// ============ SWITCHES ============

export interface ThaiSwitches {
    master: boolean;
    'an-nhon': boolean;
    'nhon-phong': boolean;
    'hoai-nhon': boolean;
}

export async function getThaiSwitches(): Promise<ThaiSwitches> {
    return apiRequest<ThaiSwitches>('/sessions/switches');
}

export async function saveThaiSwitches(switches: Partial<ThaiSwitches>): Promise<{ success: boolean; switches: ThaiSwitches }> {
    return apiRequest('/sessions/switches', {
        method: 'PUT',
        body: JSON.stringify(switches)
    });
}

// ============ TYPES ============

export interface User {
    id: string;
    phone: string;
    name: string | null;
    zalo?: string;
    role: 'user' | 'admin';
    bank_code?: string;
    bank_account?: string;
    bank_holder?: string;
    completed_tasks: string[];
}

export interface Session {
    id: string;
    thai_id: string;
    session_type: 'morning' | 'afternoon' | 'evening';
    session_date: string;
    lunar_label?: string;
    status: 'scheduled' | 'open' | 'closed' | 'resulted';
    opens_at: string;
    closes_at: string;
    result_at: string;
    winning_animal?: number;
}

export interface SessionAnimal {
    animal_order: number;
    limit_amount: number;
    sold_amount: number;
    is_banned: boolean;
    ban_reason?: string;
    remaining: number;
}

export interface Order {
    id: string;
    session_id: string;
    user_id: string;
    total: number;
    status: 'pending' | 'paid' | 'won' | 'lost' | 'cancelled' | 'expired';
    payment_url?: string;
    payment_code?: string;
    created_at: string;
    paid_at?: string;
    thai_id?: string;
    session_type?: string;
    session_date?: string;
    lunar_label?: string;
    items?: OrderItem[];
}

export interface OrderItem {
    id: string;
    animal_order: number;
    animal_name: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
    amount?: number;
}

export interface CommunityPost {
    id: string;
    thai_id: string;
    youtube_id: string;
    title: string;
    content?: string;
    like_count: number;
    is_pinned: boolean;
    created_at: string;
}

export interface Comment {
    id: string;
    user_name: string;
    content: string;
    created_at: string;
}

// ============ ADMIN ============

export async function getAdminStats(thaiId?: string, sessionType?: string, date?: string) {
    const params = new URLSearchParams();
    if (thaiId) params.append('thai_id', thaiId);
    if (sessionType && sessionType !== 'all') params.append('session_type', sessionType);
    if (date) params.append('date', date);
    const queryString = params.toString();
    return apiRequest<AdminStats>(`/admin/stats${queryString ? `?${queryString}` : ''}`);
}

export interface AnimalPurchaseData {
    animal_order: number;
    total_qty: number;
    total_amount: number;
}

export async function getAdminAnimalStats(thaiId?: string, sessionType?: string, date?: string) {
    const params = new URLSearchParams();
    if (thaiId) params.append('thai_id', thaiId);
    if (sessionType && sessionType !== 'all') params.append('session_type', sessionType);
    if (date) params.append('date', date);
    const queryString = params.toString();
    return apiRequest<{ animals: AnimalPurchaseData[] }>(`/admin/stats/animals-all${queryString ? `?${queryString}` : ''}`);
}

export interface AnimalOrderDetail {
    order_id: string;
    user_name: string;
    user_phone: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
    status: string;
    session_type: string;
    session_date: string;
    created_at: string;
}

export async function getAdminAnimalOrders(animalOrder: number, thaiId?: string, sessionType?: string, date?: string) {
    const params = new URLSearchParams();
    params.append('animal_order', String(animalOrder));
    if (thaiId) params.append('thai_id', thaiId);
    if (sessionType && sessionType !== 'all') params.append('session_type', sessionType);
    if (date) params.append('date', date);
    return apiRequest<{ orders: AnimalOrderDetail[] }>(`/admin/stats/animal-orders?${params}`);
}

export async function getAdminOrders(filters?: {
    date?: string;
    thai_id?: string;
    session_type?: string;
    status?: string;
    page?: number;
    limit?: number;
}) {
    const params = new URLSearchParams();
    if (filters?.date) params.append('date', filters.date);
    if (filters?.thai_id) params.append('thai_id', filters.thai_id);
    if (filters?.session_type) params.append('session_type', filters.session_type);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.limit) params.append('limit', String(filters.limit));
    return apiRequest<{ orders: AdminOrder[]; total: number; page: number; limit: number; hasMore: boolean }>(`/admin/orders?${params}`);
}

export async function getAdminOrderDetail(orderId: string) {
    return apiRequest<{ order: AdminOrderDetail; items: AdminOrderItem[] }>(`/admin/orders/${orderId}`);
}

// Lấy session hiện tại kèm session_animals (sold_amount, is_banned, ban_reason)
export async function getAdminCurrentSession(thaiId: string) {
    return apiRequest<{ session: { id: string; thai_id: string; status: string; animals: Array<{ animal_order: number; limit_amount: number; sold_amount: number; is_banned: boolean; ban_reason: string | null }> } }>(`/admin/sessions/current/${thaiId}`);
}

// Cập nhật limit/ban cho 1 con vật trong session
export async function updateAdminSessionAnimal(data: { session_id: string; animal_order: number; limit_amount?: number; is_banned?: boolean; ban_reason?: string }) {
    return apiRequest<{ success: boolean }>('/admin/session-animals', {
        method: 'PATCH',
        body: JSON.stringify(data),
    });
}

export interface AdminUsersAggregate {
    total_users: number;
    users_with_orders: number;
    total_orders: number;
}

export async function getAdminUsers(options?: { search?: string; page?: number; limit?: number }) {
    const params = new URLSearchParams();
    if (options?.search) params.append('search', options.search);
    if (options?.page) params.append('page', String(options.page));
    if (options?.limit) params.append('limit', String(options.limit));
    return apiRequest<{ users: AdminUser[]; total: number; page: number; limit: number; hasMore: boolean; aggregate: AdminUsersAggregate }>(`/admin/users?${params}`);
}

export async function updateAdminUser(userId: string, data: Partial<AdminUser>) {
    return apiRequest<{ success: boolean }>(`/admin/users/${userId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    });
}

export async function deleteAdminUser(userId: string) {
    return apiRequest<{ success: boolean }>(`/admin/users/${userId}`, {
        method: 'DELETE',
    });
}

// ============ ADMIN CAU THAI ============

export interface AdminCauThai {
    id: string;
    thai_id: string;
    khung_id?: string;
    year: number;
    image_url: string;
    description?: string;
    is_active: boolean;
    created_at: string;
}

export async function getAdminCauThai(options?: { thai_id?: string; year?: number; limit?: number }) {
    const params = new URLSearchParams();
    if (options?.thai_id) params.append('thai_id', options.thai_id);
    if (options?.year) params.append('year', options.year.toString());
    if (options?.limit) params.append('limit', options.limit.toString());
    return apiRequest<{ cauThaiImages: AdminCauThai[] }>(`/admin/cau-thai?${params}`);
}

export async function createAdminCauThai(data: {
    thai_id: string;
    image_url: string;
    description?: string;
    khung_id?: string;
}) {
    return apiRequest<{ cauThai: AdminCauThai }>('/admin/cau-thai', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

// Upload cau thai image file to server, returns the public URL
export async function uploadCauThaiImage(file: File): Promise<{ imageUrl: string; filename: string }> {
    const token = getToken();
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE}/upload/cau-thai`, {
        method: 'POST',
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Upload failed' }));
        throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
}

export async function updateAdminCauThai(id: string, data: { is_active?: boolean; description?: string }) {
    return apiRequest<{ cauThai: AdminCauThai }>(`/admin/cau-thai/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    });
}

export async function deleteAdminCauThai(id: string) {
    return apiRequest<{ success: boolean }>(`/admin/cau-thai/${id}`, {
        method: 'DELETE',
    });
}

// ============ ADMIN SESSION RESULTS ============

export interface AdminSession {
    id: string;
    thai_id: string;
    session_type: string;
    session_date: string;
    status: string;
    winning_animal?: number;
    lunar_label?: string;
    opens_at: string;
    closes_at: string;
}

export async function getAdminSessions(options?: { thai_id?: string; date?: string; status?: string }) {
    const params = new URLSearchParams();
    if (options?.thai_id) params.append('thai_id', options.thai_id);
    if (options?.date) params.append('date', options.date);
    if (options?.status) params.append('status', options.status);
    return apiRequest<{ sessions: AdminSession[] }>(`/admin/sessions?${params}`);
}

export async function setSessionResult(sessionId: string, data: {
    winning_animal?: number;
    lunar_label?: string;
    is_holiday?: boolean;
}) {
    return apiRequest<{ success: boolean }>(`/admin/sessions/${sessionId}/result`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

// New simplified API for submitting lottery results
export async function submitLotteryResult(data: {
    thai_id: string;
    date: string;
    slot_label: string;
    winning_animal?: number;
    lunar_label?: string;
    is_holiday?: boolean;
}) {
    return apiRequest<{ success: boolean; session_id: string }>(`/admin/results`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

// ============ ADMIN TYPES ============

export interface AdminOrder {
    id: string;
    total: number;
    status: string;
    created_at: string;
    paid_at?: string;
    user_name: string;
    user_phone: string;
    thai_id: string;
    session_type: string;
    session_date: string;
}

export interface AdminOrderDetail extends AdminOrder {
    user_id: string;
    zalo: string;
    bank_code?: string;
    bank_account?: string;
    bank_holder?: string;
    lunar_label?: string;
}

export interface AdminOrderItem {
    id: string;
    animal_order: number;
    quantity: number;
    unit_price: number;
    subtotal: number;
}

export interface AdminUser {
    id: string;
    phone: string;
    name: string;
    zalo?: string;
    role: string;
    created_at: string;
    order_count: number;
    total_spent: number;
    bank_code?: string;
    bank_account?: string;
    bank_holder?: string;
}

export interface AdminStats {
    revenue_today: number;
    total_orders: number;
    orders_today: number;
    top_animals: Array<{ animal_order: number; total_qty: number; total_amount: number }>;
    bottom_animals: Array<{ animal_order: number; total_qty: number; total_amount: number }>;
}

// ============ SESSION RESULT TYPES ============

export interface SessionResult {
    id: string;
    thai_id: string;
    session_type: string;
    session_date: string;
    lunar_label?: string;
    winning_animal: number | null; // null when pending (draw_time not passed) or holiday
    pending?: boolean; // true when result entered but draw_time hasn't passed yet
    draw_time?: string;
    cau_thai?: string;
    result_at: string;
    result_image?: string;
}

// ============ CAU THAI TYPES ============

export interface CauThaiItem {
    id: string;
    thai_id: string;
    image_url: string;
    description?: string;
    created_at: string;
    is_active: boolean;
    khung_id?: string;
}

// ============ ADMIN CMS ============

export interface AdminCMSPost {
    id: string;
    thai_id: string;
    youtube_id: string;
    title: string;
    content?: string;
    like_count: number;
    is_pinned: boolean;
    is_approved: boolean;
    created_at: string;
    comments: AdminCMSComment[];
}

export interface AdminCMSComment {
    id: string;
    content: string;
    user_name: string;
    user_phone: string;
    is_banned: boolean;
    created_at: string;
}

export interface AdminCMSStats {
    videos: number;
    likes: number;
    comments: number;
    bannedComments: number;
}

export interface ProfitLossData {
    revenue: number;
    payout: number;
    winningAnimal?: number;
}

export interface AdminProfitLoss {
    date: string;
    thai_id: string;
    profitLoss: {
        sang?: ProfitLossData;
        trua?: ProfitLossData;
        chieu?: ProfitLossData;
        toi?: ProfitLossData;
    };
}

export async function getAdminCMSPosts(thaiId?: string) {
    const params = thaiId ? `?thai_id=${thaiId}` : '';
    return apiRequest<{ posts: AdminCMSPost[] }>(`/admin/community/posts${params}`);
}

export async function getAdminCMSStats(thaiId?: string) {
    const params = thaiId ? `?thai_id=${thaiId}` : '';
    return apiRequest<AdminCMSStats>(`/admin/community/stats${params}`);
}

export async function createAdminPost(data: {
    thai_id: string;
    youtube_url: string;
    title: string;
    content?: string;
    is_pinned?: boolean;
}) {
    return apiRequest<{ post: AdminCMSPost }>('/admin/community/posts', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function deleteAdminPost(postId: string) {
    return apiRequest<{ success: boolean }>(`/admin/community/posts/${postId}`, {
        method: 'DELETE',
    });
}

export async function toggleBanComment(commentId: string) {
    return apiRequest<{ is_banned: boolean; message: string }>(`/admin/community/comments/${commentId}/ban`, {
        method: 'PATCH',
    });
}

export async function deleteAdminComment(commentId: string) {
    return apiRequest<{ success: boolean }>(`/admin/community/comments/${commentId}`, {
        method: 'DELETE',
    });
}

export async function getAdminProfitLoss(thaiId?: string, date?: string) {
    const params = new URLSearchParams();
    if (thaiId) params.append('thai_id', thaiId);
    if (date) params.append('date', date);
    return apiRequest<AdminProfitLoss>(`/admin/profit-loss?${params}`);
}

export interface AdminYearlyProfitLoss {
    year: number;
    thai_id: string;
    profitLoss: {
        sang?: ProfitLossData;
        trua?: ProfitLossData;
        chieu?: ProfitLossData;
        toi?: ProfitLossData;
    };
}

export async function getAdminYearlyProfitLoss(thaiId?: string, year?: number) {
    const params = new URLSearchParams();
    if (thaiId) params.append('thai_id', thaiId);
    if (year) params.append('year', String(year));
    return apiRequest<AdminYearlyProfitLoss>(`/admin/profit-loss/yearly?${params}`);
}

// ============ THAI LIMITS ============

export type ThaiLimits = Record<string, number>;

export async function getThaiLimits() {
    return apiRequest<ThaiLimits>('/admin/thai-limits');
}

export async function saveThaiLimits(limits: ThaiLimits) {
    return apiRequest<{ success: boolean; limits: ThaiLimits }>('/admin/thai-limits', {
        method: 'PUT',
        body: JSON.stringify(limits),
    });
}

// ============ THAI SWITCHES (Admin) ============

/**
 * GET /admin/thai-switches - Admin API to get Thai switches
 */
export async function getAdminThaiSwitches() {
    return apiRequest<ThaiSwitches>('/sessions/switches');
}

/**
 * PUT /sessions/switches - Admin API to save Thai switches (broadcasts SSE)
 */
export async function saveAdminThaiSwitches(switches: Partial<ThaiSwitches>) {
    return apiRequest<{ success: boolean; switches: ThaiSwitches }>('/sessions/switches', {
        method: 'PUT',
        body: JSON.stringify(switches),
    });
}

// ============ BANNED USERS (Admin CMS) ============

export interface BannedUser {
    phone: string;
    name: string;
    banned_at: string;
}

export async function getBannedUsers() {
    return apiRequest<BannedUser[]>('/admin/community/banned-users');
}

export async function unbanUser(phone: string) {
    return apiRequest<{ success: boolean }>(`/admin/community/users/${phone}/unban`, {
        method: 'PATCH',
    });
}

// ============ LOTTERY RESULTS (Admin) ============

export interface LotteryResult {
    id: string;
    thai_id: string;
    session_type: string;
    session_date: string;
    winning_animal: number | null; // Can be null when session is holiday/off
    lunar_label?: string;
    status: string;
}

export async function getResultsHistory(params?: { thai_id?: string; year?: number; limit?: number }) {
    const query = new URLSearchParams();
    if (params?.thai_id) query.append('thai_id', params.thai_id);
    if (params?.year) query.append('year', params.year.toString());
    if (params?.limit) query.append('limit', params.limit.toString());

    const queryString = query.toString();
    return apiRequest<{ results: LotteryResult[] }>(`/admin/sessions/results${queryString ? `?${queryString}` : ''}`);
}

export async function deleteSessionResult(sessionId: string) {
    return apiRequest<{ success: boolean }>(`/admin/sessions/${sessionId}/result`, {
        method: 'DELETE',
    });
}
